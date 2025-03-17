
var videoInfoElm = {
  main: document.querySelector("#videoInfo"),
  title : document.querySelector("#videoInfo h5"),
  channelTitle : document.querySelector("#videoInfo p"),

  info : document.querySelector("#infoContainer"),
  infoHead : document.querySelector("#infoContainer .head"),

  videoTitle : document.querySelector("#infoContainer h5.videoTitle"),
  channelTitle2 : document.querySelector("#infoContainer p.channelTitle"),
  category : document.querySelector("#infoContainer p.category"),
  date : document.querySelector("#infoContainer p.date"),
  duration : document.querySelector("p.duration"),
  expires : document.querySelector("p.expires"),
  likes : document.querySelector("#infoContainer p.likes"),
  views : document.querySelector("#infoContainer p.views"),

  replay : document.querySelector("#infoContainer div.replay"),
  radio : document.querySelector("#infoContainer div.radio"),
  cast : document.querySelector("#infoContainer div.cast"),
  gCast : document.querySelector("google-cast-launcher"),

  autoResBtn : document.querySelector("#infoContainer div.autoResBtn"),
  autoResLive : document.querySelector("#infoContainer p.autoResLive"),

  otherRes : document.querySelector("#infoContainer div.otherRes"),

  keywords : document.querySelector("#infoContainer div.keywords"),
  description : document.querySelector("#infoContainer div.description p"),

  results : document.querySelector("#infoContainer div.wrapper.search div.results"),
  relatedResults : document.querySelector("#infoContainer div.wrapper.info div.results"),
  refinements : document.querySelector("#infoContainer div.wrapper.search div.refinements")
};
    
var preVideoDetails = null;
var videoDetails = null;
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

