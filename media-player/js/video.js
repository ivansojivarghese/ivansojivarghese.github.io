
var videoInfoElm = {
  main: document.querySelector("#videoInfo"),
  title : document.querySelector("#videoInfo h5"),
  channelTitle : document.querySelector("#videoInfo p"),

  info : document.querySelector("#infoContainer"),

  videoTitle : document.querySelector("#infoContainer h5.videoTitle"),
  channelTitle2 : document.querySelector("#infoContainer p.channelTitle"),
  category : document.querySelector("#infoContainer p.category"),
  date : document.querySelector("#infoContainer p.date"),
  duration : document.querySelector("#infoContainer p.duration"),
  likes : document.querySelector("#infoContainer p.likes"),
  views : document.querySelector("#infoContainer p.views"),

  replay : document.querySelector("#infoContainer div.replay"),

  autoResBtn : document.querySelector("#infoContainer div.autoResBtn"),
  autoResLive : document.querySelector("#infoContainer p.autoResLive"),

  otherRes : document.querySelector("#infoContainer div.otherRes"),

  keywords : document.querySelector("#infoContainer div.keywords"),
  description : document.querySelector("#infoContainer div.description p")
};
    
var videoDetails;
var videoSubmit;

var subDetails;
var metaDetails;

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

var failTimes = 0;
var maxFailTimes = 5;


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

var imagePrimary = [];
var imagePalette = [];
var imageAmbientChange = false;

