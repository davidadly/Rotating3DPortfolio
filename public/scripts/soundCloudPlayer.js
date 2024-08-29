// Import track list from external file
import tracks from "./songLists.js";

// Select a random track to start with
let trackNo = Math.floor(Math.random() * tracks.length);

// Player object constructor
function Player() {
  this.audioplayer = document.getElementById("player");
  this.currentTrack = trackNo;

  // Toggle play/pause
  this.togglePlay = function () {
    const playButton = document.querySelector(".play");
    playButton.classList.toggle("active");
    if (this.audioplayer.paused) this.play();
    else this.pause();
  };

  // Play function
  this.play = function () {
    document.querySelector(".play").classList.add("active");
    this.audioplayer.play();
    document.querySelector(".list .song.current").classList.add("playing");
  };

  // Pause function
  this.pause = function () {
    document.querySelector(".play").classList.remove("active");
    this.audioplayer.pause();
    document.querySelector(".list .song.current").classList.remove("playing");
  };

  // Set a specific song
  this.setSong = function (trackNo) {
    this.currentTrack = trackNo;
    this.audioplayer.src = tracks[trackNo].songSrc;
    if (document.querySelector(".play").classList.contains("active")) this.play();
    this.updateList();
  };

  // Play next song
  this.nextSong = function () {
    if (this.currentTrack < tracks.length - 1) this.currentTrack++;
    this.setSong(this.currentTrack);
  };

  // Play previous song
  this.prevSong = function () {
    if (this.currentTrack > 0) this.currentTrack--;
    this.setSong(this.currentTrack);
  };

  // Update the song list UI
  this.updateList = function () {
    document.querySelectorAll(".list li.song").forEach(el => el.classList.remove("current"));
    document.querySelectorAll(".list li.song")[this.currentTrack].classList.add("current");
    const track = tracks[this.currentTrack];
    const infoImg = document.querySelector(".controller > .info-content img");
    infoImg.src = track.imgSrc ? track.imgSrc.replace("large", "t500x500") : "";
    document.querySelector(".controller > .info-content .artist").textContent = track.artist;
    document.querySelector(".controller > .info-content .song").textContent = track.title;
    document.querySelector(".progress-bar > .progress").style.width = "0%";
  };
}

// Function to render the entire song list
function renderSongList() {
  const songListContainer = document.querySelector(".list ul");
  songListContainer.innerHTML = tracks.map((track, index) => renderSong(track, index)).join("");
}

// Function to render a single song item
function renderSong({ artist, title, imgSrc, duration }, index) {
  const [minutes, seconds] = duration.split(":");
  return `
    <li class="song" data-index="${index}">
      <img src="${imgSrc}" alt="${title} by ${artist}" />
      <div class="info">
        <h2 class="artist">${artist}</h2>
        <p class="song">${title}</p>
      </div>
      <div class="play">
        <i aria-hidden="true" class="fa fa-play"></i>
        <i aria-hidden="true" class="fa fa-pause"></i>
      </div>
      <p class="duration">${minutes}m ${seconds}s</p>
    </li>
  `;
}

// Initialize the player when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const player = new Player();
  renderSongList();
  player.updateList();

  // Toggle player visibility on button click
  document.querySelectorAll(".button.bottom, .button.close").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelector(".player").classList.toggle("active");
    });
  });

  // Event listeners for player controls
  document.querySelector(".play").addEventListener("click", () => player.togglePlay());
  document.querySelector(".next").addEventListener("click", () => player.nextSong());
  document.querySelector(".previous").addEventListener("click", () => player.prevSong());

  document.querySelector(".list").addEventListener("click", (event) => {
    const songItem = event.target.closest(".song");
    if (songItem) {
      const id = parseInt(songItem.dataset.index);
      player.setSong(id);
      player.play();
    }
  });

  // Update progress bar as song plays
  player.audioplayer.addEventListener("timeupdate", function () {
    const progress = (this.currentTime / this.duration) * 100;
    document.querySelector(".progress-bar > .progress").style.width = `${progress}%`;
  });

  // Play next song when current song ends
  player.audioplayer.addEventListener("ended", () => player.nextSong());
});