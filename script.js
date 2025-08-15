// // // // // // // // // // let tracks = [];
// // // // // // // // // // let currentTrackIndex = -1;
// // // // // // // // // // let isShuffleOne = false;
// // // // // // // // // // let isShuffleAll = false;
// // // // // // // // // // let audioPlayer = null;
// // // // // // // // // // let bufferedTracks = {
// // // // // // // // // //   previous: null,
// // // // // // // // // //   current: null,
// // // // // // // // // //   next: null,
// // // // // // // // // // };

// // // // // // // // // // document.addEventListener("DOMContentLoaded", () => {
// // // // // // // // // //   audioPlayer = document.getElementById("audioPlayer");
// // // // // // // // // //   const folderInput = document.getElementById("folderInput");
// // // // // // // // // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // // // // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // // // // //   const shuffleOneBtn = document.getElementById("shuffleOneBtn");
// // // // // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // // // // //   const trackList = document.getElementById("trackList");
// // // // // // // // // //   const currentTrackDisplay = document.getElementById("currentTrack");
// // // // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // // // //   const volumeSlider = document.getElementById("volumeSlider");

// // // // // // // // // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // // // // // // // // //   folderInput.addEventListener("change", handleFolderSelect);
// // // // // // // // // //   sortBtn.addEventListener("click", toggleSort);
// // // // // // // // // //   shuffleOneBtn.addEventListener("click", () => toggleShuffle("one"));
// // // // // // // // // //   shuffleAllBtn.addEventListener("click", () => toggleShuffle("all"));
// // // // // // // // // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // // // // // // // // //   audioPlayer.addEventListener("ended", playNext);
// // // // // // // // // //   progressBar.addEventListener("input", seekTrack);
// // // // // // // // // //   volumeSlider.addEventListener(
// // // // // // // // // //     "input",
// // // // // // // // // //     () => (audioPlayer.volume = volumeSlider.value)
// // // // // // // // // //   );
// // // // // // // // // //   trackList.addEventListener("click", (e) => {
// // // // // // // // // //     if (e.target.tagName === "LI") {
// // // // // // // // // //       currentTrackIndex = parseInt(e.target.dataset.index);
// // // // // // // // // //       playTrack();
// // // // // // // // // //     }
// // // // // // // // // //   });
// // // // // // // // // // });

// // // // // // // // // // async function handleFolderSelect(event) {
// // // // // // // // // //   tracks = [];
// // // // // // // // // //   const files = event.target.files;
// // // // // // // // // //   for (const file of files) {
// // // // // // // // // //     if (file.type.startsWith("audio/")) {
// // // // // // // // // //       tracks.push({
// // // // // // // // // //         file,
// // // // // // // // // //         name: file.name,
// // // // // // // // // //         path: file.webkitRelativePath,
// // // // // // // // // //         folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
// // // // // // // // // //       });
// // // // // // // // // //     }
// // // // // // // // // //   }
// // // // // // // // // //   updateTrackList();
// // // // // // // // // //   if (tracks.length > 0) {
// // // // // // // // // //     currentTrackIndex = 0;
// // // // // // // // // //     playTrack();
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // function updateTrackList() {
// // // // // // // // // //   const trackList = document.getElementById("trackList");
// // // // // // // // // //   trackList.innerHTML = "";
// // // // // // // // // //   tracks.forEach((track, index) => {
// // // // // // // // // //     const li = document.createElement("li");
// // // // // // // // // //     li.textContent = track.name;
// // // // // // // // // //     li.dataset.index = index;
// // // // // // // // // //     if (index === currentTrackIndex) li.classList.add("active");
// // // // // // // // // //     trackList.appendChild(li);
// // // // // // // // // //   });
// // // // // // // // // // }

// // // // // // // // // // function toggleSort() {
// // // // // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // // // // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // // // // // // // // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // // // // // // // // //     sortBtn.textContent = "Sort: By Folder";
// // // // // // // // // //   } else {
// // // // // // // // // //     tracks.sort(
// // // // // // // // // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // // // // // // // // //     );
// // // // // // // // // //     sortBtn.textContent = "Sort: Alphabetical";
// // // // // // // // // //   }
// // // // // // // // // //   updateTrackList();
// // // // // // // // // //   updateBufferedTracks();
// // // // // // // // // // }

// // // // // // // // // // function toggleShuffle(mode) {
// // // // // // // // // //   const shuffleOneBtn = document.getElementById("shuffleOneBtn");
// // // // // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // // // // //   if (mode === "one") {
// // // // // // // // // //     isShuffleOne = !isShuffleOne;
// // // // // // // // // //     isShuffleAll = false;
// // // // // // // // // //     shuffleOneBtn.classList.toggle("active", isShuffleOne);
// // // // // // // // // //     shuffleAllBtn.classList.remove("active");
// // // // // // // // // //   } else {
// // // // // // // // // //     isShuffleAll = !isShuffleAll;
// // // // // // // // // //     isShuffleOne = false;
// // // // // // // // // //     shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // // // // // // // // //     shuffleOneBtn.classList.remove("active");
// // // // // // // // // //   }
// // // // // // // // // //   if (isShuffleAll) shuffleTracks();
// // // // // // // // // //   updateBufferedTracks();
// // // // // // // // // // }

// // // // // // // // // // function shuffleTracks() {
// // // // // // // // // //   for (let i = tracks.length - 1; i > 0; i--) {
// // // // // // // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // // // // // // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // // // // // // // // //   }
// // // // // // // // // //   updateTrackList();
// // // // // // // // // // }

// // // // // // // // // // function playTrack() {
// // // // // // // // // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // // // // // // // // //   const track = tracks[currentTrackIndex];
// // // // // // // // // //   document.getElementById("currentTrack").textContent = track.name;
// // // // // // // // // //   audioPlayer.src = URL.createObjectURL(track.file);
// // // // // // // // // //   audioPlayer.play();
// // // // // // // // // //   updateBufferedTracks();
// // // // // // // // // //   updateTrackList();
// // // // // // // // // // }

// // // // // // // // // // function updateBufferedTracks() {
// // // // // // // // // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // // // // // // // // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // // // // // // // // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // // // // // // // // //   bufferedTracks.current = new Audio(
// // // // // // // // // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // // // // // // // // //   );

// // // // // // // // // //   const prevIndex = isShuffleOne
// // // // // // // // // //     ? Math.floor(Math.random() * tracks.length)
// // // // // // // // // //     : (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // // // // //   if (prevIndex >= 0 && prevIndex < tracks.length) {
// // // // // // // // // //     bufferedTracks.previous = new Audio(
// // // // // // // // // //       URL.createObjectURL(tracks[prevIndex].file)
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   let nextIndex;
// // // // // // // // // //   if (isShuffleOne) {
// // // // // // // // // //     nextIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // // // //     while (nextIndex === currentTrackIndex)
// // // // // // // // // //       nextIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // // // //   } else {
// // // // // // // // // //     nextIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // // // //   }
// // // // // // // // // //   if (nextIndex < tracks.length) {
// // // // // // // // // //     bufferedTracks.next = new Audio(
// // // // // // // // // //       URL.createObjectURL(tracks[nextIndex].file)
// // // // // // // // // //     );
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // function playNext() {
// // // // // // // // // //   if (isShuffleOne) {
// // // // // // // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // // // //   } else if (isShuffleAll) {
// // // // // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // // // //   } else {
// // // // // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // // // //   }
// // // // // // // // // //   playTrack();
// // // // // // // // // // }

// // // // // // // // // // function updateProgress() {
// // // // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // // // //   if (audioPlayer.duration) {
// // // // // // // // // //     progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // function seekTrack() {
// // // // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // // // //   if (audioPlayer.duration) {
// // // // // // // // // //     audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // let tracks = [];
// // // // // // // // // let currentTrackIndex = -1;
// // // // // // // // // let isShuffleOne = false;
// // // // // // // // // let isShuffleAll = false;
// // // // // // // // // let audioPlayer = null;
// // // // // // // // // let bufferedTracks = {
// // // // // // // // //   previous: null,
// // // // // // // // //   current: null,
// // // // // // // // //   next: null,
// // // // // // // // // };

// // // // // // // // // document.addEventListener("DOMContentLoaded", () => {
// // // // // // // // //   audioPlayer = document.getElementById("audioPlayer");
// // // // // // // // //   const folderInput = document.getElementById("folderInput");
// // // // // // // // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // // // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // // // //   const shuffleOneBtn = document.getElementById("shuffleOneBtn");
// // // // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // // // //   const skipBackBtn = document.getElementById("skipBackBtn");
// // // // // // // // //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// // // // // // // // //   const trackList = document.getElementById("trackList").querySelector("tbody");
// // // // // // // // //   const currentTrackDisplay = document.getElementById("currentTrack");
// // // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // // //   const volumeSlider = document.getElementById("volumeSlider");

// // // // // // // // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // // // // // // // //   folderInput.addEventListener("change", handleFolderSelect);
// // // // // // // // //   sortBtn.addEventListener("click", toggleSort);
// // // // // // // // //   shuffleOneBtn.addEventListener("click", () => toggleShuffle("one"));
// // // // // // // // //   shuffleAllBtn.addEventListener("click", () => toggleShuffle("all"));
// // // // // // // // //   skipBackBtn.addEventListener("click", playPrevious);
// // // // // // // // //   skipForwardBtn.addEventListener("click", playNext);
// // // // // // // // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // // // // // // // //   audioPlayer.addEventListener("ended", playNext);
// // // // // // // // //   progressBar.addEventListener("input", seekTrack);
// // // // // // // // //   volumeSlider.addEventListener(
// // // // // // // // //     "input",
// // // // // // // // //     () => (audioPlayer.volume = volumeSlider.value)
// // // // // // // // //   );
// // // // // // // // //   trackList.addEventListener("click", (e) => {
// // // // // // // // //     const row = e.target.closest("tr");
// // // // // // // // //     if (row) {
// // // // // // // // //       currentTrackIndex = parseInt(row.dataset.index);
// // // // // // // // //       playTrack();
// // // // // // // // //     }
// // // // // // // // //   });
// // // // // // // // // });

