const express=require("express")
const router=express.Router();

const{
    login,
    signUp,
    sendOtp,
    changePassword
}=require("../controllers/Auth")

const {
    resetPassword,
    resetPasswordtoken
}=require("../controllers/ResetPassword")

const {auth}=require("../middleware/auth")


router.post("/login",login);
router.post("/signup", signUp);
router.post("/sendotp",sendOtp);
router.post("/changepassword",auth, changePassword);

//reset password

router.post("/reset-password-token", resetPasswordtoken);
router.post("/reset-password", resetPassword)
module.exports=router;

