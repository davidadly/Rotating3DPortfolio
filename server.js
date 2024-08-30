// Import necessary modules
const express = require("express"); // Express framework for building web applications
const https = require("https"); // HTTPS module for creating a secure server
const path = require("path"); // Path module for handling file and directory paths
const fs = require("fs"); // File System module for interacting with the file system

// Create an instance of an Express application
const app = express();

// Uncommented code that could be used to send a simple response to requests on the root URL
// app.use('/', (req, res, next) => {
//   res.send('Hello from SSL Server')
// })

// Import additional modules and middleware
const cron = require("node-cron"); // Module for scheduling tasks
const auth = require("./middleware/auth"); // Custom authentication middleware
const {
  swap,
  updateInfo,
  details,
  addItem,
  uploadMedia,
  deleteItem,
} = require("./middleware/showcase"); // Middleware functions for handling showcase-related routes
const { getDetails } = require("./middleware/portfolio"); // Middleware for getting portfolio details
const { sendMail } = require("./middleware/mail"); // Middleware for sending emails
const { updateStore } = require("./utils/updateStore"); // Utility function for updating the store
const { blog } = require("./utils/blog"); // Utility function for handling blog requests
const {
  addFeatureVideo,
  uploadVideo,
  updateFeatureVideo,
  getFeatureVideo,
  getallFeatureVideos,
} = require("./middleware/featureVideo"); // Middleware for handling feature video operations
const { uploadModel, addModel } = require("./middleware/models"); // Middleware for handling model uploads

// Middleware setup
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(express.json()); // Parse JSON bodies for incoming requests
app.use(
  express.urlencoded({
    extended: true, // Parse URL-encoded bodies with extended syntax
  })
);

// Define routes and associate them with middleware functions
app.get("/portfolio-details", getDetails); // Get portfolio details
app.get("/showcase-details", details); // Get showcase details
app.post("/showcase-swap", auth.isAuth, swap); // Swap showcase items, requires authentication
app.put("/showcase-update-info", auth.isAuth, updateInfo); // Update showcase info, requires authentication
app.post("/admin-login", auth.login); // Admin login route
app.post("/send-mail", sendMail); // Send an email
app.get("/blog", blog); // Get blog content
app.post(
  "/add-gallery-item",
  [auth.isAuth, uploadMedia.single("file")], // Add a gallery item, requires authentication and file upload
  addItem
);

app.delete("/remove-gallery-item", [auth.isAuth], deleteItem); // Remove a gallery item, requires authentication

app.post(
  "/add-feature-video",
  [auth.isAuth, uploadVideo.single("file")], // Add a feature video, requires authentication and file upload
  addFeatureVideo
);
app.put("/update-feature-video", [auth.isAuth], updateFeatureVideo); // Update a feature video, requires authentication
app.get("/feature-video", getFeatureVideo); // Get a specific feature video
app.get("/all-feature-video", getallFeatureVideos); // Get all feature videos

app.post("/add-model", [auth.isAuth, uploadModel.single("file")], addModel); // Add a model, requires authentication and file upload

// Schedule a cron job to update the store every day at 12:00 AM
cron.schedule("0 0 */24 * * *", () => {
  updateStore("/public/design/store.json", "/public/assets/models/design");
  updateStore("/public/misc/store.json", "/public/assets/models/misc");
});

// Uncommented code to create and start an HTTPS server using SSL certificates
// const sslServer = https.createServer({
//   key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
//   cert: fs.readFileSync(path.join(__dirname,'cert','dxadly_net.pem-chain')),
// },
// app
// )
// sslServer.listen(3000, ()=> console.log('Started secure server on port 3000'));

// Start the Express server on the specified port, or default to port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

const { promisify } = require('util');
const mm = require('music-metadata');

app.get('/api/tracks', async (req, res) => {
  try {
    const musicDir = path.join(__dirname, 'public', 'music');
    const files = await fs.readdir(musicDir);
    const tracks = await Promise.all(files
      .filter(file => path.extname(file).toLowerCase() === '.mp3')
      .map(async file => {
        const filePath = path.join(musicDir, file);
        try {
          const metadata = await mm.parseFile(filePath);
          return {
            name: metadata.common.title || path.basename(file, '.mp3'),
            url: `/music/${file}`,
            artist: metadata.common.artist || 'Unknown Artist',
            albumArt: metadata.common.picture && metadata.common.picture.length > 0
              ? `data:${metadata.common.picture[0].format};base64,${metadata.common.picture[0].data.toString('base64')}`
              : '/assets/images/default-album-art.jpg'
          };
        } catch (err) {
          console.error(`Error parsing metadata for ${file}:`, err);
          return {
            name: path.basename(file, '.mp3'),
            url: `/music/${file}`,
            artist: 'Unknown Artist',
            albumArt: '/assets/images/default-album-art.jpg'
          };
        }
      }));
    
    // Save tracks to music store file
    const musicStoreFile = path.join(__dirname, 'public', 'music', 'music_store.json');
    await fs.writeFile(musicStoreFile, JSON.stringify(tracks, null, 2));
    
    res.json(tracks);
  } catch (error) {
    console.error('Error reading music directory:', error);
    res.status(500).json({ error: 'Unable to read music directory' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
