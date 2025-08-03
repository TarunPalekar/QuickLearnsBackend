const Section=require("../models/Section")
const Course=require("../models/Course")

exports.createSection=async(req, res)=>{
    try{
        const{sectionName, courseId}=req.body
        if(!sectionName||!courseId){
            return res.status(401).json({
                success:false,
                message:"section is required",
            })
        }
        const newSection=await Section.create({
            sectionName:sectionName
        })
        const updateCourse=await Course.findByIdAndUpdate({_id:courseId},{ $push:{
            courseContent:newSection._id,

            }
        },{new:true}
           
        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }

        }).exec();

        res.status(200).json({
            success:true,
            message:"Section Created",
            updateCourse,
          
        })

        


    }
    catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

exports.updateSection=async(req, res)=>{
 try{
       const {sectionName, sectionId}=req.body
    if(!sectionId||!sectionName){
        return res.status(401).json({
            success:false,
            message:"all Fields are required",
        })
    }
    const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},{
        sectionName,
    },{new:true});
    res.status(200).json({
        success:true,
        message:"Section Updated SuccessFully",

    })
 }
 catch(error){
    console.log(error)
    res.status(500).json({
        success:false,
        message:"internal Server Error",
    })
 }
}

exports.deleteSection=async(req, res)=>{
   try{
     const{sectionId, courseId}=req.body
    if(!sectionId){
        return res.status(401).json({
            success:false,
            message:"all fields are required",
        })
 }
 await Course.findByIdAndUpdate({_id:courseId},{
    $pull:{courseContent:sectionId},
 })
 await Section.findByIdAndDelete({_id:sectionId});
 res.status(200).json({
    success:true,
    message:"section deleted Successfully",
 })
   }
   catch(error){
    return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        })

   }
}