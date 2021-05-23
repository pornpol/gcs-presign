// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

const port = 3001

const storage = new Storage({keyFilename: '/secrets/gcs.json'});

async function generateV4ReadSignedUrl(fileName) {
  // These options will allow temporary read access to the file
  const options = {
    version: 'v4',
    action: 'write',
    method: 'PUT',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  // Get a v4 signed URL for reading the file
  const [url] = await storage.bucket('central-development').file(`uploads/budget/${fileName}`).getSignedUrl(options);

  return url;
}

app.get('/presign/s3/params', async (req, res) => {
  console.log(req.query)
  const {filename, type} =  req.query;

  url = await generateV4ReadSignedUrl(filename);

  res.json({ url, method: "PUT" })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})