import { AppError } from "../utils/AppError.js";

// verifies register and login request has proper things and in proper format
export function validateRegisterAndLogin(req, res, next) {
    if (!req.body || typeof req.body !== "object") {
        return next(new AppError("Request body must be a JSON object", 400));
    }

    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
        return next(new AppError("Email and password must be strings", 400));
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
        return next(new AppError("Email and password cannot be empty", 400));
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
        return next(new AppError("Invalid email format", 400));
    }

    if (trimmedPassword.length < 6) {
        return next(new AppError("Password must be at least 6 characters long", 400));
    }

    req.body = {
        email: trimmedEmail,
        password: trimmedPassword
    };

    return next();
}
