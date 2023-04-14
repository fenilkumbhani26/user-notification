const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fname: {
        type: String
    }, lname: {
        type: String
    }, email: {
        type: String
    }, password: {
        type: String
    }, is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("user", userSchema);