// // // // // // // // // async function handleFolderSelect(event) {
// // // // // // // // //   tracks = [];
// // // // // // // // //   const files = event.target.files;
// // // // // // // // //   for (const file of files) {
// // // // // // // // //     if (file.type.startsWith("audio/")) {
// // // // // // // // //       tracks.push({
// // // // // // // // //         file,
// // // // // // // // //         name: file.name,
// // // // // // // // //         path: file.webkitRelativePath,
// // // // // // // // //         folder: file.webkitRelativePath.split("/").slice(0, -1).join("/"),
// // // // // // // // //       });
// // // // // // // // //     }
// // // // // // // // //   }
// // // // // // // // //   updateTrackList();
// // // // // // // // //   if (tracks.length > 0) {
// // // // // // // // //     currentTrackIndex = 0;
// // // // // // // // //     playTrack();
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // function updateTrackList() {
// // // // // // // // //   const trackList = document.getElementById("trackList").querySelector("tbody");
// // // // // // // // //   trackList.innerHTML = "";
// // // // // // // // //   tracks.forEach((track, index) => {
// // // // // // // // //     const tr = document.createElement("tr");
// // // // // // // // //     tr.dataset.index = index;
// // // // // // // // //     if (index === currentTrackIndex) tr.classList.add("active");
// // // // // // // // //     tr.innerHTML = `
// // // // // // // // //             <td>${index + 1}</td>
// // // // // // // // //             <td>${track.name}</td>
// // // // // // // // //             <td>${track.folder || "Root"}</td>
// // // // // // // // //         `;
// // // // // // // // //     trackList.appendChild(tr);
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // // function toggleSort() {
// // // // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // // // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // // // // // // // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // // // // // // // //     sortBtn.textContent = "Sort: By Folder";
// // // // // // // // //   } else {
// // // // // // // // //     tracks.sort(
// // // // // // // // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // // // // // // // //     );
// // // // // // // // //     sortBtn.textContent = "Sort: Alphabetical";
// // // // // // // // //   }
// // // // // // // // //   updateTrackList();
// // // // // // // // //   updateBufferedTracks();
// // // // // // // // // }

// // // // // // // // // function toggleShuffle(mode) {
// // // // // // // // //   const shuffleOneBtn = document.getElementById("shuffleOneBtn");
// // // // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // // // //   if (mode === "one") {
// // // // // // // // //     isShuffleOne = !isShuffleOne;
// // // // // // // // //     isShuffleAll = false;
// // // // // // // // //     shuffleOneBtn.classList.toggle("active", isShuffleOne);
// // // // // // // // //     shuffleAllBtn.classList.remove("active");
// // // // // // // // //   } else {
// // // // // // // // //     isShuffleAll = !isShuffleAll;
// // // // // // // // //     isShuffleOne = false;
// // // // // // // // //     shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // // // // // // // //     shuffleOneBtn.classList.remove("active");
// // // // // // // // //   }
// // // // // // // // //   if (isShuffleAll) shuffleTracks();
// // // // // // // // //   updateBufferedTracks();
// // // // // // // // // }

// // // // // // // // // function shuffleTracks() {
// // // // // // // // //   for (let i = tracks.length - 1; i > 0; i--) {
// // // // // // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // // // // // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // // // // // // // //   }
// // // // // // // // //   updateTrackList();
// // // // // // // // // }

// // // // // // // // // function playTrack() {
// // // // // // // // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // // // // // // // //   const track = tracks[currentTrackIndex];
// // // // // // // // //   document.getElementById("currentTrack").textContent = track.name;
// // // // // // // // //   audioPlayer.src = URL.createObjectURL(track.file);
// // // // // // // // //   audioPlayer.play();
// // // // // // // // //   updateBufferedTracks();
// // // // // // // // //   updateTrackList();
// // // // // // // // // }

// // // // // // // // // function updateBufferedTracks() {
// // // // // // // // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // // // // // // // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // // // // // // // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // // // // // // // //   bufferedTracks.current = new Audio(
// // // // // // // // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // // // // // // // //   );

// // // // // // // // //   const prevIndex = isShuffleOne
// // // // // // // // //     ? Math.floor(Math.random() * tracks.length)
// // // // // // // // //     : (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // // // //   if (prevIndex >= 0 && prevIndex < tracks.length) {
// // // // // // // // //     bufferedTracks.previous = new Audio(
// // // // // // // // //       URL.createObjectURL(tracks[prevIndex].file)
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   let nextIndex;
// // // // // // // // //   if (isShuffleOne) {
// // // // // // // // //     nextIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // // //     while (nextIndex === currentTrackIndex)
// // // // // // // // //       nextIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // // //   } else {
// // // // // // // // //     nextIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // // //   }
// // // // // // // // //   if (nextIndex < tracks.length) {
// // // // // // // // //     bufferedTracks.next = new Audio(
// // // // // // // // //       URL.createObjectURL(tracks[nextIndex].file)
// // // // // // // // //     );
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // function playNext() {
// // // // // // // // //   if (isShuffleOne) {
// // // // // // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // // //   } else if (isShuffleAll) {
// // // // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // // //   } else {
// // // // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // // //   }
// // // // // // // // //   playTrack();
// // // // // // // // // }

// // // // // // // // // function playPrevious() {
// // // // // // // // //   if (isShuffleOne) {
// // // // // // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // // //   } else if (isShuffleAll) {
// // // // // // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // // // //   } else {
// // // // // // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // // // //   }
// // // // // // // // //   playTrack();
// // // // // // // // // }

// // // // // // // // // function updateProgress() {
// // // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // // //   if (audioPlayer.duration) {
// // // // // // // // //     progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // function seekTrack() {
// // // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // // //   if (audioPlayer.duration) {
// // // // // // // // //     audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // let tracks = [];
// // // // // // // // let currentTrackIndex = -1;
// // // // // // // // let isShuffleOne = false;
// // // // // // // // let isShuffleAll = false;
// // // // // // // // let audioPlayer = null;
// // // // // // // // let bufferedTracks = {
// // // // // // // //   previous: null,
// // // // // // // //   current: null,
// // // // // // // //   next: null,
// // // // // // // // };

// // // // // // // // document.addEventListener("DOMContentLoaded", () => {
// // // // // // // //   audioPlayer = document.getElementById("audioPlayer");
// // // // // // // //   const folderInput = document.getElementById("folderInput");
// // // // // // // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // // //   const shuffleOneBtn = document.getElementById("shuffleOneBtn");
// // // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // // //   const skipBackBtn = document.getElementById("skipBackBtn");
// // // // // // // //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// // // // // // // //   const trackListBody = document
// // // // // // // //     .getElementById("trackList")
// // // // // // // //     .querySelector("tbody");
// // // // // // // //   const currentTrackDisplay = document.getElementById("currentTrack");
// // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // //   const volumeSlider = document.getElementById("volumeSlider");

// // // // // // // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // // // // // // //   folderInput.addEventListener("change", handleFolderSelect);
// // // // // // // //   sortBtn.addEventListener("click", toggleSort);
// // // // // // // //   shuffleOneBtn.addEventListener("click", () => toggleShuffle("one"));
// // // // // // // //   shuffleAllBtn.addEventListener("click", () => toggleShuffle("all"));
// // // // // // // //   skipBackBtn.addEventListener("click", playPrevious);
// // // // // // // //   skipForwardBtn.addEventListener("click", playNext);
// // // // // // // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // // // // // // //   audioPlayer.addEventListener("ended", playNext);
// // // // // // // //   progressBar.addEventListener("input", seekTrack);
// // // // // // // //   volumeSlider.addEventListener(
// // // // // // // //     "input",
// // // // // // // //     () => (audioPlayer.volume = volumeSlider.value)
// // // // // // // //   );
// // // // // // // //   trackListBody.addEventListener("click", (e) => {
// // // // // // // //     const row = e.target.closest("tr");
// // // // // // // //     if (row) {
// // // // // // // //       currentTrackIndex = parseInt(row.dataset.index);
// // // // // // // //       playTrack();
// // // // // // // //     }
// // // // // // // //   });
// // // // // // // // });

// // // // // // // // // async function handleFolderSelect(event) {
// // // // // // // // //   tracks = [];
// // // // // // // // //   const files = event.target.files;
// // // // // // // // //   for (const file of files) {
// // // // // // // // //     if (file.type.startsWith("audio/")) {
// // // // // // // // //       tracks.push({
// // // // // // // // //         file,
// // // // // // // // //         name: file.name,
// // // // // // // // //         path: file.webkitRelativePath,
// // // // // // // // //         folder:
// // // // // // // // //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// // // // // // // // //       });
// // // // // // // // //     }
// // // // // // // // //   }
// // // // // // // // //   updateTrackList();
// // // // // // // // //   if (tracks.length > 0) {
// // // // // // // // //     currentTrackIndex = 0;
// // // // // // // // //     playTrack();
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // async function handleFolderSelect(event) {
// // // // // // // //   tracks = [];
// // // // // // // //   const files = event.target.files;
// // // // // // // //   console.log("Files detected:", files.length); // Debug line
// // // // // // // //   for (const file of files) {
// // // // // // // //     if (file.type.startsWith("audio/")) {
// // // // // // // //       tracks.push({
// // // // // // // //         file,
// // // // // // // //         name: file.name,
// // // // // // // //         path: file.webkitRelativePath,
// // // // // // // //         folder:
// // // // // // // //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// // // // // // // //       });
// // // // // // // //     }
// // // // // // // //   }
// // // // // // // //   console.log("Tracks loaded:", tracks); // Debug line
// // // // // // // //   updateTrackList();
// // // // // // // //   if (tracks.length > 0) {
// // // // // // // //     currentTrackIndex = 0;
// // // // // // // //     playTrack();
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // // function updateTrackList() {
// // // // // // // // //   const trackListBody = document
// // // // // // // // //     .getElementById("trackList")
// // // // // // // // //     .querySelector("tbody");
// // // // // // // // //   trackListBody.innerHTML = "";
// // // // // // // // //   tracks.forEach((track, index) => {
// // // // // // // // //     const tr = document.createElement("tr");
// // // // // // // // //     tr.dataset.index = index;
// // // // // // // // //     if (index === currentTrackIndex) tr.classList.add("active");
// // // // // // // // //     tr.innerHTML = `
// // // // // // // // //             <td>${index + 1}</td>
// // // // // // // // //             <td>${track.name}</td>
// // // // // // // // //             <td>${track.folder}</td>
// // // // // // // // //         `;
// // // // // // // // //     trackListBody.appendChild(tr);
// // // // // // // // //   });
// // // // // // // // // }

