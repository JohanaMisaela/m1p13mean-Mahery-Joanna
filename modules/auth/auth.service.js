import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../user/user.model.js";
import userAddressModel from "../address/userAddress.model.js";

export const createUser = async ({ name, email, password, role, address, surname }) => {
    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, password: hashed, role, surname });

    let defaultAddress = null;

    if (address) {
        defaultAddress = await userAddressModel.create({
            user: user._id,
            ...address,
            isDefault: true
        });

        user.defaultAddress = defaultAddress._id;
        await user.save();
    }

    return { user, defaultAddress };
};

export const authenticateUser = async ({ email, password }) => {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    return user;
};


export const generateToken = (id) => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};
