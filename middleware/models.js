const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadModel = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { originalname } = file;
      const dirname = originalname.split(".")[0];
      const pathUrl = path.resolve(
        __dirname,
        `../public/assets/models/misc/${dirname}`
      );

      if (!fs.existsSync(pathUrl)) {
        fs.mkdirSync(pathUrl);
        return cb(null, pathUrl);
      }
      return cb(null, pathUrl);
    },
    filename: (req, file, cb) => {
      const { originalname } = file;
      const parts = originalname.split(".");
      const filetype = parts[parts.length - 1];
      req.dirname = parts[0];
      req.filetype = filetype;
      return cb(null, `model.${filetype}`);
    },
  }),
});

const addModel = (req, res, next) => {
  const pathUrl = path.resolve(
    __dirname,
    `../public/assets/models/misc/${req.dirname}/model.${req.filetype}`
  );
  if (fs.existsSync(pathUrl)) {
    return res.status(200).json({ message: "ok", filepath: pathUrl });
  }

  return res.status(500).json({ message: "error" });
};

module.exports = { uploadModel, addModel };