// // // // // // // // function updateTrackList() {
// // // // // // // //   const trackListBody = document
// // // // // // // //     .getElementById("trackList")
// // // // // // // //     .querySelector("tbody");
// // // // // // // //   trackListBody.innerHTML = "";
// // // // // // // //   tracks.forEach((track, index) => {
// // // // // // // //     const tr = document.createElement("tr");
// // // // // // // //     tr.dataset.index = index;
// // // // // // // //     if (index === currentTrackIndex) tr.classList.add("active");
// // // // // // // //     tr.innerHTML = `
// // // // // // // //             <td>${index + 1}</td>
// // // // // // // //             <td>${track.name}</td>
// // // // // // // //             <td>${track.folder}</td>
// // // // // // // //         `;
// // // // // // // //     trackListBody.appendChild(tr);
// // // // // // // //   });
// // // // // // // // }

// // // // // // // // function toggleSort() {
// // // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // // // // // // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // // // // // // //     sortBtn.textContent = "Sort: By Folder";
// // // // // // // //   } else {
// // // // // // // //     tracks.sort(
// // // // // // // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // // // // // // //     );
// // // // // // // //     sortBtn.textContent = "Sort: Alphabetical";
// // // // // // // //   }
// // // // // // // //   updateTrackList();
// // // // // // // //   updateBufferedTracks();
// // // // // // // // }

// // // // // // // // function toggleShuffle(mode) {
// // // // // // // //   const shuffleOneBtn = document.getElementById("shuffleOneBtn");
// // // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // // //   if (mode === "one") {
// // // // // // // //     isShuffleOne = !isShuffleOne;
// // // // // // // //     isShuffleAll = false;
// // // // // // // //     shuffleOneBtn.classList.toggle("active", isShuffleOne);
// // // // // // // //     shuffleAllBtn.classList.remove("active");
// // // // // // // //   } else {
// // // // // // // //     isShuffleAll = !isShuffleAll;
// // // // // // // //     isShuffleOne = false;
// // // // // // // //     shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // // // // // // //     shuffleOneBtn.classList.remove("active");
// // // // // // // //   }
// // // // // // // //   if (isShuffleAll) shuffleTracks();
// // // // // // // //   updateBufferedTracks();
// // // // // // // // }

// // // // // // // // function shuffleTracks() {
// // // // // // // //   for (let i = tracks.length - 1; i > 0; i--) {
// // // // // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // // // // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // // // // // // //   }
// // // // // // // //   updateTrackList();
// // // // // // // // }

// // // // // // // // function playTrack() {
// // // // // // // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // // // // // // //   const track = tracks[currentTrackIndex];
// // // // // // // //   document.getElementById("currentTrack").textContent = track.name;
// // // // // // // //   audioPlayer.src = URL.createObjectURL(track.file);
// // // // // // // //   audioPlayer.play();
// // // // // // // //   updateBufferedTracks();
// // // // // // // //   updateTrackList();
// // // // // // // // }

// // // // // // // // function updateBufferedTracks() {
// // // // // // // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // // // // // // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // // // // // // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // // // // // // //   bufferedTracks.current = new Audio(
// // // // // // // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // // // // // // //   );

// // // // // // // //   const prevIndex = isShuffleOne
// // // // // // // //     ? Math.floor(Math.random() * tracks.length)
// // // // // // // //     : (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // // //   if (prevIndex >= 0 && prevIndex < tracks.length) {
// // // // // // // //     bufferedTracks.previous = new Audio(
// // // // // // // //       URL.createObjectURL(tracks[prevIndex].file)
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   let nextIndex;
// // // // // // // //   if (isShuffleOne) {
// // // // // // // //     nextIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // //     while (nextIndex === currentTrackIndex)
// // // // // // // //       nextIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // //   } else {
// // // // // // // //     nextIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // //   }
// // // // // // // //   if (nextIndex < tracks.length) {
// // // // // // // //     bufferedTracks.next = new Audio(
// // // // // // // //       URL.createObjectURL(tracks[nextIndex].file)
// // // // // // // //     );
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // function playNext() {
// // // // // // // //   if (isShuffleOne) {
// // // // // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // //   } else if (isShuffleAll) {
// // // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // //   } else {
// // // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // // //   }
// // // // // // // //   playTrack();
// // // // // // // // }

// // // // // // // // function playPrevious() {
// // // // // // // //   if (isShuffleOne) {
// // // // // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // // // // //   } else if (isShuffleAll) {
// // // // // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // // //   } else {
// // // // // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // // //   }
// // // // // // // //   playTrack();
// // // // // // // // }

// // // // // // // // function updateProgress() {
// // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // //   if (audioPlayer.duration) {
// // // // // // // //     progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // function seekTrack() {
// // // // // // // //   const progressBar = document.getElementById("progressBar");
// // // // // // // //   if (audioPlayer.duration) {
// // // // // // // //     audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
// // // // // // // //   }
// // // // // // // // }

// // // // // // // let tracks = [];
// // // // // // // let currentTrackIndex = -1;
// // // // // // // let isRepeatCurrent = false;
// // // // // // // let isShuffleAll = false;
// // // // // // // let audioPlayer = null;
// // // // // // // let bufferedTracks = {
// // // // // // //   previous: null,
// // // // // // //   current: null,
// // // // // // //   next: null,
// // // // // // // };

// // // // // // // document.addEventListener("DOMContentLoaded", () => {
// // // // // // //   audioPlayer = document.getElementById("audioPlayer");
// // // // // // //   const folderInput = document.getElementById("folderInput");
// // // // // // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // //   const skipBackBtn = document.getElementById("skipBackBtn");
// // // // // // //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// // // // // // //   const trackListBody = document
// // // // // // //     .getElementById("trackList")
// // // // // // //     .querySelector("tbody");

// // // // // // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // // // // // //   folderInput.addEventListener("change", handleFolderSelect);
// // // // // // //   sortBtn.addEventListener("click", toggleSort);
// // // // // // //   repeatCurrentBtn.addEventListener("click", () => toggleRepeat());
// // // // // // //   shuffleAllBtn.addEventListener("click", () => toggleShuffle());
// // // // // // //   skipBackBtn.addEventListener("click", playPrevious);
// // // // // // //   skipForwardBtn.addEventListener("click", playNext);
// // // // // // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // // // // // //   audioPlayer.addEventListener("ended", handleTrackEnd);
// // // // // // //   trackListBody.addEventListener("click", (e) => {
// // // // // // //     const row = e.target.closest("tr");
// // // // // // //     if (row) {
// // // // // // //       currentTrackIndex = parseInt(row.dataset.index);
// // // // // // //       playTrack();
// // // // // // //     }
// // // // // // //   });

// // // // // // //   // Column resizing
// // // // // // //   const headers = document.querySelectorAll("#trackList th.resize");
// // // // // // //   headers.forEach((header) => {
// // // // // // //     header.addEventListener("mousedown", (e) => {
// // // // // // //       if (e.offsetX > header.offsetWidth - 10) {
// // // // // // //         let startX = e.clientX;
// // // // // // //         let startWidth = header.offsetWidth;
// // // // // // //         const onMouseMove = (moveEvent) => {
// // // // // // //           let newWidth = startWidth + (moveEvent.clientX - startX);
// // // // // // //           if (newWidth >= 50) {
// // // // // // //             header.style.width = `${newWidth}px`;
// // // // // // //           }
// // // // // // //         };
// // // // // // //         const onMouseUp = () => {
// // // // // // //           document.removeEventListener("mousemove", onMouseMove);
// // // // // // //           document.removeEventListener("mouseup", onMouseUp);
// // // // // // //         };
// // // // // // //         document.addEventListener("mousemove", onMouseMove);
// // // // // // //         document.addEventListener("mouseup", onMouseUp);
// // // // // // //       }
// // // // // // //     });
// // // // // // //   });
// // // // // // // });

// // // // // // // async function handleFolderSelect(event) {
// // // // // // //   tracks = [];
// // // // // // //   const files = event.target.files;
// // // // // // //   for (const file of files) {
// // // // // // //     if (file.type.startsWith("audio/")) {
// // // // // // //       tracks.push({
// // // // // // //         file,
// // // // // // //         name: file.name,
// // // // // // //         path: file.webkitRelativePath,
// // // // // // //         folder:
// // // // // // //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// // // // // // //       });
// // // // // // //     }
// // // // // // //   }
// // // // // // //   updateTrackList();
// // // // // // //   if (tracks.length > 0) {
// // // // // // //     currentTrackIndex = 0;
// // // // // // //     playTrack();
// // // // // // //   }
// // // // // // // }

// // // // // // // function updateTrackList() {
// // // // // // //   const trackListBody = document
// // // // // // //     .getElementById("trackList")
// // // // // // //     .querySelector("tbody");
// // // // // // //   trackListBody.innerHTML = "";
// // // // // // //   tracks.forEach((track, index) => {
// // // // // // //     const tr = document.createElement("tr");
// // // // // // //     tr.dataset.index = index;
// // // // // // //     if (index === currentTrackIndex) tr.classList.add("active");
// // // // // // //     tr.innerHTML = `
// // // // // // //             <td>${index + 1}</td>
// // // // // // //             <td>${track.name}</td>
// // // // // // //             <td>${track.folder}</td>
// // // // // // //         `;
// // // // // // //     trackListBody.appendChild(tr);
// // // // // // //   });
// // // // // // // }

