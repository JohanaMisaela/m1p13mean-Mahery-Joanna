import bcrypt from "bcryptjs";
import User from "./user.model.js";

export const getUserById = async (id) => {
    const user = await User.findById(id).populate("defaultAddress");
    if (!user) throw new Error("User not found");
    return user;
};

export const updateUserProfile = async (id, data) => {
    const { name, surname, email } = data;
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;

    await user.save();
    return user;
};

export const changePassword = async (id, oldPassword, newPassword) => {
    const user = await User.findById(id).select("+password");
    if (!user) throw new Error("User not found");

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) throw new Error("Old password incorrect");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return user;
};

export const changeUserRole = async (userId, newRole) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.role = newRole;
    await user.save();
    return user;
};

export const getAllUsers = async (query = {}) => {
    const { page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const total = await User.countDocuments();
    const data = await User.find()
        .select("-password")
        .populate("defaultAddress")
        .skip(skip)
        .limit(Number(limit));

    return { data, total };
};

export const updateUserStatus = async (userId, isActive) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.isActive = isActive;
    await user.save();
    return user;
};



