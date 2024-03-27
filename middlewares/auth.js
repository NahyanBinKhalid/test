const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        return res.status(403).json({
            error: true,
            message: 'Authorization Token is Required',
            data: null
        });
    }
    try {
        const token = bearerToken.split(' ');
        req.user = await jwt.verify(token[1], process.env.TOKEN_KEY);
        // return req.user = user;
    } catch (exception) {
        return res.status(401).json({
            error: true,
            message: (process.env.ENV === 'local') ? exception.message : "Invalid Credentials",
            data: null
        });
    }
    next();
};

module.exports = {
    verifyToken
};