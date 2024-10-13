const jwt = require("jsonwebtoken")
const { JWT_USERSECRET } = require("../config")

 function userMiddleware(req, res, next){
    const token = req.headers.authorization;

    try {
        const decodedData = jwt.verify(token, JWT_USERSECRET);

        if (decodedData) {
            req._id = decodedData._id;
            next();
        } else {
            res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (error) {
        res.status(403).json({
            message: "Wrong credentials",
            error: error.message
        });
    }
}

module.exports = { userMiddleware };