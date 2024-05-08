import asyncHandler from "express-async-handler";
import axios from "axios";
import { Learner } from "../models/learnerModel.js";

export const enrolLearner = asyncHandler(async (req, res) => {
  const authAPI = process.env.AUTH_API;
  const courseAPI = process.env.COURSE_API;

  const studentId = req.params.sid;
  const courseId = req.params.cid;

  try {
    const userResponse = await axios.get(`${authAPI}/user/${studentId}`);
    const user = userResponse.data;

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User Not Found with given ID!" });
    } else {
      const courseResponse = await axios.get(
        `${courseAPI}/api/course/${courseId}`
      );

      const course = courseResponse.data;

      if (!course) {
        return res
          .status(404)
          .json({ message: "Course Not Found with given ID!" });
      } else {
        let learner = await Learner.findOne({ studentId });

        if (!learner) {
          learner = new Learner({ studentId, enrolledCourseList: [] });
        }

        if (learner.enrolledCourseList.includes(course)) {
          return res.status(400).json({ message: "Learner Already Enrolled!" });
        }

        learner.enrolledCourseList.push(course);
        await learner.save();

        return res
          .status(200)
          .json({ message: "Learner Enrolled Successfully!" });
      }
    }
  } catch (error) {
    res.status(error.status);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

export const unenrolLearner = asyncHandler(async (req, res) => {
  const authAPI = process.env.AUTH_API;
  const courseAPI = process.env.COURSE_API;

  const studentId = req.params.sid;
  const courseId = req.params.cid;

  try {
    const userResponse = await axios.get(`${authAPI}/user/${studentId}`);
    const user = userResponse.data;

    if (!user) {
      return res.status(404).json({ message: "User Not Found with given ID!" });
    } else {
      const courseResponse = await axios.get(
        `${courseAPI}/api/course/${courseId}`
      );

      const course = courseResponse.data;

      if (!course) {
        return res
          .status(404)
          .json({ message: "Course Not Found with given ID!" });
      } else {
        let learner = await Learner.findOne({ studentId });

        if (!learner.enrolledCourseList.includes(courseId)) {
          return res.status(400).json({ message: "Learner Not Enrolled!" });
        } else {
          learner.enrolledCourseList.pop(courseId);

          await learner.save();

          return res
            .status(200)
            .json({ message: "Learner Unenrolled Successfully!" });
        }
      }
    }
  } catch (error) {
    res.status(error.status);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});
