import express from "express";

const router = express.Router();

// controllers
import { register, login, logout, currentUser, sendTestEmail, resetPassword, resettingPassword } from "../controllers/auth";

// middleware
import { requireSignIn } from "../middlewares";

// routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/current-user', requireSignIn, currentUser);
router.get('/send-email', sendTestEmail);
router.post('/reset-password', resetPassword);
router.post('/resetting-password', resettingPassword);


module.exports = router;