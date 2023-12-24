const mongoose = require('mongoose');
const { Schema } = mongoose


const studentSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
}, {
    timestamps: true
})

module.exports = mongoose.model('student', studentSchema)