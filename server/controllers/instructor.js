import User from "../models/user";
import Course from "../models/course";

export const createInstructor = async (req, res) => {
    res.send("Dummy Data");
    // try {
    //     // Find user in db
    //     const user = await User.findById(req.auth._id).exec();
    //     // Todo: Check the user is not already listed as instructor
    //     // Updated role in db
    //     // const roleUpdated = await User.findByIdAndUpdate(
    //     //     user._id,
    //     //     {
    //     //         $addToSet: { role: "Instructor" },
    //     //     },
    //     //     { new: true}  
    //     // ).exec();
    //     // Send back confirmation to frontend
    //     // res.json({ ok: true }, roleUpdated);
    //     res.status(200)
    // } catch (err) {
    //     console.log(err);
    // }
};

export const getAccountStatus = async (req, res) => {
    try {
      	const user = await User.findById(req.auth._id).exec();
        const roleUpdated = await User.findByIdAndUpdate(
			user._id,
			{
				$addToSet: { role: "Instructor" },
			},
			{ new: true }
        ).exec();
        res.json(roleUpdated);
    } catch (err) {
      	console.log(err);
    }
};
  
export const currentInstructor = async (req, res) => {
	try {
		let user = await User.findById(req.auth._id).select('-password').exec();
		if (!user.role.includes('Instructor')) {
			return res.sendStatus(403);
		} else {
			res.json({ ok: true });
		}
	} catch (err) {
		console.log(err);
	}
};

export const instructorCourses = async (req, res) => {
	try {
		const courses = await Course.find({ instructor: req.auth._id })
			.sort({ createdAt: -1 })
			.exec();
		res.json(courses);
	} catch (err) {
		console.log(err);
	}
};

export const countStudents = async (req, res) => {
	try {
		// Find all students with that course id in their courses array
		const users = await User.find({ courses: req.body.courseId }).select('_id').exec();
		res.json(users);
	} catch (error) {
		console.log(error);
	}
};