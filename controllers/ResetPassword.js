const User = require("../models/User")
const  mailSender  = require("../utils/mailsender")
const {passwordUpdated}=require("../mail/template/passwordUpdate")
const bcrypt=require("bcrypt");
const mailsender = require("../utils/mailsender");

require('dotenv').config();

exports.resetPasswordtoken = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(401).json({
                message: "email is required",
                success: false,
            })
        }
        const userDetails = await User.findOne({ email });
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: "User not found Please try again ",

            })
        }
        

        const token = crypto.randomUUID();
        const updatedUser = await User.findOneAndUpdate({ email }, {
            token: token,
            resetPasswordExpires: Date.now() + 1000 * 60 * 5,

        }, { new: true });
       
       
        const url = `http://localhost:3000/update-password/${token}`

        const mailInfo = await mailSender(email, "reset your password", `Reset your password by this link ${url}`);
        res.status(200).json({
            success: true,
            message: "Password reset Successfully",
        })
    }
    catch (error) {
        console.log(error, "this error is occured at reset password token controller");
    }



}

exports.resetPassword = async (req, res) => {
    try{
        const { password, confirmPassword, token } = req.body;
    if (password !== confirmPassword) {
        return res.status(401)
            .json({
                Success: false,
                message: "password and confirm password is not same",
            })
    }
    const userDetails=await User.findOne({token});
     if(!userDetails) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }
      
        //token time check 
        if( userDetails.resetPasswordExpires < Date.now()  ) {
                return res.json({
                    success:false,
                    message:'Token is expired, please regenerate your token',
                });
        }

        const hashedPassword=await bcrypt.hash(password, 10)
        const updatedUser=await User.findOneAndUpdate({email:userDetails.email},{
            password:hashedPassword,
        },{new:true})
        const email=updatedUser.email;
        const name=updatedUser.firstname;
        const secondmail=await mailsender(email, "password updated successfully", passwordUpdated(email,name))
      
         return res.status(200).json({
            success:true,
            message:'Password reset successful',
        });
    }
catch(error){
    console.log(error);
}


}