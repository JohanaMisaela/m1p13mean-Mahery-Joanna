import bcrypt from "bcryptjs";
import User from "./user.model.js";

export const getUserById = async (id) => {
    const user = await User.findById(id).populate("defaultAddress");
    if (!user) throw new Error("User not found");
    return user;
};

/**
 * Generic user update method
 */
export const updateUser = async (id, data) => {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    const allowedFields = ["name", "surname", "email", "role", "isActive", "defaultAddress"];
    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            user[field] = data[field];
        }
    });

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
