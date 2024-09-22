
    
var videoDetails;
var videoSubmit;

var videoSizeRatio = 0;

var videoFetchLoop = null;
var videoSupportLoop = null;

var videoSources = [];
var audioSources = [];

var supportedVideoSources = [];
var targetVideoSources = [];
var targetVideo = null;

const videoQuality = [144, 240, 360, 480, 720, 1080, 1440, 2160, 4320]; // supports up to 8K video (for normal dimensions)
var specialVideoQuality = []; 
var priorityQuality = 0;
var targetQuality = 0;

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

var firstPlay = true;

// REFERENCE: https://web.dev/articles/media-session

const actionHandlers = [
  ['play',          async () => { await audio.play().then(function () {
                                    // audioCtx = new AudioContext();
                                    setTimeout(function() {
                                      video.play().then(function() {
                                        if (videoEnd) {
                                          videoEnd = false;
                                        }
                                        videoPause = true;
                                      }).catch((err) => {
                                        audio.pause();
                                        video.pause();
                                        videoPause = false;
                                      });
                                    }, getTotalOutputLatencyInSeconds(audioCtx.outputLatency) * 1000);
                                  }); 
                                  updatePositionState(); 
                                }
  ],
  ['pause',         () => { 
                            if (videoPause) {
                              audio.pause();
                              video.pause();

                              bufferStartTime = 0;
                              bufferEndTime = 0;

                              videoPause = false;
                            }
                          }
  ],
  /*['previoustrack', () => { }],
  ['nexttrack',     () => { }],*/
  ['stop',          () => { /* ... */ }],
  ['seekbackward',  (details) => { seekBackward(true); updatePositionState(); }],
  ['seekforward',   (details) => { seekForward(true); updatePositionState(); }],
  ['seekto',        (details) => { /* ... */ }],
  ['enterpictureinpicture', () => { video.requestPictureInPicture().then(function() {
                                      pipEnabled = true;
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

async function videoSourceCheck(i) {
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
    if (result.supported && result.smooth) {
      supportedVideoSources[supportedVideoSources.length] = videoSources[i];
    }
  });
}

async function getParams(id) {
  let params = new URLSearchParams(document.location.search);
  const link = params.get("description"); 

  clearInterval(bufferingCountLoop);
  bufferingCountLoop = null;
  bufferCount = 0;
  bufferingCount = [];
  bufferingTimes = [];

  bufferStartTime = 0;
  bufferEndTime = 0;

  videoSources = [];
  audioSources = [];

  specialVideoQuality = [];

  supportedVideoSources = [];
  targetVideoSources = [];
  targetVideo = null;

  videoStreamScore = 0;

  audioLatency = 0;
  audioLatencyArr = [];

  audioTimes = [];

  priorityQuality = 0;
  targetQuality = 0;

  firstPlay = true;

  if (link !== null && id === null) {
    
    // NO ACCESS TO SHORTS, LIVE, ATTRIBUTED OR EMBEDDED VIDEOS
    if (!link.includes("embed") && !link.includes("attribution_link") && !link.includes("shorts") && !link.includes("live")) {
    
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
      
      //video.classList.add("error");
    }
    } else {
      
      //video.classList.add("error");
    }
    
    console.log("Video ID: " + videoID);
    
  } else if (id) {
    
    var videoID = id;
    
  } 
  
  if (link !== null || videoSubmit) {

  // PRELOAD HERE
  // START LOAD
  clearTimeout(controlsHideInt);
  controlsHideInt = null;
  loading = true;
  loadingRing.style.display = "block";
  playPauseButton.style.display = "none";

  showVideoControls();
  
  // REFERENCE: https://rapidapi.com/ytjar/api/ytstream-download-youtube-videos
  
  const url = 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=' + videoID;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
      'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    videoDetails = await response.json();
    console.log(videoDetails);
    
    // video.src = videoDetails.formats["0"].url;

    videoFetchLoop = setInterval(function() {
      if (networkSpeed) {
        clearInterval(videoFetchLoop);

        getOptimalVideo();
      }
    }, 10);

    /*
    const videoCSS = window.getComputedStyle(video, null);
    videoContainer.style.width = videoCSS.getPropertyValue("width");
    videoContainer.style.height = videoCSS.getPropertyValue("height");
    */
  } catch (error) {
    console.error(error);
    
    // video.classList.add("error");
  }
    
  }
}

function getOptimalVideo() {

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
    for (j = 0; j < videoSources.length - 1; j++) { // CHECK FOR SUPPORTED SOURCES
      await videoSourceCheck(j);
    }
  })();

  videoSupportLoop = setInterval(function() {

    if (supportedVideoSources.length) {

      clearInterval(videoSupportLoop);

      // REFERENCE: https://www.highspeedinternet.com/resources/how-internet-connection-speeds-affect-watching-hd-youtube-videos#:~:text=It%20is%20possible%20to%20watch,the%20quality%20of%20the%20video). 
      // REFERENCE: https://support.google.com/youtube/answer/78358?hl=en 

      // REORDER SUPPORTED VIDEOS BASED ON PRIORITY OF (FASTEST) NETWORK SPEEDS

      if (networkSpeed < 0.5) {
        // SD - 144p
        priorityQuality = 0;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 144) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      } else if (networkSpeed >= 0.5 && networkSpeed < 0.7) {
        // SD - 240p
        priorityQuality = 1;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 240) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      } else if (networkSpeed >= 0.7 && networkSpeed < 1.1) {
        // SD - 360p
        priorityQuality = 2;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 360) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      } else if (networkSpeed >= 1.1 && networkSpeed < 2.5) {
        // SD - 480p
        priorityQuality = 3;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 480) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      } else if (networkSpeed >= 2.5 && networkSpeed < 5) {
        // HD - 720p
        priorityQuality = 4;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 720) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      } else if (networkSpeed >= 5 && networkSpeed < 10) {

        // HD - 1080p
        priorityQuality = 5;

        // CHOOSE THE SOURCES THAT MATCH THIS RES.
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 1080) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/

        // CHOOSE A FILE WITH THE HIGHEST BITRATE READINGS, ETC.

      } else if (networkSpeed >= 10 && networkSpeed < 20) {
        // 2K - 1440p
        priorityQuality = 6;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 1440) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      } else if (networkSpeed >= 20 && networkSpeed < 100) {
        // 4K - 2160p
        priorityQuality = 7;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 2160) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      } else {
        // 8K - 4320p
        priorityQuality = 8;
        /*
        for (j = 0; j <= supportedVideoSources.length - 1; j++) {
          if (supportedVideoSources[j].height === 4320) {
            targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
          }
        }*/
      }

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

      // FINAL SCORE
      videoStreamScore = rttScore * downlinkScore * saveDataScore * effectiveTypeScore;

      // TARGET QUALITY
      targetQuality = Math.round(videoStreamScore * priorityQuality);
      if (targetQuality > (videoQuality.length - 1)) {
        targetQuality = videoQuality.length - 1;
      }

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
          }
        }
        specialVideoQuality.reverse();
      }

      while (targetVideo === null) {
        if (!normalVid) {
          specialQuality = Math.round(((targetQuality + mod) / (videoQuality.length - 1)) * (specialVideoQuality.length - 1));
        }
        for (i = 0; i < targetVideoSources.length; i++) {
          if ((normalVid && (targetVideoSources[i].height === videoQuality[targetQuality + mod]))) {
            targetVideo = targetVideoSources[i];
            break;
          } else if ((!normalVid && (targetVideoSources[i].height === specialVideoQuality[specialQuality]))) {

            // targetVideo = typeof targetVideoSources[targetQuality + mod] === undefined ? null : targetVideoSources[targetQuality + mod];
            targetVideo = targetVideoSources[i];
            
            break;
          }
        }
        // console.log(targetQuality + mod);
        if (targetVideo === null) {
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

          /*
          if ((targetQuality + mod) > 4 && (targetQuality + mod) <= 8) {
            mod--;
          } else if ((targetQuality + mod) >= 0 && (targetQuality + mod) <= 4) {
            mod++;
          }*/
          /*
          if (fetchedSources.includes(targetQuality + mod)) {
            // CHOOSE THE LOWEST AVAILABLE QUALITY FIRST
            targetVideo = targetVideoSources[targetVideoSources.length - 1];
            break;
          }*/

        }
      }

      const videoWidth = targetVideo.width;
      const videoHeight = targetVideo.height;
      videoSizeRatio = videoWidth / videoHeight;

      // video.poster = videoDetails.thumbnail[videoDetails.thumbnail.length - 1].url;
      video.src = targetVideo.url;
      audio.src = videoDetails.adaptiveFormats[videoDetails.adaptiveFormats.length - 1].url;

      // mediaSessions API
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: videoDetails.title,
          artist: videoDetails.channelTitle,
          // album: '',
          artwork: [
            /*{ src: videoDetails.thumbnail[0].url,   sizes: videoDetails.thumbnail[0].width+'x'+videoDetails.thumbnail[0].height, type: 'image/jpg' },
            { src: videoDetails.thumbnail[1].url,   sizes: videoDetails.thumbnail[1].width+'x'+videoDetails.thumbnail[1].height, type: 'image/jpg' },
            { src: videoDetails.thumbnail[2].url,   sizes: videoDetails.thumbnail[2].width+'x'+videoDetails.thumbnail[2].height, type: 'image/jpg' },*/

            { src: videoDetails.thumbnail[videoDetails.thumbnail.length - 1].url,   sizes: videoDetails.thumbnail[videoDetails.thumbnail.length - 1].width+'x'+videoDetails.thumbnail[videoDetails.thumbnail.length - 1].height, type: 'image/jpg' }
          ]
        });
      
        // TODO: Update playback state.
      }

    }

  }, 10);

  }

  }


getParams(null);