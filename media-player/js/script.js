
    
    // REFERENCED FROM: https://github.com/googlesamples/web-fundamentals/blob/gh-pages/fundamentals/media/mobile-web-video-playback.js

    // https://googlesamples.github.io/web-fundamentals/fundamentals/media/mobile-web-video-playback.html 

    const statusIndicator = document.querySelector("#statusIndicator div");

    const video = document.querySelector('video.primary');
    const audio = document.querySelector('audio.primary');
    
    const videoContainer = document.querySelector("#videoContainer");
    const videoControls = document.querySelector("#videoControls");

    const videoDuration = document.querySelector('#videoDuration');
    const videoCurrentTime = document.querySelector('#videoCurrentTime');
    const videoProgressBar = document.querySelector('#videoProgressBar');
    const videoLoadProgressBar = document.querySelector('#videoLoadProgressBar');

    const loadingRing = document.querySelector("#loadingRing");
    const playPauseButton = document.querySelector('#playPauseButton');
    const playPauseButtonImg = document.querySelector('#playPauseButton .img');    
    // const fullscreenButton = document.querySelector('#fullscreenButton');
    const settingsButton = document.querySelector('#settingsButton');
    const fitscreenButton = document.querySelector('#fitscreenButton');
    const pipButton = document.querySelector('#pipButton');
    const seekForwardButton = document.querySelector('#seekForwardButton');
    const seekBackwardButton = document.querySelector('#seekBackwardButton');
    const playPreviousButton = document.querySelector("#skipPreviousButton");

    const seekForwardText = document.querySelector('.seekText.forward');
    const seekBackwardText = document.querySelector('.seekText.backward');
    const seekForwardTextSec = document.querySelector('.seekText.forward .seconds');
    const seekBackwardTextSec = document.querySelector('.seekText.backward .seconds');

    var pms = { // permissions
          ntf : false
        },
        pmsCheck = false;

    var playbackBufferInt = null;
    var controlsHideInt = null;
    var seekForwardHideInt = null;
    var seekBackwardHideInt = null;
    var skipTime = 10;
    var maxTime = 999;
    var forwardSkippedTime = 0;
    var backwardSkippedTime = 0;

    var bufferInt = null;
    var bestVideoInt = null;
    var qualityBestInt = null;
    var offsetInt = null;

    var audioCtx;
    var playbackStats;

    var playPauseManual = false;

    // var videoPause = false;
    var videoPlay = true;

    var videoErr = false,
        audioErr = false;

    var appUnload = false;

    var autoLoad = false;

    var tps = 0; // function call times per sec.

    var loading = false;
    var videoLoad = false;
    var initialVideoLoad = false;
    var initialVideoLoadCount = 0;
    var initialAudioLoad = false;

    var seeking = false;
    var seekingLoad = false;

    var fastSeekInt = null;
    var fastSeekVal = [1000, 5000, 10000]; // min. tap-hold times for each speed state
    var fastSeekSpeeds = [300, 200, 50]; // fast seeking intervals

    var minVideoLoad = 3; // min. sec. for video to exit init load stage
    var maxVideoLoad = 3;

    var interactiveType = "";
    /*
    var backgroundPlay = false; // background audio playback
    var pipEnabled = false;
    var backgroundPlayInit = false;
    */
    // REFERENCE: https://stackoverflow.com/questions/21399872/how-to-detect-whether-html5-video-has-paused-for-buffering
    var checkInterval  = 50; // check every _ ms (do not use lower values)
    var lastPlayPos    = 0;
    var currentPlayPos = 0;
    var bufferingDetected = false;
    // checking offset should be at most the check interval
        // but allow for some margin
    var offset = (checkInterval - 20) / 1000;
        // var offset = 1000;

    var bufferCount = 0;
    var bufferingCount = [];
    var bufferingCountLoop = null;
    var bufferingTimes = [];
    var bufferMode = false;
    var bufferAllow = true;
    var bufferLoad = false;

    var bufferLimits = [100, 250, 1000]; // ms. limits for buffering [successive 3 times, single time]
    var bufferLimitC = 3;

    var bufferStartTime = 0;
    var bufferEndTime = 0;

    var audioVideoAlignInt = null;
    var audioVideoAligning = false;

    var videoEnd = false;
    var audioEnd = false;

    var qualityChange = false;
    var qualityBestChange = false;
    var preventQualityChange = false;
    var preventQualityChangeInt = null;

    setInterval(checkBuffering, checkInterval);
    function checkBuffering() {
        currentPlayPos = video.currentTime;
        currentAudioPos = audio.currentTime;

        // if no buffering is currently detected,
        // and the position does not seem to increase
        // and the player isn't manually paused...
        if (
                !bufferingDetected 
                && currentPlayPos < (lastPlayPos + offset)
                // && ((currentPlayPos < (lastPlayPos + offset)) || currentAudioPos < (lastPlayPos + offset))
                && !video.paused && framesStuck && !videoEnd
            ) {
            // console.log("buffering")
            bufferingDetected = true;
            bufferStartTime = new Date().getTime();

            // audio.currentTime = video.currentTime;

            statusIndicator.classList.remove("error");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("buffer");
              
            loadingRing.style.display = "block";
            playPauseButton.style.display = "none";
            showVideoControls();

            loading = true;

            bufferLoad = true;

            // audio.pause();
        } else if (
            bufferingDetected 
            && currentPlayPos > (lastPlayPos + offset)
            // && ((currentPlayPos > (lastPlayPos + offset)) || currentAudioPos > (lastPlayPos + offset))
            && !video.paused
            ) {

              // if we were buffering but the player has advanced,
        // then there is no buffering

            // console.log("not buffering anymore")
            bufferingDetected = false;
            bufferStartTime = 0;

            loading = false;

            // audio.currentTime = video.currentTime;

            // if (!loading) {
            /*
            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("error");
            statusIndicator.classList.add("smooth");


            endLoad();
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              hideVideoControls();
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);
              */
            // }

            // loading = false;
        }

        if (loading && bufferingDetected && framesStuck && !videoEnd) {
          statusIndicator.classList.remove("error");
          statusIndicator.classList.remove("smooth");
          statusIndicator.classList.add("buffer");
            
          loadingRing.style.display = "block";
          playPauseButton.style.display = "none";
          showVideoControls();
        }  

        if (!loading && !bufferingDetected && bufferLoad && !framesStuck && !seeking && !video.paused) {
            bufferLoad = false;
            
            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("error");
            statusIndicator.classList.add("smooth");

            endLoad();
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              if (!seekingLoad && !longTap && !seeking && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad))))) {
                hideVideoControls();
                console.log("hideVC");
              }
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);
        }

        lastPlayPos = currentPlayPos;
    }

    function updatePositionState() {
      if ('setPositionState' in navigator.mediaSession && video.duration !== NaN) {

        if (!backgroundPlay || pipEnabled) {
          refSeekTime = video.currentTime;

          navigator.mediaSession.setPositionState({
            duration: video.duration,
            playbackRate: video.playbackRate,
            position: video.currentTime,
          });
        } else {
          refSeekTime = audio.currentTime;

          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate,
            position: audio.currentTime,
          });
        }
      }
    }

    playPauseButton.addEventListener('click', function (event) {
      // event.stopPropagation();
      clearTimeout(controlsHideInt);
      controlsHideInt = null;
      if (videoControls.classList.contains('visible') && !audioVideoAligning && !qualityChange && !qualityBestChange && (!videoErr && !audioErr)) {

        if (video.paused && video.src !== "" && videoPlay && (!videoRun || backgroundPlay) && !audioRun) {

          playPauseManual = true;

          video.play().then(function () {
            // audioCtx = new AudioContext();
            // setTimeout(function() {
              if (videoEnd) {
                /*
                if (audioEnd) {
                  video.currentTime = 0;
                  audioEnd = false;
                }*/
                video.currentTime = 0;
                
                audio.currentTime = video.currentTime;
                videoEnd = false;
              }
              
              audio.play().then(function() {
                // videoPause = true;
                
              }).catch((err) => {
                /*
                console.log(err);
                
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.remove("smooth");
                statusIndicator.classList.add("error");

                endLoad();
                          
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";
                  playPauseButton.classList.remove('playing');

                  showVideoControls();

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);

                loading = false;*/

              });
            // }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);
          }).catch((err) => {

            console.log(err);
            /*
            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("error");

            endLoad();
                      
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              playPauseButton.classList.remove('playing');

              showVideoControls();

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);

            loading = false;*/
          });
          
          // audio.currentTime = video.currentTime;
          updatePositionState();

        } else {
          // if (videoPause) {
            audio.pause();
            video.pause();

            bufferStartTime = 0;
            bufferEndTime = 0;

            if (screenLock) {
              releaseScreenLock(screenLock); 
            }

            // videoPause = false;
          // }
        }
      } else if (videoErr || audioErr) {
        video.load();
      }
    });

    /*
    loadingRing.addEventListener('click', function (event) {
      event.stopPropagation();
      clearTimeout(controlsHideInt);
      controlsHideInt = null;
      if (videoControls.classList.contains('visible')) {
        if (!video.paused && video.src !== "") {
          video.pause();
          audio.pause();

          loadingRing.style.display = "none";
          playPauseButton.style.display = "block";
        }
      }
    });*/

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

    settingsButton.addEventListener("click", function(event) {
      if (videoControls.classList.contains('visible')) {
        openWrap('settings');
      }
    });
