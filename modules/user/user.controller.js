import * as userService from "./user.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const getMe = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user._id);
    res.json(user);
});

export const listUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const { data, total } = await userService.getAllUsers(req.query);
    res.json({
        data,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
    });
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
    // Only allow name, surname, email for self-update profile
    const { name, surname, email } = req.body;
    const user = await userService.updateUser(req.user._id, { name, surname, email });
    res.json(user);
});

export const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, oldPassword, newPassword);
    res.json({ message: "Password updated" });
});

export const changeRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await userService.updateUser(req.params.userId, { role });
    res.json({ message: "Role updated", user });
});

export const updateStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const user = await userService.updateUser(req.params.userId, { isActive });
    res.json({ message: "User status updated", user });
});

export const adminUpdateUser = asyncHandler(async (req, res) => {
    const { name, surname, email, role, isActive, contact } = req.body;
    const user = await userService.updateUser(req.params.id, { name, surname, email, role, isActive, contact });
    res.json({ message: "User updated successfully", user });
});
