var mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');
const Schema = mongoose.Schema;

var AnalyticsSchema = new Schema({
    method: {type: String, required: [true, "can't be blank"] },
    url: {type: String, required: [true, "can't be blank"] },
    headers: {type: Object, required: [true, "can't be blank"] },
    body: {type: Object, required: [true, "can't be blank"] },
    socket: {type: Object, required: [true, "can't be blank"] },
}, {
    collection: 'analytics',
    timestamps: true
});

AnalyticsSchema.plugin(mongoose_delete);

module.exports = mongoose.model('analytics', AnalyticsSchema);