function capitalizeFirstChar(str) {
  if (typeof str !== "string" || str.length === 0) {
      return str; // Return as is if not a string or empty
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function videoReset() {
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
    readyForNext = false;

    autoRes = true;

    // COULD CHANGE | UNDETERMINED (TBA)
    priorityQuality = 0;
    targetQuality = 0;
    targetVideoIndex = 0;
    videoStreamScore = 0;
}

async function getParams(id, time, a, b) {

  if (!networkError) {

    // videoInfoElm.main.style.opacity = 0;

    let params = new URLSearchParams(document.location.search);
    var link = params.get("description"); 

    if (localStorage.getItem("mediaURL") !== null && link === null && videoURL === "" && !autoLoad) {
      link = localStorage.getItem("mediaURL");
      time = Number(localStorage.getItem("timestamp"));

      autoLoad = true;
    } else {

      if (!videoErr && !audioErr) {
        resetVideoInfo();
      }

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

        if (videoDetails !== null) {
          preVideoDetails = videoDetails;
        }

        videoDetails = await response.json();
        console.log(videoDetails);
        
        // video.src = videoDetails.formats["0"].url;

        if (videoDetails.status === "fail" || videoDetails.status === "processing" || videoDetails.error !== undefined || videoDetails.isLive) {

          videoDetails = preVideoDetails;
          if (!searchQueried) { // if not query/url searching
            loadingSpace.style.display = "";
            videoInfoElm.info.style.overflow = "";
          }

          if (videoDetails.error !== undefined) {
            var ntfTitle = (videoDetails.status === "fail" || videoDetails.status === "processing") ? "Loading has failed" : capitalizeFirstChar(videoDetails.status),
              ntfBody =  (videoDetails.status === "fail" || videoDetails.status === "processing") ? "Try again." : capitalizeFirstChar(videoDetails.error),
              ntfBadge = "https://ivansojivarghese.github.io/media-sphere/play_maskable_monochrome_409.png",
              ntfIcon = "https://ivansojivarghese.github.io/media-sphere/png/error.png";

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
                      url :  "https://ivansojivarghese.github.io/media-sphere/"
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
                    url :  "https://ivansojivarghese.github.io/media-sphere/"
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
          }

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

              videoReset();

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
              */
              //////////////////

              getOptimalVideo(time, a, b);
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
      CVactivityScore = CVscore;

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

function getOptimalVideo(time, a, b) {

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
        
        if (!casted) {
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
        }

        // audio.src = supportedAudioSources[supportedAudioSources.length - 1].url;
        // audio.src = videoDetails.adaptiveFormats[videoDetails.adaptiveFormats.length - 1].url;

        // videoInfoElm.cast.setAttribute("onclick", "castVideoWithAudio('" + video.src + "', '" + audio.src + "')");
        videoInfoElm.cast.setAttribute("onclick", "castVideoWithAudio('" + videoDetails.formats["0"].url + "')");

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
              type: 'SET_VIDEO_URL',
              url: targetVideo.url, // Pass the extracted URL
            });
          });
        }

        var diffVideo = false;
        if (videoURL !== localStorage.getItem("mediaURL")) {
          refSeekTime = 0;
          localStorage.setItem('timestamp', refSeekTime);
          diffVideo = true;
        }

        localStorage.setItem('mediaURL', videoURL); // Set URL to memory state
        localStorage.setItem('videoURL', video.src); // Set URLs to memory state
        localStorage.setItem('audioURL', audio.src); // 
        localStorage.setItem('duration', videoDetails.lengthSeconds);

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

        // videoInfoElm.main.style.opacity = 1;

        if (videoInfoElm.expires.innerHTML === "Expired") {
          video.src = "";
          audio.src = "";

          videoReset();

          resetVideoInfo();
          playPauseButton.classList.remove("repeat");
        }

        if (casting && videoInfoElm.expires.innerHTML !== "Expired") {
          /*
          addPlayerControl();

          initCastPlayer();

          videoInfoElm.cast.classList.add("active");
          videoInfoElm.gCast.classList.add("disabled");
          videoInfoElm.cast.setAttribute("onclick", "stopCasting()");*/

          castVideoWithAudio(videoDetails.formats["0"].url, diffVideo);

        }

        if (!videoErr && !audioErr) {
          // videoInfo
          videoInfoElm.title.innerHTML = videoDetails.title;
          videoInfoElm.channelTitle.innerHTML = videoDetails.channelTitle;

          // abstract other info
          abstractVideoInfo();
        }

        if ((a || b === "url") && !videoErr && !audioErr) {
          autoInfoClose = true;
        } else {
          autoInfoClose = false;
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

// CHAT GPT (AI) assisted code
/*
function findSocialMediaIdentifier(data) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.contents, 'text/html');
  
  // Helper function to extract identifiers from URLs
  function extractIdentifier(url, pattern) {
      const match = url.match(pattern);
      return match ? match[1] : null;
  }

  // Get all anchor tags
  const anchors = doc.querySelectorAll('a');

  // Define patterns for each platform
  const patterns = {
      facebook: /facebook\.com\/(?:profile\.php\?id=|)([\w.]+)/,
      instagram: /instagram\.com\/([\w.]+)/,
      twitter: /twitter\.com\/([\w]+)/,
      linkedin: /linkedin\.com\/in\/([\w-]+)/,
      tiktok: /tiktok\.com\/@([\w.]+)/,
      snapchat: /snapchat\.com\/add\/([\w]+)/,
      pinterest: /pinterest\.com\/([\w.]+)/,
      reddit: /reddit\.com\/user\/([\w-]+)/,
      tumblr: /([\w-]+)\.tumblr\.com/,
      discord: /discord\.gg\/([\w]+)/,
      youtube: /youtube\.com\/(?:c|channel|user)\/([\w-]+)/,
      github: /github\.com\/([\w-]+)/,
      medium: /medium\.com\/@([\w.]+)/,
      twitch: /twitch\.tv\/([\w-]+)/,
      telegram: /t\.me\/([\w]+)/,
  };

  // Iterate over anchors to automatically identify the platform and extract the identifier
  for (const anchor of anchors) {
      const href = anchor.href;

      for (const [platform, pattern] of Object.entries(patterns)) {
          if (href.includes(platform)) {
              const identifier = extractIdentifier(href, pattern);
              if (identifier) {
                  // Check if the data.status.url matches the identified platform URL
                  if (data.status.url && href.includes(data.status.url)) {
                      return { platform, identifier };
                  }
              }
          } else if (href.includes('youtube.com')) {
              if (href.includes('watch')) {
                  const videoTitle = doc.querySelector('title')?.textContent;
                  return { platform: 'youtube', type: 'video', title: videoTitle || 'Unknown Title' };
              } else if (href.includes('playlist')) {
                  const playlistTitle = doc.querySelector('title')?.textContent;
                  return { platform: 'youtube', type: 'playlist', title: playlistTitle || 'Unknown Title' };
              } else if (href.includes('channel') || href.includes('user') || href.includes('c')) {
                  const channelTitle = doc.querySelector('title')?.textContent;
                  const identifier = extractIdentifier(href, patterns.youtube);
                  return { platform: 'youtube', type: 'channel', identifier: identifier || 'Unknown Identifier', title: channelTitle || 'Unknown Title' };
              }
          }
      }
  }

  // Return null if no identifier is found or the URL does not match
  return null;
}
*/
/*
function determineYouTubeType(doc) {
  let type = 'unknown';
  
  // Check for video by looking for the 'videoId' in metadata or video-specific DOM elements
  if (doc.querySelector('meta[itemprop="videoId"]')) {
      type = 'video';  // Found video ID, it's a video page
  }
  // Check for channel by looking for the 'channelId' in metadata or URL path like /channel/
  else if (doc.querySelector('meta[itemprop="channelId"]') || 
           doc.querySelector('meta[property="og:type"][content="profile"]')) {
      type = 'channel';  // Found channel ID or 'profile' content type, it's a channel page
  }
  // Check for playlist by looking for the 'playlistId' or specific playlist DOM structure
  else if (doc.querySelector('meta[itemprop="playlistId"]') || 
           doc.querySelector('yt-formatted-string[aria-label="Playlist"]')) {
      type = 'playlist';  // Found playlist ID or playlist label, it's a playlist page
  }

  return type;
}*/
/*
async function getYouTubeVideoTitle(videoId, apiKey) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  
  try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      if (data.items && data.items.length > 0) {
          const title = data.items[0].snippet.title;
          console.log("Video Title:", title);
          return title;
      } else {
          console.log("No video found for the given ID.");
          return null;
      }
  } catch (error) {
      console.error("Error fetching video title:", error);
  }
}*/

// Usage
const apiKey = "AIzaSyAtcIpyHJI05qb0cIo4wdMVYfuC-Z9bQQI"; // Replace with your API key

async function checkYouTubeURL(url, apiKey) {
  let videoId, channelId, playlistId;

  // Regex to extract video ID, channel ID, and playlist ID
  const videoRegex = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|v\/|embed\/)|youtu\.be\/))([a-zA-Z0-9_-]{11})/;
  const channelRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:channel|user)\/)([a-zA-Z0-9_-]+)/;
  const playlistRegex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:playlist\?list=))([a-zA-Z0-9_-]+)/;

  if (videoRegex.test(url)) {
      videoId = url.match(videoRegex)[1];
  } else if (channelRegex.test(url)) {
      channelId = url.match(channelRegex)[1];
  } else if (playlistRegex.test(url)) {
      playlistId = url.match(playlistRegex)[1];
  }

  if (videoId) {
      return getVideoDetails(videoId, apiKey);
  } else if (channelId) {
      return getChannelDetails(channelId, apiKey);
  } else if (playlistId) {
      return getPlaylistDetails(playlistId, apiKey);
  } else {
      return { error: "Invalid YouTube URL" };
  }
}

