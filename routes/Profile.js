const express=require("express")
const router=express.Router();
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")


const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
     instructorDashboard,

}=require("../controllers/Profile")



router.post("/delete-account", deleteAccount)
router.put("/updateProfile",auth, isStudent,updateProfile)
router.get("/get-all-user", getAllUserDetails)
router.get("/getEnrolledCourses",auth, isStudent, getEnrolledCourses)
router.put("/updateDisplayPicture",auth, isStudent, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports=router;