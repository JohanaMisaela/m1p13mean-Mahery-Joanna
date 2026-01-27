import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
    try {
        const user = await authService.createUser(req.body);
        res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: authService.generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await authService.authenticateUser(req.body);
        res.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token: authService.generateToken(user._id),
        });
    } catch (err) {
        next(err);
    }
};


export const logout = async (req, res) => res.json({ message: "Logged out" });
