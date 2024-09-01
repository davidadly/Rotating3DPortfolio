document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('player');
    const playPauseBtn = document.querySelector('.play-pause');
    const prevBtn = document.querySelector('.previous');
    const nextBtn = document.querySelector('.next');
    const progressBar = document.querySelector('.progress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const playlistToggle = document.getElementById('playlistToggle');
    const playlist = document.querySelector('.playlist');
    const trackList = document.getElementById('trackList');
    const albumArt = document.getElementById('albumArt');
    const artistName = document.getElementById('artistName');
    const songName = document.getElementById('songName');

    let tracks = [];
    let currentTrackIndex = 0;

    function loadTracks() {
        fetch('/api/tracks')
            .then(response => response.json())
            .then(data => {
                tracks = data;
                updatePlaylist();
                if (tracks.length > 0) {
                    loadTrack(0);
                } else {
                    console.log('No tracks found');
                }
            })
            .catch(error => console.error('Error loading tracks:', error));
    }

    function updatePlaylist() {
        trackList.innerHTML = '';
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.name;
            li.addEventListener('click', () => loadTrack(index));
            trackList.appendChild(li);
        });
    }

    function loadTrack(index) {
        if (index < 0) index = tracks.length - 1;
        if (index >= tracks.length) index = 0;

        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];
        audioPlayer.src = track.url;
        songName.textContent = track.name;
        artistName.textContent = 'Unknown Artist'; // You can update this if you have artist metadata
        albumArt.src = '/assets/default-album-art.jpg'; // Use a default album art

        document.querySelectorAll('#trackList li').forEach((li, i) => {
            li.classList.toggle('active', i === currentTrackIndex);
        });

        audioPlayer.play();
        updatePlayPauseIcon();
    }

    function updatePlayPauseIcon() {
        const icon = playPauseBtn.querySelector('i');
        icon.classList.toggle('fa-play', audioPlayer.paused);
        icon.classList.toggle('fa-pause', !audioPlayer.paused);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
        updatePlayPauseIcon();
    });

    prevBtn.addEventListener('click', () => loadTrack(currentTrackIndex - 1));
    nextBtn.addEventListener('click', () => loadTrack(currentTrackIndex + 1));

    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('ended', () => loadTrack(currentTrackIndex + 1));

    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value / 100;
    });

    playlistToggle.addEventListener('click', () => {
        playlist.classList.toggle('hidden');
    });

    loadTracks();
});
    function isAudioFile(fileName) {
        return fileName.toLowerCase().endsWith('.wav');
    }
