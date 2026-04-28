import { AppError } from "../utils/AppError.js";

// mw responsibility : authentication(token valid) , authorization(owner/admin)
// service responsibility : resource existence(does user exists), biz logic
// if we move existence to mw then there will be extra db call on each request, ie slower performance , it will not be reusable , and breaks separation of concerns
// ex = if we have /users/:id , /posts/:id , /comments/:id then we cant have a mw that handle them generically that is why existence should belong in service 
export function isOwnerOrAdmin(req, res, next) {
    // client has his own identity in access token and he requests user he wants to fetch details of via query param(w/o this it can work for normal user but not for admin so this method is used)
    const requestedUserId = req.params.id; // retrieving requested user's id 


    if (!requestedUserId) { // it seems illogical to check it as if req.param.id had some value then only this route will be called but here this checks for edge cases like /users/ , /users/undefined , /users/null , /users/"" , so this check is against malformed requests and not user existence 
        return next(new AppError("User id is required", 400));
    }
    
    //user is attached to req by hybridAuthMiddleware to form req.user which can be used safely
    if (req.user.role === "admin") { //if user is admin then there is no need to check whose id he is requesting 
        return next();
    }

    if (req.user.userId !== requestedUserId) { // if client is not admin then he must request only his id so req.user.userId must match req.params.id (requestedUserId) which means he is requesting his own and not other's
        return next(new AppError("Forbidden: not the owner of this resource", 403));
    }

    return next();
}
