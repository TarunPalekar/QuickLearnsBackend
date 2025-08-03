const mongoose=require("mongoose")
require("dotenv").config();

exports.dbConnect=async ()=>{
    try{
        const response= await mongoose.connect(process.env.MONGODB_URL,{});
        console.log("connection to database established successfully");
       


    }
    catch(error){
        console.log("error occured in database connection", error)
    }
   
}
