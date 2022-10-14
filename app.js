// might need to use mediaSession api for mobile
// add plabackrate functionality
// clean up design/ change icons
// make sure its cross-browser compatible
// figure out how to have the controls fit the video size

const template = document.createElement("template");
template.innerHTML = `
<style>

.video {
  width: 100%;
  height: auto;
  margin-bottom: -6px;
}

.video-controls {
  transition: all 0.2s ease;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );

  margin: 0 auto;

}

.video-controls.fullScreenActive {
  right: 0;
  left: 0;
  bottom: 0;
  padding: 10px;
  position: absolute;

}

.video-progress {
  position: relative;
}

progress {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 2px;
  width: 100%;
  height: 8.4px;
  pointer-events: none;
  position: absolute;
  top: 0;
  z-index: -1;
}

progress::-webkit-progress-bar {
  background-color: #474545;
  border-radius: 2px;
}

progress::-webkit-progress-bar {
  background-color: #474545;
  border-radius: 2px;
}

progress::-webkit-progress-value {
  background: var(--youtube-red);
  border-radius: 2px;
}

progress::-moz-progress-bar {
  border: 1px solid var(--youtube-red);
  background: var(--youtube-red);
}

.left-controls {
  display: flex;
}


.bottom-controls-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.seek {
  width: 99%;
  padding-left: 10px;
  cursor: pointer;
  height: 8.6px;
}

.seek:hover + .seek-tooltip {
  display: block;
}

.seek-tooltip {
  display: none;
  position: absolute;
  top: -30px;
  left: 15px;
  margin-left: -20px;
  font-size: 12px;
  padding: 3px;
  content: attr(data-title);
  font-weight: bold;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
}

#play-btn img,
.volume-btn img {
  max-width: 40px;
}

#play-btn,
.volume-btn {
  background-color: transparent;
  border: none;
  transition: all 250ms ease;
}

#play-btn:hover,
.volume-btn:hover {
  cursor: pointer;
  filter: brightness(0.8);
}

.volume {
}

.volume-controls, .time {
  display: flex;
  align-items: center;
}

.time {
  color:#f5f5f5;
  margin-left:10px;
}

button {
  cursor: pointer;
  position: relative;
  margin-right: 7px;

  border: none;
  outline: none;
  background-color: transparent;
}

button * {
  pointer-events: none;
}

button::before {
  content: attr(data-title);
  position: absolute;
  display: none;
  right: -25px;
  top: -50px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-weight: bold;
  padding: 4px 6px;
  word-break: keep-all;
  white-space: pre;
}

button#close-btn::before {
  display: none;
}

#close-btn {
  transition: all 150ms ease;
}
#close-btn:hover {
  color: white;
}

button:hover::before {
  display: inline-block;
}


.hide {
  visibility: hidden;
  opacity: 0;
  width: 0px;
}

.settings {
  position: relative;
}


.settings-list {
  background-color: #333333;
  position: absolute;
  top: -205%;
  min-width:fit-content;
  width: 220px;
  transition: all 150ms ease;
}

.playback-options {
  position: absolute;
  background-color: red;
  width:300px;
  top: -28px;
}

.settings-list.playback-active {
  
}

.settings-list-wrapper-outer{
  display: flex;
  width: 300px;
}

.settings-list-wrapper-inner {
  width: 300px;
}

.settings-list:not(.hide){
  animation: fadeInScaleUp 150ms ease-in;
  animation-fill-mode: forwards;
  transform-origin: bottom left;
}

.settings-list.hide {
  animation: fadeOutScaleDown 150ms ease-out;
  animation-fill-mode: forwards;
  transform-origin: bottom left;
}



@keyframes fadeInScaleUp {
  from {
    opacity: 0;
    visibility: hidden;
    transform: scale(0);
  }

  to {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
}

@keyframes fadeOutScaleDown {
  from {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }

  to {
    opacity: 0;
    visibility: hidden;
    transform: scale(0);
  }
}

.settings-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.settings-option img {
  width: 40px;
  height: 40px;
}

.option-setting {
  text-decoration: none;
  color: #ffffff;
  transition: all 250ms ease;
  position: relative;
  min-width: 90px;
}

.option-setting:hover {
  color: #bbbbbb;
}

.option-title {
  min-width: 130px;
  padding-left: 10px;
}

/************************** */
.settings-menu {
  position: absolute;
  display: flex;
  bottom: 58px;
  width: 220%;
  background: red;
  visibility: hidden;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  animation: slideDownFadeOut 250ms ease;
  animation-fill-mode: forwards;
  transition: all 250ms ease;
}

.settings-menu.active {
  pointer-events: all;
  animation: slideUpFadeIn 250ms ease;
  animation-fill-mode: forwards;
}

/* .settings-menu:not(.active) {

} */

.settings-menu .list-first {
  list-style: none;
}

.list-main,
.list-second,
.list-third,
.list-fourth {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  /* background-color: blue; */
  width: 100%;
  padding: 10px;
}

.list-main {
  background: yellow;
  height: 100px;
  animation: slideRight 250ms ease;
  list-style: none;
}
.list-main.optionClicked {
  animation: slideLeft 250ms ease;
  animation-fill-mode: forwards;
}
.list-second.optionClicked {
  animation: slideLeftMore 250ms ease;
  animation-fill-mode: forwards;
}
.list-third.optionClicked {
  animation: slideLeftMore 250ms ease;
  animation-fill-mode: forwards;
}
.list-fourth.optionClicked {
  animation: slideLeftMore 250ms ease;
  animation-fill-mode: forwards;
}
.list-second {
  background-color: blue;
  position: absolute;
  list-style: none;
  right: -100%;
  height: 100%;
  animation: slideRight 250ms ease;
}

.list-third {
  background-color: orange;
  position: absolute;
  list-style: none;
  right: -100%;
  height: 100%;
}
.list-fourth {
  background-color: cyan;
  position: absolute;
  list-style: none;
  right: -100%;
  height: 100%;
}

@keyframes slideUpFadeIn {
  from {
    visibility: hidden;
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    visibility: visible;
    opacity: 1;
    transform: translateY(0px);
  }
}

.menu-back {
  border: none;
  cursor: pointer;
}

.menu-back::before {
  content: "<";
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 8px;
}
@keyframes slideDownFadeOut {
  from {
    visibility: visible;
    opacity: 1;
    transform: translateY(0px);
  }
  to {
    visibility: hidden;
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes slideLeft {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(-100%);
  }
}

/* rename this */
@keyframes slideLeftMore {
  from {
    right: -100%;
  }

  to {
    right: 0%;
  }
}

@keyframes slideRight {
  from {
    transform: translate(-100%);
  }
  to {
    transform: translateX(0%);
  }
}

/* @keyframes slideRight {
} */



</style>

<div class="video-container">
<video controls class="video" id="video" preload="metadata" poster="./assets/poster.jpg">
    <source src="" type="video/mp4"></source>
  </video>

  <div class="video-controls" id="video-controls">
    <div class="video-progress">
        <progress id="progress-bar" value="0" min="0" max="100" ></progress>
        <input class="seek" id="seek" value="0" min="0" type="range" step="1">
        <div class="seek-tooltip" id="seek-tooltip">00:00</div>
    </div>

    <div class="bottom-controls">
    <div class="bottom-controls-wrapper">
        <div class="left-controls">
            <button data-title="Play (k)" id="play-btn">
                <img src="./assets/play-btn.png" alt="" class="play">
                <img src="./assets/pause-btn.png" alt="" class="pause hide">
            </button>

          <div class="volume-controls">
            <button data-title="Mute (m)" class="volume-btn" id="volume-button">
                <img src="./assets/volume-up.png" alt="" class="volume-up">
                <img src="./assets/volume-low.png" alt="" class="volume-low hide">
                <img src="./assets/volume-mute.png" alt="" class="volume-mute hide">
            </button>

            <input class="volume" id="volume" value="1"
            data-mute="0.5" type="range" max="1" min="0" step="0.01">
          </div>

          <div class="time">
            <time id="time-elapsed">00:00</time>
            <span> / </span>
            <time id="duration">00:00</time>
          </div>

          <div class="settings">
            <button data-title="Settings (s)" class="settings-btn">
              <img src="./assets/settings.png">
            </button>

            <!---------------------------------------------------- -->
        <div class="settings-menu">
          <ul class="list-main">
            <li><a href="#" data-option="0">Option 1</a></li>
            <li><a href="#" data-option="1">Option 2</a></li>
            <!-- <li><a href="#" data-option="2">Option 3</a></li> -->
          </ul>
          <ul class="list-second">
            <button class="menu-back"></button>
            <li><a href="#" data-option="0">Option 1</a></li>
            <li><a href="#" data-option="1">Option 2</a></li>
            <li><a href="#" data-option="2">Option 3</a></li>
            <li><a href="#" data-option="3">Option 4</a></li>
            <li><a href="#" data-option="4">Option 5</a></li>
            <li><a href="#" data-option="5">Option 6</a></li>
          </ul>

          <ul class="list-third">
            <button class="menu-back"></button>
            <li><a href="#" data-option="0">Option 1</a></li>
            <li><a href="#" data-option="1">Option 2</a></li>
            <li><a href="#" data-option="2">Option 3</a></li>
            <li><a href="#" data-option="3">Option 4</a></li>
            <li><a href="#" data-option="4">Option 5</a></li>
            <li><a href="#" data-option="5">Option 6</a></li>
          </ul>
          <ul class="list-fourth">
            <button class="menu-back"></button>
            <li><a href="#" data-option="0">Option 1</a></li>
            <li><a href="#" data-option="1">Option 2</a></li>
            <li><a href="#" data-option="2">Option 3</a></li>
            <li><a href="#" data-option="3">Option 4</a></li>
            <li><a href="#" data-option="4">Option 5</a></li>
            <li><a href="#" data-option="5">Option 6</a></li>
          </ul>
        </div>

      <!---------------------------------------------------- -->
            
      
          </div>
        </div>

        <div class="right-controls">
            <button data-title="PIP (p)" class="pip-btn" id="pip-btn">
                <img src="./assets/pip-icon.png" alt="">
            </button>
            <button class="fullscreen-btn" id="fullscreen-btn" data-title="Fullscreen (f)">
                <img src="./assets/fullscreen-icon.png" alt="" class="fullscreen">
                <img src="./assets/minimize-icon.png" alt="" class="fullscreen-exit hide">
            </button>
        </div>
        </div>
      </div>
  </div>
</div>
`;

