import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer
    if (process.env.NODE_ENV !== "test") {
        console.error(err);
    }

    // Zod validation error
    if (err instanceof ZodError || err.name === "ZodError") {
        const issues = err.issues || err.errors || [];
        const message = issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        return res.status(404).json({
            success: false,
            message: "Resource not found",
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate field value entered",
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: message.join(", "),
        });
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error",
    });
};

export default errorHandler;