async function getVideoDetails(videoId, apiKey) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (data.items.length > 0) {
      return { type: "video", title: data.items[0].snippet.title, videoId };
  } else {
      return { error: "No video found" };
  }
}
/*
async function getChannelDetails(channelId, apiKey) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (data.items.length > 0) {
      return { type: "channel", title: data.items[0].snippet.title, channelId };
  } else {
      return { error: "No channel found" };
  }
}*/

async function getChannelDetails(identifier, apiKey) {
  let apiUrl;

  if (identifier.startsWith("UC")) {
    // Assume it's a channel ID
    apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${identifier}&key=${apiKey}`;
  } else {
    // Assume it's a username
    apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=${identifier}&key=${apiKey}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return { 
        type: "channel", 
        title: data.items[0].snippet.title, 
        channelId: data.items[0].id 
      };
    } else {
      return { error: "No channel found" };
    }
  } catch (error) {
    return { error: "An error occurred while fetching channel details", details: error.message };
  }
}

async function getPlaylistDetails(playlistId, apiKey) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  if (data.items.length > 0) {
      return { type: "playlist", title: data.items[0].snippet.title, playlistId };
  } else {
      return { error: "No playlist found" };
  }
}

function determineYouTubeTypeAndTitle(url, id) {
  let type = 'unknown';
  let title = 'Unknown Title';
  
  /*
  // Check for video by looking for the 'videoId' in metadata or video-specific DOM elements
  const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.href || '';

  var videoID = "";
  const regex = /(?<=\/vi\/)[^/]+/;
  const vidPlaceholder = doc.querySelector("#player-placeholder").style.backgroundImage;
  const match = vidPlaceholder.match(regex);
  if (match) {
    videoID = match[0];
    console.log(videoID);
}

  if (canonicalUrl.includes('/watch') || videoID || doc.querySelector('meta[itemprop="videoId"]')) {
      type = 'video';  // Found video ID, it's a video page
      
      // Extract the video title from the meta tag or structured data

      (async () => {
        title = await fetchYouTubeVideoDetails(videoID, apiKey);
      })();
  }
  // Check for channel by looking for the 'channelId' in metadata or URL path like /channel/
  else if (canonicalUrl.includes('/channel') || canonicalUrl.includes('/c/') || canonicalUrl.includes('/@') || doc.querySelector('meta[itemprop="channelId"]') || 
           doc.querySelector('meta[property="og:type"][content="profile"]')) {
      type = 'channel';  // Found channel ID or 'profile' content type, it's a channel page
      
      // Extract the channel username from the URL or metadata
      const channelMeta = doc.querySelector('meta[itemprop="name"]');
      if (channelMeta) {
          title = channelMeta.content; // Channel name or username
      } else {
          const url = window.location.href;  // Get the current URL
          const channelMatch = url.match(/(?:\/channel\/|\/user\/|\/c\/|\/@)([a-zA-Z0-9_-]+)/);
          if (channelMatch) {
              title = channelMatch[1]; // Extract channel username from URL path
          }
      }
  }
  // Check for playlist by looking for the 'playlistId' or specific playlist DOM structure
  else if (canonicalUrl.includes('/playlist') || doc.querySelector('meta[itemprop="playlistId"]') || 
           doc.querySelector('yt-formatted-string[aria-label="Playlist"]')) {
      type = 'playlist';  // Found playlist ID or playlist label, it's a playlist page
      
      // Extract the playlist title from the meta tag or the <title> tag
      title = doc.querySelector('meta[itemprop="name"]')?.content || title;
      title = title || doc.querySelector('title')?.innerText || 'Unknown Playlist Title';
  }*/

  (async () => {
    const result = await checkYouTubeURL(url, apiKey);
    console.log(result);

    var a = document.querySelector("#" + id);
    var aTarget = document.querySelector("#" + id + " span");
    var aImg = document.querySelector("#" + id + " div.img.link");
    if (result.title !== undefined) {
      aTarget.innerHTML = result.title;
      aTarget.style.display = "block";
      aImg.style.display = "none";
    }

    if (result.type === "video") {
      a.href = "javascript:getURL('" + url + "')";
      a.target = "";
    }
  })();

  // return { type, title };
}

async function fetchMetadataForURL(url, id) {
  try {
    // const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    /*
    const response = await fetch(`https://api.allorigins.win/get?url=${url}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL metadata: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.contents) {
      throw new Error('No contents found in the response');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');*/

    // var title = findSocialMediaIdentifier(data);

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // let title = '';
      // let type = '';
      // Determine the type of YouTube link based on the URL structure
      /*
      if (data.status.url.includes('watch')) {
          type = 'video';

          

          // Fallback to <title> tag
          videoTitle = videoTitle || doc.querySelector('title')?.innerText || 'Unknown Video Title';

          // Assign the extracted title
          title = videoTitle;

      }  else if (data.status.url.includes('playlist')) {
          type = 'playlist';
          title = pageTitle; // Title of the playlist
      } else if (
          data.status.url.includes('channel') ||
          data.status.url.includes('user') ||
          data.status.url.includes('/c/') || 
          data.status.url.includes('/@')
      ) {
          type = 'channel';

          // Extract the channel name or handle
          const channelNameMeta = doc.querySelector('meta[itemprop="name"]')?.content;
          const handleFromUrl = data.status.url.match(/\/@([\w.-]+)/)?.[1];

          // Prefer channel name from metadata if available
          title = channelNameMeta ? `@${channelNameMeta}` : handleFromUrl || pageTitle || 'Unknown Channel';

      } else {

          type = 'unknown';
          title = 'Unknown YouTube Page';
      }*/

      var metadata = determineYouTubeTypeAndTitle(url, id);
      (async () => {
        title = await metadata.title;
      });

      // console.log({ platform: 'youtube', type, title });

    } else {
      var title = doc.querySelector('title')?.innerText || '';
      var favicon = doc.querySelector('link[rel~="icon"]')?.href || null;
    }

    return { title, favicon };

  } catch (error) {
    console.error('Error fetching metadata:', error.message);
    return { title: 'Unavailable', favicon: null, type: null, url: null }; // Fallback values
  }
}

