import mongoose from "mongoose";
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  question: {
    type: String,
    required: [true, "Quiz question is required"],
  },

  answer: {
    type: String,
    required: [true, "Quiz answer is required"],
  },
});

const lectureSchema = new Schema({
  title: {
    type: String,
    required: [true, "Lecture title is required"],
  },
  content: {
    type: String,
    required: [true, "Lecture content is required"],
  },
  pdf: {
    type: Object,
    default: {},
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Course price is required"],
      trim: true,
    },
    video: {
      type: Object,
      default: {},
    },
    lectures: [lectureSchema],
    quizzes: [quizSchema],
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
