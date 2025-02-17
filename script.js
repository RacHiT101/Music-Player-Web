document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");
  const playPauseButton = document.getElementById("play-pause");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const songTitle = document.querySelector(".song-title");
  const progressBar = document.getElementById("progress");
  const indicator = document.querySelector(".indicator");
  const timeDisplay = document.getElementById("time");
  const albumCover = document.getElementById("album-cover");

  let currentSongIndex = 0;
  let isPlaying = false;

  // Array of songs with titles and image URLs
  const songs = [
    { title: "Happy Song", src: "songs/happy-song.mp3", imgUrl: "" },
    { title: "Let it Go", src: "songs/let-it-go.mp3", imgUrl: "" },
    { title: "Summer Walk", src: "songs/summer-walk.mp3", imgUrl: "" },
  ];

  // Function to load and play the current song
  function loadAndPlayCurrentSong() {
    audio.src = songs[currentSongIndex].src;
    audio.load();
    if (isPlaying) {
      audio.play();
    }
    playPauseButton.innerHTML = isPlaying
      ? '<i class="fas fa-pause"></i>'
      : '<i class="fas fa-play"></i>';
    songTitle.textContent = songs[currentSongIndex].title;

    // Load the next song's image in advance
    prefetchNextImage();
  }

  // Function to prefetch the image for the next song
  function prefetchNextImage() {
    const nextSongIndex = (currentSongIndex + 1) % songs.length;
    const aspectRatio = "280x200"; // Desired aspect ratio for the image (vertical rectangle)
    const searchTerm = "illustration"; // Change the search term to find illustrative images
    const unsplashUrl = `https://source.unsplash.com/random/${aspectRatio}/?${searchTerm}&${Date.now()}`;

    const nextSongImage = new Image();
    nextSongImage.src = unsplashUrl;

    // Ensure the image is fully loaded before changing the song
    nextSongImage.onload = function () {
      // Replace the album cover with the next song's image
      albumCover.src = nextSongImage.src;
    };
  }

  // Function to toggle play/pause
  function togglePlayPause() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    isPlaying = !isPlaying;
    playPauseButton.innerHTML = isPlaying
      ? '<i class="fas fa-pause"></i>'
      : '<i class="fas fa-play"></i>';
  }

  // Event listener for timeupdate to update the progress bar
  audio.addEventListener("timeupdate", function () {
    const progress = (audio.currentTime / audio.duration) * 100;
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);

    progressBar.style.width = progress + "%";
    indicator.style.left = progress + "%";
    timeDisplay.textContent = currentTime + " / " + duration;
  });

  // Event listener for when the song changes
  audio.addEventListener("ended", function () {
    resetProgressBar();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlayCurrentSong();
  });

  // Function to reset the progress bar when the song changes
  function resetProgressBar() {
    progressBar.style.width = "0%";
    indicator.style.left = "0%";
    timeDisplay.textContent = "0:00 / 0:00";
  }

  // Event listener for the play/pause button
  playPauseButton.addEventListener("click", togglePlayPause);

  // Event listener for the next button
  nextButton.addEventListener("click", function () {
    resetProgressBar();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlayCurrentSong();
  });

  // Event listener for the previous button
  prevButton.addEventListener("click", function () {
    resetProgressBar();
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadAndPlayCurrentSong();
  });

  // Function to format time (e.g., "0:00")
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    return formattedTime;
  }

  // Load and play the initial song
  loadAndPlayCurrentSong();
});