// // // // // // // function toggleSort() {
// // // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // // // // // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // // // // // //     sortBtn.textContent = "Sort: By Folder";
// // // // // // //   } else {
// // // // // // //     tracks.sort(
// // // // // // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // // // // // //     );
// // // // // // //     sortBtn.textContent = "Sort: Alphabetical";
// // // // // // //   }
// // // // // // //   updateTrackList();
// // // // // // //   updateBufferedTracks();
// // // // // // // }

// // // // // // // function toggleRepeat() {
// // // // // // //   isRepeatCurrent = !isRepeatCurrent;
// // // // // // //   isShuffleAll = false;
// // // // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // //   repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
// // // // // // //   shuffleAllBtn.classList.remove("active");
// // // // // // //   audioPlayer.loop = isRepeatCurrent;
// // // // // // //   updateBufferedTracks();
// // // // // // // }

// // // // // // // function toggleShuffle() {
// // // // // // //   isShuffleAll = !isShuffleAll;
// // // // // // //   isRepeatCurrent = false;
// // // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // // // //   shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // // // // // //   repeatCurrentBtn.classList.remove("active");
// // // // // // //   audioPlayer.loop = false;
// // // // // // //   if (isShuffleAll) shuffleTracks();
// // // // // // //   updateBufferedTracks();
// // // // // // // }

// // // // // // // function shuffleTracks() {
// // // // // // //   for (let i = tracks.length - 1; i > 0; i--) {
// // // // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // // // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // // // // // //   }
// // // // // // //   updateTrackList();
// // // // // // // }

// // // // // // // function playTrack() {
// // // // // // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // // // // // //   const track = tracks[currentTrackIndex];
// // // // // // //   document.getElementById("currentTrack").textContent = track.name;
// // // // // // //   audioPlayer.src = URL.createObjectURL(track.file);
// // // // // // //   audioPlayer.play();
// // // // // // //   updateBufferedTracks();
// // // // // // //   updateTrackList();
// // // // // // // }

// // // // // // // function updateBufferedTracks() {
// // // // // // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // // // // // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // // // // // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // // // // // //   bufferedTracks.current = new Audio(
// // // // // // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // // // // // //   );

// // // // // // //   const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // //   if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
// // // // // // //     bufferedTracks.previous = new Audio(
// // // // // // //       URL.createObjectURL(tracks[prevIndex].file)
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const nextIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // //   if (nextIndex < tracks.length && !isRepeatCurrent) {
// // // // // // //     bufferedTracks.next = new Audio(
// // // // // // //       URL.createObjectURL(tracks[nextIndex].file)
// // // // // // //     );
// // // // // // //   }
// // // // // // // }

// // // // // // // function handleTrackEnd() {
// // // // // // //   if (isRepeatCurrent) {
// // // // // // //     audioPlayer.play();
// // // // // // //   } else if (isShuffleAll) {
// // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // //     playTrack();
// // // // // // //   } else {
// // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // //     playTrack();
// // // // // // //   }
// // // // // // // }

// // // // // // // function playNext() {
// // // // // // //   if (isRepeatCurrent) {
// // // // // // //     audioPlayer.play();
// // // // // // //   } else if (isShuffleAll) {
// // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // //     playTrack();
// // // // // // //   } else {
// // // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // // //     playTrack();
// // // // // // //   }
// // // // // // // }

// // // // // // // function playPrevious() {
// // // // // // //   if (isRepeatCurrent) {
// // // // // // //     audioPlayer.play();
// // // // // // //   } else if (isShuffleAll) {
// // // // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // //     playTrack();
// // // // // // //   } else {
// // // // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // // //     playTrack();
// // // // // // //   }
// // // // // // // }

// // // // // // // function updateProgress() {
// // // // // // //   if (audioPlayer.duration) {
// // // // // // //     document
// // // // // // //       .getElementById("audioPlayer")
// // // // // // //       .setAttribute("max", audioPlayer.duration);
// // // // // // //     document
// // // // // // //       .getElementById("audioPlayer")
// // // // // // //       .setAttribute("value", audioPlayer.currentTime);
// // // // // // //   }
// // // // // // // }

// // // // // // let tracks = [];
// // // // // // let currentTrackIndex = -1;
// // // // // // let isRepeatCurrent = false;
// // // // // // let isShuffleAll = false;
// // // // // // let audioPlayer = null;
// // // // // // let bufferedTracks = {
// // // // // //   previous: null,
// // // // // //   current: null,
// // // // // //   next: null,
// // // // // // };

// // // // // // document.addEventListener("DOMContentLoaded", () => {
// // // // // //   audioPlayer = document.getElementById("audioPlayer");
// // // // // //   const folderInput = document.getElementById("folderInput");
// // // // // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // //   const skipBackBtn = document.getElementById("skipBackBtn");
// // // // // //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// // // // // //   const trackListBody = document
// // // // // //     .getElementById("trackList")
// // // // // //     .querySelector("tbody");

// // // // // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // // // // //   folderInput.addEventListener("change", handleFolderSelect);
// // // // // //   sortBtn.addEventListener("click", toggleSort);
// // // // // //   repeatCurrentBtn.addEventListener("click", () => toggleRepeat());
// // // // // //   shuffleAllBtn.addEventListener("click", () => toggleShuffle());
// // // // // //   skipBackBtn.addEventListener("click", () => playPrevious());
// // // // // //   skipForwardBtn.addEventListener("click", () => playNext());
// // // // // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // // // // //   audioPlayer.addEventListener("ended", handleTrackEnd);
// // // // // //   trackListBody.addEventListener("click", (e) => {
// // // // // //     const row = e.target.closest("tr");
// // // // // //     if (row) {
// // // // // //       currentTrackIndex = parseInt(row.dataset.index);
// // // // // //       playTrack();
// // // // // //     }
// // // // // //   });

// // // // // //   // Column resizing
// // // // // //   const headers = document.querySelectorAll("#trackList th.resize");
// // // // // //   headers.forEach((header) => {
// // // // // //     header.addEventListener("mousedown", (e) => {
// // // // // //       if (e.offsetX > header.offsetWidth - 10) {
// // // // // //         let startX = e.clientX;
// // // // // //         let startWidth = header.offsetWidth;
// // // // // //         const onMouseMove = (moveEvent) => {
// // // // // //           let newWidth = startWidth + (moveEvent.clientX - startX);
// // // // // //           if (newWidth >= 50) {
// // // // // //             header.style.width = `${newWidth}px`;
// // // // // //           }
// // // // // //         };
// // // // // //         const onMouseUp = () => {
// // // // // //           document.removeEventListener("mousemove", onMouseMove);
// // // // // //           document.removeEventListener("mouseup", onMouseUp);
// // // // // //         };
// // // // // //         document.addEventListener("mousemove", onMouseMove);
// // // // // //         document.addEventListener("mouseup", onMouseUp);
// // // // // //       }
// // // // // //     });
// // // // // //   });
// // // // // // });

// // // // // // async function handleFolderSelect(event) {
// // // // // //   tracks = [];
// // // // // //   const files = event.target.files;
// // // // // //   for (const file of files) {
// // // // // //     if (file.type.startsWith("audio/")) {
// // // // // //       tracks.push({
// // // // // //         file,
// // // // // //         name: file.name,
// // // // // //         path: file.webkitRelativePath,
// // // // // //         folder:
// // // // // //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// // // // // //       });
// // // // // //     }
// // // // // //   }
// // // // // //   updateTrackList();
// // // // // //   if (tracks.length > 0) {
// // // // // //     currentTrackIndex = 0;
// // // // // //     playTrack();
// // // // // //   }
// // // // // // }

// // // // // // function updateTrackList() {
// // // // // //   const trackListBody = document
// // // // // //     .getElementById("trackList")
// // // // // //     .querySelector("tbody");
// // // // // //   trackListBody.innerHTML = "";
// // // // // //   tracks.forEach((track, index) => {
// // // // // //     const tr = document.createElement("tr");
// // // // // //     tr.dataset.index = index;
// // // // // //     if (index === currentTrackIndex) tr.classList.add("active");
// // // // // //     tr.innerHTML = `
// // // // // //             <td>${index + 1}</td>
// // // // // //             <td>${track.name}</td>
// // // // // //             <td>${track.folder}</td>
// // // // // //         `;
// // // // // //     trackListBody.appendChild(tr);
// // // // // //   });
// // // // // // }

// // // // // // function toggleSort() {
// // // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // // // // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // // // // //     sortBtn.textContent = "Sort: By Folder";
// // // // // //   } else {
// // // // // //     tracks.sort(
// // // // // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // // // // //     );
// // // // // //     sortBtn.textContent = "Sort: Alphabetical";
// // // // // //   }
// // // // // //   updateTrackList();
// // // // // //   updateBufferedTracks();
// // // // // // }

// // // // // // function toggleRepeat() {
// // // // // //   isRepeatCurrent = !isRepeatCurrent;
// // // // // //   isShuffleAll = false;
// // // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // //   repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
// // // // // //   shuffleAllBtn.classList.remove("active");
// // // // // //   audioPlayer.loop = isRepeatCurrent;
// // // // // //   updateBufferedTracks();
// // // // // // }

// // // // // // function toggleShuffle() {
// // // // // //   isShuffleAll = !isShuffleAll;
// // // // // //   isRepeatCurrent = false;
// // // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // // //   shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // // // // //   repeatCurrentBtn.classList.remove("active");
// // // // // //   audioPlayer.loop = false;
// // // // // //   if (isShuffleAll) shuffleTracks();
// // // // // //   updateBufferedTracks();
// // // // // // }

// // // // // // function shuffleTracks() {
// // // // // //   for (let i = tracks.length - 1; i > 0; i--) {
// // // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // // // // //   }
// // // // // //   updateTrackList();
// // // // // // }

// // // // // // function playTrack() {
// // // // // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // // // // //   const track = tracks[currentTrackIndex];
// // // // // //   document.getElementById("currentTrack").textContent = track.name;
// // // // // //   audioPlayer.src = URL.createObjectURL(track.file);
// // // // // //   audioPlayer.play();
// // // // // //   updateBufferedTracks();
// // // // // //   updateTrackList();
// // // // // // }

