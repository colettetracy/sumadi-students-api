import client from 'mongoose';
import { Router } from "express";
import token from "../middleware/auth.js"
const studentRoutes = Router();
const version = process.env.VERSION_API;

const School = new client.Schema({
    firstName: { type: String, min: 2, max: 25, match: /^[A-Za-z\s]+$/ },
    lastName: { type: String, min: 2, max: 25, match: /^[A-Za-z\s]+$/ },
    birthdate: { type: Date },
    email: { type: String, unique: true, trim: true, lowercase: true },
    address: { type: String, min: 2, max: 225, match: /^[A-Za-z0-9\s]+$/ },
    gender: { type: String, min: 1, max: 1 }
});
const Student = client.model('students', School);

studentRoutes.route(`/api/${version}/student/`).get(token.verifyToken, async function(_req, res) {
    try {
        let students = await Student.find({});
        let dto = students.map(item => ({
            studentId: item._id,
            firstName: item.firstName,
            lastName: item.lastName,
            birthdate: item.birthdate,
            email: item.email,
            address: item.address,
            gender: item.gender
        }));
        res.status(200).json(dto);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

studentRoutes.route(`/api/${version}/student/:id`).get(token.verifyToken, async function(req, res) {
    try {
        let student = await Student.findById(req.params.id);
        if (student == null) {
            res.status(404).json({
                message: `Student with ${req.params.id} not found.`
            });
            return;
        }
        res.status(200).json(({
            studentId: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            birthdate: student.birthdate,
            email: student.email,
            address: student.address,
            gender: student.gender
        }));
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

studentRoutes.route(`/api/${version}/student/`).post(token.verifyToken, async function(req, res) {
    try {
        let { firstName, lastName, birthdate, email, address, gender } = req.body;
        if (!(firstName && lastName && birthdate && email && address && gender)) {
            res.status(400).send({
                message: "All input is required"
            });
            return;
        }
        await Student.create({
            firstName,
            lastName,
            birthdate,
            email,
            address,
            gender
        }).catch(function(err) {
            console.error('error', err)
            res.status(500).json({
                message: err
            });
            return;
        }).then(function(data) {
            if (data !== undefined) {
                res.status(201).json({
                    message: `Student created: ${data._id}`
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

studentRoutes.route(`/api/${version}/student/:id`).put(token.verifyToken, async function(req, res) {
    try {
        let { firstName, lastName, birthdate, email, address, gender } = req.body;
        if (!(firstName && lastName && birthdate && email && address && gender && req.params.id)) {
            res.status(400).send({
                message: "All inputs are required"
            });
            return;
        }

        let student = await Student.findOneAndUpdate({ _id: req.params.id }, {
            firstName,
            lastName,
            birthdate,
            email,
            address,
            gender
        }, { new: true });
        if (student == null) {
            res.status(404).json({
                message: `Student with id ${req.params.id} not found.`
            });
            return;
        }

        res.status(204).json({
            message: "Student updated"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

studentRoutes.route(`/api/${version}/student/:id`).delete(token.verifyToken, async function(req, res) {
    try {
        let result = await Student.deleteOne({ _id: req.params.id });
        if (result.deletedCount == 0) {
            res.status(409).json({
                message: "Delete not completed"
            });
            return;
        }
        res.status(200).json({
            message: "Student deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

export default studentRoutes;