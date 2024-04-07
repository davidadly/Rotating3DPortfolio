const fs = require("fs");
const path = require("path");

const extractDirNames = (item) => {
  let model = item.model;
  const start = model.indexOf("models") + 7;
  const end = model.indexOf("model.") - 1;
  model = model.slice(start, end);
  model = model.slice(model.indexOf("/") + 1);
  return model;
};

const updateStore = (store, dir) => {
  // previous data
  const storeSource = path.join(__dirname, `../${store}`);
  const prevRawData = fs.readFileSync(storeSource);
  // parsed from json to js object and extract the name of the dirs
  const parsed = JSON.parse(prevRawData).map(extractDirNames);
  const toAdd = [];
  const toRemove = [];

  const dirSource = path.join(__dirname, `../${dir}`);
  const dirOptions = {
    withFileTypes: true,
  };

  // dirs in our folder
  const dirs = fs.readdirSync(dirSource, dirOptions);

  // filtering files out - only keep dirs
  const onlyDirs = dirs
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // check if ther's any dir that wasn't in our prev data
  onlyDirs.forEach((title) => {
    if (parsed.indexOf(title) === -1) {
      // push it to to Add
      toAdd.push({
        model: `${dir.slice(7)}/${title}/model.glb`,
        title,
      });
    }
  });

  // check if there's any dir that's in our store.json but not in the folder
  parsed.forEach((item) => {
    if (onlyDirs.indexOf(item) === -1) toRemove.push(item);
  });

  if (toAdd.length > 0 || toRemove.length > 0) {
    // prev data in js object
    const prevDirs = JSON.parse(prevRawData);

    toAdd.forEach((item) => prevDirs.push(item));
    const dirsAfterRem = [];

    for (let i = 0; i < prevDirs.length; i++) {
      if (toRemove.indexOf(prevDirs[i].title) === -1)
        dirsAfterRem.push(prevDirs[i]);
    }

    const newDirs = JSON.stringify(dirsAfterRem);
    fs.writeFileSync(storeSource, newDirs);
  }
};

module.exports = { updateStore };
