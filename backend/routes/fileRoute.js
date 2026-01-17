const express = require("express");
const multer = require("multer");
const router = express.Router();
require("dotenv").config();
const { uploadFile, getFileInfo, downloadFile, getFiles, deleteFile } = require("../controllers/fileController.js");

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  const filename = req.file.originalname;
  const file = req.file.buffer;

  try {
    const result = await uploadFile(file, filename);
    console.log(result);
    if (result.status == 200) {
      res.status(200).send({ success: true, message: "File uploaded" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to upload file");
  }
});

router.get("/download/:fileID", async (req, res) => {
  const { fileID } = req.params;

  const fileInfo = await getFileInfo(fileID);

  if (!fileInfo) {
    res.status(400).send({ success: false, message: "Unknown file" });
    return;
  }

  const result = await downloadFile(fileID);

  const fileName = fileInfo.fileName;
  const contentType = result.headers["content-type"];

  const encodedFileName = encodeURIComponent(fileName);

  const contentDisposition =
    contentType === "application/pdf" ? `inline; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}` : `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`;

  res.setHeader("Content-Disposition", contentDisposition);

  if (contentType == "application/pdf") {
    res.setHeader("Content-Type", "application/pdf");
  }

  res.status(200).send(result.data);
});

router.get("/list", async (req, res) => {
  const files = await getFiles();

  if (!files) {
    res.status(500).send({ success: false, message: "Unknown error" });
    return;
  }

  res.status(200).send({ success: true, message: "File list created.", files: files });
});

router.delete("/remove/:fileID", async (req, res) => {
  const { fileID } = req.params;

  const deleteRes = await deleteFile(fileID);
  if (!deleteRes) {
    res.status(500).send({ success: false, message: "Unknown error" });
    return;
  }

  res.status(200).send({ success: true, message: "File removed." });
});
module.exports = router;
