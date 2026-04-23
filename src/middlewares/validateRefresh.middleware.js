import { AppError } from "../utils/AppError.js";

// it verifies whether refreshToken cookie exists or not ?
export function validateRefreshExistsMiddleware(req, res, next) {
    if (!req.cookies.refreshToken) {
        return next(new AppError("Refresh token is missing", 401));
    }

    return next();
}
