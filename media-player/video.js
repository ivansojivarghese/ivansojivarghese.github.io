
    
var videoDetails;
var videoSubmit;

async function getParams(id) {
  let params = new URLSearchParams(document.location.search);
  const link = params.get("description"); 

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

    const targetVideo = videoDetails.adaptiveFormats[0];
    const videoWidth = targetVideo.width;
    const videoHeight = targetVideo.height;

    const videoCSS = window.getComputedStyle(video, null);
    videoContainer.style.width = videoCSS.getPropertyValue("width");
    videoContainer.style.height = videoCSS.getPropertyValue("height");
    setTimeout(function() {
        video.style.opacity = 0;
        setTimeout(function() {
            // var mod = "";
            // var modSec = "";
            // var videoModWidth, videoModHeight;
            // const videoSizeRatio = videoWidth / videoHeight;

            video.poster = videoDetails.thumbnail[videoDetails.thumbnail.length - 1].url;
            video.src = targetVideo.url;
            audio.src = videoDetails.adaptiveFormats[videoDetails.adaptiveFormats.length - 1].url;

            // CAPTURE adaptiveFormats[0] video (highest quality)
            // CAPTURE adaptiveFormats[adaptiveFormats.length - 1] audio (highest quality)
            // COMBINE the 2 sources
            
            /*
            setTimeout(function() {
                if (videoSizeRatio === 1) {
                    videoModWidth = "100";
                    videoModHeight = "100";
                    mod = "%";
                    modSec = "vw";
                }
                videoContainer.style.width = videoModWidth + mod;
                videoContainer.style.height = videoModHeight + modSec;

                video.style.opacity = 1;
                video.play();
                
                if (!video.paused) {
                    audio.currentTime = video.currentTime;
                    audio.play();
                }
            }, 200); */
        }, 10);
    }, 10);
    
  } catch (error) {
    console.error(error);
    
    // video.classList.add("error");
  }
    
  }
}


getParams(null);