async function getMetadata(url, id) {
  // const url = 'https://example.com';
  
  // Store the result into a variable
  const metadata = await fetchMetadataForURL(url, id);

  // Safely log or use the metadata
  // console.log('Title:', metadata.title);
  // console.log('Favicon:', metadata.favicon);

  // You can use this metadata object for further processing
  return metadata;
  // return url;
}

function getReadableRemainingTime(url) {
  try {
      // Parse the URL and extract the 'expire' parameter
      const urlParams = new URL(url).searchParams;
      const expireTimestamp = urlParams.get("expire");

      if (!expireTimestamp) {
          throw new Error("No 'expire' parameter found in the URL.");
      }

      // Get the current time and calculate the difference in seconds
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const timeDifference = Number(expireTimestamp) - currentTimestamp;

      if (timeDifference <= 0) {
          return "Expired";
      }

      // Calculate remaining time in different units
      const seconds = timeDifference % 60;
      const minutes = Math.floor(timeDifference / 60) % 60;
      const hours = Math.floor(timeDifference / 3600) % 24;
      const days = Math.floor(timeDifference / (3600 * 24)) % 7;
      const weeks = Math.floor(timeDifference / (3600 * 24 * 7)) % 4;
      const months = Math.floor(timeDifference / (3600 * 24 * 30.44)) % 12; // Approximate months
      const years = Math.floor(timeDifference / (3600 * 24 * 365.25)); // Approximate years

      // Build the most readable value
      if (years > 0) return `Expires in ${years} year${years > 1 ? "s" : ""}`;
      if (months > 0) return `Expires in ${months} month${months > 1 ? "s" : ""}`;
      if (weeks > 0) return `Expires in ${weeks} week${weeks > 1 ? "s" : ""}`;
      if (days > 0) return `Expires in ${days} day${days > 1 ? "s" : ""}`;
      if (hours > 0) return `Expires in ${hours} hour${hours > 1 ? "s" : ""}`;
      if (minutes > 0) return `Expires in ${minutes} minute${minutes > 1 ? "s" : ""}`;
      return `Expires in ${seconds} second${seconds > 1 ? "s" : ""}`;
  } catch (error) {
      return `N.A.`;
  }
}

