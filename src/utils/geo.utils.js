import maxmind from 'maxmind'
import path from 'path'
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const geoDbPath = path.join(__dirname, "../geo/GeoLite2-City.mmdb");


// this file will be used typically for login/session tracking


let lookup = null; // so that lookup can be updated and used outside of initGeo function also and does not contain garbage value

// first initialization function
export async function initGeo() {    // this performs single action of starting geo db thus it is utility func , and as it should be called in app before server starts so we exported it
    lookup = await maxmind.open(geoDbPath); // await bcuz db opening is heavy operation : load file into memory , create lookup obj
    if(!lookup){
        console.warn("Geo db not intialised")
    }
}



// in production : client -> proxy -> express , thus multiple ip sources so we need to figure out real client ip
// also controllers need ip for logging,session and security
export function getClientIp(req) { // this is used to get ip of client , this will be used/called in controller thus we are exporting it and as it also performs core task of getting ip which is related to geo db retrieval or ip things that is why this is also in geo utils
    const forwardedFor = req.headers["x-forwarded-for"]; //x-forwarded-for : real client ip proxy forwarded request for 
    const forwardedIp = typeof forwardedFor === "string" ? forwardedFor.split(",")[0] : null; //forwarded.split(",") will return array and we then retrieve values as array[0] , split()[0] bcuz 1st ip is client ip  , headers can be string,array or undefined so safe handling by checking
    return normalizeIp(forwardedIp || req.ip || req.socket?.remoteAddress || null); //mulitple fallbacks bcuz env varies , forwardedIp : real ip(if proxy exist) , req.ip : express abstraction , req.socket?.remoteAddress : raw node.js socket ip

}


// sometimes node give ip in ipv6 format ,eg : ::ffff:127.0.0.1 , so we normalize it to ipv4 
// converts different formats -> consistent format
function normalizeIp(ip) { //this is used by functions of this file so no need to export as it is not directly used by any other function out of this file but indirectly only
    if (!ip) {
        return null;
    }
    const cleanedIp = ip.replace("::ffff:", "").trim(); // replace replaces 1st arg with 2nd arg and trim removes starting and ending spaces (not middle ones ) , Result "::ffff:127.0.0.1" → "127.0.0.1"
    return cleanedIp === "::1" ? "127.0.0.1" : cleanedIp; // this can be stored in var and then returned but that is unnecessary as if value is to be used somewhere else also then it should be stored in var else it should be calculated and used w/o storing in var this prevents memory also and is clean 

}



// local ips or private ips does not exist in geo db so if it is private/local skip lookup 
function isPrivateOrLocalIp(ip) {
    return (
        ip === "127.0.0.1" ||   // localhost
         ip === "0.0.0.0" || // special (any address)
         ip.startsWith("10.") || // private network , .startsWith("10.") not .startsWith("10") otherwise 100. will also match
          ip.startsWith("192.168.") ||   // home networks , "." ensures correct sub net match
          /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip))   // matches: 172.16.0.0 → 172.31.255.255
}


export function getLocationFromIp(ip) { // this is the main function that will be used to find location from ip by looking in geo db that is why it is exported
    const normalizedIp = normalizeIp(ip);
    // geo db only maps public ip not private ones
    if (!lookup || !normalizedIp || isPrivateOrLocalIp(normalizedIp)) { //checking if everything is fine then move forward else return unknown , that warning in startup function of db startup failure is handled here by returning unknown when it will be tried to be used  , !lookup : db not loaded , !normalizedIp : invalid input , private : no location in db for it  , isPrivateOrLocalIp(normalizedIp) not isPrivateOrLocalIp(ip)
        return "unknown";
    }
    const data = lookup.get(normalizedIp); // returns geo data
    if(!data){
        return "unknown";
    }

    // formating data if available
    const city=data.city?.names?.en; // "?." : optional chaining ie if key exist then access its value else return undefined(no crash) 
    const region=data.subdivisions?.[0]?.names?.en;
    const country=data.country?.names?.en;
    return [city,region,country].filter(Boolean).join(", ") || "unknown"; // some fields might be missing like [undefined,Delhi,India] so filter(Boolean) removes falsy values , .filter() returns array of values that satisfy given condition so .filter(Boolean) Removes: null, undefined, "", false then array is converted to string with components joined with ", "
}
// External data (like IP) is unreliable — always normalize, validate, and safely fallback.

