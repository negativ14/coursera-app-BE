const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const adminRouter = require("./routers/admin"); 
const userRouter = require("./routes/user");
const coursesRouter = require("./routes/courses");

const app = express();
const Port = 3000;

app.use(express.json());

app.use('/user', userRouter);
app.use('/courses', coursesRouter);
app.use('/admin', adminRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DataBase");

    app.listen(Port, () => {
        console.log(`Server running on port ${Port}`);
    });
}

main();
