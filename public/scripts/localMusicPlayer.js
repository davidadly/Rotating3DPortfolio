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
