import jwt from "jsonwebtoken";
import User from "../../modules/auth/auth.model.js";

export const protect = (roles = []) => async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (roles.length && !roles.includes(user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
