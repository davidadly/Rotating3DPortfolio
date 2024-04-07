const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");

const app = express();

//app.use('/', (req, res, next) => {
//  res.send('Hello from SSL Server')
//})

const cron = require("node-cron");
const auth = require("./middleware/auth");
const {
  swap,
  updateInfo,
  details,
  addItem,
  uploadMedia,
  deleteItem,
} = require("./middleware/showcase");
const { getDetails } = require("./middleware/portfolio");
const { sendMail } = require("./middleware/mail");
const { updateStore } = require("./utils/updateStore");
const { blog } = require("./utils/blog");
const {
  addFeatureVideo,
  uploadVideo,
  updateFeatureVideo,
  getFeatureVideo,
  getallFeatureVideos,
} = require("./middleware/featureVideo");
const { uploadModel, addModel } = require("./middleware/models");

app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/portfolio-details", getDetails);
app.get("/showcase-details", details);
app.post("/showcase-swap", auth.isAuth, swap);
app.put("/showcase-update-info", auth.isAuth, updateInfo);
app.post("/admin-login", auth.login);
app.post("/send-mail", sendMail);
app.get("/blog", blog);
app.post(
  "/add-gallery-item",
  [auth.isAuth, uploadMedia.single("file")],
  addItem
);

app.delete("/remove-gallery-item", [auth.isAuth], deleteItem);

app.post(
  "/add-feature-video",
  [auth.isAuth, uploadVideo.single("file")],
  addFeatureVideo
);
app.put("/update-feature-video", [auth.isAuth], updateFeatureVideo);
app.get("/feature-video", getFeatureVideo);
app.get("/all-feature-video", getallFeatureVideos);

app.post("/add-model", [auth.isAuth, uploadModel.single("file")], addModel);

// check these every day at 12:00 am
cron.schedule("0 0 */24 * * *", () => {
  updateStore("/public/design/store.json", "/public/assets/models/design");
  updateStore("/public/misc/store.json", "/public/assets/models/misc");
});

//const sslServer = https.createServer({
//  key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
//    cert: fs.readFileSync(path.join(__dirname,'cert','dxadly_net.pem-chain')),
//  },
//  app
//)

//sslServer.listen(3000, ()=> console.log('Started secure server on port 3000'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
