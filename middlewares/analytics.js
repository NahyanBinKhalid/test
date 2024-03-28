const analyticsModel = require("../models/Analytics");

const statistics = async (req, res, next) => {
    // Log the timestamp, HTTP method, and requested URL
    const { method, url, headers, body } = req;
    const address = {
        ip: req.ip,
        ip6: req.ip6,
        hostname: req.hostname
    };
    var analytics = new analyticsModel({ method, url, headers, body, address });
    analytics.save();
    next();
};

module.exports = {
    statistics
};