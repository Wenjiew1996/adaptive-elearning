import AWS from 'aws-sdk';
import slugify from 'slugify';
import Course from '../models/course';
import User from '../models/user';
import fs from 'fs';
import Completed from '../models/completed';

const execSync = require('child_process').execSync;
const nanoid = require("nanoid"); 

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
  };

const S3 = new AWS.S3(awsConfig);

export const imageUpload = async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).send("No image provided");
    
        // Image prepared for upload
        const b64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""),"base64");
    
        const type = image.split(";")[0].split("/")[1];
    
        // Parameters for the image
        const params = {
			Bucket: "adp-learning",
			Key: `${nanoid()}.${type}`,
			Body: b64Data,
			ACL: "public-read",
			ContentEncoding: "base64",
			ContentType: `image/${type}`,
        };
    
        // Upload to S3 Bucket 'the bucket created in AWS'
        S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				return res.sendStatus(400);
			}
			res.send(data);
        });
    } catch (err) {
    	console.log(err);
    }

};

export const removeImage = async (req, res) => {
	try {
		const { image } = req.body;
		const params = {
			Bucket: image.Bucket,
			Key: image.Key,
		};

		// Send request to S3 to remove the image
		S3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send({ ok: true });
		});

	} catch (err) {
		console.log(err);
	}
};

export const createCourse = async (req, res) => {
	try {
		const courseExists = await Course.findOne({
			slug: slugify(req.body.name.toLowerCase()),
		});
		if (courseExists) return res.status(400).send("Title is already taken");
	
		const course = await new Course({
			slug: slugify(req.body.name),
			instructor: req.auth._id,
			...req.body,
		}).save();
	
		res.json(course);
	} catch (err) {
		console.log(err);
		return res.status(400).send("Course creation failed. Please try again.");
	}
};

export const readCourse = async (req, res) => {
	try {
		const course = await Course.findOne({ slug: req.params.slug }).populate('instructor', '_id name').exec();
		res.json(course)
	} catch (err) {
		console.log(err);
	}
};

export const getQuiz = async (req, res) => {
	try {
		const { slug, lessonId } = req.params
		const course = await Course.findOne({ "lessons._id":lessonId }).exec();
		let result = -1;
		course.lessons.forEach((item, index) => {
			if (item._id.toHexString() == lessonId) {
				result = index;
			}
		});
		res.json(course.lessons[result].questions);
	} catch (error) {
		console.log(error);
	}
};

export const uploadPdf = async (req, res) => {
	try {
		// Can only upload if the requesting user if the instructor of the course
		if (req.auth._id != req.params.instructorId) {
			return res.status(400).send("Unauthorised Upload");
		}

		const { pdf } = req.files;
		if (!pdf) return res.status(400).send("No pdf found");

		// Parameters for the PDF upload
		const params = {
			Bucket: "adp-learning",
			Key: `${nanoid()}.${pdf.type.split('/')[1]}`,
			Body: fs.readFileSync(pdf.path),
			ACL: "public-read",
			ContentType: pdf.type,
		};

		// Upload PDF to AWS S3
		S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send(data);
		});

	} catch (error) {
		console.log(error);
	}
};


export const uploadVideo = async (req, res) => {
	try {
		// Can only upload if the requesting user if the instructor of the course
		if (req.auth._id != req.params.instructorId) {
			return res.status(400).send("Unauthorised Upload");
		}

		const { video } = req.files;
		if (!video) return res.status(400).send("No video found");

		// Parameters for the video upload
		const params = {
			Bucket: "adp-learning",
			Key: `${nanoid()}.${video.type.split('/')[1]}`,
			Body: fs.readFileSync(video.path),
			ACL: "public-read",
			ContentType: video.type,
		};

		// Upload video to AWS S3
		S3.upload(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send(data);
		});

	} catch (error) {
		console.log(error);
	}
};