var oldImagePrimary = [0, 0, 0];
var oldImagePalette = [
  [0, 0, 0]
];

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
                                        // videoSec.play();

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
                              // videoSec.pause();

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
                            // videoSec.src = "";

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
                                        // videoSec.currentTime = details.seekTime;
                                        audio.currentTime = details.seekTime;
                                      }
                                      updatePositionState();
                                    }
                                  }],
  ['enterpictureinpicture', () => { video.requestPictureInPicture().then(function() {
                                      if (backgroundPlay && audio.src) {
                                        video.currentTime = audio.currentTime;
                                        // videoSec.currentTime = audio.currentTime;
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

function checkDuplicateQuality(arr, q) {
  var res = false;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].qualityLabel.indexOf(q) !== -1) {
      res = true;
      break;
    }
  }
  return res;
}

// Usage example
const panel = videoInfoElm.info;
setupSwipeToClose(panel, () => {
  console.log("videoInfo closed!");
  closeVideoInfo();
  panel.style.transform = "none"; // Or any close action you prefer
}); 

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
      if (((result.supported && result.smooth && result.powerEfficient) || (result.supported && videoSources[i].height < videoHDmin) || (!result.supported && !result.smooth && !result.powerEfficient) || true) && !checkDuplicateQuality(supportedVideoSources, videoSources[i].qualityLabel)) {
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

  downlinkArr = [];
  downlinkVariability = {};
}

async function getParams(id, time) {

  if (!networkError) {

    // videoInfoElm.main.style.opacity = 0;

    let params = new URLSearchParams(document.location.search);
    var link = params.get("description"); 

    if (localStorage.getItem("mediaURL") !== null && link === null && videoURL === "" && !autoLoad) {
      link = localStorage.getItem("mediaURL");
      time = Number(localStorage.getItem("timestamp"));

      autoLoad = true;
    } else {

      autoLoad = false;
    }

    if (videoURL === "") {
      videoURL = link;
    } 

    if (videoErr || audioErr) {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ action: 'closeErrorNotification', tag: "playbackError" });
      }
    }

    /*
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
    targetVideo = null;
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
    */

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

          if (video.src === "") {
            playPauseButton.classList.remove('playing');
            playPauseButton.title = "Play";
          }

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

          if (video.src === "") {
            playPauseButton.classList.remove('playing');
            playPauseButton.title = "Play";
          }

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
    
    // videoLoadLoop = setInterval(function() {
      if ((link !== null || videoSubmit) && countryAPIres.online) {

      // clearInterval(videoLoadLoop);

      // PRELOAD HERE
      // START LOAD
      clearTimeout(controlsHideInt);
      controlsHideInt = null;

      getScreenLock();

      loading = true;
      loadingRing.style.display = "block";
      playPauseButton.style.display = "none";

      showVideoControls();

      // LIKES/VIEWS
      // API: https://rapidapi.com/ytjar/api/yt-api/playground/apiendpoint_73b163c4-7ffa-4ed7-b2cc-0665a3415f0b
      const urlMeta = 'https://yt-api.p.rapidapi.com/updated_metadata?id=' + videoID;
      const optionsMeta = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
          'x-rapidapi-host': 'yt-api.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(urlMeta, optionsMeta);
        metaDetails = await response.json();
        console.log(metaDetails);

      } catch (error) {
        console.error(error);
      }
      
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

      // NEW (VIDEO)
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

          failTimes++;

          if (!backgroundPlay) {
            video.pause();
            // videoSec.pause();
            audio.pause();
            console.log("video_pause");
          } else {
            audio.pause();
            console.log("audio_pause");
          }

          statusIndicator.classList.remove("buffer");
          statusIndicator.classList.remove("smooth");
          statusIndicator.classList.add("error");

          videoErr = true;
          audioErr = true;

          endLoad();
                  
          setTimeout(function() {
            loadingRing.style.display = "none";
            playPauseButton.style.display = "block";

            if (video.src === "") {
              playPauseButton.classList.remove('playing');
              playPauseButton.title = "Play";
            }

            if (targetVideo === null) {
              playPauseButton.classList.add('repeat');
              playPauseButton.title = "Replay";
            }

            /*
            if (!seekingLoad && !longTap && !seeking) {
              hideVideoControls();
            }*/

            showVideoControls();

            // reset the loader
            setTimeout(function() {
              resetLoad();

              /*
              if (failTimes < maxFailTimes) {
                inp.value = videoURL || localStorage.getItem("mediaURL");
                getURL();
              }*/

            }, 10);

          }, 1000);

          loading = false;

        } else {

          // failTimes = 0;

          videoFetchLoop = setInterval(function() {
            if (networkSpeed) {
              clearInterval(videoFetchLoop);

              ////////////////////

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
              targetVideo = null;
              initialVideoLoad = false;
              initialVideoLoadCount = 0;
              initialAudioLoad = false;
              specialQualityArea = [];
              videoErr = false;
              audioErr = false;
              playEvents = 0;
              audioVideoAlignDivisor = 3;
              downlinkArr = [];
              downlinkVariability = {};
              imagePrimary = [];
              imagePalette = [];

              lastMetadata = null; // Stores metadata of the previous frame
              activityScores = []; // Stores frame activity scores
              windowScores = [];   // Scores for aggregation over time
              avgActivityScore = 0; 
              derActivityScore = 0;
              derActivityScoreArr = []; 
              derActivityScoreData = {};

              failTimes = 0;
              videoLoop = false;

              autoRes = true;

              // COULD CHANGE | UNDETERMINED (TBA)
              priorityQuality = 0;
              targetQuality = 0;
              targetVideoIndex = 0;
              videoStreamScore = 0;

              //////////////////

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

          if (video.src === "") {
            playPauseButton.classList.remove('playing');
            playPauseButton.title = "Play";
          }

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

      // SUBTITLES
      // API: https://rapidapi.com/ytjar/api/yt-api/playground/apiendpoint_c31d500a-4a76-4ccb-8617-004ef40febb8 
      /*
      const urlSub = 'https://yt-api.p.rapidapi.com/subtitles?id=' + videoID + '&format=vtt';
      const optionsSub = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
          'x-rapidapi-host': 'yt-api.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(urlSub, optionsSub);
        subDetails = await response.json();
        console.log(subDetails);

        track.src = subDetails.subtitles["0"].url;
        track.srclang = subDetails.subtitles["0"].languageCode;
        track.label = subDetails.subtitles["0"].languageName;

      } catch (error) {
        console.error(error);
      }*/
        
      }

    // }, 100);

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

      var CVscore = derActivityScoreData.standardDeviation / derActivityScoreData.mean; // Coefficient of Variation 
      var optimum = 0;
      if (CVscore < 0.1) { // small variation
        optimum = 1;
      } else if (CVscore >= 0.1 && CVscore <= 0.2) { // moderate
        optimum = derActivityScoreData.mean * derActivityScoreData.standardDeviation;
      } else if (CVscore > 0.2) { // large
        optimum = derActivityScoreData.mean * (derActivityScoreData.standardDeviation / CVscore);
      }
      if (optimum < 1) {
        optimum = 1;
      }
      videoStreamScore = videoStreamScore * optimum;

      /*
      if (avgActivityScore > 1) {
        videoStreamScore = videoStreamScore * avgActivityScore;
      }*/

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

function getImageData(url) {
  const image = new Image();
  image.crossOrigin = 'Anonymous'; // Needed for cross-origin images
  image.src = 'https://api.allorigins.win/raw?url=' + url; // attaching a proxy URL infront to bypass CORS

  image.onload = () => {
      const colorThief = new ColorThief();

      imagePrimary = colorThief.getColor(image);
      imagePalette = colorThief.getPalette(image, 2);
  };
}
/*
function generateGradientRGB(imagePrimary, imagePalette) { // REFERENCED FROM CHATGPT
  // Validate input
  if (!imagePrimary.length || !imagePalette.length) {
      console.error("No colors provided!");
      return '';
  }

  var ori = (screen.orientation.angle === 0 || screen.orientation.angle === 180) ? '0' : '135'

  // Convert the primary color array to an rgb string
  const primaryColor = `rgb(${imagePrimary[0]}, ${imagePrimary[1]}, ${imagePrimary[2]})`;

  // Use the palette RGB values for additional gradient stops
  const gradientStops = imagePalette
      .map((rgb, index) => {
          const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`; // Directly construct rgb
          const position = ((index + 1) * (100 / imagePalette.length)).toFixed(2);
          return `${color} ${position}%`;
      })
      .join(', ');

  // Construct the CSS linear-gradient value
  return `linear-gradient(` + ori + `deg, ${primaryColor}, ${gradientStops})`;
}*/

function generateGradientRGB(imagePrimary, imagePalette) {
  // Validate input
  if (!imagePrimary || imagePrimary.length !== 3 || !imagePalette || imagePalette.length < 1) {
    console.error("Invalid colors provided!");
    return '';
  }

  // Determine orientation
  const ori = ((screen.orientation.angle === 0 || screen.orientation.angle === 180) && (screen.orientation.type === "portrait-primary" || screen.orientation.type === "portrait-secondary")) ? '0' : '135';

  // Convert primary color to an rgb string
  const primaryColor = `rgb(${imagePrimary[0]}, ${imagePrimary[1]}, ${imagePrimary[2]})`;

  // Function to calculate color distance
  const colorDistance = (color1, color2) => {
    return Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
  };

  // Sort the palette based on similarity to the primary color
  const sortedPalette = [...imagePalette].sort(
    (a, b) => colorDistance(imagePrimary, a) - colorDistance(imagePrimary, b)
  );

  // Build gradient stops
  const gradientStops = sortedPalette
    .map((rgb, index) => {
      const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      const position = ((index + 1) * (100 / sortedPalette.length)).toFixed(2);
      return `${color} ${position}%`;
    })
    .join(', ');

  // Construct the CSS linear-gradient value
  return `linear-gradient(${ori}deg, ${primaryColor}, ${gradientStops})`;
}

function generateSimpleGradient(primaryColor) {
  // Validate input
  if (!primaryColor || primaryColor.length !== 3) {
      console.error("Invalid primary color!");
      return '';
  }

  // Convert the primary color array to an rgb string
  const primaryColorString = `rgb(${primaryColor[0]}, ${primaryColor[1]}, ${primaryColor[2]})`;

  // Construct the gradient
  return `linear-gradient(0deg, rgb(0, 0, 0), ${primaryColorString} 50%, rgb(0, 0, 0))`;
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
      // await sourceCheck(j, true);
      sourceCheck(j, true);
    }
  })();

  (async function checkSupports() {
    for (j = 0; j < audioSources.length - 1; j++) { // CHECK FOR SUPPORTED audio SOURCES
      // await sourceCheck(j, false);
      sourceCheck(j, false);
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

        video.style.background = "";
        imageAmbientChange = true;
        
        video.src = targetVideo.url; 
        // videoSec.src = targetVideo.url; 
        // videoSec.src = supportedVideoSources[supportedVideoSources.length - 1].url;

        for (var j = supportedAudioSources.length - 1; j >= 0; j--) {
          if (supportedAudioSources[j].audioTrack) {
            if (supportedAudioSources[j].audioTrack.audioIsDefault) {
              audio.src = supportedAudioSources[j].url;
              break;
            }
          } else {
            audio.src = supportedAudioSources[j].url;
            break;
          }
        }

        // audio.src = supportedAudioSources[supportedAudioSources.length - 1].url;
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
          // videoSec.currentTime = time;
          audio.currentTime = time;
        }

        var thumbnailStr = videoDetails.thumbnail[videoDetails.thumbnail.length - 1].url
        getImageData(thumbnailStr);

        // mediaSessions API
        if ("mediaSession" in navigator) {

          var thumbnailExt = "";
          if (thumbnailStr.indexOf(".jpg") !== -1) {
            thumbnailExt = "jpg";
          } else if (thumbnailStr.indexOf(".png") !== -1) {
            thumbnailExt = "png";
          } else if (thumbnailStr.indexOf(".webp") !== -1) {
            thumbnailExt = "webp";
          }

          navigator.mediaSession.metadata = new MediaMetadata({
            title: videoDetails.title,
            artist: videoDetails.channelTitle,
            // album: '',
            artwork: [
              { src: thumbnailStr,   sizes: videoDetails.thumbnail[videoDetails.thumbnail.length - 1].width+'x'+videoDetails.thumbnail[videoDetails.thumbnail.length - 1].height, type: 'image/' + thumbnailExt }
            ]
          });
        
          // TODO: Update playback state.
        }

        // videoInfo
        videoInfoElm.title.innerHTML = videoDetails.title;
        videoInfoElm.channelTitle.innerHTML = videoDetails.channelTitle;

        // abstract other info
        abstractVideoInfo();

        // videoInfoElm.main.style.opacity = 1;

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

      if (video.src === "") {
        playPauseButton.classList.remove('playing');
        playPauseButton.title = "Play";
      }

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

function timeAgo(dateString) { // ISO8601 date string to human-readable string converter
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 60) {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}


function abstractVideoInfo() {

  videoInfoElm.keywords.style.display = "flex";
  videoInfoElm.description.style.display = "block";

  videoInfoElm.likes.style.display = "block";
  videoInfoElm.views.style.display = "block";

  videoInfoElm.videoTitle.innerHTML = '<a class="trs noUnderline" href="' + videoURL + '" target="_blank">' + videoDetails.title + '</a>';
  videoInfoElm.channelTitle2.innerHTML = '<a class="trs noUnderline" href="https://www.youtube.com/channel/' + videoDetails.channelId + '" target="_blank">' + videoDetails.channelTitle + '</a>';

  if (videoDetails.category) {
    videoInfoElm.category.style.display = "block";
    videoInfoElm.category.innerHTML = videoDetails.category;
  } else {
    videoInfoElm.category.style.display = "none";
  } 

  function formatCounts(likes, views) {
    // Helper function to format numbers
    function formatNumber(num) {
      if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + 'T+';
      if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
      if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
      return num.toString();
    }
  
    // Format likes and views
    const formattedLikes = formatNumber(likes);
    const formattedViews = formatNumber(views);
  
    // Return the formatted likes and views as an object
    return {
      likes: formattedLikes,
      views: formattedViews
    };
  }
  
  // Example usage
  const likes = Number(metaDetails.likeCount);
  const views = Number(metaDetails.viewCount);
  var meta = formatCounts(likes, views);
  var likesTxt = (likes === 1) ? " like" : " likes";
  var viewsTxt = (metaDetails.viewCountText.indexOf("watching now") !== -1) ? " watching now" : " views";

  videoInfoElm.date.innerHTML = timeAgo(videoDetails.uploadDate);
  videoInfoElm.duration.innerHTML = secondsToTimeCode(Number(videoDetails.lengthSeconds));

  if (meta.likes !== 'NaN') {
    videoInfoElm.likes.innerHTML = meta.likes + likesTxt;
  } else {
    videoInfoElm.likes.style.display = "none";
  }
  if (meta.views !== 'NaN') {
    videoInfoElm.views.innerHTML = meta.views + viewsTxt;
  } else {
    videoInfoElm.views.style.display = "none";
  }

  if (!videoInfoElm.autoResBtn.classList.contains("active")) {
    videoInfoElm.autoResBtn.classList.add("active");
  }
  videoInfoElm.autoResLive.innerHTML = qualityLabel(targetVideo.qualityLabel);

  videoLoop = false;
  videoInfoElm.replay.classList.remove("active");

  var otherResBtn = document.querySelectorAll(".otherResBtn");
  if (otherResBtn.length) {
    for (var k = 0; k < otherResBtn.length; k++) {
      otherResBtn[k].remove();
    }
  }

  for (var j = 0; j < supportedVideoSources.length; j++) {
    var d = document.createElement("div");
    var p = document.createElement("p");

    d.classList.add("otherResBtn", "resBtn", "trs");
    p.innerHTML = qualityLabel(supportedVideoSources[j].qualityLabel);

    d.addEventListener("click", function(event) {
      if (!event.currentTarget.classList.contains("active")) {
        autoRes = false;

        var label = qualityLabel(event.currentTarget.children[0].innerHTML);
        var index = 0;
        for (var b = 0; b < supportedVideoSources.length; b++) {
          if (label.indexOf(supportedVideoSources[b].qualityLabel) !== -1) {
            index = b;
            break;
          }
        }

        targetVideo = supportedVideoSources[index];
        targetVideoIndex = index;

        refSeekTime = video.currentTime;

        qualityBestChange = true;
        qualityChange = true;
        bufferAllow = false;

        video.pause();
        audio.pause(); // pause content

        console.log("load set");
        video.src = targetVideo.url; // 'loadstart'

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
              type: 'SET_VIDEO_URL',
              url: targetVideo.url, // Pass the extracted URL
            });
          });
        }

        videoInfoElm.autoResLive.innerHTML = "";
        var activeBtn = document.querySelector(".autoResBtn.active") || document.querySelector(".otherResBtn.active");
        activeBtn.classList.remove("active");
        event.currentTarget.classList.add("active");

        localStorage.setItem('videoURL', video.src); // Set URL to memory state
      }
    });

    d.appendChild(p);

    videoInfoElm.otherRes.appendChild(d);
  }

  var keywordsBtn = document.querySelectorAll(".keywordsBtn");
  if (keywordsBtn.length) {
    for (var k = 0; k < keywordsBtn.length; k++) {
      keywordsBtn[k].remove();
    }
  }

  if (videoDetails.keywords) {
    for (var b = 0; b < videoDetails.keywords.length; b++) {
      var d = document.createElement("div");
      var p = document.createElement("p");

      d.classList.add("keywordsBtn", "resBtn", "trs");
      p.innerHTML = videoDetails.keywords[b];

      d.addEventListener("click", function(event) {
        // ADD CODE TO DIRECTLY PERFORM A SEARCH BASED ON KEYWORD(S)

      });

      d.appendChild(p);

      videoInfoElm.keywords.appendChild(d);
    }
  } else {
    videoInfoElm.keywords.style.display = "none";
  }

  // Function to highlight hashtags or words starting with #_
  function highlightHashtags(text) {
    // Regular expression to match words starting with #_
    const hashtagRegex = /#\w+/g;

    // Replace hashtags with a span for styling or interactivity
    return text.replace(hashtagRegex, (hashtag) => {
      return `<a onclick="" class="trs hashtag">${hashtag}</a>`;
    });    
  }

  // Function to detect and format video timestamps
