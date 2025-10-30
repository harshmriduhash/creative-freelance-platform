const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// @desc    Upload single file
// @route   POST /api/files/upload
// @access  Private
router.post("/upload", protect, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      success: true,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`,
        url: `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Upload multiple files
// @route   POST /api/files/upload-multiple
// @access  Private
router.post(
  "/upload-multiple",
  protect,
  upload.array("files", 10),
  (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const files = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        path: `/uploads/${file.filename}`,
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      }));

      res.json({ success: true, files });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// @desc    Download/serve file
// @route   GET /api/files/:filename
// @access  Public (can add protection if needed)
router.get("/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.sendFile(path.resolve(filePath));
});

// @desc    Delete file
// @route   DELETE /api/files/:filename
// @access  Private
router.delete("/:filename", protect, (req, res) => {
  try {
    const filePath = path.join(uploadDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlinkSync(filePath);

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
