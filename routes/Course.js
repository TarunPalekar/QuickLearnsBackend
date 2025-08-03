const express=require("express")
const router=express.Router();

const{
    createCourse,
    getAllCourses,
    getCourseDetails,
    editCourse,
    getInstructorCourses,
    getFullCourseDetails


}=require("../controllers/Course")
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")


// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/update-section", auth, isInstructor, updateSection)
// Delete a Section
router.post("/delete-section", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/update-subsection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/delete-subsection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section

router.post("/addSubSection", auth, isInstructor, createSubSection)
router.post("/editCourse", auth, isInstructor, editCourse)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)


// Get all Registered Courses
router.get("/get-all-courses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)


// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// 

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router