const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require("fs").promises;
require('dotenv').config();
const { createArchive, uploadFile, generateSignedUrl, storage, bucketName } = require('./storage'); // import helper funcs

const app = express();
app.use(cors());
app.use(express.json());

//ensure uploads folder exists
const ensureUploadsFolder = async () => {
  try {
    const uploadsPath = path.join(__dirname, "uploads"); 
    await fs.mkdir(uploadsPath, { recursive: true }); //create folder if it's not there
    console.log(`Ensured uploads folder exists: ${uploadsPath}`);
  } catch (err) {
    console.error("Failed to ensure uploads folder exists", err);
    process.exit(1); // exit if failed
  }
};

ensureUploadsFolder();

const upload = multer({
  dest: 'uploads/', // temp folder for uploads
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // file size limit
});

// file upload endpoint
app.post("/upload", upload.array("file", 10), async (req, res) => {
  console.log("Received POST request to /upload endpoint");
  try {
    console.log("Request files data:", req.files);

    if (!req.files || req.files.length === 0) {
      console.error("No files provided in the request");
      return res.status(400).json({ message: "No files uploaded" });
    }

    // archive for the uploaded files
    const archiveName = `archive-${Date.now()}.zip`;
    const archivePath = await createArchive(req.files, archiveName);

    //archive upload to cloud 
    const destination = `archives/${archiveName}`;
    await storage.bucket(bucketName).upload(archivePath, {
      destination,
    });
    console.log(`File uploaded successfully to ${destination}`);

    //cleanup (delete the local archives)
    await fs.unlink(archivePath);
    console.log(`Deleted local archive: ${archivePath}`);

    //generate url for uploaded archive
    const signedUrl = await generateSignedUrl(destination);

    res.status(200).json({
      message: "Files uploaded and archived successfully!",
      archiveUrl: signedUrl, //return signed url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to upload and archive files",
      error: err.message,
    });
  }
});

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
