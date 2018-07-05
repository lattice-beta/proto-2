const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const shortid = require('shortid');

const apiRoutes = express.Router();

const Folder = require('../models/folder.js');
const Page = require('../models/page.js');
const User = require('../models/user.js');

// Amazon s3 config
const s3 = new AWS.S3();

const credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.credentials = credentials;


const myBucket = 'peblio-files';
// Multer config
// memory storage keeps file data in a buffer
const upload = multer({
  storage: multer.memoryStorage(),
    // file size limitation in bytes
  limits: { fileSize: 52428800 },
});

apiRoutes.route('/examples').get(getExamples);
apiRoutes.route('/page/:id').get(getPage);
apiRoutes.route('/user').get(getUser);
apiRoutes.route('/sketches').get(getSketches);
apiRoutes.route('/upload').post(upload.single('uploadImageFile'), uploadFiles);

function uploadFiles(req, res) {
  const fileName = `test/${shortid.generate()}_${req.file.originalname}`;
  const params = {
    Bucket: myBucket,
    Key: fileName,
    Body: req.file.buffer,
    ACL: 'public-read'
  };
  s3.putObject(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(fileName);
    }
  });
}

function getPage(req, res) {
  Page.find({ id: req.params.id }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
}

function getUser(req, res) {
  let name = null;
  let pages = null;
  if (req.user) {
    name = req.user.name;
    pages = req.user.pages;
  }
  res.send({ name, pages });
}

function getSketches(req, res) {
  if (!req.user) {
    res.status(403).send({ error: 'Please log in first' });
    return;
  }
  const user = req.user;
  Promise.all([
    Page.find({ id: { $in: user.pages } }).exec(),
    Folder.find({ user: user._id }).exec()
  ])
  .then(([pages, folders]) => {
    res.send({ pages, folders });
  })
  .catch(err => res.send(err));
}

function getExamples(req, res) {
  User.find({ name: 'peblioexamples' }, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      Page.find({ id: { $in: data[0].pages } }, (err, data) => {
        if (err) {
          res.send(err);
        } else {
          res.send(data);
        }
      });
    }
  });
}

module.exports = apiRoutes;