
var sI_1 = {},
    sI_2 = {},
    sI_3 = {};

var pwa_Ld = null,
    sectionScroll = false,
    sectionScrollPos = 0;

var btty = {
    level : 0,
    chargingTime : 0,
    dischargingTime : 0,
    charging : null
};

var rL = {
    el : document.getElementById("load_sc"), 
    r : document.getElementById("loadR"), // loading rings (container)
    p : document.getElementById("loadR-p"), // loading ring (primary)
    d : document.getElementById("loadR-e"), // loading ring (end)
    c : document.getElementById("loadR-s") // loading ring (secondary)
}

var githubCommitsres = {
    online : false, 
    val : 0
};

var normalAcc = 0,
    timerCountStepCheck = 0,
    timerCountStepInterval = null,
    timerCountStep = [],
    timerCounting = false,
    timerCount = 0,
    stepsCount = 0,
    stepsCountInterval = [],
    stepsCountTimes = [],
    betaAngle = 0,
    rotation = false,
    noStep = false,
    motion = false,
    oneStopMotion = false,
    motionInterval = null,
    motionVelocity = false,
    motionStride = 0,
    avgMotionStride = 0,
    refVelocity = false,
    motionEnd = false,
    motionEndInterval = null,
    motionStart = false,
    motionStartRef = 0,
    motionStartInterval = null,
    motionRef = false,
    velocityConstantRef = 0,
    velocityPoints = [],
    velocityError = false,
    velocityCycle = 0,
    velocityCycleLatch = false,
    velocityCycleLive = 0,
    velocityCycleMax = 0, // max velocity (per cycle)
    velocityCycleMaxPoints = [], // all points of max velocity (all cycles)
    velocityLive = 0, // live velocity
    velocityLiveCheck = false,
    velocityLiveInterval = null,
    velocityEstRef = 0,
    pitchRef = 0, // reference
    refZForce = 0; // reference z-force. (updates while stationary)

var nDeviceTimeout = null;

var motionType = "",
    commuteMode = false,
    motionTypeCommute = null,
    motionTypeStep = null;

var motionEndCount = 0,
    motionEndCountInterval = null,
    motionEndCountArray = [];

var accelerationCount = 0,
    accelerationDir = true,
    accelerationPoints = [],
    accelerationTimePoints = [],
    accelerationInterval = null;

var deviceMotion = false,
    deviceOrientation = false;

var urlParams = {};

const sections = document.querySelector('.pwa .sections');
// const navbarButtons = document.querySelectorAll('.pwa .navbar .button');

const batteryLevel = document.querySelector('.pwa .popups .batteryInfo .level');
const batteryStatus = document.querySelector('.pwa .popups .batteryInfo .status');
const batteryTime = document.querySelector('.pwa .popups .batteryInfo .time');

const deviceIP = document.querySelector('.pwa .popups .deviceInfo .ip');
const deviceIPType = document.querySelector('.pwa .popups .deviceInfo .ipType');
const deviceSFR = document.querySelector('.pwa .popups .deviceInfo .sfr');
const deviceVPN = document.querySelector('.pwa .popups .deviceInfo .vpn');

const networkType = document.querySelector('.pwa .popups .deviceInfo .networkType');
const networkEffType = document.querySelector('.pwa .popups .deviceInfo .networkEffType');
const networkDownlink = document.querySelector('.pwa .popups .deviceInfo .networkDownlink');
// const networkDownlinkMax = document.querySelector('.pwa .popups .deviceInfo .networkDownlinkMax');

const steps = document.querySelector('.pwa .popups .deviceInfo .steps');
const velocity = document.querySelector('.pwa .popups .deviceInfo .velocity');
const motionIcon = document.querySelector('.pwa .home .banner .motionIcon');


const commute = document.querySelector('.pwa .popups .deviceInfo .commute');
const speedX = document.querySelector('.pwa .popups .deviceInfo .speedX');
const motionX = document.querySelector('.pwa .popups .deviceInfo .motionX');
const stride = document.querySelector('.pwa .popups .deviceInfo .stride');
const vel = document.querySelector('.pwa .popups .deviceInfo .vel');
const velPoints = document.querySelector('.pwa .popups .deviceInfo .velPoints');
const acc = document.querySelector('.pwa .popups .deviceInfo .acc');
const accDir = document.querySelector('.pwa .popups .deviceInfo .accDir');
const sec = document.querySelector('.pwa .popups .deviceInfo .sec');

var oriHeight_L = null,
    tabs = ["home", "clicks", "code", "diary", "about"],
    // defTab = tabs[0],
    activeTab = null;

sI_1 = { // stats numerals
    a : 0, // initial   
    n : 97,
    _L : undefined, // spaces for _L (loop) iterations
    s : false // run (execution) status
};
sI_2 = {
    a : 0,
    n : 183, // hours
    _L : undefined,
    s : false
};
sI_3 = {
    a : 0,
    n : 245, // cappuccinos
    _L : undefined,
    s : false
};

screen.orientation.addEventListener("change", function() {
    resetMotionParams();
});

function resetMotionParams() {
    clearInterval(timerCountStepInterval);
    clearTimeout(motionEndInterval);
    clearInterval(accelerationInterval);
    clearTimeout(motionEndCountInterval);

    clearTimeout(nDeviceTimeout);

    motionType = "";
    commuteMode = false;
    motionTypeCommute = null,
    motionTypeStep = null;

    nDeviceTimeout = null;

    normalAcc = 0;
    timerCountStepCheck = 0;
    timerCountStepInterval = null;
    timerCountStep = [];
    timerCounting = false;
    timerCount = 0;
    stepsCount = 0;
    stepsCountInterval = [];
    stepsCountTimes = [];
    betaAngle = 0;
    rotation = false;
    noStep = false;
    motion = false;
    oneStopMotion = false;
    motionInterval = null;
    motionVelocity = false;
    motionStride = 0;
    avgMotionStride = 0;
    refVelocity = false;
    motionEnd = false;
    motionEndInterval = null;
    motionStart = false;
    motionStartRef = 0;
    motionStartInterval = null;
    motionRef = false;
    velocityConstantRef = 0;
    velocityPoints = [];
    velocityError = false;
    velocityCycle = 0;
    velocityCycleLatch = false;
    velocityCycleLive = 0;
    velocityCycleMax = 0; // max velocity (per cycle)
    velocityCycleMaxPoints = []; // all points of max velocity (all cycles)
    velocityLive = 0; // live velocity
    velocityLiveCheck = false;
    velocityLiveInterval = null;
    velocityEstRef = 0;
    pitchRef = 0; // reference
    refZForce = 0; // reference z-force. (updates while stationary)

    motionEndCount = 0;
    motionEndCountInterval = null;
    motionEndCountArray = [];

    accelerationCount = 0;
    accelerationDir = true;
    accelerationPoints = [];
    accelerationTimePoints = [];
    accelerationInterval = null;

    /*
    stepsCountInterval = [];
    stepsCountTimes = [];
    velocityPoints = [];
    accelerationPoints = [];
    accelerationDir = true;
    motionRef = false;
    motionStartRef = 0;*/
}

var docHide = false;
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        docHide = true;
        resetMotionParams();
    } else {
        docHide = false;
    }
});

var firstNBA = true,
    firstNBAcount = 1;

