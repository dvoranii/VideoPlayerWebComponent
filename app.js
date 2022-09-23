const template = document.createElement("template");
template.innerHTML = `
<style>

.video {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

.video-controls {
  right: 0;
  left: 0;
  bottom: 0;
  padding: 10px;
  position: absolute;
  transition: all 0.2s ease;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );

  height: 100px;
  width: 69%;
  margin: 0 auto;
}

.video-progress {
  position: relative;
  height: 8.4px;
  margin-bottom: 10px;
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

.bottom-controls {
  display: flex;
  justify-content: space-between;
}

.seek {
  position: absolute;
  top: 0;
  width: 100%;
  cursor: pointer;
  height: 8.4px;
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
  padding-bottom: 18px;
}

button {
  cursor: pointer;
  position: relative;
  margin-right: 7px;
  font-size: 12px;
  padding: 3px;
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

button:hover::before {
  display: inline-block;
}

.hide {
  display: none;
}

</style>

<div class="video-container">
<video controls class="video" id="video" preload="metadata" poster="/assets/poster.jpg">
    <source src="/assets/video.mp4" type="video/mp4"></source>
  </video>

  <div class="video-controls" id="video-controls">
    <div class="video-progress">
        <progress id="progress-bar" value="0" min="0" max="100" ></progress>
        <input class="seek" id="seek" value="0" min="0" type="range" step="1">
        <div class="seek-tooltip" id="seek-tooltip">00:00</div>
    </div>

    <div class="bottom-controls">
        <div class="left-controls">
            <button data-title="Play (k)" id="play-btn">
                <img src="/assets/play-btn.png" alt="" class="play">
                <img src="/assets/pause-btn.png" alt="" class="pause hide">
            </button>

          <div class="volume-controls">
            <button data-title="Mute (m)" class="volume-btn" id="volume-button">
                <img src="/assets/volume-up.png" alt="" class="volume-up">
                <img src="/assets/volume-low.png" alt="" class="volume-low hide">
                <img src="/assets/volume-mute.png" alt="" class="volume-mute hide">
            </button>

            <input class="volume" id="volume" value="1"
            data-mute="0.5" type="range" max="1" min="0" step="0.01">
          </div>

          <div class="time">
            <time id="time-elapsed">00:00</time>
            <span> / </span>
            <time id="duration">00:00</time>
          </div>
        </div>

        <div class="right-controls">
            <button data-title="PIP (p)" class="pip-btn" id="pip-btn">
                <img src="/assets/pip-icon.png" alt="">
            </button>
            <button class="fullscreen-btn" id="fullscreen-btn" data-title="Fullscreen (f)">
                <img src="/assets/fullscreen-icon.png" alt="" class="fullscreen">
                <img src="/assets/minimize-icon.png" alt="" class="fullscreen-exit hide">
            </button>
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

  togglePlay() {
    const video = this.shadowRoot.querySelector("video");
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

  toggleFullScreen() {
    const videoContainer = this.shadowRoot.querySelector(".video-container");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement) {
      // Need this to support Safari
      document.webkitExitFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      // Need this to support Safari
      videoContainer.webkitRequestFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
  }

  updateFullScreenBtn() {
    const fullScreenBtn = this.shadowRoot.querySelector(".fullscreen-btn");
    const fullScreenIcons = this.shadowRoot.querySelectorAll(
      ".fullscreen-btn img"
    );
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

  initializeVideo() {
    const video = this.shadowRoot.querySelector("video");
    const seek = this.shadowRoot.querySelector(".seek");
    const progressBar = this.shadowRoot.querySelector("#progress-bar");
    const duration = this.shadowRoot.getElementById("duration");
    const videoDuration = Math.round(video.duration);
    const time = this.formatTime(videoDuration);

    seek.setAttribute("max", videoDuration);
    progressBar.setAttribute("max", videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}`);
  }

  updateTimeElapsed() {
    const video = this.shadowRoot.querySelector("video");
    const timeElapsed = this.shadowRoot.getElementById("time-elapsed");
    const time = this.formatTime(Math.round(video.currentTime));

    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
  }

  // Connecting events to methods
  connectedCallback() {
    // play button play
    this.shadowRoot.querySelector("#play-btn").addEventListener("click", () => {
      this.togglePlay();
      this.updatePlayBtn();
    });

    // video play
    this.shadowRoot.querySelector("video").addEventListener("click", () => {
      this.togglePlay();
      this.updatePlayBtn();
    });

    // initialize video
    this.shadowRoot
      .querySelector("video")
      .addEventListener("loadedmetadata", () => {
        this.initializeVideo();
      });

    // update time
    this.shadowRoot
      .querySelector("video")
      .addEventListener("timeupdate", () => {
        this.updateTimeElapsed();
      });

    // // fullscreen
    this.shadowRoot
      .querySelector(".fullscreen-btn")
      .addEventListener("click", () => {
        this.toggleFullScreen();
        this.updateFullScreenBtn();
      });
  }
}

window.customElements.define("video-player", VideoPlayer);

// understand the connected callback funciton and
// how web components get implemented in the browser