export const removePdf = async (req, res) => {
	try {
		// Can only remove if the requesting user if the instructor of the course
		if (req.auth._id != req.params.instructorId) {
			return res.status(400).send("Unauthorised Upload");
		}

		const { Bucket,Key } = req.body;
		// Parameters for the pdf removal
		const params = {
			Bucket,
			Key,
		};

		// Delete pdf from AWS S3
		S3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send({ ok: true });
		});

	} catch (error) {
		console.log(error);
	}
};

export const removeVideo = async (req, res) => {
	try {
		// Can only remove if the requesting user if the instructor of the course
		if (req.auth._id != req.params.instructorId) {
			return res.status(400).send("Unauthorised Upload");
		}

		const { Bucket,Key } = req.body;
		// Parameters for the video removal
		const params = {
			Bucket,
			Key,
		};

		// Delete video from AWS S3
		S3.deleteObject(params, (err, data) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
			}
			res.send({ ok: true });
		});

	} catch (error) {
		console.log(error);
	}
};

export const addLesson = async (req, res) => {
	try {
		const { slug, instructorId } = req.params;
		const { title, content, video, pdf, LO, preconditions } = req.body;
		// Can only add lesson the requesting user if the instructor of the course
		if (req.auth._id != instructorId) {
			return res.status(400).send("Unauthorised");
		}
		// Add details to DB
		const updated = await Course.findOneAndUpdate({ slug }, {
			$push: { lessons: { title, content, video, pdf, slug: slugify(title), LO, preconditions } }
		},
			{ new: true }			// need to include new flag so that res.json sends the new version of updated
		).populate('instructor', '_id name').exec();
		res.json(updated);
	} catch (error) {
		console.log(error);	
		return res.status(400).send("Add Lesson Failed");
	}
};

export const updateCourse = async (req, res) => {
	try {
		const { slug } = req.params;
		const course = await Course.findOne({ slug }).exec();
		if (req.auth._id != course.instructor) {
		  	return res.status(400).send("Unauthorised request to update course");
		}
		// find the course based on the slug
		const updated = await Course.findOneAndUpdate({ slug }, req.body, {
		  	new: true,
		}).exec();
	
		res.json(updated);
	} catch (error) {
		console.log(error);
		return res.status(400).send(error.message);
	}
};

export const deleteLesson = async (req, res) => {
	const { slug, lessonId } = req.params;
	const course = await Course.findOne({ slug }).exec();
	if (req.auth._id != course.instructor) {
		return res.status(400).send("Unauthorised request to delete lesson");
	}
	const deletedLesson = await Course.findByIdAndUpdate(course._id, {
		$pull: {
			lessons: {
				_id: lessonId
			}
		},
	  }).exec();
	
	  res.json({ ok: true }); 
};

export const updateLesson = async (req, res) => {
	try {
		const { slug } = req.params;
		const { _id, title, content, video, free_preview } = req.body;
		const course = await Course.findOne({ slug }).select("instructor").exec();
	
		if (course.instructor._id != req.auth._id) {
		  	return res.status(400).send("Unauthorized request to update lesson");
		}
	
		const updated = await Course.updateOne(
			{ "lessons._id": _id },
			{
				$set: {
				"lessons.$.title": title,
				"lessons.$.content": content,
				"lessons.$.video": video,
				"lessons.$.free_preview": free_preview,
				},
			},
			{ new: true }
		).exec();
		res.json({ ok: true });
	} catch (error) {
		console.log(error);
		return res.status(400).send("Update lesson failed");
	}
};


export const addQuiz = async (req, res) => {
	try {
		const { slug } = req.params;
		const { _id,  question, answer_1, answer_2, answer_3, answer_4, response_1, response_2, response_3, response_4 } = req.body;
		const course = await Course.findOne({ slug }).select("instructor").exec();
		if (course.instructor._id != req.auth._id) {
		  	return res.status(400).send("Unauthorized request to add quiz");
		}
		let correct = "";

		if (response_1) correct = answer_1;
		if (response_2) correct = answer_2;
		if (response_3) correct = answer_3;
		if (response_4) correct = answer_4;

		const updated = await Course.updateOne(
			{ "lessons._id": _id },
			{
				$push: {
					"lessons.$.questions": {
						"question": question,
						"answer1": answer_1,
						"answer2": answer_2,
						"answer3": answer_3,
						"answer4": answer_4,
						"correct": correct,
					},
				},
			},
			{ new: true }	
		).exec();
		res.json({ ok: true });
	} catch (error) {
		console.log(error);
		return res.status(400).send("Add quiz failed");
	}
};