/*
    fullscreenButton.addEventListener('click', function(event) {
      // event.stopPropagation();
      if (videoControls.classList.contains('visible') && video.src !== "") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          fullscreenButton.children[0].classList.remove("exit");
          settingsButton.style.display = "block";
        } else {
          requestFullscreenVideo();
          lockScreenInLandscape();
          // fullscreenButton.children[0].classList.add("exit");
        }
      }
    });*/

    function requestFullscreenVideo() {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen({ navigationUI: "hide" }).catch((err) => {
          // fullscreenButton.children[0].classList.remove("exit");
          settingsButton.style.display = "block";
          return;
        });
        // fullscreenButton.children[0].classList.add("exit");
        settingsButton.style.display = "none";
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
              // fullscreenButton.children[0].classList.remove("exit");
              settingsButton.style.display = "block";
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
            document.exitPictureInPicture().then(function() {
              pipEnabled = false;
              if (document.visibilityState === "visible") {
                backgroundPlayManual = false;
              } else {
                backgroundPlayManual = true;
              }
              releaseScreenLock(screenLock);
            });
            // pipButton.children[0].classList.remove("exit");
          } else if (document.pictureInPictureEnabled) {
            video.requestPictureInPicture().then(function() {
              getScreenLock();
              pipEnabled = true;
              backgroundPlayManual = false;
            });
            // pipButton.children[0].classList.add("exit");
          }
        }
      }
    });

    var qualityBestResetInt = null;
    var qualityBestResetControl = false;

    function qualityBestReset() {
      if (qualityBestChange && !video.paused && !audio.paused) {

        qualityBestResetControl = false;
        if (qualityBestResetInt !== null) {
          clearTimeout(qualityBestResetInt);
          qualityBestResetInt = null;
        }

        qualityBestChange = false;
        clearTimeout(preventQualityChangeInt);
        preventQualityChangeInt = null;
        preventQualityChange = true;
        preventQualityChangeInt = setTimeout(function() {
          preventQualityChange = false;
        }, avgInt);

      } else if (qualityBestChange && video.paused && audio.paused && !qualityBestResetControl) {

        qualityBestResetControl = true;

        qualityBestResetInt = setTimeout(function() {
          qualityBestChange = false;
          clearTimeout(preventQualityChangeInt);
          preventQualityChangeInt = null;
          preventQualityChange = true;
          preventQualityChangeInt = setTimeout(function() {
            preventQualityChange = false;
          }, avgInt);
        }, avgInt);

      }
    }

    video.addEventListener('play', function () {

      if (videoPlay) {

        autoLoad = false;

        if (audioVideoAlignInt !== null) {
          clearInterval(audioVideoAlignInt);
          audioVideoAlignInt = null;
        }
        audioCtx = new AudioContext();
        audioVideoAlignInt = setInterval(audioVideoAlign, 100); 
        /*    
        setInterval(function() {
          console.log("video: " + video.currentTime + ", audio: " + audio.currentTime + ", difference: " + (video.currentTime - audio.currentTime));
        }, 1000);
        */

        if (!qualityBestChange && !qualityChange) {
          bufferAllow = true;
        } 
        /*
        setTimeout(function() {
          qualityBestChange = false;
        }, 3000);*/

        // videoEnd = false;
        

        if (bufferInt === null) {
          bufferInt = setInterval(liveBuffer, 1000/tps);
        }
        /////////////////////////
        if (bestVideoInt === null) {
          // bestVideoInt = setInterval(getBestVideo, (avgInt * 3));
        }
        /////////////////////////
        if (qualityBestInt === null) {
          qualityBestInt = setInterval(qualityBestReset, 1000/tps);
        }

        if (!playPauseManual) {
          if (audio.src) {
            // console.log(seeking + ", " + seekingLoad + ", " + longTap);
            if (!seeking && !seekingLoad && !longTap) {
              audio.play().then(function() {
                if (videoEnd) {
                  // audio.currentTime = 0;
                }
                
                if (!backgroundPlay && !pipEnabled && audio.src) {
                  video.currentTime = audio.currentTime;
                }
                
                // videoPause = true;

              }).catch((err) => {

                console.log(err);
                /*
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.remove("smooth");
                statusIndicator.classList.add("error");

                endLoad();
                          
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";
                  playPauseButton.classList.remove('playing');

                  showVideoControls();

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);*/

                loading = false;
              });
            }
          }

          playPauseButton.classList.remove('repeat');
          playPauseButton.classList.add('playing');

          if (firstPlay) {
            if (!seekingLoad && !longTap && !seeking) {
              hideVideoControls();
              console.log("hideVC");
            }
            firstPlay = false;
          } else {
            clearTimeout(controlsHideInt);
            controlsHideInt = null;
            if (controlsHideInt === null) {
              controlsHideInt = setTimeout(function() {
                if (!seekingLoad && !longTap && !seeking && !video.paused) {
                  hideVideoControls();
                  console.log("hideVC");
                }
              }, 3000); // hide controls after 3 sec. if no activity
            }
          }
          navigator.mediaSession.playbackState = 'playing';
          getScreenLock();
        } else {
          if (!backgroundPlay && !pipEnabled && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && audio.src) {
            video.currentTime = audio.currentTime;
          }

          playPauseButton.classList.remove('repeat');
          playPauseButton.classList.add('playing');

          playPauseManual = false;
          navigator.mediaSession.playbackState = 'playing';
          getScreenLock();
        }
      }
    });

    video.addEventListener('pause', function () {

      if (!qualityBestChange && !qualityChange) {

        bufferStartTime = 0;
        bufferEndTime = 0;

        liveBufferVal = [];
        liveBufferIndex = 0;
        bufferModeExe = false;

        clearInterval(bestVideoInt);
        bestVideoInt = null;

        // audio.pause();
        // videoPause = false;

        if (document.visibilityState === "visible" && appUnload !== null) {
          audio.pause();
          // videoPause = false;

          console.log("audio_pause");

        } else {
          backgroundPlay = true;
          backgroundPlayInit = true;
        }
        if (!audioVideoAligning && !bufferLoad) {
          playPauseButton.classList.remove('playing');
          showVideoControls();
        } else if (bufferLoad && !videoEnd) {
          loadingRing.style.display = "block";
          playPauseButton.style.display = "none";
          showVideoControls();
        }
        navigator.mediaSession.playbackState = 'paused';
        releaseScreenLock(screenLock);
    
      }

    });
    
    audio.addEventListener('pause', function () {

      refSeekTime = audio.currentTime;

      releaseScreenLock(screenLock);
      navigator.mediaSession.playbackState = 'paused';
    });

    audio.addEventListener('play', function () {
      // if (!networkError) {

          autoLoad = false;

          networkErrorFetch = false;
          networkErrorResume = false;

          audio.volume = 1;
          navigator.mediaSession.playbackState = 'playing';
          getScreenLock();

          clearInterval(checkAudioReady);
          checkAudioReady = null;
      // }
    });

      audio.addEventListener('ended', function() {
        if (!videoEnd && backgroundPlay) {
          // playPauseButton.classList.remove('playing');
          // playPauseButton.classList.add('repeat');

          /*
          if (backgroundPlay) {
            audioEnd = true;
          }*/

          localStorage.removeItem('mediaURL');
          localStorage.removeItem('videoURL');
          localStorage.removeItem('audioURL');
          localStorage.removeItem('timestamp');

          refSeekTime = 0;

          if (!networkError) {
            clearInterval(networkSpeedInt);
            networkSpeedInt = null;
          }
          clearInterval(networkParamInt);
          networkParamInt = null;
          clearInterval(bufferInt);
          bufferInt = null;
          clearInterval(bestVideoInt);
          bestVideoInt = null;
          clearInterval(qualityBestInt);
          qualityBestInt = null;

          clearInterval(resumeInterval);
          resumeInterval = null;

          videoEnd = true;
          firstPlay = true;
          video.pause();
          audio.pause();
          showVideoControls();
          releaseScreenLock(screenLock);
        }
      });

    video.addEventListener('ended', function() {

      playPauseButton.classList.remove('playing');
      playPauseButton.classList.add('repeat');

      localStorage.removeItem('mediaURL');
      localStorage.removeItem('videoURL');
      localStorage.removeItem('audioURL');
      localStorage.removeItem('timestamp');

      if (!networkError) {
        clearInterval(networkSpeedInt);
        networkSpeedInt = null;
      }
      clearInterval(networkParamInt);
      networkParamInt = null;
      clearInterval(bufferInt);
      bufferInt = null;
      clearInterval(bestVideoInt);
      bestVideoInt = null;
      clearInterval(qualityBestInt);
      qualityBestInt = null;

      clearInterval(resumeInterval);
      resumeInterval = null;

      videoEnd = true;
      firstPlay = true;
      video.pause();
      audio.pause();
      showVideoControls();
      releaseScreenLock(screenLock);
  });

    videoControls.addEventListener("mousemove", function(event) {
      if (video.src !== "" && interactiveType === "mouse") {
        clearTimeout(controlsHideInt);
        controlsHideInt = null;
        showVideoControls();
        if (controlsHideInt === null) {
          controlsHideInt = setTimeout(function() { 
            if (!loading && !video.paused && !videoLoad && !seeking && !seekingLoad) {
              hideVideoControls();
              console.log("hideVC");
            } else if (!loading) {
              clearTimeout(controlsHideInt);
              controlsHideInt = null;
              controlsHideInt = setInterval(function() {
                if (!loading && !videoLoad && !seeking && !seekingLoad && !video.paused) {
                  hideVideoControls();
                  console.log("hideVC");
                  clearInterval(controlsHideInt);
                  controlsHideInt = null;
                }
              }, 100);
            }
          }, 3000); // hide controls after 3 sec. if no activity
        }
      }
    });

    videoControls.addEventListener("mouseleave", function(event) {
      if (!video.paused && video.src !== "" && interactiveType === "mouse" && !seekingLoad && !longTap && !seeking) {
        clearTimeout(controlsHideInt);
        controlsHideInt = null;
        hideVideoControls();
        console.log("hideVC");
      }
    });

    document.addEventListener('fullscreenchange', function() {
      if (!document.fullscreenElement) {
        // fullscreenButton.children[0].classList.remove("exit");
        settingsButton.style.display = "block";
        // show PIP
        if (!((window.innerWidth < 500 && (screen.orientation.angle === 0 || screen.orientation.angle === 180)) || (window.innerHeight < 500 && (screen.orientation.angle === 90 || screen.orientation.angle === 270)))) {
          pipButton.style.display = "block";
        }
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
          // fullscreenButton.children[0].classList.add("exit");
          settingsButton.style.display = "none";
        } else if (((evt.code == 122 && op.sys === "Windows") || (evt.code == 70 && evt.metaKey && evt.ctrlKey)) && document.fullscreenElement && (op.sys === "MacOS" || op.sys === "iOS")) { // F11 for Windows or Ctrl+Cmd+F for Mac
          // fullscreenButton.children[0].classList.remove("exit");
          settingsButton.style.display = "block";
        }

        if (evt.code == 27 && document.fullscreenElement) { // esc.
          // fullscreenButton.children[0].classList.remove("exit");
          settingsButton.style.display = "block";
        }
      }
  };

  document.addEventListener("pointerup", (event) => {
    if (event.pointerType === "touch") {
      interactiveType = "touch";
    } else if (event.pointerType === "mouse") {
      interactiveType = "mouse";
    } else if (event.pointerType === "pen") {
      interactiveType = "pen";
    }
  }); 

  document.addEventListener("dblclick", (event) => { // double-click (by pointing device)
    if (video.src !== "" && !op.pwa.a && interactiveType === "mouse" && event.target === videoControls) {
      if (!document.fullscreenElement) {
        requestFullscreenVideo();
        lockScreenInLandscape();
        // fullscreenButton.children[0].classList.add("exit");
        settingsButton.style.display = "none";
      } else {
        document.exitFullscreen();
        // fullscreenButton.children[0].classList.remove("exit");
        settingsButton.style.display = "block";
      }
    }
  });

    function showVideoControls() {
      videoControls.classList.add('visible');
      setTimeout(function() {
        videoControls.classList.add('visible_ready');
      }, 200);
      if (!qualityChange && !qualityBestChange) {
        videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
        videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
    }

    function hideVideoControls() {

      if (!loading && !bufferLoad && !seekingLoad && !bufferingDetected) {
        statusIndicator.classList.remove("buffer");
        statusIndicator.classList.remove("error");
        statusIndicator.classList.add("smooth");

        endLoad();
        setTimeout(function() {
          if (!bufferLoad) {
            console.log("hideLR");
            loadingRing.style.display = "none";
            playPauseButton.style.display = "block";
            // reset the loader
            setTimeout(function() {
              resetLoad();
            }, 10);
          }
        }, 1000);
      }

      if (video.src !== "") {
        videoControls.classList.remove('visible');
        videoControls.classList.remove('visible_ready');
        seekForwardText.classList.remove('show');
        seekBackwardText.classList.remove('show');
      }
    }

    videoControls.addEventListener('click', function(event) {
      if (interactiveType === "touch" || interactiveType === "pen") {
        clearTimeout(controlsHideInt);
        controlsHideInt = null;
        if (videoControls.classList.contains('visible') && !seeking && !seekingLoad && !video.paused && !loading) {
          if (event.target === playPauseButton || event.target === playPauseButtonImg) { // IF PLAY/PAUSE button clicked
            setTimeout(function() {
              if (!seekingLoad && !longTap && !seeking) {
                hideVideoControls();
                console.log("hideVC");
              }
            }, 1000);
          } else {
            if (!seekingLoad && !longTap && !seeking) {
              hideVideoControls();
              console.log("hideVC");
            }
          }
        } else {
          showVideoControls();
          if (controlsHideInt === null) {
            controlsHideInt = setTimeout(function() {
              if (!loading && !video.paused && !seekingLoad && !longTap && !seeking) {
                hideVideoControls();
                console.log("hideVC");
              } else if (loading) {
                clearTimeout(controlsHideInt);
                controlsHideInt = null;
                controlsHideInt = setInterval(function() {
                  if (!loading && !seekingLoad && !longTap && !seeking && !video.paused) {
                    hideVideoControls();
                    console.log("hideVC");
                    clearInterval(controlsHideInt);
                    controlsHideInt = null;
                  }
                }, 100);
              }
            }, 3000); // hide controls after 3 sec. if no activity
          }
        }
      } else if (event.target === videoControls) {
        if (video.paused && video.src !== "" && videoPlay && (!videoRun || backgroundPlay) && !audioRun) {

          video.play().then(function () {
            // audioCtx = new AudioContext();
            // setTimeout(function() {
            /*
              audio.play().then(function() {
                // videoPause = true;
              }).catch((err) => {

                console.log(err);
                
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.remove("smooth");
                statusIndicator.classList.add("error");

                endLoad();
                          
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";
                  playPauseButton.classList.remove('playing');

                  showVideoControls();

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);

                loading = false;

              });*/
            // }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);
          }).catch((err) => {

            console.log(err);
            /*
            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("error");

            endLoad();
                      
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              playPauseButton.classList.remove('playing');

              showVideoControls();

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);

            loading = false;*/
          });
          
          // audio.currentTime = video.currentTime;
          updatePositionState();

        } else if (!video.paused && video.src !== "") {

          // if (videoPause) {
            audio.pause();
            video.pause();

            bufferStartTime = 0;
            bufferEndTime = 0;

            // videoPause = false;
          // }
          
        }
      }
    });

    window.addEventListener('click', function() {
      if (!pmsCheck) {
        pmsCheck = true;

        // Notifications
        if ("Notification" in window || 'serviceWorker' in navigator) {
          switch (Notification.permission) {
            case 'granted':
                console.log('Notifications are allowed.');
                pms.ntf = true;
                break;
            case 'denied':
                console.log('Notifications are denied.');
                pms.ntf = false;
                break;
            case 'default':
                console.log('Notifications permission has not been asked yet.');
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      console.log("permission: granted");
                      pms.ntf = true;
                    } else {
                      console.log("permission: denied");
                      pms.ntf = false;
                    }
                  });
                break;
            default:
                console.log('Unknown notification permission status.');
                pms.ntf = false;
          }
        }
      }
    });

    window.addEventListener('load', function() {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'app_opened' });
      }

      /*
      if (localStorage.getItem('videoURL') !== null && localStorage.getItem('audioURL') !== null && localStorage.getItem('timestamp') !== null) {

      }*/
    });

    window.addEventListener('DOMContentLoaded', function() {
      showVideoControls();
      // playPauseButton.classList.remove('repeat');
      // playPauseButton.classList.add('playing');
      // remove pipButton, fitScreen buttons from display on mobile devices with width less than 500px (portrait), OR height less than 500px (landscape)
      if (!video.requestPictureInPicture) {
        pipButton.style.display = "none";
      }
      if ((window.innerWidth < 500 && (screen.orientation.angle === 0 || screen.orientation.angle === 180)) || (window.innerHeight < 500 && (screen.orientation.angle === 90 || screen.orientation.angle === 270))) {
        pipButton.style.display = "none";
        fitscreenButton.style.display = "none";
      }
      if (op.pwa.a) { // if launched as TWA 
        // fullscreenButton.style.display = "none";
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
        // fullscreenButton.children[0].classList.add("exit");
        settingsButton.style.display = "none";
      } else if ((angle === 0 || angle === 180) && document.fullscreenElement) {
        document.exitFullscreen();
        video.style.objectFit = "";
        video.classList.remove("cover");
        // fullscreenButton.children[0].classList.remove("exit");
        settingsButton.style.display = "block";
      }
      video.style.objectFit = "";
      video.classList.remove("cover");
    });


    // REFERENCE: https://github.com/chcunningham/wc-talk/blob/main/audio_renderer.js#L120
    // https://github.com/chcunningham/wc-talk 

    function getTotalOutputLatencyInSeconds(useAudioContextOutputLatency) {
      let totalOutputLatency = 0.0;
      // audioCtx = new AudioContext();
      if (!useAudioContextOutputLatency || audioCtx.outputLatency == undefined) {
        // Put appropriate values for Chromium here, not sure what latencies are
        // used. Likely OS-dependent, certainly hardware dependant. Assume 40ms.
        totalOutputLatency += 0.04;
      } else {
        totalOutputLatency += audioCtx.outputLatency;
      }
      // This looks supported by Chromium, always 128 / samplerate.
      totalOutputLatency += audioCtx.baseLatency;
      return totalOutputLatency;
    }

    var audioStall = false;
    var audioDiffMax = 3;

    function checkLatency(mArr, t) {
      if (mArr.length < t) {
        return false;
      } else {
        var inital = 0;
        for (j = 1; j <= t; j++) {
          if (inital === 0) {
            inital = mArr[mArr.length - j];
          } else if (mArr[mArr.length - j] !== inital) {
            return false;
          }
        }
        return true;
      }
    }

    var aVcount = 0;
    var aVcount2 = 0;
    var aVcount3 = 0;

    var offlineNotif = false;
    var slowNotif = false;

    function audioVideoAlign() {
      var aT = audio.currentTime;
      var vT = video.currentTime;
      var diff = vT - aT;

      if (aVcount === 10) { // 1 sec.
        console.log("video: " + video.currentTime + ", audio: " + audio.currentTime + ", difference: " + (video.currentTime - audio.currentTime));
        aVcount = 0;
      } else {
        aVcount++;
      }

      if (aVcount2 === 100) { // 10 sec.
        audioCtx = new AudioContext();
        aVcount2 = 0;
      } else {
        aVcount2++;
      }

      if (aVcount3 === 50) { // 5 sec.

        // re-fetch (if needed)
        if (networkErrorFetch) {
          if (backgroundPlay) {
            console.log("audio_network_load");
            audio.load();
            audio.currentTime = refSeekTime;
          } else {
            console.log("video_network_load");
            video.load();
            video.currentTime = refSeekTime;
            console.log("refseektime");
          }
        }

        // offline
        if (networkError && !offlineNotif) {
          var ntfTitle = "You're offline",
              ntfBody = "Check your connection.",
              ntfBadge = "https://ivansojivarghese.github.io/media-player/play_maskable_monochrome_409.png",
              ntfIcon = "https://ivansojivarghese.github.io/media-player/png/error.png";

          offlineNotif = true;

          if (pms.ntf) {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(ntfTitle, {
                  body: ntfBody,
                  badge: ntfBadge,
                  icon: ntfIcon,
                  tag: "offline",
                  requireInteraction: false, // Dismiss after default timeout
                  data : {
                    url :  "https://ivansojivarghese.github.io/media-player/"
                  }
                });
              });
            } else {
              const notification = new Notification(ntfTitle, {
                body: ntfBody,
                badge: ntfBadge,
                icon: ntfIcon,
                tag: "offline",
                requireInteraction: false, // Dismiss after default timeout
                data : {
                  url :  "https://ivansojivarghese.github.io/media-player/"
                }
              });
    
              notification.onclick = (event) => {
                event.preventDefault(); // Prevent the default action (usually focusing the notification)
                
                // Focus on the tab or open a new one
                if (document.hasFocus()) {
                    console.log("App is already in focus.");
                } else if (window.opener) {
                    window.opener.focus();
                } else {
                    window.focus();
                }
              };
            }
    
          }
        } else if (offlineNotif && !networkError) {
          offlineNotif = false;
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ action: 'closeOfflineNotification', tag: "offline" });
          }
        }

        // slow/poor network
        if ((networkQuality === "Bad" || networkQuality === "Very Bad") && !slowNotif) {
          var ntfTitle = "Slow network detected",
              ntfBody = "Check your connection.",
              ntfBadge = "https://ivansojivarghese.github.io/media-player/play_maskable_monochrome_409.png",
              ntfIcon = "https://ivansojivarghese.github.io/media-player/png/warning.png";

          slowNotif = true;

          if (pms.ntf) {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(ntfTitle, {
                  body: ntfBody,
                  badge: ntfBadge,
                  icon: ntfIcon,
                  tag: "slow",
                  requireInteraction: false, // Dismiss after default timeout
                  data : {
                    url :  "https://ivansojivarghese.github.io/media-player/"
                  }
                });
              });
            } else {
              const notification = new Notification(ntfTitle, {
                body: ntfBody,
                badge: ntfBadge,
                icon: ntfIcon,
                tag: "slow",
                requireInteraction: false, // Dismiss after default timeout
                data : {
                  url :  "https://ivansojivarghese.github.io/media-player/"
                }
              });
    
              notification.onclick = (event) => {
                event.preventDefault(); // Prevent the default action (usually focusing the notification)
                
                // Focus on the tab or open a new one
                if (document.hasFocus()) {
                    console.log("App is already in focus.");
                } else if (window.opener) {
                    window.opener.focus();
                } else {
                    window.focus();
                }
              };
            }
    
          }
        } else if (slowNotif && !(networkQuality === "Bad" || networkQuality === "Very Bad")) {
          slowNotif = false;
          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ action: 'closeSlowNotification', tag: "slow" });
          }
        }

        aVcount3 = 0;
      } else {
        aVcount3++;
      }

      audioLatencyArr[audioLatencyArr.length] = diff;
      audioTimes[audioTimes.length] = aT;
      videoTimes[videoTimes.length] = vT;

      if (!video.paused && !networkError && !seekingLoad && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && (!loading || qualityBestChange || qualityChange) && !bufferingDetected && !framesStuck && (audioCtx && audioCtx.playoutStats.maximumLatency && audioCtx.baseLatency && audioCtx.outputLatency)) {
        
        if ((checkLatency(audioTimes, audioDiffMax) && !checkLatency(videoTimes, audioDiffMax)) || (Math.abs(video.currentTime - audio.currentTime) > ((audioCtx.playoutStats.maximumLatency / 100) + (audioCtx.baseLatency * 10) + (audioCtx.outputLatency * 10)))) { // only buffer when audio has stalled
          // bufferCount++;
          bufferStartTime = new Date().getTime();
          bufferMode = true;

          console.log("audioVideoAlign: paused");

          if ((qualityBestChange || qualityChange) && audio.paused && !seekingLoad && !longTap && !seeking) {
            audio.play();
            hideVideoControls();
            console.log("hideVC");
          }

          loading = true;

          audioVideoAligning = true;

          video.pause();
          audio.pause();
          bufferingDetected = true;
          framesStuck = true;

          // videoPause = false;

          audioStall = true;

        } 

      } else if (audioStall && audio.buffered) {
        audioStall = false;
        audioVideoAligning = false;
        setTimeout(function() {
          if ((!videoRun || backgroundPlay) && !audioRun) {

            audio.play().then(function() {
              /*
              if (!getAudioContext) {
                audioCtx = new AudioContext();
                getAudioContext = true;
              }*/
              // setTimeout(function() {
                video.play().then(function() {

                  bufferMode = false;
                  bufferEndTime = new Date().getTime();
                  if (bufferStartTime !== 0) {
                    bufferingTimes[bufferingTimes.length] = bufferEndTime - bufferStartTime;
                  }

                  // hideVideoControls();
                  /*
                  if (initialVideoLoad) {
                    initialVideoLoad = false;
                  }*/
                  videoLoad = false;
                  // videoPause = true;
                  loading = false;
                  // audio.currentTime = video.currentTime;
                  if (audio.src) {
                    video.currentTime = audio.currentTime;
                  }
                  // audioStall = false;
                  // audioVideoAligning = false;

                }).catch((err) => {

                  console.log(err);
                  /*
                  statusIndicator.classList.remove("buffer");
                  statusIndicator.classList.remove("smooth");
                  statusIndicator.classList.add("error");

                  endLoad();
                            
                  setTimeout(function() {
                    loadingRing.style.display = "none";
                    playPauseButton.style.display = "block";
                    playPauseButton.classList.remove('playing');

                      showVideoControls();

                    // reset the loader
                    setTimeout(function() {
                      resetLoad();
                    }, 10);

                  }, 1000);

                  loading = false;*/

                });
              // }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);
            }).catch((err) => {

              console.log(err);
              /*
              statusIndicator.classList.remove("buffer");
              statusIndicator.classList.remove("smooth");
              statusIndicator.classList.add("error");

              endLoad();
                        
              setTimeout(function() {
                loadingRing.style.display = "none";
                playPauseButton.style.display = "block";
                playPauseButton.classList.remove('playing');

                  showVideoControls();

                // reset the loader
                setTimeout(function() {
                  resetLoad();
                }, 10);

              }, 1000);

              loading = false;*/
            });
          }
        }, 100);
      } else if (audioStall && !audio.buffered && !loading) {
        video.pause();
        console.log("video_pause");

        loading = true;
        bufferingDetected = true;

        loadingRing.style.display = "block";
        playPauseButton.style.display = "none";
        showVideoControls();
      }

      // IF LATENCY IS GOING OFF FROM THE AVERAGE (ACCORDING TO THE DEVICE, ETC.), THEN PAUSE/PLAY

    }

    function playPrevious(m) {
      if ((videoControls.classList.contains('visible') || m) && video.src !== "" && !qualityBestChange && !qualityChange && !audioVideoAligning) {

        // FIRST INSTANCE (seek to the front)
        video.currentTime = 0;
        audio.currentTime = 0;
        videoEnd = false;

        // SECOND INSTANCE - play a previous track in playlist (from the beginning)
      }
    }

    function seekSecondsOutput(s) {
      // Convert the number to a string to handle each digit
      const numberStr = s.toString();
      
      // Create an array to hold the span elements
      let spanArray = [];
  
      // Loop through each character (digit) in the string
      for (let i = 0; i < numberStr.length; i++) {
          // Create a span element and set its text content to the current digit
          let span = document.createElement('span');
          span.classList.add("digit");
          span.textContent = numberStr[i];
          
          // Append the span element to the array
          spanArray.push(span);
      }
  
      // Return the array of span elements
      const outputSpan = document.createElement('span');
      spanArray.forEach(span => outputSpan.appendChild(span));

      return outputSpan;
  }

    function seekForward(m) {

      maxTime = video.duration < maxTime ? video.duration : maxTime;

        if ((videoControls.classList.contains('visible') || m) && video.src !== "" && /*!videoEnd*/ (video.currentTime < (video.duration - skipTime)) && !qualityBestChange && !qualityChange && !audioVideoAligning && seekAllow) {

            playPauseButton.classList.remove('repeat');

            seeking = true;
            seekingLoad = true;
            if (forwardSkippedTime <= (maxTime - skipTime)) {
              skipTime = 10;
              forwardSkippedTime += skipTime;
            } else {
              skipTime = 0;
            }
            seekForwardTextSec.innerHTML = forwardSkippedTime;
            // seekForwardTextSec.innerHTML = seekSecondsOutput(forwardSkippedTime);
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

            if (Number.isFinite(Math.min(video.currentTime + skipTime, video.duration))) {
              video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
              audio.currentTime = video.currentTime;
              refSeekTime = video.currentTime;
            }
            // audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);

            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(function() {
                if (!seekingLoad && !longTap && !seeking && !video.paused) {
                  hideVideoControls();
                  console.log("hideVC");
                }
              }, 3000); // hide controls after 3 sec. if no activity
            }
            if (seekForwardHideInt === null) {
              seekForwardHideInt = setTimeout(function() {
                seeking = false;
                seekForwardText.classList.remove('show');
                forwardSkippedTime = 0;
                setTimeout(function() {
                  // forwardSkippedTime = 0;
                  seekForwardTextSec.innerHTML = forwardSkippedTime;
                  // seekForwardTextSec.innerHTML = seekSecondsOutput(forwardSkippedTime);
                }, 300);
              }, 1000);
            }
        }
    }

    function seekBackward(m) {
      
      maxTime = video.duration < maxTime ? video.duration : maxTime;

        if ((videoControls.classList.contains('visible') || m) && video.src !== "" && (video.currentTime > (skipTime)) && !qualityBestChange && !qualityChange && !audioVideoAligning && seekAllow) {
            //backwardSkippedTime = 0;
            //seekBackwardTextSec.innerHTML = backwardSkippedTime;

            playPauseButton.classList.remove('repeat');
            
            videoEnd = false;
            seeking = true;
            seekingLoad = true;
            if (backwardSkippedTime <= (maxTime - skipTime)) {
              skipTime = 10;
              backwardSkippedTime += skipTime;
            } else {
              skipTime = 0;
            }
            seekBackwardTextSec.innerHTML = backwardSkippedTime;
            clearTimeout(controlsHideInt);
            controlsHideInt = null;
            clearTimeout(seekBackwardHideInt);
            seekBackwardHideInt = null;
            seekForwardText.classList.remove('show');
            setTimeout(function() {
              forwardSkippedTime = 0;
              seekForwardTextSec.innerHTML = forwardSkippedTime;
              // seekForwardTextSec.innerHTML = seekSecondsOutput(forwardSkippedTime);
            }, 300);
            seekBackwardText.classList.add('show');

            if (Number.isFinite(Math.max(video.currentTime - skipTime, 0))) {
              video.currentTime = Math.max(video.currentTime - skipTime, 0);
              audio.currentTime = video.currentTime;
              refSeekTime = video.currentTime;
            }
            // audio.currentTime = Math.max(audio.currentTime - skipTime, 0);

            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(function() {
                if (!seekingLoad && !longTap && !seeking && !video.paused) {
                  hideVideoControls();
                  console.log("hideVC");
                }
              }, 3000); // hide controls after 3 sec. if no activity
            }
            if (seekBackwardHideInt === null) {
              seekBackwardHideInt = setTimeout(function() {
                seeking = false;
                seekBackwardText.classList.remove('show');
                backwardSkippedTime = 0;
                // seekBackwardTextSec.innerHTML = backwardSkippedTime;
                setTimeout(function() {
                  // backwardSkippedTime = 0;
                  seekBackwardTextSec.innerHTML = backwardSkippedTime;
                }, 300);
              }, 1000);
            }
        }
    }

    playPreviousButton.addEventListener('click', function(event) {
      playPrevious();
    });

    seekForwardButton.addEventListener('click', function(event) {
      // event.stopPropagation();
      seekForward(null);
    });

    seekBackwardButton.addEventListener('click', function(event) {
      // event.stopPropagation();
      seekBackward(null);
    });

    video.addEventListener('seeking', function() {

        videoRun = true;

        if (!networkError) {
          clearInterval(networkSpeedInt);
          networkSpeedInt = null;
        }
        clearInterval(networkParamInt);
        networkParamInt = null;
        /*
        controller.abort();
        controllerRTT.abort();
        controllerPacket.abort();
        */
        loading = true;
        bufferingDetected = true;

        loadingRing.style.display = "block";
        playPauseButton.style.display = "none";
        showVideoControls();

        video.classList.add('seeking');
        seekingLoad = true;

        clearInterval(resumeInterval);
        resumeInterval = null;

        /*
        refSeekTime = video.currentTime;
        targetVideo = null;
        targetQuality = 0;
        getVideoFromIndex(false); // loop qualities to get video again
        */
    });
    
    video.addEventListener('seeked', function() {
        seekingLoad = false;
        // hideVideoControls();

        if (resumeInterval === null) {
          resumeInterval = setInterval(() => {
            var buffered = video.buffered;
            if (buffered.length > 0 && video.paused && !autoLoad && bufferLoad && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && !initialVideoLoad && !qualityBestChange && !qualityChange && !seekingLoad) {
              console.log("play", seeking, seekingLoad);
              video.play();
              clearInterval(resumeInterval);
              resumeInterval = null;
            }
          }, 1000);
        }

        if (qualityChange) {
          qualityChange = false;

          console.log("qC: false");

          if (!loading && !bufferingDetected && !framesStuck) {

            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("error");
            statusIndicator.classList.add("smooth");

            endLoad();
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);

          } else {

            showVideoControls();
          }

          updatePositionState();
        
          // START BUFFERING CHECK
    
          if (bufferingCountLoop === null) {
            bufferingCountLoop = setInterval(function() {
              if (bufferCount > 0) {
                bufferingCount[bufferingCount.length] = bufferCount;
              }
              bufferCount = 0;
            }, 5000);
          }
        }
        setTimeout(function() {
            video.classList.remove('seeking');
            if (!audio.paused && !pipEnabled && document.visibilityState === 'visible') {
              backgroundPlayInit = false;
            }
        }, 300);
    });
    
    video.addEventListener('loadedmetadata', function () { //  fired when the metadata has been loaded

        const portrait = window.matchMedia("(orientation: portrait)").matches;
        const videoCSS = window.getComputedStyle(video, null);
        var rawWidth = Number(videoCSS.getPropertyValue("width").slice(0, -2));
        var rawHeight = Number(videoCSS.getPropertyValue("height").slice(0, -2));

        console.log("qc: " + qualityChange);
        qualityChange = false;
        qualityBestChange = false;

/*
        if (portrait) { // IN PORTRAIT MODE
          videoContainer.style.width = rawWidth + "px"; 
          videoContainer.style.height = (rawWidth / videoSizeRatio) + "px";
        } else { // IN LANDSCAPE MODE
          videoContainer.style.height = rawHeight + "px";
          videoContainer.style.width = (rawHeight * videoSizeRatio) + "px"; 
        }*/

        if (!qualityChange && !qualityBestChange && !networkError) {
          videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
          videoProgressBar.style.transform = `scaleX(${
            video.currentTime / video.duration
          })`;
        }
    });

    /*
    video.addEventListener("suspend", (event) => {
      console.log("Data loading has been suspended.");
      const buffered = video.buffered;
      const currentBuffer = buffered.end(buffered.length - 1) - video.currentTime;
      console.log(currentBuffer);
      if (currentBuffer < 5) { // e.g., less than 5 seconds of buffer
        console.log("Buffering more data due to low buffer availability.");
        // Load lower quality version or other buffering optimization steps
      }
    });
    */

    var resumeInterval = null;
    let suspendTimeout;
    const BUFFER_THRESHOLD = 5; // seconds of buffer needed
    const BUFFER_THRESHOLD_AUDIO = 0; 

    function updateVideoLoad() {
      const buffered = (!backgroundPlay) ? video.buffered : audio.buffered;
      const liveTime = (!backgroundPlay) ? video.currentTime : audio.currentTime;

      const MOD_BUFFER_THRESHOLD = (!backgroundPlay) ? BUFFER_THRESHOLD : BUFFER_THRESHOLD_AUDIO;
      
      // Ensure there’s at least one buffered range
      if (buffered.length === 0) {
        console.log("No buffered data available.");
        return;
      }

      // Calculate the buffered time remaining from the current time
      const lastBufferedTime = buffered.end(buffered.length - 1);
      const currentBuffer = lastBufferedTime - liveTime;

      // Log the current buffer information
      console.log(`Current buffer remaining: ${currentBuffer.toFixed(2)} seconds`);

      // Calculate and log the total buffered percentage
      if (!backgroundPlay) {
        const bufferedPercentage = (lastBufferedTime / video.duration) * 100;
        console.log(`Total buffered: ${bufferedPercentage.toFixed(2)}%`);

        // Update the video load progress bar
        videoLoadProgressBar.style.transform = `scaleX(${bufferedPercentage / 100})`; // Assuming the progress bar uses a scale transform
      }

      // Check buffer threshold and optimize if below limit
      if (currentBuffer < MOD_BUFFER_THRESHOLD) {
        if (!suspendTimeout) {
          console.log("Buffering more data due to low buffer availability.");

          // Call a lower-quality load function or take another action
          // loadLowerQuality(); // Uncomment if this function exists

          // getVideoFromBuffer();

          if (video.paused && !autoLoad && (initialVideoLoad || qualityBestChange || qualityChange)) { // at initial
            console.log("play");
            // video.play();
            if (backgroundPlay) {
              audio.play();
            } else {
              video.play();
            }
          } else if (autoLoad) {
            
            endLoad();
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);

          } else {
            if (resumeInterval === null) {
              resumeInterval = setInterval(() => {
                var buffered = video.buffered;
                if (buffered.length > 0 && video.paused && !autoLoad && bufferLoad && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && !initialVideoLoad && !qualityBestChange && !qualityChange && !seekingLoad) {
                  console.log("play", seeking, seekingLoad);
                  video.play();
                  clearInterval(resumeInterval);
                  resumeInterval = null;
                }
              }, 1000);
            }
          }

          // Set timeout to avoid immediate re-triggering
          suspendTimeout = setTimeout(() => {
            suspendTimeout = null; // Reset timeout after the cooldown period
          }, 3000); // Throttle buffer check every 3 seconds
        }
      } else {
        if (video.paused && !autoLoad && (initialVideoLoad || qualityBestChange || qualityChange || ((audio.buffered && backgroundPlay) || video.buffered && !backgroundPlay && bufferLoad))) { 
          console.log("play");
          // video.play();
          if (backgroundPlay) {
            audio.play();
          } else if (!backgroundPlayManual) {
            video.play();
          }
        } else if (autoLoad) {

          endLoad();
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);
        }
      }
    }

    video.addEventListener("suspend", (event) => {
      console.log("Data loading has been suspended.");

      updateVideoLoad();
    });


    var seekAllow = true;

    audio.addEventListener("error", async () => {
      var ntfTitle = "",
          ntfBody = "",
          ntfBadge = "https://ivansojivarghese.github.io/media-player/play_maskable_monochrome_409.png",
          ntfIcon = "https://ivansojivarghese.github.io/media-player/png/error.png";

      console.error(`Error loading: ${audio}`);
      audioErr = true;

      // UI

      playPauseButton.classList.remove('playing');
      playPauseButton.classList.add('repeat');

      endLoad();
      setTimeout(function() {
        console.log("hideLR");
        loadingRing.style.display = "none";
        playPauseButton.style.display = "block";
        // reset the loader
        setTimeout(function() {
          resetLoad();
        }, 10);
      }, 1000);

      // Notifications

      switch (video.error.code) {
        case 1: // MEDIA_ERR_ABORTED
          ntfTitle = "Aborted";
          ntfBody = "Fetching of the associated resource(s) was/were aborted at your request.";
        break;
        case 2: // MEDIA_ERR_NETWORK
          ntfTitle = "Network error";
          ntfBody = "An unexpected network error occurred - preventing further fetching of the associated resource(s).";
        break;
        case 3: // MEDIA_ERR_DECODE
          ntfTitle = "Decode error";
          ntfBody = "An unexpected error occurred while trying to decode the associated resource(s).";
        break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED	
          ntfTitle = "Unsupported playback";
          ntfBody = "The associated resource(s) has/have been found unusable.";
        break;
        default: // OTHER
          ntfTitle = "Unknown error";
          ntfBody = "Something went wrong.";
      }

      if (pms.ntf && !videoErr) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(ntfTitle, {
              body: ntfBody,
              badge: ntfBadge,
              icon: ntfIcon,
              tag: "playbackError",
              requireInteraction: false, // Dismiss after default timeout
              data : {
                url :  "https://ivansojivarghese.github.io/media-player/"
              }
            });
          });
        } else {
          const notification = new Notification(ntfTitle, {
            body: ntfBody,
            badge: ntfBadge,
            icon: ntfIcon,
            tag: "playbackError",
            requireInteraction: false, // Dismiss after default timeout
            data : {
              url :  "https://ivansojivarghese.github.io/media-player/"
            }
          });

          notification.onclick = (event) => {
            event.preventDefault(); // Prevent the default action (usually focusing the notification)
            
            // Focus on the tab or open a new one
            if (document.hasFocus()) {
                console.log("App is already in focus.");
            } else if (window.opener) {
                window.opener.focus();
            } else {
                window.focus();
            }
          };
        }
      }
    });

    video.addEventListener("error", async () => {
      var ntfTitle = "",
          ntfBody = "",
          ntfBadge = "https://ivansojivarghese.github.io/media-player/play_maskable_monochrome_409.png",
          ntfIcon = "https://ivansojivarghese.github.io/media-player/png/error.png";

      console.error(`Error loading: ${video}`);
      videoErr = true;

      // UI

      playPauseButton.classList.remove('playing');
      playPauseButton.classList.add('repeat');

      endLoad();
      setTimeout(function() {
        console.log("hideLR");
        loadingRing.style.display = "none";
        playPauseButton.style.display = "block";
        // reset the loader
        setTimeout(function() {
          resetLoad();
        }, 10);
      }, 1000);

      // Notifications

      switch (video.error.code) {
        case 1: // MEDIA_ERR_ABORTED
          ntfTitle = "Aborted";
          ntfBody = "Fetching of the associated resource(s) was/were aborted at your request.";
        break;
        case 2: // MEDIA_ERR_NETWORK
          ntfTitle = "Network error";
          ntfBody = "An unexpected network error occurred - preventing further fetching of the associated resource(s).";
        break;
        case 3: // MEDIA_ERR_DECODE
          ntfTitle = "Decode error";
          ntfBody = "An unexpected error occurred while trying to decode the associated resource(s).";
        break;
        case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED	
          ntfTitle = "Unsupported playback";
          ntfBody = "The associated resource(s) has/have been found unusable.";
        break;
        default: // OTHER
          ntfTitle = "Unknown error";
          ntfBody = "Something went wrong.";
      }

      if (pms.ntf) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(ntfTitle, {
              body: ntfBody,
              badge: ntfBadge,
              icon: ntfIcon,
              tag: "playbackError",
              requireInteraction: false, // Dismiss after default timeout
              data : {
                url :  "https://ivansojivarghese.github.io/media-player/"
              }
            });
          });
        } else {
          const notification = new Notification(ntfTitle, {
            body: ntfBody,
            badge: ntfBadge,
            icon: ntfIcon,
            tag: "playbackError",
            requireInteraction: false, // Dismiss after default timeout
            data : {
              url :  "https://ivansojivarghese.github.io/media-player/"
            }
          });

          notification.onclick = (event) => {
            event.preventDefault(); // Prevent the default action (usually focusing the notification)
            
            // Focus on the tab or open a new one
            if (document.hasFocus()) {
                console.log("App is already in focus.");
            } else if (window.opener) {
                window.opener.focus();
            } else {
                window.focus();
            }
          };
        }

      }

      // console.error("Attempting Secondary API fetching...");
      /*
      const url = 'https://youtube-mp4-downloader.p.rapidapi.com/mp4?url=' + videoURL;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
          'x-rapidapi-host': 'youtube-mp4-downloader.p.rapidapi.com'
        }
      };

      try {
        
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        targetVideoSources = result.formats;
        targetVideo = targetVideoSources[targetVideoSources.length - 1];
        
        
        video.src = targetVideo.download;
        // video.src = "https://kelaz.site/ready?mp4=azhoM2gzaTljN2gxZzFnMXk3bjIzZDNkcDR4N3YyajluMnowcTB4OWgzejA5eng3YzdrOGEzaTlnMW83djJqOW4yejBiM2IycDRzOWg3bTJsOGM1ajljNXA0cTNjN3k2ZTBxMzdiZzRnNHM5bDh0MWUwazFvNHUzbDh3MzhmdTN4Mm4yczNkMXgyazhxMGM1ajkyY2M1djBnNGQ4ZzJpNGUxdTNwNng5dzZzOW80eDlsOHQ3ZDh2MHc2aTlzM3UzajZkMWIxYjJ4MmQxZTB4OWsxaDdhNm0ycjR5N2IyYzVyNHM5azF5N3A0aDBnMnUzdDd5NzNkYjJnNGc3YjFzOWUwdzN2MHczZzRzOW85ZzR3NmY1ZDFsODhmeTczZGk0dzYzZG85bDhpNHEzZTB2MGk0czVmNXk2ZTBkMThmbTJ0N3M5ZTF5NmQxbjJlMXUzdDd5N3MzdjBlMXk3bzl0MWo2YzV6NXg5cDRkMXU2dDFnNDNkczljNWc0dTNmMmIybDgyY2M3ZDFlMGgwajl2MGw4cTNuMnk3M2R0N2s4YjJzM2w4czN1M3gyaDdmNXowcjRoMGcybTI4ZnEzYjFwMm4yYzVlMHQxZTF5NzdiYjJwNGgwaDN0MWk0czlwNmQxZzRpOWUwbDh4Mnk3cTNtMngyMmNoM3k2bDgyY2o5eTZkMWgwbTJ5N2sxYTZkOHk3aTRrOGgzdzNnNHQ3azhpNHI0eTduMmM1cjR5N3M5dDFvOWQxcDRuOThmdTNmNWk0ZzR5N3c2eDlvOWM1azFkMWUwZDFtMnM5OGZuMmEzcDJuMmw4cDR5N2o2czl4MnYwZzRxM3M5bTJlMWs4azhjNWsxcTNkMXowaTRsOG80eDlqNnQ3OGZiMmE2YTNiMXYwbjJpOXo1YjJlMGM1eDJpNHgybjJhM3UzcjRzNWIxcDJ3NnM5ZTFzOXc2aTlzM3owdzZ3NjhmcDJkMXk3cTBzOXQ3ZzdwNGc0aTRjNXk2bDhmNGgzM2RwMnI0dDdvOWQxZDFpOXEzdDFqNmM1ZzRpNHA0cTNsOHk3ZTFkMXMzaTRlMHk3N2J1M3MzcTNzOWk0azFpOXA0ejVpNGE2N2dwNGo2";
        audio.removeAttribute('src');

        // disable seek buttons
        seekAllow = false;
        seekForwardButton.style.opacity = 0.25;
        seekBackwardButton.style.opacity = 0.25;
      
      } catch (error) {
        console.error(error);
      }*/
    });

    video.addEventListener("abort", () => {
      console.log(`Abort loading: ${video}`);
    });
    
    video.addEventListener('waiting', function () { // when playback has stopped because of a temporary lack of data

      offset = (checkInterval - 20) / 1000;

      if (!networkError) {
        clearInterval(networkSpeedInt);
        networkSpeedInt = null;
      }
      clearInterval(networkParamInt);
      networkParamInt = null;
      /*
      controller.abort();
      controllerRTT.abort();
      controllerPacket.abort();
      */
      statusIndicator.classList.remove("error");
      statusIndicator.classList.remove("smooth");
      statusIndicator.classList.add("buffer");

      getScreenLock();

      // bufferCount++;
      bufferStartTime = new Date().getTime();
      bufferMode = true;
      
      // CHECK FOR LONG BUFFERS

      clearTimeout(controlsHideInt);
      controlsHideInt = null;

      loadingRing.style.display = "block";
      playPauseButton.style.display = "none";
      showVideoControls();

      loading = true;
      bufferLoad = true;

      if (!backgroundPlay && !backgroundPlayManual) {
        audio.pause();
        // videoPause = false;

        console.log("audio_pause");
      }
    });

    video.addEventListener('stalled', function () { // trying to fetch media data, but data is unexpectedly not forthcoming

      offset = (checkInterval - 20) / 1000;

      if (!networkError) {
        clearInterval(networkSpeedInt);
        networkSpeedInt = null;
      }
      clearInterval(networkParamInt);
      networkParamInt = null;
      /*
      controller.abort();
      controllerRTT.abort();
      controllerPacket.abort();
      */
      statusIndicator.classList.remove("error");
      statusIndicator.classList.remove("smooth");
      statusIndicator.classList.add("buffer");

      getScreenLock();

      // bufferCount++;
      bufferStartTime = new Date().getTime();
      bufferMode = true;

      // CHECK FOR LONG BUFFERS
      
      clearTimeout(controlsHideInt);
      controlsHideInt = null;

      loadingRing.style.display = "block";
      playPauseButton.style.display = "none";
      showVideoControls();

      loading = true;
      bufferLoad = true;

      if (!backgroundPlay && !backgroundPlayManual) {
        audio.pause();
        // videoPause = false;

        console.log("audio_pause");
      }
    });

    audio.addEventListener('stalled', function() {
      offset = (checkInterval - 20) / 1000;

      if (!video.paused && video.currentTime > 1) {
        console.log("audiostalled");
        video.pause();
      }

      if (!networkError) {
        clearInterval(networkSpeedInt);
        networkSpeedInt = null;
      }
      clearInterval(networkParamInt);
      networkParamInt = null;
      /*
      controller.abort();
      controllerRTT.abort();
      controllerPacket.abort();
      */
      statusIndicator.classList.remove("error");
      statusIndicator.classList.remove("smooth");
      statusIndicator.classList.add("buffer");

      getScreenLock();

      // bufferCount++;
      bufferStartTime = new Date().getTime();
      bufferMode = true;

      // CHECK FOR LONG BUFFERS
      
      clearTimeout(controlsHideInt);
      controlsHideInt = null;

      loadingRing.style.display = "block";
      playPauseButton.style.display = "none";
      showVideoControls();

      loading = true;
      bufferLoad = true;

      // Check the buffered duration of the audio
      const buffered = audio.buffered;
      
      // Ensure there’s at least one buffered range
      if (buffered.length > 0) {
          const bufferedEndTime = buffered.end(buffered.length - 1); // Get the end of the last buffered range
          const currentBufferDuration = bufferedEndTime - audio.currentTime; // Calculate how much has been buffered

          // Only pause the video if the audio is still buffering
          if (currentBufferDuration < BUFFER_THRESHOLD_AUDIO) { // Example threshold of 5 seconds
            if (!initialVideoLoad && !video.paused && video.currentTime > 1) {
              console.log("pause");
              console.log("Audio is buffering, pausing the video.");
              video.pause();
            }
          } else {
              console.log("Audio has enough buffered data, keeping video playing.");
          }
      } else {
        if (!initialVideoLoad && !video.paused && video.currentTime > 1) {
          console.log("pause");
          console.log("No buffered data available for audio. Pausing video.");
          video.pause();
        }
      }

      // console.log("pause", audio.paused);
      /*
      if (audio.paused) {
        video.pause();
      }*/

      // video.pause();
      // videoPause = false;
    }); 

    audio.addEventListener('waiting', function() {
      offset = (checkInterval - 20) / 1000;

      if (!video.paused && video.currentTime > 1) {
        console.log("audiostalled");
        video.pause();
      }

      if (!networkError) {
        clearInterval(networkSpeedInt);
        networkSpeedInt = null;
      }
      clearInterval(networkParamInt);
      networkParamInt = null;
      /*
      controller.abort();
      controllerRTT.abort();
      controllerPacket.abort();
      */
      statusIndicator.classList.remove("error");
      statusIndicator.classList.remove("smooth");
      statusIndicator.classList.add("buffer");

      getScreenLock();

      // bufferCount++;
      bufferStartTime = new Date().getTime();
      bufferMode = true;
      
      // CHECK FOR LONG BUFFERS

      clearTimeout(controlsHideInt);
      controlsHideInt = null;

      loadingRing.style.display = "block";
      playPauseButton.style.display = "none";
      showVideoControls();

      loading = true;
      bufferLoad = true;

      // Check the buffered duration of the audio
      const buffered = audio.buffered;
      
      // Ensure there’s at least one buffered range
      if (buffered.length > 0) {
          const bufferedEndTime = buffered.end(buffered.length - 1); // Get the end of the last buffered range
          const currentBufferDuration = bufferedEndTime - audio.currentTime; // Calculate how much has been buffered

          // Only pause the video if the audio is still buffering
          if (currentBufferDuration < BUFFER_THRESHOLD_AUDIO) { // Example threshold of 5 seconds
            if (!initialVideoLoad && !video.paused && video.currentTime > 1) {
              console.log("pause");
              console.log("Audio is buffering, pausing the video.");
              video.pause();
            }
          } else {
              console.log("Audio has enough buffered data, keeping video playing.");
          }
      } else {
        if (!initialVideoLoad && !video.paused && video.currentTime > 1) {
          console.log("pause");
          console.log("No buffered data available for audio. Pausing video.");
          video.pause();
        }
      }

      // console.log("pause", audio.paused);
      /*
      if (audio.paused) {
        video.pause();
      }*/

      // video.pause();
      // videoPause = false;
    });

    var liveBufferVal = [];
    var liveBufferIndex = 0;
    var bufferModeExe = false;

    var frameArr = [];
    var framesStuck = false;

    function checkFramesStuck(fps, tps, arr) {
      var det = tps / fps,
          fct = 1;
          /*
          fEnd = 0,
          fStart = 0,
          fDiff = 0;*/
      while (!Number.isInteger(det)) {
        fct++;
        det = det * fct;
      }
      /*
      for (var i = arr.length - 1; i >= arr.length - det; i--) { // check for 'fct' frames increment per 'det' function calls recently
        if (i === arr.length - 1) { // last
          fEnd = arr[i];
        } else if (i === arr.length - det) { // last - det
          fStart = arr[i];
          fDiff = fEnd - fStart;
        }
      }
      if (fDiff <= fct) {
        framesStuck = false;
      } else {
        framesStuck = true;
      }*/
      if (((arr[arr.length - 1] - arr[arr.length - 1 - det]) <= (fct + 1)) && (arr[arr.length - 1] > arr[arr.length - 1 - det])) {
        framesStuck = false;
      } else {
        framesStuck = true;
      }
    }

    // var wasRunning = false;

    function liveBuffer() {

      playbackStats = video.getVideoPlaybackQuality();

      /*
      if (networkError) {
        if (!video.paused || !audio.paused) {
          wasRunning = true;

          video.pause();
          audio.pause();

          statusIndicator.classList.remove("buffer");
          statusIndicator.classList.remove("smooth");
          statusIndicator.classList.add("error");

          endLoad();
                    
          setTimeout(function() {
            loadingRing.style.display = "none";
            playPauseButton.style.display = "block";
            playPauseButton.classList.remove('playing');

            showVideoControls();

            // reset the loader
            setTimeout(function() {
              resetLoad();
            }, 10);

          }, 1000);

          loading = false;
        }
      } else {
        if (wasRunning) {
          if (backgroundPlay) {
            audio.play();
          } else {
            video.play();
            audio.play();
          }
          wasRunning = false;
        }
      }*/

      if (!video.paused) {
        frameArr[frameArr.length] = playbackStats.totalVideoFrames;
        if (targetVideo.fps) {
          checkFramesStuck(targetVideo.fps, tps, frameArr);
        }
      } 

      if (bufferAllow) {
        if (bufferMode || bufferingDetected) {
          var currentTime = new Date().getTime();
          if (bufferStartTime !== 0) {
            var elapsedTime = currentTime - bufferStartTime;
            liveBufferVal[liveBufferIndex] = elapsedTime;
            if (elapsedTime >= bufferLimits[0] && !bufferModeExe) {
              bufferCount++;
            }
          }
          if (((liveBufferVal[liveBufferIndex] >= bufferLimits[2]) || (bufferExceedSuccessive(liveBufferVal, bufferLimits[1], bufferLimitC)) || (bufferingCount[bufferingCount.length - 1] >= bufferLimitC)) && bufferAllow && !qualityChange && !qualityBestChange /*&& !networkError*/ && (video.currentTime > 1) /*&& !bufferLoad*/ && !backgroundPlay) {

            bufferingCount = [];
            bufferCount = 0;

            liveBufferVal = [];
            liveBufferIndex = 0;
            bufferModeExe = false;
            bufferStartTime = 0;

            console.log("buffer video");

            getVideoFromBuffer();

          }

          bufferModeExe = true;

        } else if ((!bufferMode || !bufferingDetected) && bufferModeExe) {
          if (!bufferMode) {
            liveBufferIndex++;
          }
          bufferModeExe = false;
        }
      }
    }

    function bufferExceedSuccessive(bArr, t, c) {
      var count = 0;
      for (var j = bArr.length - 1; j >= 0; j--) {
        if (bArr[j] < t) {
          return false;
        } else if (count < c) {
          count++;
          if (count === c) {
            return true;
          }
        }
      }
    }

    function getVideoFromBuffer() {

      var preventRefetch = false;

      var index = 0;
      var mod = 1;
      var newTargetQuality = getOptimalQuality();

      // newTargetQuality = targetQuality; FOR TESTING
      
      console.log("tQ : " + targetQuality + ", nTQ: " + newTargetQuality);

      if ((video.currentTime > minVideoLoad && (video.currentTime < (video.duration - maxVideoLoad)))) {

        if (newTargetQuality === targetQuality) { // if same quality rating as previous

          // console.log(targetVideoIndex);

          do { // ensure that same res. is not picked again
            index = targetVideoSources[targetVideoIndex + mod] ? (targetVideoIndex + mod) : (targetVideoIndex); // potential need to change/downgrade video quality (by 1 each time)
            if (targetVideoSources[index]) { // if available

              // console.log(targetVideo);

              targetVideo = targetVideoSources[index];

              // console.log(targetVideo);
            }
            mod++;
          } while ((targetVideoSources[targetVideoIndex].height === targetVideo.height) && targetVideoSources[index + mod]);

          targetVideoIndex = index;

          // console.log(targetVideoIndex);

        } else { // otherwise, if different quality rating

          targetVideo = null;

          // console.log("get video again");

          targetQuality = newTargetQuality;
          getVideoFromIndex(false); // loop qualities to get video again

        }

        refSeekTime = video.currentTime;
        // console.log("ref", refSeekTime);

        // clearInterval(resumeInterval);
        // resumeInterval = null;

        console.log("pause");
        video.pause();
        audio.pause(); // pause content

        console.log("audio_pause");

        qualityChange = true;

        if ((!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && !preventRefetch && video.src !== targetVideo.url) {
          // console.log("load again");
          video.src = targetVideo.url; // 'loadstart'

          localStorage.setItem('videoURL', video.src); // Set URL to memory state

        } else {
          qualityChange = false;
        }

        bufferAllow = false;

      }
    }

    function getLoadedPercent() {
      if (video.duration) {
        return ((videoLoadPercentile - videoProgressPercentile) * video.duration) / (video.duration - video.currentTime);
      } else {
        return 0;
      }
    }

    function getRegressionQuality(q, t) {
      var diff = 0;
      var loadP = 0;
      var playQuality = playbackStats.totalVideoFrames ? ((playbackStats.totalVideoFrames - playbackStats.droppedVideoFrames) / playbackStats.totalVideoFrames) : 1;
      if (q > t || q < t) {
        diff = q - t;
        loadP = getLoadedPercent() + 0.1;
        var quo = (Math.abs(diff) + 1);
        var div = ((quo - 2) * (9 / 35)) + 0.2;
        var val = (Math.abs(Math.round((loadP * diff * (quo / div) * playQuality))));
        if (q > t) {
          return (t + val);
        } else {
          return (t - val);
        }
      } else {
        return q;
      }
    }

    function getBestVideo() { // fetch best video according to network conditions - continuous

      var p = getLoadedPercent();

      var preventRefetch = false;
      
      var newTargetQuality = getOptimalQuality();
      newTargetQuality = getRegressionQuality(newTargetQuality , targetQuality);

      var newIndex = getVideoFromIndex(true, newTargetQuality);

      if (((p <= 0 && ((newTargetQuality < targetQuality) || (newIndex > targetVideoIndex))) || (p > 0.1 && ((newTargetQuality > targetQuality) || (newIndex < targetVideoIndex)))) && ((newTargetQuality !== targetQuality) || ((newTargetQuality === targetQuality) && (newIndex !== -1) && (targetVideoIndex !== newIndex))) && !video.paused && !audio.paused && (video.currentTime > minVideoLoad && (video.currentTime < (video.duration - maxVideoLoad))) && !backgroundPlay && !pipEnabled && !qualityBestChange && !qualityChange && !preventQualityChange) { // if same quality rating as previous
        
        targetVideo = null;

        console.log("prepare new video");

        if (newTargetQuality === targetQuality) {

          targetVideo = targetVideoSources[newIndex];
          targetVideoIndex = newIndex;
          targetQuality = newTargetQuality;

        } else {

          targetQuality = newTargetQuality;
          getVideoFromIndex(false); // loop qualities to get video again
        }

        refSeekTime = video.currentTime;

        qualityBestChange = true;
        qualityChange = true;
        bufferAllow = false;

        video.pause();
        audio.pause(); // pause content

        console.log("audio_pause");

        if ((!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && !preventRefetch) {
          console.log("load again");
          video.src = targetVideo.url; // 'loadstart'

          localStorage.setItem('videoURL', video.src); // Set URL to memory state

        }

      } 

    }

    audio.addEventListener('playing', function() {
      clearTimeout(offsetInt);
      offsetInt = null;
      offsetInt = setTimeout(function() {
        offset = 0;
      }, 1000);

      controller = new AbortController();
      signal = controller.signal;

      controllerRTT = new AbortController();
      signalRTT = controllerRTT.signal;

      controllerPacket = new AbortController();
      signalPacket = controllerPacket.signal;
      
      if (networkSpeedInt === null) {
        networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange);
      }
      if (networkParamInt === null) {
        networkParamInt = setInterval(function() {
            measureJitter(pingsCount, 1000);
            measurePacketLoss(pingFileUrl);
        }, pingsInt);
      }   

      getNetworkInfo();
      // estimateNetworkSpeed();

      if (!loading && !bufferingDetected && !framesStuck) {
        statusIndicator.classList.remove("error");
        statusIndicator.classList.remove("buffer");
        statusIndicator.classList.add("smooth");

        endLoad();
        
        setTimeout(function() {
          console.log("hideLR");
          loadingRing.style.display = "none";
          playPauseButton.style.display = "block";

          if (!seekingLoad && !longTap && !seeking) {
            hideVideoControls();
            console.log("hideVC");
          }

          // reset the loader
          setTimeout(function() {
            resetLoad();
          }, 10);

        }, 1000);
      }

      if (!bufferingDetected) {
        loading = false;
      }
/*
      if (initialVideoLoad) {
        initialVideoLoad = false;
      }*/
      videoLoad = false;
      bufferMode = false;
      bufferEndTime = new Date().getTime();
      bufferModeExe = false;

      /*
      if (bufferStartTime !== 0 && !loading && !videoLoad && bufferingDetected && !backgroundPlayInit && !seeking && !seekingLoad) {
        
        bufferingTimes[bufferingTimes.length] = bufferEndTime - bufferStartTime;

        if (((bufferingTimes[bufferingTimes.length - 1] >= bufferLimits[2]) || (bufferExceedSuccessive(bufferingTimes, bufferLimits[1], bufferLimitC)) || (bufferingCount[bufferingCount.length - 1] >= bufferLimitC)) && !backgroundPlay && bufferAllow && !loading) {
          
          bufferingCount = [];
          bufferCount = 0;

          liveBufferVal = [];
          liveBufferIndex = 0;
          bufferModeExe = false;
          bufferStartTime = 0;

          // getVideoFromBuffer();

          console.log("buffer video");
        }
      }*/

    });

    video.addEventListener('playing', function () { // fired when playback resumes after having been paused or delayed due to lack of data
      
      clearTimeout(offsetInt);
      offsetInt = null;
      offsetInt = setTimeout(function() {
        offset = 0;
      }, 1000);

      seekingLoad = false;
      qualityChange = false;

      console.log("qC: false");

      controller = new AbortController();
      signal = controller.signal;

      controllerRTT = new AbortController();
      signalRTT = controllerRTT.signal;

      controllerPacket = new AbortController();
      signalPacket = controllerPacket.signal;
      
      if (networkSpeedInt === null) {
        networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange);
      }
      if (networkParamInt === null) {
        networkParamInt = setInterval(function() {
            measureJitter(pingsCount, 1000);
            measurePacketLoss(pingFileUrl);
        }, pingsInt);
      }

      getNetworkInfo();
      // estimateNetworkSpeed();

      audio.play();

      // if (videoPlay && audio.src) {

        // audio.play().then(function() {
          // setTimeout(function() {
            // video.play().then(function() {

              if (!loading && !bufferingDetected && !framesStuck) {
                statusIndicator.classList.remove("error");
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.add("smooth");

                endLoad();
                
                setTimeout(function() {
                  console.log("hideLR");
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";

                  if (!seekingLoad && !longTap && !seeking) {
                    hideVideoControls();
                    console.log("hideVC");
                  }

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);
              }

              if (!bufferingDetected) {
                loading = false;
              }
              
              if (initialVideoLoad) {
                initialVideoLoad = false;
              }
              videoLoad = false;
              bufferMode = false;
              bufferEndTime = new Date().getTime();
              bufferModeExe = false;
              
              /*
              if (bufferStartTime !== 0 && !loading && !videoLoad && bufferingDetected && !backgroundPlayInit && !seeking && !seekingLoad) {
                
                bufferingTimes[bufferingTimes.length] = bufferEndTime - bufferStartTime;

                if (((bufferingTimes[bufferingTimes.length - 1] >= bufferLimits[2]) || (bufferExceedSuccessive(bufferingTimes, bufferLimits[1], bufferLimitC)) || (bufferingCount[bufferingCount.length - 1] >= bufferLimitC)) && !backgroundPlay && bufferAllow && !loading) {
                  
                  bufferingCount = [];
                  bufferCount = 0;

                  liveBufferVal = [];
                  liveBufferIndex = 0;
                  bufferModeExe = false;
                  bufferStartTime = 0;

                  // getVideoFromBuffer();

                  console.log("buffer video");
                }
              }*/

              // videoPause = true;

              /*
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // hideVideoControls();
              if (controlsHideInt === null) {
                controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
              }*/

              // audio.currentTime = video.currentTime;

            // }).catch((err) => {
              /*
              console.log(err);
              
              statusIndicator.classList.remove("buffer");
              statusIndicator.classList.remove("smooth");
              statusIndicator.classList.add("error");

              endLoad();
                        
              setTimeout(function() {
                loadingRing.style.display = "none";
                playPauseButton.style.display = "block";
                playPauseButton.classList.remove('playing');

                  showVideoControls();

                // reset the loader
                setTimeout(function() {
                  resetLoad();
                }, 10);

              }, 1000);

              loading = false; */

            // });
          // }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);

        // }).catch((err) => {
          /*
          console.log(err);
          
          statusIndicator.classList.remove("buffer");
          statusIndicator.classList.remove("smooth");
          statusIndicator.classList.add("error");

          endLoad();
                    
          setTimeout(function() {
            loadingRing.style.display = "none";
            playPauseButton.style.display = "block";
            playPauseButton.classList.remove('playing');

              showVideoControls();

            // reset the loader
            setTimeout(function() {
              resetLoad();
            }, 10);

          }, 1000);

          loading = false;*/
        // });
      // } 
    });


    video.addEventListener('loadstart', function () { // fired when the browser has started to load a resource
      
      // START LOAD

      tps = targetVideo.fps;

      if (refSeekTime) {
        video.currentTime = refSeekTime;
        audio.currentTime = refSeekTime;

        console.log("refseektime");
      }

      getScreenLock();

      clearTimeout(controlsHideInt);
      controlsHideInt = null;
      showVideoControls();

      loading = true;
      videoLoad = true;
      if (initialVideoLoadCount === 0) {
        initialVideoLoad = true;
      }
      initialVideoLoadCount++;

      loadingRing.style.display = "block";
      playPauseButton.style.display = "none";

      bufferLoad = true;
      /*
      if (networkSpeedInt === null) {
        networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 
      }*/
      /*
      if (bufferInt === null) {
        bufferInt = setInterval(liveBuffer, 1000/60);
      }
      if (bestVideoInt === null) {
        bestVideoInt = setInterval(getBestVideo, avgInt);
      }*/
    });

    function endLoadRp() {
      const loadRp = document.querySelector("#loadR-p");
      const loadRe = document.querySelector("#loadR-e");
      loadRp.style.animationName = "none";
      loadRp.classList.add("endLoad");
      loadRe.classList.add("endLoad_final");
      // loadRe.style.animationName = "loadR_end";
    }

    function endLoadRs() {
      const loadRe = document.querySelector("#loadR-e");
      const loadRs = document.querySelector("#loadR-s");
      loadRs.style.animationName = "none";
      loadRs.classList.add("endLoad_rev");
      loadRe.classList.add("endLoad_final");
    }

    function endLoad() {
      const loadRp = document.querySelector("#loadR-p");
      const loadRs = document.querySelector("#loadR-s");
      loadRp.addEventListener("animationiteration", endLoadRp);
      loadRs.addEventListener("animationiteration", endLoadRs);
    }

    function resetLoad() {
      const loadRp = document.querySelector("#loadR-p");
      const loadRs = document.querySelector("#loadR-s");
      const loadRe = document.querySelector("#loadR-e");
      loadRp.removeEventListener("animationiteration", endLoadRp);
      loadRs.removeEventListener("animationiteration", endLoadRs);
      loadRe.classList.remove("endLoad_final");
      loadRp.classList.remove("endLoad");
      loadRs.classList.remove("endLoad_rev");
      loadRp.style.animationName = "loadR_transverse";
      loadRs.style.animationName = "loadR_transverse_rev";
    }

    var getAudioContext = false;
    var audioRun = false;
    var videoRun = false;


    audio.addEventListener('seeked', function() {
      if (!checkAudioReady) {
        checkAudioReady = setInterval(() => {
            if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
                audioRun = false;
                console.log("Audio is ready to play on a slow network!");
                clearInterval(checkAudioReady);
                checkAudioReady = null;
                // Trigger your play or any other logic
                audio.play();
            }
        }, 100);
      }
    });

    audio.addEventListener('seeking', function() {
      audioRun = true;

      loadingRing.style.display = "block";
      playPauseButton.style.display = "none";
      showVideoControls();
    });

    audio.addEventListener('canplay', function() {

      audioRun = false;

      if (!autoLoad && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad))))) {

        console.log("audio_canplay");

        clearInterval(checkAudioReady);
        checkAudioReady = null;

        // Check if the audio is buffered enough
        const buffered = audio.buffered;

        // Ensure there’s at least one buffered range
        if (buffered.length > 0) {
          const bufferedEndTime = buffered.end(buffered.length - 1); // Get the end of the last buffered range
          const currentBufferDuration = bufferedEndTime - audio.currentTime; // Calculate how much has been buffered

          console.log(`Total buffered time: ${bufferedEndTime.toFixed(2)} seconds`);

          // Check if at least 5 seconds have been buffered ahead
          if (currentBufferDuration >= BUFFER_THRESHOLD_AUDIO && audio.paused) {
            console.log("Resuming audio playback as at least 1 second of audio have been buffered.");

            if (!videoRun) {
              console.log("play");
              // video.play();
              // audio.play();
              if (backgroundPlay) {
                audio.play();
              } else if (!backgroundPlayManual) {
                video.play();
                audio.play();
              }
            }
          } else {
            console.log("Not enough buffered data to resume audio playback. Waiting for more data...");
            // Optionally, you can provide feedback to the user or update UI elements to indicate buffering
          }

        } else {
          console.log("No buffered data available for audio.");
        }

      } else if (autoLoad) {

        endLoad();
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);
      }
    });

    video.addEventListener('canplay', function() { //  fired when the user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
      
      videoRun = false;

      if (!autoLoad && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad))))) {

        console.log("video_canplay");

        if (!qualityBestChange && !qualityChange) {
          bufferAllow = true;
        } 

        // Check if the video is buffered enough
        const buffered = video.buffered;

        // Ensure there’s at least one buffered range
        if (buffered.length > 0) {
          const bufferedEndTime = buffered.end(buffered.length - 1); // Get the end of the last buffered range
          const currentBufferDuration = bufferedEndTime - video.currentTime; // Calculate how much has been buffered

          console.log(`Total buffered time: ${bufferedEndTime.toFixed(2)} seconds`);

          // Check if at least 5 seconds have been buffered ahead
          if (currentBufferDuration >= BUFFER_THRESHOLD) {
            console.log("Resuming playback as at least 5 seconds of video have been buffered.");

            if (videoPlay && !audioRun) {

                  if (qualityChange) {

                    if (refSeekTime) {
                      video.currentTime = refSeekTime;
                      audio.currentTime = refSeekTime;

                      console.log("refseektime");
                    }

                    resetVariables();

                    // bufferAllow = true;

                  } 

                  if (!loading && !bufferingDetected && !framesStuck) {

                    statusIndicator.classList.remove("buffer");
                    statusIndicator.classList.remove("error");
                    statusIndicator.classList.add("smooth");

                    endLoad();
                    
                    setTimeout(function() {
                      console.log("hideLR");
                      loadingRing.style.display = "none";
                      playPauseButton.style.display = "block";

                      // reset the loader
                      setTimeout(function() {
                        resetLoad();
                      }, 10);

                    }, 1000);

                  } else {

                    showVideoControls();
                  }

                  if ((!videoRun || backgroundPlay) && !audioRun) {

                    video.play().then(function() {
                      if (audio.src) {
                        audio.play();

                        setInterval(function() {
                          // console.log("video: " + video.currentTime + ", audio: " + audio.currentTime + ", difference: " + (video.currentTime - audio.currentTime));
                        }, 100);
                      }
                    });
                  }  

                  /*
                  audio.play().then(function () {
                    /*
                    if (!getAudioContext) {
                      audioCtx = new AudioContext();
                      getAudioContext = true;
                    }
                    //setTimeout(function() {
                      video.play().then(function() {
                        // videoPause = true;
            
                        
                        if (audioVideoAlignInt !== null) {
                          clearInterval(audioVideoAlignInt);
                          audioVideoAlignInt = null;
                        }
                        // audioVideoAlignInt = setInterval(audioVideoAlign, 100);
                        
                        setInterval(function() {
                          // console.log("video: " + video.currentTime + ", audio: " + audio.currentTime + ", difference: " + (video.currentTime - audio.currentTime));
                        }, 100);
            
                      }).catch((err) => {

                        console.log(err);
                        /*
                        statusIndicator.classList.remove("buffer");
                        statusIndicator.classList.remove("smooth");
                        statusIndicator.classList.add("error");

                        endLoad();
                                  
                        setTimeout(function() {
                          loadingRing.style.display = "none";
                          playPauseButton.style.display = "block";
                          playPauseButton.classList.remove('playing');

                            showVideoControls();

                          // reset the loader
                          setTimeout(function() {
                            resetLoad();
                          }, 10);

                        }, 1000);

                        loading = false; 

                      });
                    //; }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);

                  }).catch((err) => {

                    console.log(err);
                    /*
                    statusIndicator.classList.remove("buffer");
                    statusIndicator.classList.remove("smooth");
                    statusIndicator.classList.add("error");

                    endLoad();
                              
                    setTimeout(function() {
                      loadingRing.style.display = "none";
                      playPauseButton.style.display = "block";
                      playPauseButton.classList.remove('playing');

                        showVideoControls();

                      // reset the loader
                      setTimeout(function() {
                        resetLoad();
                      }, 10);

                    }, 1000);

                    loading = false;
                  });*/
            
                  updatePositionState();

                  // START BUFFERING CHECK
              
                  if (bufferingCountLoop === null) {
                    bufferingCountLoop = setInterval(function() {
                      if (bufferCount > 0) {
                        bufferingCount[bufferingCount.length] = bufferCount;
                      }
                      bufferCount = 0;
                    }, 5000);
                  }
            }
          } else {
            console.log("Not enough buffered data to resume playback. Waiting for more data...");
            // Optionally, you can provide feedback to the user or update UI elements to indicate buffering

            if (video.paused && !autoLoad && (initialVideoLoad || qualityBestChange || qualityChange)) { // at initial
              console.log("play");
              // video.play();
              if (backgroundPlay) {
                audio.play();
              } else {
                video.play();
              }
            } else if (autoLoad) {
            
              endLoad();
              setTimeout(function() {
                console.log("hideLR");
                loadingRing.style.display = "none";
                playPauseButton.style.display = "block";
                // reset the loader
                setTimeout(function() {
                  resetLoad();
                }, 10);
              }, 1000);

            } else {
              if (resumeInterval === null) {
                resumeInterval = setInterval(() => {
                  var buffered = video.buffered;
                  if (buffered.length > 0 && video.paused && !autoLoad && bufferLoad && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && !initialVideoLoad && !qualityBestChange && !qualityChange && !seekingLoad) {
                    console.log("play", seeking, seekingLoad);
                    video.play();
                    clearInterval(resumeInterval);
                    resumeInterval = null;
                  }
                }, 1000);
              }
            }
          }
        } else {
          console.log("No buffered data available.");

          if (video.paused && !autoLoad && (initialVideoLoad || qualityBestChange || qualityChange)) { // at initial
            console.log("play");
            // video.play();
            if (backgroundPlay) {
              audio.play();
            } else {
              video.play();
            }
          } else if (autoLoad) {
          
            endLoad();
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);
            
          } else {
            if (resumeInterval === null) {
              resumeInterval = setInterval(() => {
                var buffered = video.buffered;
                if (buffered.length > 0 && video.paused && !autoLoad && bufferLoad && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && !initialVideoLoad && !qualityBestChange && !qualityChange && !seekingLoad) {
                  console.log("play", seeking, seekingLoad);
                  video.play();
                  clearInterval(resumeInterval);
                  resumeInterval = null;
                }
              }, 1000);
            }
          }
        }

      } else if (autoLoad) {

        endLoad();
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);
            }, 1000);
      }

    });

    var videoProgressPercentile = 0,
        audioProgressPercentile = 0;

    video.addEventListener('timeupdate', function() {
        // audio.currentTime = video.currentTime;
        refSeekTime = video.currentTime ? video.currentTime : timeToSeconds(videoCurrentTime.textContent);

        localStorage.setItem('timestamp', refSeekTime); // SET timestamp memory

        // console.log("ref", refSeekTime);
        if (!qualityChange && !qualityBestChange) {
          updatePositionState();
          videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
          videoProgressPercentile = (video.currentTime / video.duration);
          videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
          if (video.currentTime > minVideoLoad && (video.currentTime < (video.duration - maxVideoLoad))) {
            videoEnd = false;
          } else {
            videoEnd = true;
          }
          if (!videoControls.classList.contains('visible')) {
            return;
          }
        }

        if ((!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad))))) {
          updateVideoLoad();
        }
    });

    audio.addEventListener("timeupdate", function() {
      refSeekTime = audio.currentTime;

      localStorage.setItem('timestamp', refSeekTime); // SET timestamp memory

      audioProgressPercentile = (audio.currentTime / audio.duration);
      if (!qualityChange && !qualityBestChange) {
        updatePositionState();
      }
    });

    // REF: https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded, by Yann L.
    
    var videoLoadPercentile = 0,
        audioLoadPercentile = 0;
