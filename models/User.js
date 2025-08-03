const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
    },
    email:
    {
        type:String,
        required:true,
        
    },
    password:
    {
        type:String,
        required:true,
      
    },
    contactnumber:{
        type:String,
    },
    token :{
        type:String,
    },
    resetPasswordExpires: {
        type:Date,
    },
    accountType:{
        type:String,
        required:true,
        emum:["Admin", "Student", "Instructor"],
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    course:[{
         type:mongoose.Schema.Types.ObjectId,
         
         ref:"Course",
    }
       
    ],
    active:{
        type:Boolean,
        default:true,
    },
    approved:{
        type:Boolean,
        default:true,
    },
    image:{
        type:String,
        required:true,
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
       
        ref:"CourseProgress",
    }],
    

},{timestamps:true},)
module.exports=mongoose.model("User", userSchema);