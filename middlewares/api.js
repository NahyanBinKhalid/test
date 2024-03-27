const userModel = require("../models/User");
const verifyKey = async (req, res, next) => {
    const key = req.headers.key;

    if (!key) {
        return res.status(403).json({
            error: true,
            message: 'API Key is Required',
            data: null
        });
    }
    try {
        const user = await userModel.findOne({
            $and: [
                { key: key },
                { deleted: false }
            ]
        }).select('role name company phone email active sandbox');

        if(user) {
            if(user.active) {
                req.user = user;
            } else {
                return res.status(401).json({
                    error: true,
                    message: "User is DeActive. Contact the IBG Staff.",
                    data: null
                });
            }
        } else {
            return res.status(401).json({
                error: true,
                message: "Invalid Key",
                data: null
            });
        }
        // return req.user = user;
    } catch (exception) {
        return res.status(401).json({
            error: true,
            message: (process.env.ENV === 'local') ? exception.message : "Invalid Key",
            data: null
        });
    }
    next();
};

module.exports = {
    verifyKey
};