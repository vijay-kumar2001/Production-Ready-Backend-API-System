import express from "express"
import { hybridAuthMiddleware } from "../middlewares/hybridAuth.middleware.js"
import { userController } from "../controllers/user.controller.js"

export const ProfileRouter=express.Router()

ProfileRouter.get("/",hybridAuthMiddleware,userController.profile);