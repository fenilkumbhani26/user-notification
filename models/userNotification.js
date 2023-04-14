const mongoose = require("mongoose");

const userNotificationSchema = mongoose.Schema({
    message: {
        type: String
    }, user: {
        type: mongoose.Schema.Types.ObjectId,
    }, is_active: {
        type: Boolean,
        default: true
    }, is_seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("userNotification", userNotificationSchema);

