import * as userService from "./user.service.js";

export const getMe = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user._id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const listUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateUserProfile(req.user._id, req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await userService.changePassword(req.user._id, oldPassword, newPassword);
        res.json({ message: "Password updated" });
    } catch (err) {
        next(err);
    }
};

export const changeRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        console.log(req.params);

        const user = await userService.changeUserRole(req.params.userId, role);
        res.json({ message: "Role updated", user });
    } catch (err) {
        next(err);
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        if (req.user.role !== "admin" && req.user._id !== req.params.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const user = await userService.updateUserStatus(req.params.userId, isActive);
        res.json({ message: "User status updated", user });
    } catch (err) {
        next(err);
    }
};


