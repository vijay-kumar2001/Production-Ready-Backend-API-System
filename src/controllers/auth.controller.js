import { AppError } from "../utils/AppError.js";
import { config } from "../config/env.js";
import { userModel } from "../models/users.model.js";
import { AuthService } from "../services/auth.service.js";
import { sessionService } from "../services/session.service.js";
import { userService } from "../services/user.service.js";
import { getClientIp, getLocationFromIp } from "../utils/geo.utils.js";

//anything coming from request header is unreliable so always normalize  & fallback safely

//when we set cookies in responses we have to provide options and w/o helper we have to write same options again & again ie duplicacy and also chances of error , so these will reduce error chances , centralize things and allow options just by calling 1 function
function getRefreshCookieOptions() {
    return {
        httpOnly: true, //prevent js from accessing cookies ie protection from xss attacks , js cant do document.cookie
        sameSite: config.cookies.sameSite, // controls cross site requests , strict : safest , lax : moderate , none : cross site allowed
        secure: config.cookies.secure, //cookie sent over https only , in dev : false  , prod : true
        maxAge: config.cookies.refreshMaxAge // cookie expiry time in ms
    };
}

// browser matches cookie by name+options , cookies can ONLY be cleared if option(not all but path,sameSite,secure, & domain) MATCHES original cookie , thus sameSite and secure must match
function getRefreshCookieClearOptions() {
    return {
        httpOnly: true,
        sameSite: config.cookies.sameSite,
        secure: config.cookies.secure
    }
}

function detectDevice(userAgent = "") { //defualt value prevents crash while testing against regex
    return /mobile|android|iphone/i.test(userAgent) ? "Mobile" : "Desktop";
}

export const AuthController = {
    async register(req, res, next) {
        try {
            const user = await AuthService.register(req.body);

            return res.status(201).json({
                message: "User registered successfully",
                user: userModel.sanitizeUser(user)
            });
        } catch (error) {
            return next(error);
        }
    },
    async login(req, res, next) { // it is reached after validateRegsiterAndLogin mw so it safe to work with ie all extra things had been removed
        //put all actions inside try-catch to catch error at any level
        try {
            // 1st generate meta data bcuz if user credentials are right then he must login which should result in session creation and tokens creation , for session we need to store meta data to distinguish b/w sessions of same user ie same user._id so first create meta data and then try to login by sending both credentials and meta so that if credentials are right then login and create session with meta data also
            const userAgent = req.get("user-agent") || "unknown"; //user-agent : header sent by browser , ex: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit... , contains device , os , browser info  , req.get() do get http header value so req.get("user-agent") is equivalent to req.headers["user-agent"] , fallback ie unknown bcuz header might be missing so to prevent undefined in db ,Headers are case-insensitive
            const clientIp = getClientIp(req);//defined in geo.utils.js , req obj is send so ip is returned after all verification and normalization
            // meta obj
            const meta = {
                ip: clientIp || "unknown", //always store safe value , if not sure whether value will be there provide fallback to prevent undefined in db & prevents null propogation bugs
                userAgent,
                device: detectDevice(userAgent),
                location: getLocationFromIp(clientIp)// we pass precalculated values not which are being passed to this obj thus clientIp and not ip 
            }
            // meta creation is finished so now we can try login
            const { email, password } = req.body; //req.body={email,password is set in mw already} but still destructured before sending to authservice.login for better security and not trusting previous and next layer
            const result = await AuthService.login({ email, password }, meta); //result = {user, accessToken ,refreshToken} obj is returned on successful login
            // since it is using try catch so we dont test edge case for error as if control moves forward then it means previous things are fine , req.body={email,password is set in mw already}
            res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions()); //res.cookie(name,value,options); res.cookie → sets HTTP header (Set-Cookie)

            // now sending back final response
            return res.json({
                message: "Login Successful",
                accessToken: result.accessToken,
                user: userModel.sanitizeUser(result.user)
            }); // res.json() defaults to res.status(200) so if we ignore .status() then 200 is send 
        } catch (error) {
            return next(error);
        }

    },
    async refresh(req, res, next) {
        try {
            // mw already verifies that refresh token cookie exists
            const refreshToken = req.cookies.refreshToken;
            //now sending this token for refresh where it will be first validated for jwt , session and other things and if fine then only new refresh token will be generated
            const result = await AuthService.refresh(refreshToken) // it takes 1 arg : refrsh(receivedRefreshToken) and returns {accessToken,refreshToken} (as obj) on success else throws error
            //if no error is thrown then that was fine and new one is generated so now lets send that back as response 

            //1st setting cookies 
            res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions()); // This overwrites old cookie automatically, No need to manually delete before setting
            //sending response after cookies are set;
            return res.json({
                message: "Token refreshed",
                accessToken: result.accessToken
            });// when no status() then 200 is send by default 

        } catch (error) {
            // if error occurs then send refreshToken is not right so deleting it also in client device
            res.clearCookie("refreshToken", getRefreshCookieClearOptions());//it does not need value , it only takes 2 args
            return next(error)
        }
    },
    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken; //undefined if no cookie , not error
            // if(!refreshToken){
            //     throw new AppError("User already logged out.",401);
            // } this should not be done as logout should be idempotent ie always succeed , so no token -> still return success
            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }
            res.clearCookie("refreshToken", getRefreshCookieClearOptions()); // clearning refreshToken in client also 
            return res.json({
                message: "user logged out."
            })

        } catch (error) {
            return next(error);
        }
    },
};
