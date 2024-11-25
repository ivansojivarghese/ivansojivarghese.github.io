
    
var videoDetails;
var videoSubmit;

var videoSizeRatio = 0;

var videoFetchLoop = null;
var videoSupportLoop = null;

var videoSources = [];
var audioSources = [];

var supportedAudioSources = [];
var supportedVideoSources = [];
var targetVideoSources = [];
var targetVideo = null;
var targetVideoIndex = 0;

const videoQuality = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320]; // supports up to 8K video (for normal dimensions)
const videoQualityWidth = [256, 426, 640, 854, 1280, 1920, 2560, 3840, 7680]; // widths for above (for normal dim.)
var specialVideoQuality = []; 
var specialVideoQualityWidth = [];
var priorityQuality = 0;
var targetQuality = 0;

const videoHDmin = 720; 

var videoQualityArea = [];
var specialQualityArea = [];

var normalVideo = false;


for (i = 0; i < videoQuality.length; i++) {
  videoQualityArea[i] = videoQuality[i] * videoQualityWidth[i];
}

const rttGroupsArray = [100, 200, 375];
const downlinkRef = 10;
var rttScore = 0, // SCORE FROM 0-1 (low to high)
    rttGroup = 0,
    downlinkScore = 0,
    saveDataScore = 0,
    effectiveTypeScore = 0;

var videoStreamScore = 0;

var audioLatency = 0;
var audioLatencyArr = [];

var audioTimes = [];
var videoTimes = [];

var firstPlay = true;

var refSeekTime = 0;

var dpr = window.devicePixelRatio,
    dHeight = window.outerHeight,
    dWidth = window.outerWidth,
    dRes = dHeight * dWidth;

// REFERENCE: https://web.dev/articles/media-session

