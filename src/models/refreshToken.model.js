import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true // unique automatically creates index internally
    },
    sessionId: {
        type: String,
        required: true,
        index: true //index : shortcut for faster search , w/o it db scans all docs , with this db directly jumps to matching records , unique creates index automtically but as it is not unique so we explicitly create index
        // token must be unqiue but session can be duplicate as if user logins in 1st then one set of token and session is stored but when he refreshes then token is new but session remains so new set contains same session but new token so we need to allow duplicate session
        // index makes it a bit slowed in write but much faster in read which is worth it
    }
}, {
    timestamps: true,
    versionKey: false
});
// this means each refresh token belongs to a session , token must be linked with session so that if token is stolen we can still verify via session so both together improves security

// create or any other function of model have sole purpose of using received data and peforming single operation , designing or formatting is to be done by services 
const RefreshToken=mongoose.model("RefreshToken",refreshTokenSchema)

export const refreshTokenModel = {
    async create(data) { // data={refreshToken,sessionId}
        return RefreshToken.create(data);
    },
    async find(refreshToken){
        return RefreshToken.findOne({refreshToken}).lean(); // {refreshToken} shorthand for {refreshToken : refreshToken} , lean() is mongoose function and it returns plain js object ie faster and less memory
    },
    async delete(refreshToken){ //logout single device
        return RefreshToken.deleteOne({refreshToken});
    },
    async deleteBySessionId(sessionId){
        return RefreshToken.deleteMany({sessionId});
    },
    async deleteBySessionIds(sessionIds){
        return RefreshToken.deleteMany({sessionId:{$in:sessionIds}}) // this is something like template string , which means delete all session docs whole sessionId matches with any value passed in sessionIds array
        // this is different in syntax as compared to deleteMany are in sessionModel as it has array of values and sessionModel has single value
    }
}
