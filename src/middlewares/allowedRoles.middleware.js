import { AppError } from "../utils/AppError.js";
//RBAC middleware
export function allowedRoles(...roles) {
    // ex:allowedRoles("admin") -> roles=["admin"]
    //it works bcuz of closure 
    // usage of roles here is same as we use userId , sessionId (received as args) in contollers and service 
    // ...(rest operator) always creates array , if we pass string it will create [string] but if we pass [string] then it will create nested array as [[string]] so always pass args to this as strings like str1,str2 to get roles=[str1,str2]

    // we will return a mw that will be registered and will be used to check roles (so allowedRoles is ultimately factory function)
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            // Inner function remembers outer scope variables
            // even after outer function has finished
            // So:
            // roles.includes works because of closure ✅
            // mw that is why using next and not throw error as we know error also
            return next(new AppError("Forbidden : insufficient permissions", 403))
        }
        return next() // if role is satisfied
    }
}