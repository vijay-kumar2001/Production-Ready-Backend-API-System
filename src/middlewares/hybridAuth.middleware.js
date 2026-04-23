import { sessionService } from "../services/session.service.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import { AppError } from "../utils/AppError.js";

export async function hybridAuthMiddleware(req, res, next) {
    //everything should be inside try-catch
    try { //it is used only for routes for which user must be logged in like for fetching profile , user details , details of all other users(by admin) ,etc. 
        // so we will verify whether auth header(& inside it authorization) exists (if yes then is it in proper format) then access token &  session are verified , & after it is verified that there is no problem or risk in sending request forward
        // we dont need cookie here as that contains refresh token and here there is no need of refresh token
        const authHeader = req.headers.authorization; // undefined if does not exists , we used this bcuz access token should be explicit and not automatic (like cookies) , this enforces separation of security 

        // expected format -> Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

        // this format of request is implemented by frontend so this comes here in expected format
        // ex : fetch("/profile", {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`
        //     }
        //   }); so frontend is responsible for sending correct format 
        //         Frontend SHOULD send it
        // Backend MUST NOT trust it blindly
        if (!authHeader) { // if authHeader does not exist then it means accessToken cant be tested(as it is expected to be sent in header under authorization field)
            throw new AppError("Authorization header is missing", 401);
        }
        const parts = authHeader.split(" "); //expected structure : parts=["Bearer","<accessTokenString>"]
        if (parts.length !== 2 || parts[0] !== "Bearer") { // checking if it had anything extra or less and if 1st thing is "Bearer"(case sensitive ) or not
            throw new AppError("Invalid authorization format", 401);
        }
        // if authorization header exists and that too in right format so now lets move to checking access token and session
        const accessToken = parts[1];//accessToken is sent in authorization header and after Bearer (industry standard )

        // payload = {
        //     userId: user._id,
        //     sessionId: session.sessionId,
        //     role: user.role
        // } 
        const decoded = verifyAccessToken(accessToken); // returns decoded payload if authentic else will throw error (will be catched using try-catch)


        // if no error thrown then it means accessToken is right so now lets check session
        const session = await sessionService.validateSession(decoded.sessionId); // returns full session doc (as per session id) else null ,  it does not throw error automatically so we need to manually throw it in case of error , 
        if (!session) {
            throw new AppError("Session is invalid or expired ", 401);
        }

        // to keep user logged in for long we need to extend his session on every request so that he does not automatically logs out after some duration of inactivity or even after activity also
        await sessionService.extendSession(decoded.sessionId); // this updates expiresAt field of doc whose sessionId is passed

        //after everything is done so now prepare user property so that it can be used later by protected routes directly
        req.user = {
            userId: decoded.userId,
            sessionId: decoded.sessionId,
            role: decoded.role
        }
        return next(); // use return to prevent accidental execution after next()
        // 1. next() → moves control to next middleware / controller
        // 2. return → stops current function execution
        //         ✔ next() → passes control
        // ✔ return → stops current function

    }
    catch (error) {
        return next(error);
    }

}