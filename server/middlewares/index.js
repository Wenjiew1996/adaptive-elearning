import Course from "../models/course";
import User from "../models/user";
const { expressjwt: expressJwt } = require("express-jwt");

// If this is a valid token, this will get the requested user. Else it will throw an error.
// User id acessed by req.user._id in the controller
export const requireSignIn = expressJwt({
    getToken: (req, res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});


// Next is required for creating a middleware function
export const isInstructor = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id).exec();
    	if (!user.role.includes("Instructor")) {
        	return res.sendStatus(403);
    	} else {
    		next();	// callback function, code in middleware function will run
    	}
    } catch (err) {
      	console.log(err);
    }
};

// Protect routes from unenrolled students
export const isEnrolled = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth._id).exec();
        const course = await Course.findOne({ slug: req.params.slug }).exec();

        // Find course id in the users enrolled courses
        let courseIds = []
        for (let i = 0; i < user.courses.length; i++){
            courseIds.push(user.courses[i].toString());
        }
        if (!courseIds.includes(course._id.toString())) {
            res.sendStatus(403);
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
    }
};