function navButtonActive(b, e, v) {
    var target = e.currentTarget || e;
    const buttons = document.querySelectorAll('.pwa .navbar .button');

    const fab = document.querySelector('.pwa .fab');
    const fab2 = document.querySelector('.pwa .fab2');
    const fab2i = document.querySelector('.pwa .fab2 .img_icon');

    if (firstNBA) {
        if (firstNBAcount < 3 && (b !== "home" || b !== "about")) {
            firstNBAcount++;
        } else {
            firstNBA = false;
        }
    }

    /*
    if (target.classList.contains("about") || target.classList.contains("about_dark")) {
        const profile_image = document.querySelector('.pwa .profile_image');
        e_Fd(profile_image, false);
    }*/

    if ((b === "about" || (b === "home" && fab2Check)) && 'share' in navigator) {
        fab.classList.remove("hide");
        fab.addEventListener("click", async () => {
            try {
                await navigator.share(aboutShareData);
            } catch (err) {
                console.log(err);
            }
        });
        if (fab2Check) {
            fab2.classList.remove("hide");
            if (fab2Close || firstNBA) {

                fab2i.classList.remove("close_w_img");
                fab2i.classList.add("home_w_img");
                fab2.style.backgroundColor = "";
                fab2Close = false;
            } else {

                fab2i.classList.remove("home_w_img");
                fab2i.classList.add("close_w_img");
                fab2.style.backgroundColor = "var(--negate_col)";
                fab2Close = true;
            }
            fab2.addEventListener("click", fab2Action);
        } else if (b !== "about") {
            fab2i.classList.remove("home_w_img");
            fab2i.classList.add("close_w_img");
            fab2.style.backgroundColor = "var(--negate_col)";
            fab2Close = true;
        }
    } else if (!fab2Check || (fab2Check && b !== "about" && b !== "home")) {
        fab.classList.add("hide");
        if (fab2Check) {
            fab2Close = true;
            fab2.classList.add("hide");
            fab2.removeEventListener("click", fab2Action);
        }
    }

    let url = new URL(window.location.href);
    let params = url.searchParams;
    // update nav1
    if (!v) {
        params.set("nav1", b);
    }
    url.search = params.toString();
    window.history.replaceState(null, null, url.search);

    if (target.classList.contains("hoverB") || v || (!v && fab2Check)) {

        const desActive = target.children[0].children[0]; // active/hover effect
        desActive.classList.add("hold");

        for (i = 0; i < buttons.length; i++) { // remove from other non-targets
            if (buttons[i] !== target) {
                if (((buttons[i].classList.contains("buttonActive") && !op.darkChange) || (!buttons[i].classList.contains("buttonActive") && op.darkChange)) && !buttons[i].classList.contains("swap")) {
                    var old;
                    for (j = 0; j < buttons[i].classList.length; j++) {
                        if (buttons[i].classList[j] !== "button" && buttons[i].classList[j] !== "buttonActive" && buttons[i].classList[j] !== "trs" && buttons[i].classList[j] !== "hoverB") {
                            const oriActive = buttons[i].children[0].children[0];
                            old = buttons[i].classList[j];
                            oriActive.classList.remove("hold");
                            break;
                        }
                    }
                    if (op.darkMode) {
                        buttons[i].children[0].style.backgroundImage = "url('../pwa/" + old + ".png')";
                    } else if (!op.darkMode) {
                        buttons[i].children[0].style.backgroundImage = "url('../pwa/" + old + ".png')";
                    }
                    e_Fd(buttons[i].children[0].children[0], true); 
                    buttons[i].classList.remove("buttonActive");

                    buttons[i].classList.add("hoverB");
                    buttons[i].addEventListener('mousemove', hoverInit);
                    buttons[i].addEventListener('mouseleave', hoverEnd);

                } else if (buttons[i].classList.contains("swap")) {

                    if (v) {
                        if (!op.darkChange) {
                            if (op.darkMode) {
                                buttons[i].classList.add("dark");
                            } else if (!op.darkMode) {
                                buttons[i].classList.remove("dark");
                            }
                        } else if (op.darkChange) {
                            if (op.darkMode) {
                                buttons[i].classList.remove("dark");
                            } else if (!op.darkMode) {
                                buttons[i].classList.add("dark");
                            }
                        }
                    }
                }
            }
        }

        if (!target.classList.contains("buttonActive") || (target.classList.contains("buttonActive") && (target.classList.contains(b) || target.classList.contains(b + "_dark")))) { // set on target
            if ((op.darkMode && op.darkChange && target.classList.contains("buttonActive")) || (!op.darkMode && !op.darkChange && !target.classList.contains("buttonActive"))) {
                target.children[0].style.backgroundImage = "url('../pwa/" + b + "_active.png')";
            } else if ((!op.darkMode && op.darkChange && target.classList.contains("buttonActive")) || (op.darkMode && !op.darkChange && !target.classList.contains("buttonActive"))) {
                target.children[0].style.backgroundImage = "url('../pwa/" + b + "_active_dark.png')";
            }

            if (!v && !target.classList.contains("buttonActive")) {
                navigator.vibrate(50); // vibrate
            }

            e_Fd(target.children[0].children[0], false); 
            target.classList.add("buttonActive");

            target.classList.remove("hoverB");
            target.removeEventListener('mousemove', hoverInit);

            if (!target.getAttribute("onclick") === 'toggleColorMode(event)') {
                cursorBig.classList.remove("extra");
            }
            hoverActive = false;
        }

        if (b && !v) { // navigate to section
            const mainSection = document.querySelector('.pwa .sections.scrollBarFunction');

            const targetSection = document.querySelector('.pwa .sections .' + b);
            const activeSection = (fab2Close && activeTab === 'home') ? document.querySelector('.pwa .sections .home') : (fab2Close && activeTab === 'about') ? document.querySelector('.pwa .sections .about') : document.querySelector('.pwa .sections .' + activeTab);

            activeSection.classList.remove("scrollBarContainer");
            activeSection.classList.add("d_n");

            mainSection.scrollTop = 0;

            targetSection.classList.remove("d_n");
            targetSection.classList.add("scrollBarContainer");

            // activeTab = b;
        }
        
        activeTab = b;
    }
}
/*
for (g = 0; g < navbarButtons.length; g++) {
    navbarButtons[g].addEventListener("mousedown", function(e) {
        if (!e.currentTarget.classList.contains("buttonActive")) {
            var target = e.currentTarget;
            e_Fd(target.children[0].children[0], true); 
            setTimeout(function() {
                target.children[0].style.transform = "scale(0.9)";
            }, 10);
        }
    });
    navbarButtons[g].addEventListener("mouseup", function(e) {
        if (!e.currentTarget.classList.contains("buttonActive")) {
            var target = e.currentTarget;
            target.children[0].style.transform = "none";
            setTimeout(function() {
                e_Fd(target.children[0].children[0], false); 
            }, 10);
        }
    });
}*/

function timeOfDay() {
    var d = new Date();
    time = d.getHours();
    if (time < 12) {
        return "morning";
    } else if (time < 17) {
        return "afternoon";
    } else if (time < 24) {
        return "evening";
    }
}

function networkInfo() {
    // device info

    if (clientAPIres.ipString) {
        deviceIP.innerHTML = clientAPIres.ipString;
    } else {
        deviceIP.remove();
    }
    if (clientAPIres.ipType) {
        deviceIPType.innerHTML = clientAPIres.ipType;
    } else {
        deviceIPType.remove();
    }
    if (clientAPIres.isBehindProxy !== null || clientAPIres.isBehindProxy !== undefined) {
        deviceVPN.innerHTML = "proxy usage: " + clientAPIres.isBehindProxy;
    } else {
        deviceVPN.remove();
    }

    // network info

    if (navigator.connection.type) {
        networkType.innerHTML = "type: " + navigator.connection.type;
    } else {
        networkType.remove();
    }
    if (navigator.connection.effectiveType) {
        var effType = (navigator.connection.effectiveType === "slow-2g") ? "2g" : navigator.connection.effectiveType;
        networkEffType.innerHTML = "effective type: " + effType;
    } else {
        networkEffType.remove();
    }
    if (navigator.connection.downlink) {
        networkDownlink.innerHTML = "downlink: " + navigator.connection.downlink + " Mbps";
    } else {
        networkDownlink.remove();
    }/*
    if (navigator.connection.downlinkMax) {
        networkDownlinkMax.innerHTML = "max downlink: " + navigator.connection.downlinkMax + " Mbps";
    } else {
        networkDownlinkMax.remove();
    }*/
}

// REFERENCED FROM Pascal Z, https://stackoverflow.com/questions/33673409/html5-javascript-calculate-device-speed-using-devicemotion-deviceorientation
/*
if (!('DeviceMotionEvent' in window) && !('DeviceOrientationEvent') in window) { 
    steps.remove();
}*/

function motionTrendCal(arr) {
    var key = [],
        trendArr = [],
        trend = "";
    for (j = 0; j < arr.length; j++) {
        if (j === 0) {
            key[key.length] = arr[j];
        } else {
            var val = arr[j],
                eVal = key[key.length - 1];
            if (val > eVal) {
                trendArr[trendArr.length] = "incre";
            } else if (val < eVal) {
                trendArr[trendArr.length] = "decre";
            } else {
                trendArr[trendArr.length] = "const";
            }
            key[key.length] = val;
        }
    }
    if ((trendArr[0] === "incre" && trendArr[1] === "decre") || (trendArr[0] === "decre" && trendArr[1] === "incre") || (trendArr[0] === "const" && trendArr[1] === "const")) {
        var diff1 = Math.abs(key[1] - key[0]),
            diff2 = Math.abs(key[1] - key[2]);
        if (Math.abs(diff2 - diff1) > 1) {
            if (diff1 > diff2) {
                trend = "incre";
            } else {
                trend = "decre";
            }
        } else {
            trend = "const";
        }
    } else if ((trendArr[0] === "decre" && trendArr[1] === "decre") || (trendArr[0] === "decre" && trendArr[1] === "const") || (trendArr[0] === "const" && trendArr[1] === "decre")) {
        trend = "decre";
    } else if ((trendArr[0] === "incre" && trendArr[1] === "incre") || (trendArr[0] === "incre" && trendArr[1] === "const") || (trendArr[0] === "const" && trendArr[1] === "incre")) {
        trend = "incre";
    }
    return trend;
}

// Javascript program to calculate the 
// standard deviation of an array
// REFERENCE: https://www.geeksforgeeks.org/how-to-get-the-standard-deviation-of-an-array-of-numbers-using-javascript/
function StandardDeviation(arr) {
 
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr) => {
        return acc + curr
    }, 0) / arr.length;
 
    // Assigning (value - mean) ^ 2 to
    // every array item
    arr = arr.map((k) => {
        return (k - mean) ** 2
    });
 
    // Calculating the sum of updated array 
    let sum = arr.reduce((acc, curr) => acc + curr, 0);
 
    // Calculating the variance
    let variance = sum / arr.length
 
    // Returning the standard deviation
    return Math.sqrt(sum / arr.length)
}

// REFERENCE: https://www.w3resource.com/javascript-exercises/javascript-array-exercise-31.php
// Function to remove an element from an array
function remove_array_element(array, n) {
    // Find the index of the element 'n' in the array
    var index = array.indexOf(n);
    
    // Check if the element exists in the array (index greater than -1)
    if (index > -1) {
      // Remove one element at the found index
      array.splice(index, 1);
    }
    
    // Return the modified array
    return array;
  }

function similarInterval(a, b, t) {
    const diff = Math.abs(a - b);
    const res = diff > t ? false : true;
    return res;
}

function similarAngle(t, r, d) {
    const diff = Math.abs(t - r);
    const res = diff > d ? false : true;
    return res;
}

