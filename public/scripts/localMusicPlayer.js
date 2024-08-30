document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('player');
  const playButton = document.querySelector('.play');
  const nextButton = document.querySelector('.next');
  const previousButton = document.querySelector('.previous');
  const progressBar = document.querySelector('.progress-bar .progress');
  const trackList = document.querySelector('.list ul');
  const artistElement = document.querySelector('.info .artist');
  const songElement = document.querySelector('.info .song');

  let tracks = [];
  let currentTrackIndex = 0;

  // Function to fetch and list all MP3 files from the music folder
  async function loadTracks() {
    try {
      const response = await fetch('/api/music-files');
      if (!response.ok) {
        throw new Error('Failed to fetch music files');
      }
      tracks = await response.json();
      displayTracks();
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  }

  // Function to display tracks in the list
  function displayTracks() {
    trackList.innerHTML = '';
    tracks.forEach((track, index) => {
      const li = document.createElement('li');
      li.textContent = track.name;
      li.addEventListener('click', () => playTrack(index));
      trackList.appendChild(li);
    });
  }

  // Function to play a track
  function playTrack(index) {
    if (index >= 0 && index < tracks.length) {
      currentTrackIndex = index;
      audioPlayer.src = tracks[currentTrackIndex].path;
      audioPlayer.play();
      updateTrackInfo();
    }
  }

  // Function to update track information
  function updateTrackInfo() {
    const currentTrack = tracks[currentTrackIndex];
    artistElement.textContent = currentTrack.artist || 'Unknown Artist';
    songElement.textContent = currentTrack.name;
  }

  // Event listeners for player controls
  playButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
    playButton.classList.toggle('playing');
  });

  nextButton.addEventListener('click', () => {
    playTrack((currentTrackIndex + 1) % tracks.length);
  });

  previousButton.addEventListener('click', () => {
    playTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
  });

  audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
  });

  // Load tracks when the page loads
  loadTracks();
});
document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('player');
  const playPauseButton = document.querySelector('.play-pause');
  const nextButton = document.querySelector('.next');
  const previousButton = document.querySelector('.previous');
  const progressBar = document.querySelector('.progress');
  const trackList = document.getElementById('trackList');
  const artistElement = document.getElementById('artistName');
  const songElement = document.getElementById('songName');
  const albumArt = document.getElementById('albumArt');
  const currentTimeElement = document.getElementById('currentTime');
  const durationElement = document.getElementById('duration');
  const volumeSlider = document.getElementById('volumeSlider');
  const playlistToggle = document.getElementById('playlistToggle');
  const playlist = document.querySelector('.playlist');
  const musicFolderToggle = document.getElementById('musicFolderToggle');
  const musicFolderList = document.getElementById('musicFolderList');

  let tracks = [];
  let currentTrackIndex = 0;

  // Function to load tracks from the server
  async function loadTracks() {
    try {
      const response = await fetch('/api/tracks');
      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }
      tracks = await response.json();
      displayTracks();
      displayMusicFolder();
      if (tracks.length > 0) {
        loadTrack(currentTrackIndex);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  }

  // Function to display tracks in the playlist
  function displayTracks() {
    trackList.innerHTML = '';
    tracks.forEach((track, index) => {
      const li = document.createElement('li');
      li.textContent = `${track.artist} - ${track.name}`;
      li.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        updatePlayPauseIcon();
      });
      trackList.appendChild(li);
    });
  }

  // Function to display tracks in the music folder dropdown
  function displayMusicFolder() {
    musicFolderList.innerHTML = '';
    tracks.forEach((track, index) => {
      const div = document.createElement('div');
      div.textContent = `${track.artist} - ${track.name}`;
      div.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        audioPlayer.play();
        updatePlayPauseIcon();
        musicFolderList.classList.add('hidden');
      });
      musicFolderList.appendChild(div);
    });
  }

  // Function to load a track
  function loadTrack(index) {
    if (index >= 0 && index < tracks.length) {
      const track = tracks[index];
      audioPlayer.src = track.url;
      artistElement.textContent = track.artist || 'Unknown Artist';
      songElement.textContent = track.name;
      albumArt.src = track.albumArt || '/assets/images/default-album-art.jpg';
      highlightCurrentTrack();
    }
  }

  // Function to highlight the current track in the list
  function highlightCurrentTrack() {
    const trackItems = trackList.querySelectorAll('li');
    trackItems.forEach((item, index) => {
      if (index === currentTrackIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Play/Pause button functionality
  playPauseButton.addEventListener('click', togglePlayPause);

  function togglePlayPause() {
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
    updatePlayPauseIcon();
  }

  function updatePlayPauseIcon() {
    const icon = playPauseButton.querySelector('i');
    icon.className = audioPlayer.paused ? 'fa fa-play' : 'fa fa-pause';
  }

  // Next button functionality
  nextButton.addEventListener('click', playNextTrack);

  function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    updatePlayPauseIcon();
  }

  // Previous button functionality
  previousButton.addEventListener('click', playPreviousTrack);

  function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    updatePlayPauseIcon();
  }

  // Update progress bar and time
  audioPlayer.addEventListener('timeupdate', updateProgress);

  function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
    durationElement.textContent = formatTime(audioPlayer.duration);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Volume control
  volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value / 100;
  });

  // Playlist toggle
  playlistToggle.addEventListener('click', () => {
    playlist.classList.toggle('hidden');
  });

  // Music folder toggle
  musicFolderToggle.addEventListener('click', () => {
    musicFolderList.classList.toggle('hidden');
  });

  // Load tracks when the page loads
  loadTracks();
});
