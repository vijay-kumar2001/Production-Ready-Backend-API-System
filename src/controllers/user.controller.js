import { AppError } from "../utils/AppError.js";
import { userModel } from "../models/users.model.js";
import { userService } from "../services/user.service.js";

export const userController={
     async profile(req, res, next) {
            try {  // req.user = {
                //     userId: decoded.userId,
                //     sessionId: decoded.sessionId,
                //     role: decoded.role
                // }
                const result = await userService.profile(req.user.userId, req.user.sessionId); // result={user,session} 
                if (!result) { // if service returns null 
                    throw new AppError("User not found", 404);
                }
    
                // sending response 
                return res.json({
                    message: "Profile fetched",
                    user: userModel.sanitizeUser(result.user),
                    session: result.session
                });
            }
            catch (error) {
                return next(error);
            }
    
        },
    async getAllUsers(req, res, next) {
        // this can be called by admin only
        try {
            const users = await userService.getAllUsers();

            return res.json({
                message: "All users fetched",
                users
            });
        } catch (error) {
            return next(error);
        }
    },
    async getUserById(req, res, next) {
        // can be called by user for his profile or admin for any profile
        // so checking just userId will not allow admin to see others profile(although it is fine for normal user) so using /:id (where id is nothing else but userId we  want to get) allows both user(to fetch his profile) and admin(to get any profile)
        // it is accessed as /users/:id , so we need to check for req.params.id and not userId in req.user
        try {
            // req.user = {
            //     userId: decoded.userId,
            //     sessionId: decoded.sessionId,
            //     role: decoded.role
            // }
            // params id and userId are same as :id has value as per userId
            const user = await userService.getUserById(req.params.id);
            return res.json({
                message: req.user.role === "admin" ? "User details fetched" : "Your details fetched",
                user: userModel.sanitizeUser(user)
            });
        } catch (error) {
            return next(error);
        }
    },
    async updateUserRole(req, res, next) {
        try {
            // this can be called by admin only
            // /user/:id , id=param id 
            // req.user = {
                //     userId: decoded.userId,
                //     sessionId: decoded.sessionId,
                //     role: decoded.role
                // }
           const updatedUser=await userService.updateUserRole(req.params.id,req.params.role) // req.user.userId represents userId of admin as for login he must have it so query param is the way to send user's id we want to update role of 

           return res.json({
            message : "Role updated",
            user:userModel.sanitizeUser(updatedUser)
           });
        } catch (error) {
            return next(error);
        }
    }
}