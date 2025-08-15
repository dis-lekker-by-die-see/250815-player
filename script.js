let tracks = [];
let currentTrackIndex = -1;
let isShuffleOne = false;
let isShuffleAll = false;
let audioPlayer = null;
let bufferedTracks = {
  previous: null,
  current: null,
  next: null,
};

document.addEventListener("DOMContentLoaded", () => {
  audioPlayer = document.getElementById("audioPlayer");
  const folderInput = document.getElementById("folderInput");
  const selectSourceBtn = document.getElementById("selectSourceBtn");
  const sortBtn = document.getElementById("sortBtn");
  const shuffleOneBtn = document.getElementById("shuffleOneBtn");
  const shuffleAllBtn = document.getElementById("shuffleAllBtn");
  const trackList = document.getElementById("trackList");
  const currentTrackDisplay = document.getElementById("currentTrack");
  const progressBar = document.getElementById("progressBar");
  const volumeSlider = document.getElementById("volumeSlider");

  selectSourceBtn.addEventListener("click", () => folderInput.click());
  folderInput.addEventListener("change", handleFolderSelect);
  sortBtn.addEventListener("click", toggleSort);
  shuffleOneBtn.addEventListener("click", () => toggleShuffle("one"));
  shuffleAllBtn.addEventListener("click", () => toggleShuffle("all"));
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("ended", playNext);
  progressBar.addEventListener("input", seekTrack);
  volumeSlider.addEventListener(
    "input",
    () => (audioPlayer.volume = volumeSlider.value)
  );
  trackList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      currentTrackIndex = parseInt(e.target.dataset.index);
      playTrack();
    }
  });
});

async function handleFolderSelect(event) {
  tracks = [];
  const files = event.target.files;
  for (const file of files) {
    if (file.type.startsWith("audio/")) {
      tracks.push({
        file,
        name: file.name,
        path: file.webkitRelativePath,
        folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
      });
    }
  }
  updateTrackList();
  if (tracks.length > 0) {
    currentTrackIndex = 0;
    playTrack();
  }
}

function updateTrackList() {
  const trackList = document.getElementById("trackList");
  trackList.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.name;
    li.dataset.index = index;
    if (index === currentTrackIndex) li.classList.add("active");
    trackList.appendChild(li);
  });
}

function toggleSort() {
  const sortBtn = document.getElementById("sortBtn");
  if (sortBtn.textContent.includes("Alphabetical")) {
    tracks.sort((a, b) => a.name.localeCompare(b.name));
    sortBtn.textContent = "Sort: By Folder";
  } else {
    tracks.sort(
      (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
    );
    sortBtn.textContent = "Sort: Alphabetical";
  }
  updateTrackList();
  updateBufferedTracks();
}

function toggleShuffle(mode) {
  const shuffleOneBtn = document.getElementById("shuffleOneBtn");
  const shuffleAllBtn = document.getElementById("shuffleAllBtn");
  if (mode === "one") {
    isShuffleOne = !isShuffleOne;
    isShuffleAll = false;
    shuffleOneBtn.classList.toggle("active", isShuffleOne);
    shuffleAllBtn.classList.remove("active");
  } else {
    isShuffleAll = !isShuffleAll;
    isShuffleOne = false;
    shuffleAllBtn.classList.toggle("active", isShuffleAll);
    shuffleOneBtn.classList.remove("active");
  }
  if (isShuffleAll) shuffleTracks();
  updateBufferedTracks();
}

function shuffleTracks() {
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }
  updateTrackList();
}

function playTrack() {
  if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
  const track = tracks[currentTrackIndex];
  document.getElementById("currentTrack").textContent = track.name;
  audioPlayer.src = URL.createObjectURL(track.file);
  audioPlayer.play();
  updateBufferedTracks();
  updateTrackList();
}

function updateBufferedTracks() {
  if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
  if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
  if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

  bufferedTracks.current = new Audio(
    URL.createObjectURL(tracks[currentTrackIndex].file)
  );

  const prevIndex = isShuffleOne
    ? Math.floor(Math.random() * tracks.length)
    : (currentTrackIndex - 1 + tracks.length) % tracks.length;
  if (prevIndex >= 0 && prevIndex < tracks.length) {
    bufferedTracks.previous = new Audio(
      URL.createObjectURL(tracks[prevIndex].file)
    );
  }

  let nextIndex;
  if (isShuffleOne) {
    nextIndex = Math.floor(Math.random() * tracks.length);
    while (nextIndex === currentTrackIndex)
      nextIndex = Math.floor(Math.random() * tracks.length);
  } else {
    nextIndex = (currentTrackIndex + 1) % tracks.length;
  }
  if (nextIndex < tracks.length) {
    bufferedTracks.next = new Audio(
      URL.createObjectURL(tracks[nextIndex].file)
    );
  }
}

function playNext() {
  if (isShuffleOne) {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
  } else if (isShuffleAll) {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }
  playTrack();
}

function updateProgress() {
  const progressBar = document.getElementById("progressBar");
  if (audioPlayer.duration) {
    progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  }
}

function seekTrack() {
  const progressBar = document.getElementById("progressBar");
  if (audioPlayer.duration) {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
  }
}
