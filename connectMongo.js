const mongoose = require('mongoose')
require("dotenv").config();

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("Connect to MongoDB successfully")
    } catch (error) {
        console.log("Connect failed " + error.message)
    }
}

module.exports = connectDB