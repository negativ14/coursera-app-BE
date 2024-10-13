const express = require("express");
const { CourseModel } = require("../db");
const { PurchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/userMiddleware.js");

const courseRouter = express.Router(); 

courseRouter.post('/purchase', userMiddleware, async(req, res) => {
    try{
        const userId = req._id;
        const courseId = req.body.courseId;

        const alreadyPurchased = await PurchaseModel.find({courseId : courseId, userId : userId})

        if(alreadyPurchased > 0){
            return res.status(409).json({
                message : "You already have this Course"
            })
        }

        //before this you should check did user paid amount for course?
        const result = await PurchaseModel.create({ courseId : courseId, userId : userId});

        if(!result){
            return res.status(403).json({
                message : "Wrong Credentials"
            })
        }
        res.json({
            message : "Course purchased successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message : `Server side issue ${error}`
        })
    }
});


courseRouter.get('/preview', async(req, res) => {
    try{
        const courses = await CourseModel.find({});

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


module.exports = {courseRouter};