class VideoPlayer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // video source
    this.shadowRoot.querySelector("source").src =
      this.getAttribute("data-video");

    // video poster
    this.shadowRoot.querySelector("video").poster =
      this.getAttribute("data-poster");

    const video = this.shadowRoot.querySelector("video");
    const videoControls = this.shadowRoot.querySelector("#video-controls");
    const videoWorks = !!document.createElement("video").canPlayType;

    if (videoWorks) {
      video.controls = false;
      videoControls.classList.remove("hidden");
    }
  }

  togglePlay(video) {
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  }

  updatePlayBtn() {
    const playbackBtns = this.shadowRoot.querySelectorAll("#play-btn img");
    playbackBtns.forEach((btn) => btn.classList.toggle("hide"));
  }

  toggleFullScreen(videoContainer, videoControls) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      videoControls.classList.remove("fullScreenActive");
    } else if (document.webkitFullscreenElement) {
      // Need this to support Safari
      document.webkitExitFullscreen();
      videoControls.classList.remove("fullScreenActive");
    } else if (videoContainer.webkitRequestFullscreen) {
      // Need this to support Safari
      videoContainer.webkitRequestFullscreen();
      videoControls.style.width = "100%";
      videoControls.classList.add("fullScreenActive");
    } else {
      videoContainer.requestFullscreen();
      videoControls.style.width = "100%";
      videoControls.classList.add("fullScreenActive");
    }
  }

  updateFullScreenBtn(fullScreenIcons, fullScreenBtn) {
    fullScreenIcons.forEach((icon) => icon.classList.toggle("hide"));
    if (document.fullscreenElement) {
      fullScreenBtn.setAttribute("data-title", "Exit full screen (f)");
    } else {
      fullScreenBtn.setAttribute("data-title", "Full screen (f)");
    }
  }

  // format time
  formatTime(seconds) {
    const result = new Date(seconds * 1000).toISOString().substr(11, 8);
    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2),
    };
  }

  initializeVideo(video, seek, progressBar, duration) {
    const videoDuration = Math.round(video.duration);
    const time = this.formatTime(videoDuration);

    seek.setAttribute("max", videoDuration);
    progressBar.setAttribute("max", videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}`);
  }

  updateTimeElapsed(video, timeElapsed) {
    const time = this.formatTime(Math.round(video.currentTime));

    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
  }

  updateProgress(video, seek, progressBar) {
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);
  }

  updateSeekTooltip(e, video, seek, seekTooltip) {
    const skipTo = Math.round(
      (e.offsetX / e.target.clientWidth) *
        parseInt(e.target.getAttribute("max"), 10)
    );
    seek.setAttribute("data-seek", skipTo);
    const t = this.formatTime(skipTo);
    seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
    const rect = video.getBoundingClientRect();
    seekTooltip.style.left = `${e.pageX - rect.left}px`;
  }

  skipAhead(e, video, progressBar, seek) {
    const skipTo = e.target.dataset.seek
      ? e.target.dataset.seek
      : e.target.value;
    video.currentTime = skipTo;
    progressBar.value = skipTo;
    seek.value = skipTo;
  }

  // doesn't work without passing the event object
  updateVolume(e, video, volume) {
    if (video.muted) {
      console.log("something");
      video.muted = false;
    }

    video.volume = volume.value;
  }

  showSettings(settingsMenu) {
    settingsMenu.classList.toggle("active");
  }

  showFirstOptions(option, listMain, listSecondaryOne, settingsMenu) {
    if (option.dataset.option == 0) {
      listMain.classList.add("optionClicked");
      listSecondaryOne.classList.add("optionClicked");
      if (listSecondaryOne.classList.contains("optionClicked")) {
        settingsMenu.style.height = "150px";
      }
    }
  }
  // // Connecting events to methods
  connectedCallback() {
    // play button play
    const video = this.shadowRoot.querySelector("video");
    const videoContainer = this.shadowRoot.querySelector(".video-container");
    const timeElapsed = this.shadowRoot.getElementById("time-elapsed");
    const fullScreenBtn = this.shadowRoot.querySelector(".fullscreen-btn");
    const fullScreenIcons = this.shadowRoot.querySelectorAll(
      ".fullscreen-btn img"
    );
    const videoControls = this.shadowRoot.querySelector(".video-controls");
    const volume = this.shadowRoot.getElementById("volume");

    const playBtn = this.shadowRoot.querySelector("#play-btn");
    const pip = this.shadowRoot.querySelector(".pip-btn");

    const seek = this.shadowRoot.querySelector(".seek");
    const seekTooltip = this.shadowRoot.querySelector(".seek-tooltip");

    const progressBar = this.shadowRoot.querySelector("#progress-bar");
    const duration = this.shadowRoot.getElementById("duration");

    const playbackSetting = this.shadowRoot.querySelector(
      ".option-setting.playback"
    );

    // settings
    const settingsList = this.shadowRoot.querySelector(".settings-list");
    const settingsMenu = this.shadowRoot.querySelector(".settings-menu");
    const optionsFirst = this.shadowRoot.querySelectorAll(".list-main a");
    const listMain = this.shadowRoot.querySelector(".list-main");
    const listSecondaryOne = this.shadowRoot.querySelector(".list-second");
    const listSecondaryTwo = this.shadowRoot.querySelector(".list-third");
    const listSecondaryThird = this.shadowRoot.querySelector(".list-fourth");
    const menuBack = this.shadowRoot.querySelectorAll(".menu-back");
    const settingsBtn = this.shadowRoot.querySelector(".settings-btn");

    // playbackSetting.addEventListener("click", () => {
    //   playbackOptions.classList.remove("hide");
    // });

    // closeBtn.addEventListener("click", () => {
    //   playbackOptions.classList.add("hide");
    // });

    pip.addEventListener("click", () => {
      video.playbackRate = 3;
    });

    playBtn.addEventListener("click", () => {
      this.togglePlay(video);
      this.updatePlayBtn();
    });

    // video play
    video.addEventListener("click", () => {
      this.togglePlay(video);
      this.updatePlayBtn();
    });

    // initialize video
    video.addEventListener("loadedmetadata", () => {
      this.initializeVideo(video, seek, progressBar, duration);
    });

    // update time
    video.addEventListener("timeupdate", () => {
      this.updateTimeElapsed(video, timeElapsed);
      this.updateProgress(video, seek, progressBar);
    });

    // // fullscreen
    fullScreenBtn.addEventListener("click", () => {
      this.toggleFullScreen(videoContainer, videoControls);
      this.updateFullScreenBtn(fullScreenIcons, fullScreenBtn);
    });

    // settings
    settingsBtn.addEventListener("click", () => {
      this.showSettings(settingsMenu);
    });

    seek.addEventListener("mousemove", (e) => {
      this.updateSeekTooltip(e, video, seek, seekTooltip);
    });

    seek.addEventListener("input", (e) => {
      seek.addEventListener(
        "input",
        this.skipAhead(e, video, progressBar, seek)
      );
    });

    volume.addEventListener("input", (e) => {
      this.updateVolume(e, video, volume);
    });

    optionsFirst.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        this.showFirstOptions(option, listMain, listSecondaryOne, settingsMenu);
      });
    });
  }
}

window.customElements.define("video-player", VideoPlayer);