export const publishCourse = async (req, res) => {
	try {
		const { courseId } = req.params;
		const course = await Course.findById(courseId).select('instructor').exec();

		if (course.instructor._id != req.auth._id) {
			return res.status(400).send("Unauthorized request to publish course");
		}
		
		const published = await Course.findByIdAndUpdate(
			courseId,
			{ published: true },
			{ new: true },
		).exec();
		res.json(published);

	} catch (error) {
		console.log(error);
		return res.status(400).send("Course publish failed");
	}
};

export const unpublishCourse = async (req, res) => {
	try {
		const { courseId } = req.params;
		const course = await Course.findById(courseId).select('instructor').exec();

		if (course.instructor._id != req.auth._id) {
			return res.status(400).send("Unauthorized request to unpublish course");
		}
		
		const unpublished = await Course.findByIdAndUpdate(
			courseId,
			{ published: false },
			{ new: true },
		).exec();
		res.json(unpublished);

	} catch (error) {
		console.log(error);
		return res.status(400).send("Course unpublish failed");
	}
};

export const allCourses = async (req, res) => {
	const courses = await Course.find({ published: true }).populate('instructor', '_id name').exec();
	res.json(courses);
};

export const enrolmentCheck = async (req, res) => {
	// Find the courses the logged in user is currently enrolled in
	const { courseId } = req.params;
	const user = await User.findById(req.auth._id).exec();
	// Compare to see if the requested course id is found in the users current courses
	let numCourses = user.courses  && user.courses.length;
	let courseIds = [];
	for (let i = 0; i < numCourses; i++){
		courseIds.push(user.courses[i].toString());
	}
	// Send the status and the enrolled course as well
	res.json({
		status: courseIds.includes(courseId),
		course: await Course.findById(courseId).exec(),
	});
};

export const enrolment = async (req, res) => {
	try {
		const course = await Course.findById(req.params.courseId).exec();
		// Push the course id to the users course array
		const result = await User.findByIdAndUpdate(req.auth._id,
			{
				$addToSet: { courses: course._id },
			},
			{ new: true }
		).exec();

		res.json({
			message: "You have successfully enrolled",
			course,
		});
	} catch (error) {
		console.log("Error with enrolment", error);
		return res.status(400).send('Enrolment failed');
	}

};

export const userCourses = async (req, res) => {
	const user = await User.findById(req.auth._id).exec();
	// Find all user courses
	const allCourses = await Course.find({ _id: { $in: user.courses } }).populate('instructor', '_id name').exec();
	res.json(allCourses);
};

export const quizPlan = async (req, res) => {
	const { courseId, lessonId , LO} = req.body;
	const user = req.auth._id;

	const lessons = await Completed.findOne({
		user: req.auth._id,
		course: courseId,
	}).exec();

	// Generate the Init values i.e. the knowledge the user has acquired
	let initLO = lessons.LOS.map((LO) => ' (' + LO + ' ' + user+ ')').join(' ');
	var path = `./PDDL/Problem-${user}.pddl`;
	
	// Write the updated PDDL Problem file
	var content =
`(define (problem ${user})
		(:domain learning)
		(:objects ${user} - student)
		(:init (dummy) ${initLO})
		(:goal (and (LO28 ${user})))
)`;
	fs.writeFileSync(path, content, err => {
		if (err) {
			console.log(err);
		} else {
			res.json(path);
		}
	});

};

