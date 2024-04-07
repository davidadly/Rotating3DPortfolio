const fs = require("fs");
const editJsonFile = require("edit-json-file");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const multer = require("multer");

const uploadMedia = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const path_url = path.resolve(
        __dirname,
        `../public/assets/showcase/${req.body["folder-name"]}`
      );

      if (!fs.existsSync(path_url)) {
        fs.mkdirSync(path_url);
        return cb(null, path_url);
      }
      return cb(null, path_url);
    },
    filename: (req, file, cb) => {
      const { originalname, mimetype } = file;
      const parts = originalname.split(".");
      const filetype = parts[parts.length - 1];
      req.filetype = filetype;
      req.mimetype = mimetype;
      return cb(null, `original.${filetype}`);
    },
  }),
});

const swap = (req, res) => {
  const { indexes } = req.body;
  const source = path.resolve(
    __dirname,
    "../public/assets/showcase/store.json"
  );

  const storeRaw = fs.readFileSync(source, "utf-8");
  const store = JSON.parse(storeRaw);
  const tmp = { ...store[indexes[0]] };
  store[indexes[0]] = { ...store[indexes[1]] };
  store[indexes[1]] = tmp;

  fs.writeFileSync(source, JSON.stringify(store));

  return res.status(200).send("ok");
};

const updateInfo = (req, res) => {
  const { dir, info } = req.body;
  const source = path.resolve(__dirname, `../public${dir}/info.txt`);
  fs.writeFileSync(source, info);
  return res.status(200).send("updated");
};

const details = (req, res) => {
  const filepath = path.resolve(
    __dirname,
    "../public/assets/showcase/store.json"
  );

  let result = fs.readFileSync(filepath, "utf-8");
  result = JSON.parse(result);

  result.forEach((item) => {
    const dir = item.dir;
    const source = path.resolve(__dirname, `../public/${dir}/info.txt`);
    if (fs.existsSync(source)) {
      const info = fs.readFileSync(source, "utf-8");
      item.desc = info;
    } else {
      item.desc = "";
    }
  });

  return res.status(200).json(result);
};

const generateThumnail = (baseFolder, ext) => {
  const inputFile = `${baseFolder}/original.${ext}`;
  const outputFile = `${baseFolder}/thumnail.jpg`;
  ffmpeg(inputFile).setSize("420x300").output(outputFile).run();
};

const createPreview = (baseFolder, ext) => {
  const inputFile = `${baseFolder}/original.${ext}`;
  const outputFile = `${baseFolder}/fragment-preview.mp4`;

  ffmpeg(inputFile)
    .seekInput(2)
    .noAudio()
    .inputOptions("-y")
    .duration(4)
    .setSize("420x300")
    .videoCodec("libx264")
    .output(outputFile)
    .run();
};

const thumbnailFromVideo = (baseFolder, ext) => {
  ffmpeg(`${baseFolder}/original.${ext}`).screenshots({
    count: 1,
    filename: "thumnail.jpg",
    folder: baseFolder,
    size: "480x300",
  });
};

const createInfo = (baseFolder, text) => {
  const inputFile = `${baseFolder}/info.txt`;
  fs.writeFileSync(inputFile, text);
};

const addItem = async (req, res) => {
  const { filetype, mimetype } = req;
  const textInfo = req.body.info || "";
  const folderName = req.body["folder-name"];
  const basePath = path.resolve(
    __dirname,
    `../public/assets/showcase/${folderName}`
  );

  let type = "";

  if (/image*/i.test(mimetype)) {
    type = "img";
    generateThumnail(basePath, filetype);
  } else if (/video*/i.test(mimetype)) {
    type = "video";
    createPreview(basePath, filetype);
    thumbnailFromVideo(basePath, filetype);
  } else {
    console.log("nope, ", mimetype);
    return;
  }

  createInfo(basePath, textInfo);

  let file = editJsonFile(
    path.resolve(__dirname, `../public/assets/showcase/store.json`),
    {
      autosave: true,
    }
  );

  const item = {
    type,
    dir: `/assets/showcase/${req.body["folder-name"]}`,
    filetype,
  };

  file.append("", item);
  file.save();

  const source = path.resolve(
    __dirname,
    `/public/assets/showcase/${req.body["folder-name"]}/info.txt`
  );
  if (fs.existsSync(source)) {
    const info = fs.readFileSync(source, "utf-8");
    item.desc = info;
  } else {
    item.desc = textInfo;
  }

  return res.json({
    message: "Files uploaded successfully!",
    item,
  });
};

const deleteItem = (req, res) => {
  const { dirUrl } = req.body;
  const dirPath = path.resolve(__dirname, `../public${dirUrl}`);

  if (!fs.existsSync(dirPath)) {
    return res.status(403).json({ message: "Item doesn't exists" });
  }

  fs.rmSync(dirPath, { recursive: true, force: true });
  const source = path.resolve(
    __dirname,
    "../public/assets/showcase/store.json"
  );

  const file = fs.readFileSync(source);

  const store = JSON.parse(file);

  let index = -1;
  store.forEach((item, i) => {
    if (item.dir === dirUrl) {
      index = i;
    }
  });

  if (index == -1) {
    return res.status(403).json({ message: "Item not found" });
  }

  store.splice(index, 1);
  fs.writeFileSync(source, JSON.stringify(store));
  return res.status(200).json({ message: "Successfully deleted the item" });
};

module.exports = {
  swap,
  updateInfo,
  details,
  addItem,
  uploadMedia,
  deleteItem,
};
