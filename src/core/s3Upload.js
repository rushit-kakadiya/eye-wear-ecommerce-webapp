const AWS = require('aws-sdk');
const config = require('config');
const fs = require('fs');
const slugify = require('slugify');
const { generateRandom, fileFilter } = require('./utils');
const constants = require('./constants');

AWS.config.credentials = {
  //region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
};

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const uploadFile = async (uploadJson) => {
  let params = {
    Bucket: uploadJson.bucket,
    Key: uploadJson.key,
    Body: fs.readFileSync(uploadJson.body.path)
  };

  if (uploadJson.public == true) {
    params.ACL = 'public-read';
  }

  const response = await s3.upload(params);
  console.log('-------------', response);
  fs.unlink(uploadJson.body.path, function (err) { console.log('Error: ', err); });
  return true;
};

/************ File upload handler*****************/
const handleFileUpload = (uploadJson, folderName = '', bucket = '') => {
  if (!fileFilter(uploadJson.body.originalFilename)) throw new Error('Type is not allowed!');
  const file_buffer = fs.readFileSync(uploadJson.body.path),
    filename = slugify(`${generateRandom(5)}_${uploadJson.body.originalFilename}`),
    folder = folderName || config.aws.folder,
    mimeType = uploadJson.body.type,
    bucketName = bucket || config.aws.bucket;
  //console.log("file_buffer", file_buffer);
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: folder + '/' + filename,
      Body: file_buffer,
      ACL: 'public-read',
      ContentType: uploadJson.body.type
    };
    //console.log(params, "uploadJson", uploadJson);
    s3.putObject(params, (err, data) => {
      if (err) return reject(err);
      else {
        const fileDetails = {
          fileName: `${folder}/${filename}`,
          mimetype: uploadJson.body.type
        };
        resolve(fileDetails);
      }
    });
  });
};


const pdfFileUpload = (filename, folder, buffer, ContentType = 'application/pdf') => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: constants.bucket.product,
      Key: folder + '/' + filename,
      Body: buffer,
      ACL: 'public-read',
      ContentType
    };

    s3.putObject(params, (err, data) => {
      if (err) return reject(err);
      else {
        const fileDetails = {
          fileName: `${folder}/${filename}`
        };
        resolve(fileDetails);
      }
    });
  });
};



const storeImageUpload = (uploadJson, folderName = '', fileName = '') => {
  return new Promise((resolve, reject) => {

    const buffer = fs.readFileSync(uploadJson.body.path);
    const filename = fileName;
    const mimeType = uploadJson.body.type;

    const params = {
      Bucket: constants.bucket.product,
      Key: folderName + '/' + fileName,
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimeType
    };

    s3.putObject(params, (err, data) => {
      if (err) return reject(err);
      else {
        const fileDetails = {
          fileName: `${folderName}/${filename}`
        };
        resolve(fileDetails);
      }
    });
  });
};


const getFile = async (getJson) => {
  let params = {
    Bucket: getJson.bucket,
    Key: getJson.key
  };
  const response = await s3.getObject(params);
  // response.Body.toString('utf-8');
  console.log('-------------', response);
  return true;
};


module.exports = {
  uploadFile,
  handleFileUpload,
  pdfFileUpload,
  storeImageUpload,
  getFile
};
