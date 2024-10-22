
// network 

const fileSize = 5301699; // resource file size (in bytes)
var networkSpeed = 0;
var networkBandwidth = 0;
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

/////

var jitterVal = 0,
    packetLossVal = 0,
    rttVal = 0;

/////

const pingsCount = 10;


/////

// Usage example
let testFileUrl = 'https://ivansojivarghese.github.io/media-player/msc/networkSpeedEstimator.jpg'; // Replace with a valid URL to a known file
let fileSizeInBytes = 5301699; // Replace with the file size in bytes (e.g., 5MB)

let pingFileUrl = 'https://ivansojivarghese.github.io/media-player/msc/onlineResourceLocator.jpg'; 

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

                measureBandwidth(testFileUrl, fileSizeInBytes, function(bandwidth) {
                    if (bandwidth !== null) {
                        networkBandwidth = Number(bandwidth.toFixed(2));
                        // console.log('Estimated bandwidth: ' + bandwidth.toFixed(2) + ' Mbps, Network speed: ' + networkSpeed + ' MBps');
                    } else {
                        console.log('Failed to measure bandwidth');
                    }
                });   
                
                measureJitter(pingsCount, 1000);
                measurePacketLoss(testFileUrl);

                if (networkError) {
                    
                    if (!videoEnd && !refSeekTime && video.src !== "") {

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

            networkBandwidth = -1;
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

if (navigator.connection) {
    navigator.connection.addEventListener('change', function() {
        getNetworkInfo();
        estimateNetworkSpeed();
    });
}

/////////////////////////////////////

function measureBandwidth(url, fileSizeInBytes, callback) {
    // Record the start time
    let startTime = new Date().getTime();

    // Create a new XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url + '?cacheBuster=' + startTime, true); // Add cache buster to avoid caching
    xhr.responseType = 'arraybuffer'; // Download as binary data

    // When the download completes
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Record the end time
            let endTime = new Date().getTime();
            let duration = (endTime - startTime) / 1000; // Time in seconds

            // Calculate bandwidth in bits per second
            let bitsLoaded = fileSizeInBytes * 8; // Convert bytes to bits
            let bandwidthBps = bitsLoaded / duration; // Bits per second
            let bandwidthKbps = bandwidthBps / 1024; // Kilobits per second
            let bandwidthMbps = bandwidthKbps / 1024; // Megabits per second

            // Call the callback with the result
            callback(bandwidthMbps);
        } else {
            console.error('Error downloading the file');
            callback(null);
        }
    };

    // Handle error
    xhr.onerror = function() {
        console.error('Network error occurred');
        callback(null);
    };

    // Start the request
    xhr.send();
}

/////////////////////////////////////

let rttValues = [];
let jitterValues = []; 

// Function to send a network request and measure RTT
async function measureRTT() {
    const start = performance.now();
    
    try {
        // Send a network request
        await fetch(testFileUrl, { method: 'HEAD' });
        const end = performance.now();
        const rtt = end - start;
        rttValues.push(rtt);
        
        console.log(`RTT: ${rtt.toFixed(2)} ms`);

        // Calculate jitter once we have at least 2 RTT values
        if (rttValues.length > 1) {
            const jitter = Math.abs(rttValues[rttValues.length - 1] - rttValues[rttValues.length - 2]);
            jitterValues.push(jitter);
            console.log(`Jitter: ${jitter.toFixed(2)} ms`);
        }
    } catch (error) {
        console.error('Network request failed:', error);
    }
}

// Measure RTT and jitter multiple times
function measureJitter(repetitions, delay) {
    let count = 0;
    const intervalId = setInterval(() => {
        if (count >= repetitions) {
            clearInterval(intervalId);
            // Calculate the exact jitter value
            const totalJitter = jitterValues.reduce((sum, jitter) => sum + jitter, 0);
            const exactJitter = totalJitter / jitterValues.length;
            const totalRtt = rttValues.reduce((sum, rtt) => sum + rtt, 0);
            const exactRtt = totalRtt / rttValues.length;
            jitterVal = exactJitter;
            rttVal = exactRtt;
            console.log(`Exact Average Jitter: ${exactJitter.toFixed(2)} ms`);
            console.log(`Exact Average RTT: ${exactRtt.toFixed(2)} ms`);
            return;
        }

        measureRTT();
        count++;
    }, delay);
}

// Example usage: Measure jitter 10 times with 1-second intervals
// measureJitter(pingsCount, 1000);

/////////////////////////////////////////

async function measurePacketLoss(url, numPings = pingsCount) {
    let lostPackets = 0;
    let successfulPings = 0;

    for (let i = 0; i < numPings; i++) {
        try {
            const startTime = performance.now();
            await fetch(url, { method: 'HEAD', mode: 'no-cors' }); // Use 'HEAD' to minimize data transfer
            const endTime = performance.now();
            successfulPings++;
            console.log(`Ping ${i + 1}: Successful, Time: ${endTime - startTime}ms`);
        } catch (error) {
            lostPackets++;
            console.log(`Ping ${i + 1}: Lost`);
        }
    }

    const packetLossPercentage = (lostPackets / numPings) * 100;
    console.log(`Packet Loss: ${packetLossPercentage.toFixed(2)}%`);
    console.log(`Successful Pings: ${successfulPings}, Lost Packets: ${lostPackets}`);

    packetLossVal = packetLossPercentage;
}

// Example usage
// measurePacketLoss(testFileUrl);

getNetworkInfo();
estimateNetworkSpeed();