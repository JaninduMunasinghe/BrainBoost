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

        console.log(learner.enrolledCourseList);

        const isEnrolled = learner.enrolledCourseList.some(
          (entry) => entry._id && entry._id.toString() === courseId.toString()
        );

        if (isEnrolled) {
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

        const isEnrolled = learner.enrolledCourseList.some(
          (entry) => entry._id && entry._id.toString() === courseId.toString()
        );

        if (!isEnrolled) {
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

export const completeChapter = asyncHandler(async (req, res) => {
  const authAPI = process.env.AUTH_API;
  const courseAPI = process.env.COURSE_API;

  const { studentId, courseId, lectureId } = req.body;

  console.log(studentId, courseId, lectureId);

  try {
    const userResponse = await axios.get(`${authAPI}/user/${studentId}`);
    const user = userResponse.data;

    //check if student exists
    if (!user) {
      return res.status(404).json({ message: "User Not Found with given ID!" });
    } else {
      //check if course exists
      const courseResponse = await axios.get(
        `${courseAPI}/api/course/${courseId}`
      );

      const course = courseResponse.data;

      if (!course) {
        return res
          .status(404)
          .json({ message: "Course Not Found with given ID!" });
      } else {
        //check if lecture id exists
        const isChapterExists = course.lectures.some(
          (entry) => entry._id && entry._id.toString() === lectureId
        );

        if (!isChapterExists) {
          return res
            .status(404)
            .json({ message: "Chapter Not Found within the Course!" });
        } else {
          //get learner
          let learner = await Learner.findOne({ studentId });

          const isEnrolled = learner.enrolledCourseList.some(
            (entry) => entry._id && entry._id.toString() === courseId.toString()
          );

          if (!isEnrolled) {
            return res.status(400).json({ message: "Learner Not Enrolled!" });
          } else {
            console.log(isEnrolled);

            const isChapterCompleted = learner.enrolledCourseList.some(
              (entry) =>
                entry.completedChapters.some(
                  (entry) => entry.toString() === lectureId.toString()
                )
            );

            if (isChapterCompleted) {
              return res
                .status(400)
                .json({ message: "Lecture Already Completed!" });
            } else {
              console.log("chapter completion: ", isChapterCompleted);

              const enrolledCourse = learner.enrolledCourseList.find(
                (course) => course._id.toString() === courseId.toString()
              );

              console.log("enrolled course: ", enrolledCourse);

              if (enrolledCourse) {
                enrolledCourse.completedChapters.push(lectureId);
                await learner.save();

                console.log(enrolledCourse.completedChapters);

                const totalChaptersCount = course.lectures.length;
                const completedChaptersCount =
                  enrolledCourse.completedChapters.length;
                const progress =
                  (completedChaptersCount / totalChaptersCount) * 100;

                console.log(progress);

                enrolledCourse.progress = progress;

                await learner.save();

                return res
                  .status(200)
                  .json({ message: "Chapter Completed Successfully!" });
              } else {
                return res.status(200).json({ message: "Course Not Found!" });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

export const getProgress = asyncHandler(async (req, res) => {
  const authAPI = process.env.AUTH_API;
  const courseAPI = process.env.COURSE_API;

  const studentId = req.params.sid;
  const courseId = req.params.cid;

  console.log(studentId, courseId);

  try {
    const userResponse = await axios.get(`${authAPI}/user/${studentId}`);
    const user = userResponse.data;

    //check if student exists
    if (!user) {
      return res.status(404).json({ message: "User Not Found with given ID!" });
    } else {
      //check if course exists
      const courseResponse = await axios.get(
        `${courseAPI}/api/course/${courseId}`
      );

      const course = courseResponse.data;

      if (!course) {
        return res
          .status(404)
          .json({ message: "Course Not Found with given ID!" });
      } else {
        //get learner
        let learner = await Learner.findOne({ studentId });

        const isEnrolled = learner.enrolledCourseList.some(
          (entry) => entry._id && entry._id.toString() === courseId.toString()
        );

        if (!isEnrolled) {
          return res.status(400).json({ message: "Learner Not Enrolled!" });
        } else {
          console.log(isEnrolled);

          const enrolledCourse = learner.enrolledCourseList.find(
            (entry) => entry._id.toString() === courseId.toString()
          );

          console.log("enrolled course: ", enrolledCourse);

          if (enrolledCourse) {
            return res.status(200).json({ progress: enrolledCourse.progress });
          } else {
            return res.status(404).json({ message: "Course Not Found!" });
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});