const actionHandlers = [
  ['play',          async () => { 
                                  if (videoPlay && !qualityChange && !qualityBestChange && (!videoRun || backgroundPlay) && !audioRun) {
                                    /*
                                    if (videoEnd) { 
                                      video.currentTime = 0;
                                      audio.currentTime = 0;
                                    } */
                                    if (!backgroundPlay || pipEnabled) {
                                      await video.play().then(function () {
                                        // audioCtx = new AudioContext();

                                        if (videoEnd) {
                                          videoEnd = false;
                                        }
                                        
                                        // setTimeout(function() {

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
                                    } else {
                                      await audio.play().then(function() {

                                        audio.volume = 1;

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
                      
                                    updatePositionState(); 

                                  }
                                }
  ],
  ['pause',         () => { 
                            if (!qualityBestChange && !qualityChange) {
                              audio.pause();
                              video.pause();

                              bufferStartTime = 0;
                              bufferEndTime = 0;

                              liveBufferVal = [];
                              liveBufferIndex = 0;
                              bufferModeExe = false;

                              releaseScreenLock(screenLock);

                              // videoPause = false;
                            }
                          }
  ],
  ['previoustrack', (details) => { if (!qualityBestChange && !qualityChange) { playPrevious(true); updatePositionState(); } }],
  /*['nexttrack',     () => { }],*/
  ['stop',          () => { video.src = ""; 

                            if ('serviceWorker' in navigator) {
                              navigator.serviceWorker.ready.then((registration) => {
                                registration.active.postMessage({
                                  type: 'SET_VIDEO_URL',
                                  url: '', // Pass the extracted URL
                                });
                              });
                            }
                                // Reset position state when media is reset.
                            navigator.mediaSession.setPositionState(null);
                            for (const [action] of actionHandlers) {
                              try {
                                navigator.mediaSession.setActionHandler(action, null);
                              } catch (error) {
                                console.log(`The media session action "${action}" is not supported yet.`);
                              }
                            } 
                          }],
  ['seekbackward',  (details) => { if (!qualityBestChange && !qualityChange && seekAllow) { seekBackward(true); updatePositionState(); } } ],
  ['seekforward',   (details) => { if (!qualityBestChange && !qualityChange && seekAllow) { seekForward(true); updatePositionState(); } } ],
  ['seekto',        (details) => { if (!qualityBestChange && !qualityChange && seekAllow && (!playPauseButton.classList.contains('repeat') || (playPauseButton.classList.contains('repeat') && ((details.seekTime < video.duration && !backgroundPlay) || (details.seekTime < audio.duration && backgroundPlay))))) {
                                      if (details.fastSeek && ('fastSeek' in video || ('fastSeek' in audio && backgroundPlay))) {
                                        // Only use fast seek if supported.
                                        if (backgroundPlay) {
                                          audio.fastSeek(details.seekTime);
                                        } else {
                                          video.fastSeek(details.seekTime);
                                          audio.fastSeek(details.seekTime);
                                        }
                                        return;
                                      }
                                      if (backgroundPlay) {
                                        audio.currentTime = details.seekTime;
                                      } else {
                                        video.currentTime = details.seekTime;
                                        audio.currentTime = details.seekTime;
                                      }
                                      updatePositionState();
                                    }
                                  }],
  ['enterpictureinpicture', () => { video.requestPictureInPicture().then(function() {
                                      if (backgroundPlay && audio.src) {
                                        video.currentTime = audio.currentTime;
                                      }
                                      pipEnabled = true;
                                      backgroundPlayManual = false;
                                      getScreenLock();
                                    }); 
                                  }]
  /* Video conferencing actions */
  /*['togglemicrophone', () => {  }],
  ['togglecamera',     () => {  }],
  ['hangup',           () => {  }],*/
  /* Presenting slides actions */
  /*['previousslide', () => {  }],
  ['nextslide',     () => {  }],*/
];

for (const [action, handler] of actionHandlers) {
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch (error) {
    console.log(`The media session action "${action}" is not supported yet.`);
  }
}

function replaceDoubleQuotes(str) {
  return str.replace(/"/g, "'");
}

function replaceSingleWithDoubleQuotes(str) {
  return str.replace(/'vp9'/, '"vp9"');
}

async function sourceCheck(i, m) {
  // var mime = replaceSingleWithDoubleQuotes(replaceDoubleQuotes(videoSources[i].mimeType));
  if (m) { // video
    var videoConfiguration = {
      type: "file",
      video: {
        contentType: videoSources[i].mimeType,
        width: videoSources[i].width,
        height: videoSources[i].height,
        bitrate: videoSources[i].bitrate,
        framerate: videoSources[i].fps,
      }
    };
    await navigator.mediaCapabilities.decodingInfo(videoConfiguration).then((result) => {
      if ((result.supported && result.smooth && result.powerEfficient) || (result.supported && video.height < videoHDmin)) {
        supportedVideoSources[supportedVideoSources.length] = videoSources[i];
      }
    });
  } else { // audio
    var audioConfiguration = {
      type: "file",
      audio: {
        contentType: audioSources[i].mimeType,
        channels: audioSources[i].audioChannels, 
        bitrate: audioSources[i].bitrate,
        samplerate: audioSources[i].audioSampleRate
      }
    };
    await navigator.mediaCapabilities.decodingInfo(audioConfiguration).then((result) => {
      if (result.supported && result.smooth && result.powerEfficient) {
        supportedAudioSources[supportedAudioSources.length] = audioSources[i];
      }
    });
  }
}

function resetVariables() {
  // VARIABLE ACROSS DIFF. VIDEO SOURCES WITHIN A VIDEO FILE
  clearInterval(bufferingCountLoop);
  bufferingCountLoop = null;
  bufferCount = 0;
  bufferingCount = [];
  bufferingTimes = [];
  bufferStartTime = 0;
  bufferEndTime = 0;
  bufferMode = false;
  firstPlay = true;
  refSeekTime = 0;

  liveBufferVal = [];
  liveBufferIndex = 0;
  bufferModeExe = false;

  frameArr = [];
  framesStuck = false;
}

async function getParams(id, time) {

  if (!networkError) {

    let params = new URLSearchParams(document.location.search);
    var link = params.get("description"); 

    if (localStorage.getItem("mediaURL") !== null && link === null && videoURL === "") {
      link = localStorage.getItem("mediaURL");
      time = Number(localStorage.getItem("timestamp"));

      autoLoad = true;
    }

    if (videoURL === "") {
      videoURL = link;
    } 

    if (videoErr || audioErr) {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'closeErrorNotification', tag: "playbackError" });
      }
    }

    resetVariables();

    // FIXED (VARIABLE ACROSS DIFF. VIDEOS ONLY)
    videoSources = [];
    audioSources = [];
    specialVideoQuality = [];
    specialVideoQualityWidth = [];
    supportedVideoSources = [];
    supportedAudioSources = [];
    targetVideoSources = [];
    audioTimes = [];
    videoTimes = [];
    audioLatency = 0;
    audioLatencyArr = [];
    // targetVideo = null;
    initialVideoLoad = false;
    initialVideoLoadCount = 0;
    initialAudioLoad = false;
    specialQualityArea = [];
    videoErr = false;
    audioErr = false;

    // COULD CHANGE | UNDETERMINED (TBA)
    priorityQuality = 0;
    targetQuality = 0;
    targetVideoIndex = 0;
    videoStreamScore = 0;

    if (link !== null && id === null) {

      if (!time) {
        time = Number(link.slice(link.indexOf("&t=") + 3)); // START FROM (in sec.)
      }
      
      // NO ACCESS TO SHORTS, LIVE, ATTRIBUTED OR EMBEDDED VIDEOS
      if (!link.includes("embed") && !link.includes("attribution_link") && !link.includes("shorts")) {
      
      if (link.includes("youtube.com") && !link.includes("m.youtube.com")) {
        
        // video.classList.remove("error");
        // video.style.border = "0.15rem solid #A10000";
      
        var sIndex = link.indexOf("v=");
        var eIndex = link.indexOf("&");
        var sTrue;
        
        if (sIndex !== -1) {
          sTrue = true;
          if (eIndex === -1 && eIndex > sIndex) {
            var eIndex = link.indexOf("#");
            if (eIndex === -1) {
              eIndex = link.length;
            }
          } else if (eIndex < sIndex) {
            eIndex = link.length;
          }
        } else {
          sTrue = false;
          sIndex = link.lastIndexOf("/");
          eIndex = link.indexOf("?");
          if (eIndex === -1) {
            eIndex = link.length;
          }
        }
        
        var id = link.substring(sIndex, eIndex);
        if (sTrue) {
          var videoID = id.substring(2, id.length);
        } else {
          var videoID = id.substring(1, id.length);
        }

        // let params = new URLSearchParams(link);
        
      } else if (link.includes("m.youtube.com")) {
        
        // video.classList.remove("error");
        // video.style.border = "0.15rem solid #A10000";
        
        var sIndex = link.indexOf("v=");
        var eIndex = link.indexOf("&");
        var sTrue;
        
        if (sIndex !== -1) {
          sTrue = true;
          if (eIndex === -1 && eIndex > sIndex) {
            var eIndex = link.indexOf("#");
            if (eIndex === -1) {
              eIndex = link.length;
            }
          } else if (eIndex < sIndex) {
            eIndex = link.length;
          }
        } else {
          sTrue = false;
          sIndex = link.lastIndexOf("/");
          eIndex = link.indexOf("?");
          if (eIndex === -1) {
            eIndex = link.length;
          }
        }
        
        var id = link.substring(sIndex, eIndex);
        if (sTrue) {
          var videoID = id.substring(2, id.length);
        } else {
          var videoID = id.substring(1, id.length);
        }
          
      } else if (link.includes("youtu.be")) {
        
        // video.classList.remove("error");
        // video.style.border = "0.15rem solid #A10000";
        
        var sIndex = link.indexOf("e/");
        var eIndex = link.indexOf("?");
        var sTrue;
        
        if (sIndex === -1) {
          sTrue = false;
          sIndex = link.lastIndexOf("/");
          eIndex = link.indexOf("?");
          if (eIndex === -1) {
            eIndex = link.indexOf("&");
            if (eIndex === -1) {
              eIndex = link.length;
            }
          }
        } else {
          sTrue = true;
          if (eIndex === -1) {
            eIndex = link.indexOf("&");
            if (eIndex === -1) {
              eIndex = link.length;
            }
          }
        }
        
        var id = link.substring(sIndex, eIndex);
        if (sTrue) {
          var videoID = id.substring(2, id.length);
        } else {
          var videoID = id.substring(1, id.length);
        }
      } else {
        
        statusIndicator.classList.remove("buffer");
        statusIndicator.classList.remove("smooth");
        statusIndicator.classList.add("error");

        endLoad();
                  
        setTimeout(function() {
          loadingRing.style.display = "none";
          playPauseButton.style.display = "block";
          playPauseButton.classList.remove('playing');

          if (!seekingLoad && !longTap && !seeking) {
            hideVideoControls();
          }

          // reset the loader
          setTimeout(function() {
            resetLoad();
          }, 10);

        }, 1000);

        loading = false;
      }
      } else {
        
        statusIndicator.classList.remove("buffer");
        statusIndicator.classList.remove("smooth");
        statusIndicator.classList.add("error");

        endLoad();
                  
        setTimeout(function() {
          loadingRing.style.display = "none";
          playPauseButton.style.display = "block";
          playPauseButton.classList.remove('playing');

          if (!seekingLoad && !longTap && !seeking) {
            hideVideoControls();
          }

          // reset the loader
          setTimeout(function() {
            resetLoad();
          }, 10);

        }, 1000);

        loading = false;
      }
      
      console.log("Video ID: " + videoID);
      
    } else if (id) {
      
      var videoID = id;
      
    } 
    
    if ((link !== null || videoSubmit) && countryAPIres.online) {

    // PRELOAD HERE
    // START LOAD
    clearTimeout(controlsHideInt);
    controlsHideInt = null;

    getScreenLock();

    loading = true;
    loadingRing.style.display = "block";
    playPauseButton.style.display = "none";

    showVideoControls();
    
    // REFERENCE: https://rapidapi.com/ytjar/api/ytstream-download-youtube-videos

    // OLD
    // API: https://rapidapi.com/ytjar/api/ytstream-download-youtube-videos/playground/endpoint_b308f78f-0faa-407a-902a-7afcd88c6a88
    /*
    const url = 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=' + videoID;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
        'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
      }
    };
    */

    // NEW
    // API: https://rapidapi.com/ytjar/api/yt-api/playground/endpoint_facba415-c341-4af1-b542-6f17c9fc464a
    const url = 'https://yt-api.p.rapidapi.com/dl?id=' + videoID + '&cgeo=' + countryAPIres.country;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
        'x-rapidapi-host': 'yt-api.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      videoDetails = await response.json();
      console.log(videoDetails);
      
      // video.src = videoDetails.formats["0"].url;

      if (videoDetails.status === "fail" || videoDetails.status === "processing" || videoDetails.error !== undefined || videoDetails.isLive) {

        if (!backgroundPlay) {
          video.pause();
          console.log("video_pause");
        } else {
          audio.pause();
          console.log("audio_pause");
        }

        statusIndicator.classList.remove("buffer");
        statusIndicator.classList.remove("smooth");
        statusIndicator.classList.add("error");

        endLoad();
                
        setTimeout(function() {
          loadingRing.style.display = "none";
          playPauseButton.style.display = "block";
          playPauseButton.classList.remove('playing');

          if (targetVideo === null) {
            playPauseButton.classList.add('repeat');
          }

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

      } else {
        videoFetchLoop = setInterval(function() {
          if (networkSpeed) {
            clearInterval(videoFetchLoop);

            getOptimalVideo(time);
          }
        }, 10);
      }

    } catch (error) {
      console.error(error);
      
      statusIndicator.classList.remove("buffer");
      statusIndicator.classList.remove("smooth");
      statusIndicator.classList.add("error");

      endLoad();
                
      setTimeout(function() {
        loadingRing.style.display = "none";
        playPauseButton.style.display = "block";
        playPauseButton.classList.remove('playing');

        if (!seekingLoad && !longTap && !seeking) {
          hideVideoControls();
        }

        // reset the loader
        setTimeout(function() {
          resetLoad();
        }, 10);

      }, 1000);

      loading = false;


    }
      
    }

  }
}

function getDeviceResolution() {
  const width = window.screen.width;
  const height = window.screen.height;

  return {
    width: width,
    height: height
  };
}

function getOptimalQuality() {

  // REFERENCE: https://www.highspeedinternet.com/resources/how-internet-connection-speeds-affect-watching-hd-youtube-videos#:~:text=It%20is%20possible%20to%20watch,the%20quality%20of%20the%20video). 
      // REFERENCE: https://support.google.com/youtube/answer/78358?hl=en 
      // REFERENCE: https://support.google.com/youtube/answer/1722171?hl=en&authuser=0#zippy=%2Cbitrate 

      // REORDER SUPPORTED VIDEOS BASED ON PRIORITY OF (FASTEST) NETWORK SPEEDS

      ////

      // POINTS TO CHECK:
      // Device resolution (portrait and/or landscape - combined)
      // Device DPR (device-pixel-ratio)

      ////

      ////

      var tempQuality = 0;

      var screenPixels = dWidth * dHeight * dpr * (dWidth / dHeight); // measure points on screen

      // COMPARE screenPixels with ""Area arrays above 

      for (var i = 0; i < videoQualityArea.length; i++) { // 9 elements

        // console.log(screenPixels + ", " + videoQualityArea[i]);

        if (screenPixels >= videoQualityArea[i] && (!videoQualityArea[i + 1] || (videoQualityArea[i + 1] && (screenPixels < videoQualityArea[i + 1])))) {
          priorityQuality = i;
          break;
        }
      }

      // console.log(priorityQuality);

      /////
      /*
      if (networkSpeed < 0.5) {
        // SD - 144p
        priorityQuality = 0;
        
      } else if (networkSpeed >= 0.5 && networkSpeed < 0.7) {
        // SD - 240p
        priorityQuality = 1;
        
      } else if (networkSpeed >= 0.7 && networkSpeed < 1.1) {
        // SD - 360p
        priorityQuality = 2;
        
      } else if (networkSpeed >= 1.1 && networkSpeed < 2.5) {
        // SD - 480p
        priorityQuality = 3;
        
      } else if (networkSpeed >= 2.5 && networkSpeed < 5) {
        // HD - 720p
        priorityQuality = 4;

      } else if (networkSpeed >= 5 && networkSpeed < 10) {

        // HD - 1080p
        priorityQuality = 5;

        // CHOOSE THE SOURCES THAT MATCH THIS RES.

        // CHOOSE A FILE WITH THE HIGHEST BITRATE READINGS, ETC.

      } else if (networkSpeed >= 10 && networkSpeed < 20) {
        // 2K - 1440p
        priorityQuality = 6;
        
      } else if (networkSpeed >= 20 && networkSpeed < 100) {
        // 4K - 2160p
        priorityQuality = 7;
        
      } else {
        // 8K - 4320p
        priorityQuality = 8;
        
      }*/

      // MODIFY priorityQuality based on Network Speed and Bandwidth

      const quality = determineNetworkQuality(networkSpeed, networkBandwidth, rttVal, jitterVal, packetLossVal);
      networkQuality = quality;
      switch (networkQuality) {
        case 'Very Good':
          networkQualityRange = 1;
        break;
        case 'Good':
          networkQualityRange = 0.75;
        break;
        case 'Average':
          networkQualityRange = 0.5;
        break;
        case 'Bad':
          networkQualityRange = 0.25;
        break;
        case 'Very Bad':
          networkQualityRange = 0;
        break;
      }
      // console.log('Network Quality:', quality);  

      //////////////

      if (navigator.connection) {
        // GET RTT SCORE
        if (rtt <= rttGroupsArray[0]) { // 0 - 100
          rttGroup = 3;
        } else if (rtt <= rttGroupsArray[1]) { // >100 - 200
          rttGroup = 2;
        } else if (rtt <= rttGroupsArray[2]) { // >200 - 375
          rttGroup = 1;
        } else if (rtt > rttGroupsArray[2]) { // >375
          rttGroup = 1;
        }
        rttScore = 1 - ((rtt / rttGroupsArray[2]) / rttGroup);
        if (rttScore < 0) {
          rttScore = 0;
        }

        // DOWNLINK SCORE
        downlinkScore = downlink / downlinkRef;

        // SAVEDATA SCORE
        saveDataScore = saveData ? 0.8 : 1;

        // EFFECTIVE TYPE SCORE
        switch (effectiveType) {
          case "4g":
            effectiveTypeScore = 1.25;
          break;
          case "3g":
            effectiveTypeScore = 1;
          break;
          case "2g":
            effectiveTypeScore = 0.75;
          break;
          case "slow-2g":
            effectiveTypeScore = 0.5;
          break;
        }
      }

      // FINAL SCORE
      if (navigator.connection) {
        videoStreamScore = rttScore * downlinkScore * saveDataScore * effectiveTypeScore * networkQualityRange;
        videoStreamScore = (videoStreamScore > 1) ? 1 : videoStreamScore;
      } else {
        videoStreamScore = networkQualityRange;
      }

      // TARGET QUALITY
      if (initialVideoLoadCount === 0) {
        targetQuality = Math.round(videoStreamScore * priorityQuality);
        if (targetQuality > (videoQuality.length - 1)) {
          targetQuality = videoQuality.length - 1;
        }
      } else {
        tempQuality = Math.round(videoStreamScore * priorityQuality);
        if (tempQuality > (videoQuality.length - 1)) {
          tempQuality = videoQuality.length - 1;
        }
      }
      if (initialVideoLoadCount === 0) {
        return targetQuality;
      } else {
        return tempQuality;
      }
}

function checkResolutions() {

  targetVideoSources = supportedVideoSources;

  for (i = 0; i < targetVideoSources.length; i++) { // CHECK IF VIDEO HAS NORMAL RES. (HEIGHT)
    if (videoQuality.includes(targetVideoSources[i].height)) {
      normalVideo = true;
      break;
    }
  }

  if (!normalVideo) {
    for (j = 0; j < targetVideoSources.length; j++) {
      if (!specialVideoQuality.includes(targetVideoSources[j].height)) {
        specialVideoQuality[specialVideoQuality.length] = targetVideoSources[j].height; 
        specialVideoQualityWidth[specialVideoQualityWidth.length] = targetVideoSources[j].width; 

        specialQualityArea[specialQualityArea.length] = targetVideoSources[j].height * targetVideoSources[j].width;
      }
    }
  }
}

function getVideoFromIndex(m, q, r) {

  // GET THE VIDEO
  var mod = 0;
  var reverse = false;
  var fetchedSources = [];
  var normalVid = false;

  targetVideoSources = supportedVideoSources;

  for (i = 0; i < targetVideoSources.length; i++) { // CHECK IF VIDEO HAS NORMAL RES. (HEIGHT)
    if (videoQuality.includes(targetVideoSources[i].height)) {
      normalVid = true;
      break;
    }
  }

  if (!normalVid) {
    var specialQuality = 0;
    for (j = 0; j < targetVideoSources.length; j++) {
      if (!specialVideoQuality.includes(targetVideoSources[j].height)) {
        specialVideoQuality[specialVideoQuality.length] = targetVideoSources[j].height; 
        specialVideoQualityWidth[specialVideoQualityWidth.length] = targetVideoSources[j].width; 

        specialQualityArea[specialQualityArea.length] = targetVideoSources[j].height * targetVideoSources[j].width;
      }
    }
    specialVideoQuality.reverse();
    specialVideoQualityWidth.reverse();

    specialQualityArea.reverse();
  }

  if (m) {

    var compareIndex = -1;

    while (targetVideoSources[compareIndex] === undefined) {

      if (!normalVid) {
        specialQuality = Math.round(((q + mod) / (videoQuality.length - 1)) * (specialVideoQuality.length - 1));
      }
      for (i = 0; i < targetVideoSources.length; i++) {
        if ((normalVid && (targetVideoSources[i].height === videoQuality[q + mod]))) {

          var val = q + mod;
          var point = Math.floor((val / (videoQuality.length - 1)) * targetVideoSources.length);
          if (!point) {
            point = 1;
          }
          compareIndex = targetVideoSources.length - point;

          break;

        } else if ((!normalVid && (targetVideoSources[i].height === specialVideoQuality[specialQuality]))) {

          var val = specialQuality;
          var point = Math.floor((val / (videoQuality.length - 1)) * targetVideoSources.length);
          if (!point) {
            point = 1;
          }
          compareIndex = targetVideoSources.length - point;

          break;
        }
      }

      if (targetVideoSources[compareIndex] === undefined) {

        var quality = normalVid ? q + mod : specialQuality;
        fetchedSources[fetchedSources.length] = normalVid ? q + mod : specialQuality;

        if ((quality) > 0 && !reverse) {
          mod--;
        } else {
          if (!reverse) {
            mod = 1;
            reverse = true;
          } else {
            mod++;
          }
        }
      }

    }

    return compareIndex;

  } else {
    while (targetVideo === null) {

      // console.log("null1");

      if (!normalVid) {
        specialQuality = Math.round(((targetQuality + mod) / (videoQuality.length - 1)) * (specialVideoQuality.length - 1));
      }
      for (i = 0; i < targetVideoSources.length; i++) {
        if ((normalVid && (targetVideoSources[i].height === videoQuality[targetQuality + mod]))) {
          
          targetVideo = targetVideoSources[i];
          targetVideoIndex = i;
          /*
          if (r) {
            var mod2 = 0;
            do {
              targetVideo = targetVideoSources[i + mod2];
              targetVideoIndex = i + mod2;
              mod2++;
            } while (targetVideoSources[i + mod2] && targetVideoSources[i + (mod2 - 1)].height === targetVideoSources[i].height);
          }
          */
          break;
        } else if ((!normalVid && (targetVideoSources[i].height === specialVideoQuality[specialQuality]))) {

          // targetVideo = typeof targetVideoSources[targetQuality + mod] === undefined ? null : targetVideoSources[targetQuality + mod];
          targetVideo = targetVideoSources[i];
          targetVideoIndex = i;
          /*
          if (r) {
            var mod2 = 0;
            do {
              targetVideo = targetVideoSources[i + mod2];
              targetVideoIndex = i + mod2;
              mod2++;
            } while (targetVideoSources[i + mod2] && targetVideoSources[i + (mod2 - 1)].height === targetVideoSources[i].height);
          }
          */
          break;
        }
      }
      // console.log(targetQuality + mod);
      if (targetVideo === null) {

        // console.log("null2");

        var quality = normalVid ? targetQuality + mod : specialQuality;
        fetchedSources[fetchedSources.length] = normalVid ? targetQuality + mod : specialQuality;
        if ((quality) > 0 && !reverse) {
          mod--;
        } else {
          if (!reverse) {
            mod = 1;
            reverse = true;
          } else {
            mod++;
          }
        }

      }
    }
  }
}

function getOptimalVideo(time) {

  // IDENTIFY VIDEO AND AUDIO SOURCES IN THE FETCH ARRAY RESULT

  if (videoDetails.error === undefined) {

  for (i = 0; i <= videoDetails.adaptiveFormats.length - 1; i++) {
    if (videoDetails.adaptiveFormats[i].audioQuality === undefined) { // video
      videoSources[videoSources.length] = videoDetails.adaptiveFormats[i];
    } else { // audio
      audioSources[audioSources.length] = videoDetails.adaptiveFormats[i];
    }
  }

  (async function checkSupports() {
    for (j = 0; j < videoSources.length - 1; j++) { // CHECK FOR SUPPORTED video SOURCES
      await sourceCheck(j, true);
    }
  })();

  (async function checkSupports() {
    for (j = 0; j < audioSources.length - 1; j++) { // CHECK FOR SUPPORTED audio SOURCES
      await sourceCheck(j, false);
    }
  })();

  videoSupportLoop = setInterval(function() {

    if (supportedVideoSources.length && supportedAudioSources.length) {

      clearInterval(videoSupportLoop);

      checkResolutions();

      setTimeout(function() {

        getOptimalQuality();

        getVideoFromIndex(false, null, true);

        // targetVideo = targetVideoSources[0];  // FOR TESTING
        // getMediaSources(targetVideoSources);
        
        video.src = targetVideo.url; 
        audio.src = supportedAudioSources[supportedAudioSources.length - 1].url;
        // audio.src = videoDetails.adaptiveFormats[videoDetails.adaptiveFormats.length - 1].url;

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
              type: 'SET_VIDEO_URL',
              url: targetVideo.url, // Pass the extracted URL
            });
          });
        }

        localStorage.setItem('mediaURL', videoURL); // Set URL to memory state
        localStorage.setItem('videoURL', video.src); // Set URLs to memory state
        localStorage.setItem('audioURL', audio.src); // 

        video.load();
        audio.load();

        if (time) { // START FROM (if available)
          video.currentTime = time;
          audio.currentTime = time;
        }

        // mediaSessions API
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: videoDetails.title,
            artist: videoDetails.channelTitle,
            // album: '',
            artwork: [
              { src: videoDetails.thumbnail[videoDetails.thumbnail.length - 1].url,   sizes: videoDetails.thumbnail[videoDetails.thumbnail.length - 1].width+'x'+videoDetails.thumbnail[videoDetails.thumbnail.length - 1].height, type: 'image/jpg' }
            ]
          });
        
          // TODO: Update playback state.
        }

      }, 100);
    }

  }, 10);

  } else {

    // error

    statusIndicator.classList.remove("buffer");
    statusIndicator.classList.remove("smooth");
    statusIndicator.classList.add("error");

    endLoad();
              
    setTimeout(function() {
      loadingRing.style.display = "none";
      playPauseButton.style.display = "block";
      playPauseButton.classList.remove('playing');

      if (!seekingLoad && !longTap && !seeking) {
        hideVideoControls();
      }

      // reset the loader
      setTimeout(function() {
        resetLoad();
      }, 10);

    }, 1000);

    loading = false;
  }

  }
