const JWT_USERSECRET = require("..config.js")

 function userMiddleware(req, res, next){
    const token = req.headers.authorization;

    const decodedData = jwt.verify(token,JWT_USERSECRET);

    if(decodedData){
        req._id = decodedData._id;
        next();
    }
    else{
        res.status(403).json({
            message : "Wrong credentials"
        });
    }
}

module.exports = {userMiddleware};