/*
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

      videoLoadPercentile = loadPercentage;

      videoLoadProgressBar.style.transform = `scaleX(${loadPercentage})`;
  });
  */

  video.addEventListener('progress', function() {
    var range = 0;
    var bf = this.buffered;
    var time = this.currentTime;
    
    // Find the buffered range containing `currentTime`
    while (range < bf.length && !(bf.start(range) <= time && time <= bf.end(range))) {
      range += 1;
    }
  
    // Ensure we have a valid range
    if (range < bf.length) {
      /*
      const loadStartPercentage = bf.start(range) / this.duration;
      const loadEndPercentage = bf.end(range) / this.duration;
      const loadPercentage = loadEndPercentage - loadStartPercentage;
      */

      const loadPercentage = bf.end(bf.length - 1) / this.duration;

      videoLoadPercentile = loadPercentage;
  
      // Apply load percentage to the progress bar
      videoLoadProgressBar.style.transform = `scaleX(${loadPercentage})`;
    }
  });

  requestAnimationFrame(() => {
    videoLoadProgressBar.style.transform = `scaleX(${videoLoadPercentile})`;
  });

  /*
  audio.addEventListener('progress', function() {
    var range = 0;
    var bf = this.buffered;
    var time = this.currentTime;

    while(!(bf.start(range) <= time && time <= bf.end(range))) {
        range += 1;
    }
    var loadStartPercentage = bf.start(range) / this.duration;
    var loadEndPercentage = bf.end(range) / this.duration;
    var loadPercentage = loadEndPercentage - loadStartPercentage;

    audioLoadPercentile = loadPercentage;
});
*/

    audio.addEventListener('progress', function() {
      var range = 0;
      var bf = this.buffered;
      var time = this.currentTime;

      // Find the buffered range containing `currentTime`
      while (range < bf.length && !(bf.start(range) <= time && time <= bf.end(range))) {
        range += 1;
      }

      // Ensure `range` is within bounds before accessing start and end
      if (range < bf.length) {
        /*
        const loadStartPercentage = bf.start(range) / this.duration;
        const loadEndPercentage = bf.end(range) / this.duration;
        const loadPercentage = loadEndPercentage - loadStartPercentage;
        */

        const loadPercentage = bf.end(bf.length - 1) / this.duration;

        // Update audio load percentage
        audioLoadPercentile = loadPercentage;
        // console.log("Audio load percentage:", loadPercentage);
      }
    });


    // REFERENCED FROM: https://stackoverflow.com/questions/8825144/detect-double-tap-on-ipad-or-iphone-screen-using-javascript BY Anulal S.

    var tapedTwice = false;
    var firstTouchPlay = false;
    var secondTouchPlay = false;

    var touch = false;
    var touchStart = 0;
    // var touchEnd = 0;
    var longTap = false;
    var longTapExt = false;
    var longTapExt2 = false;
    var forwardSeek = null;

    var Lt_e = false;
    var Lt_e2 = false;

    function longTapStart(mod, event) {
      if (event.touches.length === 1) {
        if (mod === "forward") {
          forwardSeek = true;
        } else if (mod === "backward") {
          forwardSeek = false;
        }
        touch = true;
        touchStart = new Date().getTime();
      }
    }

    function longTapDetect() {
      touch = false;
      touchStart = 0;
      longTap = false;
      longTapExt = false;
      longTapExt2 = false;
      forwardSeek = null;

      Lt_e = false;
      Lt_e2 = false;

      clearInterval(fastSeekInt);
      fastSeekInt = null;
      fastSeekInt = setInterval(fastSeekIteration, fastSeekSpeeds[0]); // speed 1 seeking
    }

    setInterval(function() {
      var t = new Date().getTime();
      if (touch && touchStart) {
        if ((t - touchStart) > fastSeekVal[0]) {
          longTap = true;
          if ((t - touchStart) > fastSeekVal[1]) {
            longTapExt = true;
            if ((t - touchStart) > fastSeekVal[2]) {
              longTapExt2 = true;
            }
          }
        } else {
          longTap = false;
          longTapExt = false;
          longTapExt2 = false;

          Lt_e = false;
          Lt_e2 = false;
        }
      }
    }, 1000/60);

    function fastSeekIteration() {
      if (longTap) {
        if ((longTapExt && !Lt_e) || (longTapExt2 && !Lt_e2)) {
          clearInterval(fastSeekInt);
          fastSeekInt = null;
          if (longTapExt && !Lt_e) {
            if (forwardSeek) {
              seekForward(null);
            } else if (forwardSeek === false) {
              seekBackward(null);
            }
            Lt_e = true;
            fastSeekInt = setInterval(fastSeekIteration, fastSeekSpeeds[1]); // speed 2 seeking
          } else if (longTapExt2 && !Lt_e2) {
            if (forwardSeek) {
              seekForward(null);
            } else if (forwardSeek === false) {
              seekBackward(null);
            }
            Lt_e2 = true;
            fastSeekInt = setInterval(fastSeekIteration, fastSeekSpeeds[2]); // speed 3 seeking
          }
        } else {
          if (forwardSeek) {
            seekForward(null);
          } else if (forwardSeek === false) {
            seekBackward(null);
          }
        }
      }
    }

    fastSeekInt = setInterval(fastSeekIteration, fastSeekSpeeds[0]); // speed 1 seeking

    function tapHandler(event) {
      if (!event.target.classList.contains("no-tap")) {
        if(!tapedTwice) {
            tapedTwice = true;
            if (event.target === playPauseButton || event.target === playPauseButtonImg) {
              firstTouchPlay = true;
            }
            setTimeout( function() { tapedTwice = false; firstTouchPlay = false; secondTouchPlay = false; }, 300 );
            return false;
        } else {
          if (event.target === playPauseButton || event.target === playPauseButtonImg) {
            secondTouchPlay = true;
          }
        }
        event.preventDefault();
        //action on double tap goes below
        if (!video.paused) {
          clearTimeout(controlsHideInt);
          controlsHideInt = null;
          setTimeout(function() {
            if (!seekingLoad && !longTap && !seeking) {
              hideVideoControls();
              console.log("hideVC");
            }
          }, 10);
          if (!video.paused && !document.fullscreenElement) {
            if (((firstTouchPlay && secondTouchPlay) || (!firstTouchPlay && !secondTouchPlay)) && (screen.orientation.angle === 0 || screen.orientation.angle === 180)) {
              video.requestPictureInPicture().then(function() {
                getScreenLock();
                pipEnabled = true;
                backgroundPlayManual = false;
              });
            }
          } else if (!video.paused) {
            if ((firstTouchPlay && secondTouchPlay) || (!firstTouchPlay && !secondTouchPlay)) {
              if (!video.classList.contains("cover")) {
                video.style.objectFit = "cover";
                video.classList.add("cover");
              } else {
                video.style.objectFit = "";
                video.classList.remove("cover");
              }
            }
          }
        }
          /*
          clearTimeout(controlsHideInt);
          controlsHideInt = null;
          setTimeout(hideVideoControls, 10);*/
      } else {
        return;
      }
    }

    videoContainer.addEventListener("touchstart", tapHandler);

    seekForwardButton.addEventListener("touchstart", function(event) {
      longTapStart("forward", event);
    });
    seekForwardButton.addEventListener("touchend", longTapDetect);

    seekBackwardButton.addEventListener("touchstart", function(event) {
      longTapStart("backward", event);
    });
    seekBackwardButton.addEventListener("touchend", longTapDetect);

    document.onvisibilitychange = function() {
      if (!networkError && !videoErr && !audioErr) {
        if (document.visibilityState === 'hidden') {

          if (!pipEnabled) {
            backgroundPlayManual = true;
          }

          if (videoLoad && audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
            audio.load();
          }

          // clear intervals
          if (networkSpeedInt !== null) {
            if (!networkError) {
              clearInterval(networkSpeedInt);
              networkSpeedInt = null;
            }
          }
          if (networkParamInt !== null) {
            clearInterval(networkParamInt);
            networkParamInt = null;
          }

          if (video.src !== "") {
            /*
            controller.abort();
            controllerRTT.abort();
            controllerPacket.abort();
            */
          }

          video.style.objectFit = "";
          video.classList.remove("cover");
          if (!video.paused && !appUnload) {
              video.requestPictureInPicture().then(function() {
                getScreenLock();
                pipEnabled = true;
                backgroundPlayManual = false;
              });
          } else if (video.paused && !pipEnabled) {
            audio.volume = 0; // prevent accidental leakage 
          }
          backgroundPlay = true;
        } else {

          if (backgroundPlay && videoEnd && !playPauseButton.classList.contains("repeat")) {
            video.currentTime = audio.currentTime;

            playPauseButton.classList.remove('playing');
            playPauseButton.classList.add('repeat');

            endLoad();
                  
            setTimeout(function() {
              console.log("hideLR");
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);
          }

          setTimeout(function() {
            if (document.visibilityState === 'visible') {
              backgroundPlayManual = false;
            }
          }, 1000);

          // start intervals to get network info
          if (networkSpeedInt === null) {
              networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 

              getNetworkInfo();
              // estimateNetworkSpeed();
          }
          if (networkParamInt === null) {
            networkParamInt = setInterval(function() {
                measureJitter(pingsCount, 1000);
                measurePacketLoss(pingFileUrl);
            }, pingsInt);

            // measureJitter(pingsCount, 1000);
            // measurePacketLoss(pingFileUrl);
          }

          controller = new AbortController();
          signal = controller.signal;

          controllerRTT = new AbortController();
          signalRTT = controllerRTT.signal;

          controllerPacket = new AbortController();
          signalPacket = controllerPacket.signal;
          
          audio.volume = 1; 
          if (backgroundPlay) {
            if (!audio.paused && !pipEnabled) {

              liveBufferVal = [];
              liveBufferIndex = 0;
              bufferModeExe = false;
              bufferStartTime = 0;

              if (audio.src) {
                video.currentTime = audio.currentTime;
              }
            }
            backgroundPlay = false;
          }
          if (!video.paused) {
              getScreenLock();
              document.exitPictureInPicture().then(function() {
                pipEnabled = false;
                if (document.visibilityState === "visible") {
                  backgroundPlayManual = false;
                } else {
                  backgroundPlayManual = true;
                }
                releaseScreenLock(screenLock);
              });
              if (!loading && !videoLoad && !seeking && !seekingLoad && !longTap) {
                hideVideoControls();
                console.log("hideVC");
              }
          } else if (video.paused && (!videoEnd || (videoEnd && (video.currentTime < (video.duration - maxVideoLoad)))) && video.src !== "" && videoPlay && (!videoRun || backgroundPlay) && !audioRun) {
            if (!loading && !videoLoad && !seeking && !seekingLoad && !longTap) {
              hideVideoControls();
              console.log("hideVC");
            }
            // play the video (only when it hasn't ended)
            video.play().then(function () {
              // audioCtx = new AudioContext();
              // setTimeout(function() {
              if (audio.src) {
                 audio.play().then(function() {
                  // videoPause = true;
                }).catch((err) => {

                  console.log(err);
                  /*
                  statusIndicator.classList.remove("buffer");
                  statusIndicator.classList.remove("smooth");
                  statusIndicator.classList.add("error");

                  endLoad();
                            
                  setTimeout(function() {
                    loadingRing.style.display = "none";
                    playPauseButton.style.display = "block";
                    playPauseButton.classList.remove('playing');

                      showVideoControls();

                    // reset the loader
                    setTimeout(function() {
                      resetLoad();
                    }, 10);

                  }, 1000);

                  loading = false;
*/
                });

              }
              // }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);

            }).catch((err) => {

              console.log(err);
              /*
              statusIndicator.classList.remove("buffer");
              statusIndicator.classList.remove("smooth");
              statusIndicator.classList.add("error");

              endLoad();
                        
              setTimeout(function() {
                loadingRing.style.display = "none";
                playPauseButton.style.display = "block";
                playPauseButton.classList.remove('playing');

                  showVideoControls();

                // reset the loader
                setTimeout(function() {
                  resetLoad();
                }, 10);

              }, 1000);

              loading = false; */
            });
          }
        }
      }
    };

    video.addEventListener('leavepictureinpicture', () => {
      pipEnabled = false;
      if (document.visibilityState === "visible") {
        backgroundPlayManual = false;
      } else {
        backgroundPlayManual = true;
      }
    });

    audio.addEventListener("loadeddata", () => {
      console.log("Audio has loaded some data, canplay might not fire in the background.");

      if (videoLoad && backgroundPlay) {
        clearInterval(checkAudioReady);
        checkAudioReady = null;

        audio.play();
      }

    });

    var checkAudioReady = null;

    setInterval(function() {
      if (!networkError) {
        if (document.pictureInPictureElement !== null) {
          pipEnabled = true;
          backgroundPlayManual = false;
        } else {
          pipEnabled = false;
          if (document.visibilityState === "visible") {
            backgroundPlayManual = false;
          } else {
            backgroundPlayManual = true;
          }
        }
        if (document.visibilityState === "hidden" && !pipEnabled) {
          backgroundPlay = true;
        } else {
          backgroundPlay = false;
        }
      }

      if (audio.buffered) {
        audioRun = false;
      }
      if (video.buffered) {
        videoRun = false;
      }

      if (videoLoad && backgroundPlay && !checkAudioReady) {
        checkAudioReady = setInterval(() => {
          if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA && !initialAudioLoad) {
              initialAudioLoad = true;
              audioRun = false;
              console.log("Audio is ready to play on a slow network!");
              clearInterval(checkAudioReady);
              checkAudioReady = null;
              // Trigger your play or any other logic
              audio.play();
          }
        }, 100);
      } else if (checkAudioReady) {
        clearInterval(checkAudioReady);
        checkAudioReady = null;
      }

      if ("Notification" in window) {
        switch (Notification.permission) {
          case 'granted':
              pms.ntf = true;
              break;
          case 'denied':
          case 'default':
              pms.ntf = false;
              break;
          default:
              pms.ntf = false;
        }
      }
    }, 1000/60);
    
    setInterval(() => { // CLEAN UP notifications frequently
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.getNotifications().then((notifications) => {
            notifications.forEach((notification) => {
              if (notification.tag !== 'offline' && notification.tag !== 'slow') { // Replace with your specific tag
                notification.close();
              }
            });
          });
        }
      });
    }, 60000); // Run every 60 seconds    

    if ('serviceWorker' in navigator) {
      // Ensure the service worker is ready
      navigator.serviceWorker.ready.then((registration) => {
        // Register the sync event
        registration.sync.register('clear-notifications').then(() => {
            console.log('Background Sync registered for clearing notifications.');
        }).catch((err) => {
            console.error('Failed to register Background Sync:', err);
        });
      });
    }

    if ('storage' in navigator && 'persist' in navigator.storage) {
      navigator.storage.persist().then((granted) => {
          console.log(granted ? "Persistent storage granted" : "Persistent storage denied");
      });
    }

    window.addEventListener('beforeunload', () => {
      if (pms.ntf) { // CLOSE ALL notifications

        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.getNotifications().then((notifications) => {
              notifications.forEach((notification) => notification.close());
            });
          }
        });

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ action: 'app_closing' });
        }
      }
    });

    window.addEventListener('unload', () => {
      if (pms.ntf) { // CLOSE ALL notifications
        
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.getNotifications().then((notifications) => {
              notifications.forEach((notification) => notification.close());
            });
          }
        });

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ action: 'app_closing' });
        }

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register('clear-notifications').catch((err) => {
                console.error('Background Sync registration failed on unload:', err);
            });
          });
        }
      }
    });

    window.addEventListener('pagehide', function (event) {
      if (event.persisted) {
        // If the event's persisted property is `true` the page is about
        // to enter the Back-Forward Cache, which is also in the frozen state
        appUnload = null;

        if (videoLoad && audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          audio.load();
        }

      } else {
        // If the event's persisted property is not `true` the page is about to be unloaded.
        appUnload = true;

        if (pms.ntf) { // CLOSE ALL notifications
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration) {
              registration.getNotifications().then((notifications) => {
                notifications.forEach((notification) => notification.close());
              });
            }
          });
        }

        video.src = ""; 
            // Reset position state when media is reset.
        navigator.mediaSession.setPositionState(null);
        for (const [action] of actionHandlers) {
          try {
            navigator.mediaSession.setActionHandler(action, null);
          } catch (error) {
            console.log(`The media session action "${action}" is not supported yet.`);
          }
        } 
      }
    },
      { capture: true }
    );

    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        // If the event's persisted property is `true` the page is about
        // to enter the Back-Forward Cache, which is also in the frozen state
        appUnload = false;
      } /*else {
        // If the event's persisted property is not `true` the page is about to be unloaded.
        appUnload = false;
      }*/
    },
      { capture: true }
    );

    window.addEventListener("resize", function() {

      dpr = window.devicePixelRatio;
      dHeight = window.outerHeight;
      dWidth = window.outerWidth;
      dRes = dHeight * dWidth;

      getOptimalQuality();

      if ((window.innerWidth < 500 && (screen.orientation.angle === 0 || screen.orientation.angle === 180)) || (window.innerHeight < 500 && (screen.orientation.angle === 90 || screen.orientation.angle === 270))) {
        pipButton.style.display = "none";
        fitscreenButton.style.display = "none";
      } else {
        fitscreenButton.style.display = "block";

        if (video.requestPictureInPicture) {
          if (!document.fullscreenElement) {
            pipButton.style.display = "block";
          } else {
            pipButton.style.display = "none";
          }
        } else {
          pipButton.style.display = "none";
        }
      }
    });
