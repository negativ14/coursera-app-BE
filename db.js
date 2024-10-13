const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const courseSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
    price: Number,
    creatorId: ObjectId
});

const purchaseSchema = new Schema({
    courseId: ObjectId,
    userId: ObjectId
});

const AdminModel = mongoose.model('admin', adminSchema);
const UserModel = mongoose.model('users', userSchema);
const PurchaseModel = mongoose.model('purchases', purchaseSchema);
const CourseModel = mongoose.model('courses', courseSchema);

module.exports = { UserModel, CourseModel, AdminModel, PurchaseModel };
