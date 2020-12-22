const multer = require('multer');
const shortid = require('shortid');
const Page = require('../models/page.js');
const Folder = require('../models/folder.js');
const User = require('../models/user.js');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const credentials = new AWS.SharedIniFileCredentials();
import * as classroomService from '../service/classroomService';
AWS.config.credentials = credentials;
const myBucket = process.env.S3_BUCKET;

const axios =require('axios');
// Multer config
// memory storage keeps file data in a buffer
const upload = multer({
  storage: multer.memoryStorage(),
  // file size limitation in bytes
  limits: { fileSize: 52428800 },
});


export function authenticatePage(req, res) {
  if (!req.user) {
    res.send(false);
  } else {
    Page.find({ id: req.params.id }, (err, data) => {
    if (err || !data || data.length === 0){
        res.send(false);
      } else {
        res.send(data[0].user.toString() === req.user._id.toString());
      }
    });
  }
}

export function uploadFiles(req, res) {
  const fileName =
  `${req.params.user}/${req.params.type}/${shortid.generate()}_${req.query.filename}`;
  const params = {
    Bucket: myBucket,
    Key: fileName,
    Expires: 60,
    ContentType: req.query.filetype,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', params, (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.send(data);
  });
}

export async function getFileInfo(req, res) {
  let user = req.user;
  if(!user){
    res.status(403).send({err: 'Please log in first'});
    return;
  }
  const params = {
    Bucket: myBucket,
    Delimiter: '/',
    Prefix: `${user.name}/images/`
  };
  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      res.send(err);
    }
    const sizeArray = data.Contents.map( content => content.Size);
    const totalSize = sizeArray.reduce((sum, n) => sum + n, 0);
    return classroomService.getMemoryAllowed(req, res)
    .then(totalmemory => {
      return res.status(200).send({
        data,
        size: totalSize,
        totalmemory,
        unit: 'bytes'
      });
    });
  });
}

export function getSketches(req, res) {
  // TODO: make the request async
  if (!req.params.user) {
    if (!req.user) {
      res.status(403).send({ error: 'Please log in first or specify a user' });
      return;
    }
  }
  let user = req.user;
  const folderSortBy = req.query.folderSortBy ? req.query.folderSortBy : '-updatedAt'
  const fileSortBy = req.query.fileSortBy ? req.query.fileSortBy : '-updatedAt';
  if (req.params.user) {
    User.findOne({ name: req.params.user }, (userFindError, data) => {
      if (userFindError || !data) {
        res.status(404).send({ error: userFindError });
        return;
      } else if (data.type === 'student') {
        res.status(403).send({ error: 'This users data cannot be accessed' });
        return;
      } else {
        user = data;
        Promise.all([
          Page
          .find({ user: user._id, trashedAt: null, deletedAt:null })
          .select({ editors:0, layout:0, workspace:0})
          .sort(fileSortBy)
          .exec(),

          Folder
          .find({ user: user._id})
          .sort("_id")
          .exec()
        ])
          .then(([pages, folders]) => {
            res.status(200).send({pages,folders});
          })
          .catch(err => res.status(500).send(err));
          return;
      }
    });
  } else {
    Promise.all([
      Page
      .find({ user: user._id, trashedAt: null, deletedAt:null })
      .select({ editors:0, layout:0, workspace:0})
      .sort(fileSortBy)
      .exec(),

      Folder
      .find({ user: user._id})
      .sort(folderSortBy)
      .exec()
    ])
      .then(([pages, folders]) => {
        res.send({ pages, folders });
      })
      .catch(err => res.status(500).send(err));
      return;
  }
}

export function getNewsletters(req, res) {
  return axios.get('https://raw.githubusercontent.com/peblio/Newsletters/master/newsletters.json')
    .then((result) => {
      res.status(200).send(result.data);
    })
    .catch(err => res.status(500).send(err));
}
