
    
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

    var playbackBufferInt = null;
    var controlsHideInt = null;
    var seekForwardHideInt = null;
    var seekBackwardHideInt = null;
    var skipTime = 10;
    var maxTime = 9999;
    var forwardSkippedTime = 0;
    var backwardSkippedTime = 0;

    var bufferInt = null;
    var bestVideoInt = null;
    var qualityBestInt = null;
    var offsetInt = null;

    var audioCtx;
    var playbackStats;

    var playPauseManual = false;

    var videoPause = false;
    var videoPlay = true;

    var appUnload = false;

    var tps = 0; // function call times per sec.

    var loading = false;
    var videoLoad = false;
    var initialVideoLoad = false;
    var initialVideoLoadCount = 0;

    var seeking = false;
    var seekingLoad = false;

    var fastSeekInt = null;
    var fastSeekVal = [1000, 5000, 10000]; // min. tap-hold times for each speed state
    var fastSeekSpeeds = [300, 200, 50]; // fast seeking intervals

    var minVideoLoad = 3; // min. sec. for video to exit init load stage
    var maxVideoLoad = 3;

    var interactiveType = "";

    var backgroundPlay = false; // background audio playback
    var pipEnabled = false;
    var backgroundPlayInit = false;

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
                && !video.paused
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

        if (loading && bufferingDetected) {
          statusIndicator.classList.remove("error");
          statusIndicator.classList.remove("smooth");
          statusIndicator.classList.add("buffer");
            
          loadingRing.style.display = "block";
          playPauseButton.style.display = "none";
          showVideoControls();
        }  

        if (!loading && !bufferingDetected && bufferLoad) {
            bufferLoad = false;
            
            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("error");
            statusIndicator.classList.add("smooth");

            endLoad();
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              if (!seekingLoad && !longTap && !seeking) {
                hideVideoControls();
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
          navigator.mediaSession.setPositionState({
            duration: video.duration,
            playbackRate: video.playbackRate,
            position: video.currentTime,
          });
        } else {
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
      if (videoControls.classList.contains('visible') && !audioVideoAligning && !qualityBestChange) {

        if (video.paused && video.src !== "" && videoPlay) {

          playPauseManual = true;

          audio.play().then(function () {
            // audioCtx = new AudioContext();
            setTimeout(function() {
              video.play().then(function() {
                videoPause = true;
                if (videoEnd) {
                  audio.currentTime = video.currentTime;
                  videoEnd = false;
                }
              }).catch((err) => {

                console.log(err);
                
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.remove("smooth");
                statusIndicator.classList.add("error");

                endLoad();
                          
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";

                  /*
                  if (!seekingLoad && !longTap && !seeking && !loading) {
                    hideVideoControls();
                  }*/

                  showVideoControls();

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);

                loading = false;

              });
            }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);
          }).catch((err) => {

            console.log(err);

            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("error");

            endLoad();
                      
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              /*
              if (!seekingLoad && !longTap && !seeking) {
                hideVideoControls();
              }*/

              showVideoControls();

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);

            loading = false;
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

            videoPause = false;
          // }
        }
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
              releaseScreenLock(screenLock);
            });
            // pipButton.children[0].classList.remove("exit");
          } else if (document.pictureInPictureEnabled) {
            video.requestPictureInPicture().then(function() {
              getScreenLock();
              pipEnabled = true;
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

        if (!qualityBestChange) {
          bufferAllow = true;
        } 
        /*
        setTimeout(function() {
          qualityBestChange = false;
        }, 3000);*/

        // videoEnd = false;
        if (networkSpeedInt === null) {
          networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 
        }
        if (bufferInt === null) {
          bufferInt = setInterval(liveBuffer, 1000/tps);
        }
        /////////////////////////
        if (bestVideoInt === null) {
          bestVideoInt = setInterval(getBestVideo, (avgInt * 3));
        }
        /////////////////////////
        if (qualityBestInt === null) {
          qualityBestInt = setInterval(qualityBestReset, 1000/tps);
        }

        if (!playPauseManual) {
          audio.play().then(function() {
            if (videoEnd) {
              audio.currentTime = 0;
            }
            
            if (!videoPause && !backgroundPlay && !pipEnabled) {
              video.currentTime = audio.currentTime;
            }
            
            videoPause = true;

          }).catch((err) => {

            console.log(err);

            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("error");

            endLoad();
                      
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              /*
              if (!seekingLoad && !longTap && !seeking) {
                hideVideoControls();
              }*/

              showVideoControls();

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);

            loading = false;
          });

          playPauseButton.classList.remove('repeat');
          playPauseButton.classList.add('playing');

          if (firstPlay) {
            if (!seekingLoad && !longTap && !seeking) {
              hideVideoControls();
            }
            firstPlay = false;
          } else {
            clearTimeout(controlsHideInt);
            controlsHideInt = null;
            if (controlsHideInt === null) {
              controlsHideInt = setTimeout(function() {
                if (!seekingLoad && !longTap && !seeking && !video.paused) {
                  hideVideoControls();
                }
              }, 3000); // hide controls after 3 sec. if no activity
            }
          }
          navigator.mediaSession.playbackState = 'playing';
          getScreenLock();
        } else {
          if (!videoPause && !backgroundPlay && !pipEnabled && !videoEnd) {
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

      if (!qualityBestChange) {

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
        videoPause = false;
      } else {
        backgroundPlay = true;
        backgroundPlayInit = true;
      }
      if (!audioVideoAligning) {
        playPauseButton.classList.remove('playing');
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
      audio.volume = 1;
      navigator.mediaSession.playbackState = 'playing';
      getScreenLock();
    });

    video.addEventListener('ended', function() {
      playPauseButton.classList.remove('playing');
      playPauseButton.classList.add('repeat');

      clearInterval(networkSpeedInt);
      networkSpeedInt = null;
      clearInterval(bufferInt);
      bufferInt = null;
      clearInterval(bestVideoInt);
      bestVideoInt = null;
      clearInterval(qualityBestInt);
      qualityBestInt = null;

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
            } else if (!loading) {
              clearTimeout(controlsHideInt);
              controlsHideInt = null;
              controlsHideInt = setInterval(function() {
                if (!loading && !videoLoad && !seeking && !seekingLoad && !video.paused) {
                  hideVideoControls();
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
      if (!qualityChange) {
        videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
        videoProgressBar.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
    }

    function hideVideoControls() {
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
              }
            }, 1000);
          } else {
            if (!seekingLoad && !longTap && !seeking) {
              hideVideoControls();
            }
          }
        } else {
          showVideoControls();
          if (controlsHideInt === null) {
            controlsHideInt = setTimeout(function() {
              if (!loading && !video.paused && !seekingLoad && !longTap && !seeking) {
                hideVideoControls();
              } else if (loading) {
                clearTimeout(controlsHideInt);
                controlsHideInt = null;
                controlsHideInt = setInterval(function() {
                  if (!loading && !seekingLoad && !longTap && !seeking && !video.paused) {
                    hideVideoControls();
                    clearInterval(controlsHideInt);
                    controlsHideInt = null;
                  }
                }, 100);
              }
            }, 3000); // hide controls after 3 sec. if no activity
          }
        }
      } else if (event.target === videoControls) {
        if (video.paused && video.src !== "" && videoPlay) {

          audio.play().then(function () {
            // audioCtx = new AudioContext();
            setTimeout(function() {
              video.play().then(function() {
                videoPause = true;
              }).catch((err) => {

                console.log(err);
                
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.remove("smooth");
                statusIndicator.classList.add("error");

                endLoad();
                          
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";
                  /*
                  if (!seekingLoad && !longTap && !seeking) {
                    hideVideoControls();
                  }*/

                  showVideoControls();

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);

                loading = false;

              });
            }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);
          }).catch((err) => {

            console.log(err);

            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("error");

            endLoad();
                      
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              /*
              if (!seekingLoad && !longTap && !seeking) {
                hideVideoControls();
              }*/

              showVideoControls();

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);

            loading = false;
          });
          
          // audio.currentTime = video.currentTime;
          updatePositionState();

        } else if (!video.paused && video.src !== "") {

          // if (videoPause) {
            audio.pause();
            video.pause();

            bufferStartTime = 0;
            bufferEndTime = 0;

            videoPause = false;
          // }
          
        }
      }
    });

    document.addEventListener('DOMContentLoaded', function() {
      showVideoControls();
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

    function audioVideoAlign() {
      var aT = audio.currentTime;
      var vT = video.currentTime;
      var diff = vT - aT;

      audioLatencyArr[audioLatencyArr.length] = diff;
      audioTimes[audioTimes.length] = aT;
      videoTimes[videoTimes.length] = vT;

      if (!video.paused && !seekingLoad && !videoEnd && (!loading || qualityBestChange) && !bufferingDetected) {
        
        if ((checkLatency(audioTimes, audioDiffMax) && !checkLatency(videoTimes, audioDiffMax)) || (Math.abs(video.currentTime - audio.currentTime) > 1) /*&& video.currentTime > minVideoLoad*/) { // only buffer when audio has stalled
          // bufferCount++;
          bufferStartTime = new Date().getTime();
          bufferMode = true;

          console.log("audioVideoAlign: paused");

          if (qualityBestChange && audio.paused && !seekingLoad && !longTap && !seeking) {
            audio.play();
            hideVideoControls();
          }

          loading = true;

          audioVideoAligning = true;

          // video.pause();
          // audio.pause();

          videoPause = false;

          audioStall = true;

        } /*else if (audioStall) {

          video.play().then(function() {

            bufferEndTime = new Date().getTime();
            if (bufferStartTime !== 0) {
              bufferingTimes[bufferingTimes.length] = bufferEndTime - bufferStartTime;
            }
  
            videoPause = true;
            loading = false;
            audio.currentTime = video.currentTime;

            audioStall = false;
  
          }).catch((err) => {


            audioStall = false;
          });
        }*/
      } else if (audioStall) {
        audioStall = false;
        audioVideoAligning = false;
        setTimeout(function() {
          audio.play().then(function() {
            if (!getAudioContext) {
              audioCtx = new AudioContext();
              getAudioContext = true;
            }
            setTimeout(function() {
              video.play().then(function() {

                bufferMode = false;
                bufferEndTime = new Date().getTime();
                if (bufferStartTime !== 0) {
                  bufferingTimes[bufferingTimes.length] = bufferEndTime - bufferStartTime;
                }

                // hideVideoControls();
                if (initialVideoLoad) {
                  initialVideoLoad = false;
                }
                videoLoad = false;
                videoPause = true;
                loading = false;
                // audio.currentTime = video.currentTime;
                video.currentTime = audio.currentTime;
                // audioStall = false;
                // audioVideoAligning = false;

              }).catch((err) => {

                console.log(err);
                
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.remove("smooth");
                statusIndicator.classList.add("error");

                endLoad();
                          
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";
                  /*
                  if (!seekingLoad && !longTap && !seeking) {
                    hideVideoControls();
                  }*/

                    showVideoControls();

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);

                loading = false;

              });
            }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);
          }).catch((err) => {

            console.log(err);

            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("error");

            endLoad();
                      
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              /*
              if (!seekingLoad && !longTap && !seeking) {
                hideVideoControls();
              }*/

                showVideoControls();

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);

            loading = false;
          });
        }, 100);
      }

      // IF LATENCY IS GOING OFF FROM THE AVERAGE (ACCORDING TO THE DEVICE, ETC.), THEN PAUSE/PLAY

      
    }

    function playPrevious(m) {
      if ((videoControls.classList.contains('visible') || m) && video.src !== "" && !qualityBestChange) {

        // FIRST INSTANCE (seek to the front)
        video.currentTime = 0;
        audio.currentTime = 0;
        videoEnd = false;

        // SECOND INSTANCE - play a previous track in playlist (from the beginning)
      }
    }

    function seekForward(m) {

      maxTime = video.duration < maxTime ? video.duration : maxTime;

        if ((videoControls.classList.contains('visible') || m) && video.src !== "" && !videoEnd && !qualityBestChange) {
            //forwardSkippedTime = 0;
            //seekForwardTextSec.innerHTML = forwardSkippedTime;

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
            }
            // audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);

            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(function() {
                if (!seekingLoad && !longTap && !seeking && !video.paused) {
                  hideVideoControls();
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
                }, 300);
              }, 1000);
            }
        }
    }

    function seekBackward(m) {
      
      maxTime = video.duration < maxTime ? video.duration : maxTime;

        if ((videoControls.classList.contains('visible') || m) && video.src !== "" && !qualityBestChange) {
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
            }, 300);
            seekBackwardText.classList.add('show');

            if (Number.isFinite(Math.max(video.currentTime - skipTime, 0))) {
              video.currentTime = Math.max(video.currentTime - skipTime, 0);
              audio.currentTime = video.currentTime;
            }
            // audio.currentTime = Math.max(audio.currentTime - skipTime, 0);

            if (controlsHideInt === null && !video.paused) {
              controlsHideInt = setTimeout(function() {
                if (!seekingLoad && !longTap && !seeking && !video.paused) {
                  hideVideoControls();
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

        clearInterval(networkSpeedInt);
        networkSpeedInt = null;
        controller.abort();

        loading = true;
        bufferingDetected = true;

        video.classList.add('seeking');
        seekingLoad = true;
    });
    
    video.addEventListener('seeked', function() {
        seekingLoad = false;
        // hideVideoControls();
        if (qualityChange) {
          qualityChange = false;

          if (!loading && !bufferingDetected) {

            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("error");
            statusIndicator.classList.add("smooth");

            endLoad();
            setTimeout(function() {
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
/*
        if (portrait) { // IN PORTRAIT MODE
          videoContainer.style.width = rawWidth + "px"; 
          videoContainer.style.height = (rawWidth / videoSizeRatio) + "px";
        } else { // IN LANDSCAPE MODE
          videoContainer.style.height = rawHeight + "px";
          videoContainer.style.width = (rawHeight * videoSizeRatio) + "px"; 
        }*/

        if (!qualityChange) {
          videoCurrentTime.textContent = secondsToTimeCode(video.currentTime);
          videoProgressBar.style.transform = `scaleX(${
            video.currentTime / video.duration
          })`;
        }
    });

    
    video.addEventListener('waiting', function () { // when playback has stopped because of a temporary lack of data

      offset = (checkInterval - 20) / 1000;

      clearInterval(networkSpeedInt);
      networkSpeedInt = null;
      controller.abort();

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

      audio.pause();
      videoPause = false;
    });

    video.addEventListener('stalled', function () { // trying to fetch media data, but data is unexpectedly not forthcoming

      offset = (checkInterval - 20) / 1000;

      clearInterval(networkSpeedInt);
        networkSpeedInt = null;
        controller.abort();
      
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

      audio.pause();
      videoPause = false;
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
      if ((arr[arr.length - 1] - arr[arr.length - 1 - det]) <= (fct + 1)) {
        framesStuck = false;
      } else {
        framesStuck = true;
      }
    }

    function liveBuffer() {

      playbackStats = video.getVideoPlaybackQuality();

      if (!video.paused) {
        frameArr[frameArr.length] = playbackStats.totalVideoFrames;
        checkFramesStuck(targetVideo.fps, tps, frameArr);
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
          if (((liveBufferVal[liveBufferIndex] >= bufferLimits[2]) || (bufferExceedSuccessive(liveBufferVal, bufferLimits[1], bufferLimitC)) || (bufferingCount[bufferingCount.length - 1] >= bufferLimitC)) && !backgroundPlay && bufferAllow && !loading) {

            bufferingCount = [];
            bufferCount = 0;

            liveBufferVal = [];
            liveBufferIndex = 0;
            bufferModeExe = false;
            bufferStartTime = 0;

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

      if (newTargetQuality === targetQuality) { // if same quality rating as previous
        do { // ensure that same res. is not picked again
          index = targetVideoSources[targetVideoIndex + mod] ? (targetVideoIndex + mod) : (targetVideoIndex); // potential need to change/downgrade video quality (by 1 each time)
          if (targetVideoSources[index]) { // if available
            targetVideo = targetVideoSources[index];
            targetVideoIndex = index;
          }
          mod++;
        } while ((targetVideoSources[index].height === targetVideo.height) && targetVideoSources[index + mod]);
      } else { // otherwise, if different quality rating

        targetVideo = null;

        console.log("get video again");

        targetQuality = newTargetQuality;
        getVideoFromIndex(false); // loop qualities to get video again
      }

      refSeekTime = video.currentTime;

      // if (targetVideoSources[index]) { // if available
        // targetVideo = targetVideoSources[index];
        // targetVideoIndex = index;

      video.pause();
      audio.pause(); // pause content

      qualityChange = true;

      if (!videoEnd && !preventRefetch) {
        video.src = targetVideo.url; // 'loadstart'
      }

      bufferAllow = false;

      // }
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

      if (((p <= 0 && ((newTargetQuality < targetQuality) || (newIndex > targetVideoIndex))) || (p > 0.1 && ((newTargetQuality > targetQuality) || (newIndex < targetVideoIndex)))) && ((newTargetQuality !== targetQuality) || ((newTargetQuality === targetQuality) && (newIndex !== -1) && (targetVideoIndex !== newIndex))) && !video.paused && !audio.paused && !backgroundPlay && !pipEnabled && !qualityBestChange && !preventQualityChange) { // if same quality rating as previous
        
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

        if (!videoEnd && !preventRefetch) {
          video.src = targetVideo.url; // 'loadstart'
        }

      } 

    }

    video.addEventListener('playing', function () { // fired when playback resumes after having been paused or delayed due to lack of data
      
      clearTimeout(offsetInt);
      offsetInt = null;
      offsetInt = setTimeout(function() {
        offset = 0;
      }, 1000);

      controller = new AbortController();
      signal = controller.signal;

      if (networkSpeedInt === null) {

        networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange);
      }

      if (videoPlay) {

        audio.play().then(function() {
          setTimeout(function() {
            video.play().then(function() {

              if (!loading && !bufferingDetected) {
                statusIndicator.classList.remove("error");
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.add("smooth");

                endLoad();
                
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";

                  if (!seekingLoad && !longTap && !seeking) {
                    hideVideoControls();
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

              if (bufferStartTime !== 0 && !loading && !videoLoad && bufferingDetected && !backgroundPlayInit && !seeking && !seekingLoad) {
                
                bufferingTimes[bufferingTimes.length] = bufferEndTime - bufferStartTime;

                if (((bufferingTimes[bufferingTimes.length - 1] >= bufferLimits[2]) || (bufferExceedSuccessive(bufferingTimes, bufferLimits[1], bufferLimitC)) || (bufferingCount[bufferingCount.length - 1] >= bufferLimitC)) && !backgroundPlay && bufferAllow && !loading) {
                  
                  bufferingCount = [];
                  bufferCount = 0;

                  liveBufferVal = [];
                  liveBufferIndex = 0;
                  bufferModeExe = false;
                  bufferStartTime = 0;

                  getVideoFromBuffer();
                }
              }

              videoPause = true;

              /*
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              // hideVideoControls();
              if (controlsHideInt === null) {
                controlsHideInt = setTimeout(hideVideoControls, 3000); // hide controls after 3 sec. if no activity
              }*/

              // audio.currentTime = video.currentTime;

            }).catch((err) => {

              console.log(err);
              
              statusIndicator.classList.remove("buffer");
              statusIndicator.classList.remove("smooth");
              statusIndicator.classList.add("error");

              endLoad();
                        
              setTimeout(function() {
                loadingRing.style.display = "none";
                playPauseButton.style.display = "block";
                /*
                if (!seekingLoad && !longTap && !seeking) {
                  hideVideoControls();
                }*/

                  showVideoControls();

                // reset the loader
                setTimeout(function() {
                  resetLoad();
                }, 10);

              }, 1000);

              loading = false;

            });
          }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);

        }).catch((err) => {

          console.log(err);

          statusIndicator.classList.remove("buffer");
          statusIndicator.classList.remove("smooth");
          statusIndicator.classList.add("error");

          endLoad();
                    
          setTimeout(function() {
            loadingRing.style.display = "none";
            playPauseButton.style.display = "block";
            /*
            if (!seekingLoad && !longTap && !seeking) {
              hideVideoControls();
            }*/

              showVideoControls();

            // reset the loader
            setTimeout(function() {
              resetLoad();
            }, 10);

          }, 1000);

          loading = false;
        });
      }
    });


    video.addEventListener('loadstart', function () { // fired when the browser has started to load a resource
      
      // START LOAD

      tps = targetVideo.fps;

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

      if (networkSpeedInt === null) {
        networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 
      }
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

    video.addEventListener('canplay', function() { //  fired when the user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.

      if (videoPlay) {

            if (qualityChange) {

              if (refSeekTime) {
                video.currentTime = refSeekTime;
                audio.currentTime = refSeekTime;
              }

              resetVariables();

              // bufferAllow = true;

            } 

            if (!loading && !bufferingDetected) {

              statusIndicator.classList.remove("buffer");
              statusIndicator.classList.remove("error");
              statusIndicator.classList.add("smooth");

              endLoad();
              
              setTimeout(function() {
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

            audio.play().then(function () {
              if (!getAudioContext) {
                audioCtx = new AudioContext();
                getAudioContext = true;
              }
              setTimeout(function() {
                video.play().then(function() {
                  videoPause = true;
      
                  
                  if (audioVideoAlignInt !== null) {
                    clearInterval(audioVideoAlignInt);
                    audioVideoAlignInt = null;
                  }
                  audioVideoAlignInt = setInterval(audioVideoAlign, 100);
                  
                  setInterval(function() {
                    console.log("video: " + video.currentTime + ", audio: " + audio.currentTime + ", difference: " + (video.currentTime - audio.currentTime));
                  }, 100);
      
                }).catch((err) => {

                  console.log(err);
                  
                  statusIndicator.classList.remove("buffer");
                  statusIndicator.classList.remove("smooth");
                  statusIndicator.classList.add("error");

                  endLoad();
                            
                  setTimeout(function() {
                    loadingRing.style.display = "none";
                    playPauseButton.style.display = "block";
                    /*
                    if (!seekingLoad && !longTap && !seeking) {
                      hideVideoControls();
                    }*/

                      showVideoControls();

                    // reset the loader
                    setTimeout(function() {
                      resetLoad();
                    }, 10);

                  }, 1000);

                  loading = false;

                });
              }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);

            }).catch((err) => {

              console.log(err);

              statusIndicator.classList.remove("buffer");
              statusIndicator.classList.remove("smooth");
              statusIndicator.classList.add("error");

              endLoad();
                        
              setTimeout(function() {
                loadingRing.style.display = "none";
                playPauseButton.style.display = "block";
                /*
                if (!seekingLoad && !longTap && !seeking) {
                  hideVideoControls();
                }*/

                  showVideoControls();

                // reset the loader
                setTimeout(function() {
                  resetLoad();
                }, 10);

              }, 1000);

              loading = false;
            });
      
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
    });

    var videoProgressPercentile = 0,
        audioProgressPercentile = 0;

    video.addEventListener('timeupdate', function() {
        // audio.currentTime = video.currentTime;
        if (!qualityChange) {
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
    });

    audio.addEventListener("timeupdate", function() {
      audioProgressPercentile = (audio.currentTime / audio.duration);
      if (!qualityChange) {
        updatePositionState();
      }
    });

    // REF: https://stackoverflow.com/questions/5029519/html5-video-percentage-loaded, by Yann L.
    
    var videoLoadPercentile = 0,
        audioLoadPercentile = 0;

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
      
      // console.log(loadPercentage);

      videoLoadProgressBar.style.transform = `scaleX(${loadPercentage})`;

      /*
      if (videoLoadPercentile > audioLoadPercentile) {
        videoLoadProgressBar.style.transform = `scaleX(${audioLoadPercentile})`;
      } else {
        videoLoadProgressBar.style.transform = `scaleX(${videoLoadPercentile})`;
      }*/
  });

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
    
    // console.log(loadPercentage);

    // videoLoadProgressBar.style.transform = `scaleX(${loadPercentage})`;
    /*
    if (videoLoadPercentile === 1) {
      videoLoadProgressBar.style.transform = `scaleX(${audioLoadPercentile})`;
    }*/
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
            }
          }, 10);
          if (!video.paused && !document.fullscreenElement) {
            if (((firstTouchPlay && secondTouchPlay) || (!firstTouchPlay && !secondTouchPlay)) && (screen.orientation.angle === 0 || screen.orientation.angle === 180)) {
              video.requestPictureInPicture().then(function() {
                getScreenLock();
                pipEnabled = true;
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
      if (document.visibilityState === 'hidden') {
        video.style.objectFit = "";
        video.classList.remove("cover");
        if (!video.paused && !appUnload) {
            video.requestPictureInPicture().then(function() {
              getScreenLock();
              pipEnabled = true;
            });
        } else if (video.paused && !pipEnabled) {
          audio.volume = 0; // prevent accidental leakage 
        }
        backgroundPlay = true;
      } else {
        audio.volume = 1; 
        if (backgroundPlay) {
          if (!audio.paused && !pipEnabled) {

            liveBufferVal = [];
             liveBufferIndex = 0;
             bufferModeExe = false;
             bufferStartTime = 0;

            video.currentTime = audio.currentTime;
          }
          backgroundPlay = false;
        }
        if (!video.paused) {
            getScreenLock();
            document.exitPictureInPicture().then(function() {
              pipEnabled = false;
              releaseScreenLock(screenLock);
            });
            if (!loading && !videoLoad && !seeking && !seekingLoad && !longTap) {
              hideVideoControls();
            }
        } else if (video.paused && !videoEnd && video.src !== "" && videoPlay) {
          if (!loading && !videoLoad && !seeking && !seekingLoad && !longTap) {
            hideVideoControls();
          }
          // play the video (only when it hasn't ended)
          audio.play().then(function () {
            // audioCtx = new AudioContext();
            setTimeout(function() {
              video.play().then(function() {
                videoPause = true;
              }).catch((err) => {

                console.log(err);
                
                statusIndicator.classList.remove("buffer");
                statusIndicator.classList.remove("smooth");
                statusIndicator.classList.add("error");

                endLoad();
                          
                setTimeout(function() {
                  loadingRing.style.display = "none";
                  playPauseButton.style.display = "block";
                  /*
                  if (!seekingLoad && !longTap && !seeking) {
                    hideVideoControls();
                  }*/

                    showVideoControls();

                  // reset the loader
                  setTimeout(function() {
                    resetLoad();
                  }, 10);

                }, 1000);

                loading = false;

              });
            }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);

          }).catch((err) => {

            console.log(err);

            statusIndicator.classList.remove("buffer");
            statusIndicator.classList.remove("smooth");
            statusIndicator.classList.add("error");

            endLoad();
                      
            setTimeout(function() {
              loadingRing.style.display = "none";
              playPauseButton.style.display = "block";
              /*
              if (!seekingLoad && !longTap && !seeking) {
                hideVideoControls();
              }*/

                showVideoControls();

              // reset the loader
              setTimeout(function() {
                resetLoad();
              }, 10);

            }, 1000);

            loading = false;
          });
        }
      }
    };

    video.addEventListener('leavepictureinpicture', () => {
      pipEnabled = false;
    });

    setInterval(function() {
      if (document.pictureInPictureElement !== null) {
        pipEnabled = true;
      } else {
        pipEnabled = false;
      }
      if (document.visibilityState === "hidden" && !pipEnabled) {
        backgroundPlay = true;
      } else {
        backgroundPlay = false;
      }
    }, 1000/60);

    window.addEventListener('pagehide', function (event) {
      if (event.persisted) {
        // If the event's persisted property is `true` the page is about
        // to enter the Back-Forward Cache, which is also in the frozen state
        appUnload = null;
      } else {
        // If the event's persisted property is not `true` the page is about to be unloaded.
        appUnload = true;
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
