
    
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
    const pipButton = document.querySelector('#pipButton');
    const seekForwardButton = document.querySelector('#seekForwardButton');
    const seekBackwardButton = document.querySelector('#seekBackwardButton');

    const seekForwardText = document.querySelector('.seekText.forward');
    const seekBackwardText = document.querySelector('.seekText.backward');

    var controlsHideInt = null;

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

    fullscreenButton.addEventListener('click', function(event) {
      // event.stopPropagation();
      if (videoControls.classList.contains('visible') && video.src !== "") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          fullscreenButton.children[0].classList.remove("exit");
        } else {
          requestFullscreenVideo();
          lockScreenInLandscape();
          fullscreenButton.children[0].classList.add("exit");
        }
      }
    });

    function requestFullscreenVideo() {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
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
      playPauseButton.classList.add('playing');
      if (controlsHideInt === null) {
        controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
      }
      getScreenLock();
    });

    video.addEventListener('pause', function () {
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
    /*
    document.addEventListener('fullscreenchange', function() {
        if (videoControls.classList.contains('visible') && video.src !== "") {
            if (document.fullscreenElement) {
              document.exitFullscreen();
              fullscreenButton.children[0].classList.remove("exit");
            } else {
              requestFullscreenVideo();
              lockScreenInLandscape();
              fullscreenButton.children[0].classList.add("exit");
            }
        }
    });*/

    function showVideoControls() {
      videoControls.classList.add('visible');
      videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
      videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
    }

    function hideVideoControls() {
      videoControls.classList.remove('visible');
      seekForwardText.classList.remove('show');
      seekBackwardText.classList.remove('show');
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
        fullscreenButton.children[0].classList.remove("exit");
      }
    });

    const skipTime = 10;

    function seekForward() {
        if (videoControls.classList.contains('visible') && video.src !== "") {
            clearTimeout(controlsHideInt);
            controlsHideInt = null;
            seekBackwardText.classList.remove('show');
            seekForwardText.classList.add('show');
            video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
            // audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
            audio.currentTime = video.currentTime;
            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
            }
            setTimeout(function() {
              seekForwardText.classList.remove('show');
            }, 3000);
        }
    }

    function seekBackward() {
        if (videoControls.classList.contains('visible') && video.src !== "") {
            clearTimeout(controlsHideInt);
            controlsHideInt = null;
            seekForwardText.classList.remove('show');
            seekBackwardText.classList.add('show');
            video.currentTime = Math.max(video.currentTime - skipTime, 0);
            // audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
            audio.currentTime = video.currentTime;
            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
            }
            setTimeout(function() {
              seekBackwardText.classList.remove('show');
            }, 3000);
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
    
    video.addEventListener('loadedmetadata', function () {
        /*video.play();
        audio.currentTime = video.currentTime;
        audio.play();*/
        
        const videoCSS = window.getComputedStyle(video, null);

        videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
        videoProgressBar.style.transform = `scaleX(${
          video.currentTime / video.duration
        })`;

        console.log(videoCSS.getPropertyValue("height"))

        setTimeout(function() {
          console.log(videoCSS.getPropertyValue("height"));

          // videoContainer.
          // video.style.opacity = 1;
        }, 10);
    });

    video.addEventListener('loadeddata', function () {
      video.play();
      audio.currentTime = video.currentTime;
      audio.play();
    });

    video.addEventListener('timeupdate', function() {
        audio.currentTime = video.currentTime;
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
      
      console.log(loadPercentage);

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