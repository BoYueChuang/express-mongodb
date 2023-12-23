const express = require("express");
const mongoose = require('mongoose');
const app = express();
const connectDB = require("./connectMongo");
app.use(express.json());

connectDB();

const BookModel = require("./models/book.model");
const Student = require("./models/student.model");

app.get("/student/getStudent", async (req, res) => {
  try {
    const students = await Student.find();
    if (students.length > 0) {
      res.status(200).json({
        message: students
      });
    }
  } catch (err) {
    res.status(404).json({
      error: err
    });
  }
});


app.post("/student/addStudent", async (req, res) => {
  try {
    const studentObj = new Student({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    });
    const newStudent = await studentObj.save();
    return res.status(200).json({
      msg: "Ok",
      newStudent,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.get("/api/v1/books/:id", async (req, res) => {
  try {
    const data = await BookModel.findById(req.params.id);

    if (data) {
      return res.status(200).json({
        msg: "Ok",
        data,
      });
    }

    return res.status(404).json({
      msg: "Not Found",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});


app.put("/api/v1/books/:id", async (req, res) => {
  try {
    const { name, author, price, description } = req.body;
    const { id } = req.params;

    const data = await BookModel.findByIdAndUpdate(
      id,
      {
        name,
        author,
        price,
        description,
      },
      { new: true }
    );
    deleteKeys('Book')
    return res.status(200).json({
      msg: "Ok",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.delete("/api/v1/books/:id", async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    deleteKeys('Book')
    return res.status(200).json({
      msg: "Ok",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});


module.exports = app;
