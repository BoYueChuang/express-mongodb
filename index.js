const express = require("express");

const app = express();

require("dotenv").config();

app.use(express.json());

const connectDB = require("./connectMongo");

connectDB();

const BookModel = require("./models/book.model");
const Student = require("./models/student.model");



app.get("/api/v1/books", async (req, res) => {
  const { limit = 5, orderBy = "name", sortBy = "asc", keyword } = req.query;
  let page = +req.query?.page;

  if (!page || page <= 0) page = 1;

  const skip = (page - 1) * +limit;

  const query = {};

  if (keyword) query.name = { $regex: keyword, $options: "i" };

  try {
    const data = await BookModel.find(query)
      .skip(skip)
      .limit(+limit)
      .sort({ [orderBy]: sortBy });
    const totalItems = await BookModel.countDocuments(query);

    const response = {
      msg: "Ok",
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / +limit),
      limit: +limit,
      currentPage: page,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});


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
    if (newStudent) {
      res.status(200).json({
        message: "Student Added..!!",
        newStudent
      });
    } else (err) => {
      res.status(500).json({
        message: "Student not Added..!!",
        error: err
      });
    }
  } catch (err) {
    res.json({
      error: err
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

app.post("/api/v1/books", async (req, res) => {
  try {
    const { name, author, price, description } = req.body;
    const book = new BookModel({
      name,
      author,
      price,
      description,
    });
    const data = await book.save();
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