// // // // // // function updateBufferedTracks() {
// // // // // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // // // // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // // // // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // // // // //   bufferedTracks.current = new Audio(
// // // // // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // // // // //   );

// // // // // //   const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // //   if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
// // // // // //     bufferedTracks.previous = new Audio(
// // // // // //       URL.createObjectURL(tracks[prevIndex].file)
// // // // // //     );
// // // // // //   }

// // // // // //   const nextIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // //   if (nextIndex < tracks.length && !isRepeatCurrent) {
// // // // // //     bufferedTracks.next = new Audio(
// // // // // //       URL.createObjectURL(tracks[nextIndex].file)
// // // // // //     );
// // // // // //   }
// // // // // // }

// // // // // // function handleTrackEnd() {
// // // // // //   if (isRepeatCurrent) {
// // // // // //     audioPlayer.play();
// // // // // //   } else if (isShuffleAll) {
// // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // //     playTrack();
// // // // // //   } else {
// // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // //     playTrack();
// // // // // //   }
// // // // // // }

// // // // // // function playNext() {
// // // // // //   if (isRepeatCurrent) return;
// // // // // //   if (isShuffleAll) {
// // // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // // //   } else {
// // // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // // //   }
// // // // // //   playTrack();
// // // // // // }

// // // // // // function playPrevious() {
// // // // // //   if (isRepeatCurrent) return;
// // // // // //   if (isShuffleAll) {
// // // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // // //   } else {
// // // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // // //   }
// // // // // //   playTrack();
// // // // // // }

// // // // // // function updateProgress() {
// // // // // //   if (audioPlayer.duration) {
// // // // // //     const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// // // // // //     document.getElementById("audioPlayer").setAttribute("value", progress);
// // // // // //   }
// // // // // // }

// // // // // let tracks = [];
// // // // // let currentTrackIndex = -1;
// // // // // let isRepeatCurrent = false;
// // // // // let isShuffleAll = false;
// // // // // let audioPlayer = null;
// // // // // let bufferedTracks = {
// // // // //   previous: null,
// // // // //   current: null,
// // // // //   next: null,
// // // // // };

// // // // // document.addEventListener("DOMContentLoaded", () => {
// // // // //   audioPlayer = document.getElementById("audioPlayer");
// // // // //   const folderInput = document.getElementById("folderInput");
// // // // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // //   const skipBackBtn = document.getElementById("skipBackBtn");
// // // // //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// // // // //   const trackListBody = document
// // // // //     .getElementById("trackList")
// // // // //     .querySelector("tbody");

// // // // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // // // //   folderInput.addEventListener("change", handleFolderSelect);
// // // // //   sortBtn.addEventListener("click", toggleSort);
// // // // //   repeatCurrentBtn.addEventListener("click", toggleRepeat);
// // // // //   shuffleAllBtn.addEventListener("click", toggleShuffle);
// // // // //   skipBackBtn.addEventListener("click", playPrevious);
// // // // //   skipForwardBtn.addEventListener("click", playNext);
// // // // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // // // //   audioPlayer.addEventListener("ended", handleTrackEnd);
// // // // //   trackListBody.addEventListener("click", (e) => {
// // // // //     const row = e.target.closest("tr");
// // // // //     if (row) {
// // // // //       currentTrackIndex = parseInt(row.dataset.index);
// // // // //       playTrack();
// // // // //     }
// // // // //   });

// // // // //   // Column resizing
// // // // //   const headers = document.querySelectorAll("#trackList th.resize");
// // // // //   headers.forEach((header) => {
// // // // //     header.addEventListener("mousedown", (e) => {
// // // // //       if (e.offsetX > header.offsetWidth - 10) {
// // // // //         e.preventDefault();
// // // // //         let startX = e.clientX;
// // // // //         let startWidth = header.offsetWidth;
// // // // //         const onMouseMove = (moveEvent) => {
// // // // //           let newWidth = startWidth + (moveEvent.clientX - startX);
// // // // //           if (newWidth >= 50) {
// // // // //             header.style.width = `${newWidth}px`;
// // // // //             header.style.minWidth = `${newWidth}px`;
// // // // //           }
// // // // //         };
// // // // //         const onMouseUp = () => {
// // // // //           document.removeEventListener("mousemove", onMouseMove);
// // // // //           document.removeEventListener("mouseup", onMouseUp);
// // // // //         };
// // // // //         document.addEventListener("mousemove", onMouseMove);
// // // // //         document.addEventListener("mouseup", onMouseUp);
// // // // //       }
// // // // //     });
// // // // //   });
// // // // // });

// // // // // async function handleFolderSelect(event) {
// // // // //   tracks = [];
// // // // //   const files = event.target.files;
// // // // //   for (const file of files) {
// // // // //     if (file.type.startsWith("audio/")) {
// // // // //       tracks.push({
// // // // //         file,
// // // // //         name: file.name,
// // // // //         path: file.webkitRelativePath,
// // // // //         folder:
// // // // //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// // // // //       });
// // // // //     }
// // // // //   }
// // // // //   updateTrackList();
// // // // //   if (tracks.length > 0) {
// // // // //     currentTrackIndex = 0;
// // // // //     playTrack();
// // // // //   }
// // // // // }

// // // // // function updateTrackList() {
// // // // //   const trackListBody = document
// // // // //     .getElementById("trackList")
// // // // //     .querySelector("tbody");
// // // // //   trackListBody.innerHTML = "";
// // // // //   tracks.forEach((track, index) => {
// // // // //     const tr = document.createElement("tr");
// // // // //     tr.dataset.index = index;
// // // // //     if (index === currentTrackIndex) tr.classList.add("active");
// // // // //     tr.innerHTML = `
// // // // //             <td>${index + 1}</td>
// // // // //             <td>${track.name}</td>
// // // // //             <td>${track.folder}</td>
// // // // //         `;
// // // // //     trackListBody.appendChild(tr);
// // // // //   });
// // // // // }

// // // // // function toggleSort() {
// // // // //   const sortBtn = document.getElementById("sortBtn");
// // // // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // // // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // // // //     sortBtn.textContent = "Sort: By Folder";
// // // // //   } else {
// // // // //     tracks.sort(
// // // // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // // // //     );
// // // // //     sortBtn.textContent = "Sort: Alphabetical";
// // // // //   }
// // // // //   updateTrackList();
// // // // //   updateBufferedTracks();
// // // // // }

// // // // // function toggleRepeat() {
// // // // //   isRepeatCurrent = !isRepeatCurrent;
// // // // //   isShuffleAll = false;
// // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // //   repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
// // // // //   shuffleAllBtn.classList.remove("active");
// // // // //   audioPlayer.loop = isRepeatCurrent;
// // // // //   updateBufferedTracks();
// // // // // }

// // // // // function toggleShuffle() {
// // // // //   isShuffleAll = !isShuffleAll;
// // // // //   isRepeatCurrent = false;
// // // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // // //   shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // // // //   repeatCurrentBtn.classList.remove("active");
// // // // //   audioPlayer.loop = false;
// // // // //   if (isShuffleAll) shuffleTracks();
// // // // //   updateBufferedTracks();
// // // // // }

// // // // // function shuffleTracks() {
// // // // //   for (let i = tracks.length - 1; i > 0; i--) {
// // // // //     const j = Math.floor(Math.random() * (i + 1));
// // // // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // // // //   }
// // // // //   updateTrackList();
// // // // // }

// // // // // function playTrack() {
// // // // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // // // //   const track = tracks[currentTrackIndex];
// // // // //   document.getElementById("currentTrack").textContent = track.name;
// // // // //   audioPlayer.src = URL.createObjectURL(track.file);
// // // // //   audioPlayer.play();
// // // // //   updateBufferedTracks();
// // // // //   updateTrackList();
// // // // // }

// // // // // function updateBufferedTracks() {
// // // // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // // // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // // // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // // // //   bufferedTracks.current = new Audio(
// // // // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // // // //   );

// // // // //   const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // //   if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
// // // // //     bufferedTracks.previous = new Audio(
// // // // //       URL.createObjectURL(tracks[prevIndex].file)
// // // // //     );
// // // // //   }

// // // // //   const nextIndex = (currentTrackIndex + 1) % tracks.length;
// // // // //   if (nextIndex < tracks.length && !isRepeatCurrent) {
// // // // //     bufferedTracks.next = new Audio(
// // // // //       URL.createObjectURL(tracks[nextIndex].file)
// // // // //     );
// // // // //   }
// // // // // }

// // // // // function handleTrackEnd() {
// // // // //   if (isRepeatCurrent) {
// // // // //     audioPlayer.play();
// // // // //   } else if (isShuffleAll) {
// // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // //     playTrack();
// // // // //   } else {
// // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // //     playTrack();
// // // // //   }
// // // // // }

// // // // // function playNext() {
// // // // //   if (isShuffleAll) {
// // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // //   } else {
// // // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // // //   }
// // // // //   playTrack();
// // // // // }

// // // // // function playPrevious() {
// // // // //   if (isShuffleAll) {
// // // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // // //   } else {
// // // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // // //   }
// // // // //   playTrack();
// // // // // }

// // // // // function updateProgress() {
// // // // //   if (audioPlayer.duration) {
// // // // //     const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// // // // //     document.getElementById("audioPlayer").setAttribute("value", progress);
// // // // //   }
// // // // // }

// // // // let tracks = [];
// // // // let currentTrackIndex = -1;
// // // // let isRepeatCurrent = false;
// // // // let isShuffleAll = false;
// // // // let audioPlayer = null;
// // // // let bufferedTracks = {
// // // //   previous: null,
// // // //   current: null,
// // // //   next: null,
// // // // };

// // // // document.addEventListener("DOMContentLoaded", () => {
// // // //   audioPlayer = document.getElementById("audioPlayer");
// // // //   const folderInput = document.getElementById("folderInput");
// // // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // // //   const sortBtn = document.getElementById("sortBtn");
// // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // //   const skipBackBtn = document.getElementById("skipBackBtn");
// // // //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// // // //   const trackListBody = document
// // // //     .getElementById("trackList")
// // // //     .querySelector("tbody");

// // // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // // //   folderInput.addEventListener("change", handleFolderSelect);
// // // //   sortBtn.addEventListener("click", toggleSort);
// // // //   repeatCurrentBtn.addEventListener("click", toggleRepeat);
// // // //   shuffleAllBtn.addEventListener("click", toggleShuffle);
// // // //   skipBackBtn.addEventListener("click", playPrevious);
// // // //   skipForwardBtn.addEventListener("click", playNext);
// // // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // // //   audioPlayer.addEventListener("ended", handleTrackEnd);
// // // //   trackListBody.addEventListener("click", (e) => {
// // // //     const row = e.target.closest("tr");
// // // //     if (row) {
// // // //       currentTrackIndex = parseInt(row.dataset.index);
// // // //       playTrack();
// // // //     }
// // // //   });

// // // //   // Column resizing
// // // //   const headers = document.querySelectorAll("#trackList th.resize");
// // // //   headers.forEach((header) => {
// // // //     header.addEventListener("mousedown", (e) => {
// // // //       if (
// // // //         e.offsetX > header.offsetWidth - 10 &&
// // // //         e.offsetX < header.offsetWidth + 10
// // // //       ) {
// // // //         e.preventDefault();
// // // //         e.stopPropagation();
// // // //         let startX = e.clientX;
// // // //         let startWidth = header.offsetWidth;
// // // //         const onMouseMove = (moveEvent) => {
// // // //           let newWidth = startWidth + (moveEvent.clientX - startX);
// // // //           if (newWidth >= 50) {
// // // //             header.style.width = `${newWidth}px`;
// // // //             header.style.minWidth = `${newWidth}px`;
// // // //           }
// // // //         };
// // // //         const onMouseUp = () => {
// // // //           document.removeEventListener("mousemove", onMouseMove);
// // // //           document.removeEventListener("mouseup", onMouseUp);
// // // //         };
// // // //         document.addEventListener("mousemove", onMouseMove);
// // // //         document.addEventListener("mouseup", onMouseUp);
// // // //       }
// // // //     });
// // // //   });
// // // // });

// // // // async function handleFolderSelect(event) {
// // // //   tracks = [];
// // // //   const files = event.target.files;
// // // //   for (const file of files) {
// // // //     if (file.type.startsWith("audio/")) {
// // // //       tracks.push({
// // // //         file,
// // // //         name: file.name,
// // // //         path: file.webkitRelativePath,
// // // //         folder:
// // // //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// // // //       });
// // // //     }
// // // //   }
// // // //   updateTrackList();
// // // //   if (tracks.length > 0) {
// // // //     currentTrackIndex = 0;
// // // //     playTrack();
// // // //   }
// // // // }

// // // // function updateTrackList() {
// // // //   const trackListBody = document
// // // //     .getElementById("trackList")
// // // //     .querySelector("tbody");
// // // //   trackListBody.innerHTML = "";
// // // //   tracks.forEach((track, index) => {
// // // //     const tr = document.createElement("tr");
// // // //     tr.dataset.index = index;
// // // //     if (index === currentTrackIndex) tr.classList.add("active");
// // // //     tr.innerHTML = `
// // // //             <td>${index + 1}</td>
// // // //             <td>${track.name}</td>
// // // //             <td>${track.folder}</td>
// // // //         `;
// // // //     trackListBody.appendChild(tr);
// // // //   });
// // // // }

// // // // function toggleSort() {
// // // //   const sortBtn = document.getElementById("sortBtn");
// // // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // // //     sortBtn.textContent = "Sort: By Folder";
// // // //   } else {
// // // //     tracks.sort(
// // // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // // //     );
// // // //     sortBtn.textContent = "Sort: Alphabetical";
// // // //   }
// // // //   updateTrackList();
// // // //   updateBufferedTracks();
// // // // }

// // // // function toggleRepeat() {
// // // //   isRepeatCurrent = !isRepeatCurrent;
// // // //   isShuffleAll = false;
// // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // //   repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
// // // //   shuffleAllBtn.classList.remove("active");
// // // //   audioPlayer.loop = isRepeatCurrent;
// // // //   updateBufferedTracks();
// // // // }

// // // // function toggleShuffle() {
// // // //   isShuffleAll = !isShuffleAll;
// // // //   isRepeatCurrent = false;
// // // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // // //   shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // // //   repeatCurrentBtn.classList.remove("active");
// // // //   audioPlayer.loop = false;
// // // //   if (isShuffleAll) shuffleTracks();
// // // //   updateBufferedTracks();
// // // // }

// // // // function shuffleTracks() {
// // // //   for (let i = tracks.length - 1; i > 0; i--) {
// // // //     const j = Math.floor(Math.random() * (i + 1));
// // // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // // //   }
// // // //   updateTrackList();
// // // // }

// // // // function playTrack() {
// // // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // // //   const track = tracks[currentTrackIndex];
// // // //   document.getElementById("currentTrack").textContent = track.name;
// // // //   audioPlayer.src = URL.createObjectURL(track.file);
// // // //   audioPlayer.play();
// // // //   updateBufferedTracks();
// // // //   updateTrackList();
// // // // }

// // // // function updateBufferedTracks() {
// // // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // // //   bufferedTracks.current = new Audio(
// // // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // // //   );

// // // //   const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // //   if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
// // // //     bufferedTracks.previous = new Audio(
// // // //       URL.createObjectURL(tracks[prevIndex].file)
// // // //     );
// // // //   }

// // // //   const nextIndex = (currentTrackIndex + 1) % tracks.length;
// // // //   if (nextIndex < tracks.length && !isRepeatCurrent) {
// // // //     bufferedTracks.next = new Audio(
// // // //       URL.createObjectURL(tracks[nextIndex].file)
// // // //     );
// // // //   }
// // // // }

// // // // function handleTrackEnd() {
// // // //   if (isRepeatCurrent) {
// // // //     audioPlayer.play();
// // // //   } else if (isShuffleAll) {
// // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // //     playTrack();
// // // //   } else {
// // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // //     playTrack();
// // // //   }
// // // // }

// // // // function playNext() {
// // // //   if (isShuffleAll) {
// // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // //   } else {
// // // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // // //   }
// // // //   playTrack();
// // // // }

// // // // function playPrevious() {
// // // //   if (isShuffleAll) {
// // // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // // //   } else {
// // // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // // //   }
// // // //   playTrack();
// // // // }

// // // // function updateProgress() {
// // // //   if (audioPlayer.duration) {
// // // //     const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// // // //     document.getElementById("audioPlayer").setAttribute("value", progress);
// // // //   }
// // // // }

// // // let tracks = [];
// // // let currentTrackIndex = -1;
// // // let isRepeatCurrent = false;
// // // let isShuffleAll = false;
// // // let audioPlayer = null;
// // // let bufferedTracks = {
// // //   previous: null,
// // //   current: null,
// // //   next: null,
// // // };

// // // document.addEventListener("DOMContentLoaded", () => {
// // //   audioPlayer = document.getElementById("audioPlayer");
// // //   const folderInput = document.getElementById("folderInput");
// // //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// // //   const sortBtn = document.getElementById("sortBtn");
// // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // //   const skipBackBtn = document.getElementById("skipBackBtn");
// // //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// // //   const trackListBody = document
// // //     .getElementById("trackList")
// // //     .querySelector("tbody");

// // //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// // //   folderInput.addEventListener("change", handleFolderSelect);
// // //   sortBtn.addEventListener("click", toggleSort);
// // //   repeatCurrentBtn.addEventListener("click", toggleRepeat);
// // //   shuffleAllBtn.addEventListener("click", toggleShuffle);
// // //   skipBackBtn.addEventListener("click", playPrevious);
// // //   skipForwardBtn.addEventListener("click", playNext);
// // //   audioPlayer.addEventListener("timeupdate", updateProgress);
// // //   audioPlayer.addEventListener("ended", handleTrackEnd);
// // //   trackListBody.addEventListener("click", (e) => {
// // //     const row = e.target.closest("tr");
// // //     if (row) {
// // //       currentTrackIndex = parseInt(row.dataset.index);
// // //       playTrack();
// // //     }
// // //   });

// // //   // Column resizing
// // //   const headers = document.querySelectorAll("#trackList th.resize");
// // //   headers.forEach((header) => {
// // //     const resizer = header.querySelector("::after") || header;
// // //     header.addEventListener("mousedown", (e) => {
// // //       if (
// // //         e.offsetX > header.offsetWidth - 10 &&
// // //         e.offsetX < header.offsetWidth + 10
// // //       ) {
// // //         e.preventDefault();
// // //         e.stopPropagation();
// // //         let startX = e.clientX;
// // //         let startWidth = header.offsetWidth;
// // //         const onMouseMove = (moveEvent) => {
// // //           moveEvent.preventDefault();
// // //           let newWidth = startWidth + (moveEvent.clientX - startX);
// // //           if (newWidth >= 50) {
// // //             header.style.width = `${newWidth}px`;
// // //             header.style.minWidth = `${newWidth}px`;
// // //           }
// // //         };
// // //         const onMouseUp = () => {
// // //           document.removeEventListener("mousemove", onMouseMove);
// // //           document.removeEventListener("mouseup", onMouseUp);
// // //         };
// // //         document.addEventListener("mousemove", onMouseMove);
// // //         document.addEventListener("mouseup", onMouseUp);
// // //       }
// // //     });
// // //   });
// // // });

// // // async function handleFolderSelect(event) {
// // //   tracks = [];
// // //   const files = event.target.files;
// // //   for (const file of files) {
// // //     if (file.type.startsWith("audio/")) {
// // //       tracks.push({
// // //         file,
// // //         name: file.name,
// // //         path: file.webkitRelativePath,
// // //         folder:
// // //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// // //       });
// // //     }
// // //   }
// // //   updateTrackList();
// // //   if (tracks.length > 0) {
// // //     currentTrackIndex = 0;
// // //     playTrack();
// // //   }
// // // }

