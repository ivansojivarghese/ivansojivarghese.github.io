
// network 

const fileSize = 5301699; // resource file size (in bytes)
var networkSpeed = 0;
var networkSpeedClose = false;

var controller = new AbortController();
var signal = controller.signal;

var avgInt = 10000;
var networkIntRange = navigator.connection ? 30000 : 60000;

var networkSpeedInt = null;

var rtt = 0,
    downlink = 0,
    downlinkMax = 0,
    droppedFrames = 0,
    effectiveType = "",
    saveData = null,
    networkError = false;

const estimateNetworkSpeed = async() => { // estimate network speed
    try {
        if (!networkSpeedClose) {

            var startTime = new Date().getTime(); // start time of fetch
            const online = await fetch("https://ivansojivarghese.github.io/media-player/msc/networkSpeedEstimator.jpg", { // send a 'ping' signal to resource locator
                cache : "no-store",
                priority : "low",
                signal : controller.signal
            }).then(() => {
                var endTime = new Date().getTime(); // end time of fetch
                networkSpeed = (fileSize / ((endTime - startTime) / 1000)) / 1000000; // approx. network speed (in Mbps)

                if (networkError) {
                    
                    if (!videoEnd && !refSeekTime) {

                        // get seek time from timestamp
                        console.log("load again");
                        
                        refSeekTime = timeToSeconds(videoCurrentTime.textContent);
                        video.src = targetVideo.url;
                    }

                    if (networkSpeedInt !== null) {
                        clearInterval(networkSpeedInt);
                        networkSpeedInt = null;
                    }
                    if (networkSpeedInt === null) {
                        networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 
                    }
    
                    networkError = false;
                }

                networkSpeedClose = false;
            });
        }
        
    } catch (err) { // if network error
        if (!networkError) {
            controller = new AbortController();
            signal = controller.signal;

            networkError = true;

            networkSpeed = -1; // return 0 mbps
            networkSpeedClose = false;

            refSeekTime = video.currentTime;

            // start intervals to get network info
            if (networkSpeedInt !== null) {
                clearInterval(networkSpeedInt);
                networkSpeedInt = null;
            }
            if (networkSpeedInt === null) {
                networkSpeedInt = setInterval(estimateNetworkSpeed, avgInt); 
            }
        }
    }
}

if (networkSpeedInt === null) {
    networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 
}

function timeToSeconds(txt) { // REFERENCE: https://javascript.plainenglish.io/how-to-convert-hh-mm-ss-time-string-to-seconds-only-in-javascript-e11a0a4726d2#:~:text=Convert%20HH%3AMM%3ASS%20Time%20String%20to%20Seconds%20Only%20in%20JavaScript,-We%20can%20convert&text=const%20hms%20%3D%20'02%3A04,)%20*%2060%20%2B%20(%2Bseconds)%3B
    const hms = txt;
    const [hours, minutes, seconds] = hms.split(':');
    const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
    return totalSeconds;
}

function getNetworkInfo() {
    if (navigator.connection) {
        rtt = navigator.connection.rtt;
        downlink = navigator.connection.downlink;
        downlinkMax = navigator.connection.downlinkMax;
        effectiveType = navigator.connection.effectiveType;
        saveData = navigator.connection.saveData;
    }
}

getNetworkInfo();

if (navigator.connection) {
    navigator.connection.addEventListener('change', function() {
        getNetworkInfo();
        estimateNetworkSpeed();
    });
}