
// network 

const fileSize = 5301699; // resource file size (in bytes)
const speed = 0;

const estimateNetworkSpeed = async() => { // estimate network speed
    try {
        var startTime = new Date().getTime(); // start time of fetch
        const online = await fetch("https://ivansojivarghese.github.io/media-player/msc/networkSpeedEstimator.jpg", { // send a 'ping' signal to resource locator
            cache : "no-store",
            priority: "low"
        });
        var endTime = new Date().getTime(); // end time of fetch
        speed = (fileSize / ((endTime - startTime) / 1000)) / 1000000; // approx. network speed (in MBps)
        
    } catch (err) { // if network error
        speed = 0; // return 0 mbps
        // return true; // default true
    }
}