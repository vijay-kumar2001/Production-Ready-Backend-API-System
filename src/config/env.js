import dotenv from 'dotenv'
import path from "path"
import { fileURLToPath } from 'url'


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const envPath = path.join(__dirname, "../env/development.env");

// // Resolve the env file relative to this module so startup works from any cwd.
// dotenv.config({ path: envPath })
dotenv.config() ; //automatically loads .env from root


// we will pass default value to all functions except for required ones 

function getRequiredEnv(name) { // for required values 
    const value = process.env[name];
    if (value === undefined || value === "") {
        throw new Error(`${name} is required`);
    }
    return value;
}

function getOptionalEnv(name, defaultValue) {   // used if value could be any value(still string type )
    const value = process.env[name];
    if (value === undefined || value === "") {
        return defaultValue;
    }
    return value;
}

function getEnvNumber(name, defaultValue) { // used if values should be no.
    const value = process.env[name];
    if (value === undefined || value === "") {
        return defaultValue;    //if not available then return default value
    }

    const num = Number(value);    //converting vlaue to no.

    if (Number.isNaN(num)) {  // checking if value is valid no. or not 
        throw new Error(`${name} must be a valid number`);
    }

    return num; //if valid no. then return it
}

function getEnvBoolean(name, defaultValue) {    // used if value should be true/false
    const value = process.env[name];
    if (value === undefined || value === "") {
        return defaultValue;
    }
    const normalised = value.toLowerCase();   // normalising value to prevent duplicate values like to get true for TRUE/True/yes/Yes/1,YES,true and likewise for false

    //creating array for these values is not much useful as they are not used again
    if (["true", "1", "yes"].includes(normalised)) {//0 is also string as all values are in string format in env unless they are onverted to no.
        return true;
    }
    if (["false", "0", "no"].includes(normalised)) {
        return false;
    }
    throw new Error(`${name} must be true or false`)

}

const sharedJwtSecret = getRequiredEnv("JWT_SECRET");
const nodeEnv = getOptionalEnv("NODE_ENV", "development");

export const config = {
    server: {
        port: getEnvNumber("PORT", 3000)   // this should be no. as by default values are string so we need it in number format
        , dbUrl: getRequiredEnv("DB_URL"),
        nodeEnv,
        trustProxy: getEnvBoolean("TRUST_PROXY", false)
    },
    jwt: {
        accessSecret: getOptionalEnv("JWT_ACCESS_SECRET", sharedJwtSecret),// as it is under jwt so we are using accessSecret and not jwtAccessSecret as using jwt is redundant now , also since we have share secret as fallback so we are using getOptionalEnv 
        refreshSecret: getOptionalEnv("JWT_REFRESH_SECRET", sharedJwtSecret),
        accessExpiresIn: getOptionalEnv("JWT_ACCESS_EXPIRES_IN", "5m"), //jwt expects string and not no. 
        refreshExpiresIn: getOptionalEnv("JWT_REFRESH_EXPIRES_IN", "7d")
    },
    session: {
        expiresIn: getEnvNumber("SESSION_EXPIRES_IN", 7 * 24 * 60 * 60 * 1000)
    },
    cookies: {
        secure: getEnvBoolean("COOKIE_SECURE", nodeEnv === "production"),
        sameSite: getOptionalEnv("COOKIE_SAME_SITE", "strict"),
        refreshMaxAge: getEnvNumber("COOKIE_REFRESH_MAX_AGE", 7 * 24 * 60 * 60 * 1000)
    },
    admin: {
        seedOnStart: getEnvBoolean("SEED_ADMIN_ON_START", false),
        email: getOptionalEnv("ADMIN_EMAIL", "admin@system.com"),
        password: getOptionalEnv("ADMIN_PASSWORD", "adminPassword123")
    },
    app:{
        issuer:getOptionalEnv("APP_NAME","auth-backend")
    },
    geoDb:{
        licenseKey:getOptionalEnv('MAXMIND_LICENSE_KEY',null),
        geoDbFilePath:getOptionalEnv("GEO_DB_FILE_PATH","src/geo/GeoLite2-City.mmdb")
    }
};