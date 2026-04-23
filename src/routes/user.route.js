import express from "express";
import { hybridAuthMiddleware } from "../middlewares/hybridAuth.middleware.js";
import { userController } from "../controllers/user.controller.js";
import { isOwnerOrAdmin } from "../middlewares/isOwnerOrAdmin.middleware.js";
import { allowedRoles } from "../middlewares/allowedRoles.middleware.js";

export const UserRouter=express.Router()


// Admin only
UserRouter.get("/",hybridAuthMiddleware,allowedRoles("admin"),userController.getAllUsers)

// owner or admin
UserRouter.get("/:id",hybridAuthMiddleware,isOwnerOrAdmin,userController.getUserById)

// role update(admin only)
UserRouter.put("/:id/:role",hybridAuthMiddleware,allowedRoles("admin"),userController.updateUserRole)