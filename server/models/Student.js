const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,

    email: {
        type: String,
        required: true
    },

    phone: String,
    course: String,
    department: String,

    // User who owns this student
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Student", studentSchema);