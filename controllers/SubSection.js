const Section=require("../models/Section")
const SubSection=require("../models/SubSection")
const Course=require("../models/Course")
const {fileUploadertoCloudinary}=require("../utils/fileUploader")
const { setMaxListeners } = require("nodemailer/lib/xoauth2")

exports.createSubSection=async(req, res)=>{
  try{
      const{title, description, sectionId}=req.body
    const video=req.files.video
    console.log(title, description, sectionId, video)

     if (!sectionId || !title || !description||!video) {
        return res
          .status(404)
          .json({ success: false, message: "All Fields are Required" })
      }
      const uploadDetails=await fileUploadertoCloudinary(video, process.env.FOLDER_NAME)

      if(!uploadDetails){
        return res.status(401).json({
            success:false,
            message:"unable to upload to cloudinary",
        })
      }
      const SubSectionDetails=await SubSection.create({
        title:title,
        description:description,
        timeDuration:`${uploadDetails.duration}`,
        videoUrl:`${uploadDetails.secure_url}`,
      })

      const updateSection=await Section.findByIdAndUpdate({_id:sectionId},{
        $push :{
            subSection:SubSectionDetails._id,
        }

       
      },{new:true}).populate("subSection")

      res.status(200).json({
        success:true,
        message:"subSection Created Successfully",
        data:updateSection
       
      })
  }
  catch(error){
    console.log(error)
     return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" })

    
  }

}

exports.updateSubSection=async(req, res)=>{
   try{
     const {title, description, subSectionId}=req.body
    const subSection=await SubSection.findOne({_id:subSectionId})
    if(!subSection){
        return res.status(401).json({
            success:false,
            message:"Section not found",
        })
    }
    const video=req.files.video;
    const uploadDetails=await fileUploadertoCloudinary(video, process.env.FOLDER_NAME)

    const updatedSection=await SubSection.findByIdAndUpdate({_id:subSection._id},{
        title:title,
        description:description,
        timeDuration:`${uploadDetails.duration}`,
        videoUrl:`${uploadDetails.secure_url},`

    })
    res.status(200).json({
        success:true,
        message:"subsection Updated Successfully"
    })
   }
   catch(error){
    console.log(error)
   }

}

exports.deleteSubSection=async(req, res)=>{
   try{
     const {subSectionId, sectionId}=req.body 
    if(!subSectionId||!sectionId){
        return res.status(401).json({
            success:false,
            message:"all fields are required",
        })
    }
    await Section.findByIdAndUpdate({_id:sectionId},{
        $pull:{
            subSection:subSectionId,
        }
    })

    const deletedSubSection=await subSection.findByIdAndDelete({_id:subSectionId})
    if(!deletedSubSection){
        return res.status(404).json({
            success:false,
            message:"document not found",
        })
    }
    res.status(200).json({
        success:true,
        message:"subSection Deleted Successfully",
    })


    
   }
   catch(error){
    console.log(error)
   }

}