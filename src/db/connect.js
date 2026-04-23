import mongoose from "mongoose";

export async function connectDB(dbUrl) {
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected.")
    } catch (error) {
        console.error("MongoDB connection failed!");
        throw error;
    }
}