function filteredAcceleration(r) { // filters raw data 
    if (motionStart && r > 0 && r < 0.5) { // when accelerating from 0 velocity
        var output = r;
        if (output > motionStartRef && motionStride === 0) {
            motionStartRef = output;
        }
        return output;
    } else if ((!motionStart && r > -0.5 && r < 0.5) || (motionStart && r === 0)) { // almost constant velocity 
        return 0; 
    } else if (r > motionStartRef) { // get max recorded pos. acceleration during each motion
        var output = r;
        if (motionStride === 0) {
            motionStartRef = output;
        }
        return output;
    } else if (motionStartRef !== 0 && ((r > 0 && r < motionStartRef) || r === motionStartRef)) { // acceleration
        var output = r;
        return output;
    } else if (motionStartRef > 0 && !motionStart && (r < 0 && (r >= (-1 * motionStartRef)))) { // normal decceleration only when acceleration has been detected
        var output = r,
            strideTrends = (stepsCountTimes.length >= 3) ? [
                stepsCountTimes[stepsCountTimes.length - 1],
                stepsCountTimes[stepsCountTimes.length - 2],
                stepsCountTimes[stepsCountTimes.length - 3]
            ] : null,
            strideMean = mean(stepsCountTimes),
            strideDeviation = StandardDeviation(stepsCountTimes);
        if (!motionEnd && strideTrends !== null) { // in constant motion

            // TRACK: 
            // Acceleration levels, modify direction in alternate modes

            // CHECK:
            // 2) stride intervals become shorter, higher frequency
            // 2.1) get last-calculated step-time + preceeding 2 ones

            var reduction = true,
                redMod = 0,
                margin = 0,
                percentile = 0;
            for (a = 0; a < strideTrends.length - 1; a++) {
                if ((strideTrends[a] > (strideMean - (3 * strideDeviation))) && (strideTrends[a] < (strideMean + (3 * strideDeviation)))) { // constant reduction in step-intervaling time needed
                    reduction = false; // NO reduction if within range
                    break;
                } else if (similarInterval(strideTrends[a], strideMean, 100)) { // outliers, but similar in abs. value
                    reduction = false;
                    break;
                } else if (strideTrends[a] > (strideMean * 1.5)) { // half-outliers
                    redMod = 0.25;
                    break;
                } else { // complete outliers
                    redMod = 0.75;
                    remove_array_element(stepsCountTimes, stepsCountTimes[stepsCountTimes.length - (a + 1)]); // remove from array
                    break;
                }
            }
            if (!reduction) { // no reductions, constant velocity (minimal decceleration)
                margin = output - (-1 * motionStartRef);
                percentile = ((Math.abs(margin) / motionStartRef) <= 1) ? (Math.abs(margin) / motionStartRef) : 1;
                output = output * (1 - percentile) * percentile;
            } else { // 2 reductions, possible decceleration
                margin = output - (-1 * motionStartRef);
                percentile = ((Math.abs(margin) / motionStartRef) <= 1) ? (Math.abs(margin) / motionStartRef) : 1;
                output = (output - ((1 - percentile) * output)) * redMod;
            }

            // ONLY deccelerate when assumed
        } 

        return output;
    }

    if (motionStart && accelerationPoints.length >= 3) { // checks for constant velocity (from accelerating to constant)
        var incrVelCheck = [false, false, false];
        for (i = 0, j = 0; i < accelerationPoints.length; i++) {
            if (accelerationPoints[i] > 0) {
                if (j < incrVelCheck.length) {
                    incrVelCheck[j] = true;
                    j++;
                } else { // if 3 positives in a row, break
                    break;
                }
            } else if (accelerationPoints[i] < 0) { // if 1 negative in between, break
                break;
            }
        }
        motionStart = false;
        for (k = 0; k < incrVelCheck.length; k++) {
            if (incrVelCheck[k] === false) {
                motionStart = true;
                break;
            }
        }
        if (!motionStart) { // estimate stride of user
            motionStride = velocityLive * stepsCountTimes[stepsCountTimes.length - 1];
        }
    } else if (!motionStart && accelerationPoints.length >= 3) { // keep updating user stride
        motionStride = motionStartRef * stepsCountTimes[stepsCountTimes.length - 1];
    }

    if (!motionStart || refVelocity) {
        // START 3-SEC TIMER to check for steps frequencies

        if (timerCountStepInterval === null) {
            timerCounting = true;
            timerCountStepInterval = setInterval(function() {
                timerCountStep[timerCountStep.length] = timerCount;
                timerCount = 0;
            }, 3000);
        }
    }
    
    if ((motionStartRef === 0 && r < motionStartRef) || (motionStartRef > 0 && r < 0 && motionStart)) { // if negative acceleration detected before positive, re-calibration needed
        var output = Math.abs(r); // make to positive
        if (output > motionStartRef && motionStride === 0) {
            motionStartRef = output;
        }
        return output;
    } else if (r < (-1 * motionStartRef)) { // heavy decceleration (tuning needed)
        var margin = r - (-1 * motionStartRef),
            percentile = ((Math.abs(margin) / motionStartRef) <= 1) ? (Math.abs(margin) / motionStartRef) : 1;
        
        return (motionStartRef * percentile * -1); // return a percentile of exceeding values (neg. acceleration)
    } else if (r < 0 && r >= (-1 * motionStartRef)) {
        var output = r;
        return output;
    }
}

