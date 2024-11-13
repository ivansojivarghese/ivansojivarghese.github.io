
// network 

const fileSize = 5301699; // resource file size (in bytes)
var networkSpeed = 0;
var networkBandwidth = 0;
var networkSpeedClose = false;

////////////

var backgroundPlay = false; // background audio playback
var pipEnabled = false;
var backgroundPlayInit = false;
var backgroundPlayManual = false;

////////////

var controller = new AbortController();
var signal = controller.signal;

var controllerRTT = new AbortController();
var signalRTT = controllerRTT.signal;

var controllerPacket = new AbortController();
var signalPacket = controllerPacket.signal;

////////////

var avgInt = 10000;
var networkIntRange = navigator.connection ? 180000 : 90000;

var networkSpeedInt = null;
var networkQuality = "";
var networkQualityRange = 0;

var networkParamInt = null;

var rtt = 0,
    downlink = 0,
    downlinkMax = 0,
    droppedFrames = 0,
    effectiveType = "",
    saveData = null,
    networkError = false;

/////

var networkAlternate = false;

/////

var jitterVal = 0,
    packetLossVal = 0,
    rttVal = 0;

/////

const pingsCount = 10;
const pingsInt = 120000;

/////

// Usage example
let testFileUrl = 'https://ivansojivarghese.github.io/media-player/msc/networkSpeedEstimator.jpg'; // Replace with a valid URL to a known file
let fileSizeInBytes = 5301699; // Replace with the file size in bytes (e.g., 5MB)

let pingFileUrl = 'https://ivansojivarghese.github.io/media-player/msc/onlineResourceLocator.png'; 

const estimateNetworkSpeed = async() => { // estimate network speed
    try {
        if (!networkSpeedClose && (!backgroundPlay || (pipEnabled && !networkAlternate) || !pipEnabled)) {

            if (!networkAlternate) {
                networkAlternate = true;
            }

            var startTime = new Date().getTime(); // start time of fetch
            const online = await fetch(testFileUrl, { // send a 'ping' signal to resource locator
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
                    if (networkParamInt !== null) {
                        clearInterval(networkParamInt);
                        networkParamInt = null;
                    }
                    if (networkSpeedInt === null) {
                        networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 
                    }
                    if (networkParamInt === null) {
                        networkParamInt = setInterval(function() {
                            measureJitter(pingsCount, 1000);
                            measurePacketLoss(pingFileUrl);
                        }, pingsInt);
                    }
    
                    networkError = false;
                    bufferAllow = true;
                }

                networkSpeedClose = false;
            });
        } else if (networkAlternate) {
            networkAlternate = false;
        }
        
    } catch (err) { // if network error
        if (!networkError) {
            controller = new AbortController();
            signal = controller.signal;

            controllerRTT = new AbortController();
            signalRTT = controllerRTT.signal;

            controllerPacket = new AbortController();
            signalPacket = controllerPacket.signal;

            networkError = true;
            bufferAllow = false;

            networkBandwidth = -1;
            networkSpeed = -1; // return 0 mbps
            networkSpeedClose = false;

            refSeekTime = video.currentTime;

            // start intervals to get network info
            if (networkSpeedInt !== null) {
                clearInterval(networkSpeedInt);
                networkSpeedInt = null;
            }
            if (networkParamInt !== null) {
                clearInterval(networkParamInt);
                networkParamInt = null;
            }
            if (networkSpeedInt === null) {
                networkSpeedInt = setInterval(estimateNetworkSpeed, avgInt); 
            }
            if (networkParamInt === null) {
                networkParamInt = setInterval(function() {
                    measureJitter(pingsCount, 1000);
                    measurePacketLoss(pingFileUrl);
                }, pingsInt);
            }
        }
    }
}

if (networkSpeedInt === null) {
    networkSpeedInt = setInterval(estimateNetworkSpeed, networkIntRange); 
}
if (networkParamInt === null) {
    networkParamInt = setInterval(function() {
        measureJitter(pingsCount, 1000);
        measurePacketLoss(pingFileUrl);
    }, pingsInt); 
}
/*
function timeToSeconds(txt) { // REFERENCE: https://javascript.plainenglish.io/how-to-convert-hh-mm-ss-time-string-to-seconds-only-in-javascript-e11a0a4726d2#:~:text=Convert%20HH%3AMM%3ASS%20Time%20String%20to%20Seconds%20Only%20in%20JavaScript,-We%20can%20convert&text=const%20hms%20%3D%20'02%3A04,)%20*%2060%20%2B%20(%2Bseconds)%3B
    const hms = txt;
    const [hours, minutes, seconds] = hms.split(':');
    const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
    return totalSeconds;
}*/

function timeToSeconds(txt) { // REFERENCE: CHATGPT
    const hms = txt || "0:0:0"; // Default to "0:0:0" if txt is empty or undefined
    const parts = hms.split(':').map(Number);

    let hours = 0, minutes = 0, seconds = 0;

    if (parts.length === 3) {
        // Format: HH:MM:SS
        [hours, minutes, seconds] = parts;
    } else if (parts.length === 2) {
        // Format: MM:SS
        [minutes, seconds] = parts;
    } else if (parts.length === 1) {
        // Format: SS
        [seconds] = parts;
    }

    const totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;
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
        measureJitter(pingsCount, 1000);
        measurePacketLoss(pingFileUrl);
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
        await fetch(pingFileUrl, { method: 'HEAD', signal : controllerRTT.signal });
        const end = performance.now();
        const rtt = end - start;
        rttValues.push(rtt);
        
        //console.log(`RTT: ${rtt.toFixed(2)} ms`);

        // Calculate jitter once we have at least 2 RTT values
        if (rttValues.length > 1) {
            const jitter = Math.abs(rttValues[rttValues.length - 1] - rttValues[rttValues.length - 2]);
            jitterValues.push(jitter);
            //console.log(`Jitter: ${jitter.toFixed(2)} ms`);
        }
    } catch (error) {
        console.error('Network request failed:', error);
    }
}

