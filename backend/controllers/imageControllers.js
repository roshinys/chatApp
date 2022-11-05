const AWS = require("aws-sdk");

async function uploadtos3(data, filename, contentType) {
  const BucketName = process.env.BUCKETNAME;
  const IAMUSERKEY = process.env.IAMUSERKEY;
  const IAMUSERSECRET = process.env.IAMUSERSECRETKEY;
  //   console.log("=======>", BucketName, IAMUSERKEY, IAMUSERSECRET);
  let s3bucket = new AWS.S3({
    accessKeyId: IAMUSERKEY,
    secretAccessKey: IAMUSERSECRET,
  });

  var params = {
    Bucket: BucketName,
    Key: filename,
    Body: data,
    ACL: "public-read",
    ContentType: contentType,
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("smtg went wrong", err);
        reject(err);
      } else {
        // console.log("succesfully uploaded to s3", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

exports.newImage = async (req, res) => {
  try {
    const body = req.body;
    const imgfile = req.file.buffer;
    console.log(imgfile, body, req.file);
    const fileUrl = await uploadtos3(
      imgfile,
      req.file.originalname,
      req.file.mimetype
    );
    res.json({ success: true, msg: "file uploaded ", fileUrl });
  } catch (err) {
    console.log(err);
    res.json({ success: true, msg: "failed to upload file " });
  }
};