window.addEventListener('devicemotion', function(event) { // estimate walking steps

    if (event.acceleration.x || event.acceleration.y || event.acceleration.z) {
        deviceMotion = true;
    } 

    const mStoggle = document.querySelector('.pwa .motionSenseToggle');
    if (mStoggle.classList.contains("hide") && deviceOrientation) {
        mStoggle.classList.remove("hide");
    }

    var velocityUnit = (tempUnit(ipAPIres.country.iso_code) === "metric") ? "m/s" : "ft/s"; // m/s or ft/s
    var nDeviceAcc = Math.sqrt(Math.pow(event.acceleration.y, 2) + Math.pow(event.acceleration.x, 2));

    if (ipAPIres && ipAPIres.online && clientAPIres.online && !shaked && !rotation && !docHide) {

        var gAcc = 9.81, // default acceleration due to gravity (m/s^2)
            strideDis = 0.72, // avg. step stride (m)
            zGAcc = event.accelerationIncludingGravity.z, // acceleration (z-axis) including gravity
            yAcc = event.acceleration.y, // forward acceleration
            xAcc = event.acceleration.x, // "" alternate orientations
            pitch = Math.abs(betaAngle), // pitch of device
            pitchRad = pitch * (Math.PI / 180),
            cosVal = Math.cos(pitchRad),
            resAcc = gAcc / cosVal, // resultant acceleration with pitch angle
            resZForce = Math.round((zGAcc / resAcc) * 100), // z-force on user (live)
            zThreshold = 40, // threshold for a 'step' - based on z-acc flunctuations
            velocityEst = 0, // velocity estimate(s)
            velocitySign = "~"; // velocity sign

        avgMotionStride = (tempUnit(ipAPIres.country.iso_code) === "metric") ? strideDis : (strideDis * 3.2808);

        if (screen.orientation.angle === 0 || screen.orientation.angle === 180) {
            normalAcc = filteredAcceleration(yAcc);
        } else if (screen.orientation.angle === 90 || screen.orientation.angle === 270) {
            normalAcc = filteredAcceleration(xAcc);
        }

        if (accelerationDir) {
            normalAcc = Math.abs(normalAcc); // positive
        } else { // negative
            normalAcc = (normalAcc < 0) ? normalAcc : (-1 * normalAcc);
        }

        if (!Math.round(event.acceleration.x) && !Math.round(event.acceleration.y) && !Math.round(event.acceleration.z)) { // motionless in acc.
            pitchRef = pitch;
            refZForce = resZForce; // update while still
            motionRef = true;
            if (!motionVelocity) { // at first run
                accelerationInterval = setInterval(function() { // get acceleration data every sec.

                    if (accelerationCount < 3) {
                        accelerationCount++;
                    } else {
                        accelerationDir = (accelerationDir) ? false : true;
                        accelerationCount = 0;
                    }

                    accelerationPoints[accelerationPoints.length] = (tempUnit(ipAPIres.country.iso_code) === "metric") ? normalAcc : (normalAcc * 3.2808); // m or ft if needed
                
                    velocityPoints[velocityPoints.length] = Math.abs(velocityLive); 

                    if (Math.abs(velocityLive) > velocityCycleMax) {
                        velocityCycleMax = Math.abs(velocityLive);
                        
                        velocityCycleMaxPoints[velocityCycleLive] = Math.abs(velocityLive);
                    }

                }, 1000);
                motionVelocity = true; 
            } else if (!refVelocity && oneStopMotion) { // second run (after 1 sec of constant)
                refVelocity = true;
                clearInterval(accelerationInterval); // reset
                accelerationPoints = [];
                velocityPoints = [];
                stepsCountInterval = [];
                stepsCountTimes = [];
                accelerationInterval = setInterval(function() { // get acceleration data every sec.

                    if (accelerationCount < 3) {
                        accelerationCount++;
                    } else {
                        accelerationDir = (accelerationDir) ? false : true;
                        accelerationCount = 0;
                    }

                    accelerationPoints[accelerationPoints.length] = (tempUnit(ipAPIres.country.iso_code) === "metric") ? normalAcc : (normalAcc * 3.2808); // m or ft if needed

                    velocityPoints[velocityPoints.length] = Math.abs(velocityLive); 

                    if (Math.abs(velocityLive) > velocityCycleMax) {
                        velocityCycleMax = Math.abs(velocityLive);

                        velocityCycleMaxPoints[velocityCycleLive] = Math.abs(velocityLive);
                    }
                }, 1000);
            } 

            if (motion && motionInterval === null) { //

                motionEndInterval = setTimeout(function() {

                    motionStartRef = 0;
                    accelerationPoints = [];
                    accelerationDir = false;
                    velocityPoints = [];
                    stepsCountInterval = [];
                    stepsCountTimes = [];

                    motionEnd = true;
                    motionEndCount++;

                    // motionX.innerHTML = motionEnd + ", reset";
                    clearTimeout(motionEndInterval);
                }, 100);

                motionInterval = setTimeout(function() {
                    velocityEst = 0;
                    velocityEstRef = 0;
                    motion = false; // make false after 1 sec. (if not other motion detected)

                    motionEnd = false;

                    accelerationDir = true;
                    // motionX.innerHTML = motionEnd;
                    oneStopMotion = true;
                    clearTimeout(motionInterval);

                    motionInterval = null;
                }, 1000);

            } else if (!motion && !motionEnd) { // at rest (on a table, etc.)

                motionStartRef = 0;
                accelerationPoints = [];
                accelerationDir = true;
                velocityPoints = [];
                stepsCountInterval = [];
                stepsCountTimes = [];

                velocityCycleMax = 0;
                velocityCycle = 0;
                velocityCycleLive = 0;
                velocityCycleMaxPoints = []

                velocityEst = 0;
                velocityConstantRef = 0;
                velocityEstRef = 0;

                if (motionType !== "commute") {
                    if (nDeviceAcc < 0.5) { // if nDeviceAcc is almost 0 for at least 3 sec.
                        if (nDeviceTimeout === null) {
                            nDeviceTimeout = setTimeout(function() {
                                commuteMode = false;
                                nDeviceTimeout = null;
                            }, 3000);
                        }
                    } else {
                        clearTimeout(nDeviceTimeout);
                        nDeviceTimeout = null;
                    }
                    motionType = "";
                }
            }

        } else if (motionRef && similarAngle(pitch, pitchRef, 20)) { // with reference (and similar pitch, within 20deg of pitchRef)
            if (!shaked && !rotation) {
                const zDiff = resZForce - refZForce;
                if (zDiff <= 10) {
                    noStep = false;
                } else if (zDiff > zThreshold && !noStep) {
                    var time = new Date().getTime();
                    if (stepsCountInterval.length > 0) {
                        stepsCountTimes[stepsCountTimes.length] = time - stepsCountInterval[stepsCountInterval.length - 1];
                    }
                    stepsCountInterval[stepsCountInterval.length] = time;
                    stepsCount++;
                    if (timerCounting) {
                        timerCount++;
                    }
                    noStep = true;
                }
            }
            motion = true;
            motionStart = true;

            if (motionInterval !== null) {
                clearTimeout(motionInterval);
                motionInterval = null;
            }

            motionEnd = false;

            // motionX.innerHTML = motionEnd;
            if (motionEndInterval !== null) {
                clearTimeout(motionEndInterval);
                motionEndInterval = null;
            }
        } else {
            motion = true;
            motionStart = true;

            if (motionInterval !== null) {
                clearTimeout(motionInterval);
                motionInterval = null;
            }

            motionEnd = false;

            // motionX.innerHTML = motionEnd;
            if (motionEndInterval !== null) {
                clearTimeout(motionEndInterval);
                motionEndInterval = null;
            }
            motionRef = false; // re-calibrate
        }

        steps.innerHTML = "steps: " + stepsCount;
        // speedX.innerHTML = motion;
        
        if (refVelocity && motionVelocity) { // absolute velocity (from stationary)
            let i = 0;
            var velocityTotal = 0;
            var threshold = 0.2;

            while (i < accelerationPoints.length) {
                var addOn = 0;
                if (i < 1) {
                    addOn = ((accelerationPoints[i] + 0) / 2) * 1;
                } else {
                    addOn = ((accelerationPoints[i] + accelerationPoints[i - 1]) / 2) * 1;
                }
                velocityTotal += addOn;
                i++;
            }

            if (!velocityCycleLatch && (velocityTotal <= 0 || (velocityTotal <= (velocityCycleMax - (velocityCycleMax * threshold)))) && !motionStart && !motionEnd) { // reset if unexpected velocity error occurs
                accelerationPoints = [];
                accelerationDir = true;
                velocityTotal = 0;
                velocityError = true;

                // reset max
                velocityCycleMax = 0;
                velocityCycleLive++;
                if (velocityCycleLive > 1) { // add cycle
                    velocityCycle++;
                }
                velocityCycleLatch = true;
            } else {
                if (velocityError && accelerationPoints.length >= 3) {
                    velocityError = false;
                    velocityCycleLatch = false;
                }
                velocityLive = Number(velocityTotal.toFixed(1));
            }

            var v = (velocityCycleMaxPoints.length) ? velocityCycleMaxPoints[velocityCycle] : 0;
            var inRange = (Math.abs(velocityLive - v) < (threshold * v)) ? true : false;
            var velMag = inRange ? velocityLive : (velocityLive < v) ? (v - (v * threshold)) : (v + (v * threshold));
            var velLimiter = "";

            if ((timerCountStep.length > timerCountStepCheck)) {
                timerCountStepCheck = timerCountStep.length;
                if (velocityConstantRef === 0) {
                    velocityConstantRef = velMag;
                }
                if (timerCountStep.length >= 3) {
                    var motionTrend = [timerCountStep[timerCountStep.length - 3],
                                        timerCountStep[timerCountStep.length - 2],
                                        timerCountStep[timerCountStep.length - 1]
                                    ],
                        motionRes = motionTrendCal(motionTrend);
                    if (motionRes === "const") {
                        // stride.innerHTML = "const";
                    } else if (motionRes === "decre") {
                        var diff = Math.abs(motionTrend[0] - motionTrend[2]),
                            velReduction = (diff * avgMotionStride) / 3;
                        velocityConstantRef -= velReduction;
                        // stride.innerHTML = "decre";
                    } else if (motionRes === "incre") {
                        var diff = Math.abs(motionTrend[2] - motionTrend[0]),
                            velIncrease = (diff * avgMotionStride) / 3;
                        velocityConstantRef += velIncrease;
                        // stride.innerHTML = "incre";
                    }
                } 
                if (velocityConstantRef < 0) {
                    velocityConstantRef = 0;
                }
                velocityEst = velocityConstantRef / 2;
                velocityEst = (velocityEst >= 0) ? (velocityEst <= 10) ? velocityEst : 10.1 : 0;
                if (velocityEst === 10.1) {
                    velocityEst = 10;
                    velLimiter = "+";
                } else {
                    velLimiter = "";
                }
                velocityEstRef = velocityEst;
                velocity.innerHTML = "velocity: " + velocityEst.toFixed(1) + velLimiter + " " + velocityUnit; 
            } 

            velocityEst = velocityTotal;
            velocityEst = (velocityEst > 0) ? (velocityEst < 10) ? velocityEst.toFixed(1) : "10+" : (velocityEst > -10) ? Math.abs(velocityEst.toFixed(1)) : "10+";
            velocityEstRef = velocityEst;

        } else if (motionVelocity) { // relative velocity (from point in motion) - change in velocity over time
            if (accelerationPoints.length === 1) { // take last data point (only single)
                var accelerationDelta = accelerationPoints[accelerationPoints.length - 1] + 0;
                velocityEst = (accelerationDelta / 2) * 1; // area of trapezoid ref.
                velocitySign = (velocityEst > 0) ? "+" : (velocityEst === 0) ? "~" : "";
            } else if (accelerationPoints.length > 1) { // take last 2 data points (double)
                var accelerationTango = accelerationPoints[accelerationPoints.length - 1] + accelerationPoints[accelerationPoints.length - 2];
                velocityEst = (accelerationTango / 2) * 1; // area of trapezoid ref.
                velocitySign = (velocityEst > 0) ? "+" : (velocityEst === 0) ? "~" : ""; //
            }

            velocityEst = (velocityEst >= 0) ? (velocityEst < 10) ? velocityEst : 10 : (velocityEst > -10) ? velocityEst : -10;
            velocityEstRef = velocityEst;
            velocity.innerHTML = "Δ velocity: " + velocitySign + velocityEst.toFixed(1) + " " + velocityUnit; 

        } /*else {
            velocity.innerHTML = "velocity: " + velocityEst.toFixed(1) + " " + velocityUnit; 
        }*/

        speedX.style.backgroundColor = "purple"; //
        speedX.style.color = "white"; //

    } else {
        velocityEst = 0;
        velocityEstRef = 0;
        velocity.innerHTML = "velocity: " + velocityEst.toFixed(1) + " " + velocityUnit; 
        // resetMotionParams();
    }

    if (motion) {
        if (motionEndCountInterval === null) {
            motionEndCountInterval = setTimeout(function() {

                var stepsArray = [timerCountStep[timerCountStep.length - 3],
                            timerCountStep[timerCountStep.length - 2],
                            timerCountStep[timerCountStep.length - 1]
                        ],
                    walking = true,
                    walkingChange = false,
                    walkingCount = 0;

                for (var i = 0; i < stepsArray.length; i++) {
                    if (stepsArray[i] < 2) {
                        walking = false;
                        break;
                    }
                }
                for (var i = 0; i < stepsArray.length; i++) {
                    if (stepsArray[i] < 2) {
                        walkingCount++;
                    }
                }
                if (walkingCount > 0 && walkingCount < 3) {
                    walkingChange = true;
                }

                motionEndCountArray[motionEndCountArray.length] = motionEndCount;
                motionEndCount = 0;
                clearTimeout(motionEndCountInterval);
                motionEndCountInterval = null;

                if (walking) { // IF WALKING, commuteMode to false
                    motionEndCount = 0;
                    clearTimeout(motionEndCountInterval);
                    motionEndCountInterval = null;
                    motionEndCountArray = [];

                    commuteMode = false;
                } else {

                    // ANALYSE FOR COMMUTE MODE HERE

                    let b = 0;
                    while (b < motionEndCountArray.length) {
                        if (motionEndCountArray[b] > 2 && nDeviceAcc > 1 && !walkingChange) { // potential commute mode
                            commuteMode = true;
                            // motionType = "commute";

                            // 0 velocity
                            // no steps

                            velocityConstantRef = 0;
                            velocityEst = 0;
                            velocityEstRef = 0;
                            timerCountStep = [];

                            velocity.innerHTML = "velocity: " + velocityEst.toFixed(1) + " " + velocityUnit; 

                            /*
                            if (b === (motionEndCountArray.length - 1)) {
                                if (commuteMode) {
                                    commuteMode = false;
                                }
                            } else {
                                if (commuteMode) {
                                    velocityConstantRef = 0;
                                    velocityEst = 0;
                                    velocityEstRef = 0;
                                }
                            }*/

                            break;
                        }
                        b++;
                    }
                }

                /*
                let g = 0;
                var k = "";
                while (g < motionEndCountArray.length) {
                    k += motionEndCountArray[g] + ", ";
                    g++;
                }
                vel.innerHTML = k;*/

            }, 3000);
        }
    } /*else {
        motionEndCount = 0;
        clearTimeout(motionEndCountInterval);
        motionEndCountInterval = null;
        motionEndCountArray = [];

        commuteMode = false;
    }*/

    // commute.innerHTML = "commute: " + commuteMode;
    // sec.innerHTML = nDeviceAcc;

}, false);

