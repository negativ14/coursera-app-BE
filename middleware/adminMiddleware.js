const jwt = require("jsonwebtoken");
const { JWT_ADMINSECRET } = require("..config.js");


function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;

    try {
        const decodedData = jwt.verify(token, JWT_ADMINSECRET);

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

module.exports = { adminMiddleware };