var isMusic = false; // 

function resetVideoInfo() {
  videoInfoElm.replay.style.display = "none";
  videoInfoElm.radio.style.display = "none";
  videoInfoElm.cast.style.display = "none";
  videoInfoElm.autoResBtn.style.display = "none";

  //////////

  videoInfoElm.title.innerHTML = "";
  videoInfoElm.channelTitle.innerHTML = "";

  videoInfoElm.videoTitle.classList.add("textReset");
  videoInfoElm.channelTitle2.classList.add("textReset");
  videoInfoElm.category.classList.add("textReset");

  videoInfoElm.videoTitle.innerHTML = "";
  videoInfoElm.channelTitle2.innerHTML = "";
  videoInfoElm.category.innerHTML = "";

  videoInfoElm.date.classList.add("textReset");
  videoInfoElm.expires.classList.add("textReset");
  videoInfoElm.likes.classList.add("textReset");
  videoInfoElm.views.classList.add("textReset");

  videoInfoElm.date.innerHTML = "";
  videoInfoElm.expires.innerHTML = "";
  videoInfoElm.likes.innerHTML = "";
  videoInfoElm.views.innerHTML = "";
}

function abstractVideoInfo() {
  videoInfoElm.replay.style.display = "block";
  videoInfoElm.radio.style.display = "block";
  videoInfoElm.cast.style.display = "block";
  videoInfoElm.autoResBtn.style.display = "block";

  ///////////

  videoInfoElm.videoTitle.classList.remove("textReset");
  videoInfoElm.channelTitle2.classList.remove("textReset");
  videoInfoElm.category.classList.remove("textReset");

  videoInfoElm.date.classList.remove("textReset");
  videoInfoElm.expires.classList.remove("textReset");
  videoInfoElm.likes.classList.remove("textReset");
  videoInfoElm.views.classList.remove("textReset");

  ///////////

  // videoInfoElm.info.scrollTo(0,0);

  videoInfoElm.keywords.style.display = "flex";
  videoInfoElm.description.style.display = "block";

  videoInfoElm.likes.style.display = "block";
  videoInfoElm.views.style.display = "block";

  videoInfoElm.title.innerHTML = videoDetails.title;
  videoInfoElm.channelTitle.innerHTML = videoDetails.channelTitle;

  videoInfoElm.videoTitle.innerHTML = '<a class="trs noUnderline" href="' + videoURL + '" target="_blank">' + videoDetails.title + '</a>';
  videoInfoElm.channelTitle2.innerHTML = '<a class="trs noUnderline" href="https://www.youtube.com/channel/' + videoDetails.channelId + '" target="_blank">' + videoDetails.channelTitle + '</a>';

  if (videoDetails.category) {
    videoInfoElm.category.style.display = "block";
    videoInfoElm.category.innerHTML = videoDetails.category;

    if (videoDetails.category === "Music") {
      isMusic = true;
    } else {
      isMusic = false;
    }
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
  videoInfoElm.expires.innerHTML = getReadableRemainingTime(targetVideo.url);

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

  var otherResBtn = document.querySelectorAll(".wrapper.info .otherResBtn");
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
        var activeBtn = document.querySelectorAll(".autoResBtn.active").length ? document.querySelectorAll(".autoResBtn.active") : document.querySelectorAll(".otherResBtn.active");
        // activeBtn.classList.remove("active");
        activeBtn.forEach(btn => btn.classList.remove('active'));
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

        openSearch(event.currentTarget.children[0].innerHTML);
      });

      d.appendChild(p);

      videoInfoElm.keywords.appendChild(d);

      if (videoDetails.keywords.length > 10) {
        gradientButtons(".info .keywordsBtn");
      }
    }
  } else {
    videoInfoElm.keywords.style.display = "none";
  }
