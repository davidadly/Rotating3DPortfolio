const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/music-files', async (req, res) => {
  try {
    const musicDir = path.join(__dirname, 'public', 'music');
    const files = await fs.readdir(musicDir);
    const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');
    
    const tracks = mp3Files.map(file => ({
      name: path.basename(file, '.mp3'),
      path: `/music/${file}`,
      // You can add more metadata here if needed
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Error reading music directory:', error);
    res.status(500).json({ error: 'Failed to read music files' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
