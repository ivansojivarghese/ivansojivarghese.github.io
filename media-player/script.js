
    
    // REFERENCED FROM: https://github.com/googlesamples/web-fundamentals/blob/gh-pages/fundamentals/media/mobile-web-video-playback.js

    // https://googlesamples.github.io/web-fundamentals/fundamentals/media/mobile-web-video-playback.html 

    const video = document.querySelector('video');
    const audio = document.querySelector('audio');
    const videoContainer = document.querySelector("#videoContainer");
    const videoControls = document.querySelector("#videoControls");

    const videoDuration = document.querySelector('#videoDuration');
    const videoCurrentTime = document.querySelector('#videoCurrentTime');
    const videoProgressBar = document.querySelector('#videoProgressBar');
    const videoLoadProgressBar = document.querySelector('#videoLoadProgressBar');

    const playPauseButton = document.querySelector('#playPauseButton');
    const fullscreenButton = document.querySelector('#fullscreenButton');
    const fitscreenButton = document.querySelector('#fitscreenButton');
    const pipButton = document.querySelector('#pipButton');
    const seekForwardButton = document.querySelector('#seekForwardButton');
    const seekBackwardButton = document.querySelector('#seekBackwardButton');

    const seekForwardText = document.querySelector('.seekText.forward');
    const seekBackwardText = document.querySelector('.seekText.backward');
    const seekForwardTextSec = document.querySelector('.seekText.forward .seconds');
    const seekBackwardTextSec = document.querySelector('.seekText.backward .seconds');

    var controlsHideInt = null;
    var seekForwardHideInt = null;
    var seekBackwardHideInt = null;
    const skipTime = 10;
    var forwardSkippedTime = 0;
    var backwardSkippedTime = 0;

    playPauseButton.addEventListener('click', function (event) {
      event.stopPropagation();
      clearTimeout(controlsHideInt);
      controlsHideInt = null;
      if (videoControls.classList.contains('visible')) {
        if (video.paused && video.src !== "") {
          video.play();
          audio.play();
          audio.currentTime = video.currentTime;
        } else {
          video.pause();
          audio.pause();
        }
      }
    });

    fitscreenButton.addEventListener('click', function(event) {
      // event.stopPropagation();
      if (videoControls.classList.contains('visible') && video.src !== "") {
        if (!video.classList.contains("cover")) {
          video.style.objectFit = "cover";
          video.classList.add("cover");
        } else {
          video.style.objectFit = "";
          video.classList.remove("cover");
        }
      }
    });

    fullscreenButton.addEventListener('click', function(event) {
      // event.stopPropagation();
      if (videoControls.classList.contains('visible') && video.src !== "") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          fullscreenButton.children[0].classList.remove("exit");
        } else {
          requestFullscreenVideo();
          lockScreenInLandscape();
          // fullscreenButton.children[0].classList.add("exit");
        }
      }
    });

    function requestFullscreenVideo() {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen({ navigationUI: "hide" }).catch((err) => {
          fullscreenButton.children[0].classList.remove("exit");
          return;
        });
        fullscreenButton.children[0].classList.add("exit");
      } else {
        video.webkitEnterFullscreen();
      }
    }

    function lockScreenInLandscape() {
      if (!('orientation' in screen)) {
        return;
      }

      // Let's force landscape mode only if device is in portrait mode and can be held in one hand.
      if (matchMedia('(orientation: portrait) and (max-device-width: 768px)').matches) {
        screen.orientation.lock('landscape').then(function() {
          // When screen is locked in landscape while user holds device in
          // portrait, let's use the Device Orientation API to unlock screen only
          // when it is appropriate to create a perfect and seamless experience.
          listenToDeviceOrientationChanges();
        });
      }
    }

    function listenToDeviceOrientationChanges() {
      if (!('DeviceOrientationEvent' in window)) {
        return;
      }

      var previousDeviceOrientation, currentDeviceOrientation;
      window.addEventListener('deviceorientation', function onDeviceOrientationChange(event) {
        // event.beta represents a front to back motion of the device and
        // event.gamma a left to right motion.
        if (Math.abs(event.gamma) > 10 || Math.abs(event.beta) < 10) {
          previousDeviceOrientation = currentDeviceOrientation;
          currentDeviceOrientation = 'landscape';
          return;
        }
        if (Math.abs(event.gamma) < 10 || Math.abs(event.beta) > 10) {
          previousDeviceOrientation = currentDeviceOrientation;
          // When device is rotated back to portrait, let's unlock screen orientation.
          if (previousDeviceOrientation == 'landscape') {
            screen.orientation.unlock();
            window.removeEventListener('deviceorientation', onDeviceOrientationChange);
            if (!document.fullscreenElement) {
              fullscreenButton.children[0].classList.remove("exit");
            }
          }
        }
      });
    }

    pipButton.addEventListener('click', function (event) {
      // event.stopPropagation();
      if (videoControls.classList.contains('visible') && video.src !== "") {
        if (video.requestPictureInPicture) {
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            // pipButton.children[0].classList.remove("exit");
          } else if (document.pictureInPictureEnabled) {
            video.requestPictureInPicture();
            // pipButton.children[0].classList.add("exit");
          }
        }
      }
    });

    video.addEventListener('play', function () {
      audio.play();
      playPauseButton.classList.add('playing');
      if (controlsHideInt === null) {
        controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
      }
      getScreenLock();
    });

    video.addEventListener('pause', function () {
      audio.pause();
      playPauseButton.classList.remove('playing');
      showVideoControls();
      releaseScreenLock(screenLock);
    });

    video.addEventListener('ended', function() {
        playPauseButton.classList.remove('playing');
        video.currentTime = 0;
        audio.currentTime = 0;
        showVideoControls();
        releaseScreenLock(screenLock);
    });

    document.addEventListener('fullscreenchange', function() {
      if (!document.fullscreenElement) {
        fullscreenButton.children[0].classList.remove("exit");
        // show PIP
        pipButton.style.display = "";
      } else {
        // hide PIP
        pipButton.style.display = "none";
      }
    });

    document.onkeydown = function(evt) { // FULLSCREEN CONTROL via DESKTOP KEYBOARD
      evt = evt || window.event;
      if (video.src !== "" && !op.pwa.a) {
        if (((evt.code == 122 && op.sys === "Windows") || (evt.code == 70 && evt.metaKey && evt.ctrlKey)) && !document.fullscreenElement && (op.sys === "MacOS" || op.sys === "iOS")) { // F11 for Windows or Ctrl+Cmd+F for Mac
          requestFullscreenVideo();
          lockScreenInLandscape();
          fullscreenButton.children[0].classList.add("exit");
        } else if (((evt.code == 122 && op.sys === "Windows") || (evt.code == 70 && evt.metaKey && evt.ctrlKey)) && document.fullscreenElement && (op.sys === "MacOS" || op.sys === "iOS")) { // F11 for Windows or Ctrl+Cmd+F for Mac
          fullscreenButton.children[0].classList.remove("exit");
        }

        if (evt.code == 27 && document.fullscreenElement) { // esc.
          fullscreenButton.children[0].classList.remove("exit");
        }
      }
  };

  document.addEventListener("dblclick", (event) => { // double-click (by pointing device)
    if (video.src !== "" && !op.pwa.a) {
      if (!document.fullscreenElement) {
        requestFullscreenVideo();
        lockScreenInLandscape();
        fullscreenButton.children[0].classList.add("exit");
      } else {
        document.exitFullscreen();
        fullscreenButton.children[0].classList.remove("exit");
      }
    }
  });

    function showVideoControls() {
      videoControls.classList.add('visible');
      videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
      videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
    }

    function hideVideoControls() {
      if (video.src !== "") {
        videoControls.classList.remove('visible');
        seekForwardText.classList.remove('show');
        /*
        setTimeout(function() {
          forwardSkippedTime = 0;
          seekForwardTextSec.innerHTML = forwardSkippedTime;
        }, 300);*/
        seekBackwardText.classList.remove('show');
        /*
        setTimeout(function() {
          backwardSkippedTime = 0;
          seekBackwardTextSec.innerHTML = backwardSkippedTime;
        }, 300);*/
      }
    }

    videoControls.addEventListener('click', function(event) {
      clearTimeout(controlsHideInt);
      controlsHideInt = null;
      if (videoControls.classList.contains('visible')) {
        hideVideoControls();
      } else {
        showVideoControls();
        if (controlsHideInt === null) {
          controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
        }
      }
    });

    document.addEventListener('DOMContentLoaded', function() {
      showVideoControls();
      if (!video.requestPictureInPicture) {
        pipButton.style.display = "none";
      }
      if (op.pwa.a) { // if launched as TWA 
        fullscreenButton.style.display = "none";
      }
    });

    function secondsToTimeCode(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return [
        h,
        m > 9 ? m : '0' + m,
        s > 9 ? s : '0' + s,
      ].filter(Boolean).join(':');
    }

    screen.orientation.addEventListener("change", (event) => {
      const angle = event.target.angle;
      if ((angle === 90 || angle === 270) && !document.fullscreenElement) {
        requestFullscreenVideo();
        lockScreenInLandscape();
        fullscreenButton.children[0].classList.add("exit");
      } else if ((angle === 0 || angle === 180) && document.fullscreenElement) {
        document.exitFullscreen();
        video.style.objectFit = "";
        video.classList.remove("cover");
        fullscreenButton.children[0].classList.remove("exit");
      }
    });
