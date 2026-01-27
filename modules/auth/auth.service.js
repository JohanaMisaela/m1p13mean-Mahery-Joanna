import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./auth.model.js";

export const createUser = async ({ name, email, password, role }) => {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email already used");

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash, role });
    return user;
};

export const authenticateUser = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    return user;
};


export const generateToken = (id) => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};
