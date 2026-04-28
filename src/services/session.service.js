import { sessionModel } from "../models/sessions.model.js"
import { v4 as uuidv4 } from 'uuid'
import { SESSION_EXPIRES_IN } from '../config/session.config.js'

// all validate type functions validates the thing provided and then return corresponding full document on success or null on failure

export const sessionService = {
    async createSession(userId, meta) {
        // userid and meta is taken as arg and sessionId will be generated for that
        // meta = {
        //          ip: clientIp || "unknown",
        //          userAgent,
        //          device: detectDevice(userAgent),
        //          location: getLocationFromIp(clientIp)
        //         }
        const now=Date.now();
        return sessionModel.create({
            sessionId: uuidv4(),//since this is session Model so session should be first and not userId for better representation
            userId,
            ...meta,
            expiresAt: now + SESSION_EXPIRES_IN

        });
    },
    async validateSession(sessionId) {
        const session = await sessionModel.find(sessionId); // returns full session doc if found else null
        if (!session) {
            return null;
        }
        if (Date.now() > session.expiresAt) {
            await sessionModel.delete(sessionId);
            return null;
        }
        return session;
    },
    async extendSession(sessionId) { // only sessionId is required , rest of things will be calculated
        return sessionModel.updateExpiry(sessionId, Date.now() + SESSION_EXPIRES_IN);
    },
    async deleteSession(sessionId){
        return sessionModel.delete(sessionId);
    },
    async retrieveSession(sessionId){   // dont know right now where this might have been used
        return sessionModel.find(sessionId); // returns session doc for specific {sessionId:sessionId}
    },
    async retrieveSessionsByUserId(userId){
        return sessionModel.findByUserId(userId); //internally uses find({userId}) so returns array of matching docs
    },
    async deleteSessionsByUserId(userId){
        return sessionModel.deleteByUserId(userId);
    }
};