// // // function updateTrackList() {
// // //   const trackListBody = document
// // //     .getElementById("trackList")
// // //     .querySelector("tbody");
// // //   trackListBody.innerHTML = "";
// // //   tracks.forEach((track, index) => {
// // //     const tr = document.createElement("tr");
// // //     tr.dataset.index = index;
// // //     if (index === currentTrackIndex) tr.classList.add("active");
// // //     tr.innerHTML = `
// // //             <td>${index + 1}</td>
// // //             <td>${track.name}</td>
// // //             <td>${track.folder}</td>
// // //         `;
// // //     trackListBody.appendChild(tr);
// // //   });
// // // }

// // // function toggleSort() {
// // //   const sortBtn = document.getElementById("sortBtn");
// // //   if (sortBtn.textContent.includes("Alphabetical")) {
// // //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// // //     sortBtn.textContent = "Sort: By Folder";
// // //   } else {
// // //     tracks.sort(
// // //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// // //     );
// // //     sortBtn.textContent = "Sort: Alphabetical";
// // //   }
// // //   updateTrackList();
// // //   updateBufferedTracks();
// // // }

// // // function toggleRepeat() {
// // //   isRepeatCurrent = !isRepeatCurrent;
// // //   isShuffleAll = false;
// // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // //   repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
// // //   shuffleAllBtn.classList.remove("active");
// // //   audioPlayer.loop = isRepeatCurrent;
// // //   updateBufferedTracks();
// // // }

// // // function toggleShuffle() {
// // //   isShuffleAll = !isShuffleAll;
// // //   isRepeatCurrent = false;
// // //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// // //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// // //   shuffleAllBtn.classList.toggle("active", isShuffleAll);
// // //   repeatCurrentBtn.classList.remove("active");
// // //   audioPlayer.loop = false;
// // //   if (isShuffleAll) shuffleTracks();
// // //   updateBufferedTracks();
// // // }

// // // function shuffleTracks() {
// // //   for (let i = tracks.length - 1; i > 0; i--) {
// // //     const j = Math.floor(Math.random() * (i + 1));
// // //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// // //   }
// // //   updateTrackList();
// // // }

// // // function playTrack() {
// // //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// // //   const track = tracks[currentTrackIndex];
// // //   document.getElementById("currentTrack").textContent = track.name;
// // //   audioPlayer.src = URL.createObjectURL(track.file);
// // //   audioPlayer.play();
// // //   updateBufferedTracks();
// // //   updateTrackList();
// // // }

// // // function updateBufferedTracks() {
// // //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// // //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// // //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// // //   bufferedTracks.current = new Audio(
// // //     URL.createObjectURL(tracks[currentTrackIndex].file)
// // //   );

// // //   const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // //   if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
// // //     bufferedTracks.previous = new Audio(
// // //       URL.createObjectURL(tracks[prevIndex].file)
// // //     );
// // //   }

// // //   const nextIndex = (currentTrackIndex + 1) % tracks.length;
// // //   if (nextIndex < tracks.length && !isRepeatCurrent) {
// // //     bufferedTracks.next = new Audio(
// // //       URL.createObjectURL(tracks[nextIndex].file)
// // //     );
// // //   }
// // // }

// // // function handleTrackEnd() {
// // //   if (isRepeatCurrent) {
// // //     audioPlayer.play();
// // //   } else if (isShuffleAll) {
// // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // //     playTrack();
// // //   } else {
// // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // //     playTrack();
// // //   }
// // // }

// // // function playNext() {
// // //   if (isShuffleAll) {
// // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // //   } else {
// // //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// // //   }
// // //   playTrack();
// // // }

// // // function playPrevious() {
// // //   if (isShuffleAll) {
// // //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// // //   } else {
// // //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// // //   }
// // //   playTrack();
// // // }

// // // function updateProgress() {
// // //   if (audioPlayer.duration) {
// // //     const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// // //     document.getElementById("audioPlayer").setAttribute("value", progress);
// // //   }
// // // }

// // let tracks = [];
// // let currentTrackIndex = -1;
// // let isRepeatCurrent = false;
// // let isShuffleAll = false;
// // let audioPlayer = null;
// // let bufferedTracks = {
// //   previous: null,
// //   current: null,
// //   next: null,
// // };

// // document.addEventListener("DOMContentLoaded", () => {
// //   audioPlayer = document.getElementById("audioPlayer");
// //   const folderInput = document.getElementById("folderInput");
// //   const selectSourceBtn = document.getElementById("selectSourceBtn");
// //   const sortBtn = document.getElementById("sortBtn");
// //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// //   const skipBackBtn = document.getElementById("skipBackBtn");
// //   const skipForwardBtn = document.getElementById("skipForwardBtn");
// //   const trackListBody = document
// //     .getElementById("trackList")
// //     .querySelector("tbody");

// //   selectSourceBtn.addEventListener("click", () => folderInput.click());
// //   folderInput.addEventListener("change", handleFolderSelect);
// //   sortBtn.addEventListener("click", toggleSort);
// //   repeatCurrentBtn.addEventListener("click", toggleRepeat);
// //   shuffleAllBtn.addEventListener("click", toggleShuffle);
// //   skipBackBtn.addEventListener("click", playPrevious);
// //   skipForwardBtn.addEventListener("click", playNext);
// //   audioPlayer.addEventListener("timeupdate", updateProgress);
// //   audioPlayer.addEventListener("ended", handleTrackEnd);
// //   trackListBody.addEventListener("click", (e) => {
// //     const row = e.target.closest("tr");
// //     if (row) {
// //       currentTrackIndex = parseInt(row.dataset.index);
// //       playTrack();
// //     }
// //   });

// //   // Column resizing
// //   const headers = document.querySelectorAll("#trackList th.resize");
// //   headers.forEach((header) => {
// //     header.addEventListener("mousedown", (e) => {
// //       const rect = header.getBoundingClientRect();
// //       if (e.clientX >= rect.right - 10 && e.clientX <= rect.right + 10) {
// //         e.preventDefault();
// //         e.stopPropagation();
// //         let startX = e.clientX;
// //         let startWidth = header.offsetWidth;
// //         const onMouseMove = (moveEvent) => {
// //           moveEvent.preventDefault();
// //           let newWidth = startWidth + (moveEvent.clientX - startX);
// //           if (newWidth >= 50) {
// //             header.style.width = `${newWidth}px`;
// //             header.style.minWidth = `${newWidth}px`;
// //           }
// //         };
// //         const onMouseUp = () => {
// //           document.removeEventListener("mousemove", onMouseMove);
// //           document.removeEventListener("mouseup", onMouseUp);
// //         };
// //         document.addEventListener("mousemove", onMouseMove);
// //         document.addEventListener("mouseup", onMouseUp);
// //       }
// //     });
// //   });
// // });

// // async function handleFolderSelect(event) {
// //   tracks = [];
// //   const files = event.target.files;
// //   for (const file of files) {
// //     if (file.type.startsWith("audio/")) {
// //       tracks.push({
// //         file,
// //         name: file.name,
// //         path: file.webkitRelativePath,
// //         folder:
// //           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
// //       });
// //     }
// //   }
// //   updateTrackList();
// //   if (tracks.length > 0) {
// //     currentTrackIndex = 0;
// //     playTrack();
// //   }
// // }

// // function updateTrackList() {
// //   const trackListBody = document
// //     .getElementById("trackList")
// //     .querySelector("tbody");
// //   trackListBody.innerHTML = "";
// //   tracks.forEach((track, index) => {
// //     const tr = document.createElement("tr");
// //     tr.dataset.index = index;
// //     if (index === currentTrackIndex) tr.classList.add("active");
// //     tr.innerHTML = `
// //             <td>${index + 1}</td>
// //             <td>${track.name}</td>
// //             <td>${track.folder}</td>
// //         `;
// //     trackListBody.appendChild(tr);
// //   });
// // }

// // function toggleSort() {
// //   const sortBtn = document.getElementById("sortBtn");
// //   if (sortBtn.textContent.includes("Alphabetical")) {
// //     tracks.sort((a, b) => a.name.localeCompare(b.name));
// //     sortBtn.textContent = "Sort: By Folder";
// //   } else {
// //     tracks.sort(
// //       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
// //     );
// //     sortBtn.textContent = "Sort: Alphabetical";
// //   }
// //   updateTrackList();
// //   updateBufferedTracks();
// // }

// // function toggleRepeat() {
// //   isRepeatCurrent = !isRepeatCurrent;
// //   isShuffleAll = false;
// //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// //   repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
// //   shuffleAllBtn.classList.remove("active");
// //   audioPlayer.loop = isRepeatCurrent;
// //   updateBufferedTracks();
// // }

// // function toggleShuffle() {
// //   isShuffleAll = !isShuffleAll;
// //   isRepeatCurrent = false;
// //   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
// //   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
// //   shuffleAllBtn.classList.toggle("active", isShuffleAll);
// //   repeatCurrentBtn.classList.remove("active");
// //   audioPlayer.loop = false;
// //   if (isShuffleAll) shuffleTracks();
// //   updateBufferedTracks();
// // }

// // function shuffleTracks() {
// //   for (let i = tracks.length - 1; i > 0; i--) {
// //     const j = Math.floor(Math.random() * (i + 1));
// //     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
// //   }
// //   updateTrackList();
// // }

// // function playTrack() {
// //   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
// //   const track = tracks[currentTrackIndex];
// //   document.getElementById("currentTrack").textContent = track.name;
// //   audioPlayer.src = URL.createObjectURL(track.file);
// //   audioPlayer.play();
// //   updateBufferedTracks();
// //   updateTrackList();
// // }

// // function updateBufferedTracks() {
// //   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
// //   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
// //   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

// //   bufferedTracks.current = new Audio(
// //     URL.createObjectURL(tracks[currentTrackIndex].file)
// //   );

// //   const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// //   if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
// //     bufferedTracks.previous = new Audio(
// //       URL.createObjectURL(tracks[prevIndex].file)
// //     );
// //   }