/*
    screen.orientation.addEventListener("change", function(event) {
      const angle = event.target.angle;
      const videoCSS = window.getComputedStyle(video, null);
      var rawWidth = Number(videoCSS.getPropertyValue("width").slice(0, -2));
      var rawHeight = Number(videoCSS.getPropertyValue("height").slice(0, -2));
      if ((angle === 0 || angle === 180)) { // IN PORTRAIT MODE
        videoContainer.style.width = rawWidth + "px"; 
        videoContainer.style.height = (rawWidth / videoSizeRatio) + "px";
      } else if ((angle === 90 || angle === 270)) { // IN LANDSCAPE MODE
        videoContainer.style.height = rawHeight + "px";
        videoContainer.style.width = (rawHeight * videoSizeRatio) + "px"; 
      }
    });*/

    function seekForward() {
        if (videoControls.classList.contains('visible') && video.src !== "") {
            //forwardSkippedTime = 0;
            //seekForwardTextSec.innerHTML = forwardSkippedTime;
            forwardSkippedTime += skipTime;
            seekForwardTextSec.innerHTML = forwardSkippedTime;
            clearTimeout(controlsHideInt);
            clearTimeout(seekForwardHideInt);
            seekForwardHideInt = null;
            controlsHideInt = null;
            seekBackwardText.classList.remove('show');
            setTimeout(function() {
              backwardSkippedTime = 0;
              seekBackwardTextSec.innerHTML = backwardSkippedTime;
            }, 300);
            seekForwardText.classList.add('show');
            video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
            // audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
            audio.currentTime = video.currentTime;
            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
            }
            if (seekForwardHideInt === null) {
              seekForwardHideInt = setTimeout(function() {
                seekForwardText.classList.remove('show');
                forwardSkippedTime = 0;
                setTimeout(function() {
                  // forwardSkippedTime = 0;
                  seekForwardTextSec.innerHTML = forwardSkippedTime;
                }, 300);
              }, 300);
            }
        }
    }

    function seekBackward() {
        if (videoControls.classList.contains('visible') && video.src !== "") {
            //backwardSkippedTime = 0;
            //seekBackwardTextSec.innerHTML = backwardSkippedTime;
            backwardSkippedTime += skipTime;
            seekBackwardTextSec.innerHTML = backwardSkippedTime;
            clearTimeout(controlsHideInt);
            controlsHideInt = null;
            clearTimeout(seekBackwardHideInt);
            seekBackwardHideInt = null;
            seekForwardText.classList.remove('show');
            setTimeout(function() {
              forwardSkippedTime = 0;
              seekForwardTextSec.innerHTML = forwardSkippedTime;
            }, 300);
            seekBackwardText.classList.add('show');
            video.currentTime = Math.max(video.currentTime - skipTime, 0);
            // audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
            audio.currentTime = video.currentTime;
            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
            }
            if (seekBackwardHideInt === null) {
              seekBackwardHideInt = setTimeout(function() {
                seekBackwardText.classList.remove('show');
                backwardSkippedTime = 0;
                // seekBackwardTextSec.innerHTML = backwardSkippedTime;
                setTimeout(function() {
                  // backwardSkippedTime = 0;
                  seekBackwardTextSec.innerHTML = backwardSkippedTime;
                }, 300);
              }, 300);
            }
        }
    }

    seekForwardButton.addEventListener('click', function(event) {
      event.stopPropagation();
      seekForward();
    });

    seekBackwardButton.addEventListener('click', function(event) {
      event.stopPropagation();
      seekBackward();
    });

    video.addEventListener('seeking', function() {
        video.classList.add('seeking');
    });
    
    video.addEventListener('seeked', function() {
        setTimeout(function() {
            video.classList.remove('seeking');
        }, 200);
    });
    
    video.addEventListener('loadedmetadata', function () { //  fired when the metadata has been loaded
        /*video.play();
        audio.currentTime = video.currentTime;
        audio.play();*/

        const portrait = window.matchMedia("(orientation: portrait)").matches;
        const videoCSS = window.getComputedStyle(video, null);
        var rawWidth = Number(videoCSS.getPropertyValue("width").slice(0, -2));
        var rawHeight = Number(videoCSS.getPropertyValue("height").slice(0, -2));
/*
        if (portrait) { // IN PORTRAIT MODE
          videoContainer.style.width = rawWidth + "px"; 
          videoContainer.style.height = (rawWidth / videoSizeRatio) + "px";
        } else { // IN LANDSCAPE MODE
          videoContainer.style.height = rawHeight + "px";
          videoContainer.style.width = (rawHeight * videoSizeRatio) + "px"; 
        }*/

        videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
        videoProgressBar.style.transform = `scaleX(${
          video.currentTime / video.duration
        })`;

    });

    video.addEventListener('waiting', function () { // when playback has stopped because of a temporary lack of data
      
      audio.pause();
    });

    video.addEventListener('stalled', function () { // trying to fetch media data, but data is unexpectedly not forthcoming
      
      audio.pause();
    });

    video.addEventListener('playing', function () { // fired when playback resumes after having been paused or delayed due to lack of data
      
      audio.play();
    });

    video.addEventListener('loadstart', function () { // fired when the browser has started to load a resource
      
      // START LOAD

      videoProgressBar.style.transform = "scaleX(0.5)";
      videoProgressBar.style.left = "0";
      videoProgressBar.style.right = "auto";

    });

    video.addEventListener('loadeddata', function () { // fired when the frame at the current playback position of the media has finished loading; often the first frame

      // END LOAD

      videoProgressBar.style.transform = "";
      videoProgressBar.style.right = "";

      video.play();
      audio.currentTime = video.currentTime;
      audio.play();
    });

    video.addEventListener('timeupdate', function() {
        // audio.currentTime = video.currentTime;
        if (!videoControls.classList.contains('visible')) {
          return;
        }
        videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
        videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
    });

    // REF: https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded, by Yann L.

    video.addEventListener('progress', function() {
      var range = 0;
      var bf = this.buffered;
      var time = this.currentTime;
  
      while(!(bf.start(range) <= time && time <= bf.end(range))) {
          range += 1;
      }
      var loadStartPercentage = bf.start(range) / this.duration;
      var loadEndPercentage = bf.end(range) / this.duration;
      var loadPercentage = loadEndPercentage - loadStartPercentage;
      
      // console.log(loadPercentage);

      videoLoadProgressBar.style.transform = `scaleX(${loadPercentage})`;
  });

    // REFERENCED FROM: https://stackoverflow.com/questions/8825144/detect-double-tap-on-ipad-or-iphone-screen-using-javascript BY Anulal S.

    var tapedTwice = false;

    function tapHandler(event) {
      if (!event.target.classList.contains("no-tap")) {
        if(!tapedTwice) {
            tapedTwice = true;
            setTimeout( function() { tapedTwice = false; }, 300 );
            return false;
        }
        event.preventDefault();
        //action on double tap goes below
        if (!video.paused && !document.fullscreenElement) {
          video.requestPictureInPicture();
        }
      } else {
        return;
      }
    }

    videoContainer.addEventListener("touchstart", tapHandler);

    document.onvisibilitychange = function() {
      if (document.visibilityState === 'hidden') {
        video.style.objectFit = "";
        video.classList.remove("cover");
        if (!video.paused) {
            video.requestPictureInPicture();
        }
      } else {
        if (!video.paused) {
            document.exitPictureInPicture();
            hideVideoControls();
        }
      }
    };

    /*
    document.querySelector("main .content").addEventListener("click", function(event) {
      if (!event.target.classList.contains("videoArea")) {
        if (!video.paused && videoControls.classList.contains('visible') && video.src !== "") {
          hideVideoControls();
        }
      }
    }, true);*/