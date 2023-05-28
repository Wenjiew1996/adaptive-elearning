import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema;

const completedSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "User",
    },
    course: {
        type: ObjectId,
        ref: "Course"
    },
    lessons: [],
    LOS: [],
},
    { timestamps: true }
);

export default mongoose.model("Completed", completedSchema);