const nodemailer=require("nodemailer")
require("dotenv").config();
const {courseEnrollementEmail}=require("../mail/template/courseEnrollmentEmail")
const {emailVerificationEmail}=require("../mail/template/emailVerificationEmail")
const {passwordUpdate}=require("../mail/template/passwordUpdate")

const mailsender=async(email, title, body)=>{
    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
        console.log("ojnveinereiv")

        let info=await transporter.sendMail({
            from:'QuickCodees.com',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })

       
        return info;

    }
    catch(error){
        console.log("error occured in the mailsender utils", error)
    }
}
module.exports=mailsender;