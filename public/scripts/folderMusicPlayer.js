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

    // Playlist management elements
    const newPlaylistNameInput = document.getElementById('newPlaylistName');
    const createPlaylistBtn = document.getElementById('createPlaylist');
    const playlistSelect = document.getElementById('playlistSelect');
    const renamePlaylistBtn = document.getElementById('renamePlaylist');
    const deletePlaylistBtn = document.getElementById('deletePlaylist');

    let tracks = [];
    let currentTrackIndex = 0;
    let playlists = JSON.parse(localStorage.getItem('playlists')) || {};
    let currentPlaylist = 'all';

    function loadTracks() {
        fetch('/api/tracks')
            .then(response => response.json())
            .then(data => {
                tracks = data.map(track => ({
                    ...track,
                    albumArt: track.albumArt || null
                }));
                updatePlaylist();
                updatePlaylistSelect();
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
        const playlistTracks = currentPlaylist === 'all' ? tracks : playlists[currentPlaylist];
        playlistTracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="track-name">${track.name}</span>
                <span class="track-info">
                    <span class="track-duration">${formatTime(track.duration || 0)}</span>
                    <span class="track-album">${track.album || 'Unknown Album'}</span>
                </span>
            `;
            li.addEventListener('click', () => loadTrack(index));
            trackList.appendChild(li);
        });
    }

    function updatePlaylistSelect() {
        playlistSelect.innerHTML = '<option value="all">All Tracks</option>';
        Object.keys(playlists).forEach(playlistName => {
            const option = document.createElement('option');
            option.value = playlistName;
            option.textContent = playlistName;
            playlistSelect.appendChild(option);
        });
    }

    function loadTrack(index) {
        const playlistTracks = currentPlaylist === 'all' ? tracks : playlists[currentPlaylist];
        if (index < 0) index = playlistTracks.length - 1;
        if (index >= playlistTracks.length) index = 0;

        currentTrackIndex = index;
        const track = playlistTracks[currentTrackIndex];
        audioPlayer.src = track.url;
        songName.textContent = 'Original by David Adly';
        artistName.textContent = track.name;
        albumArt.src = track.albumArt || '/public/music/image.png';

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

    function createPlaylist() {
        const playlistName = newPlaylistNameInput.value.trim();
        if (playlistName && !playlists[playlistName]) {
            playlists[playlistName] = [];
            localStorage.setItem('playlists', JSON.stringify(playlists));
            updatePlaylistSelect();
            newPlaylistNameInput.value = '';
        }
    }

    function renamePlaylist() {
        const oldName = playlistSelect.value;
        const newName = prompt('Enter new playlist name:', oldName);
        if (newName && newName !== oldName && !playlists[newName]) {
            playlists[newName] = playlists[oldName];
            delete playlists[oldName];
            localStorage.setItem('playlists', JSON.stringify(playlists));
            updatePlaylistSelect();
        }
    }

    function deletePlaylist() {
        const playlistName = playlistSelect.value;
        if (playlistName !== 'all' && confirm(`Are you sure you want to delete the playlist "${playlistName}"?`)) {
            delete playlists[playlistName];
            localStorage.setItem('playlists', JSON.stringify(playlists));
            updatePlaylistSelect();
            currentPlaylist = 'all';
            playlistSelect.value = 'all';
            updatePlaylist();
        }
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

    playlistToggle.addEventListener('click', () => {
        playlist.classList.toggle('hidden');
    });

    createPlaylistBtn.addEventListener('click', createPlaylist);
    renamePlaylistBtn.addEventListener('click', renamePlaylist);
    deletePlaylistBtn.addEventListener('click', deletePlaylist);

    playlistSelect.addEventListener('change', () => {
        currentPlaylist = playlistSelect.value;
        updatePlaylist();
    });

    loadTracks();
});

function isAudioFile(fileName) {
    return fileName.toLowerCase().endsWith('.wav');
}