/*
  function highlightHashtags(text) {
    // Regular expression to match words starting with #_ but not inside URLs
    const hashtagRegex = /(?<!https?:\/\/[^\s]*)(#\w+)/g;
  
    // Replace hashtags with a span for styling or interactivity
    return text.replace(hashtagRegex, (hashtag) => {
      return `<a onclick="" class="trs hashtag">${hashtag}</a>`;
    });
  }  */

  function highlightHashtags(text) {
    // Regular expression to match hashtags in various languages
    // const hashtagRegex = /(?<!https?:\/\/[^\s]*)(#[\p{L}\p{N}_]+)/gu;
    // Regular expression to match hashtags with extended character support
    const hashtagRegex = /(?<!https?:\/\/[^\s]*)(#[\p{L}\p{N}_.&\-]+)/gu;
    
    // Replace hashtags with a span for styling or interactivity
    return text.replace(hashtagRegex, (hashtag) => {
      return `<a onclick="openSearch('${hashtag}')" class="trs hashtag">${hashtag}</a>`;
    });
  }

  // Function to detect and format video timestamps
function formatTimestamps(text) {
  const timestampRegex = /\b(\d{1,2}:\d{2})(?::\d{2})?\b/g; // Matches timestamps like 1:23, 12:34, or 1:23:45
  return text.replace(timestampRegex, (timestamp) => {
    return `<span class="timestamp trs" data-time="${timestamp}">${timestamp}</span>`;
  });
}

function generateValidIdFromUrl(url) {
  // Convert the URL into an array of characters
  const urlArray = url.split('');

  // Shuffle the array randomly
  for (let i = urlArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [urlArray[i], urlArray[j]] = [urlArray[j], urlArray[i]]; // Swap elements
  }

  // Rebuild the URL string from the shuffled array
  let randomizedUrl = urlArray.join('');

  // Ensure the ID is valid (it should start with a letter and contain no special characters)
  // Replace any non-alphanumeric characters with underscores and ensure it doesn't start with a number
  randomizedUrl = randomizedUrl.replace(/[^a-zA-Z0-9]/g, '_');

  // If the ID starts with a number, prepend a letter to make it valid
  if (/^[0-9]/.test(randomizedUrl)) {
      randomizedUrl = 'a' + randomizedUrl;
  }

  // Generate a random string for uniqueness
  const randomString = Math.random().toString(36).substring(2, 8);

  // Combine the randomized URL with the random string
  const validId = `randomized-${randomizedUrl}-${randomString}`;

  return validId;
}

  // Function to detect and replace URLs with a generic "Visit link"

function getSocialsFavicon(url) {
  if (url.includes("instagram.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/instagram.svg', 
      id: "instagram"
    };
  } else if (url.includes("twitter.com") || url.includes("x.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/x.svg',
      id: "twitter"
    };
  } else if (url.includes("facebook.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/facebook.svg',
      id: "facebook"
    };
  } else if (url.includes("tiktok.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/tiktok.svg',
      id : "tiktok"
    };
  } else if (url.includes("snapchat.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/snapchat.svg',
      id: "snapchat"
    };
  } else if (url.includes("linkedin.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/linkedin.svg',
      id: "linkedin"
    };
  } else if (url.includes("patreon.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/patreon.svg',
      id: "patreon"
    };
  } else if (url.includes("ko-fi.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/kofi.svg',
      id: "ko-fi"
    };
  } else if (url.includes("twitch.tv")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/twitch.svg',
      id: "twitch"
    };
  } else if (url.includes("discord")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/discord.svg',
      id: "discord"
    };
  } else if (url.includes("amazon.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/amazon.svg',
      id: "amazon"
    };
  } else if (url.includes("soundcloud.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/soundcloud.svg',
      id: "soundcloud"
    };
  } else if (url.includes("spotify.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/spotify.svg',
      id: "spotify"
    };
  } else if (url.includes("reddit.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/reddit.svg',
      id : "reddit"
    };
  } else if (url.includes("pinterest.com")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/pinterest.svg',
      id: "pinterest"
    };
  } else if (url.includes("linktr.ee")) {
    return {
      url: 'https://ivansojivarghese.github.io/media-sphere/png/linktree.svg',
      id: "linktree"
    };
  } else {
    return {
      url: "",
      id: ""
    };
  }
}
  