function formatTimestamps(text) {
  const timestampRegex = /\b(\d{1,2}:\d{2})(?::\d{2})?\b/g; // Matches timestamps like 1:23, 12:34, or 1:23:45
  return text.replace(timestampRegex, (timestamp) => {
    return `<span class="timestamp trs" data-time="${timestamp}">${timestamp}</span>`;
  });
}

  // Function to detect and replace URLs with a generic "Visit link"
function formatURLsToGenericLink(text) {
  // Match URLs, stopping before <br> or whitespace characters
  const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;
  return text.replace(urlRegex, (url) => {

    var el;
    const clickableURL = url.startsWith('http') ? url : `http://${url}`;

    // Use the matched URL directly
    fetchMetadataForURL(url)
    .then(({ title, favicon }) => {
      const displayTitle = title || 'Visit Link';
      const faviconURL = favicon || `https://www.google.com/s2/favicons?domain=${url}`;
      
      // Dynamically update the content (requires asynchronous handling in real DOM)
      el = `<a href="${clickableURL}" target="_blank" class="url trs trsButtons">
                <div class="img" style="background-image: url('${faviconURL}')"></div>
                <span>${displayTitle}</span>
              </a>`;
    })
    .catch((error) => {
      console.error('Error fetching metadata:', error);
    });

    return el;

    // return `<a href="${clickableURL}" target="_blank" class="url trs trsButtons"><div class="img"></div></a>`;
  });
}

