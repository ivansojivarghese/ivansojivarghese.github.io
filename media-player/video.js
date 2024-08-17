
    
var videoDetails;
var videoSubmit;

var videoSizeRatio = 0;

var videoFetchLoop = null;
var videoSupportLoop = null;

var videoSources = [];
var audioSources = [];

var supportedVideoSources = [];
var targetVideoSources = [];

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

  videoSources = [];
  audioSources = [];

  supportedVideoSources = [];
  targetVideoSources = [];

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

        // IDENTIFY VIDEO AND AUDIO SOURCES IN THE FETCH ARRAY RESULT

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

            if (networkSpeed < 0.5) {
              // SD - 144p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 144) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            } else if (networkSpeed >= 0.5 && networkSpeed < 0.7) {
              // SD - 240p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 240) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            } else if (networkSpeed >= 0.7 && networkSpeed < 1.1) {
              // SD - 360p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 360) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            } else if (networkSpeed >= 1.1 && networkSpeed < 2.5) {
              // SD - 480p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 480) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            } else if (networkSpeed >= 2.5 && networkSpeed < 5) {
              // HD - 720p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 720) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            } else if (networkSpeed >= 5 && networkSpeed < 10) {

              // HD - 1080p

              // CHOOSE THE SOURCES THAT MATCH THIS RES.

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 1080) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }

              // CHOOSE A FILE WITH THE HIGHEST BITRATE READINGS, ETC.

            } else if (networkSpeed >= 10 && networkSpeed < 20) {
              // 2K - 1440p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 1440) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            } else if (networkSpeed >= 20 && networkSpeed < 100) {
              // 4K - 2160p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 2160) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            } else {
              // 8K - 4320p

              for (j = 0; j <= supportedVideoSources.length - 1; j++) {
                if (supportedVideoSources[j].height === 4320) {
                  targetVideoSources[targetVideoSources.length] = supportedVideoSources[j];
                }
              }
            }
            
            const targetVideo = targetVideoSources[0];

            const videoWidth = targetVideo.width;
            const videoHeight = targetVideo.height;
            videoSizeRatio = videoWidth / videoHeight;

            video.poster = videoDetails.thumbnail[videoDetails.thumbnail.length - 1].url;
            video.src = targetVideo.url;

            audio.src = videoDetails.adaptiveFormats[videoDetails.adaptiveFormats.length - 1].url;

          }

        }, 10);
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


getParams(null);