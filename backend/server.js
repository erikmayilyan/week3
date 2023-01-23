const dotenv = require('dotenv').config();
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const database = require('./database');

const upload = multer({ dest: 'images/' })

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("build"));

// app.get('/api/image/*', (req, res) => {
//   const imagePath = req.params[0]
//   const readStream = fs.createReadStream(`${imagePath}`)
//   readStream.pipe(res)
// });

app.get("/api/images", async (req, res) => {
  // send an array of the image objects from the database
  const result = await database.getImages();
  console.log(result);
  res.send(result);
});

app.post('/api/images', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;
  const description = req.body.description;
  console.log(req.file);
  const result = await database.addImage(imagePath, description);
  res.send(result);
});

app.get("/api/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
})

/*
app.post('/api/images', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;
  const description = req.body.description;
  console.log(description, imagePath)
  res.send({description, imagePath})
});
*/

app.listen(8080, () => console.log("listening on port 8080"))
