
    var videoURL = "";

    var inp = document.getElementById('urlBar');

    const searchOptions = document.querySelector(".searchOptions");

    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)(\/.*)?$/;

    var queryType = document.querySelector("#searchType"),
        queryDate = document.querySelector("#searchUpload"),
        querySort = document.querySelector("#searchSort");

    var searchResults = null;

/*
    inp.addEventListener('select', function() {
      this.selectionStart = this.selectionEnd;
    }, false);*/

    function getDeviceType() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    
      if (/iphone/.test(userAgent)) {
        return "iphone";
      } else if (/android/.test(userAgent)) {
        return "android";
      } else if (isFinePointer) {
        // Fine pointer (e.g., mouse or trackpad)
        return "desktop";
      } else if (isCoarsePointer) {
        // Coarse pointer (e.g., touch or pen/stylus input)
        if (/tablet|ipad/.test(userAgent) || (/android/.test(userAgent) && !/mobile/.test(userAgent))) {
          return "tablet";
        } else {
          return "mobile-or-pen";
        }
      } else {
        // No detectable pointer
        return "unknown";
      }
    }
    
    const deviceType = getDeviceType();
    console.log(`Detected device type: ${deviceType}`);
    
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*$/i;
    
    function testForUrl(url) {
        return urlRegex.test(url);
    }
    
    function getURL(u, m) {

      if (searchPath === "url" || m) {
        if ((inp.value !== "" && (pattern.test(inp.value) && searchPath === "url")) || u || m) {

          var wrapURL = document.querySelector("#urlInput");
          var wrap = document.querySelector("#settingsOptions");
          var contents = u || inp.value;

          if (u) {
            closeVideoInfo();
          }

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
            if (!timestamp && (videoURL === localStorage.getItem("mediaURL"))) {
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

                  // if (failTimes < maxFailTimes) {
                    getParams(videoID, timestamp, u, searchPath);
                  // }
                }

              }, 100);
            }
            
            // }

          }
            
          wrapURL.style.display = "";
          wrap.style.display = "";
          inp.value = "";

          if (searchPath === "url") {
            closeVideoInfo();
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
        } else {

          // ERROR
        }
      } else if (!testForUrl(inp.value)) {

        searchQuery(inp.value);
      } else {

        inp.value = "";
      }
    }
    
    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter" && inp.value && videoInfoOpen) {
        if (pattern.test(inp.value) || searchPath === "query") {
          document.getElementById("urlSubmit").click();
          // closeWrap(event, 'webupload');
          // closeWrap(event, 'settings');
          event.preventDefault();
        } else {

          // ERROR
        }
      }
    });

    async function searchQuery(q) {
      const url = 'https://yt-api.p.rapidapi.com/search?query=' + q + '&geo=' + countryAPIres.country + '&lang=en&type=' + queryType.value + '&upload_date=' + queryDate.value + '&sort_by=' + querySort.value;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '89ce58ef37msh8e59da617907bbcp1455bajsn66709ef67e50',
          'x-rapidapi-host': 'yt-api.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        searchResults = await response.json();
        console.log(searchResults);

        displaySearchResults();

      } catch (error) {
        console.error(error);
      }
    }

    function containsWord(arr, word) {
      const lowerCaseWord = word.toLowerCase();
      return arr.some(element => element.toLowerCase().includes(lowerCaseWord));
    }

    function displaySearchResults() {
      var data = searchResults.data;
      var ref = searchResults.refinements;

      var res = document.querySelectorAll(".result_wrapper");
      if (res.length) {
        res.forEach((element) => {
          element.remove();
        });
      }

      var refStuff = document.querySelectorAll("div.refinements div.keywordsBtn");
      if (refStuff.length) {
        refStuff.forEach((element) => {
          element.remove();
        });
      }

      for (var k = 0; k < ref.length; k++) {
        var refText = document.createElement("p");
        var refBtn = document.createElement("div");

        refText.innerHTML = ref[k];

        refBtn.classList.add("keywordsBtn", "resBtn", "trs");

        refBtn.appendChild(refText);

        videoInfoElm.refinements.appendChild(refBtn);
      }

      for (var i = 0; i < data.length; i++) {
        if ((data[i].type === "video" || (data[i].type === "playlist" && !data[i].title.includes("Mix"))) && (!data[i].badges || (data[i].badges && !containsWord(data[i].badges, 'live')))) {

          var main = document.createElement("div");
          main.classList.add("result_wrapper", "trs", "cursor", "trsButtons", "noimg");
          main.title = data[i].title;
          if (data[i].type === "video") {
            main.setAttribute("data-url", "https://www.youtube.com/watch?v=" + data[i].videoId);
          } else {

            // FOR PLAYLISTS
          }
          main.onclick = function(event) {
            getURL(event.currentTarget.getAttribute("data-url"), true);
          };

          if (data[i].badges && data[i].badges.length) {
            var badgesRow = document.createElement("div");
            badgesRow.classList.add("badges_row");
            for (var j = 0; j < data[i].badges.length; j++) {
              var badge = document.createElement("div");
              badge.classList.add("badge", "otherResBtn", "resBtn", "trs");

              var badge_text = document.createElement("p");
              badge_text.innerHTML = data[i].badges[j];

              badge.appendChild(badge_text);
              badgesRow.appendChild(badge);
            }
          }

          var thumbnail = document.createElement("div");
          thumbnail.classList.add("thumbnail", "img");
          thumbnail.style.backgroundImage = "url('" + data[i].thumbnail[data[i].thumbnail.length - 1].url + "')";

          var title = document.createElement("h5");
          title.innerHTML = data[i].title;
          title.classList.add("overflow", "resultTitle");

          var channelTitle = document.createElement("p");
          channelTitle.innerHTML = data[i].channelTitle;
          channelTitle.classList.add("overflow", "resultChannelTitle");

          var duration = document.createElement("p");
          duration.innerHTML = data[i].lengthText;
          duration.classList.add("resultDuration");

          var date = document.createElement("p");
          date.innerHTML = data[i].publishedTimeText;
          date.classList.add("resultDate");

          var textDiv = document.createElement("div");
          textDiv.classList.add("resultText");

          if (badgesRow) {
            main.appendChild(badgesRow);
          }
          main.appendChild(thumbnail);
          main.appendChild(title);
          main.appendChild(channelTitle);

          textDiv.appendChild(duration);
          textDiv.appendChild(date);
          main.appendChild(textDiv);

          videoInfoElm.results.appendChild(main);
        }
      }
    }
    
    /*
    inp.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        document.getElementById("urlSubmit").click();
        // closeWrap(event, 'webupload');
        event.preventDefault();
      }
    });*/

    var searchPath = "url";
    const urlSearchBtn = document.querySelector(".resBtn.url");
    const querySearchBtn = document.querySelector(".resBtn.query");

    function setSearchPath(e) {
      if (inp.value.includes("#")) {
        inp.style.color = "#0073e6";
      } else {
        inp.style.color = "#303030";
      }
 
      inp.value = "";

      if (e === "query" || e.currentTarget.classList.contains("query")) {
        searchPath = "query";

        searchOptions.style.display = "block";

        urlSearchBtn.classList.remove("active");
        querySearchBtn.classList.add("active");

        inp.type = "text";
        if (e !== "query") {
          if ((searchResults !== null && getDeviceType === "desktop") || (searchResults === null)) {
            inp.focus();
          }
        }
      } else {
        searchPath = "url";

        searchOptions.style.display = "none";

        querySearchBtn.classList.remove("active");
        urlSearchBtn.classList.add("active");

        inp.type = "url";
        if ((searchResults !== null && getDeviceType === "desktop") || (searchResults === null)) {
          inp.focus();
        }
      }
    }

    inp.addEventListener('input', () => {
      if (searchPath === "query") {
        const text = inp.value;

        // Detect hashtags using a regex and wrap them in a span
        const hashtagRegex = /(?<!https?:\/\/[^\s]*)(#[\p{L}\p{N}_]+)/gu;
      
        if (text.match(hashtagRegex)) {
          inp.style.color = "#0073e6";
        } else {
          inp.style.color = "#303030";
        }
      } else {
        inp.style.color = "#303030";
      }
    });