// var commuteModeRevert = null;

function fab2Action() {
    const aboutBtn = document.querySelector('.pwa .navbar .button.about') || document.querySelector('.pwa .navbar .button.about_dark');
    if (fab2Close) { // close
        navButtonActive('about', aboutBtn, false);
        fab2Close = false;
    } else { // home (open)
        navButtonActive('home', aboutBtn, false);
        fab2Close = true;
    }
}

function motionUXChange(m, o) {
    const homeBtn = document.querySelector('.pwa .navbar .button.home') || document.querySelector('.pwa .navbar .button.home_dark');
    const aboutBtn = document.querySelector('.pwa .navbar .button.about') || document.querySelector('.pwa .navbar .button.about_dark');
    const navbar = document.querySelector('.pwa .navbar');
    if (m !== o) {
        if (m === "walk" || m === "commute") {
            if (activeTab !== 'about') {
                if (activeTab === 'home') {
                    fab2Close = true; // show 'close' on fab2
                    navButtonActive('about', aboutBtn, true);
                    activeTab = "home";
                } else {
                    fab2Close = false; // show 'home' on fab2
                }
            }
            homeBtn.classList.add("d_n");
            oldMotionType = m;
            fab2Check = true;
            navbar.classList.add("fab2_nav");
            navbar.classList.remove("outView");
        } else if (m === "run") {
            navButtonActive('home', homeBtn, false);
            navbar.classList.add("outView");
            oldMotionType = "run";
        } else if (m === "") {
            if (activeTab === "home") {
                navButtonActive('home', homeBtn, false);
            }
            if (activeTab !== "about") {
                fab.classList.add("hide");
            }
            fab2.classList.add("hide");
            homeBtn.classList.remove("d_n");
            oldMotionType = "";
            fab2Check = false;
            navbar.classList.remove("outView");
            navbar.classList.remove("fab2_nav");
        }
    }
}

window.setInterval(function() {
    determineMotionType();

    // vel.innerHTML = motionType;

    if (toggles.motionSense) {
        var motionCat = motionType,
            keyW = ["run", "walk", "commute"],
            exist = findClasses(motionIcon.children[0].classList, keyW);
        if (motionCat !== "") {
            var target = ""; 
            if (motionCat === "walk") {
                target = (!op.darkMode) ? "walk_img" : "walk_w_img";
                motionUXChange("walk", oldMotionType);
            } else if (motionCat === "run") {
                target = (!op.darkMode) ? "run_img" : "run_w_img";
                motionUXChange("run", oldMotionType);
            } else if (motionCat === "commute") {
                target = (!op.darkMode) ? "commute_img" : "commute_w_img";
                motionUXChange("commute", oldMotionType);
            } 
            motionIcon.classList.remove("d_n");
            setTimeout(function() {
                e_Fd(motionIcon, false);
            }, op.t);
            if (exist) {
                motionIcon.children[0].classList.remove(exist);
            }
            if (target) {
                motionIcon.children[0].classList.add(target);
            }
        } else {
            motionUXChange("", oldMotionType);
            e_Fd(motionIcon, true);
            if (exist) {
                setTimeout(function() {
                    motionIcon.children[0].classList.remove(exist);
                    motionIcon.classList.add("d_n");
                }, op.t);
            }
        }
    }
}, op.te);

window.addEventListener('deviceorientation', function(event) { // get rotation of device

    if (event.alpha || event.beta || event.gamma) {
        deviceOrientation = true;
    } 

    const mStoggle = document.querySelector('.pwa .motionSenseToggle');
    if (mStoggle.classList.contains("hide") && deviceMotion) {
        mStoggle.classList.remove("hide");
    } 

    if (!docHide) {
        betaAngle = event.beta;

        var bVal = Math.abs(Math.round(event.beta)),
            gVal = Math.abs(Math.round(event.gamma));

        if (bVal > 90 || gVal > 45) { // if angle of mobile device greater than 90deg, OR tilt greater abs' 45deg
            rotation = true;
        } else {
            rotation = false;
        }
    }

}, false);

function findClasses(cl, ar) {
    var output = "";
    for (i = 0; i < cl.length; i++) {
        for (j = 0; j < ar.length; j++) {
            if (cl[i].includes(ar[j])) {
                output = cl[i];
                break;
            }
        }
    }
    return output;
}

function determineMotionType() { // either NO motion, walk, run or commute
    if (!commuteMode && timerCountStep.length >= 3) { // if in step motion, ensure hold of _ sec to confirm
        clearTimeout(motionTypeCommute);
        motionTypeCommute = null;
        if (motionTypeStep === null) {
            motionTypeStep = setTimeout(function() {
                var stepsArray = [timerCountStep[timerCountStep.length - 3],
                            timerCountStep[timerCountStep.length - 2],
                            timerCountStep[timerCountStep.length - 1]
                        ],
                    walking = true,
                    Lv1t = (tempUnit(ipAPIres.country.iso_code) === "metric") ? 0.5 : (0.5 * 3.2808),
                    Lv2t = (tempUnit(ipAPIres.country.iso_code) === "metric") ? 1 : (1 * 3.2808),
                    Lv3t = (tempUnit(ipAPIres.country.iso_code) === "metric") ? 2.5 : (2.5 * 3.2808);
                for (var i = 0; i < stepsArray.length; i++) {
                    if (stepsArray[i] < 2) {
                        walking = false;
                        break;
                    }
                }
                if (((velocityEstRef > Lv2t && refVelocity) || (!refVelocity && velocityEstRef > Lv1t)) && walking) {
                    motionType = "walk";
                    for (var i = 0; i < stepsArray.length; i++) {
                        if (stepsArray[i] < 2) {
                            motionType = "";
                            break;
                        }
                    }
                    if ((velocityEstRef > Lv3t && refVelocity) || (!refVelocity && velocityEstRef > Lv2t)) {
                        for (var i = 0; i < stepsArray.length; i++) {
                            if (stepsArray[i] < 6) {
                                motionType = "walk";
                                break;
                            } else if ((velocityEstRef > Lv3t && refVelocity) || (!refVelocity && velocityEstRef > Lv2t)) {
                                motionType = "run";
                            }
                        }
                    }
                }
                clearTimeout(motionTypeStep);
                motionTypeStep = null;
            }, 6000);
        }
    } else if (timerCountStep.length >= 3) { // if commuting, ensure a hold for _ sec to confirm
        clearTimeout(motionTypeStep);
        motionTypeStep = null;
        if (motionTypeCommute === null) {
            motionTypeCommute = setTimeout(function() {
                motionType = "commute";
                clearTimeout(motionTypeCommute);
                motionTypeCommute = null;
            }, 6000);
        }
    }
}

const temp = document.querySelector('.pwa .weather #temp');
const unit = document.querySelector('.pwa .weather #unit');
const humidity = document.querySelector('.pwa .popups .pills.weatherInfo .humidity');
const windSpeed = document.querySelector('.pwa .popups .pills.weatherInfo .windSpeed');
const windDir = document.querySelector('.pwa .popups .pills.weatherInfo .windDir');
const feelsLike = document.querySelector('.pwa .popups .pills.weatherInfo .feelsLike');

const greeting = document.querySelector('.pwa .home #greeting');

// REFERENCED FROM: https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function getParameters() {
    let urlString = window.location.href;
    let paramString = urlString.split('?')[1];
    let queryString = new URLSearchParams(paramString);
    for(let pair of queryString.entries()) {
        urlParams[pair[0]] = pair[1];
    }
}

