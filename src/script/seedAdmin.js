import { config } from "../config/env.js";
import { userModel } from "../models/users.model.js";
import { hashPassword } from "../utils/bcrypt.utils.js";

export async function seedAdmin(){
    if(!config.admin.seedOnStart){  //checking whether to seed or not
        return null;
    }

    const adminEmail=config.admin.email.trim().toLowerCase();
    const existingAdmin = await userModel.findByEmail(adminEmail);

    if(existingAdmin){
        console.log(`Admin user already exits : ${adminEmail}`);
        return existingAdmin;
    }
    // if admin dont exist then store it by hashing password

    const hashedPassword = await hashPassword(config.admin.password);
    const admin = await userModel.create({
        email:adminEmail,
        password:hashedPassword,
        role:"admin"
    }); // this returns created document ie admin info 

    console.log(`Admin user seeded : ${adminEmail}`);
    return admin;
}