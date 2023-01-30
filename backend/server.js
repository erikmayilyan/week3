const dotenv = require('dotenv').config();
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const database = require('./database');
const crypto = require('crypto');
const s3 = require('./s3');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("build"));

// app.get('/api/image/*', (req, res) => {
//   const imagePath = req.params[0]
//   const readStream = fs.createReadStream(`${imagePath}`)
//   readStream.pipe(res)
// });

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.get("/api/images", async (req, res) => {
  // send an array of the image objects from the database
  const result = await database.getImages();
  console.log(result);
  res.send(result);
});

app.post('/api/images', upload.single('image'), async (req, res) => {
  /*
  const description = req.body.description
  const fileBuffer = req.file.buffer
  const mimetype = req.file.mimetype
  const fileName = "file_name"

  // Store the image in s3
  const s3Result = await s3.uploadImage(fileBuffer, fileName, mimetype)

  // Store the image in the database
  const databaseResult = await database.addImage(fileName, description)

  res.status(201).send(s3Result);
  */
  const detail = req.body.text;
  const fileBuffer = req.file.buffer;
  const imagePath = generateFileName();
  const mimetype = req.file.mimetype;

  // Store the image in s3
  const s3Result = await s3.uploadImage(imagePath, fileBuffer, mimetype);

  // Database
  const result = await database.addImage(imagePath, detail);

  res.status(201).send(result);
});

app.get("/api/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
});

app.listen(8080, () => console.log("listening on port 8080"))