async function fetchMetadataForURL(url) {
  await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch URL metadata: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.contents) {
        throw new Error('No contents found in the response');
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      const title = doc.querySelector('title')?.innerText || 'No title found';
      const favicon = doc.querySelector('link[rel~="icon"]')?.href || null;

      return { title, favicon };
    })
    .catch((error) => {
      console.error('Error fetching metadata:', error.message);
      return { title: 'Unavailable', favicon: null }; // Fallback values
    });
}


// Function to detect and link email addresses
function formatEmailLinks(text) {
  // Regular expression to match email addresses
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  return text.replace(emailRegex, (email) => {
    // Wrap the email in a mailto link
    return `<a href="mailto:${email}" class="email-link trs">${email}</a>`;
  });
}

// Function to detect and link valid international phone numbers
function formatPhoneNumbers(text) {
  // Regular expression to match phone numbers starting with "+"
  const phoneRegex = /(\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

  return text.replace(phoneRegex, (phone) => {
    // Normalize the phone number by removing spaces/dots/dashes
    const normalizedPhone = phone.replace(/[-.\s]/g, '');
    return `<a href="tel:${normalizedPhone}" class="phone-link trs">${phone}</a>`;
  });
}

// Combine all formatting functions
function formatDescription(text) {
  const textWithTimestamps = formatTimestamps(text); // Assuming formatTimestamps exists
  const textWithURLs = formatURLsToGenericLink(textWithTimestamps); // Assuming formatURLsToGenericLink exists
  const textWithEmails = formatEmailLinks(textWithURLs); // Assuming formatEmailLinks exists
  const textWithPhones = formatPhoneNumbers(textWithEmails);
  const textWithHashtags = highlightHashtags(textWithPhones); // Assuming highlightHashtags exists
  return textWithHashtags;
}

  var vidDes = videoDetails.description;

  if (videoDetails.description) {
    var formattedText = vidDes.replace(/\n/g, '<br>');
    var fullyFormattedText = formatDescription(formattedText);

    // Set the description with the fully formatted text
    videoInfoElm.description.innerHTML = fullyFormattedText;

    // Add event listeners to timestamps for interactivity
    const timestamps = videoInfoElm.description.querySelectorAll('.timestamp');
    timestamps.forEach((timestampElem) => {
      timestampElem.addEventListener('click', () => {
        const timeParts = timestampElem.dataset.time.split(':').map(Number);
        const seconds = timeParts.reduce((acc, part) => acc * 60 + part, 0);
        video.currentTime = seconds; // Assuming `videoPlayer` references your video element
        audio.currentTime = seconds;
      });
    });

  } else {
    videoInfoElm.description.style.display = "none";
  }
}

if (videoLoadLoop === null) {
  videoLoadLoop = setInterval(() => {

    if (countryAPIres.online) {

      clearInterval(videoLoadLoop);
      videoLoadLoop = null;
      
      getParams(null);

    }
  }, 100);
}