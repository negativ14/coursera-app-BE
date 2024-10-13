const express = require("express");
const db = require("..db.js");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_USERSECRET } = require("..config.js");
const middleware = require("../middleware/userMiddleware.js");
const { userMiddleware } = middleware;

const { UserModel } = db;
const { PurchaseModel } = db

const userRouter = express.Router();


userRouter.post('/signup', async (req, res) => {
    try {
        const userInputSchema = z.object({
            email: z.string().email(),
            password: z.string()
                .min(6)
                .max(20)
                .regex(/[A-Za-z]/, "Password must contain at least one letter")
                .regex(/\d/, "Password must contain at least one digit")
                .regex(/[\W_]/, "Password should at least contain one special character"),
            firstName: z.string().min(6).max(20),
            lastName: z.string().min(6).max(20),
        });

        const parsedUserInput = userInputSchema.safeParse(req.body);

        if (parsedUserInput.success) {
            const { email, password, firstName, lastName } = req.body;
            const hashPassword = await bcrypt.hash(password, 10);

            await UserModel.create({
                email,
                password: hashPassword,
                firstName,
                lastName
            });

            res.json({
                message: "User Signed Up successfully"
            });
        } else {
            res.status(400).json({
                message: "Bad Request",
                error: parsedUserInput.error.errors.map(err => err.message)
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Server side issue ${error}`
        });
    }
});


userRouter.post('/signin', async (req, res) => {
    try {
        const userInputSchema = z.object({
            email: z.string().email(),
            password: z.string()
                .min(6)
                .max(20)
                .regex(/[A-Za-z]/, "Password must contain at least one character")
                .regex(/\d/, "Password must contain at least one digit")
                .regex(/[\W_]/, "Password must contain at least one special character")
        });

        const parsedUserInput = userInputSchema.safeParse(req.body);

        if (parsedUserInput.success) {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: "User not Found"
                });
            }

            const hashedPassword = await bcrypt.compare(password, user.password);

            if (hashedPassword) {
                const token = jwt.sign({ _id: user._id.toString() }, JWT_USERSECRET);

                return res.json({
                    message: "User Signed In successfully",
                    token: token
                });
            } else {
                return res.status(403).json({
                    message: "Incorrect Password"
                });
            }
        } else {
            res.status(400).json({
                message: "Bad request",
                error: parsedUserInput.error.errors.map(err => err.message)
            });
        }
    } catch (error) {
        res.status(500).json({
            message: `Server side issue ${error}`
        });
    }
});


userRouter.get('/my-courses', userMiddleware, async (req, res) => {
    try{
        const userId = req._id;

        const courses = await PurchaseModel.find({ userId : userId });

        if(courses.length === 0){
            return res.json({
                message : "Courses not purchased yet"
            })
        }
        res.json({
            courses : courses
        })
    }
    catch(error){
        res.status(500).json({
            message : `Server side issue ${error}`
        })
    }
});


module.exports = { userRouter };