// //   const nextIndex = (currentTrackIndex + 1) % tracks.length;
// //   if (nextIndex < tracks.length && !isRepeatCurrent) {
// //     bufferedTracks.next = new Audio(
// //       URL.createObjectURL(tracks[nextIndex].file)
// //     );
// //   }
// // }

// // function handleTrackEnd() {
// //   if (isRepeatCurrent) {
// //     audioPlayer.play();
// //   } else if (isShuffleAll) {
// //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// //     playTrack();
// //   } else {
// //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// //     playTrack();
// //   }
// // }

// // function playNext() {
// //   if (isShuffleAll) {
// //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// //   } else {
// //     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
// //   }
// //   playTrack();
// // }

// // function playPrevious() {
// //   if (isShuffleAll) {
// //     currentTrackIndex = Math.floor(Math.random() * tracks.length);
// //   } else {
// //     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
// //   }
// //   playTrack();
// // }

// // function updateProgress() {
// //   if (audioPlayer.duration) {
// //     const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
// //     document.getElementById("audioPlayer").setAttribute("value", progress);
// //   }
// // }

// let tracks = [];
// let currentTrackIndex = -1;
// let isRepeatCurrent = false;
// let isShuffleAll = false;
// let audioPlayer = null;
// let bufferedTracks = {
//   previous: null,
//   current: null,
//   next: null,
// };

// document.addEventListener("DOMContentLoaded", () => {
//   audioPlayer = document.getElementById("audioPlayer");
//   const folderInput = document.getElementById("folderInput");
//   const selectSourceBtn = document.getElementById("selectSourceBtn");
//   const sortBtn = document.getElementById("sortBtn");
//   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
//   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
//   const skipBackBtn = document.getElementById("skipBackBtn");
//   const skipForwardBtn = document.getElementById("skipForwardBtn");
//   const trackListBody = document
//     .getElementById("trackList")
//     .querySelector("tbody");

//   selectSourceBtn.addEventListener("click", () => folderInput.click());
//   folderInput.addEventListener("change", handleFolderSelect);
//   sortBtn.addEventListener("click", toggleSort);
//   repeatCurrentBtn.addEventListener("click", toggleRepeat);
//   shuffleAllBtn.addEventListener("click", toggleShuffle);
//   skipBackBtn.addEventListener("click", playPrevious);
//   skipForwardBtn.addEventListener("click", playNext);
//   audioPlayer.addEventListener("timeupdate", updateProgress);
//   audioPlayer.addEventListener("ended", handleTrackEnd);
//   trackListBody.addEventListener("click", (e) => {
//     const row = e.target.closest("tr");
//     if (row) {
//       currentTrackIndex = parseInt(row.dataset.index);
//       playTrack();
//     }
//   });

//   // Column resizing
//   const headers = document.querySelectorAll("#trackList th.resize");
//   headers.forEach((header) => {
//     header.addEventListener("mousedown", (e) => {
//       const rect = header.getBoundingClientRect();
//       if (e.clientX >= rect.right - 10 && e.clientX <= rect.right + 10) {
//         e.preventDefault();
//         e.stopPropagation();
//         let startX = e.clientX;
//         let startWidth = header.offsetWidth;
//         console.log(`Resizing ${header.dataset.column} column`); // Debug
//         const onMouseMove = (moveEvent) => {
//           moveEvent.preventDefault();
//           let newWidth = startWidth + (moveEvent.clientX - startX);
//           if (newWidth >= 50) {
//             header.style.width = `${newWidth}px`;
//             header.style.minWidth = `${newWidth}px`;
//             console.log(
//               `New width for ${header.dataset.column}: ${newWidth}px`
//             ); // Debug
//           }
//         };
//         const onMouseUp = () => {
//           document.removeEventListener("mousemove", onMouseMove);
//           document.removeEventListener("mouseup", onMouseUp);
//           console.log(`Finished resizing ${header.dataset.column}`); // Debug
//         };
//         document.addEventListener("mousemove", onMouseMove);
//         document.addEventListener("mouseup", onMouseUp);
//       }
//     });
//   });
// });

// async function handleFolderSelect(event) {
//   tracks = [];
//   const files = event.target.files;
//   console.log("Files loaded:", files.length); // Debug
//   for (const file of files) {
//     if (file.type.startsWith("audio/")) {
//       tracks.push({
//         file,
//         name: file.name,
//         path: file.webkitRelativePath,
//         folder:
//           file.webkitRelativePath.split("/").slice(0, -1).join("/") || "Root",
//       });
//     }
//   }
//   console.log("Tracks processed:", tracks.length); // Debug
//   updateTrackList();
//   if (tracks.length > 0) {
//     currentTrackIndex = 0;
//     playTrack();
//   }
// }

// function updateTrackList() {
//   const trackListBody = document
//     .getElementById("trackList")
//     .querySelector("tbody");
//   trackListBody.innerHTML = "";
//   tracks.forEach((track, index) => {
//     const tr = document.createElement("tr");
//     tr.dataset.index = index;
//     if (index === currentTrackIndex) tr.classList.add("active");
//     tr.innerHTML = `
//             <td>${index + 1}</td>
//             <td>${track.name}</td>
//             <td>${track.folder}</td>
//         `;
//     trackListBody.appendChild(tr);
//   });
//   console.log("Track list updated, rows:", trackListBody.children.length); // Debug
//   // Reapply column widths after update
//   //   const headers = document.querySelectorAll("#trackList th.resize");
//   //   headers.forEach((header) => {
//   //     const width = header.style.width || getComputedStyle(header).width;
//   //     header.style.width = width;
//   //     header.style.minWidth = width;
//   //   });
// }

// function toggleSort() {
//   const sortBtn = document.getElementById("sortBtn");
//   if (sortBtn.textContent.includes("Alphabetical")) {
//     tracks.sort((a, b) => a.name.localeCompare(b.name));
//     sortBtn.textContent = "Sort: By Folder";
//   } else {
//     tracks.sort(
//       (a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name)
//     );
//     sortBtn.textContent = "Sort: Alphabetical";
//   }
//   updateTrackList();
//   updateBufferedTracks();
// }

// function toggleRepeat() {
//   isRepeatCurrent = !isRepeatCurrent;
//   isShuffleAll = false;
//   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
//   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
//   repeatCurrentBtn.classList.toggle("active", isRepeatCurrent);
//   shuffleAllBtn.classList.remove("active");
//   audioPlayer.loop = isRepeatCurrent;
//   updateBufferedTracks();
// }

// function toggleShuffle() {
//   isShuffleAll = !isShuffleAll;
//   isRepeatCurrent = false;
//   const shuffleAllBtn = document.getElementById("shuffleAllBtn");
//   const repeatCurrentBtn = document.getElementById("repeatCurrentBtn");
//   shuffleAllBtn.classList.toggle("active", isShuffleAll);
//   repeatCurrentBtn.classList.remove("active");
//   audioPlayer.loop = false;
//   if (isShuffleAll) shuffleTracks();
//   updateBufferedTracks();
// }

// function shuffleTracks() {
//   for (let i = tracks.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
//   }
//   updateTrackList();
// }

// function playTrack() {
//   if (currentTrackIndex < 0 || currentTrackIndex >= tracks.length) return;
//   const track = tracks[currentTrackIndex];
//   document.getElementById("currentTrack").textContent = track.name;
//   audioPlayer.src = URL.createObjectURL(track.file);
//   audioPlayer.play();
//   updateBufferedTracks();
//   updateTrackList();
// }

// function updateBufferedTracks() {
//   if (bufferedTracks.current) URL.revokeObjectURL(bufferedTracks.current.src);
//   if (bufferedTracks.previous) URL.revokeObjectURL(bufferedTracks.previous.src);
//   if (bufferedTracks.next) URL.revokeObjectURL(bufferedTracks.next.src);

//   bufferedTracks.current = new Audio(
//     URL.createObjectURL(tracks[currentTrackIndex].file)
//   );

//   const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
//   if (prevIndex >= 0 && prevIndex < tracks.length && !isRepeatCurrent) {
//     bufferedTracks.previous = new Audio(
//       URL.createObjectURL(tracks[prevIndex].file)
//     );
//   }

//   const nextIndex = (currentTrackIndex + 1) % tracks.length;
//   if (nextIndex < tracks.length && !isRepeatCurrent) {
//     bufferedTracks.next = new Audio(
//       URL.createObjectURL(tracks[nextIndex].file)
//     );
//   }
// }

// function handleTrackEnd() {
//   if (isRepeatCurrent) {
//     audioPlayer.play();
//   } else if (isShuffleAll) {
//     currentTrackIndex = Math.floor(Math.random() * tracks.length);
//     playTrack();
//   } else {
//     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
//     playTrack();
//   }
// }

// function playNext() {
//   if (isShuffleAll) {
//     currentTrackIndex = Math.floor(Math.random() * tracks.length);
//   } else {
//     currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
//   }
//   playTrack();
// }

// function playPrevious() {
//   if (isShuffleAll) {
//     currentTrackIndex = Math.floor(Math.random() * tracks.length);
//   } else {
//     currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
//   }
//   playTrack();
// }

// function updateProgress() {
//   if (audioPlayer.duration) {
//     const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
//     document.getElementById("audioPlayer").setAttribute("value", progress);
//   }
// }

//console.log("1550");

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

console.log("1550");
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
    // Remove existing listeners to prevent duplicates
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
    console.log(`Resizing ${header.dataset.column} column`); // Debug
    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      let newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth >= 50) {
        header.style.width = `${newWidth}px`;
        header.style.minWidth = `${newWidth}px`;
        console.log(`New width for ${header.dataset.column}: ${newWidth}px`); // Debug
      }
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      console.log(`Finished resizing ${header.dataset.column}`); // Debug
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
}

async function handleFolderSelect(event) {
  tracks = [];
  const files = event.target.files;
  console.log("Files loaded:", files.length); // Debug
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
  console.log("Tracks processed:", tracks.length); // Debug
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
  console.log("Track list updated, rows:", trackListBody.children.length); // Debug
  // Reapply column widths and resizing after update
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
