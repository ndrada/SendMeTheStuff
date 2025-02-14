const { Storage } = require('@google-cloud/storage');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const storage = new Storage({
  keyFilename: './google-cloud-key.json',
  projectId: '', //project name goes here
});

const bucketName = ''; //bucket name goes here

//generate a signed URL for a file
const generateSignedUrl = async (fileName) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
  return url;
};

//archive files into a single .zip
const createArchive = async (files, archiveName) => {
  const outputPath = path.join(__dirname, archiveName);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve(outputPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    files.forEach((file) => archive.file(file.path, { name: file.originalname }));
    archive.finalize();
  });
};

//upload file to google cloud
const uploadFile = async (filePath, destination) => {
  await storage.bucket(bucketName).upload(filePath, {
    destination,
  });
  console.log(`${filePath} uploaded to ${bucketName}`);
  return generateSignedUrl(destination); // return a signed URL for the uploaded file
};

module.exports = { createArchive, uploadFile, generateSignedUrl, storage, bucketName };
