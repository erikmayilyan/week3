const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require('dotenv');

dotenv.config();

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion
});

async function uploadImage(imageBuffer, imageName, mimetype) {
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: imageBuffer,
    ContentType: mimetype
  }

  const command = new PutObjectCommand(params)
  const data = await s3.send(command)

  return data
}

exports.uploadImage = uploadImage;