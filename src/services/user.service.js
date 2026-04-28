import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import { userModel } from "../models/users.model.js"
import { sessionService } from "./session.service.js";
import { refreshTokenModel } from "../models/refreshToken.model.js";
//we are using "id" for id being received from req.params and "userId" for id being received from req.user

function validateUserId(id){
    if(!mongoose.isValidObjectId(id)){
        throw new AppError("Invalid user id",400);
    }
}

export const userService = {
    async profile(userId, sessionId) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new AppError("User not found", 404); // if request reaches here after authentication ie access & session valid then ideally user should exist but in real world there can be other scenarios also :
            // case 1 : user logs in -> gets token and session -> admin delets use -> token still exists
            // case 2 : db inconsistency = session exists but user doc missing 
            // case 3 : malicious / stale token = token contains valid structure but user no longer exist
            // so we must check existence again

            // it might come in mind that this should also be validated in mw but it is not recommended bcuz of separation of responsibility , mw does authentication(who you are ) , checks token & session validity , and controller/service responsibility is resource existence(user exist?) & biz logic , so mw = generic checks & controller/service = specific checks
            // if we move this to mw then each request will need extra db query means slower performance and also not all routes needs full user data , so it is better to keep user check in controller /service 
        }
        const session = await sessionService.retrieveSession(sessionId);
        return { user, session };
    },
    async getAllUsers() {
        // can be called by admin only
        const users = await userModel.getAll()
        if (!users) {
            throw new AppError("Users not found", 404);

        }
        return users;
    },
    async getUserById(id) {
        //we are using "id" for id being received from req.params and "userId" for id being received from req.user
        // // id is received by /users/:id and it is same as userId so we can pass it to userModel.findById(userId)
        validateUserId(id);
        const user = await userModel.findById(id);
        if (!user) { //in case wrong /:id is passed like 123xyz ie not no.
            throw new AppError("User not found", 404);
        }
        return user;
    },
    async updateUserRole(id, role) {
        //we are using "id" for id being received from req.params and "userId" for id being received from req.user
        // it is accessible only by admin so userId ie req.user.userId is not needed only requsted user's id by /users/:id is needed so that using req.user.userId we verify admin and via query param(/users/:id) we transfer user id or value we want to update 
        // this id is received from param and not from accessToken
        validateUserId(id);
        if (!["admin", "user"].includes(role)) { // if role is anything else then reject(although it will be called by admin but for edge case and worst case scenario where admin might also get hacked so still no other roles will be allowed)
            //  this prevents : 
            // ✔ privilege escalation
            // ✔ invalid role injection
            // ✔ DB corruption
            throw new AppError("Invalid role", 400);
        }

        const updatedUser = await userModel.updateRole(id, role); // this will update user and returns updated doc or null if user not found 
        // we directly try to update user , if he exists then we will get updated doc and if not then we will get null , we are not checking user before updating bcuz that will result in 2 db query for checking and updating but if we directly try to update then if user does not exists then we will get null and we can check return value to understand if it is successful or user didnt existed , so here in single query both things can be done , so to handle tradeoffs we intentionally tested return value and not the user
        if (!updatedUser) { // if user does not exist then throw error
            throw new AppError("User not found", 404);
        }
        return updatedUser;
    },
    async deleteUserById(id){
        ////we are using "id" for id being received from req.params and "userId" for id being received from req.user
        // first finding user before deleting it directly as we need to delete all sessions of that user and refresh tokens associatied with those sessions
        validateUserId(id);
        const user=await userModel.findById(id); // finds user using ._id
        if(!user){
            throw new AppError("User does not exists",404);
        }

        //if user exists then finding all sessions of it 
        const sessions=await sessionService.retrieveSessionsByUserId(id); //returns array of docs having userId =id in session doc

        // now we need refresh tokens linked with each session and for that we need to pass session ids so instead of passing whole doc we will passo nly array of sessionIds so now creating array of sessionIds 
        const sessionIds=sessions.map(session=>session.sessionId) ;

        // now finding & deleting all refresh tokens using sessionid 
        await refreshTokenModel.deleteBySessionIds(sessionIds);//deleting all refresh tokens linked to the retrieved sessions for the user

        // now deleting all sessions after deleting rt 
        await sessionService.deleteSessionsByUserId(id);

        //after finding user , finding all sessions attached to him , then all refresh tokens attached to those sessions and then deleting those refresh tokens and then those sessions now lets finally delete the user 

        const deletedUser=await userModel.deleteUserById(id);
        if(!deletedUser){
            throw new AppError("User does not exists",404);
        }
        return deletedUser;

    }

    
};
