const analyticsModel = require("../models/Analytics");
const flatted = require('flatted');

const statistics = async (req, res, next) => {
    // Log the timestamp, HTTP method, and requested URL
    const { method, url, headers, body } = req;
    // const request = flatted.stringify(req);
    // const request = req;
    const socket = flatted.stringify(req.socket);
    var analytics = new analyticsModel({ method, url, headers, body, socket });
    analytics.save();
    next();
};

module.exports = {
    statistics
};