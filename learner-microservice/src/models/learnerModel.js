import mongoose from "mongoose";
const Schema = mongoose.Schema;

const learnerSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, "Student ID is required"],
    unique: true,
    trim: true,
  },
  enrolledCourseList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export const Learner = mongoose.model("Learner", learnerSchema);
