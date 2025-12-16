const {GetObjectCommand, S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
const fs = require("node:fs/promises");
const ffmpeg = require("fluent-ffmpeg");
const { createReadStream, existsSync, mkdirSync } = require("node:fs");
const path = require("node:path");
// config env file
require("dotenv").config();

// Set variables
const originalFilePath = process.env.KEY;
const outputBasePath = 'transcoded-videos';
const segmentTime = 10;
const codecVideo = 'libx264';
const codecAudio = 'aac';

const resolutions = [
  { width: 1920, height: 1080 },
  { width: 1280, height: 720 },
  { width: 854, height: 480 },
  { width: 640, height: 360 },
//   { width: 256, height: 144 }
];

// Function to generate HLS for each resolution
const generateHLS = (input, outputDir, width, height) => {
    return new Promise((resolve, reject) => {
        // Ensure directory exists
        if (!existsSync(outputDir)){
            mkdirSync(outputDir, { recursive: true });
        }

        const segmentFilePath = path.resolve(outputDir, 'segment_%03d.ts');
        const playlistPath = path.resolve(outputDir, 'playlist.m3u8');

        // Run ffmpeg command
        ffmpeg(input)
        .videoCodec(codecVideo) 
        .audioCodec(codecAudio)
        .size(`${width}x${height}`)
        .outputOptions([
            `-hls_time ${segmentTime}`, // segment duration for the HLS playlist
            `-hls_playlist_type vod`, // Playlist type is VOD (Video on Demand), meaning the entire playlist will be available for playback (as opposed to live streaming where segments are added over time).
            `-hls_segment_filename ${segmentFilePath}`, //naming format for the HLS segments
            `-start_number 0`, //starting segment number to 0, so the first segment will be named segment000.ts
            `-preset medium` // Balance between compression and speed
        ])
        .on('end', () => {
            console.log(`HLS generated for ${width}x${height}`);
            resolve(playlistPath);
        })
        .on('error', (err) => {
            console.error(`Error processing ${width}x${height}: ${err.message}`);
            reject(err);
        })
        .save(playlistPath);
    });
    };


// get files of directory
const getFiles = async (dir) => {
    const dirents = await fs.readdir(dir, {withFileTypes: true});

    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.join(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }))

    return Array.prototype.concat(...files);
}


const uploadDir = async (client, dir) => {
    const files = await getFiles(dir.localPath);
    const UPLOAD_BUCKET_NAME = process.env.UPLOAD_BUCKET_NAME;
    const uploads = files.map(async (filePath) => {
        const fileName = filePath.split('/').pop();
        const bodyData = createReadStream(path.resolve(filePath));
        client.send(new PutObjectCommand({
            Bucket: UPLOAD_BUCKET_NAME,
            Key: `${dir.objectStorePath}/${fileName}`,
            Body: bodyData,
        }));    
        return filePath;
    })

    console.log(`upload successfully directory: ${dir.objectStorePath}`);
    
    return Promise.all(uploads);

}

const extractIdFromPath = (path) => {
  const fileName = path.split("/").pop() || '';
  return fileName.split(".")[0];
}

// download the video
async function init(){
    try {
        const client = new S3Client({
            region: process.env.AWS_REGION,
            endpoint: "http://localstack:4566", // For localstack
            forcePathStyle:true, // for localstack
            
            // credentials:{
            //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            // },
            // requestHandler: {
            //     requestTimeout:0,
            //     httpsAgent: {
            //         maxSockets: 25
            //     }
            // }
        });
        
        const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
        const KEY = process.env.KEY;
        const videoId = extractIdFromPath(originalFilePath)

        const videoFile = await client.send(new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: KEY,
        }))

        
        const dir = path.dirname(originalFilePath);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
        
        await fs.writeFile(originalFilePath, videoFile.Body);
        console.log("file downloaded successfully", originalFilePath);
        
        // transcode video
        const promises = [];    
        const outputDirs = [];
        for (const { width, height } of resolutions) {
            const outputDir = path.resolve(outputBasePath, `${width}x${height}`);
            promises.push(generateHLS(originalFilePath, outputDir, width, height));
            // outputDirs.push(`${outputBasePath}/${width}x${height}`); // path of s3 files to be upload
            outputDirs.push({
                localPath:`${outputBasePath}/${width}x${height}`, // local file system path
                objectStorePath: `${videoId}/${width}x${height}`, // path of s3 files to be upload
            })
        }

        const videoFiles = await Promise.all(promises);
        console.log("transcode video files", videoFiles);

        // upload the video
        const uploadResults = [];
        for(const dir of outputDirs) {
           uploadResults.push(uploadDir(client, dir));
        }
        const uplaodResult = await Promise.all(uploadResults);
        console.log("Upload results", uplaodResult);
    }
    catch(error) {
        console.log("error", error);
    }
}


init();