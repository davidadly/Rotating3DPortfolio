const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadVideo = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dirPath = path.resolve(
        __dirname,
        `../public/assets/feature-videos/`
      );

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        return cb(null, dirPath);
      }
      return cb(null, dirPath);
    },
    filename: (req, file, cb) => {
      const { originalname } = file;
      const filename = `${Date.now()}-${originalname}`;
      req.filename = filename;
      return cb(null, filename);
    },
  }),
});

const addFeatureVideo = (req, res) => {
  const { filename } = req;
  if (filename) {
    return res.status(200).json({ message: "ok", filename });
  }

  return res.status(500).json({ message: "server error" });
};

const updateFeatureVideo = (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(403).json("bad request");

  const filePath = path.resolve(__dirname, "../config/feature-video.txt");
  fs.writeFileSync(filePath, filename);
  return res.status(200).json({ message: "ok", filename });
};

const getFeatureVideo = (req, res) => {
  const filePath = path.resolve(__dirname, "../config/feature-video.txt");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "not found" });
  }

  const filename = fs.readFileSync(filePath, "utf-8");
  return res.status(200).json({ message: "ok", filename });
};

const getallFeatureVideos = (req, res) => {
  const path = path.resolve(__dirname, `../public/assets/feature-videos/`);
  const videos = fs.readdirSync(path);
  return res.status(200).json({ videos });
};

module.exports = {
  uploadVideo,
  addFeatureVideo,
  updateFeatureVideo,
  getFeatureVideo,
  getallFeatureVideos,
};