function fetchPWAInfo() {
    const sections = document.querySelector('.pwa .sections');
    const navbar = document.querySelector('.pwa .navbar');
    const fab = document.querySelector('.pwa .fab');
    const fab2 = document.querySelector('.pwa .fab2');

    const wordcloud = document.querySelectorAll('.pwa .home .wordcloud h1');
 
    const commits = document.querySelector('.pwa #g_commits');

    const homeBtn = document.querySelector('.pwa .navbar .button.home') || document.querySelector('.pwa .navbar .button.home_dark');

    var selectedWords = [];

    // settings (validation of toggles)

    const motionSenseToggle = document.querySelector('.pwa .motionSenseToggle');
    var status = Number(localStorage.getItem('motionSense'));
    if (status) {
        motionSenseToggle.classList.add("toggleOn");
    }

    const locationToggle = document.querySelector('.pwa .locationToggle');
    if (!navigator.geolocation) {
        locationToggle.classList.add("hide");
    } else {
        var status = Number(localStorage.getItem('location'));
        if (status) {
            locationToggle.classList.add("toggleOn");
        }
    }

    // about

    if (githubCommitsres.online) {
        commits.innerHTML = numberWithCommas(githubCommitsres.val);
    } else {
        commits.innerHTML = "many";
    }

    // battery

    if ('getBattery' in navigator) {
        const batteryIcons = document.querySelectorAll('.pwa .banner .battery'); 
        navigator.getBattery().then(monitorBattery);
        for (j = 0; j < batteryIcons.length; j++) {
            batteryIcons[j].parentElement.classList.remove("d_n");

            batteryIcons[j].parentElement.classList.add("hoverB", "trs");

            batteryIcons[j].parentElement.addEventListener('mousemove', hoverInit);
            batteryIcons[j].parentElement.addEventListener('mouseleave', hoverEnd);
            batteryIcons[j].parentElement.addEventListener('click', hoverMiddle);
        }
    }

    // screen refresh rate

    getScreenRefreshRate(function(FPS){ // average screen refresh rate
        op.sfa = FPS; // live
        if (FPS) {
            deviceSFR.innerHTML = FPS + " fps";
        } /*else {
            deviceSFR.remove();
        }*/
    }, true);

    networkInfo();

    navigator.connection.addEventListener('change', function() {
        clientAPIres.online = false;
        clientAPI();
        setTimeout(function() {
            client_L = setInterval(function() {
                if (clientAPIres.online) {
                    clearInterval(client_L);
                    networkInfo();
                }
            }, op.t);
        }, op.t);
    });

    // dark mode

    var hamAuto = document.querySelector('.pwa .about .ham_auto');

    if (!getCookie("darkMode")) { // if no manual control from user
        hamAuto.children[0].innerHTML = "system";
        e_Fd(hamAuto, false);
        if (op.darkMode) { // if dark mode
            toggleColorMode(null, true); // start-up with preset color theme
        } else {
            autoDarkMode(); // EXPERIMENTAL: Check device ambient light to activate dark mode
        }
    } else {
        // e_Fd(hamAuto, true);
        if (getCookie("darkMode") === "true") { // manual: dark mode
            op.darkMode = true;
            toggleColorMode(null, true); 
        } else if (getCookie("darkMode") === "false") { // manual: light mode
            op.darkMode = false;
        }
    }

    // home
    /*
    if (r.o === "portrait" && window.innerWidth < 490) {
        sections.style.height = "calc(" + dev.uH.getBoundingClientRect().height + "px - 4rem)";
    }*/

    getParameters();

    if (urlParams["nav1"]) {
        var target = urlParams["nav1"],
            targetBtn = document.querySelector('.pwa .navbar .button.' + target) || document.querySelector('.pwa .navbar .button.' + target + '_dark'),
            targetSection = document.querySelector('.pwa .sections .' + target);
        targetSection.classList.remove("d_n");
        targetSection.classList.add("scrollBarContainer");
        activeTab = target;
        navButtonActive(target, targetBtn, true);

        if (target === "about" && 'share' in navigator) {
            fab.classList.remove("hide");
            fab.addEventListener("click", async () => {
                try {
                    await navigator.share(aboutShareData);
                } catch (err) {
                    console.log(err);
                }
            });
            if (fab2Check) {
                fab2.classList.remove("hide");
                if (fab2Close) {
                    fab2i.classList.remove("home_w_img");
                    fab2i.classList.add("close_w_img");
                } else {
                    fab2i.classList.remove("close_w_img");
                    fab2i.classList.add("home_w_img");
                }
                fab2.addEventListener("click", fab2Action);
            }
        }

    } else {
        const homeSection = document.querySelector('.pwa .sections .home');
        homeSection.classList.remove("d_n");
        homeSection.classList.add("scrollBarContainer");
        activeTab = "home";
        navButtonActive('home', homeBtn, true);
    }

    // // //

    var windS = (tempUnit(ipAPIres.country.iso_code) === "metric") ? (weatherAPIres.wind.speed * 3.6) : weatherAPIres.wind.speed,
        windSUnit = (tempUnit(ipAPIres.country.iso_code) === "metric") ? " km/h" : " miles/h";

    greeting.innerHTML = timeOfDay();
    temp.innerHTML = Math.round(weatherAPIres.main.temp);
    unit.innerHTML = (tempUnit(ipAPIres.country.iso_code) === "metric") ? "C" : "F";

    humidity.innerHTML = weatherAPIres.main.humidity + "%";
    windSpeed.innerHTML = ((windS < 90) ? Math.round(windS) : "90+") + windSUnit;
    windDir.innerHTML = /*weatherAPIres.wind.deg + "° " +*/ degToCompass(weatherAPIres.wind.deg);
    feelsLike.innerHTML = Math.round(weatherAPIres.main.feels_like) + "°" + ((tempUnit(ipAPIres.country.iso_code) === "metric") ? "C" : "F");

    // // // 

    for (i = 0; i < wordcloud.length; i++) { // get words from skills in msc.js
        var random1 = getRandomInt(1, 5),
            random2 = getRandomInt(0, 10),
            wd = 0,
            textColor = [], hsb = [], rgb = [], step = 0.01, bright = 0;
        if (selectedWords.indexOf(dev.skills["s" + random1][random2]) === -1) {
            selectedWords[selectedWords.length] = dev.skills["s" + random1][random2];
            wordcloud[i].innerHTML = dev.skills["s" + random1][random2];
 
            textColor = randomRGB(); // add random text colors suitable for dark+light themes
            hsb = RGBToHSB(textColor[0], textColor[1], textColor[2]);
            bright = getBrightness(textColor[0], textColor[1], textColor[2]);

            if (bright < 127) {
                while (bright < 127 && hsb[2] >= 0 && hsb[2] <= 100) {
                    hsb[2] += step;
                    var rgb2 = HSBToRGB(hsb[0], hsb[1], hsb[2]);
                    bright = getBrightness(rgb2[0], rgb2[1], rgb2[2]);
                }
            } else {
                while (bright > 127 && hsb[2] >= 0 && hsb[2] <= 100) {
                    hsb[2] -= step;
                    var rgb2 = HSBToRGB(hsb[0], hsb[1], hsb[2]);
                    bright = getBrightness(rgb2[0], rgb2[1], rgb2[2]);
                }
            }

            rgb = HSBToRGB(hsb[0], hsb[1], hsb[2]);
            wordcloud[i].style.color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";

            wd = getBd(wordcloud[i], "width");
            if (wd > ((0.9 * wiD) - op.fN)) {
                wordcloud[i].style.display = "none";
                wordcloud[i].remove();
            }
        } else {
            wordcloud[i].style.display = "none";
            wordcloud[i].remove();
        }
    }

    // about

    const aboutS1 = document.querySelector('.pwa .about #span1');
    const aboutS2 = document.querySelector('.pwa .about #span2');
    // const aboutS2_1 = document.querySelector('.pwa .about #span2_1');
    const aboutS3 = document.querySelector('.pwa .about #span3');
    const aboutS4 = document.querySelector('.pwa .about #span4');

    aboutS1.innerHTML = "dev";
    aboutS2.innerHTML = dev.info.work[1];
    // aboutS2_1.innerHTML = dev.info.work[2];
    aboutS3.innerHTML = gps.city.toLowerCase();
    aboutS4.innerHTML = new Date().getFullYear() - 2018;
}

function startLoadPWA() {
    var y = op.d.getFullYear(), // get copyright year
        typer = null;

    const typerDet = document.querySelector('.pwa #wordsTyperDet');

    /*
    const stats = document.querySelector('.pwa .home .stats.container');

    const stat1 = document.querySelector('.pwa .home #stat1');
    const stat2 = document.querySelector('.pwa .home #stat2');
    const stat3 = document.querySelector('.pwa .home #stat3');*/

    // const aboutOffline = document.querySelector('.pwa .about .container.offline');
    /*
    var pwa_L = null,
        stats_e = false;

    const disVar = document.querySelector('.pwa #distanceVariantPWA');
    */

    fter.y[0].innerHTML = y;
    fter.v[0].innerHTML = dev.version;

    /*
    sI_1.e = stat1;
    sI_2.e = stat2;
    sI_3.e = stat3;

    if (window.innerWidth >= (800 + (window.innerWidth * 0.075) + (5 * op.fN))) {
        aboutOffline.classList.add("mod");
    }*/

    typer = setInterval(function() { // typing effect
        e_wCycle(typerDet, dev.info.work, typer);
    }, op.t);

    op.lang = engLangVar(countryAPIres.country);
    engLangUpdate(op.lang);
    
    // sI_1.n = (op.lang === "gb") ? 97 : kmToMiles(97), // km : miles
    // disVar.innerHTML = (op.lang === "gb") ? "km" : "miles";
    /*
    pwa_L = setInterval(function() {
        var statsTop = stats.getBoundingClientRect();
        if (statsTop.top < aH && !stats_e) {
            stats_e = true;
            e_Ic(sI_1, null, sI_1.n);
            e_Ic(sI_2, null, sI_2.n);
            e_Ic(sI_3, null, sI_3.n);
        }
    }, (1000 / dev.t));*/
}

function openPopUp(target) {
    const popups = document.querySelector('.pwa .popups');
    var t = document.querySelector('.pwa .popups .' + target);
    if (target !== 'terms') {
        // popups.style.height = "calc(100lvh - calc(env(safe-area-inset-top))) !important";
        popups.classList.add("lvh");
        popups.classList.add("ovy-h");
        popups.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        popups.addEventListener("click", function(e) {
            if (e.target !== this) {
                return
            }
            closePopUp(target)
        }, true);
    }
    t.classList.remove("d_n");
    popups.classList.remove("d_n");
    setTimeout(function() {
        e_Fd(popups, false);
    }, 10);
}

function closePopUp(target) {
    const popups = document.querySelector('.pwa .popups');
    var t = document.querySelector('.pwa .popups .' + target);
    if (target !== 'terms') {
        popups.removeEventListener("click", function(e) {
            if (e.target !== this) {
                return
            }
            closePopUp(target)
        }, true);
    }
    e_Fd(popups, true);
    setTimeout(function() {
        t.classList.add("d_n");
        popups.classList.add("d_n");
        if (target !== 'terms') {
            // popups.style.height = "";
            popups.classList.remove("lvh");
            popups.classList.remove("ovy-h");
            popups.style.backgroundColor = "";
        }
    }, op.t);
}

