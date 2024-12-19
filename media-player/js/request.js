
    var videoURL = "";

    var inp = document.getElementById('urlBar');

    inp.addEventListener('select', function() {
      this.selectionStart = this.selectionEnd;
    }, false);
    
    function getURL() {
      if (inp.value !== "") {

        var wrapURL = document.querySelector("#urlInput");
        var wrap = document.querySelector("#settingsOptions");
        var contents = inp.value;

        if (contents !== "") {
          videoURL = contents;
        }

        var error = false;
        
        // NO ACCESS TO SHORTS, LIVE, ATTRIBUTED OR EMBEDDED VIDEOS
        if (!contents.includes("embed") && !contents.includes("attribution_link") && !contents.includes("shorts") && !contents.includes("live")) {
          
        if (contents.includes("youtube.com") && !contents.includes("m.youtube.com")) {
          
          //video.classList.remove("error");
          // video.style.border = "0.15rem solid #A10000";
          
          var sIndex = contents.indexOf("v=");
          var eIndex = contents.indexOf("&");
          var sTrue;
          
          if (sIndex !== -1) {
            sTrue = true;
            if (eIndex === -1 && eIndex > sIndex) {
              var eIndex = contents.indexOf("#");
                if (eIndex === -1) {
                  eIndex = contents.length;
                }
            } else if (eIndex < sIndex) {
              eIndex = contents.length;
            }
          } else {
            sTrue = false;
            sIndex = contents.lastIndexOf("/");
            eIndex = contents.indexOf("?");
            if (eIndex === -1) {
              eIndex = contents.length;
            }
          }
          
          var id = contents.substring(sIndex, eIndex);
          if (sTrue) {
            var videoID = id.substring(2, id.length);
          } else {
            var videoID = id.substring(1, id.length);
          }
          
        } else if (contents.includes("m.youtube.com")) {
          
            // video.classList.remove("error");
          // video.style.border = "0.15rem solid #A10000";
            
            var sIndex = contents.indexOf("v=");
            var eIndex = contents.indexOf("&");
            var sTrue;
          
            if (sIndex !== -1) {
              sTrue = true;
              if (eIndex === -1 && eIndex > sIndex) {
                var eIndex = contents.indexOf("#");
                if (eIndex === -1) {
                  eIndex = contents.length;
                }
              } else if (eIndex < sIndex) {
                eIndex = contents.length;
              }
            } else {
              sTrue = false;
              sIndex = contents.lastIndexOf("/");
              eIndex = contents.indexOf("?");
              if (eIndex === -1) {
                eIndex = contents.length;
              }
            }
          
            var id = contents.substring(sIndex, eIndex);
            if (sTrue) {
              var videoID = id.substring(2, id.length);
            } else {
              var videoID = id.substring(1, id.length);
            }
              
        } else if (contents.includes("youtu.be")) {
          
          // video.classList.remove("error");
          // video.style.border = "0.15rem solid #A10000";
          
          var sIndex = contents.indexOf("e/");
            var eIndex = contents.indexOf("?");
          var sTrue;
          
          if (sIndex === -1) {
            sTrue = false;
            sIndex = contents.lastIndexOf("/");
            eIndex = contents.indexOf("?");
            if (eIndex === -1) {
              eIndex = contents.indexOf("&");
              if (eIndex === -1) {
                eIndex = contents.length;
              }
            }
          } else {
            sTrue = true;
            if (eIndex === -1) {
              eIndex = contents.indexOf("&");
              if (eIndex === -1) {
                eIndex = contents.length;
              }
            }
          }
          
          var id = contents.substring(sIndex, eIndex);
          if (sTrue) {
            var videoID = id.substring(2, id.length);
          } else {
            var videoID = id.substring(1, id.length);
          }
        } else {

          error = true;
          
          statusIndicator.classList.remove("buffer");
          statusIndicator.classList.remove("smooth");
          statusIndicator.classList.add("error");

          endLoad();
                    
          setTimeout(function() {
            loadingRing.style.display = "none";
            playPauseButton.style.display = "block";
            playPauseButton.classList.remove('playing');
            playPauseButton.title = "Play";

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

        /*
        let VID_REGEX =
        /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        videoID = contents.match(VID_REGEX)[1];*/

        if (!error) {

          var timestamp = Number(contents.slice(contents.indexOf("&t=") + 3)); // START FROM (in sec.)
          if (!timestamp) {
            timestamp = Number(localStorage.getItem("timestamp"));
          }
        
          console.log("Video ID: " + videoID);
            
          videoSubmit = true;
          
          // if (videoID) {
          if (videoLoadLoop === null) {
            
            videoLoadLoop = setInterval(() => {

              if (countryAPIres.online) {
                clearInterval(videoLoadLoop);
                videoLoadLoop = null;

                getParams(videoID, timestamp);
              }

            }, 100);
          }
          
          // }

        }
          
        wrapURL.style.display = "";
        wrap.style.display = "";
        inp.value = "";
          
      } else {
        
        statusIndicator.classList.remove("buffer");
        statusIndicator.classList.remove("smooth");
        statusIndicator.classList.add("error");

        endLoad();
                  
        setTimeout(function() {
          loadingRing.style.display = "none";
          playPauseButton.style.display = "block";
          playPauseButton.classList.remove('playing');
          playPauseButton.title = "Play";

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
      
      // document.getElementById("urlSubmit").click();
      }
    }
    
    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter" && inp.value) {
        document.getElementById("urlSubmit").click();
        closeWrap(event, 'webupload');
        closeWrap(event, 'settings');
        event.preventDefault();
      }
    });
    
    /*
    inp.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        document.getElementById("urlSubmit").click();
        // closeWrap(event, 'webupload');
        event.preventDefault();
      }
    });*/