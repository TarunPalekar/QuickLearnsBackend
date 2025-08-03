const mongoose = require("mongoose")

const courseSchema =  mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
        required: true,
    },
    courseDiscription: {
        type: String,
        trim: true,
        required: true,

    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User",
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price: {
        type: Number,
    },
    thumbnail: {
        type: String,
        required: true,
    },

    tag: {
        type:[String],
        ref: "Tag",
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft" ,"Published"],
    },
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
        default:0,
    }],

})
module.exports=mongoose.model("Course", courseSchema)