function randomRGB() {
    var r = getRandomInt(0, 256),
        g = getRandomInt(0, 256),
        b = getRandomInt(0, 256);
    return [r, g, b];
}

function getBrightness(r, g, b) { // REF: https://mixable.blog/adjust-text-color-to-be-readable-on-light-and-dark-backgrounds-of-user-interfaces/
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

const RGBToHSB = (r, g, b) => { // REF: https://www.30secondsofcode.org/js/s/rgb-to-hsb/
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h =
        n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

const HSBToRGB = (h, s, b) => { // REF: https://www.30secondsofcode.org/js/s/hsb-to-rgb/
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
};

// REFERENCE: https://googlechrome.github.io/samples/battery-status/

function updateBatteryUI(battery) {
    const batteryIcons = document.querySelectorAll('.pwa .banner .battery');

    btty.level = (battery.level * 100);
    btty.chargingTime = battery.chargingTime;
    btty.dischargingTime = battery.dischargingTime;

    if (battery.charging === true) {
        btty.charging = true;
    } else if (battery.charging === false) {
        btty.charging = false;
    }

    batteryLevel.innerHTML = Math.round(btty.level) + "%";
    if (btty.charging && btty.chargingTime !== 0) {
        batteryStatus.innerHTML = "charging";
        if (btty.chargingTime === Infinity) {
            batteryTime.innerHTML = "~ " + btty.chargingTime;
        } else if (Math.round((btty.chargingTime / 60)) < 60) {
            batteryTime.innerHTML = "~ " + Math.round((btty.chargingTime / 60)) + " min";
        } else {
            var min = Math.round((btty.chargingTime / 60)),
                hours = Math.floor(min / 60);
            if (hours < 24) {
                batteryTime.innerHTML = "~ " + hours + " h " + (min % 60) + " min";
            } else {
                batteryTime.innerHTML = "~ " + Math.floor(hours / 24) + " d " + (hours % 24) + " h";
            }
        }
    } else if (btty.charging && btty.dischargingTime === Infinity) {
        batteryStatus.innerHTML = "stable";
        batteryTime.innerHTML = "~ " + btty.dischargingTime;
    } else {
        batteryStatus.innerHTML = "discharging";
        if (btty.dischargingTime === Infinity) {
            batteryTime.innerHTML = "~ " + dischargingTime;
        } else if (Math.round((btty.dischargingTime / 60)) < 60) {
            batteryTime.innerHTML = "~ " + Math.round((btty.dischargingTime / 60)) + " min";
        } else {
            var min = Math.round((btty.dischargingTime / 60)),
                hours = Math.floor(min / 60);
            if (hours < 24) {
                batteryTime.innerHTML = "~ " + hours + " h " + (min % 60) + " min";
            } else {
                batteryTime.innerHTML = "~ " + Math.floor(hours / 24) + " d " + (hours % 24) + " h";
            }
        }
    }

    for (j = 0; j < batteryIcons.length; j++) {
        for (i = 0; i < batteryIcons[j].classList.length; i++) {
            var str = batteryIcons[j].classList[i],
                match = str.match("battery_");
            if (match !== null) {
                batteryIcons[j].classList.remove(str);
                break;
            }
        }
        /*
        if (btty.charging && btty.chargingTime === 0) { // desktop PC - battery irrelevant/full
            // batteryIcons[j].parentElement.classList.add("d_n");
        } else */
        
        if (btty.charging && btty.chargingTime !== 0) { // charging
            batteryIcons[j].classList.add("battery_chg_img");
        } else if (btty.level > 87.5 || (btty.charging && btty.chargingTime === 0)) { // full
            var img = (!op.darkMode) ? "battery_full_img" : "battery_full_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 75) { // 6
            var img = (!op.darkMode) ? "battery_6_img" : "battery_6_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 62.5) { // 5
            var img = (!op.darkMode) ? "battery_5_img" : "battery_5_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 50) { // 4
            var img = (!op.darkMode) ? "battery_4_img" : "battery_4_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 37.5) { // 3
            var img = (!op.darkMode) ? "battery_3_img" : "battery_3_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 25) { // 2
            var img = (!op.darkMode) ? "battery_2_img" : "battery_2_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 12.5) { // 1
            batteryIcons[j].classList.add("battery_1_img");
        } else if (btty.level > 0) { // 0
            batteryIcons[j].classList.add("battery_0_img");
        }
    }
}
  
function monitorBattery(battery) {
    // Update the initial UI.
    updateBatteryUI(battery);

    // Monitor for futher updates.
    battery.addEventListener('levelchange',
        updateBatteryUI.bind(null, battery));
    battery.addEventListener('chargingchange',
        updateBatteryUI.bind(null, battery));
    battery.addEventListener('dischargingtimechange',
        updateBatteryUI.bind(null, battery));
    battery.addEventListener('chargingtimechange',
        updateBatteryUI.bind(null, battery));
}

var isScrolling; // REFERENCE: https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/

sections.addEventListener("scroll", function(event) {
    sectionScroll = true;
    sectionScrollPos = sections.scrollTop;

    // Clear our timeout throughout the scroll
	window.clearTimeout(isScrolling);

	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function() {

		// Run the callback
		sectionScroll = false;

	}, dev.t);

}, false);

function e_Fd(el, s) { // effect - fading (provided 'trs' class is added to el)
    if (el) {
        if (s) { // check if class is present before removing
            el.classList.add("z_O"); // fade out
        } else {
            el.classList.remove("z_O"); // fade in
        }
    }
}

function e_Ic(el, p, f) { // effect - iterating digits on a numeral (in a string/text setting)
    p = (p !== null) ? String(p) : p;  // convert to string format (if not null)
    var r = p ? [1] : [0.65, 0.85, 0.95, 1], // break-points - to adjust (soothen) speed of setInterval rotation for natural effect (alt. [no/few breakpoints] in special cases such as digit incrementing)
        t = 0; 
    if (p) {
        el._L[p] = setInterval(function() {
            st_L(el, p, r, t, f)
        }, 1000/f); // 'f' is initial speed throttle
    } else {
        el._L = setInterval(function() {
            st_L(el, p, r, t, f)
        }, 1000/f); // 'f' is initial speed throttle
    }
}

function numberWithCommas(x) { // REFERENCED FROM: https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators BY Elias Zamaria
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getGhCommits() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.github.com/repos/ivansojivarghese/ivansojivarghese.github.io/commits?per_page=1', false);
    request.send(null);

    githubCommitsres.online = true;

    return request.getResponseHeader('link').match(/"next".*page=([0-9]+).*"last"/)[1];
}

var loader = document.querySelector('#load_sc');

function pwaRead() {
    const load_sc = document.querySelector('#load_sc');
    const puller = document.querySelector('.puller');

    const pwa_body = document.querySelector('.pwa');
    const pwa_sec_body = document.querySelector('.pwaSecondary');

    const navbar = document.querySelector('.navbar');
    const firstButton = document.querySelectorAll('.pwa .navbar .button')[0];
    const swapButton = document.querySelector('.pwa .navbar .button.swap');
    
    switch (document.readyState) { // check 'ready state' of document
        case "loading":
            deleteAllCookies();
            
            e_Fd(loader, false);

            var primarySegment = Number(localStorage.getItem('primarySegment'));
            if (primarySegment) {
                
                load_sc.classList.add("swapped");
                puller.classList.add("swapped");
                pwa_body.classList.add("swapped");
                pwa_sec_body.classList.add("swapped");

                navbar.insertBefore(swapButton, firstButton);
            }
            
        break;
        case "interactive":
            deleteAllCookies();
            
            e_Fd(loader, false);

            var primarySegment = Number(localStorage.getItem('primarySegment'));
            if (primarySegment) {
                load_sc.classList.add("swapped");
                puller.classList.add("swapped");
                pwa_body.classList.add("swapped");
                pwa_sec_body.classList.add("swapped");

                navbar.insertBefore(swapButton, firstButton);
            }
            
        break;
        case "complete":
            if (!devError && op.pwa.s && !rL.i) { // pwa
                var client_L = null, ip_L = null, weather_L = null;

                const pwa_body = document.querySelector('.pwa');
                const normal_body = document.querySelector('.non-pwa');

                const pwa_sec_body = document.querySelector('.pwaSecondary');

                const pwa_scrollF = document.querySelector('.pwa .scrollBarFunction');
                const pwa_home = document.querySelector('.pwa .home');
                // pwa_home.classList.add("scrollBarContainer");
                pwa_scrollF.classList.add("z-I");

                e_Fd(pwa_sec_body, false);

                c_css("#scrollBar", "right: 0.2rem; width: 0.2rem;", false, null);

                ////////

                c_css(".trs", "transition-duration: " + (op.t / 1000) + "s;", false, null); // transition duration (convert to sec.)
                c_css(".trs_e", "transition-duration: " + (op.te / 1000) + "s;", false, null); // transition duration [ext.] (convert to sec.)
        
                c_css(".m_T.vh", "margin-top: calc(" + (aH * 0.5) + "px)", false, null);
                c_css(".m_T.vhq", "margin-top: calc(" + (aH * 0.25) + "px)", false, null);

                c_css(".p_Bvhq", "padding-bottom: calc(" + (aH * 0.25) + "px)", false, null);
                c_css(".p_Tvhq", "padding-top: calc(" + (aH * 0.25) + "px)", false, null);

                ///////

                clientAPI();
                countryAPI("");
                // countryAPI("216.73.163.219");
                githubCommitsres.val = getGhCommits();
                setTimeout(function() {
                    client_L = setInterval(function() {
                        if (clientAPIres.online) {
                            ipAPI(clientAPIres.ipString);
                            // ipAPI("216.73.163.219");
                            clearInterval(client_L);
                            ip_L = setInterval(function() {
                                if (ipAPIres.online /*&& githubCommitsres.online*/) {
                                    weatherAPI(ipAPIres.lat, ipAPIres.lon, tempUnit(ipAPIres.country.iso_code));
                                    clearInterval(ip_L);
                                    weather_L = setInterval(function() {
                                        if (weatherAPIres.online && countryAPIres.online) {
                                            clearInterval(weather_L);

                                            const weatherMain = weatherAPIres.weather[0].main;
                                            const weatherDes = weatherAPIres.weather[0].description;
                                            const sunrise = weatherAPIres.sys.sunrise;
                                            const sunset = weatherAPIres.sys.sunset;

                                            var day = true,
                                                icon = "";

                                            if (((new Date().valueOf() / 1000) > sunrise) && ((new Date().valueOf() / 1000) < sunset)) {
                                                day = true;
                                            } else {
                                                day = false;
                                            }

                                            switch (weatherMain) {
                                                case "Clear":
                                                    if (day) {
                                                        icon = "sunny";
                                                    } else {
                                                        icon = "clear";
                                                    }
                                                break;
                                                case "Clouds":
                                                    switch (weatherDes) {
                                                        case "few clouds":
                                                            if (day) {
                                                                icon = "mostly_sunny";
                                                            } else {
                                                                icon = "isolated_clouds";
                                                            }
                                                        break;
                                                        case "scattered clouds":
                                                            if (day) {
                                                                icon = "partly_cloudy";
                                                            } else {
                                                                icon = "partly_cloudy_night";
                                                            }
                                                        break;
                                                        case "broken clouds":
                                                            if (day) {
                                                                icon = "mostly_cloudy";
                                                            } else {
                                                                icon = "mostly_cloudy_night";
                                                            }
                                                        break;
                                                        case "overcast clouds":
                                                            if (day) {
                                                                icon = "cloudy";
                                                            } else {
                                                                icon = "cloudy_night";
                                                            }
                                                        break;
                                                    }
                                                break;
                                                case "Mist":
                                                case "Smoke":
                                                case "Haze":
                                                case "Dust":
                                                case "Fog":
                                                case "Sand":
                                                case "Ash":
                                                case "Squall":
                                                case "Tornado":
                                                    if (day) {
                                                        icon = "fog";
                                                    } else {
                                                        icon = "fog_night";
                                                    }
                                                break;
                                                case "Snow":
                                                    switch (weatherDes) {
                                                        case "snow":
                                                        case "light snow":
                                                            if (day) {
                                                                icon = "snowy";
                                                            } else {
                                                                icon = "snowy_night";
                                                            }
                                                        break;
                                                        case "sleet":
                                                        case "light shower sleet":
                                                        case "shower sleet":
                                                            if (day) {
                                                                icon = "sleet";
                                                            } else {
                                                                icon = "sleet_night";
                                                            }
                                                        break;
                                                        case "light rain and snow":
                                                        case "rain and snow":
                                                        case "light shower snow":
                                                        case "shower snow":
                                                            if (day) {
                                                                icon = "snowy_rain";
                                                            } else {
                                                                icon = "snowy_rain_night";
                                                            }
                                                        break;
                                                        case "heavy snow":
                                                        case "heavy shower snow":
                                                            if (day) {
                                                                icon = "blizzard";
                                                            } else {
                                                                icon = "blizzard_night";
                                                            }
                                                        break;
                                                    }
                                                break;
                                                case "Rain":
                                                    if (day) {
                                                        icon = "rainy";
                                                    } else {
                                                        icon = "rainy_night";
                                                    }
                                                break;
                                                case "Drizzle":
                                                    if (day) {
                                                        icon = "showers";
                                                    } else {
                                                        icon = "showers_night";
                                                    }
                                                break;
                                                case "Thunderstorm":
                                                    if (day) {
                                                        icon = "thunderstorms";
                                                    } else {
                                                        icon = "thunderstorms_night";
                                                    }
                                                break;
                                            }

                                            const tempIcon = document.querySelector('.pwa .weatherIcon');
                                            $(tempIcon).load("weather/" + icon + ".html", function() {
                                                pwa_body.classList.remove("d_n");
                                                fetchPWAInfo();
                                                setTimeout(function() {

                                                    rL.r_s = false;
                                                    rL.el = document.getElementById("load_sc"), 
                                                    rL.r = document.getElementById("loadR"); // loading rings (container)
                                                    rL.p = document.getElementById("loadR-p"); // loading ring (primary)
                                                    rL.d = document.getElementById("loadR-e"); // loading ring (end)
                                                    rL.c = document.getElementById("loadR-s"); // loading ring (secondary)

                                                    rL.p.removeEventListener("animationiteration", load_e);
                                                    rL.p.addEventListener("animationiteration", function() {
                                                        if (rL.r_s) {
                                                            rL.d.style.animationName = "loadR_end"; // set ending animation detail
                                                        }
                                                    });

                                                    setTimeout(function() {
                                                        rL.r_s = true;

                                                        // rL.el.classList.add("z_O");

                                                        //rL.r.classList.add("aniM-p"); // stop animation in the rings
                                                        //rL.p.classList.add("aniM-p");
                                                        //rL.c.classList.add("aniM-p");

                                                        setTimeout(function() {
                                                            e_Fd(loader, true);

                                                            setTimeout(function() {
                                                                loader.classList.add("d_n");
                                                            }, op.t);
                                                            
                                                            resetRefresh();
                                                            pwa_Load = true;

                                                            e_Fd(pwa_body, false);
                                                            startLoadPWA();
        
                                                            clearInterval(pwa_Ld);
                                                        }, op.t);
    
                                                    }, op.te);
                                                    
                                                }, 10);
                                            });
                                        }
                                    }, op.t);
                                }
                            }, op.t);
                        }
                    }, op.t);
                }, op.t);

                normal_body.classList.add("d_n");
                // document.title = "Ivan Varghese";
                
                $(sections).scroll(function() {
                    document.title = "Ivan Varghese"; // default the title
                });

                rL.i = true; // end load
                rL.s = true;
            } else if (devError) {
                document.write("<h1 style='width: auto; font-size: 3rem; font-family: sans-serif; margin: 1em; line-height: 1.3em;'>Close<br>Developer<br>Tools.</h1>");
                rL.s = true; // page loaded
                
                window.stop(); // stop all network resource(s) fetching
                clearInterval(_Ld); // stop loading process
                clearInterval(op.ne.L); // clear network check loop

                checkOnlineStatus_abort.abort(); // abort any existing fetching
                estimateNetworkSpeed_abort.abort();
            }

            if (document.querySelector('.non-pwa').classList.contains("d_n")) {
                pos.sB = document.querySelector('.pwa #scrollBar');
            } else {
                pos.sB = document.querySelector('.non-pwa #scrollBar');
            }
        break;
    }
}

function num_Fs(s) { // font-size literal to numeral (eg. "10px" -> 10)
    var _L = s.length - 1,
        res = "";
    for (i = 0; i <= _L; i++) {
        if (Number(s[i]) || Number(s[i]) === 0) {
            res += s[i];
        } else {
            break;
        }
    }
    return Number(res);
}

function swapDisplays() { // swap between display areas in dual screen devices
    const load_sc = document.querySelector('#load_sc');
    const puller = document.querySelector('.puller');

    const pwa_body = document.querySelector('.pwa');
    const pwa_sec_body = document.querySelector('.pwaSecondary');

    const navbar = document.querySelector('.navbar');
    const firstButton = document.querySelectorAll('.pwa .navbar .button')[0];
    const swapButton = document.querySelector('.pwa .navbar .button.swap');

    if (primarySegment === 0) { // default
        load_sc.classList.add("swapped");
        puller.classList.add("swapped");
        pwa_body.classList.add("swapped");
        pwa_sec_body.classList.add("swapped");

        navbar.insertBefore(swapButton, firstButton);

        primarySegment = 1;

        localStorage.setItem('primarySegment', '1');

    } else if (primarySegment === 1) {
        load_sc.classList.remove("swapped");
        puller.classList.remove("swapped");
        pwa_body.classList.remove("swapped");
        pwa_sec_body.classList.remove("swapped");

        navbar.appendChild(swapButton);

        primarySegment = 0;

        localStorage.setItem('primarySegment', '0');
    }
}

function isSingleFoldHorizontal() {
    const segments = window.visualViewport.segments;

    // single fold means the device has 1 fold and 2 display regions
    if( segments.length !== 2 ) {
        return false;
    }

    // horizontal fold means 1st segment top is smaller than 2nd segment top
    if( segments[0].top < segments[1].top ) {
        return true;
    }

    // if we reach this point, the fold is vertical
    return false;
}

if (op.pwa.s) {
    const scrollbar = document.querySelector('#scrollBar');

    const segments = window.visualViewport.segments;

    var primarySegment;

    if (segments && segments.length === 2) {
        // now we know the device is a foldable
        // and we can update CSS classes in our layout as appropriate 

        primarySegment = Number(localStorage.getItem('primarySegment'));

        var fontBuffer = isSingleFoldHorizontal() ? 6 : 3;

        var currentFontSize = num_Fs(window.getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = (currentFontSize - fontBuffer) + "px";

        scrollbar.style.display = "none";
    }

    window.onresize = function() {
        const segments = window.visualViewport.segments;
        if (segments && segments.length === 2) {
            // Make changes two split content into the segments.

            primarySegment = Number(localStorage.getItem('primarySegment'));

            var fontBuffer = isSingleFoldHorizontal() ? 6 : 3;

            document.documentElement.style.fontSize = "";

            var currentFontSize = num_Fs(window.getComputedStyle(document.documentElement).fontSize);
            document.documentElement.style.fontSize = (currentFontSize - fontBuffer) + "px";

            scrollbar.style.display = "none";
        } else {
            // Reset state to single viewport (normal responsive layout).

            document.documentElement.style.fontSize = "";

            scrollbar.style.display = "";
        }
    }

    pwa_Ld = setInterval(pwaRead, op.Ls); // run 'load' scripts upon startup
}