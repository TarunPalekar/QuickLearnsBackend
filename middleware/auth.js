const jwt=require("jsonwebtoken")
const User=require("../models/User")
require("dotenv").config();

//auth middleware
exports.auth=async(req, res, next)=>{
    try{
        const token=req.cookies.token||req.body?.token||req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found",
            })
        }
        //verify token
        try{
            const decode= jwt.verify(token, process.env.JWT_SECRET);
             req.user = decode;
             console.log(decode,"auth middleware me hai")



        }catch(error){
        console.log(error)
        }
        next();

    }
    catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}
exports.isStudent=async(req, res, next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This route is protected only for student",
            })
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error at isstudent middleware",
        })
    }
}
exports.isInstructor=async(req, res, next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            console.log("intructor hai yha tak")
            return res.status(401).json({
                success:false,
                message:"This route is protected only for Instructor",
            })
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error at isInstructor middleware",
        })
    }
}
exports.isAdmin=async(req, res, next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This route is protected only for Admin",
            })
        }
        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error at IsAdmin middleware",
        })
    }
}