const express = require("express");
const multer = require("multer");
const router = express.Router();
require("dotenv").config();
const { uploadFile, getFileInfo, downloadFile, getFiles } = require("../controllers/fileController.js");

/*router.get("/", async (req, res) => {
  try {
    const sectors = await sectorController.getAllSectors();
    return res.status(200).send(sectors);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});*/

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

  res.set("Content-Disposition", `inline; filename=${fileName}`);
  res.status(200).send(result.data);
});

router.get("/list", async (req, res) => {
  const files = await getFiles();
  console.log(files);

  if (!files) {
    res.status(500).send({ success: false, message: "Unknown error" });
    return;
  }

  res.status(200).send({ success: true, message: "File list created.", files: files });
});

module.exports = router;
