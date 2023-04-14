const UserNotification = require("../models/userNotification");
const User = require("../models/user");

const sendNotification = async (req, res) => {
    try {
        let { message, user } = req.body;

        if (!message) {
            return res.json({ message: "Message is required", success: false });
        }
        if (!user) {
            let userExist = await User.find({});
            let userList = userExist.map(user => user._id);
            user = userList;
        }

        user.map(async (userId) => {
            let existingUser = await User.findOne({ _id: userId });
            if (!existingUser) {
                return res.send({ message: "user not found" });
            }

            req.io.emit(`notified_${existingUser._id}`, {
                message: message,
                user: existingUser._id,
                is_active: true,
                is_seen: false
            });

            const addNotification = new UserNotification({
                message: message,
                user: existingUser._id,
                is_active: true,
                is_seen: false
            });
            let data = await addNotification.save();
        });

        return res.status(201).json({ message: "Send Notification", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const getNotification = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notificationExist = await UserNotification.findOne({ _id: notificationId }).populate({ path: "user" });
        if (!notificationExist) {
            return res.json({ message: "Notification has been not found", success: false });
        }
        return res.status(200).json({ message: "Notification successfully get", success: true, notification: notificationExist });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const getAllNotification = async (req, res) => {
    try {
        const notificationsExist = await UserNotification.find({});
        if (!notificationsExist) {
            return res.json({ message: "Notification has been not found", success: false });
        }
        return res.status(200).json({ message: "Notification successfully get", success: true, notifications: notificationsExist, totalNotification: notificationsExist.length });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const updateNotification = async (req, res) => {
    try {
        const { message, user_id, is_active } = req.body;
        const notificationId = req.params.notificationId;
        const notificationExist = await UserNotification.findOne({ _id: notificationId });
        if (!notificationExist) {
            return res.status(200).json({ message: "Notification has been not found", success: false });
        }
        const notification = await UserNotification.findByIdAndUpdate(notificationId, { message: message, user_id: user_id, is_active: is_active }, { new: true });
        return res.json({ message: "Notification has been updated", success: true, notification: notification });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notificationExist = await UserNotification.findOne({ _id: notificationId });
        if (!notificationExist) {
            return res.json({ message: "Notification has been not found", success: false });
        }
        const notification = await UserNotification.findByIdAndDelete(notificationId);
        return res.status(200).json({ message: "Notification has been deleted", success: true, notification: notification });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

module.exports = {
    sendNotification,
    getNotification,
    getAllNotification,
    updateNotification,
    deleteNotification
};
