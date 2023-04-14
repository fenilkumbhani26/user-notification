const User = require("../models/user");
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    const { fname, lname, email, password, confirm } = req.body;
    try {
        if (!(fname && lname && email && password && confirm)) {
            return res.json({ message: "Please fill all required field", success: false })
        }
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.json({ message: "Email is already existed", success: false });
        }
        if (password !== confirm) {
            return res.json({ message: "Password and confirm password not match", success: false });
        }
        const addUser = new User({
            fname: fname,
            lname: lname,
            email: email,
            password: await bcrypt.hash(password, 10),
            is_active: true
        });
        let data = await addUser.save();
        return res.status(201).json({ message: "User has been created", success: true, user: data });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, success: false });
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({ message: "User has been not found", success: false });
        }
        return res.status(200).json({ message: "User successfully get", success: true, user: user });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.json({ message: "User has been not found", success: false });
        }
        return res.status(200).json({ message: "Users successfully get", success: true, users: users, totalUser: users.length });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const updateUser = async (req, res) => {
    try {
        const { fname, lname, email } = req.body;
        const userId = req.params.userId;
        const userExist = await User.findOne({ _id: userId });
        if (!userExist) {
            return res.json({ message: "User has been not found", success: false });
        }
        const user = await User.findByIdAndUpdate(userId, {
            fname: fname,
            lname: lname,
            email: email,
            is_active: true
        }, { new: true });
        return res.status(200).json({ message: "User has been updated", success: true, user: user });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const forgotPasword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        const userId = req.params.userId;

        const userExist = await User.findOne({ _id: userId });
        if (!userExist) {
            return res.json({ message: "User has been not found", success: false });
        }

        if (!(email && newPassword && confirmPassword)) {
            return res.json({ message: "All field is required", success: false });
        }

        const emailExist = await User.findOne({ email: email });
        if (!emailExist) {
            return res.json({ message: "Email has been not found", success: false });
        }

        if (newPassword !== confirmPassword) {
            return res.json({ message: "Password and confirm password not match", success: false });
        }
        let pass = bcrypt.hashSync(newPassword, 10);

        const user = await User.findByIdAndUpdate(userId, {
            password: pass
        }, { new: true });

        return res.status(200).json({ message: "Password has been created", success: true, user: user });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const changePasword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userId = req.params.userId;

        const userExist = await User.findOne({ _id: userId });
        if (!userExist) {
            return res.json({ message: "User has been not found", success: false });
        }

        if (!(bcrypt.compareSync(oldPassword, userExist.password))) {
            return res.json({ message: "Current password and new password not match", success: false });
        }

        if (!(oldPassword && newPassword && confirmPassword)) {
            return res.json({ message: "All field is required", success: false });
        }

        if (newPassword !== confirmPassword) {
            return res.json({ message: "New password and confirm password not match", success: false });
        }
        let pass = bcrypt.hashSync(newPassword, 10);

        const user = await User.findByIdAndUpdate(userId, {
            password: pass
        }, { new: true });

        return res.status(200).json({ message: "Password has been updated", success: true, user: user });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userExist = await User.findOne({ _id: userId });
        if (!userExist) {
            return res.json({ message: "User has been not found", success: false });
        }
        const user = await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: "User has been deleted", success: true, user: user });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
}

module.exports = {
    createUser,
    getUser,
    getAllUser,
    updateUser,
    forgotPasword,
    changePasword,
    deleteUser
};