// Measure RTT and jitter multiple times
function measureJitter(repetitions, delay) {
    let count = 0;
    if (typeof backgroundPlay !== undefined) {
        if ((!backgroundPlay || (pipEnabled && !networkAlternate) || !pipEnabled)) {

            if (!networkAlternate) {
                networkAlternate = true;
            }

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
                    //console.log(`Exact Average Jitter: ${exactJitter.toFixed(2)} ms`);
                    //console.log(`Exact Average RTT: ${exactRtt.toFixed(2)} ms`);
                    return;
                }

                measureRTT();
                count++;
            }, delay);
        } else if (networkAlternate) {
            networkAlternate = false;
        }
    }
}

// Example usage: Measure jitter 10 times with 1-second intervals
measureJitter(pingsCount, 1000);

/////////////////////////////////////////

async function measurePacketLoss(url, numPings = pingsCount) {
    let lostPackets = 0;
    let successfulPings = 0;

    if ((!backgroundPlay || (pipEnabled && !networkAlternate) || !pipEnabled)) {

        if (!networkAlternate) {
            networkAlternate = true;
        }

        for (let i = 0; i < numPings; i++) {
            try {
                const startTime = performance.now();
                await fetch(url, { method: 'HEAD', mode: 'no-cors', signal : controllerPacket.signal }); // Use 'HEAD' to minimize data transfer
                const endTime = performance.now();
                successfulPings++;
                //console.log(`Ping ${i + 1}: Successful, Time: ${endTime - startTime}ms`);
            } catch (error) {
                lostPackets++;
                //console.log(`Ping ${i + 1}: Lost`);
            }
        }

        const packetLossPercentage = (lostPackets / numPings) * 100;
        //console.log(`Packet Loss: ${packetLossPercentage.toFixed(2)}%`);
        //console.log(`Successful Pings: ${successfulPings}, Lost Packets: ${lostPackets}`);

        packetLossVal = packetLossPercentage;
    } else if (networkAlternate) {
        networkAlternate = false;
    }
}

// Example usage
measurePacketLoss(pingFileUrl);

/////////////////////////////////////////

getNetworkInfo();
estimateNetworkSpeed();

/////////////////////////////////////////

// REFERENCE: CHATGPT sources

function determineNetworkQuality(speed, bandwidth, latency, jitter, packetLoss) {
    // Weights for each factor (adjustable based on priority)
    const speedWeight = 0.5;      // Speed is 50% of the rating
    const latencyWeight = 0.2;    // Latency is 20% of the rating
    const jitterWeight = 0.2;     // Jitter is 20% of the rating
    const packetLossWeight = 0.1; // Packet loss is 10% of the rating

    // Calculate Speed Rating (normalized against available bandwidth)
    let speedRating;
    const speedPercentage = (speed / bandwidth) * 100;

    if (speedPercentage >= 90) speedRating = 5;        // Very Good
    else if (speedPercentage >= 70) speedRating = 4;   // Good
    else if (speedPercentage >= 50) speedRating = 3;   // Average
    else if (speedPercentage >= 30) speedRating = 2;   // Bad
    else speedRating = 1;                              // Very Bad

    // Calculate Latency Rating
    let latencyRating;
    if (latency <= 20) latencyRating = 5;        // Very Good
    else if (latency <= 50) latencyRating = 4;   // Good
    else if (latency <= 100) latencyRating = 3;  // Average
    else if (latency <= 200) latencyRating = 2;  // Bad
    else latencyRating = 1;                      // Very Bad

    // Calculate Jitter Rating
    let jitterRating;
    if (jitter <= 20) jitterRating = 5;        // Very Good
    else if (jitter <= 30) jitterRating = 4;   // Good
    else if (jitter <= 50) jitterRating = 3;   // Average
    else if (jitter <= 100) jitterRating = 2;  // Bad
    else jitterRating = 1;                     // Very Bad

    // Calculate Packet Loss Rating
    let packetLossRating;
    if (packetLoss <= 0.5) packetLossRating = 5;       // Very Good
    else if (packetLoss <= 1) packetLossRating = 4;    // Good
    else if (packetLoss <= 2) packetLossRating = 3;    // Average
    else if (packetLoss <= 5) packetLossRating = 2;    // Bad
    else packetLossRating = 1;                         // Very Bad

    // Calculate final weighted score
    const finalScore = (speedRating * speedWeight) +
                       (latencyRating * latencyWeight) +
                       (jitterRating * jitterWeight) +
                       (packetLossRating * packetLossWeight);

    // Determine overall quality based on final score
    if (finalScore >= 4.5) return 'Very Good';
    if (finalScore >= 3.5) return 'Good';
    if (finalScore >= 2.5) return 'Average';
    if (finalScore >= 1.5) return 'Bad';
    return 'Very Bad';
}


