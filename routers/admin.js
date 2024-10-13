const express = require("express");
const db = require("../db.js");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_ADMINSECRET } = require("..config.js");
const middleware = require("../middleware/adminMiddleware.js");
const adminMiddleware = middleware.adminMiddleware;

const AdminModel = db.AdminModel;
const CourseModel = db.CourseModel;

const adminRouter = express.Router();


adminRouter.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminInputSchema = z.object({
            email: z.string().min(6).max(20).email(),
            password: z.string()
                .min(6)
                .max(20)
                .regex(/[A-Za-z]/, "Password must contain at least one letter")
                .regex(/\d/, "Password must contain at least one digit")
                .regex(/[\W_]/, "Password must contain at least one special character"),
            firstName: z.string().min(6).max(20),
            lastName: z.string().min(6).max(20),
        }).strict();

        const parsedAdminInput = adminInputSchema.safeParse(req.body);

        if (parsedAdminInput.success) {
            await AdminModel.create({
                email,
                password: hashedPassword,
                firstName,
                lastName
            });
            res.json({ message: "Admin Signed Up successfully" });
        } else {
            return res.status(400).json({
                message: "Bad Request",
                error: parsedAdminInput.error.errors.map(err => err.message)
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Server side error ${error}`
        });
    }
});


adminRouter.post('/signin', async (req, res) => {
    try {
        const adminInputSchema = z.object({
            email: z.string().email(),
            password: z.string()
                .min(6)
                .max(20)
                .regex(/[A-Za-z]/, "Password must contain at least one character")
                .regex(/[\d]/, "Password must contain at least one digit")
                .regex(/[\W_]/, "Password must contain at least one special character"),
        });

        const parsedAdminInput = adminInputSchema.safeParse(req.body);

        if (parsedAdminInput.success) {
            const { email, password } = req.body;
            const admin = await AdminModel.findOne({ email });

            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }

            const checkPassword = await bcrypt.compare(password, admin.password);

            if (checkPassword) {
                const token = jwt.sign({ _id: admin._id.toString() }, JWT_ADMINSECRET);
                res.json({ message: "Admin Signed In successfully", token });
            } else {
                res.status(403).json({ message: "Incorrect Password" });
            }
        } else {
            res.status(400).json({
                message: "Bad request",
                error: parsedAdminInput.error.errors.map(err => err.message)
            });
        }
    } catch (error) {
        res.status(500).json({ message: `Server side issue ${error}` });
    }
});


adminRouter.post('/create-courses', adminMiddleware, async (req, res) => {
    try {
        const adminId = req._id;
        const { title, description, imageUrl, price } = req.body;
        const course = await CourseModel.create({
            title,
            description,
            imageUrl,
            price,
            creatorId: adminId
        });

        res.json({
            message: "Course created Successfully",
            courseId: course._id,
            course
        });
    } catch (error) {
        res.status(500).json({ message: `Server side issue ${error}` });
    }
});


adminRouter.delete('/delete-courses', adminMiddleware, async (req, res) => {
    try {
        const adminId = req._id;
        const { courseId } = req.body;

        const isPresent = await CourseModel.findOne({ courseId : courseId });

        if(isPresent){
            const result = await CourseModel.deleteOne({
                _id: courseId,
                creatorId: adminId
            });
    
            if (result.deletedCount === 0) {
                return res.status(401).json({ message: "Unauthorized access" });
            }
    
            res.json({ message: "Course deleted successfully" });
        }
        else{
            res.status(404).json({
                message : "Course not Found"
            })
        }
        
    } catch (error) {
        res.status(500).json({ message: `Server side issue ${error}` });
    }
});


adminRouter.put('/update-courses', adminMiddleware, async (req, res) => {
    try {
        const adminId = req._id;
        const { title, description, imageUrl, price, courseId } = req.body;

        // await CourseModel.updateOne(
        //     {
        //         _id: courseId,
        //         creatorId: adminId
        //     },
        //     {
        //         title,
        //         description,
        //         imageUrl,
        //         price
        //     }
        // );

        const  isPresent = await CourseModel.findOne({ courseId : courseId });

        if(isPresent){
            const updateFields = {};
            if (title) updateFields.title = title;
            if (description) updateFields.description = description;
            if (imageUrl) updateFields.imageUrl = imageUrl;
            if (price) updateFields.price = price;
    
            const result = await CourseModel.updateOne(
                { _id: courseId, creatorId: adminId },
                { $set: updateFields }
            );
    
            if (result.nModified === 0) {
                return res.status(401).json({ message: "You do not have access to Update course" });
            }

            return res.json({ message: "Course updated successfully" });
        }
        else{
            return res.json(404).json({
                message : "COurse not Found"
            })
        }
         
    } catch (error) {
        res.status(500).json({ message: `Server side issue ${error}` });
    }
});


adminRouter.get('/get-courses', adminMiddleware, async (req, res) => {
    try {
        const adminId = req._id;
        const courses = await CourseModel.find({ creatorId: adminId });

        res.json({ courses : courses });
    } catch (error) {
        res.status(500).json({ message: `Server side issue ${error}` });
    }
});


module.exports = { adminRouter };
