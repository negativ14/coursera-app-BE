Coursera Backend
Overview
The Coursera backend is a RESTful API built with Node.js and Express, designed to manage courses and user authentication for an online learning platform. This application allows users to purchase courses, while administrators can manage course content.

Features
User Authentication (Signup, Signin)
Admin Authentication (Signup, Signin)
Course Management (Create, Update, Delete)
Purchase Management (Track purchased courses)
Middleware for user and admin validation
Input validation using Zod

Technologies Used
Node.js: JavaScript runtime for server-side programming
Express.js: Web framework for building APIs
MongoDB: NoSQL database for storing user and course data
JWT: JSON Web Tokens for user and admin authentication
Bcrypt: Library for hashing passwords
Zod: Schema validation library for request validation

Installation
Clone the repository:
git clone <your-repo-url>
cd coursera-backend

Install dependencies:
npm install

Create a .env file in the root directory and add the following environment variables:
JWT_USERSECRET=<your-user-secret>
JWT_ADMINSECRET=<your-admin-secret>

Start the server:
npm start

API Endpoints
User Routes
POST /user/signup: Register a new user.
POST /user/signin: Authenticate a user.
GET /user/my-courses: Get courses purchased by the user.

Admin Routes
POST /admin/signup: Register a new admin.
POST /admin/signin: Authenticate an admin.
POST /admin/create-courses: Create a new course.
PUT /admin/update-courses: Update an existing course.
DELETE /admin/delete-courses: Delete a course.
GET /admin/get-courses: Get courses created by the admin.

Contributing
Contributions are welcome! Please feel free to submit a pull request.

License
This project is licensed under the MIT License.