function formatURLsToGenericLink(text) {
  // Match URLs, stopping before <br> or whitespace characters
  // const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;

  //////////////////////////////////////////////////////////////////

  const urlRegex = /\b(?:https?:\/\/|www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/[^\s<]*)?(?=\s|<br>|$)/g;

  return text.replace(urlRegex, (url) => {
    /*
    if (/^[a-zA-Z0-9_.+-]+$/.test(url)) {
      return url; // Return as plain text if it doesn't look like a valid URL
    }*/

    var id = "";
    var youtubeClass = "";
    var imgClass = "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      id = generateValidIdFromUrl(url);
    }

    var el;
    const { title, favicon } = getMetadata(url, id);
    // const clickableURL = (id === "") ? (url.startsWith('http') ? url : `http://${url}`) : (type === "video") ? "javascript:getURL('" + (url.startsWith('http') ? url : `http://${url}`) + "')" : (url.startsWith('http') ? url : `http://${url}`);
    const clickableURL = url.startsWith('http') ? url : `http://${url}`;

    if (id) {
      var youtubeFavicon = 'https://ivansojivarghese.github.io/media-sphere/png/youtube.svg';
      youtubeClass = "youtube";
    }

    var socialFavicon = getSocialsFavicon(url);
    imgClass = socialFavicon.id;

    /*
    const displayTitle = title || 'Visit Link';
    const faviconURL = favicon || `https://www.google.com/s2/favicons?domain=${url}`;*/
    const displayTitle = title || '';
    const faviconURL = favicon || socialFavicon.url || youtubeFavicon || `https://ivansojivarghese.github.io/media-sphere/svg/globe.svg`;

    el = `<a href="${clickableURL}" target="_blank" id='${id}' class="url trs trsButtons ${youtubeClass} ${imgClass}">
                  <div class="img" style="background-image: url('${faviconURL}')"></div>
                  <div class="img link"></div>
                  <span style="display: none;">${displayTitle}</span>
                </a>`;

    return el;

    // return `<a href="${clickableURL}" target="_blank" class="url trs trsButtons"><div class="img"></div></a>`;
  });
}


// Function to detect and link email addresses
function formatEmailLinks(text) {
  // Regular expression to match email addresses (including @ symbol)
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,})/g;

  return text.replace(emailRegex, (email) => {
    // Wrap the email in a mailto link
    return `<a href="mailto:${email}" class="email-link trs">${email}</a>`;
  });
}

/*
// Function to detect and link valid international phone numbers
function formatPhoneNumbers(text) {
  // Regular expression to match phone numbers with various formats
  const phoneRegex = /(\+?\d{1,3}[-.\s()]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

  return text.replace(phoneRegex, (phone) => {
    // Normalize the phone number by removing spaces/dots/dashes
    const normalizedPhone = phone.replace(/[-.\s]/g, '');
    return `<a href="tel:${normalizedPhone}" class="phone-link trs">${phone}</a>`;
  });
}*/

// Function to detect and link valid international phone numbers, excluding currency or money values
function formatPhoneNumbers(text) {
  // Regular expression to match phone numbers while avoiding parts of monetary values
  // const phoneRegex = /(?<![\$€£₹¥]\d*)\b(\+?\d{1,3}[-.\s()]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})\b(?!\.\d{2,})/g;

  // Regular expression to match phone numbers with the correct prefix rules
  // const phoneRegex = /(?<![\$€£₹¥]\d*)\b(\+[1-9]\d{0,3}[-.\s()]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{2,9}|\b\d{5,})\b(?!\.\d{2,})(?!\b\d{4}\b)/g;

  // Regular expression to match phone numbers with an optional international prefix
  // const phoneRegex = /(?<![\$€£₹¥]\d*)\b(\+?[1-9]\d{0,3}[-.\s()]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{2,9})\b(?!\.\d{2,})(?!\b\d{4}\b)/g;

  /*
  return text.replace(phoneRegex, (phone) => {
    // Normalize the phone number by removing spaces, dots, and dashes
    const normalizedPhone = phone.replace(/[-.\s]/g, '');
    return `<a href="tel:${normalizedPhone}" class="phone-link trs">${phone}</a>`;
  });*/
  /*
  return text.replace(phoneRegex, (phone) => {
    // Encode the "+" sign in the phone number for the tel: link
    const telLink = phone.startsWith('+') ? `tel:%2B${phone.slice(1)}` : `tel:${phone}`;
    return `<a href="${telLink}" class="phone-link trs">${phone}</a>`;
  });*/
  /*
  // Regular expression to match phone numbers with an optional international prefix
  const phoneRegex = /(?<![\$€£₹¥]\d*)\b(\+?[1-9]\d{0,3}[-.\s()]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{2,9})\b(?!\.\d{2,})(?!\b\d{4}\b)/g;

  return text.replace(phoneRegex, (phone) => {
    return `<a href="tel:${phone}" class="phone-link trs">${phone}</a>`;
  });*/

  // Regular expression to match phone numbers with an optional international prefix
  // const phoneRegex = /(?<![\$€£₹¥]\d*)\b(\+?[1-9]\d{0,3}[-.\s()]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{2,9})\b(?!\.\d{2,})(?!\b\d{4}\b)/g;
  // const phoneRegex = /\+?\(?\d{1,4}\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\(?\d{1,9}\)?/g;
  /*
  return text.replace(phoneRegex, (phone) => {
    // Encode the "+" sign in the phone number for the tel: link
    const telLink = phone.startsWith('+') ? `tel:+${phone.slice(1)}` : `tel:${phone}`;
    return `<a href="${telLink}" class="phone-link trs">${phone}</a>`;
  });*/

  return text;
}

