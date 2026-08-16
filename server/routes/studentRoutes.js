const express = require("express");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD student
router.post("/", authMiddleware, async (req, res) => {
    try {
        const student = await Student.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json(student);

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists!"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
});


// GET only logged-in user's students
router.get("/", authMiddleware, async (req, res) => {
    try {
        const students = await Student.find({
            user: req.user.id
        });

        res.json(students);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// UPDATE only logged-in user's student
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                ...req.body,
                user: req.user.id
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists!"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE only logged-in user's student
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;