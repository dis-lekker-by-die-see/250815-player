let tracks = [];
let currentTrackIndex = -1;
let isRepeatCurrent = false;
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
  const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
  const shuffleAllBtn = document.getElementById("shuffleAllBtn");
  const skipBackBtn = document.getElementById("skipBackBtn");
  const skipForwardBtn = document.getElementById("skipForwardBtn");
  const trackListBody = document
    .getElementById("trackList")
    .querySelector("tbody");

  selectSourceBtn.addEventListener("click", () => folderInput.click());
  folderInput.addEventListener("change", handleFolderSelect);
  sortBtn.addEventListener("click", toggleSort);
  repeatCurrentBtn.addEventListener("click", toggleRepeat);
  shuffleAllBtn.addEventListener("click", toggleShuffle);
  skipBackBtn.addEventListener("click", playPrevious);
  skipForwardBtn.addEventListener("click", playNext);
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("ended", handleTrackEnd);
  trackListBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (row) {
      currentTrackIndex = parseInt(row.dataset.index);
      playTrack();
    }
  });

  setupColumnResizing();
});

function setupColumnResizing() {
  const headers = document.querySelectorAll("#trackList th.resize");
  headers.forEach((header) => {
    header.removeEventListener("mousedown", handleMouseDown);
    header.addEventListener("mousedown", handleMouseDown);
  });
}

function handleMouseDown(e) {
  const header = e.currentTarget;
  const rect = header.getBoundingClientRect();
  if (e.clientX >= rect.right - 10 && e.clientX <= rect.right + 10) {
    e.preventDefault();
    e.stopPropagation();
    let startX = e.clientX;
    let startWidth = header.offsetWidth;
    console.log(`Resizing ${header.dataset.column} column`);
    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      let newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 50) {
        header.style.width = `${newWidth}px`;
        header.style.minWidth = `${newWidth}px`;
        console.log(`New width for ${header.dataset.column}: ${newWidth}px`);
      }
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      console.log(`Finished resizing ${header.dataset.column}`);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
}

async function handleFolderSelect(event) {
  tracks = [];
  const files = event.target.files;
  console.log("Files loaded:", files.length);
  for (const file of files) {
    if (file.type.startsWith("audio/")) {
      tracks.push({
        file,
        name: file.name,
        path: file.webkitRelativePath,
        folder:
          file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
      });
    }
  }
  console.log("Tracks processed:", tracks.length);
  updateTrackList();
  if (tracks.length > 0) {
    currentTrackIndex = 0;
    playTrack();
  }
}

function updateTrackList() {
  const trackListBody = document
    .getElementById("trackList")
    .querySelector("tbody");
  trackListBody.innerHTML = "";
  tracks.forEach((track, index) => {
    const tr = document.createElement("tr");
    tr.dataset.index = index;
    if (index === currentTrackIndex) tr.classList.add("active");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${track.name}</td>
      <td>${track.folder}</td>
    `;
    trackListBody.appendChild(tr);
  });
  console.log("Track list updated, rows:", trackListBody.children.length);
  const headers = document.querySelectorAll("#trackList th.resize");
  headers.forEach((header) => {
    const width = header.style.width || getComputedStyle(header).width;
    header.style.width = width;
    header.style.minWidth = width;
  });
  setupColumnResizing();
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

function toggleRepeat() {
  isRepeatCurrent = !isRepeatCurrent;
  isShuffleAll = false;
  const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
  const shuffleAllBtn = document.getElementById("shuffleAllBtn");
  repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
  shuffleAllBtn.classList.remove("active");
  audioPlayer.loop = isRepeatCurrent;
  updateBufferedTracks();
}

function toggleShuffle() {
  isShuffleAll = !isShuffleAll;
  isRepeatCurrent = false;
  const shuffleAllBtn = document.getElementById("shuffleAllBtn");
  const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
  shuffleAllBtn.classList.toggle("active", isShuffleAll);
  repeatCurrentBtn.classList.remove("active");
  audioPlayer.loop = false;
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
  document.getElementById("currentTrack").textContent = `${
    currentTrackIndex + 1
  }. ${track.name}`;
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

  const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
    bufferedTracks.previous = new Audio(
      URL.createObjectURL(tracks[prevIndex].file)
    );
  }

  const nextIndex = (currentTrackIndex + 1) % tracks.length;
  if (nextIndex < tracks.length && !isRepeatCurrent) {
    bufferedTracks.next = new Audio(
      URL.createObjectURL(tracks[nextIndex].file)
    );
  }
}

function handleTrackEnd() {
  if (isRepeatCurrent) {
    audioPlayer.play();
  } else if (isShuffleAll) {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
    playTrack();
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack();
  }
}

function playNext() {
  if (isShuffleAll) {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }
  playTrack();
}

function playPrevious() {
  if (isShuffleAll) {
    currentTrackIndex = Math.floor(Math.random() * tracks.length);
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  }
  playTrack();
}

function updateProgress() {
  if (audioPlayer.duration) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.getElementById("audioPlayer").setAttribute("value", progress);
  }
}
