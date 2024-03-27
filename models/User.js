var mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String, required: [true, "can't be blank"] },
    phone: {type: String, required: [true, "can't be blank"] },
    email: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], unique: true, index: true},
    password: {type: String },
    avatar: {type: String, required: [false], default: null},
    active: {type: Boolean, default: true },
    authorization_type: {type: String, required: [false], default: 'Bearer'},
    token: {type: String, required: [false]},
}, {
    collection: 'users',
    timestamps: true
});

UserSchema.plugin(mongoose_delete);

// UserSchema.pre(
//     'save',
//     async function(next) {
//         const user = this;
//         const hash = await bcrypt.hash(this.password, 10);
//         this.password = hash;
//         next();
//     }
// );

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

module.exports = mongoose.model('User', UserSchema);