function formatMentions(text) {
  // Match mentions that start with a space, newline, or are at the beginning of the string
  const mentionRegex = /(?:\s|\n|^)@([a-zA-Z0-9_]+)/g;

  return text.replace(mentionRegex, (match, username, offset, originalText) => {
    // Check if it is part of an email by looking ahead for a dot (e.g., @domain.com)
    const isEmail = /\S+@\S+\.\S+/.test(originalText);

    if (isEmail) {
      return match; // Do not format as a mention if it's part of an email
    }

    // Create a YouTube link for valid mentions
    const channelURL = `https://www.youtube.com/@${username}`;
    return ` <a href="${channelURL}" target="_blank" class="mention-link trs">@${username}</a>`;
  });
}


// Combine all formatting functions
/*
function formatDescription(text) {
  const textWithTimestamps = formatTimestamps(text); // Assuming formatTimestamps exists
  const textWithURLs = formatURLsToGenericLink(textWithTimestamps); // Assuming formatURLsToGenericLink exists
  const textWithEmails = formatEmailLinks(textWithURLs); // Assuming formatEmailLinks exists
  const textWithPhones = formatPhoneNumbers(textWithEmails); // Assuming formatPhoneNumbers exists
  const textWithHashtags = highlightHashtags(textWithPhones); // Assuming highlightHashtags exists
  // const textWithMentions = formatMentions(textWithHashtags); // Add mention detection here
  return textWithHashtags;
}*/
/*
// Combine all formatting functions
function formatDescription(text) {
  const textWithTimestamps = formatTimestamps(text); // Assuming formatTimestamps exists
  const textWithURLs = formatURLsToGenericLink(textWithTimestamps); // Assuming formatURLsToGenericLink exists
  const textWithMentions = formatMentions(textWithURLs); // Check for mentions before emails
  const textWithEmails = formatEmailLinks(textWithMentions); // Assuming formatEmailLinks exists
  const textWithPhones = formatPhoneNumbers(textWithEmails); // Assuming formatPhoneNumbers exists
  const textWithHashtags = highlightHashtags(textWithPhones); // Assuming highlightHashtags exists
  return textWithHashtags;
}*/
/*
function formatDescription(text) {
  // First, format the emails so they are prioritized over mentions
  const textWithEmails = formatEmailLinks(text);

  // Then format URLs
  const textWithURLs = formatURLsToGenericLink(textWithEmails);

  // Format phone numbers
  const textWithPhones = formatPhoneNumbers(textWithURLs);

  // Format hashtags
  const textWithHashtags = highlightHashtags(textWithPhones);

  // Finally, format mentions (after emails)
  const textWithMentions = formatMentions(textWithHashtags);

  return textWithMentions;
}*/

function formatDescription(text) {
  // Format timestamps
  const textWithTimestamps = formatTimestamps(text); // Assuming formatTimestamps exists

  // Format emails first
  const textWithEmails = formatEmailLinks(textWithTimestamps);

  // Then URLs
  const textWithURLs = formatURLsToGenericLink(textWithEmails);

  // Format phone numbers
  const textWithPhones = formatPhoneNumbers(textWithURLs);

  // Format hashtags
  const textWithHashtags = highlightHashtags(textWithPhones);

  // Format mentions after other rules
  const textWithMentions = formatMentions(textWithHashtags);

  return textWithMentions;
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

  // related videos/playlists

  getRelatedContent(videoDetails.id);
}

var relatedContent = null;

async function getRelatedContent(id) {
  const url = 'https://yt-api.p.rapidapi.com/related?id=' + id + '&geo=' + countryAPIres.country + '&lang=en';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
      'x-rapidapi-host': 'yt-api.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    relatedContent = await response.json();

    console.log(relatedContent);

    if (relatedContent.data.length) {

      displaySearchResults(null, true, "div.wrapper.info ");
    }

  } catch (error) {

    console.error(error);
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

if (localStorage.getItem('radioLoop') === "true") {
  radioLoop = true;
  videoInfoElm.radio.classList.add("active");
}

setInterval(() => {
  if (videoInfoElm.gCast.style.display !== "none") {
    videoInfoElm.cast.style.display = "";
  } else {
    videoInfoElm.cast.style.display = "none";
  }

  const transformValue = videoProgressBar.style.transform;
  const match = transformValue.match(/scaleX\(([\d.-]+)\)/);
  const numericValue = match ? parseFloat(match[1]) : null;

  const computedStyle = getComputedStyle(videoBarPlaceholder);       
  const width = computedStyle.width;  
  const numericWidth = parseFloat(width);   

  var scrubX = numericValue * numericWidth;

  videoScrub.style.left = "calc("+ scrubX +"px + 0.8rem + calc(env(safe-area-inset-left)))";
  
}, 1000/60);