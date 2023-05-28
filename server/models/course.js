import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const questionSchema = new mongoose.Schema(
	{
		question: {
			type: String,
			maxlength: 800,
			required: true,
		},
		answer1: {
			type: String,
			required: true,
		},
		answer2: {
			type: String,
			required: true,
		},
		answer3: {
			type: String,
			required: true,
		},
		answer4: {
			type: String,
			required: true,
		},
		correct: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const lessonSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			minlength: 3,
			maxlength: 300,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		content: {
			type: {},
			minlength: 150,
		},
		video: {},
		pdf: {},
		LO: {
			type: String,
		},
		preconditions: {
			type: String
		},
		free_preview: {
			type: Boolean,
			default: false,
		},
		questions: [questionSchema],
	},
	{ timestamps: true }
);

const courseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			minlength: 3,
			maxlength: 300,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: {},
			minlength: 150,
			required: true,
		},
		image: {},
		category: String,
		published: {
			type: Boolean,
			default: false,
		},
		instructor: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
		lessons: [lessonSchema],
	},
	{ timestamps: true }
);
  
export default mongoose.model("Course", courseSchema);
  