export const markCompleted = async (req, res) => {
	const { courseId, lessonId, LO } = req.body;
	
	// Check if user has already completed a lesson in the course 
	const exists = await Completed.findOne({ user: req.auth._id, course: courseId }).exec();

	if (exists) {
		// Updated the DB, adding the completed lesson to the set
		const updated = await Completed.findOneAndUpdate({
			user: req.auth._id,
			course: courseId,
		}, {
			$addToSet: {
				lessons: lessonId,
				LOS: LO,
			},
		}).exec();
		res.json({ ok: true });
	} else {
		// Create new record 
		const created = await new Completed({
			user: req.auth._id,
			course: courseId,
			lessons: lessonId,
			LOS: LO,
		}).save();
		res.json({ ok: true });
	}
};

export const markIncompleted = async (req, res) => {
	try {
		const { courseId, lessonId, LO } = req.body;
		const updated = await Completed.findOneAndUpdate({
			user: req.auth._id,
			course: courseId,
		}, {
			$pull: {
				lessons: lessonId,
				LOS: LO,
			},
		}).exec();
		res.json({ ok: true });
	} catch (error) {
		console.log(error);		
	}
};

export const lessonsCompleted = async (req, res) => {
	try {
		const lessons = await Completed.findOne({
			user: req.auth._id,
			course: req.body.courseId,
		}).exec();

		lessons && res.json(lessons.lessons);
	} catch (error) {
		console.log(error);
	}
};

export const makePlan = async (req, res) => {
	try {
		const { courseId, lessonId , LO} = req.body;
		const { LG } = req.params;
		const user = req.auth._id;

		const lessons = await Completed.findOne({
			user: req.auth._id,
			course: courseId,
		}).exec();

		// Note: initLO stands for learning objects the learner has already completed
		// LG stands for the objective goal
		// Ideally the frontend will pass LG to backend, 
		// and backend retrieve initLO from database.
		let initLO = '';
		// Generate the Init values i.e. the knowledge the user has acquired
		if (lessons && lessons.length !== 0) {
			initLO = lessons.LOS.map((LO) => ' (' + LO + ' ' + user + ')').join(' ');
		}
		console.log("lessons: ", lessons);
		console.log("LG:", LG);
		
		var path = `./PDDL/Problem-${user}.pddl`;
		
		// Write the updated PDDL Problem file
		var content =
	`(define (problem ${user})
			(:domain learning)
			(:objects ${user} - student)
			(:init (dummy) ${initLO})
			(:goal (and (${LG} ${user})))
	)`;
		fs.writeFileSync(path, content, err => {
			if (err) {
				console.log(err);
			} else {
				// res.json(path);
			}
		});
		// Regex requires changing depending on FF output and changes to any file naming/location structure
		// OLD: "./ff -o ../PDDL/Domain.pddl -f ../PDDL/Problem.pddl | grep [0-9]: | cut -d: -f2 |cut -d- -f1 | awk '{$1=$1};1'",
		// General Problem pddl: "./ff -o ../PDDL/Domain.pddl -f ../PDDL/Problem.pddl | grep [0-9]: | cut -d: -f2 | cut -d' ' -f2 | awk '{$1=$1};1'",
		var result = execSync(`./ff -o ../PDDL/Domain.pddl -f ../PDDL/Problem-${req.auth._id}.pddl | grep [0-9]: | cut -d: -f2 | cut -d' ' -f2 | awk '{$1=$1};1'`, { cwd: "FF" }, (error, stdout, stderr) => {

			if (error) {
				console.log("error=>", error);
			}

		});
		var plan = result.toString().split(/\r?\n/).filter(e => e);
		console.log(plan);
		res.json(plan);
	} catch (error) {
		console.log(error);
	}
};

export const deleteQuiz = async (req, res) => {
	const { slug, instructorId, quizId } = req.params;
	const course = await Course.findOne({ slug }).exec();
	if (req.auth._id != course.instructor) {
		return res.status(400).send("Unauthorised request to delete lesson");
	}
	Course.findByIdAndUpdate(course._id, {
		$pull: {
			'lessons.$[].questions': {
				_id: quizId
			}
		},
	  })
	  .then((res) => {
		console.log("res",res);
	  })
	  .catch(e => {
		console.log("err", e);
	  })

	res.json({ ok: true }); 
}