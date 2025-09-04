const express = require("express");
const multer = require("multer");
require("dotenv").config();
const B2 = require("backblaze-b2");

const backblazeAppkeyID = process.env.BACKBLAZE_APPKEY_ID;
const backblazeAppkey = process.env.BACKBLAZE_APPKEY;
const backblazeBucketID = process.env.BACKBLAZE_BUCKET_ID;

const b2 = new B2({
  applicationKeyId: backblazeAppkeyID, // accountid
  applicationKey: backblazeAppkey, // masterkey
});

async function getFileInfo(id) {
  try {
    await b2.authorize();

    const result = await b2.getFileInfo({
      fileId: id,
    });
    return result?.data;
  } catch (error) {
    return false;
    console.error(error);
  }
}

async function uploadFile(file, filename) {
  try {
    await b2.authorize();

    const uploadUrlRes = await b2.getUploadUrl({
      bucketId: backblazeBucketID,
    });

    const res = await b2.uploadFile({
      uploadUrl: uploadUrlRes.data.uploadUrl,
      uploadAuthToken: uploadUrlRes.data.authorizationToken,
      fileName: filename,
      data: file,
    });

    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function downloadFile(id) {
  try {
    await b2.authorize();

    const res = await b2.downloadFileById({
      fileId: id,
      responseType: "arraybuffer", // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    });
    return res;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getFiles() {
  try {
    await b2.authorize();

    const res = await b2.listFileNames({
      bucketId: backblazeBucketID,
      maxFileCount: 10000,
    });
    const filesResult = res.data.files;
    let files = [];

    filesResult.forEach((file) => {
      const date = new Date(file.uploadTimestamp); 

      files.push({
        fileName: file.fileName,
        id: file.fileId,
        uploadDate: date.toISOString().split("T")[0], // in ms
        contentType: file.contentType,
        sizeMb: Math.ceil(file.contentLength / 1000000),
      });
    });

    return files;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  uploadFile,
  getFileInfo,
  downloadFile,
  getFiles,
};
