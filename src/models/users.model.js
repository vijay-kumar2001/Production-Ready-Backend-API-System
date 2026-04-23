import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true, versionKey: false });

const User = mongoose.model("user", userSchema) //mongoose converts user to users and if we used users then it will become userses (for model name)

function sanitizeUser(user) { // will be used in controller while sending response to prevent unnecessary fields from exposing
    if (!user) {
        return null;
    }
    const userObject = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete userObject.password; // removing password from user details as it is sensitive 
    return userObject;
}

// create or any other function of model have sole purpose of using received data and peforming single operation , designing or formatting is to be done by services 
export const userModel = {  // not finding value does not throws error in db , it returns null if no document matching condition is found
    async create(user) {
        return User.create(user); // we are now interacting with mongodb via mongoose 
        // model.create() returns a Mongoose Document (it behaves like js object that is why we can normally use its properties but it is acutally not plain js object but still compatible one)
        // Structure (simplified)
        // user = {
        //   _id: ObjectId("661abc..."),
        //   email: "test@gmail.com",
        //   password: "$2a$10$hashed...",
        //   role: "user",
        //   createdAt: Date,
        //   updatedAt: Date,

        //   // Mongoose internals
        //   save: function,
        //   toObject: function,
        //   ...
        // }
        // ⚠️ Important

        // This is NOT plain JS object

        // If you want plain object
        // user.toObject()
    },
    async findByEmail(email) {
        return User.findOne({ email }).lean();
    }, async findById(id) {
        return User.findById(id).lean();
    }, async getAll() {
        return User.find({}).select("-password").lean();
    },
    async updateRole(id, role) {
        return User.findByIdAndUpdate(id, { role }, { new: true }).lean();
    },
    sanitizeUser
};
//lean() is added for faster retrieval and smaller also , but if any problem occurs reconsider what is trimmed
// return values
// create : created document 
// find : array of documents 
// findOne , findById : document or null
// findOneAndUpdate(filter,update,option),findByIdAndUpdate : if found then document{default = old doc , new=true : new doc} if not then null
// deleteOne : {acknowledged: true,deletedCount: 1}
// findOneAndDelet : deleted doc or null 

