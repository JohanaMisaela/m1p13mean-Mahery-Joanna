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
    const user = await userService.updateUserProfile(req.user._id, req.body);
    res.json(user);
});

export const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await userService.changePassword(req.user._id, oldPassword, newPassword);
    res.json({ message: "Password updated" });
});

export const changeRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await userService.changeUserRole(req.params.userId, role);
    res.json({ message: "Role updated", user });
});

export const updateStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: "Not authorized" });
    }

    const user = await userService.updateUserStatus(req.params.userId, isActive);
    res.json({ message: "User status updated", user });
});


