import express from "express";
import cookieParser from "cookie-parser";
import { AppError } from "./utils/AppError.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { config } from "./config/env.js";
import { connectDB } from "./db/connect.js";
import { HybridAuthRouter } from "./routes/auth.route.js";
import { seedAdmin } from "./script/seedAdmin.js";
import { initGeo } from "./utils/geo.utils.js";
import { UserRouter } from "./routes/user.route.js";
import { ProfileRouter } from "./routes/profile.route.js";

const app = express();

app.set("trust proxy", config.server.trustProxy);   // to get real ip of client and not of proxy like nginx
app.use(express.json());
app.use(cookieParser());

app.use("/auth", HybridAuthRouter); // for auth (for everyone)

app.use("/users",UserRouter); // admin + user based access
app.use("/profile",ProfileRouter); // for normal users

// 404 handler
app.use((req, res, next) => {
    return next(new AppError("Route not found", 404));
});

// central error mw
app.use(errorMiddleware);

// process level protection
process.on("uncaughtException", error => {
    console.log("Uncaught Exception:", error.message);
    process.exit(1);
});

process.on("unhandledRejection", error => {
    console.log("Unhandled Rejection:", error.message);
    process.exit(1);
});


// startup function 
async function startServer() {
    // required setup first , failing these should stop server from starting 
    await connectDB(config.server.dbUrl);
    await seedAdmin();

    //optional things(geo location) inside try-catch so app starts with warning
    try {
        await initGeo();
        console.log("Geo db loaded.")
    } catch (error) {
        console.warn("Geo db cant be loaded : ",error.message);
    }

    // actual starting of server and should be done in end of all things
    app.listen(config.server.port,()=>console.log(`Hybrid Auth Server running on port ${config.server.port}`));
}

startServer().catch(error=>{
    console.log("Failed to start server : ",error.message);
    process.exit(1);
}) // cleaner syntax then try catch as shown below 

// try {
//     await startServer(); // use await asyncFunc() otherwise it will not be catched or user asyncFunc().catch(cb)
// }
// catch (error) {
//     console.error("Failed to start server:", error.message);
//     process.exit(1);
// };