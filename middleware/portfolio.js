const getFolderSize = require("get-folder-size");
const fs = require("fs");
const path = require("path");

const getDetails = (req, res) => {
  const result = [];
  const source = path.join(__dirname, "../public/portfolio");

  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const dirs = files
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (let i = 0; i < dirs.length; i++) {
      const obj = { title: dirs[i] };
      const source = path.join(__dirname, `../public/portfolio/${dirs[i]}`);
      getFolderSize(source, (err, size) => {
        obj.size = size;
        obj.link = `/portfolio/${dirs[i]}`;
        result.push(obj);

        if (result.length === dirs.length) {
          return res.status(200).json(result);
        }
      });
    }
  });
};

module.exports = { getDetails };
