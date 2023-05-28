import express from "express";
import formidable from "express-formidable";

const router = express.Router();

// Controllers
import { imageUpload, removeImage, createCourse, readCourse, uploadVideo, removeVideo, addLesson, updateCourse, updateLesson, deleteLesson, publishCourse, unpublishCourse, allCourses, enrolmentCheck, enrolment, userCourses, markCompleted, markIncompleted, lessonsCompleted, uploadPdf, removePdf, addQuiz, makePlan, getQuiz, quizPlan, deleteQuiz } from "../controllers/course";

// Middleware
import { isInstructor, requireSignIn, isEnrolled } from "../middlewares";

// Routes
router.get('/courses', allCourses)

// Image operations
router.post('/course/upload-image', imageUpload);
router.post('/course/remove-image', removeImage);

// Course operations
router.post("/course", requireSignIn, isInstructor, createCourse);
router.put("/course/:slug", requireSignIn, updateCourse);
router.get("/course/:slug", readCourse);
router.post('/course/video-upload/:instructorId', requireSignIn, formidable(), uploadVideo); // formidable middleware allows access to req.files
router.post('/course/video-remove/:instructorId', requireSignIn, removeVideo); 
router.put('/course/publish/:courseId', requireSignIn, publishCourse);
router.put('/course/unpublish/:courseId', requireSignIn, unpublishCourse);
router.post('/course/lesson/:slug/:instructorId', requireSignIn, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignIn, updateLesson);
router.put('/course/:slug/:lessonId', requireSignIn, deleteLesson);

// PDF Operations
router.post('/course/pdf-upload/:instructorId', requireSignIn, formidable(), uploadPdf);
router.post('/course/pdf-remove/:instructorId', requireSignIn, removePdf);

// Quiz operations
router.put('/course/lesson/quiz/:slug/:instructorId', requireSignIn, addQuiz);
router.get('/course/quiz/:slug/:lessonId', requireSignIn, getQuiz);
router.delete('/course/lesson/quiz/:slug/:lessonId/:quizId', requireSignIn, deleteQuiz);

// Enrolment operations
router.get('/enrolment-check/:courseId', requireSignIn, enrolmentCheck);
router.post('/enrolment/:courseId', requireSignIn, enrolment);

// Course page for user operations
router.get('/user-courses', requireSignIn, userCourses);
router.get("/user/course/:slug", requireSignIn, isEnrolled, readCourse);

// Mark a completed/incomplete course + lesson
router.post('/mark-completed', requireSignIn, markCompleted);
router.post('/mark-incompleted', requireSignIn, markIncompleted);
router.post('/lessons-completed', requireSignIn, lessonsCompleted);

//Online Planner
router.post('/planner/:LG', requireSignIn, makePlan);
router.post('/quiz/planner', requireSignIn, quizPlan);


module.exports = router;