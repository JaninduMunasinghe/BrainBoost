import asyncHandler from "express-async-handler";
import { Course } from "../models/courseModel.js";
import { fileSizeFormatter } from "../utils/fileUpload.js";
import { cloudinary } from "../utils/cloudinary.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { name, description, price, lectures } = req.body;

  //validation
  if (!name || !description || !price) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  //Handle video upload
  let fileData = {};
  if (req.file) {
    ////save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "course-microservice",
        resource_type: "video",
      });
    } catch (error) {
      res.status(500);
      throw new Error("video upload failed");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  //handle lecture upload with pdf
  let lectureData = [];
  if (lectures) {
    lectureData = lectures.map((lecture) => {
      let pdfData = {};
      if (lecture.pdf) {
        //save pdf to cloudinary
        let uploadedPdf;
        try {
          uploadedPdf = cloudinary.uploader.upload(lecture.pdf, {
            folder: "course-microservice",
            resource_type: "pdf",
          });
        } catch (error) {
          res.status(500);
          throw new Error("Pdf upload failed");
        }

        pdfData = {
          fileName: lecture.pdf.originalname,
          filePath: uploadedPdf.secure_url,
          fileType: lecture.pdf.mimetype,
          fileSize: fileSizeFormatter(lecture.pdf.size, 2),
        };
      }
      return {
        title: lecture.title,
        content: lecture.content,
        pdf: pdfData,
      };
    });
  }

  //create course
  const course = await Course.create({
    name,
    description,
    price,
    video: fileData,
    lectures: lectureData,
  });

  res.status(201).json(course);
});

//Get all courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.status(200).json(courses);
});

//Get Single courses
export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

//Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.deleteOne();
    res.json({ message: "Course removed" });
  } else {
    res.status(404);
    throw new Error("Course not found");
  }
});

//Update the course
export const updateCourse = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;

  //validation
  if (!name || !description || !price) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  //update course
  const course = await Course.findById(req.params.id);

  if (course) {
    course.name = name;
    course.description = description;
    course.price = price;

    //Handle video upload
    let fileData = {};
    if (req.file) {
      //save image to cloudinary
      let uploadedFile;
      try {
        uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "course-microservice",
          resource_type: "video",
        });
      } catch (error) {
        res.status(500);
        throw new Error("Image upload failed");
      }

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
      course.video = fileData;
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error("Course not found");
  }

  //res.status(201).json(course);
});
