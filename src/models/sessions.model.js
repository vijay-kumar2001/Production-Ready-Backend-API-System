import mongoose from "mongoose";

// session will store alot of info which is passed via obj as 
// {
//     sessionId: uuidv4(),
//     userId,
//     ...meta,
//     expiresAt: now + SESSION_EXPIRES_IN
// }
// where meta is below thing
// meta = {
//          ip: clientIp || "unknown",
//          userAgent,
//          device: detectDevice(userAgent),
//          location: getLocationFromIp(clientIp)
//         }
// so ultimately it is 
//{
//     sessionId: uuidv4(),
//     userId,
//     ip: clientIp || "unknown",
//     userAgent,
//     device: detectDevice(userAgent),
//     location: getLocationFromIp(clientIp),
//     expiresAt: now + SESSION_EXPIRES_IN
// } so to store this in db we need to enforce proper schema also 


const sessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        ip: String,
        userAgent: String,
        device: String,
        location: String,
        expiresAt: {
            type: Number,
            required: true,
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Session = mongoose.model("Session", sessionSchema);

// create or any other function of model have sole purpose of using received data and peforming single operation , designing or formatting is to be done by services 
export const sessionModel = {
    async create(session) {
        return Session.create(session);
        //session = {
            //     sessionId: uuidv4(),
            //     userId,
            //     ip: clientIp || "unknown",
            //     userAgent,
            //     device: detectDevice(userAgent),
            //     location: getLocationFromIp(clientIp),
            //     expiresAt: now + SESSION_EXPIRES_IN
            // } 
    },
    async find(sessionId) {
        return Session.findOne({ sessionId }).lean(); // returns session obj using session id
    },
    async updateExpiry(sessionId, expiresAt) { // we only need 2 values , it receives newTime to update expiresAt
        return Session.findOneAndUpdate({ sessionId }, { expiresAt }, { new: true }).lean(); 
        //findOneAndUpdate(filter,update,options,callback)
        // filter(obj) : criteria to find 1st matching document ,here {sessionId} shorthand for {sessionId : sessionId} ie sessionId should match passed sessionId
        // update(obj) : modification to apply , here {expiresAt} ie {expiresAt : expiresAt} ie of the matched document change expiresAt property to passed value
        // options (obj) : lots of values , but here new:true returns updated doc and if not passed then would have been returned old doc 
        // cb : it is optional , to be called on error , nowadays try-catch is preferred. 
    },
    async delete(sessionId) {
        return Session.deleteOne({ sessionId });
    }
};

// return values
// create : created document 
// find : array of documents 
// findOne , findById : document or null
// findOneAndUpdate(filter,update,option),findByIdAndUpdate : if found then document{default = old doc , new=true : new doc} if not then null
// deleteOne : {acknowledged: true,deletedCount: 1}
// findOneAndDelet : deleted doc or null 


