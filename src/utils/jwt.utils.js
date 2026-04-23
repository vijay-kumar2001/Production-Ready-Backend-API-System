import jwt from "jsonwebtoken";
import {JWT_ACCESS_SECRET,JWT_REFRESH_SECRET,JWT_ACCESS_EXPIRES_IN,JWT_REFRESH_EXPIRES_IN}from '../config/jwt.config.js'
import { config } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

// payload={
//     userId:user._id,
//     sessionId:session.sessionId,
//     role:user.role
// }

//below functions are internally used 
function signToken(payload, secret, expiresIn, type) { // w/o type access & refresh token looks same , so they can be used interchangebly by mistake(security flaw) with type="access" or "refresh" and later in during verification if(decoded.type !== expectedType) ensures strict token separation
    return jwt.sign({ ...payload, type }, secret, { expiresIn ,issuer:config.app.issuer}); // returns created token (containing header.payload.signature) , later we can use {data:payload,type} also  , jwt internally maintains expiresIn ,iat and other options so it is better to send them as options otherwise we have to do things manually ,{...payload,type} this "type" allows decoded.type !== expectedType 
}

function verifyExpectedTypeToken(receivedToken, secret, expectedType) {// to verify we only need token received and secret to match whether received token's payload can generate same signature as received signture in token or not as w/o secret specific payload cant generate specific signature so we match received signature vs calculated signature + expiry + issuer/audience 
    try {
        const decoded = jwt.verify(receivedToken, secret); //returns decoded payload on success , decoded contains payload+extra fields like expiresIn and iat (internally)

        if (decoded.type !== expectedType) {
            throw new AppError(`Invalid ${expectedType} token`, 401);
        }
        return decoded; // returning decoded payload 
    } catch (error) {
        throw new AppError(`${expectedType} token invalid or expired`,401);
        
    }
}

export function generateAccessToken(payload) {
    return signToken(payload, JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN, "access"); // returns created token (containing header.payload.signature)
}

export function generateRefreshToken(payload) {
    return signToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN, "refresh");
}

export function verifyAccessToken(receivedToken) {   //to verify we need received token and secret (stored internally) so only 1 arg
    return verifyExpectedTypeToken(receivedToken, JWT_ACCESS_SECRET, "access"); // returns decoded payload on success

}

export function verifyRefreshToken(receivedToken) {   //to verify we need received token and secret (stored internally) so only 1 arg
    return verifyExpectedTypeToken(receivedToken, JWT_REFRESH_SECRET, "refresh"); // returns decoded payload on success

}