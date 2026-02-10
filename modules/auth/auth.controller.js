import * as authService from "./auth.service.js";
import asyncHandler from "../../core/utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
    const { user, defaultAddress } = await authService.createUser(req.body);
    res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role, surname: user.surname, contact: user.contact },
        defaultAddress,
        token: authService.generateToken(user._id),
    });
});


export const login = asyncHandler(async (req, res) => {
    const user = await authService.authenticateUser(req.body);
    res.json({
        user: { id: user._id, name: user.name, email: user.email, role: user.role, surname: user.surname, contact: user.contact },
        token: authService.generateToken(user._id),
    });
});


export const logout = asyncHandler(async (req, res) => res.json({ message: "Logged out" }));
