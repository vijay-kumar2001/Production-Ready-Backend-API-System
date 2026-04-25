import path from "path";
import fs from "fs";
import axios from 'axios';
import * as tar from 'tar' // .tar is archive format and to handle that we imported tar package
import { config } from "../config/env.js";

const GEO_DB_FILE_PATH=path.resolve(config.geoDb.geoDbFilePath); //retrieving file path and will resolve folder from that 
const GEO_DB_DIR=path.dirname(GEO_DB_FILE_PATH); // resolve converts relative path to absolute(avoids ambiguity & works reliably in production)
// we previously used __filename, __dirname , bcuz that can be used when path is relative to file locaion and reolse is simple when path is relative to project root
//so when relative to file use __dirname and when relative to project roo simply use path.resolve 

export async function downloadGeoDB() {
    if(fs.existsSync(GEO_DB_FILE_PATH)){ // this will run during app startup so to check if file exists  we can block it , this function accepts file path(checks if file exists , ex : fs.existsSync("file.txt")) and directory path (checks if folder exists , ex : fs.existsSync("folder/")) , we are checking file and not folder here , this also prevent redownloading and saves bandwidth
        console.log("Geo DB already exists");
        return;
    }

    const licenseKey=process.env.MAXMIND_LICENSE_KEY;

    if(!licenseKey){
        console.log("No. Maxmind License Key , skipping download...")
        return;
    }

    const url=`https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=${licenseKey}&suffix=tar.gz`

    const tarFilePath=path.join(GEO_DB_DIR,'geo.tar.gz');

    fs.mkdirSync(GEO_DB_DIR, { recursive: true }); // creating folder where file should exist (this will be reached only if file does not exists)

    const response = await axios({
        url,
        method:"GET",
        responseType:"stream" // ie dont load full file in memory but chunk by chunk (stream)
    }) // axios is better for file downloads 

    console.log("Downloading Geo DB...")
    await new Promise((resolve,reject)=>{   //manually creating promise as pipe() is event based and not awaitable
        const stream =fs.createWriteStream(tarFilePath); // this creates a writeable stream , it will write data into geo.taz.gz file
        response.data.pipe(stream); //connects download stream to file stream , so internet -> axios stream -> file
        stream.on("finish",resolve); //writing complete ,download succesful
        stream.on("error",reject); // any error-> reject promise , ex: network failure , disk write error 
    })

    console.log("Extracting GEO DB...");

    await tar.x({
        file:tarFilePath,
        cwd: GEO_DB_DIR
    }); // extract archive and put extracted files into GEO_DB_DIR (bcuz maxmind gives compresssed archivea nd not directly file);

    // find mmdb inside extracted folder ??
    const folder = fs.readdirSync(GEO_DB_DIR).find(file=>file.includes("GeoLite2-City") && fs.statSync(path.join(GEO_DB_DIR, file)).isDirectory());
    if(!folder){
        throw new Error("Downloaded Geo DB archive does not contain GeoLite2-City folder");
    }
    const mmdbPath=path.join(GEO_DB_DIR,folder,"GeoLite2-City.mmdb");

    fs.renameSync(mmdbPath,GEO_DB_FILE_PATH); // this renames downlaoded file to our expected name
    // ex : 
    // Before:
    // src/geo/GeoLite2-City_2024_03/GeoLite2-City.mmdb
    // After:
    // src/geo/GeoLite2-City.mmdb

    fs.rmSync(path.join(GEO_DB_DIR,folder),{recursive:true , force : true}); // removing extracted folder(temporary)
    fs.rmSync(tarFilePath); // removing tar.gz file(temporary)

    console.log("Geo DB ready!");
}
