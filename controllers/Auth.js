const User = require("../models/User")
const Profile = require("../models/Profile")
const otpGenerator = require("otp-generator")
const OTP = require("../models/OTP")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailsender=require("../utils/mailsender")
const {passwordUpdated}=require("../mail/template/passwordUpdate")
require("dotenv").config();



exports.sendOtp = async (req, res) => {
    //sabse pehele email nikalo
    //email ko validate karo
    //generate otp
    //cheack unique otp
    //otp ko db me save karo

    try {
        const { email } = req.body;
        console.log(email)
    
        const userDetails = await User.findOne({email} );
      
         if (userDetails) {
            return res.status(400).json({
                success: false,
                message: "user Already exists",
            })


        }
       
        var Otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
      
       
        const otpResult = await OTP.create({
            email: email,
            otp: Otp,
        })
     

        res.status(200).json({
            success: true,
            message: "Otp sent successfully",
            Otp,

        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error at otp"
        })
    }
}

exports.signUp = async (req, res) => {
    //data ko body me se nikalo
    //data ko validate karo
    //email ko validate karo
    //password aur confrirm password ko match karo
    //password ko hash karo
    //recent otp ko db me se nikalo
    //otp ko validate karo
    //db me entry create karo
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            confirmPassword,
            otp,
            accountType,
            

        } = req.body;
        console.log(req.body)
        if (!firstname || !lastname || !email || !password || !confirmPassword ) {
            return res.status(401).json({
                success: false,
                message: "All fields are required",
            })
        }

        const checkUser = await User.findOne({ email });
        console.log("tyuijkl;",checkUser)
        // if (checkUser!==null) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "User already exists",

        //     })
        // }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                mesage: "Password and confirm password is not same",
            })

        }
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        
        if (recentOtp===0) {
            return res.status(401).json({
                success: false,
                message: "something went wrong",
            })
        }
        
        else if (otp !== recentOtp.otp) {
            return res.status(401).json({
                success: false,
                message: "Invalid Otp",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const profileDetail = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber:null

        })
console.log(profileDetail,"xdfgccchhcg")

        const userDetails = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            contactnumber: null,
            password: hashedPassword,
            accountType: accountType,
            additionalDetails: profileDetail._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`,


        })

        res.status(200).json({
            success: true,
            message: "User registered Successfully",
            userDetails,
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }

}

exports.login = async (req, res) => {
    //email aur password body me se nikal lo
    //email aur password ko validate kar lo
    //password ko compare karo
    //make payload
    //create token with payload jwt secret object
    // insert token in userdetails
    //undefine pass
    //return cookies and status with token user and message
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "Both Fields are required",
            })

        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not registered"
            })
        }

        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const Token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })
            user.token = Token;
            user.password = undefined

            res.cookie("token", Token, {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }).json({
                success: true,
                message: "user Logged In",
                user,
                token:Token,

            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            })
        }

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }


}

exports.changePassword=async(req, res)=>{

    //get data from req body
    const {email, oldPassword, password, confirmPassword}=req.body;
    const userDetails=await User.findOne({email});
     console.log(userDetails)
    if(!userDetails){
        return res.status(401).json({
            success:false,
            message:"User Not found",
        })

    }
   
    if(!bcrypt.compare(oldPassword, userDetails.password)){
        return res.status(402).json({
            success:false,
            message:"Incorrect Password",
        })


    }
    if(oldPassword===password){
     return res.status(401).json({
        success:false,
        message:"Old and new password should not same",
     })
    }
    if(password!==confirmPassword){
        return res.status(401).json({
            success:false,
            message:"both password are not same",
        })
    }
    //get oldPassword, newPassword, confirmNewPassowrd
    //validation
    const hashedPassword=await bcrypt.hash(password, 10);
    const updatedUser=await User.findOneAndUpdate({email}, {
        password:hashedPassword,
    }, {new:true});
    

    const mailInfo=await mailsender(email, "Your password is changed",passwordUpdated(email, updatedUser.firstname) )
    res.status(200).json({
        success:true,
        message:"password changed successfully",
        mailInfo,
    })


    //update pwd in DB
    //send mail - Password updated
    //return response

} 