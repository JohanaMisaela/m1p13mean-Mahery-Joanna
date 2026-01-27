import * as userService from "./user.service.js";

export const getMe = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateUserProfile(req.user.id, req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        await userService.changePassword(req.user.id, oldPassword, newPassword);
        res.json({ message: "Password updated" });
    } catch (err) {
        next(err);
    }
};

export const changeRole = async (req, res, next) => {
    try {
        const { userId, role } = req.body;
        const user = await userService.changeUserRole(userId, role);
        res.json({ message: "Role updated", user });
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

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        await userService.deleteUserById(id);
        res.json({ message: "User deleted" });
    } catch (err) {
        next(err);
    }
};


