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
                tracks = data.map(track => ({
                    ...track,
                    albumArt: track.albumArt || null
                }));
                if (tracks.length > 0) {
                    loadTrack(0);
                } else {
                    console.log('No tracks found');
                }
            })
            .catch(error => console.error('Error loading tracks:', error));
    }

    function loadTrack(index) {
        if (index < 0) index = tracks.length - 1;
        if (index >= tracks.length) index = 0;

        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];
        audioPlayer.src = track.url;
        songName.textContent = 'Original by David Adly';
        artistName.textContent = track.name;
        albumArt.src = track.albumArt || '/public/music/image.png';

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
        const volume = volumeSlider.value;
        audioPlayer.volume = volume / 100;
        volumeSlider.setAttribute('data-volume', `${volume}%`);
        updateVolumeSliderTooltip();
    });

    function updateVolumeSliderTooltip() {
        const thumbPosition = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
        volumeSlider.style.setProperty('--thumb-position', `${thumbPosition}%`);
    }

    updateVolumeSliderTooltip();

    loadTracks();
});

function isAudioFile(fileName) {
    return fileName.toLowerCase().endsWith('.wav');
}
