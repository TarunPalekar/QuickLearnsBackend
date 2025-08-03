const mongoose = require("mongoose");
const {otpTemplate}=require("../mail/template/emailVerificationEmail")
const mailsender = require("../utils/mailsender");
const otpSchema =  mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 1000*60*5,
    }

})
async function sendVerificationEamil(email, otp ){
    try{
        const mailResponse=await mailsender(email,"verification email from QuickCodees",  otpTemplate(otp)  );
      
    }
    catch(error){
        console.log("Error occured at sendemailverification", error);
    }

}

otpSchema.pre("save", async function (next) {
    await sendVerificationEamil(this.email, this.otp);
    console.log("sendverififcationmeamern pre function se")
    next();
})
module.exports = mongoose.model("OTP", otpSchema)