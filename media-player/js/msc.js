
    // REFERENCED FROM MEDIUM: https://medium.com/js-bytes/how-to-keep-your-screen-awake-using-javascript-aa15775d9bff

    let screenLock;

    function isScreenLockSupported() {
        return ('wakeLock' in navigator);
    }

    async function getScreenLock() {
        if (isScreenLockSupported()){
            // let screenLock;
            try {
                screenLock = await navigator.wakeLock.request('screen');
            } catch(err) {
                console.log(err.name, err.message);
            }
            // return screenLock;
        }
    }

    async function releaseScreenLock(screenLock) {
        await screenLock.release().then(() => {
            screenLock = null;
        });
    }

    // getScreenLock();

    window['__onGCastApiAvailable'] = function(isAvailable) {
        if (isAvailable) {
          initializeCastApi();
        }
      };
      
      function initializeCastApi() {
        cast.framework.CastContext.getInstance().setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });
      }

      function castMedia() {
        const session = cast.framework.CastContext.getInstance().getCurrentSession();
        const mediaInfo = new chrome.cast.media.MediaInfo('VIDEO_URL_HERE', 'video/mp4');
        const request = new chrome.cast.media.LoadRequest(mediaInfo);
        session.loadMedia(request).then(
          () => console.log('Media loaded successfully'),
          (error) => console.log('Error loading media', error)
        );
      }
      
      // document.getElementById('castButton').addEventListener('click', castMedia);