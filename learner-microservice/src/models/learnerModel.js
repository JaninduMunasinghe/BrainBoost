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
      course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
      completedChapters: [
        {
          type: Schema.Types.ObjectId,
          ref: "Lecture",
        },
      ],
      progress: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export const Learner = mongoose.model("Learner", learnerSchema);
