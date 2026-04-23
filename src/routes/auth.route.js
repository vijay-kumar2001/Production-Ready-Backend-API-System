import express from 'express'
import { validateRegisterAndLogin } from '../middlewares/validateRegisterAndLogin.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';
import { hybridAuthMiddleware } from '../middlewares/hybridAuth.middleware.js';
import { validateRefreshExistsMiddleware } from '../middlewares/validateRefresh.middleware.js';


export const HybridAuthRouter=express.Router();

// request should reach controller after all verification,formating , structuring and sanitization so that controller and service can perform things directly w/o again verifying those things

HybridAuthRouter.post("/register",validateRegisterAndLogin,AuthController.register)
HybridAuthRouter.post("/login",validateRegisterAndLogin,AuthController.login)
HybridAuthRouter.post("/refresh",validateRefreshExistsMiddleware,AuthController.refresh) // route is public but action is protected by refresh token
HybridAuthRouter.post("/logout",AuthController.logout) // this is just action & not data related op. , so here is no need to use any mw before logout 
