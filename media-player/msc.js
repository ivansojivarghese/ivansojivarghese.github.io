
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