/*
function getMediaSources(sources) {
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);

  let sourceBuffer;
  const resolutions = {};

  for (var i = 0; i <= sources.length - 1; i++) {
    // resolutions[sources[i].qualityLabel] = sources[i].url;
    resolutions[sources[i].resolution] = sources[i].download;
  }

  // let currentResolution = targetVideo.qualityLabel;  // Default to initial
  let currentResolution = targetVideo.resolution;  // Default to initial
  let fetchVideoSegment = async (url) => {
    return fetch(url).then(response => response.arrayBuffer());
  };

  mediaSource.addEventListener('sourceopen', function () {
    sourceBuffer = mediaSource.addSourceBuffer(targetVideo.mimeType);
    fetchAndAppend(resolutions[currentResolution]);

    // Monitor buffer and decide to switch resolution
    monitorNetworkAndSwitch();
  });

  function fetchAndAppend(url) {
    fetchVideoSegment(url)
      .then(data => {
        if (!sourceBuffer.updating) {
          sourceBuffer.appendBuffer(data);
        }
      });
  }

  // Monitor network conditions and switch resolution
  function monitorNetworkAndSwitch() {
    setInterval(() => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const bandwidth = connection ? connection.downlink : 10;  // Example: 10 Mbps default if unknown

      let desiredResolution;

      if (bandwidth > 5) {
        desiredResolution = '1080p';  // High bandwidth
      } else if (bandwidth > 2) {
        desiredResolution = '720p';   // Medium bandwidth
      } else {
        desiredResolution = '480p';   // Low bandwidth
      }

      if (desiredResolution !== currentResolution) {
        switchResolution(desiredResolution);
      }
    }, 5000);  // Check every 5 seconds
  }

  function switchResolution(newResolution) {
    if (sourceBuffer.updating) return;

    // Stop playback and clear the buffer
    video.pause();
    sourceBuffer.remove(0, mediaSource.duration);

    sourceBuffer.addEventListener('updateend', () => {
      // Once the buffer is cleared, append new data
      fetchAndAppend(resolutions[newResolution]);
      currentResolution = newResolution;

      // Resume playback once the new resolution segment is appended
      video.play();
    }, { once: true });
  }
}
*/

getParams(null);