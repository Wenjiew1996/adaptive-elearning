import express from "express";

const router = express.Router();

// middleware
import { requireSignIn } from "../middlewares";

// controllers
import { createInstructor, getAccountStatus, currentInstructor, instructorCourses, countStudents } from '../controllers/instructor';

// routes
router.post("/create-instructor", requireSignIn, createInstructor);
router.post("/get-account-status", requireSignIn, getAccountStatus);
router.get("/current-instructor", requireSignIn, currentInstructor);
router.get("/instructor-courses", requireSignIn, instructorCourses);
router.post('/instructor/count-students', requireSignIn, countStudents);

module.exports = router;