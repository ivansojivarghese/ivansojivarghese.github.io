
// misc.

var wH = window.outerHeight, // height
    cH = !op.pwa.s ? document.documentElement.clientHeight : window.innerHeight, // [for mobile/tablet] height, exclusive of URL bar
    wD = window.outerWidth, // width 
    wiH = window.innerHeight,
    wiD = window.innerWidth,
    uHeight = 0,
    Rd = [], // load-ready - boolean statuses for loading resource elements
    timer = {}, // keep track of timer instances
    gps = { // CURRENT LOCATION (UPDATE WHEN NEEDED!)
        city : "Singapore",
        country : "SG", // (ISO 3116 code)
        lat : "1.343",
        lon : "103.689"
    },
    gpsInfo = {
        latDeg : "1°", // RETRIEVED FROM https://www.latlong.net/convert-address-to-lat-long.html
        latMin : "20\'",
        latSec : 'xx"',
        latDir : "N",
        lonDeg : "103°",
        lonMin : "41\'",
        lonSec : 'xx"',
        lonDir : "E"
    },
    dev = {
        mode : developer,  
        mtne : false, // maintenance check
        z : 100, // zoom level, default
        url : "https://ivansojivarghese.github.io/", // live URL that [currently] hosts the site: FOR TESTING PURPOSE - CHANGE WHEN NEEDED
        info : { // personal information - CHANGE WHEN NEEDED
            work : ["web dev", "designer", "photog", "barista", "player"], // work labels
            workType : "freelance", // 'full-time', 'part-time', 'casual' or 'freelance'
            // college : !(window.matchMedia('(orientation: landscape)').matches && ((wiD >= 1200 && wiH >= 700) || wiH >= 800)) ? "ntu" : "mshs", // name of institution
            college : !(window.matchMedia('(orientation: landscape)').matches && ((wiD >= 1200) || wiH >= 800)) ? "ntu" : "mshs", // name of institution
            course : "computer science", // course name
            location : gps.city.toLowerCase(), // geographic location/region/city/country/state
            coords : gpsInfo.latDeg + gpsInfo.latMin + gpsInfo.latSec + gpsInfo.latDir + " " + gpsInfo.lonDeg + gpsInfo.lonMin + gpsInfo.lonSec + gpsInfo.lonDir,
            distance : 97,
            hoursNo : 183,
            cappuccinosNo : 245
        },
        skillsNum : 10, // num. of skills per line (UPDATE)
        skills : { // relevant skills (UPDATE IF NEEDED, WORDS MUST NOT EXCEED 2 WORDS (5-6 CHARACTERS) IN LENGTH)
            s1 : ["design", "canva", "wireframe", "figma", "ux", "dreamweaver", "ui", "studio", "experience", "responsive"], // ux/ui
            s2 : ["web", "html", "frontend", "js", "api", "sitemap", "css", "devtools", "seo", "dynamic"], // web
            s3 : ["logic", "debug", "flow", "object", "algorithm", "python", "ai", "boolean", "array", "ascii"], // software
            s4 : ["frame", "memory", "camera", "pen", "light", "blur", "vision", "shadow", "chocolate", "espresso"] // personal
        },
        sC_a : [], // split-screen ratio array (mobile/tablet/phablet/touch-device : desktop)
        cH : document.getElementById("control-height"), // dummy element, to check height changes relative to viewport
        uH : document.getElementById("ui-height"), // dummy element, check for URL/interface bar resizing
        version : "3.13", // site version
        version_up : "3.14", // version upgrade (if applicable, during maintenance)
        v : 1, // max view time (days)
        i : 1000, // interface timeout (max.)
        t : 60, // iterations per sec.
        sSmooth : 25 // scroll smoothness
    },
    pos = { // scroll pos. (window)
        // sB : document.querySelector(".pwa #scrollBar"),
        sBc : false,
        y : 0, // y-pos
        yA : 0, // y-pos (secondary - comparison)
        a : [0, 0, 0], // comparison array (between consecutive 'n' y-pos values)
        d : [], // scroll speed array (between consecutive changing y-pos values) 
        v : [], // rec. scroll speed of user (instantaneously - updated for every scroll)
        s : 0, // scroll speed
        m : 0, // no. of comparison matches (count)
        n : 0, // no. of comparison increments (count)
        c : false, // scrolling change/activity status
        cE : false, // scrolling activity (ext.)
        r : true, /// scrolling direction - true if down
        L : null, // loop variables
        Lc : null,
        aL : false, // check for alternate (prevent multiple function calls)
        aT : true, // scrolled at top check (live)
        aTs : true // scrolled at top (delayed)
    },
    tch = { // touch
        e : false, // enabled/used?
        s : false, // status
        yA : 0, // touch initial
        yB : 0, // touch end
        d : false, // drag check?
        dr : null, // drag direction up?
        drV : 0, // drag value
    }
    pg = { // pages
        e : false,
        t : "", // reference window category
        w : "", // current [open] window
        sc : { // sections
            m : document.getElementById("main_sc"), // main
            c : document.getElementById("content_sc"), // content
            d : document.getElementById("lead_sc"), // lead
            e : document.getElementById("mid_sc"),
            f : document.getElementById("footer_main_sc")
        },
        msg : { // messages
            p : [], // array tracker
            io : false, // in-out message? (show + hide)
            temp : false, // temporary messsage?
            ioS : 0, // in-out start time
            r : 3000, // response time (avg.)
            re : 5000, // ext. response time
            fo : false, // offline-online sequence active?
            k : false, // if cookie message is active
            c : false, // check (if feature[pill] is active)
            cp : false, // pill hint
            ce : false, // pill extended?
            cep : false, // pill extending hint
            el : document.getElementById("msg_sc"), // el
            t : document.getElementById("msg_tint"), // tint
            ckA : document.getElementById("ckA_msg"), // cookie-acceptance
            ckA_wrap : document.getElementById("ckA_msg_wrap"), // "" wrap
            net : document.getElementById("net_msg"), // network
            net_p : document.getElementById("net_msg_pill"), // network - pill
            net_i : document.getElementById("net_msg-i"), // network - icon
            net_t : document.getElementById("net_msg-t"), // network - text
            net_e : document.getElementById("net_msg-e") // network - extra text
        },
        cond : { // conditions
            a : false, // active check
            el : document.getElementById("cond_sc"), // main
            tnc : document.getElementById("tnc"), // tnc [https://www.nibusinessinfo.co.uk/content/sample-website-terms-and-conditions-use]
            dcr : document.getElementById("dcr"), // disclaimer [https://www.nibusinessinfo.co.uk/content/sample-website-disclaimer]
            cpy : document.getElementById("cpy"), // copyright [https://www.nibusinessinfo.co.uk/content/sample-website-copyright-statement]
            prv : document.getElementById("prv") // privacy policy [https://cdn.websitepolicies.com/wp-content/uploads/2022/04/privacy-policy-template.pdf]
        }
    },
    eR = {
        s : false // error check
    },
    rL = {
        i : false // load status
    },
    hm = { // hamburger menu
        s : false // open status
    },
    ex = { // executions
        a : false,
        f : []
    },
    c_cssL = [], // c_css function loops
    screenLockStatus = false;

    
var apiTimeout = timeout * 0.25, // 25% timeout for APIs to load
    apiInit = 0, // init time for API load
    apiSuccess = false, // check
    criticalAPI = false,
    weatherAPIres = {},
    ipAPIres = {},
    ipAPI2res = {},
    ipAPI3res = {},
    ipAPI4res = {},
    sunAPIres = {},
    clientAPIres = {},
    roamingAPIres = {},
    timeAPIres = {},
    countryAPIres = {},
    cloudflareCDNres = {};


/////////////////////////////////////////////////////
/*
function reqA() { // animation frames (rendering)
    requestAnimationFrame(function() {
        
        resLoad(fchL["1"].el, fchL["1"].u);  // add to DOM

        requestAnimationFrame(function() {
            document.body.offsetWidth; // force repaint
            requestAnimationFrame(function() {
                img.p = true; // image is painted
            });
        });
    });
}*/
/*
function renderStart() {
    requestAnimationFrame(renderCallback);
}

function renderCallback() {
    console.log("render");
}*/

// CODE REFERENCED FROM CARLOS DELGADO @ https://ourcodeworld.com/articles/read/1390/how-to-determine-the-screen-refresh-rate-in-hz-of-the-monitor-with-javascript-in-the-browser#disqus_thread

/**
 * Allows to obtain the estimated Hz of the primary monitor in the system.
 * 
 * @param {Function} callback The function triggered after obtaining the estimated Hz of the monitor.
 * @param {Boolean} runIndefinitely If set to true, the callback will be triggered indefinitely (for live counter).
 */
function getScreenRefreshRate(callback, runIndefinitely){
    let requestId = null;
    let callbackTriggered = false;
    runIndefinitely = runIndefinitely || false;

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    }
    
    let DOMHighResTimeStampCollection = [];

    let triggerAnimation = function(DOMHighResTimeStamp){
        DOMHighResTimeStampCollection.unshift(DOMHighResTimeStamp);
        
        if (DOMHighResTimeStampCollection.length > 10) {
            let t0 = DOMHighResTimeStampCollection.pop();
            let fps = Math.floor(1000 * 10 / (DOMHighResTimeStamp - t0));

            if(!callbackTriggered){
                callback.call(undefined, fps, DOMHighResTimeStampCollection);
            }

            if(runIndefinitely){
                callbackTriggered = false;
            }else{
                callbackTriggered = true;
            }
        }
    
        requestId = window.requestAnimationFrame(triggerAnimation);
    };
    
    window.requestAnimationFrame(triggerAnimation);

    // Stop after half second if it shouldn't run indefinitely
    if(!runIndefinitely){
        window.setTimeout(function(){
            window.cancelAnimationFrame(requestId);
            requestId = null;
        }, 500);
    }
}


// CODE REFERENCED FROM: https://javascript.plainenglish.io/how-to-automatically-reload-a-page-after-a-given-period-of-inactivity-in-javascript-991d632d1f80
// BY John Au-Yeung, 2021

let time = new Date().getTime(); // CHECKS FOR INACTIVITY, & RELOADS IF SO (1 DAY)
const setActivityTime = (e) => {
    time = new Date().getTime();
}
document.body.addEventListener("mousemove", setActivityTime);
document.body.addEventListener("keypress", setActivityTime);
document.body.addEventListener("scroll", setActivityTime);
document.body.addEventListener("touchstart", setActivityTime);
/*
const refresh = () => {
    if ((new Date().getTime() - time >= (dev.v * 24 * 60 * 60 * 1000)) && !op.pwa.s) { // max-duration limit in ms. (from days)
        reL(); // reload
    } else {
        setTimeout(refresh, 10000); // Check every 10s
    }
}
setTimeout(refresh, 10000); */


function renderTime() { 
    var n = op.d.getTime(),
        t = n - performance.timing.navigationStart; 
    return t;
    /*
    rL.xes.innerHTML = "~" + (t/1000).toFixed(0) + "s";
    e_Fd(rL.xes, false);
    */
}

window.addEventListener("DOMContentLoaded", function() { // 1 - base html/css/scripts
    op.Ld.s = false;
    op.Ld.dom = renderTime();
}); 
window.addEventListener("load", function() { // 2 - full load
    op.Ld.s = true;
    op.Ld.a = renderTime();
}); 

////////////////////////////////////////////////////////

function containsUppercase(str) {
    return /[A-Z]/.test(str);
}

function isolateRegionBCP47(str) { // for BCP 47 language tags (https://www.techonthenet.com/js/language_tags.php)
    var res = "",
        checks = 0;
    for (i = 0; i < str.length; i++) {
        if ((containsUppercase(str[i]) && checks === 0) || (checks === 1 && containsUppercase(str[i]) && containsUppercase(str[i - 1]))) {
            res += str[i];
            checks++;
            if (checks === 2) {
                break;
            }
        }
    }
    return res;
}

/////////////////////////////////////////////////////////

// APIs

async function ipAPI(v) {  // Free usage, unlimited, https://www.findip.net/
    if (navigator.onLine) {
        await fetch("https://api.findip.net/" + v + "/?token=129d26297cb44c6d9845c1414b896138") // 'a' character may be added at end for TESTING
            .then((response) => {
                return response.json().then((data) => {
                    ipAPIres = data;

                    ipAPIres.lat = ipAPIres.location.latitude;
                    ipAPIres.lon = ipAPIres.location.longitude;
                    ipAPIres.city = ipAPIres.city.names.en;

                    /*
                    ipAPIres.lat = data.loc.slice(0, ipAPIres.loc.indexOf(",")), // get user latitude;
                    ipAPIres.lon = data.loc.slice(ipAPIres.loc.indexOf(",") + 1, ipAPIres.loc.length), // get user longitude;
                    */

                    ipAPIres.online = true;
                    ipAPIres.verified = false;
                }).catch((error) => {
                    ipAPIres.error = true;
                });
            })
    } else {
        ipAPIres.country = {};
        ipAPIres.country.iso_code = isolateRegionBCP47(navigator.language);
        ipAPIres.error = true;
    }
}
/*
async function ipAPI2(v) {  // 50,000 per month limit, https://ipinfo.io/
    await fetch("https://ipinfo.io/" + v + "/json?token=38ec70e8a088d5")
        .then(async (response) => {
            try {
                const data = await response.json();
                ipAPI2res = data;

                ipAPI2res.lat = data.loc.slice(0, ipAPI2res.loc.indexOf(",")), // get user latitude;
                ipAPI2res.lon = data.loc.slice(ipAPI2res.loc.indexOf(",") + 1, ipAPI2res.loc.length), // get user longitude;


                ipAPI2res.online = true;
            } catch (error) {
                ipAPI2res.error = true;
            }
        })
}

async function ipAPI3() { // 30,000 per month, 1,000 per day limit
    await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=0bbc4727966a4b7286fc20fab600a35a")
        .then(async (response) => {
            try {
                const data = await response.json();
                ipAPI3res = data;
                ipAPI3res.lat = ipAPI3res.latitude;
                ipAPI3res.lon = ipAPI3res.longitude;
                ipAPI3res.online = true;
            } catch (error) {
                ipAPI3res.error = true;
            }
        })
}

async function ipAPI4(v) { // 10,000 per month
    await fetch("https://api.apilayer.com/ip_to_location/" + v + "?apikey=AbGoz7Dv1wwNGSqQNDX6YwVeaz4ctXwb")
        .then(async (response) => {
            try {
                const data = await response.json();
                ipAPI4res = data;
                ipAPI4res.lat = ipAPI4res.latitude;
                ipAPI4res.lon = ipAPI4res.longitude;
                ipAPI4res.online = true;
            } catch (error) {
                ipAPI4res.error = true;
            }
        })
}

async function sunAPI(lat, lon) { // unlimited, https://sunrisesunset.io/api/
    await fetch("https://api.sunrisesunset.io/json?lat=" + lat + "&lng=" + lon)
        .then((response) => {
            return response.json().then((data) => {
                sunAPIres = data;
                sunAPIres.sunrise = sunAPIres.results.sunrise;
                sunAPIres.sunset = sunAPIres.results.sunset;
                sunAPIres.online = true;
            }).catch((error) => {
                sunAPIres.error = true;
            });
        })
}*/

async function clientAPI() { // unlimited, https://www.bigdatacloud.com/packages/free-api
    if (navigator.onLine) {
        await fetch("https://api-bdc.net/data/client-info")
            .then((response) => {
                return response.json().then((data) => {
                    clientAPIres = data;
                    clientAPIres.online = true;
                }).catch((error) => {
                    clientAPIres.error = true;
                });
            })
    } else {
        clientAPIres.error = true; // //
    }
}
/*
async function roamingAPI(lat, lon) { // unlimited, https://www.bigdatacloud.com/packages/free-api
    await fetch("https://api-bdc.net/data/am-i-roaming?latitude=" + lat + "&longitude=" + lon)
        .then((response) => {
            return response.json().then((data) => {
                roamingAPIres = data;
                roamingAPIres.online = true;
            }).catch((error) => {
                roamingAPIres.error = true;
            });
        })
}

async function timeAPI() { // unlimited, http://worldtimeapi.org/
    await fetch("https://worldtimeapi.org/api/ip")
        .then((response) => {
            return response.json().then((data) => {
                timeAPIres = data;
                timeAPIres.online = true;
            }).catch((error) => {
                timeAPIres.error = true;
            });
        })
}*/

async function countryAPI(v) { // unlimited, https://country.is/
    if (navigator.onLine) {
        await fetch("https://api.country.is/" + v)
            .then((response) => {
                return response.json().then((data) => {
                    countryAPIres = data;
                    countryAPIres.online = true;
                }).catch((error) => {
                    countryAPIres.error = true;
                });
            })
    } else {
        countryAPIres.error = true;
    }
}
/*
async function cloudflareCDN() { // unlimited, https://www.cloudflare.com/cdn-cgi/trace
    await fetch("https://www.cloudflare.com/cdn-cgi/trace")
        .then((response) => {
            return response.text().then((data) => {
                var _L = data.length - 1,
                    p = "", // property
                    v = "", // value
                    h = "", // hold
                    vC = false; // value check
                    
                for (i = 0; i <= _L; i++) {
                    if (data[i] === "\n") { // break
                        cloudflareCDNres[h] = v; // create a value
                        v = "";
                        h = "";
                        vC = false;
                    } else if (vC) { // value
                        v += data[i];
                    } else if (data[i] !== "=") { // property
                        p += data[i];
                    } else {
                        h = p;
                        cloudflareCDNres[h] = ""; // create a property
                        p = "";
                        vC = true;
                        continue;
                    }
                }
                cloudflareCDNres.online = true;
            }).catch((error) => {
                cloudflareCDNres.error = true;
            });
        })
}*/

/////////////////////////////////////////////////////////

/*
const obs = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(
        `The time to ${entry.name} was ${entry.startTime} milliseconds.`
      );
      // Logs "The time to first-paint was 386.7999999523163 milliseconds."
      // Logs "The time to first-contentful-paint was 400.6999999284744 milliseconds."
    });
  });*/

const ob = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1]; // Use the latest LCP candidate
    // console.log("LCP:", lastEntry.startTime);
    // console.log(lastEntry);
});

ob.observe({ type: "largest-contentful-paint", buffered: true });
  // obs.observe({ type: "paint", buffered: true });

const observer = new PerformanceObserver((list) => { // take note of performance events, as recorded in browser timeline
    list.getEntries().forEach((entry) => { // obtain details from an entryType
        if (entry.type === "navigate") {
            op.nav.n = true; // detect a direct nav.
        }
        if (entry.type === "back_forward") {
            op.nav.fb = true; // detect a forward/backward nav.
        }
        if (entry.type === "reload") { 
            op.nav.r = true; // detect a reload
        }
    })
});

observer.observe({type: "navigation", buffered: true}); // observe a navigation entryType

////////////////////////////////////////

// foreign-langugage (machine) translation detection
// REFERENCED FROM Daniel Aleksandersen, https://www.daniel.priv.no/ @2023

var fLang_el = document.getElementById("f_LangD"),
    hostname = window.location.hostname,
    translate_Check = false;

function checkTranslation() {
    var t = false,
        ta = document.documentElement.getAttribute("lang") !== "en" || navigator.language.indexOf("en") === -1;

    // server-side machine translations
    if (!t && ta) {
        t = [ "translate.googleusercontent.com", // Google Translate
                            "translate.google.",
                            "www.translatoruser-int.com", // Microsoft Bing Translate
                            "www.translatetheweb.com",
                            "ssl.microsofttranslator.com",
                            "www.microsofttranslator.com",
                            "translate.baiducontent.com", // Baidu Translate
                            "fanyi.baidu.com",
                            "z5h64q92x9.net", // Yandex Translate
                            "translate.yandex.",
                            "papago.naver.net" // Naver Papago
                            ].includes(hostname); // check if any of the URLS above are contained in host name
    }

    // client-side machine translations
    if (!t && ta) {
        t = !!document.querySelector("html.translated-ltr, html.translated-rtl, ya-tr-span, *[_msttexthash], *[x-bergamot-translated]"); // check for elements with given specs
    }

    if (!t && ta) { // universal check
        if (fLang_el.innerHTML && fLang_el.innerHTML !== "Made with <span class='em'>love</span> by me.") {
            t = false;
        }
    }

    return t;
}

translate_Check = checkTranslation();

////////////////////////////////////////

var focus_Check = false;

function checkFocus() {
    var f = false,
        n = (ex.f.length >= dev.t) ? ex.f.length - dev.t : 0,
        j = n,
        r = !document.hidden && !op.Lf.fb && !tDevice && rL.i;
    ex.f[ex.f.length] = r; // if document visible, but with NO focus
    while (n < (j + dev.t)) {
        if (ex.f[n] !== r) {
            f = true;
            n++;
        } else {
            f = false;
            break;
        }
    }
    if (f) {
        return !r;
    } else {
        // ex.f = [];
        return (!document.hidden && !op.Lf.fb && !tDevice && rL.i) ? r : false;
    }
}

focus_Check = checkFocus();

////////////////////////////////////////

osCheck();
// console.log(op.sys);
var aH;
if (getCookie("maxHeight") && tDevice) {
    aH = getCookie("maxHeight"); // get height from cookie
} else {
    aH = cH;
}

op = { 
    darkMode : op.darkMode,
    autoDark : false,
    refuseAutoDark : false,
    darkChange : false,
    autoDarkChange : false,
    host : hostname,
    tz : Intl.DateTimeFormat().resolvedOptions().timeZone, // get user device registered time zone
    lang : "", // english language variant
    // txts : document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, li, span"),
    txts : document.querySelectorAll(".lang, li"), // target variable keywords (eng.)
    as : op.as, // anchor scroll check
    ps : false, // peek scroll check
    psV : 0, // peek value
    // asV : false, 
    sDis : 150, // avg. scrolling distance
    sSmoothDef : dev.sSmooth, // scroll smoothness (default/reference)
    sSmooth : dev.sSmooth, // scroll smoothness (active)
    sys : op.sys, // add from index
    uA : op.uA,
    Ls : op.Ls,
    getPef : null, // get device performance function
    getPefCon : false, // "" usage control
    iPef : 0, // initial device performance
    pSpda : [], 
    pSpd : 0, // device processor speed (average estimated in GHZ)
    pSpdL : 0, // "" initial array length
    pMin : [8, 15], // min./rec. processor speed
    pCores : navigator.hardwareConcurrency, // no. of cpu logical cores
    pCoresMin : [2, 6], // cores min./rec.
    sfra : [],
    sfr : 0, // screen refresh rate
    sfrMin : [1, 60], // fps min./rec.
    sfrx : false, // execution
    c : { // cookies
        u : false, // [user] cookies-enabled-acceptance
        e : null, // enabled check
        a : null, // user access (inital) check [browser-dependant]
        t : dev.v, // default time limit (days)
        x : false // code execution
    },
    Ld : { // load
        // b : false, // abort status
        // s : null, // load status
        b : op.Ld.b,
        s : op.Ld.s,
        c : op.Ld.c,
        dom : 0, // 'domcontentloaded'
        a : 0, // 'load',
        p : 0, // y-scrollPos
        t : timeout, // threshold for timeout (general)
        x : false, // execution
        prL : null
    },
    nav : { // navigation
        d : document.referrer, // check for previous URI
        r : (document.referrer === window.location.href) ? true : false, // page reload check
        fb : false, // page forward/backward nav. check
        n : false, // page nav. check (direct)
        b : true, // URL bar in view check
        t : false // tab active?
    },
    pwa : { // PWA support
        a : false, // pwa allowed?
        i : false, // pwa installed?
        s : op.pwa.s, // pwa check?
        x : false
    },
    Lf : { // PAGE lifecycle API variables
        fb : op.Lf.fb, // focus/blur - (true/false)
        h : false, // hidden
        vA : false, // visible - active
        vP : false, // visible - passive
        f : false, // frozen
        t : false, // terminated
        d : false // discarded
    },
    ne : { // network speed estimator
        f : 5301699, // resource file size (bytes)
        h : 5, // slow speed threshold (MBps (* 1000000 = Bps)
        a : 0, // start time
        t : 0, // end time
        s : 0, // estimated speed 
        y : 0, // estimated variability (0 - 1)
        c : 0, // iterative count
        b : [], // array of accounted network speeds (for variability)
        bt : 3, // no. of checks for speed change
        bI : 60, // array refresh interval (sec.)
        bD : 3000, // default function interval (ms.)
        bT : "nV", // "" timer tracker
        off : false, // unexpected offline check
        reCon : false, // reconnection?
        noCon : true, // connection (of resources)
        r : false, // count incrementation check
        d : false, // slow speed boolean var hold
        v : false, // normal (high) speed ""
        w : true, // slow speed check - less than threshold?
        x : false, // code execution
        x1 : false, // code execution
        x2 : false, // code execution
        x3 : false, // code execution
        x4 : false, // code execution
        tc : false, // timeout code execution
        t0_5 : "t0_5", // timeout 0.5 timer tracker
        t0_5s : false, // timeout 0.5 status
        t0 : "t0", // timeout 0 timer tracker
        t0s : false, // timeout 0 status
        t1 : "t1", // timeout 1 timer tracker
        t1s : false, // timeout 1 status
        t2 : "t2", // timeout 2 timer tracker
        t2s : false, // timeout 2 status,
        t3 : "t3", // timeout 3 timer tracker
        t3s : false, // timeout 3 status
        t4 : "t4", // timeout 4 timer tracker
        t4s : false, // timeout 4 status
        L : null // loop
    },
    er : { // errors (fixes) - as messages
        d : false, // display (render)
        ch : false,  // caching
        dp : false,
        ft : false // fatal error
    },
    r : null, // resource link origin
    n : null, // online status (internet connectivity)
    nc : false, // online status change
    nR : false, // offline reload check
    s : false, // check boolean - 'force' disable scroll
    sc : false, // scroll status
    d : new Date(), // instance of Date
    p : { // pointer (press/tap/click)
        e : true, // execution boolean
        L : false, // check boolean - for long (extended) press/tap/click
        s : false, // use of stylus?
        tA : 0, // time - initial (at pointerdown)
        tB : 0 // time - final (at pointerup)
    },
    zoom : Math.round((window.outerWidth / window.innerWidth) * dev.z), // approx. [potential] zoom of page, in percentage
    zoomUndefault : false, // default check
    fC : false, // check if unfocused
    tr : false, // check if translated
    fS : false, // check if in full screen view, // fullscreen check (desktop only)
    sp : false, // check if in split view
    spR : false, // split-view, reload
    pl : false, // unsupported platform check
    oR : false, // recent orientation change?
    wR : false, // window resize change?
    wRo : false, // window resize offline change?
    oRa : [], // orientation change array
    wRa : [], // window resize change array
    svA : [0.2, 0.8], // scroll-animations threshold
    aP : 5, // approximator value
    t : 200, // transition duration - default (in ms.)
    // ti : 250, // "" interim
    te : 500, // transition duration (extended)
    // Ls : 1000/60, // loop (interval) speed - sec./rev.
    e : 2, // use loop speed (modifier) base value OR/AND site operations variable value
    vwM : 1.25, // viewport dimensions min. ratio
    f : window.getComputedStyle(document.body).getPropertyValue('font-size'), // get root font-size
    b : { // browser check (major platforms) 
        c : false, // chrome
        f : false, // firefox
        s : false, // safari
        o : false, // opera
        e : false, // edge
        fbApp : false, // facebook app
        iGApp : false, // instagram app
        LnApp : false // line app
    },
    bN : false, // if browser check null
    bNx : false,
    bInfo : {
        n : null, // name
        cVer : null, // current version
        cSts : null, // current status,
        p : null // info
    },
    col : { // colors (hex)
        b : "#303030", // base
        p : "#007000", // predicate
        n : "#A10000" // negate
    },
    L : null // loop variable
};
// op.zoomDefault = (op.zoom !== dev.z) ? true : false; // set zoom default status
op.zoomDefault = !approxNum(op.zoom, dev.z) ? true : false; // set zoom default status
op.zoomUndefault = op.zoomDefault ? true : false;

op.fN = num_Fs(op.f); // convert to number

window.addEventListener("resize", function() {
    op.f = window.getComputedStyle(document.body).getPropertyValue('font-size'); // get root font-size
    op.fN = num_Fs(op.f); // convert to number
});

/////////////////////////////////////////////////////////
/*
function devicePerformance(p, r, c) { // estimate device performance using parameters

    var pScore = (p >= op.pMin[0]) ? ((((p - op.pMin[0]) / (op.pMin[1] - op.pMin[0])) * 100) + 1) : 0, // performance score 
        rScore = (r >= op.sfrMin[0]) ? ((((r - op.sfrMin[0]) / (op.sfrMin[1] - op.sfrMin[0])) * 100) + 1) : 0, // screen refresh rate score
        cScore = (c >= op.pCoresMin[0]) ? ((((c - op.pCoresMin[0]) / (op.pCoresMin[1] - op.pCoresMin[0])) * 100) + 1) : 0; // logic cores score

    if (pScore > 100) {
        pScore = 0.6;
    } else if (pScore > 0) {
        pScore = (pScore / 100) * 0.6; // 60%
    } else {
        pScore = -1;
    }
    if (rScore > 100) {
        rScore = 0.3;
    } else if (rScore > 0) {
        rScore = (rScore / 100) * 0.3; // 30%
    } else {
        rScore = -1;
    }
    if (cScore > 100) {
        cScore = 0.1;
    } else if (cScore > 0) {
        cScore = (cScore / 100) * 0.1; // 10%
    } else {
        cScore = -1;
    }
    
    // MINS
    // 60% 1. p >= 8 GHZ
    // 30% 2. r >= 50 fps
    // 10% 3. c >= 2 cores
    // RECS
    // 60% 1. p >= 15 GHZ
    // 30% 2. r >= 60 fps
    // 10% 3. c >= 6 cores

    if (pScore !== -1 && rScore !== -1 && cScore !== -1) {
        return (pScore + rScore + cScore);
    } else {
        return 0;
    }
}*/

/////////////////////////////////////////////////////////
/*
const checkOnlineStatus_abort = new AbortController(); // respective abortion functions
const cos_signal = checkOnlineStatus_abort.signal;

cos_signal.addEventListener("abort", function() {
    op.Ld.b = true;
});

const estimateNetworkSpeed_abort = new AbortController();
const ens_signal = estimateNetworkSpeed_abort.signal;

ens_signal.addEventListener("abort", function() {
    op.Ld.b = true;
});

const checkOnlineStatus = async () => { // check for internet connectivity
    var res;
    try {
        const url = dev.mode ? dev.url : op.r;
        const online = await fetch(url + "msc/onlineResourceLocator.png", { // send a 'ping' signal to resource locator
            cache : "no-store",
            priority: "low",
            signal: cos_signal
        });
        res = online.status >= 200 && online.status < 300; // determine network status from return value
    } catch (err) { // maybe offline?
        if (!op.Ld.b) {
            res = false; // offline
        } else {
            res = null; // failed to fetch
        }
    } 
    return res;
}

const estimateNetworkSpeed = async() => { // estimate network speed
    try {
        var s;
        op.ne.a = op.d.getTime(); // start time of fetch
        const url = dev.mode ? dev.url : op.r;
        const online = await fetch(url + "msc/networkSpeedEstimator.jpg", { // send a 'ping' signal to resource locator
            cache : "no-store",
            priority: "low",
            signal: ens_signal
        });
        op.ne.t = op.d.getTime(); // end time of fetch
        op.ne.s = (op.ne.f / ((op.ne.t - op.ne.a) / 1000)) / 1000000; // approx. network speed (in MBps)
        if (op.ne.s !== Infinity && op.ne.s !== 0) { // get valid values only
            s = op.ne.s < op.ne.h ? true : false; // check for slow network (if less than 5 MBps speed)
            op.ne.w = s;
            if (!op.ne.b.length) { // start new timer (check for network variability)
                countdownTimerSec(op.ne.bI, op.ne.bT, null, networkVariability);
            }
            op.ne.b[op.ne.b.length] = op.ne.s; // add to variability array
            return s;
        } else {
            op.ne.s = op.ne.b[op.ne.b.length - 1]; // set value to previously accounted figure
            return null;
        }
    } catch (err) { // if network error
        op.ne.s = 0; // return 0 mbps
        return true; // default true
    }
}*/
/*
const networkConditions = async() => {
    const status = await checkOnlineStatus(); // check internet connection
    const speed = await estimateNetworkSpeed(); // check internet slow speed
    op.n = status;
    if (!op.n) {
        op.ne.w = null;
    }
    if (op.ne.w && speed) { // filters to avoid detecting 'sudden' surges in speed (leading to false slow network status)
        if (op.ne.c === op.ne.bt) { // at least n checks needed to prove
            if (!speed) {
                op.ne.d = true;
            }
            op.ne.c = 0;
        } else {
            if (!speed && op.ne.d) {
                op.ne.w = speed;
                op.ne.d = false;
            }
            op.ne.c++;
        }
    } else if (op.ne.w) {
        if (!op.ne.v) {
            op.ne.d = false;
        } else {
            op.ne.d = true;
        }
        if (!op.nc && !op.ne.d) {
            op.ne.w = false; 
        }
        if (op.ne.c !== 0 && (!op.ne.d || (op.ne.d && op.ne.v && !op.ne.r))) {
            // op.ne.d = true;
            op.ne.c = 0;
            op.ne.v = true;
        } else if (op.ne.c < op.ne.bt) {
            op.ne.d = true;
            op.ne.r = true;
            op.ne.c++;
        } else {
            op.ne.w = speed;
            op.ne.c = 0;
        }
        // op.ne.d = true;
    } else {
        op.ne.r = false;
        op.ne.v = true;
        if (op.ne.c === op.ne.bt) {
            op.ne.w = speed;
            op.ne.d = false;
            op.ne.c = 0;
        } else {
            op.ne.c++;
        }
    }
}*/

op.r = getSiteRes(); // get site resource origin

if (!op.pwa.s) {
    networkConditions(); // perform network check on startup

    op.ne.L = setInterval(async () => {
        networkConditions(); // continuously check on network
    }, op.ne.bD);
}
/*
function networkVariability() { // determine variability of network
    var c = op.ne.bD, // original interval timing
        a = dataAnalysis(op.ne.b),
        t = ((op.ne.bI * 1000) / op.ne.bD) + 1, // max number of data points (ideal)
        r = a.iprRange > 0 ? a.iprRange <= 100 ? (1 - (a.iprRange / 100)) * 100 : 0 : 0, // inverse percentage of range in speeds (comparison to 100mbps)
        f = (t - a.iprData.length >= 0) ? (a.iprData.length / t) * 100 : 100, // percentage of retained data
        s = a.iprStd >= 0 && a.iprStd <= a.iprData.length ? (1 - (a.iprStd / a.iprData.length)) * 100 : 0, // percentage of std. dev.
        v = 1 - (((0.4 * s) + (0.3 * r) + (0.3 * f)) / 100), // variability formula - as percentile
        b = a.iprData.length > 1 ? v >= 0 ? v : 0 : 0, // // default the negatives - if any [check if only 1 data element collected]

        i = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], // array of interval checkpoints
        w = [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000]; // array of possible timing intervals

    op.ne.y = b;

    for (j = 0; j <= i.length - 1; j++) { // loop through intervals to find suitable one for variability value
        if (b >= i[j] && b < i[j + 1]) {
            op.ne.bD = w[j];
            break;
        }
    }

    if (c !== op.ne.bD) { // if new interval set
        clearInterval(op.ne.L); // clear network check loop
        op.ne.L = setInterval(async () => { // restart a new loop with new interval value
            networkConditions(); 
        }, op.ne.bD);
    }

    // remove outliers 
    // take note of extremes
    // take note of DEVIATION
    // take note of number of data points that give the above stats

    // use the 'v' to allocate appropriate interval timing
    // 0: not variable
    // 1: highly variable

    op.ne.b = []; // empty array
}*/
/*
function networkTrend(ar) { // trend(s) of network speed
    var t_ar = [], // trend array
        base = null, // boolean
        full = null, 
        c = 0, // count
        d = false,
        res;    

    if (ar.length > 1) { 
        for (i = ar.length - 1; i >= 0; i--) { // backtrack from array (to check for trend)
            var a = ar[i - 1], // 2nd last element
                b = ar[i]; // last ""

            if (res === 0) {
                d = true;
            }
            res = ((b - a) !== 0 && a && b) ? (b - a) > 0 ? true : false : null; // return trend
            t_ar[t_ar.length] = res; // update trend in array

            if (i === ar.length - 1) { // at first element
                base = t_ar[t_ar.length - 1];
                c++;
            } else {
                if (t_ar[t_ar.length - 1] === base) {
                    c++; // increment if subsequent intervals match with base
                }
                if (res === 0 || d) {
                    break;
                } else if (t_ar[t_ar.length - 1] !== base) { // no trend
                    res = 0; // constant trend (default)
                } else if (c >= op.ne.bt) { // after consecutive trend intervals
                    full = base; // trend confirmed
                    break;
                }
            }
        }
    } else {
        res = 0; // return as constant
    }
    
    return (res !== 0) ? full: null;
}*/
/*
function loadAbort() { // abort (by user) @load_dot
    rL.i_s = true;
    rL.r_s = false;

    rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
    rL.dt.classList.add("md"); 
    op.ne.s = 0;

    if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t && !op.ne.tc) { // check if fonts are downloaded
        var cancelVariant = (op.lang === "gb" || !getCookie("usEng")) ? "cancelled" : "canceled";
        rL.xc.innerHTML = cancelVariant;
        op.ne.tc = true;
        e_Fd(rL.x, false); // show message when timeout
    }

    setTimeout(function() {
        window.stop(); // stop all network resource(s) fetching
        clearInterval(_Ld); // stop loading process
        clearInterval(op.ne.L); // clear network check loop

        checkOnlineStatus_abort.abort(); // abort any existing fetching
        estimateNetworkSpeed_abort.abort();
    }, op.te);
}*/

/////////////////////////////////////////////
/*
var completeInterval = null, renderedInterval = null, count = 0;
var yu = document.getElementById("image");
yu.src = '/ext/jpg/ivan_profile.jpg';

completeInterval = setInterval(function() {
    ++count;
    if (yu.complete || count > 20) {
      // Cancel checking once IMG is loaded OR we've tried for ~9s already
      clearInterval(completeInterval);
      completeInterval = null;
      count = 0;
      if (count > 20) {
        // Image load went wrong, so do something useful:
        console.error("ERROR: Could not load image");
      } else {
        // IMG is now 'complete' - but that just means it's in the render queue...
        // Wait for naturalWidth and naturalHeight to be > 0 since this shows
        // that the image is done being RENDERED (not just 'loaded/complete')
        renderedInterval = setInterval(function() {
          if (yu.naturalHeight > 0 && yu.naturalWidth > 0) {
            clearInterval(renderedInterval);
            renderedInterval = null;
            // Do whatever now that image is rendered (aka DONE):
            console.log("Image loaded - YAY!")
          }
        }, 100);
      }
    }
  }, 450);*/

///////////////////////////////////////

function reL() { // reload page
    if (!op.pwa.s) {
        window.location.reload(true);
        window.location.assign(window.location.href); // FIREFOX support
    }
}

function loadS_res(ar) { // check load statuses of all resource files
    var _L = ar.length,
        r = true;
    for (i = 0; i <= _L - 1; i++) { // loop through file types
        if (r) {
            for (var x in ar[i]) { // loop through indiv. resources of each type
                if (ar[i][x] === false) { // check load status
                    r = false;
                    break;
                }
            }
        } else {
            break;
        }
    }
    return r;
}

function resLoad_c(url, el, g, i) { // load a resource : modular
    if (g) { 
        for (var k = 0; k <= (el.length - 1); k++) {
            el[k].style.backgroundImage = "url(" + url + ")"; // style
            Rd[i + k] = true; // verify resource(s) ha(s/ve) been loaded
        }
    } else {
        if (el[0]) { // support for class elements ('el') with only 1 element
            el[0].style.backgroundImage = "url(" + url + ")"; // style
        } else {
            el.style.backgroundImage = "url(" + url + ")"; // style
        }
        Rd[i] = true;
    }
}

async function resLoad(el, src) { // load a resource to element (img)
    var id = op.r,
        g = (el.length > 1) ? true : false, // grouped elements if length > 1
        i = Rd.length; // GET current index
    if (g) {
        for (var j = i; j <= (i + (el.length - 1)); j++) { 
            Rd[j] = false // loop through (create new) 'Rd' booleans to address group resources 
        }
    } else {
        Rd[i] = false; // apply normally
    }
    if (!dev.mode) { // if NOT dev mode
        const promise = await fetch(id + src) // fetch resource
            .then((p) => { // WAIT for result

                resLoad_c(p.url, el, g, i);

                /*
                if (!dev.mode) {
                    resLoad_c(p.url, el, g, i);
                } else {
                    resLoad_c(id + src, el, g, i);
                }*/
                /*
                const res = p.url; // obtain url 
                if (g) { 
                    for (var k = 0; k <= (el.length - 1); k++) {
                        el[k].style.backgroundImage = "url(" + res + ")"; // style
                        Rd[i + k] = true; // verify resource(s) ha(s/ve) been loaded
                    }
                } else {
                    if (el[0]) { // support for class elements ('el') with only 1 element
                        el[0].style.backgroundImage = "url(" + res + ")"; // style
                    } else {
                        el.style.backgroundImage = "url(" + res + ")"; // style
                    }
                    Rd[i] = true;
                }*/

            })
            .catch((e) => {

                // 404 not found OR timeout

            })
    } else {
        resLoad_c(id + src, el, g, i);
    }
}

function getSiteRes() { // obtain site resource origin
    var a = dev.url.slice(dev.url.indexOf("//") + 2, dev.url.length), // use abs. path url (in dev.mode) OR live site url (in !dev.mode)
        b = dev.mode ? this.location.href.slice(0, (this.location.href.search(a) + a.length)) : dev.url;

    return b;
}
/*
function setCookie(n, v, days) { // create a cookie 
    const d = new Date(); // get current time
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires=" + d.toUTCString(); // add expiry time tag (days)
    if (days) {
        document.cookie = n + "=" + v + ";" + expires + ";path=/"; // attach cookie
    } else {
        document.cookie = n + "=" + v + ";path=/"; // attach cookie (with no expiration, deletes after browser session)
    }
}

function getCookie(n) { // obtain a cookie (if available)
    let name = n + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";"); // split cookie name-value pairs into array elements
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') { // ignore spaces at prefix and focus on significant characters
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) { // if cookie found
            return c.substring(name.length, c.length); // return its value
        }
    }
    return ""; // return nothing if not found
}*/
/*
function cookiesAccept() { // acknowledge user acceptance and allow site access


    msg_toggle(pg.msg.ckA, null, false, true, null);

    setTimeout(function() {
        if (getCookie("testCookie")) {
            setCookie("cookiesAccepted", "true", op.c.t); // cookie: cookies accepted
            op.c.u = true;
        }
        load_eN(); // continue load process if any (page specific)
    }, op.te);
}*/
/*
function checkFullScreen() {
    if ((window.innerHeight === screen.height || window.innerHeight === screen.availHeight) && !tDevice) { // only on desktops

        return true;    
    } else {
        return false;
    }
}
*/
//////////////////////////////////////////

// REFERENCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

//////////////////////////////////////////
/*
function sL() { // scroll pos. loop
    var contentHeight = pg.sc.c.getBoundingClientRect().height,
        scrollTr = 0;

    pos.y = window.scrollY; // update
    if (pos.y === 0) {
        pos.aT = true;
        pos.aTs = true;
        pos.r = true;

        op.as = false;



    } else if (pos.aT = true) {
        pos.aT = false;
        setTimeout(function() {
            pos.aTs = false;
        }, op.t);
    }

    if (pos.c && op.ps && (Math.round(pos.y) === Math.round(op.psV))) { // reset after peek (if applicable)
        op.ps = false; //
    }

    if (pos.c && !pos.sBc) { // if scrolling, show scrollbar
        e_Fd(pos.sB, false);
        pos.sBc = true;
    } else if (!pos.c && pos.sBc && !pos.cE && !condScrollBar) { ////
        e_Fd(pos.sB, true);
        pos.sBc = false;
    }

    scrollTr = (pos.y / (contentHeight - aH)) * (aH - (4 * op.fN)); // move scrollbar
    if (!condScrollBar && pos.sB) {
        pos.sB.style.transform = "translateY(" + (scrollTr) + "px)";
    }
}

function pL() { // site parameters loop
    op.d = new Date(); // update Date object
    if (op.p.e) {
        op.p.tA = op.d.getTime();
    }
    if (!op.iPef && op.pSpd && op.sfr && op.pCores) { // capture initial device performance value, to be used as reference
        op.iPef = devicePerformance(op.pSpd, op.sfr, op.pCores);
        op.pSpdL = op.pSpda.length;
        op.pSpda = [];
    } else if (!op.getPefCon) { // get (live) subsequent frame-rate/CPU usage values every 3 sec.
        op.getPefCon = true;
        setTimeout(function() {
            op.getPefCon = false;
        }, (dev.i * 3));
        if (op.getPef) {
            op.getPef();
        }
    }
    var liveSfr = mean(op.sfra.slice(-1 * (dev.i * 3))), // get screen refresh rates from last 3 seconds (mean)
        liveCPU = mean(op.pSpda.slice(-5)), // get live CPU usage values (previous 5)
        livePerformance = devicePerformance(liveCPU, liveSfr, op.pCores);

    if (livePerformance && op.iPef) { 
        var newSmooth = op.sSmoothDef * (livePerformance / op.iPef);
        op.sSmooth = newSmooth; // scroll smoothness based on device performance: low = less smooth
    }

    if (op.Lf.h) { // if document hidden
        setTimeout(function() {
            if (!document.hidden) {
                op.Lf.h = false; // reset
            }
        }, op.t);
    }

    if (op.s) { // 'force' enable/disable scroll when required
        document.documentElement.style.overflowY = "hidden"; // html
        document.body.style.overflowY = "hidden"; // body
        
    } else {
        document.documentElement.style.overflowY = "";
        document.body.style.overflowY = "";
        
    }

    if (pg.msg.io && pg.msg.ioS) { // hide buggy io messages
        var e = op.d.getTime();
        if ((e - pg.msg.ioS) > pg.msg.re && pg.msg.temp) { // check for buggy messages (beyond ext. res. time)
            msg_toggle(pg.msg.net, null, false, true, null); // hide message
            pg.msg.io = false;
            pg.msg.ioS = 0;
        }
    }

    if (rL && rL.i) {
        // if ((!hm.e && op.c.u && !eR.s) || pg.e) {
        
        if (!op.bNx) { // check if current platform is up-to-date
            op.bNx = true;
            if ((op.bInfo.cSts !== "latest" || getCookie("UMBResult") !== "latest") && (!eR.s) && !op.pl && !developer) { // if platform not updated

                scr_t(false, null); // disable scrolling
                op.s = true;
                op.pl = true;
                eR.m.classList.remove("d_n"); // show error in display
                eR.pl.classList.remove("d_n");   
                eR.pl_e.p.innerHTML = "outdated";
                eR.pl_e.h.innerHTML = "update";

                eR.pl_e.h.classList.add("hoverB");
                eR.pl_e.h.classList.add("trs");
                eR.pl_e.h.addEventListener('mousemove', hoverInit);
                eR.pl_e.h.addEventListener('mouseleave', hoverEnd);

                eR.pl_e.h.setAttribute("onclick", "location.href='" + op.bInfo.p.update_url + "'");
                // eR.pl_e.h.classList.add("u-p");

                e_Fd(disp, true); // fade out display

                pgTasks("sc", true);

                setTimeout(function() {
                    e_Fd(eR.pl, false);
                }, 10);
                eR.title = "Error: Outdated platform";
                eR.s = true;
                eR.h = "pl";
                eR.p = "pl";
                // document.title = eR.title;
            }
        }

        if ((op.er.d || op.er.ch || op.er.dp) && op.c.u && (!pg.msg.c && !pg.msg.k && !pg.cond.a && !hm.s && !pg.msg.fo)) { // display fix
        
            // edit message contents
            if (pg.msg.net_p.classList.contains("predicate") || pg.msg.net_p.classList.contains("negate")) { // UPDATE ACROSS ALL MESSAGES!
                pg.msg.net_p.classList.remove("predicate"); 
                pg.msg.net_p.classList.remove("negate"); 
            }
            pg.msg.net_p.classList.add("balanced"); // set color
            if (pg.msg.net_i.classList.contains("wifi_w_img") || pg.msg.net_i.classList.contains("wifi_off_w_img") || pg.msg.net_i.classList.contains("cookies_w_img")) {
                pg.msg.net_i.classList.remove("wifi_w_img"); 
                pg.msg.net_i.classList.remove("wifi_off_w_img"); 
                pg.msg.net_i.classList.remove("cookies_w_img"); // remove 
            }
            pg.msg.net_i.classList.add("info_w_img"); // set icon
            if (op.er.d) {
                pg.msg.net_t.innerHTML = "rendering fix"; // content
            } else if (op.er.ch) {
                pg.msg.net_t.innerHTML = "cache reload"; 
                setCookie("cacheReload", null, -1); // delete
            } else if (op.er.dp) {
                pg.msg.net_t.innerHTML = "low performance"; 
            }
    
            msg_toggle(pg.msg.net, null, true, false, false); // show message
            pg.msg.io = true;
            pg.msg.ioS = op.d.getTime();
            op.er.d = false;
            op.er.ch = false;
            op.er.dp = false;
        }
    }
    

    if (((!navigator.cookieEnabled && (!navigator.cookieEnabled || !getCookie("testCookie"))) || navigator.cookieEnabled && !getCookie("testCookie")) && op.c.e && !pg.msg.c && !eR.s && !op.pwa.s && rL.i) { // if cookies are disabled
        console.log("cookies deleted");
        
        if (!pg.msg.c && !pg.msg.k && !pg.cond.a && !hm.s && !pg.msg.fo) {
            op.c.e = false;
            pg.msg.cp = true;
            pg.msg.c = true;

            setCookie("cookiesAccepted", null, -1); // cookies deleted
            op.c.u = false;

            msg_toggle(pg.msg.net, null, false, true, null); // hide message

            if (pg.msg.net_p.classList.contains("predicate") || pg.msg.net_p.classList.contains("balanced")) { // UPDATE ACROSS ALL MESSAGES!
                pg.msg.net_p.classList.remove("predicate"); 
                pg.msg.net_p.classList.remove("balanced"); 
            }
            pg.msg.net_p.classList.add("negate"); // set color
            if (pg.msg.net_i.classList.contains("wifi_w_img") || pg.msg.net_i.classList.contains("wifi_off_w_img") || pg.msg.net_i.classList.contains("info_w_img")) {
                pg.msg.net_i.classList.remove("wifi_w_img"); 
                pg.msg.net_i.classList.remove("wifi_off_w_img"); 
                pg.msg.net_i.classList.remove("info_w_img");
            }
            pg.msg.net_i.classList.add("cookies_w_img"); // set content
            
            if (navigator.cookieEnabled && !getCookie("testCookie")) { // if cookies 'deleted/removed'

                pg.msg.net_t.innerHTML = "missing cookies";
                pg.msg.net_p.classList.add("md");
                pg.msg.net_e.innerHTML = "reload"; // add text
                pg.msg.net_e.classList.remove("d_n");
                // pg.msg.net_e.addEventListener("click", reL); // add reload function
                pg.msg.ce = true;
                pg.msg.cep = true;

            } else {
                pg.msg.net_t.innerHTML = "enable cookies";
            }

            setTimeout(function() {
                msg_toggle(pg.msg.net, null, true, true, true); // disable page, show message
            }, op.t);

        } else if ((pg.msg.c && !pg.msg.ce && !getCookie("testCookie")) && !pg.msg.k && !pg.cond.a && !hm.s && !pg.msg.fo) {

            msg_toggle(pg.msg.net, null, false, true, null); // hide message

            setTimeout(function() {
                if (!pg.msg.ce) { // if un-extended
                    pg.msg.net_t.innerHTML = "missing cookies";
                    pg.msg.net_p.classList.add("md");
                    pg.msg.net_e.innerHTML = "reload"; // add text
                    pg.msg.net_e.classList.remove("d_n");
                    // pg.msg.net_e.addEventListener("click", reL);
                    pg.msg.ce = true;
                    pg.msg.cep = true;
                }
                msg_toggle(pg.msg.net, null, true, true, true); // show message
            }, op.t);
        }

    } else if (!op.c.e && rL.i && (navigator.cookieEnabled )) { // if cookies enabled after disabling
        if (pg.msg.c && !pg.msg.k && !pg.cond.a && !hm.s && !pg.msg.fo) {
            if (getCookie("testCookie")) {
                msg_toggle(pg.msg.net, null, false, true, null); // hide message
            }
            if (!getCookie("testCookie")) {
                pg.msg.cp = true;
            }
            setTimeout(function() {
                if (pg.msg.ce && getCookie("testCookie")) { // if extended
                    pg.msg.net_p.classList.remove("md");
                    pg.msg.net_e.innerHTML = ""; // add text
                    pg.msg.net_e.classList.add("d_n");
                    // pg.msg.net_e.removeEventListener("click", reL);
                    pg.msg.ce = false;
                }
                op.c.e = true;
                if (getCookie("testCookie")) {
                    pg.msg.c = false;
                    pg.msg.cp = checkMsgIndex(pg.msg.p) ? false : true;
                } else {
                    pg.msg.c = true;
                }
            }, op.t);
        }
    }

    translate_Check = checkTranslation();
    if ((!eR.s) && translate_Check && !op.tr && rL && rL.i) {

        scr_t(false, null); // disable scrolling
        op.tr = true;
        op.s = true;
        eR.m.classList.remove("d_n"); // show error in display
        eR.tr.classList.remove("d_n");   
        e_Fd(disp, true); // fade out display

        pgTasks("sc", true);

        setTimeout(function() {
            e_Fd(eR.tr, false);
        }, 10);
        eR.title = "Error: Translation usage";
        eR.s = true;
        eR.h = "tr";
        eR.p = "tr";
        // document.title = eR.title;
    } else if ((!translate_Check || (checkFullScreen() || checkSplitScreen())) && eR.s && op.tr && rL && rL.i) {
        if (eR.tr_e.x) {
            reL(); // reload if on first load
            eR.tr_e.x = false;
            op.tr = false;
        } else {
            e_Fd(eR.tr, true);
            e_Fd(disp, false);

            eR.s = (eR.p === "ld" || checkFullScreen() || checkSplitScreen()) ? true : false;
            if (!eR.s) {
                if (op.c.u) {
                    pgTasks("sc", false);
                }
            }

            setTimeout(function() {
                if (op.c.u && !(vw.mB_L && tDevice)) { // if cookies accepted by user + non-landscape mode
                    scr_t(true, null); // enable scrolling
                    op.s = false;
                }
                op.tr = false;
                if ((vw.mB_L && tDevice)) { // if landscape error
                    eR.m.classList.remove("d_n"); 
                    eR.tr.classList.add("d_n"); 
                    eR.ld.classList.remove("d_n");
                    setTimeout(function() {
                        e_Fd(eR.ld, false);
                    }, 10);
                    eR.title = "Error: Landscape mode";
                    eR.s = true;
                    eR.h = "ld";
                    eR.p = "ld";
                    // document.title = eR.title;
                } else if (checkFullScreen() || checkSplitScreen()) {

                    scr_t(false, null); // disable scrolling
                    op.s = true;

                    var b = "";
                    if (checkSplitScreen()) {
                        eR.title = "Error: Split window";
                        b = "sp";
                        op.sp = true;
                    } else if (checkFullScreen()) {
                        eR.title = "Error: Fullscreen usage";
                        b = "fS";
                        op.fS = true;
                    }

                    eR.m.classList.remove("d_n"); 
                    eR.fC.classList.add("d_n"); 

                    eR[b].classList.remove("d_n");
                    setTimeout(function() {
                        e_Fd(eR[b], false);
                    }, 10);
                    
                    eR.s = true;

                    eR.h = b;
                    eR.p = b;

                    // document.title = eR.title;
                } else {
                    eR.m.classList.add("d_n"); // hide error in display
                    eR.tr.classList.add("d_n"); 
                    eR.s = false;
                    eR.h = "";
                    eR.p = "";

                    document.title = "Ivan Varghese";
                }
            }, op.t);
        }
    }

    if (checkFullScreen() && !eR.s && !op.fS && rL && rL.i) { // check if FullScreen is enabled (desktop only)
        scr_t(false, null); // disable scrolling
        op.fS = true;
        op.s = true;
        eR.m.classList.remove("d_n"); // show error in display
        eR.fS.classList.remove("d_n");   
        e_Fd(disp, true); // fade out display

        pgTasks("sc", true);

        setTimeout(function() {
            e_Fd(eR.fS, false);
        }, 10);
        eR.title = "Error: Fullscreen usage";
        eR.s = true;
        eR.h = "fS";
        eR.p = "fS";
        // document.title = eR.title;
    } else if (!checkFullScreen() && eR.s && op.fS && rL && rL.i) {
        if (eR.fS_e.x) {
            reL(); // reload if on first load
            eR.fS_e.x = false;
            op.fS = false;
        } else {
            e_Fd(eR.fS, true);
            e_Fd(disp, false);

            eR.s = (eR.p === "ld") ? true : false;
            if (!eR.s) {
                if (op.c.u) {
                    pgTasks("sc", false);
                }
            }

            setTimeout(function() {
                if (op.c.u && !(vw.mB_L && tDevice)) { // if cookies accepted by user
                    scr_t(true, null); // enable scrolling
                    op.s = false;
                }
                op.fS = false;
                if ((vw.mB_L && tDevice)) {
                    eR.m.classList.remove("d_n"); 
                    eR.fS.classList.add("d_n"); 
                    eR.ld.classList.remove("d_n");
                    setTimeout(function() {
                        e_Fd(eR.ld, false);
                    }, 10);
                    eR.title = "Error: Landscape mode";
                    eR.s = true;
                    eR.h = "ld";
                    eR.p = "ld";
                    // document.title = eR.title;
                } else {
                    eR.m.classList.add("d_n"); // show error in display
                    eR.fS.classList.add("d_n"); 
                    eR.s = false;
                    eR.h = "";
                    eR.p = "";

                    document.title = "Ivan Varghese";
                }
            }, op.t);
        }
    }

    if (op.Ld.s !== null && !op.oR && !op.wR) { // check for possible screen/window/tab splitting by user
        checkSplitScreen();
    } 

    focus_Check = checkFocus();
    if (!eR.s && focus_Check && !op.fC && !ex.a && rL && rL.i && !developer) {

        setTimeout(function() {
            if (!eR.s && focus_Check && !op.fC && !ex.a && rL && rL.i) {
                ex.a = true;

                scr_t(false, null); // disable scrolling
                op.fC = true;
                op.s = true;
                eR.m.classList.remove("d_n"); // show error in display
                eR.fC.classList.remove("d_n");   
                e_Fd(disp, true); // fade out display

                pgTasks("sc", true);

                setTimeout(function() {
                    e_Fd(eR.fC, false);
                }, 10);
                eR.title = "Error: Out of focus";
                eR.s = true;
                eR.h = "fC";
                eR.p = "fC";
                // document.title = eR.title;
            }
        }, (op.Ls * dev.t));

    } else if ((!focus_Check || (translate_Check || checkFullScreen() || checkSplitScreen())) && eR.s && op.fC && ex.a && rL && rL.i && !developer) {

        setTimeout(function() {
            ex.a = false;

            if (eR.fC_e.x) {
                reL(); // reload if on first load
                eR.fC_e.x = false;
                op.fC = false;
            } else {
                e_Fd(eR.fC, true);
                e_Fd(disp, false);

                eR.s = (eR.p === "ld" || translate_Check || checkFullScreen() || checkSplitScreen()) ? true : false;
                if (!eR.s) {
                    if (op.c.u) {
                        pgTasks("sc", false);
                    }
                }

                setTimeout(function() {
                    if (op.c.u && !(vw.mB_L && tDevice)) { // if cookies accepted by user + non-landscape mode
                        scr_t(true, null); // enable scrolling
                        op.s = false;
                    }
                    op.fC = false;
                    if ((vw.mB_L && tDevice)) { // if landscape error
                        eR.m.classList.remove("d_n"); 
                        eR.fC.classList.add("d_n"); 
                        eR.ld.classList.remove("d_n");
                        setTimeout(function() {
                            e_Fd(eR.ld, false);
                        }, 10);
                        eR.title = "Error: Landscape mode";
                        eR.s = true;
                        eR.h = "ld";
                        eR.p = "ld";
                        // document.title = eR.title;
                    } else if (translate_Check || checkFullScreen() || checkSplitScreen()) { // other errors

                        scr_t(false, null); // disable scrolling
                        op.s = true;

                        var b = "";
                        if (checkSplitScreen()) {
                            eR.title = "Error: Split window";
                            b = "sp";
                            op.sp = true;
                        } else if (checkFullScreen()) {
                            eR.title = "Error: Fullscreen usage";
                            b = "fS";
                            op.fS = true;
                        } else if (translate_Check) {
                            eR.title = "Error: Translation usage";
                            b = "tr";
                            op.tr = true;
                        }

                        eR.m.classList.remove("d_n"); 
                        eR.fC.classList.add("d_n"); 

                        eR[b].classList.remove("d_n");
                        setTimeout(function() {
                            e_Fd(eR[b], false);
                        }, 10);
                        eR.s = true;

                        eR.h = b;
                        eR.p = b;

                        // document.title = eR.title;

                    } else {
                        eR.m.classList.add("d_n"); // hide error in display
                        eR.fC.classList.add("d_n"); 
                        eR.s = false;
                        eR.h = "";
                        eR.p = "";

                        document.title = "Ivan Varghese";
                    }
                }, op.t);
            }
        }, (op.Ls * dev.t));
    }

    ///////////////////////////////////

    if ((!eR.s && ((op.n === false && !op.nc) || (op.n && op.nc))) || (!rL.i && op.n && !op.nc && (!op.ne.w || (op.ne.w && op.ne.off)))) { // if change in network connection (internet)
        if (!op.nc) { // offline
            if (!pg.msg.c && !pg.msg.k && !pg.cond.a && !hm.s && op.c.e && !pg.msg.fo) {
                
                if (rL.i) {
                    op.nc = true; // network changed
                    pg.msg.fo = true;
                } else if (op.ne.off) {
                    op.nc = true;
                }

                if (pg.msg.net_p.classList.contains("predicate") || pg.msg.net_p.classList.contains("balanced")) {
                    pg.msg.net_p.classList.remove("predicate"); 
                    pg.msg.net_p.classList.remove("balanced"); 
                }
                pg.msg.net_p.classList.add("negate"); // set color
                if (pg.msg.net_i.classList.contains("wifi_w_img") || pg.msg.net_i.classList.contains("cookies_w_img") || pg.msg.net_i.classList.contains("info_w_img")) {
                    pg.msg.net_i.classList.remove("wifi_w_img"); 
                    pg.msg.net_i.classList.remove("cookies_w_img");
                    pg.msg.net_i.classList.remove("info_w_img")
                }
                pg.msg.net_i.classList.add("wifi_off_w_img"); // set content
                pg.msg.net_t.innerHTML = "offline";
                
                msg_toggle(pg.msg.net, null, true, true, true);
            } else if (!pg.msg.ce && !pg.msg.k && !pg.cond.a && !hm.s && op.c.e && !pg.msg.fo) {
                // op.nc = true; // network changed

                if (rL.i) {
                    op.nc = true; // network changed
                    pg.msg.fo = true;
                } else if (op.ne.off) {
                    op.nc = true;
                }

                msg_toggle(pg.msg.net, null, false, true, true);

                setTimeout(function() {
                    if (pg.msg.net_p.classList.contains("predicate") || pg.msg.net_p.classList.contains("balanced")) {
                        pg.msg.net_p.classList.remove("predicate"); 
                        pg.msg.net_p.classList.remove("balanced"); 
                    }
                    pg.msg.net_p.classList.add("negate"); // set color
                    if (pg.msg.net_i.classList.contains("wifi_w_img") || pg.msg.net_i.classList.contains("cookies_w_img") || pg.msg.net_i.classList.contains("info_w_img")) {
                        pg.msg.net_i.classList.remove("wifi_w_img"); 
                        pg.msg.net_i.classList.remove("cookies_w_img");
                        pg.msg.net_i.classList.remove("info_w_img")
                    }
                    pg.msg.net_i.classList.add("wifi_off_w_img"); // set content
                    pg.msg.net_t.innerHTML = "offline";
                    
                    msg_toggle(pg.msg.net, null, true, true, true);
                }, op.t);
            }
            
        } else if (op.n & op.nc && rL.i && pg.msg.fo) { // back online  

            op.nc = false;
            msg_toggle(pg.msg.net, null, false, true, true); // hide offline

            setTimeout(function() {
                if (pg.msg.net_p.classList.contains("negate") || pg.msg.net_p.classList.contains("balanced")) {
                    pg.msg.net_p.classList.remove("negate"); 
                    pg.msg.net_p.classList.remove("balanced");
                }
                pg.msg.net_p.classList.add("predicate"); // set color
                if (pg.msg.net_i.classList.contains("wifi_off_w_img") || pg.msg.net_i.classList.contains("cookies_w_img") || pg.msg.net_i.classList.contains("info_w_img")) {
                    pg.msg.net_i.classList.remove("wifi_off_w_img"); 
                    pg.msg.net_i.classList.remove("cookies_w_img");
                    pg.msg.net_i.classList.remove("info_w_img");
                }
                pg.msg.net_i.classList.add("wifi_w_img"); // set content
                pg.msg.net_t.innerHTML = "back online!";

                msg_toggle(pg.msg.net, null, true, false, false); // show online
                pg.msg.io = true;
                pg.msg.ioS = op.d.getTime();
                setTimeout(function() {
                    pg.msg.fo = false;
                }, pg.msg.r + op.t);

            }, op.t);
        }
    }

    if (rL.i && !op.pwa.s) {
        js_live(); // run local functions (fch.js)
    }
}*/
/*
function checkScrollDir(ar) { // check direction of scroll
    var _L = ar.length - 1,
        res = new Array(_L).fill(null);

    for (i = 0, j = 0; i <= _L; i++) {
        if (ar[i - 1]) {
            if (ar[i] > ar[i - 1]) {
                res[j] = true;
            } else if (ar[i] < ar[i - 1]) {
                res[j] = false
            } else if (ar[i] === ar[i - 1]) {
                res[j] = null;
            }
            j++;
        }
    }

    for (j = 0; j <= (_L - 1); j++) {
        if (res[j - 1] || res[j - 1] === false || res[j - 1] === null) {   
            if (res[j] && res[j - 1]) { // true - downward
                return true;
            } else if (res[j] === false && res[j - 1] === false) { // false - upward
                return false;  
            } else { // constant - no change
                return pos.r;
            }
        }
    }
}*/
/*
function c_Sr() { // check for scrolling activity (in live)
    var d = (pos.yA !== 0) ? Math.abs(pos.y - pos.yA) : 0; // obtain distance of scroll
    if (d > pos.st) { // check if scroll distance is valid (of a true scroll - prevents unwanted scrolling)
        var _L = pos.a.length - 1,
            tB; 

        if (pos.y !== pos.a[_L]) {
            pos.c = true; // set scrolling to true

            // pos.r = (pos.y > pos.a[_L]) ? true : false; 
            pos.r = checkScrollDir(pos.a); // get direction of scroll

            pos.m = 0; // reset no. of matches - reset counter
            pos.d[pos.d.length] = pos.y; // update current y-pos into variable speed comparator array

            if (pos.d[pos.d.length - 2]) { // check if second y-pos defined
                pos.s = Math.abs((pos.d[pos.d.length - 1] - pos.d[pos.d.length - 2]) / (op.Ls * op.e)); // get scroll speed - relative speed between last updated and 2nd-last updated y-pos
                pos.v[pos.v.length] = pos.s; // update in session-scroll speed variability array
            }
        } else {
            if (pos.m <= _L) { 
                pos.m++; // increment no. of positive matches (to reach required threshold)
            } else {
                pos.c = false; // false only when consecutive pos-y values (in pos.a array) match with each other (hence, not scrolling)
                pos.d = []; // reset comparator array and speed to 0
                pos.v = []; // reset rec. speed
                pos.s = 0; // reset speed to 0
                pos.yA = 0;
            }
        }

        for (i = 0; i <= _L; i++) { // update y-pos data points to check for scroll
            if (i === _L) {
                pos.a[i] = pos.y;
            } else {
                pos.a[i] = pos.a[i + 1];
            }
        }
        
        if (document.documentElement.classList.contains("scB")) {
            document.documentElement.classList.remove("scB");
        }

    } else {
       
    }
}*/

//////////////////////////////////////////

// check if specific font family exists

/**
 * Checks if a font is available to be used on a web page.
 *
 * @param {String} fontName The name of the font to check
 * @return {Boolean}
 * @license MIT
 * @copyright Sam Clarke 2013
 * @author Sam Clarke <sam@samclarke.com>
 */

(function (document) { // function runs automatically
    var width;
    var body = document.body;
  
    var container = document.createElement('span'); // create element
    container.innerHTML = Array(100).join('wi'); // create 'wi' text repeated 99 times
    container.style.cssText = [ // style in following way (with !important)
      'position:absolute',
      'width:auto',
      'font-size:128px',
      'left:-99999px'
    ].join(' !important;');
  
    var getWidth = function (fontFamily) { // obtain width of text element created (in container, using fontFamily)
      container.style.fontFamily = fontFamily;
  
      body.appendChild(container);
      width = container.clientWidth;
      body.removeChild(container);
  
      return width;
    };
  
    // Pre compute the widths of monospace, serif & sans-serif
    // to improve performance.
    var monoWidth  = getWidth('monospace');
    var serifWidth = getWidth('serif');
    var sansWidth  = getWidth('sans-serif');
  
    window.isFontAvailable = function (font) {
      return monoWidth !== getWidth(font + ',monospace') || // if the width returns NOT EQUAL to the any of the 3 fallbacks above, then fontFamily is being used
        sansWidth !== getWidth(font + ',sans-serif') ||
        serifWidth !== getWidth(font + ',serif');
    };
})(document);

//////////////////////////////////////////

// stats

function atLeastHalf(a, b) { // check if a number is at least 50% of the other (integers only)
    var n = Math.round(a),
        d = Math.round(b),
        t = Math.ceil(d / 2);
    return n >= t;
}

function approxNum(v1, v2, e) { // check if 2 numbers are approximate
    var a = 0;
    if ((!v1 || !v2) && e) {
        return true;
    } else {
        if (!e) {
            a = op.aP;
        }
        return Math.abs(v1 - v2) < a;
    }
}

function medianHalf(t, ar, m) { // 25%/75% - q1/q3
    var sorted = ar.sort(function(a, b){return a-b}), // sort in asc. order
        cond, // condition
        half = []; // array halved

    for (i = 0, j = 0; i <= ar.length - 1; i++) { // loop through array
        cond = m ? sorted[i] <= t : sorted[i] >= t; // find 25% if m = true, else otherwise
        if (cond) {
            half[j] = sorted[i];
            j++;
        }
    }

    return median(half); // get median of halved array
}

function median(ar) { // median - q2
    var mid = Math.floor(ar.length / 2), // get middle value
        sorted = ar.sort(function(a, b){return a-b}); // sort in asc. order
        res = ar.length % 2 !== 0 ? sorted[mid] : ((sorted[mid] + sorted[mid - 1]) / 2); // find result
    return res;
}

function mean(ar) {
    var res = 0;
    for (i = 0; i <= ar.length - 1; i++) {
        res += ar[i];
    }
    return (res / ar.length);
}

function cleanOutliers(ar, L, u) { // remove outliers
    var res = [];
    for (i = 0, j = 0; i <= ar.length - 1; i++) {
        if (ar[i] >= L && ar[i] <= u) { // check if data point within thresholds
            res[j] = ar[i];
            j++;
        }
    }
    return res;
}

function removeAnomalies(c_ar, a, m, s, r) { // remove further anomalies (possible undetected outliers)

    // when no extreme observations, mean is more accurate.
    // with extreme observations, median is more accurate

    var e = [ // checks to detect if data has NOT extremes
            approxNum(a, m), // check if mean and median are approximately close
            r < a, // if range less than mean
            r < m // if range less than median
        ], c = 0, t = false,
        sorted = c_ar.sort(function(a, b){return a-b}), // sort in asc. order 
        uL = 0, // upper limit
        wL = 0, // lower limit
        ipr = [], // improve - 1
        iprItv = {
            g : 0, // average of intervals
            s : 0, // std of intervals
            r : 0, // no. of non-zero elements
            v : [], // checkpoints
            t : [], // intervals
            d : [], // focused intervals (indexed)
            m : [], // removal intervals (indexed)
            mL : null, // largest val. in low extreme segment
            mH : null, // smallest val. in high extreme segment
            a : [] // improve - 2
        }

    for (i = 0; i <= e.length - 1; i++) {
        if (c < 2) {
            if (e[i] === true) { // obtain 2 / 3 checks
                c++;
            }
        } else {
            t = true; // data NOT extreme
            break;
        }
    }

    if (t) { // use mean
        uL = a + s + op.aP; // upper limit = mean + std. + approximator val.
        wL = a - s - op.aP;
    } else { // use median
        uL = m + s + op.aP;
        wL = m - s - op.aP;
    }

    for (j = 0, k = 0; j <= sorted.length - 1; j++) { // loop elements that fit rules into new array
        if (sorted[j] > wL && sorted[j] < uL) { // if elements are within lower and upper boundaries
            ipr[k] = sorted[j];
            k++;
        }
    }
    for (m = 0, n = 0, q = 0; m <= ipr.length - 1; m++) {
        if (m > 0) { // at 2nd element or after
            iprItv.t[n] = Math.abs(ipr[m] - ipr[m - 1]); // get the interval between 2 consecutive elements
            iprItv.g += iprItv.t[n]; // cumulative intervals
            if (iprItv.t[n] !== 0) {
                q++;
            }
            if (m === ipr.length - 1) { // at last element
                var s = iprItv.t.length % 3; // get remainder
                iprItv.q = q; // no. of non-zero intervals
                // iprItv.g = iprItv.g / iprItv.q; // cal. average interval (among non-zero values only)
                iprItv.g = iprItv.g / iprItv.t.length; // cal. average of intervals 
                for (w = 0; w <= 2; w++) { // divide into 3 segments
                    iprItv.v[w] = (((iprItv.t.length - s) / 3) * (w + 1)) - 1;
                }
                switch (s) {
                    case 1: // remainder: 1
                        iprItv.v[s]++; // add the remainder(s) to respective segments
                        iprItv.v[s + 1]++;
                    break;
                    case 2: // remainder: 2
                        iprItv.v[s - 2]++; // add 1 to segment 1
                        iprItv.v[s - 1]++;
                        iprItv.v[s] += 2; // add 2 to last segment
                    break;
                }

                // DIVIDE interval array into 3 segments. Front, middle & back, Front & back are considered extremes.
                // if (n % 3 == 0) elements, divided evenly
                // if (n % 3 == 1) elements, divided evenly, with extra element in middle
                // if (n % 3 == 2) elements, divided evenly, with extra elements in extremes.

            } else {
                n++; 
            }
        }
    }
    iprItv.s = stdDeviation(iprItv.t, iprItv.g); // cal. std. of intervals with average
    if (iprItv.s) { // if std. is of value (elements are not identical)
        for (p = 0, q = 0; p <= iprItv.t.length - 1; p++) {
            if (!approxNum(iprItv.t[p], iprItv.g, iprItv.s) && !approxNum(iprItv.t[p], 0)) { // if intervals are NOT approx. to average, based on std. + of value at least 5
                iprItv.d[iprItv.d.length] = p; // store the index
            }
        }
    }
    if (iprItv.d.length) {
        for (r = 0, z = 0; r <= iprItv.d.length - 1; r++) {
            if (iprItv.d[r] <= iprItv.v[0] || (iprItv.d[r] > iprItv.v[1] && iprItv.d[r] <= iprItv.v[2])) { // if indexes at extreme segment-thirds
                iprItv.m[z] = iprItv.d[r]; // count in for removal
                z++;
            }
        }
    }
    if (iprItv.m.length) {
        for (x = 0; x <= iprItv.m.length - 1; x++) {
            if (iprItv.m[x] <= iprItv.v[0]) { // low extreme
                if (iprItv.mL === null || iprItv.m[x] > iprItv.mL) {
                    iprItv.mL = iprItv.m[x]; // find the largest indexed interval in low extreme segment
                }
            } else if (iprItv.m[x] > iprItv.v[1] && iprItv.m[x] <= iprItv.v[2]) { // high extreme
                if (iprItv.mH === null || iprItv.m[x] < iprItv.mH) {
                    iprItv.mH = iprItv.m[x]; // find the smallest indexed interval in high extreme segment
                } 
            }
        }

        // INTERVAL VERIFICATION

        if (iprItv.mL !== null && atLeastHalf(iprItv.mL + 1, iprItv.v[0] + 1)) {
            var v = iprItv.mL,
                e = iprItv.m.indexOf(v); 
            do {
                if (iprItv.m[e - 1]) { // backtrack to previous interval if it exists
                    v = iprItv.m[e - 1];
                    e--;
                } else {
                    iprItv.mL = -1; // if no more intervals to check, default to first element
                    break; 
                }
            }
            while (atLeastHalf(v + 1, iprItv.v[0] + 1));
        }
        if (iprItv.mH !== null && !atLeastHalf((iprItv.mH + 1) - (iprItv.v[1] + 1), (iprItv.v[2] + 1) - (iprItv.v[1] + 1))) {
            var v = iprItv.mH,
                e = iprItv.m.indexOf(v); 
            do {
                if (iprItv.m[e + 1]) { // forward track to next interval if it exists
                    v = iprItv.m[e + 1];
                    e++;
                } else {
                    iprItv.mH = iprItv.t.length - 1; // if no more intervals to check, default to last element
                    break; 
                }
            }
            while (atLeastHalf((v + 1) - (iprItv.v[1] + 1), (iprItv.v[2] + 1) - (iprItv.v[1] + 1)));
        }
        var mL = iprItv.mL === null ? 0 : iprItv.mL + 1, // attain high/low thresholds (if applicable)
            mH = iprItv.mH === null ? ipr.length - 1 : iprItv.mH;
        for (c = mL, d = 0; c <= mH; c++) {
            iprItv.a[d] = ipr[c]; // low & high extremes removed
            d++;
        }
    }

    return iprItv.a.length ? iprItv.a : ipr.length ? ipr : c_ar; // return profiled array (if applicable)
}

function stdDeviation(ar, m) { // standard deviation
    var res = 0;
    for (i = 0; i <= ar.length - 1; i++) {
        res += Math.pow((ar[i] - m), 2);
    }
    return Math.sqrt(res / ar.length);
}

function dataAnalysis(ar) {
    var data = {},
        q2 = median(ar), // median
        q1 = medianHalf(q2, ar, true), // 25%
        q3 = medianHalf(q2, ar, false), // 75%
        iqr = q3 - q1,
        outL = q1 - (1.5 * iqr), // lower outliers
        outU = q3 + (1.5 * iqr), // "" upper
        cleanData = cleanOutliers(ar, outL, outU), // remove outliers
        range = Math.max(...cleanData) - Math.min(...cleanData),
        avg = mean(cleanData), 
        std = stdDeviation(cleanData, avg),
        iprData = removeAnomalies(cleanData, avg, q2, std, range), // improved data
        iprRange = Math.max(...iprData) - Math.min(...iprData),
        iprAvg = mean(iprData),
        iprStd = stdDeviation(iprData, iprAvg);

    data = {
        data : ar,
        q2 : q2,
        q1 : q1,
        q3 : q3,
        iqr : iqr,
        outL : outL,
        outU : outU,
        cleanData : cleanData,
        range : range,
        avg : avg,
        std : std,
        iprData : iprData,
        iprRange : iprRange,
        iprAvg : iprAvg,
        iprStd : iprStd
    }

    return data;
}

//////////////////////////////////////////

function num_E(n) { // numeral digit extractor (interger + decimals if any, returns object)
    n = String(n); // convert to string type (if from number type)
    var _L = n.length - 1,
        d = 1, // decimal place property naming (if any)
        _s = true, // switch status (check in control flow switch)
        res = {
            0 : "" // integer 
        };
    for (i = 0; i <= _L; i++) { // loop through received digit sequence (in numeral)
        if (n[i] !== "." && _s) {
            res["0"] += n[i]; // add integer digit(s), inclusive of negative sign
        } else {
            if (_s) {
                i++; // avoid reading decimal point
                _s = false; // change to 'switched' status
            } else {
                d++; // increment (naming purpose)
            }
            res[String(d)] = n[i]; // add digit to new property in object
        }
    }
    return res; // return res.0 = integer, res.1 = first decimal digit, etc.
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

function num_S(n, c, a) { // convert any value to string format + divide into individual span elements
    var e = String(n),
        cL = c + a, // add personalised classes to the span elements
        _L = e.length - 1,
        res = "";
    for (i = 0; i <= _L; i++) {
        res += "<span class=" + cL + ">" + e[i] + "</span>";
    }
    return res;
}

function num_Ct(arr, t, s) { // check for any numbers in array - greater/lower than a threshold
    var _L = arr.length - 1,
        u = 0, // no. of true occurrences
        f = 0, // no. of false occurrences
        res;
    for (i = 0; i <= _L; i++) {
        u = s ? (arr[i] > t ? u + 1 : u) : (arr[i] < t ? u + 1 : u); // increment no. of true/false occurrences based on threshold checking
        f = s ? (arr[i] < t ? f + 1 : f) : (arr[i] > t ? f + 1 : f);
    }
    if (u > f) { // obtain a boolean result from the majority value
        res = true
    } else {
        res = false;
    }
    return (res !== undefined) ? res : false;
}

function s_Rep(s, p, n) { // extract/replace [string] character at indiv. pos. with new value
    var a = s.split(''); // split string to indiv. characters
    a[p] = n; // replace with new character
    return a.join(''); // join up characters
}

function chkVL(n, s) { // numeral - check for positive/non-zero value
    var res = false;
    if (s) { // check for positive numeral
        if (n > 0) {
            res = true;
        }
    } else {
        if (n !== 0) { // check for non-zero numeral
            res = true;
        }
    }
    return res;
}

function swap(node1, node2, rep) { // swap(replace) or shift node positions
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    if (rep) {
        node1.replaceWith(node2);
    }
    parent.insertBefore(node1, afterNode2);
}

function getCSSProperty(el, p) { // get css property values using window computed style method
    return num_Fs(window.getComputedStyle(el).getPropertyValue(p));
}

//////////////////////////////////////////

function countdownTimerSec(d, t, e, p) { // count down (in sec.)
    timer[t] = {}; // create object
    var i = 0, // init
        f = function() {
            if (i < d) { // if less than limit
                timer[t].s = d - i; // live countdown tracker
                if (e) {
                    e.innerHTML = timer[t].s;
                }
                i++; // iterate
            } else {
                clearInterval(timer[t].L); // clear at end
                if (p) {
                    p(); // run a function if applicable
                }
            }
        };
    timer[t].L = setInterval(f, 1000); // start loop
}

function getBd(el, p) { // retrieve getBoundingClientRect (bounding rectangle)
    if (el) {
        var elB = el.getBoundingClientRect(),
            elBp = elB[p]; // accessing specific property in bound(ed) object
        return elBp;
    } else {
        return null;
    }
}

function nwCiArr(ar) { // create a comparison [previous index] array
    var a = [],
        _L = ar.length - 1;
    for (i = 0, j = -1; i <= _L; i++, j++) {
        if (i > 0) {
            a[i] = j; // first element = last index of 'ar' array
        }
        else {
            a[i] = _L; // subsequent elements iterate the index, starting from 0
        }
    }
    return a;
}
/*
function msg_toggle(el, el_s, s, t, t_m) { // toggle for messages
    if (!eR.s && rL.i) { // when no errors

        if (s && !pg.msg.c) { // show

            var msgIndex = pg.msg.p.length;
            pg.msg.p[msgIndex] = false; // msg in queue

            if (!pg.msg.cep) {
                pg.msg.net_p.classList.remove("md"); // default
                pg.msg.net_e.innerHTML = ""; // remove 
                pg.msg.net_e.classList.add("d_n");
                pg.msg.ce = false;
            }

            if (el === pg.msg.ckA) {
                scr_t(false, null); // disable scrolling
                op.s = true;
                pg.msg.k = true;
            } else {
                pg.msg.cp = true;
                pg.msg.c = true;
            }
            pg.msg.el.classList.remove("d_n"); // show page
            el.classList.remove("d_n");
            if (!t && !t_m) { // if temporary message
                pg.msg.temp = true;
            } else { // if permanent
                pg.msg.temp = false;
            }

            setTimeout(function() {
                e_Sdv(el, s); // show message

                if (pg.msg.cep && pg.msg.net_p.classList.contains("md")) {
                    pg.msg.cep = false;
                }

                if (t && t_m) {
                    pg.msg.t.classList.remove("d_n"); 
                    setTimeout(function() {
                        pg.msg.t.classList.add("a"); // add low tint
                        pg.msg.t.classList.remove("md"); // add tint (if applicable)
                    }, 10);
                } else if (t) {
                    pg.msg.t.classList.remove("md"); 
                } else { // no tint + show->hide message
                    pg.msg.t.classList.add("d_n"); 
                    setTimeout(function() { // hide message after time

                        updateMsgIndex(msgIndex); // give update status

                        if (pg.msg.temp) {
                            if (pg.msg.io && pg.msg.ioS) {
                                pg.msg.io = false;
                                pg.msg.ioS = false;
                            }
                            msg_toggle(el, null, false, true, null);
                            setTimeout(function() {
                                pg.msg.t.classList.remove("d_n"); 
                            }, op.t);
                        }
                    }, pg.msg.r);   
                }
            }, 10); // after short delay

        } else if (!s) { // hide

            e_Sdv(el, s); // hide message
            if (el === pg.msg.ckA) {
                scr_t(true, null); // enable scrolling
                op.s = false;
                pg.msg.k = false;
            } 

            if (t && t_m) {
                pg.msg.t.classList.remove("a"); // remove low tint
                pg.msg.t.classList.add("md"); // remove tint
            } else if (t) {
                pg.msg.t.classList.add("md"); 
            }
            setTimeout(function() {

                if (!pg.msg.c && !pg.msg.cp) { // ensure no other messages (OR no other extended messages)
                    el.classList.add("d_n");
                    pg.msg.el.classList.add("d_n"); // hide page

                    if (pg.msg.ce && !pg.msg.cep) { // if extended
                        pg.msg.net_p.classList.remove("md"); // default
                        pg.msg.net_e.innerHTML = ""; // remove 
                        pg.msg.net_e.classList.add("d_n");
                        pg.msg.ce = false;
                        pg.msg.cep = false;
                    }
                }

                if (el !== pg.msg.ckA) {
                    pg.msg.c = false;
                    pg.msg.cp = checkMsgIndex(pg.msg.p) ? false : true;
                }

                if (pg.msg.p[pg.msg.p.length - 1] === true) { // if LAST message has completed display
                    el.classList.add("d_n");
                    pg.msg.el.classList.add("d_n"); // hide page
                }
 
            }, op.t);
            setCookie("displayErrorReload", null, -1); // delete
        }
        
        if (el_s) { // internal element reveal (if applicable)

        }

    } else if (rL.i) {
        if (s) { // if show
            if (el === pg.msg.ckA) { // show cookie acceptance after error
                scr_t(false, null); // disable scrolling
                op.s = true;
                setTimeout(function() { // keep checking for errors
                    msg_toggle(pg.msg.ckA, null, true, true, null); // try to show cookie-acceptance message
                }, 10);
            }
            setCookie("displayErrorReload", null, -1); // delete
        }
    }
}

function updateMsgIndex(d) {
    pg.msg.p[d] = true;
}

function checkMsgIndex(ar) {
    var res = true;
    for (i = 0; i <= (ar.length - 1); i++) {
        if (ar[i] === false) {
            res = false;
            break;
        }
    }
    return res;
}
*/
function popU_toggle(el, el_s, s, m) { // pop-up toggle for page window
    if (s) { // close
        pg.cond.a = false;
        pg.t = "";
        pg.w = "";

        e_Fd(pg[el].el, s);
        if (m) {
            setTimeout(function() {
                c_rep(pg[el].el, "z-I", "z-G");
            }, op.t);
        } else {
            c_rep(pg[el].el, "z-Kk", "z-G");
        }
        pg[el][el_s].classList.add("d_n");

        // setTimeout(function() {
        // op.s = false;
        if (op.c.u) {
            scr_t(true, null);
            op.s = false;
        }

        hm.e = false;
        pg.e = false;
        /*
        if (op.b.f) {
            pg.cond.el.style.height = "";
        }*/
        
        // }, op.t);
    } else { // open
        pg.cond.a = true;
        pg.t = el;
        pg.w = el_s;

        pg[el][el_s].classList.remove("d_n");
        if (m) {
            c_rep(pg[el].el, "z-G", "z-I"); // upgraded z-index
        } else {
            c_rep(pg[el].el, "z-G", "z-Kk");
        }
        e_Fd(pg[el].el, s);

        // el_s.classList.remove("d_n");
        // c_rep(el, "z-G", "z-Kk");
        // e_Fd(el, s);

        // setTimeout(function() {
        // op.s = true;
        if (op.c.u) {
            scr_t(false, null);
            op.s = true;
        }

        hm.e = true;
        pg.e = true;
        /*
        if (op.b.f) {
            pg.cond.el.style.height = wH + "px";
        }*/

        // }, op.t);
    }
}

//////////////////////////////////////////
/*
function changeSVGColor(color, el, trs_e) {
    var svg = el.contentDocument,
        elements = svg.getElementsByClassName("primaryColor"); // add class to relevant structures of SVG before function use
    for (var i = 0; i < elements.length; i++) { 
        elements[i].style.transition = "all 0s cubic-bezier(0.22, 0.61, 0.36, 1)"; // set transition
        if (trs_e) {
            elements[i].style.transitionDuration = "0.5s";
        } else {
            elements[i].style.transitionDuration = "0.2s";
        }
        elements[i].style.fill = color;
    }
}*/

function c_css(n, r, e, t, v, p) { // create new CSS class - dynamically using JS
    var style = document.createElement("STYLE"); // create 'style' tag
    style.type = "text/css"; 
    style.innerHTML = n + " { " + r + " }"; // combine name + rule(s)
    document.head.appendChild(style); // append to head
    if (e) { // if to-expiry is active
        setTimeout(function() {
            style.remove(); // remove style element after stipulated time
        }, t);
    }
    if (v !== undefined && p !== undefined) { // remove it when (some) object-variable changes
        var str = p.toString(),
            ix = c_cssL.length;
        c_cssL[ix] = setInterval(function() {
            if (!v[str]) {
                // console.log("remove");
                style.remove();
                clearInterval(c_cssL[ix]);
            }
        }, op.Ls);
    }
}

function c_rep(el, d, n) { // replace CSS class (any given in array) in element with new class (if applicable), 'd' array type
    if (Array.isArray(d)) { // if array of classes to compare
        var _L = d.length - 1;
        for (i = 0; i <= _L; i++) {
            if (el.classList.contains(d[i])) {
                el.classList.replace(d[i], n);
            } else {
                el.classList.add(n);
            }
        }
    } else { // else, only 1 class to replace
        if (el.classList.contains(d)) {
            el.classList.replace(d, n);
        } else {
            el.classList.add(n);
        }
    }
}

//////////////////////////////////////////
/*
function scr_t(s, pg) { // scroll toggle
    var h = document.documentElement,
        b = document.body;
    if (s && !pos.aL) { // enable
        op.sc = true;
        if (pg) { // if page
            
            c_rep(pg, "ovy-h", "ovy-s"); // enable scrolling
        } else { // or window
            
            c_rep(h, "ovy-h", "ovy-s"); // enable scrolling at html
            c_rep(b, "ovy-h", "ovy-s"); // body

            pos.aL = true; // alternated
        }
    } else if (!s && pos.aL) { // disable
        op.sc = false;
        if (pg) {
            
            c_rep(pg, "ovy-s", "ovy-h"); // disable scrolling
        } else {
            
            c_rep(h, "ovy-s", "ovy-h"); // disable scrolling at html
            c_rep(b, "ovy-s", "ovy-h"); // body

            pos.aL = false;
        }
    }
}*/

//////////////////////////////////////

// CODE REFERENCED FROM Manuel Otto @StackOverflow 2017: https://stackoverflow.com/questions/47011055/smooth-vertical-scrolling-on-mouse-wheel-in-vanilla-javascript

// Partial form of locomotive scrolling
/*
function SmoothScroll_init() {
	new SmoothScroll(document, op.sDis, op.sSmooth);
    /*
    Arguments (in order from left to right):
        target: the element to be scrolled smoothly - can be a div or document
        speed: the amout of pixels to be scrolled per mousewheel step 
        smooth: the smoothness factor, the higher the value, the more smooth. (referencing from live global variable)
    
}*/
/*
function SmoothScroll(target, speed, smooth) {
    if (target === document) {
        target = (document.scrollingElement 
            || document.documentElement 
            || document.body.parentNode 
            || document.body); // cross browser support for document scrolling
    }
    var moving = false;
    var pos = target.scrollTop;
    var frame = target === document.body 
            && document.documentElement 
            ? document.documentElement 
            : target; // safari is the new IE

    target.addEventListener('mousewheel', scrolled, { passive: false });
    target.addEventListener('DOMMouseScroll', scrolled, { passive: false });

    function scrolled(e) {
        if (!op.s && op.sc && !tch.e) { // if scrolling enabled
            e.preventDefault(); // disable default scrolling

            var delta = normalizeWheelDelta(e);

            pos += -delta * speed;
            pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight)); // limit scrolling

            if (!moving) {
                update();
            }
        } else if (tch.e) {
            op.s = true; // prevent scroll
            op.sc = false;

            if (!pg.msg.c && !pg.msg.k && !pg.cond.a && !hm.s && !pg.msg.fo && op.c.e) {
                if (pg.msg.net_p.classList.contains("predicate") || pg.msg.net_p.classList.contains("balanced")) {
                    pg.msg.net_p.classList.remove("predicate"); 
                    pg.msg.net_p.classList.remove("balanced");
                }
                pg.msg.net_p.classList.add("negate"); // set color
                if (pg.msg.net_i.classList.contains("wifi_off_w_img") || pg.msg.net_i.classList.contains("cookies_w_img") || pg.msg.net_i.classList.contains("wifi_w_img")) {
                    pg.msg.net_i.classList.remove("wifi_off_w_img"); 
                    pg.msg.net_i.classList.remove("cookies_w_img");
                    pg.msg.net_i.classList.remove("wifi_w_img");
                }
                pg.msg.net_i.classList.add("info_w_img"); // set content
                pg.msg.net_p.classList.add("md");
                pg.msg.net_t.innerHTML = "scroll disabled";
                pg.msg.net_e.innerHTML = "touch detected"; // add text
                pg.msg.net_e.classList.remove("d_n");
                pg.msg.ce = true;
                pg.msg.cep = true;

                msg_toggle(pg.msg.net, null, true, false, false); // show message
            }
        }
    }

    function normalizeWheelDelta(e) {
        if (e.detail) {
            if (e.wheelDelta) {
                return e.wheelDelta/e.detail/40 * (e.detail>0 ? 1 : -1); // Opera
            } else {
                return -e.detail/3; // Firefox
            }
        } else {
            return e.wheelDelta/120; // IE,Safari,Chrome
        }
    }

    function update() {
        moving = true;
    
        var delta = (pos - target.scrollTop) / op.sSmooth;
    
        if (!op.as && !op.ps) {
            target.scrollTop += delta;
        } else if (op.ps) {
            target.scrollTop = op.psV;
            pos = op.psV;
        } else {
            target.scrollTop = 0;
            pos = 0;
        }
    
        if (Math.abs(delta) > 0.5) {
            requestFrame(update);
        } else {
            moving = false;
        }
    }

    var requestFrame = function() { // requestAnimationFrame cross browser
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(func) {
                window.setTimeout(func, 1000 / 50);
            }
        );
    }()
}
*/
//////////////////////////////////////////

function disabledEventGlobal(e) { // disable event propagation (global)
    if (e.stopPropagation) {
        e.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true;
    }
    e.preventDefault();
    return false;
}

//////////////////////////////////////////

/*
const documentHeight = () => {
    // window.alert("Resize");
    const doc = document.documentElement;
    doc.style.setProperty("--doc-height", `${window.innerHeight}px`); // update height values of body/html on clientHeight resize
    // elementHeight = document.getElementById("control-height").innerHeight,
    barHeight = getBd(elementHeight, "height") - wH;
    barHeightTemp = (barHeightTemp !== barHeight && barHeight !== 0) ? barHeight : barHeightTemp; // change barHeightTemp only if non-zero variation in value
    op.nav.b = (barHeight > 0) ? true : false;
}
window.addEventListener("resize", documentHeight);
documentHeight();*/

/*
function isZooming(){
    var newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if(newPx_ratio != px_ratio){
        px_ratio = newPx_ratio;
        console.log("zooming");
        return true;
    }else{
        console.log("just resizing");
        return false;
    }
}*/

// Split screen detection
/*
function checkSplitScreen() {

    var u = dev.uH.getBoundingClientRect(),
        b = dev.cH.getBoundingClientRect(), // bounding rectangle
        bTop = Math.round(b.top),
        bBottom = Math.round(b.bottom),
        bLeft = Math.round(b.left),
        bRight = Math.round(b.right);

    // uHeight = Math.round(u.height);

    setTimeout(function() {
        if (!op.oR && !op.wR) {
            
            if (viewportValid() && op.spR && !(bTop > window.screen.availHeight || bBottom > window.screen.availHeight || bLeft > window.screen.availWidth || bRight > window.screen.availWidth) && !((((bTop / window.screen.availHeight) * 100) > dev.sC_a[0]) || (((bBottom / window.screen.availHeight) * 100) < dev.sC_a[1]) || (((bLeft / window.screen.availWidth) * 100) > dev.sC_a[2]) || (((bRight / window.screen.availWidth) * 100) < dev.sC_a[3]))) {
                reL();
                op.spR = false;
            } else if (!op.sp && (!eR.s || (eR.s && (eR.p === "ld" || translate_Check || checkFullScreen() || checkFocus()))) && !(bTop > window.screen.availHeight || bBottom > window.screen.availHeight || bLeft > window.screen.availWidth || bRight > window.screen.availWidth) && ((((bTop / window.screen.availHeight) * 100) > dev.sC_a[0]) || (((bBottom / window.screen.availHeight) * 100) < dev.sC_a[1]) || (((bLeft / window.screen.availWidth) * 100) > dev.sC_a[2]) || (((bRight / window.screen.availWidth) * 100) < dev.sC_a[3]))) { 
                
                if ((eR.p !== "ld" && eR.p !== "tr" && eR.p !== "fS" && eR.p !== "fC") && eR.s) { // if other errors
                    var a = eR.p;
                    e_Fd(eR[a], true);
                    setTimeout(function() {
                        eR[a].classList.add("d_n");
                    }, op.t);
                }
                
                var b = "";
                if (checkFullScreen()) {
                    b = "fS";
                    op.fS = true;
                } else if (translate_Check) {
                    b = "tr";
                    op.tr = true;
                } else if (checkFocus()) {
                    b = "fC";
                    op.fC = true;
                } else if (eR.p === "ld") {
                    b = "ld";
                }

                if (!op.oR && !op.wR && b !== "ld") {
                    eR.title = "Error: Split window";
                    eR.s = true;
                    op.sp = true; // split screen active
                    scr_t(false, null); // disable scrolling
                    op.s = true;

                    disp.classList.add("z_Os"); 
                    eR.m.classList.remove("d_n");

                    pgTasks("sc", true);

                    if ((eR.p === "ld" || translate_Check || checkFullScreen() || checkFocus()) && !(bTop > window.screen.availHeight || bBottom > window.screen.availHeight || bLeft > window.screen.availWidth || bRight > window.screen.availWidth) && ((((bTop / window.screen.availHeight) * 100) > dev.sC_a[0]) || (((bBottom / window.screen.availHeight) * 100) < dev.sC_a[1]) || (((bLeft / window.screen.availWidth) * 100) > dev.sC_a[2]) || (((bRight / window.screen.availWidth) * 100) < dev.sC_a[3]))) {
                        e_Fd(eR[b], true);
                        setTimeout(function() {
                            eR[b].classList.add("d_n");
                        }, op.t);
                    }

                    eR.sp.classList.remove("d_n");
                    setTimeout(function() {
                        eR.sp.classList.remove("z_O");
                    }, 10);

                    if (!rL.i || ((eR.p === "ld" || translate_Check || checkFullScreen() || checkFocus()) && !(bTop > window.screen.availHeight || bBottom > window.screen.availHeight || bLeft > window.screen.availWidth || bRight > window.screen.availWidth) && ((((bTop / window.screen.availHeight) * 100) > dev.sC_a[0]) || (((bBottom / window.screen.availHeight) * 100) < dev.sC_a[1]) || (((bLeft / window.screen.availWidth) * 100) > dev.sC_a[2]) || (((bRight / window.screen.availWidth) * 100) < dev.sC_a[3])))) { // if page not loaded
                        op.spR = true;
                    }

                    eR.p = "sp";
                    // document.title = eR.title;
                    return true;
                }

            } else if (op.sp && !(bTop > window.screen.availHeight || bBottom > window.screen.availHeight || bLeft > window.screen.availWidth || bRight > window.screen.availWidth) && !((((bTop / window.screen.availHeight) * 100) > dev.sC_a[0]) || (((bBottom / window.screen.availHeight) * 100) < dev.sC_a[1]) || (((bLeft / window.screen.availWidth) * 100) > dev.sC_a[2]) || (((bRight / window.screen.availWidth) * 100) < dev.sC_a[3]))) { // no splitting, no error

                if (Number(getCookie("maxWidth")) === window.innerWidth && Number(getCookie("maxHeight")) === window.innerHeight) {
                    setTimeout(function() {
                        // r = pgOr(wD, cH); // get screen orientation (using dimensions)
                        // vw = vwP(wD, cH, r); // set device size/orientation params

                        function getParam() {
                            if (wD > 0 && cH > 0) {
                                r = pgOr(wD, cH); // get screen orientation (using dimensions)
                                vw = vwP(wD, cH, r); // set device size/orientation params
                                clearInterval(op.Ld.prL);
                            } else {
                                wD = window.outerWidth; // re-declare
                                cH = !op.pwa.s ? document.documentElement.clientHeight : window.innerHeight;
                                if (!op.Ld.x) {
                                    op.Ld.prL = setInterval(getParam, op.Ls);
                                    op.Ld.x = true;
                                }
                            }
                        }
                        getParam();
                        
                        if ((vw.mB_L && tDevice) || (!op.c.u && !tDevice)) { // if in landscape (mobile)
                            reL();
                            op.sp = false;
                        } else {
                            op.sp = false; // split screen de-active
                            eR.sp.classList.add("z_O");
                            setTimeout(function() {
                                disp.classList.remove("z_Os"); 
                                eR.sp.classList.add("d_n");
                                eR.m.classList.add("d_n");
                                if (eR.p === "ld") {
                                    eR[eR.p].classList.remove("d_n");
                                }

                                if (op.c.u) {
                                    pgTasks("sc", false);
                                }

                                eR.s = false;
                                eR.p = "";
                                scr_t(true, null); // enable scrolling
                                op.s = false;

                                document.title = "Ivan Varghese";

                            }, op.t);
                        }
                    }, 10);
                } else if (op.n && !op.wRo && !op.pwa.s) {
                    setCookie("maxHeight", window.innerHeight, op.c.t);
                    setCookie("maxWidth", window.innerWidth, op.c.t);
                    reL();
                    op.sp = false;
                }
            }
        }
    }, 10);
}*/

// for zoom detection
var px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
/*
window.addEventListener("resize", function(e) {

    var newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (newPx_ratio != px_ratio && !tDevice) { // zooming - only applicable to desktop browsers
        px_ratio = newPx_ratio;
        console.log("zooming");

        op.zoom = !op.b.f ? Math.round((window.outerWidth / window.innerWidth) * dev.z) : Math.round(Number((Number(getCookie("maxHeight")) / window.innerHeight).toFixed(2)) * dev.z); // FIREFOX follows a different strategy (cookie-based, initial user settings)
        var w = dev.z / dev.z,
            zOff = (op.zoom / dev.z) - w,
            zScale = op.zoom < dev.z ? w - zOff : (w + (zOff / 2) <= (w + 0.25)) ? w + (zOff / 2) : (w + 0.25);
        if (!approxNum(op.zoom, dev.z) && op.zoom !== 0) { // if potential new zoom reference is NOT default (Zoom resizing)

            var pE = eR.p,
                p = errorPrecedence("z", eR.p, eR.a);
            if (!eR.s || (eR.s && p !== false && p !== undefined)) {
                eR.title = "Error: Undefaulted zoom";
                eR.p = "z"; // zoom error
                scr_t(false, null); // disable scrolling
                op.s = true;

                eR.m.style.transform = "scale(" + zScale + ")"; // use scale transformation techniques to display text with respect to browser zoom
                op.zoomUndefault = true;

                e_Fd(disp, true); // hide page

                pgTasks("sc", true);

                if (op.ne.w || op.b.f) { // if network slow
                    eR_t.z.classList.remove("d_n"); // display error small text
                } else {
                    if (!eR_t.z.classList.contains("d_n")) {
                        eR_t.z.classList.add("d_n"); // display error small text
                    }
                }
                eR.m.classList.remove("d_n"); // display error_main
                eR.z.classList.remove("d_n"); // display message

                if (eR.s && p) {
                    e_Fd(eR[pE], true);  // hide previous error message
                    setTimeout(function() {
                        eR[pE].classList.add("d_n"); // display message
                    }, op.t);
                } 
                eR.s = true;
                // document.title = eR.title;

                setTimeout(function() {
                    e_Fd(eR.z, false);  // show message
                }, 10);   
                
                disabledEventGlobal(e); // possible event stoppage
            }
            
        } else if (approxNum(op.zoom, dev.z) && op.zoomUndefault && eR.h) { // zoom undefaulted, then defaulted

            if (!op.ne.w) { // proceed only with fast networks
                reL(); // reload page if error at initial
                eR_t.z.classList.add("md");
                eR_t.z.innerHTML = "loading..."; // change text status
            }

        } else if (approxNum(op.zoom, dev.z) && op.zoomUndefault && window.innerWidth <= 3100) { // zoom undefaulted
            
            scr_t(true, null); // enable scrolling
            op.s = false;

            eR.m.style.transform = "scale(1)"; // reset text transformation
            op.zoomUndefault = false;

            e_Fd(eR.z, true);  // hide message
            e_Fd(disp, false); // show page

            if (op.c.u) {
                pgTasks("sc", false);
            }

            setTimeout(function() {
                eR.m.classList.add("d_n"); // hide error_main
                eR.z.classList.add("d_n"); 
                eR.s = false;
                eR.p = "";
                document.title = "Ivan Varghese";
            }, op.t);  

        }

        return true;

    } else {
        // console.log("just resizing");

        var u = dev.uH.getBoundingClientRect(), 
            b = dev.cH.getBoundingClientRect(), // bounding rectangle
            bTop = Math.round(b.top),
            bBottom = Math.round(b.bottom),
            bLeft = Math.round(b.left),
            bRight = Math.round(b.right);

        
        setTimeout(function() {
            if (!op.oR && !op.pwa.s) {
                if ((wH !== window.outerHeight && wD !== window.outerWidth) || wD !== window.outerWidth || (wH !== window.outerHeight && (Math.round(u.height) !== uHeight))) { // check for change in width/height values before proceeding (viewport resizing, no orientation changing)

                    var id = op.wRa.length; // set id to resize
                    op.wRa[id] = true; //

                    op.wR = true;
                    setTimeout(function() {
                        if ((op.wRa.length - 1) === id) {
                            op.wR = false;
                        }
                    }, op.te);

                    if ((eR.p !== "ld") && !op.sp && op.n && !op.wRo && (((displayErrorCheck()) || (wH !== window.outerHeight && wD !== window.outerWidth) || wD !== window.outerWidth || (wH !== window.outerHeight && (Math.round(u.height) !== uHeight))) && !(bTop > window.screen.availHeight || bBottom > window.screen.availHeight || bLeft > window.screen.availWidth || bRight > window.screen.availWidth) && !((((bTop / window.screen.availHeight) * 100) > dev.sC_a[0]) || (((bBottom / window.screen.availHeight) * 100) < dev.sC_a[1]) || (((bLeft / window.screen.availWidth) * 100) > dev.sC_a[2]) || (((bRight / window.screen.availWidth) * 100) < dev.sC_a[3])))) {
                        pg.sc.m.classList.add("d_n"); // remove page from display (for slow networks)
                        setCookie("displayErrorReload", "true", op.c.t); // show potential message
                        reL();
                    } else if (!op.n && !op.wRo) { // if offline
                        op.wRo = true;
                    } else if (!op.n && op.wRo && (!pos.c && (op.sys === "Android" || op.sys === "iOS"))) { // online, and no scroll (in touch devices)
                        op.wRo = false;
                    }

                    wH = window.outerHeight; // update on window size variables
                    wD = window.outerWidth; 
                    cH = document.documentElement.clientHeight;

                    wiD = window.innerWidth;
                    wiH = window.innerHeight

                    setCookie("windowResize", true, op.c.t);
                }
            }
        }, 10);

        return false;
    }
});*/
/*
function wordType(w) { // determine the type of word - Capitalised, UPPER CASE, lower case
    var ar = w.toString(),
        invalid = false,
        alpha = false,
        c = false, // capitalised
        u = false, // uppercase
        L = false; // lowercase
        
    for (i = 0; i <= (ar.length - 1); i++) {
        if (ar[i].match(/[a-z]/i)) { // ONLY check on alphabets
            alpha = true;
            if (i === 0) { // first letter
                if (ar[i].toUpperCase() === ar[i]) { // CAPITAL
                    c = true;
                    if (i === (ar.length - 1)) { // if ONLY LETTER in WORD
                        u = false;
                    } else {
                        u = true;
                    }
                } else if (ar[i].toLowerCase() === ar[i]) { // LOWER CASE
                    L = true;
                }
            } else if (i === 1) { // second letter
                if (ar[i].toUpperCase() === ar[i]) { // UPPER CASE
                    if (c) { // IF CAPITAL
                        c = false;
                        u = true;  
                    } else {
                        invalid = true;
                    }
                } else if (ar[i].toLowerCase() === ar[i]) {
                    if (c) { // IF CAPITAL
                        c = true;
                        u = false;  
                    } else {
                        L = true; // LOWER CASE
                        c = false;
                        u = false;  
                    }
                }
            } else if (i > 1) { // break at second letter or higher
                break;
            }
        } else if (!alpha) {
            invalid = true;
            break;
        }
    }

    if (invalid) { // RETURN VALUE
        return "Invalid";
    } else if (c) {
        return "Capital";
    } else if (u) {
        return "Uppercase";
    } else if (L) {
        return "Lowercase";
    }
}
*/

// Function to get index of occurrence - REFERENCE: https://www.geeksforgeeks.org/how-to-get-nth-occurrence-of-a-string-in-javascript/

function getIndex(str, substr, ind) {
    let Len = str.length,
        i = -1;
    while (ind-- && i++ < Len) {
        i = str.indexOf(substr, i);
        if (i < 0) break;
    }
    return i;
}

// Function to count number of substrings in a string - REFERENCE: https://www.geeksforgeeks.org/how-to-count-string-occurrence-in-string-using-javascript/

function substrInStr(substr, str) {
    let s = str;
    let f = substr;
    let r = s.indexOf(f);
    let d = 0;
    while (r != -1) {
        d++;
        r = s.indexOf(f, r + 1);
    }
    return d;
}

// Function to return indices of substrings in a string - REFERENCE: Tim Down, https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript

function substrInStrIndices(substr, str) {
    var sbs = substr,
        regex = new RegExp(sbs, 'gi'), 
        result, 
        indices = [];
    while ( (result = regex.exec(str)) ) {
        indices.push(result.index);
    }
    return indices;
}

// Function to return status if target is in array

function findInArray(tgt, ar) {
    return ar.includes(tgt);
}

/////////////////////////////////////////////////
/*
function viewportValid() { // check if viewport dimensions are proper/supported/non-square
    if (vw) {
        if (vw.pH || (!vw.pH && !vw.tB)) {
            if ((wiH >= (wiD * op.vwM) && !vw.mB_L) || (wiD >= (wiH * op.vwM) && vw.mB_L)) {
                return true;
            }
        } else if (vw.tB) {
            if (wiD >= (wiH * op.vwM)) {
                return true;
            }
        }
        return false;
    } else {
        function getParam() {
            if (wD > 0 && cH > 0) {
                r = pgOr(wD, cH); // get screen orientation (using dimensions)
                vw = vwP(wD, cH, r); // set device size/orientation params
                clearInterval(op.Ld.prL);
                viewportValid();
            } else {
                wD = window.outerWidth; // re-declare
                cH = !op.pwa.s ? document.documentElement.clientHeight : window.innerHeight;
                if (!op.Ld.x) {
                    op.Ld.prL = setInterval(getParam, op.Ls);
                    op.Ld.x = true;
                }
            }
        }
        getParam();
    }
}
*/
/*
screen.orientation.addEventListener("change", function() { // mobile/tablet orientation change

    if (!op.pwa.s) {

        var id = op.oRa.length; // set id to orientation
        op.oRa[id] = true;

        scr_t(false, null); // disable scrolling
        op.s = true;
        op.oR = true;
        setTimeout(function() {
            if ((op.oRa.length - 1) === id) {
                op.oR = false;
            }
        }, op.te);

        if (eR.p !== "sp") { // if NOT split screen

            rL.el.classList.add("d_n");
            eR.m.classList.add("d_n");
            disp.classList.add("z_Os");

            // uHeight = Math.round(u.height);

            if (rL.i && !rL.o_c && (screen.orientation.angle == 90 || screen.orientation.angle == 270)) { // portrait to landscape
                op.Ld.p = pos.y;
            }

            pgTasks("sc", true);

            setTimeout(function() {

                wH = window.outerHeight; // update on window size variables
                wD = window.outerWidth; 
                cH = document.documentElement.clientHeight;

                wiD = window.innerWidth;
                wiH = window.innerHeight;

                if (rL.i && !rL.o_c) { // if page had loaded?

                    if (screen.orientation.angle == 0 || screen.orientation.angle == 180) { // landscape to portrait

                        window.scrollTo(0, op.Ld.p);

                        if (wiD < 500 && (eR.ld_e.x || rL.o_c) && (screen.orientation.angle == 0 || screen.orientation.angle == 180)) { // if loaded on this error

                            if (eR.ld_e.x && !rL.o_c) {
                                eR.ld.classList.add("d_n");
                                e_Fd(eR.ld, true);
                                if (!vw.mB_L) {
                                    eR.m.classList.remove("d_n");
                                    eR.or.classList.remove("d_n");
                                    e_Fd(eR.or, false);
                                } else {
                                    c_css(".err", "margin-top: 0;", false, null); // style tag
                                    eR.m.classList.remove("d_n");
                                    eR.or.classList.remove("d_n");
                                    e_Fd(eR.or, false);
                                    reL();
                                }
                            } else {
                                eR.m.classList.add("d_n");
                                if (!rL.o_c) {
                                    eR.ld.classList.add("d_n");
                                } else {
                                    eR.or.classList.add("d_n");
                                }
                                reL(); // reload to portrait
                            }

                        } else if (wiD < 500 && (screen.orientation.angle == 0 || screen.orientation.angle == 180)) { // remove error on mobile portrait (from landscape to portrait)

                            vw.mB_L = false;
                            // eR.s = false;

                            // const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // get user device registered time zone

                            op.pSpd = mean(op.pSpda) ? mean(op.pSpda) : 0; //

                            // STATIC ERRORS (UPDATE WHEN NEEDED!)
                            if ((op.b.f || op.sys === null || op.bN || op.pl) && (devicePerformance(op.pSpd, op.sfr, op.pCores) > 0 && rL.i)) { // check for platform support
                                if (op.b.f) {
                                    eR.pl_e.h.innerHTML = "firefox";
                                } 
                                if (op.bN) { // browser
                                    eR.pl_e.h.innerHTML = "conflicting hints";
                                }
                                if (op.sys === null) { // system
                                    eR.pl_e.h.innerHTML = "unknown system";
                                }
                                eR.p = "pl";
                                eR.title = "Error: Unsupported platform";
                            } else if (js_load_e() || op.er.ft) { 
                                eR.p = "ft"; // fatal error
                                eR.title = "Error: Fatal callback";
                            } else if ((devicePerformance(op.pSpd, op.sfr, op.pCores) === 0)) { // device compatibility (incompatible speed/rendering)
                                eR.p = "dp";
                                eR.title = "Error: Low device performance";
                            } else if ((ipAPIres.online && ((op.tz !== ipAPIres.timezone && vw.dk) || (op.tz !== timeAPIres.timezone && !vw.dk))) || (ipifyAPIres.online && timeAPIres.online && (op.tz !== timeAPIres.timezone)) || (clientAPIres.online && clientAPIres.isBehindProxy) || (roamingAPIres.online && roamingAPIres.isRoaming)) {
                                eR.p = "vp"; // check for vpn/proxy
                                eR.title = "Error: VPN usage";
                            } else if (!op.c.e) {
                                eR.p = "ck"; // check for cookies
                                eR.title = "Error: Cookies disabled";
                            } else if (op.mt) {
                                eR.p = "mt"; // maintenance
                                eR.title = "Error: Under maintenance";
                            } else if (op.fS) {
                                eR.p = "fS"; // full screen
                                eR.title = "Error: Fullscreen usage";
                                op.fS = true;
                            } else if (translate_Check) {
                                eR.p = "tr"; // translate
                                eR.title = "Error: Translation usage";
                                op.tr = true;
                            } else {
                                eR.p = "";
                            }

                            if (eR.p) {
                                eR.m.classList.remove("d_n");
                                eR.ld.classList.add("d_n");
                                if (eR.p !== "or") {
                                    eR.or.classList.add("d_n");
                                }
                                eR[eR.p].classList.remove("d_n"); // show error message
                                setTimeout(function() {
                                    e_Fd(eR[eR.p], false);
                                }, 10);
                                eR.s = true;
                                // document.title = eR.title;
                            } else {
                                eR.m.classList.add("d_n");
                                eR.s = false;
                                document.title = "Ivan Varghese";
                            }
                            if (aborted || !cacheEnabled) { // show load
                                rL.el.classList.remove("d_n");
                            } else if (!rL.o_c) {
                                eR.ld.classList.add("d_n");
                                e_Fd(eR.ld, true); // fade error out
                            } else {
                                eR.or.classList.add("d_n");
                                e_Fd(eR.or, true); // fade error out
                            }
                            disp.classList.remove("z_Os");

                            setTimeout(function() {
                                e_Fd(disp, false); // fade in display

                                if (op.c.u) {
                                    pgTasks("sc", false);
                                }

                                if (!eR.s && !pg.cond.a && !hm.s && op.c.u) { 
                                    scr_t(true, null); // enable scrolling
                                    op.s = false;
                                }

                            }, op.t);

                        } else if (wiD >= 500 && (screen.orientation.angle == 0 || screen.orientation.angle == 180)) {

                            // from tablet to phablet, etc.
                            if (eR.p && eR.s) {
                                eR[eR.p].classList.add("d_n");
                            }

                            eR.m.classList.remove("d_n"); // show orientation change
                            eR.or.classList.remove("d_n");
                            e_Fd(disp, true);
                            setTimeout(function () {
                                e_Fd(eR.or, false);
                                disp.classList.add("d_n");
                            }, 10);

                            reL();

                            // make modifications if needed

                        }
                    }
                    
                    if (screen.orientation.angle == 90 || screen.orientation.angle == 270) { // portrait to landscape

                        // op.Ld.p = scrollY;

                        if (wiH < 500 && (screen.orientation.angle == 90 || screen.orientation.angle == 270)) { // show error on mobile landscape (mobile portrait to mobile landscape)

                            eR.title = "Error: Landscape mode";

                            scr_t(false, null); // disable scrolling
                            op.s = true;
                            eR.s = true;

                            // document.title = eR.title;

                            vw.mB_L = true; // set variable

                            if (eR[eR.p]) {
                                if (!eR[eR.p].classList.contains("d_n") && !eR[eR.p].classList.contains("z_O")) { // set any other error(s) beforehand to null display
                                    eR[eR.p].classList.add("d_n");
                                }
                            }

                            eR.p = "ld";
                            
                            disp.classList.add("z_Os");
                            e_Fd(disp, true); // fade main display out

                            pgTasks("sc", true);

                            eR.m.classList.remove("d_n");
                            if (!rL.o_c && !eR.ld_e.x) {
                                eR.ld.classList.remove("d_n");
                            } else {
                                eR.or.classList.remove("d_n");
                            }

                            setTimeout(function() {
                                if (!rL.o_c && !eR.ld_e.x) {
                                    e_Fd(eR.ld, false); // fade in error
                                } else {
                                    c_css(".err", "margin-top: 0;", false, null); // style tag
                                    e_Fd(eR.or, false); // fade in error
                                }
                            }, op.t);

                        } else if (wiH >= 500 && (screen.orientation.angle == 90 || screen.orientation.angle == 270)) {

                            // from phablet to tablet, desktop, etc.
                            if (eR.p && eR.s) {
                                eR[eR.p].classList.add("d_n");
                            }

                            eR.m.classList.remove("d_n"); // show orientation change
                            eR.or.classList.remove("d_n");
                            e_Fd(disp, true);
                            setTimeout(function () {
                                e_Fd(eR.or, false);
                                disp.classList.add("d_n");
                            }, 10);

                            reL();

                            // make modifications if needed

                        }
                    }
                } else if (!rL.o_c) { // if page not loaded (or preloading)

                    if (isFontAvailable("Poppins") && isFontAvailable("Raleway")) {
                        c_css(".err", "margin-top: 0;", false, null); // style tag
                        rL.o_c = true;

                        scr_t(false, null); // disable scrolling
                        op.s = true;

                        eR.m.classList.remove("d_n");
                        eR.or.classList.remove("d_n");
                        setTimeout(function() {
                            e_Fd(eR.or, false);
                        }, 10);

                        eR.title = "Error: Orientation change";

                        eR.s = true;
                        eR.p = "or";

                        // document.title = eR.title;

                    } else {

                        rL.o_c = true;
                        c_css("#load_C", "margin-top: calc((" + wiH + "px - 8rem) / 2);", false, null);
                        rL.el.classList.remove("d_n");
                        eR.m.classList.add("d_n");

                    }

                    window.stop(); // stop all network resource(s) fetching
                    clearInterval(_Ld); // stop loading process
                    clearInterval(op.ne.L); // clear network check loop

                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                    estimateNetworkSpeed_abort.abort();

                } else if (rL.o_c) {
                    reL();
                }
            }, op.t);

        } 
    }
});
*/
//////////////////////////////////////////

window.addEventListener("visibilitychange", async function() { // stop network check if tab/window in background
    if (rL.i && !eR.s) {
        if (document.hidden) { // hidden document
            op.Lf.h = true;
            op.Lf.vP = false;
            op.Lf.vA = false;
            clearInterval(op.ne.L); // clear network check loop
        } else { // visible document
            if (document.hasFocus()) { // in focus
                op.Lf.vA = true;
                op.Lf.vP = false;
            } else { // out of focus
                op.Lf.vP = true;
                op.Lf.vA = false;
            }
            if (!op.pwa.s) {
                op.ne.L = setInterval(async () => {
                    networkConditions(); // continuously check on network
                }, op.ne.bD);
            }
            /*
            if (screenLock !== null) {
                screenLock = await navigator.wakeLock.request('screen');
            }*/
        }
    }
});

// PAGE LIFECYCLE API

document.addEventListener("freeze", function() { // The page is now frozen.
    op.Lf.f = true;
});

document.addEventListener("resume", function() { // The page has been unfrozen.
    op.Lf.f = false;
});

document.addEventListener("pagehide", function() { // the page is now terminated
    op.Lf.t = true;
})

document.addEventListener("pageshow", function() { // the page is now terminated
    op.Lf.t = false;
})

if (document.wasDiscarded) { // Page was previously discarded by the browser while in a hidden tab.
    op.Lf.d = true;
}

window.addEventListener("focus", function() { // window in focus
    op.Lf.fb = true;
});

window.addEventListener("blur", function() { // window out of focus
    op.Lf.fb = false;
});

//////////////////////////////////////////

var windowCount;

window.addEventListener("beforeunload", function(e) { // DUPLICATE TAB detection (LOCAL browsers only)
    op.nav.t = false;
    windowCount = getCookie("num_windows");
    if (parseInt(windowCount) > 1) {
        windowCount = parseInt(windowCount) - 1;
        setCookie("num_windows", windowCount, op.c.t);
    } else if (parseInt(windowCount) === 1) {
        setCookie("num_windows", null, -1);
    }
}, false);

window.addEventListener("unload", function(e) { // DUPLICATE TAB detection (LOCAL browsers only, mobile support)
    if (op.nav.t) {
        windowCount = getCookie("num_windows");
        if (parseInt(windowCount) > 1) {
            windowCount = parseInt(windowCount) - 1;
            setCookie("num_windows", windowCount, op.c.t);
        } else if (parseInt(windowCount) === 1) {
            setCookie("num_windows", null, -1);
        }
    }
}, false);

window.addEventListener("load", function() {
    op.nav.t = true;
    windowCount = getCookie("num_windows");
    if (windowCount === null || windowCount === "") {
        setCookie("num_windows", 1, op.c.t);
    } else {
        var c = parseInt(getCookie("num_windows"));
        setCookie("num_windows", (c + 1), op.c.t);
    }
});

////////////////////////////////////////////

window.addEventListener("load", function() {
    rL.y = true; // page has been rendered
});
/*
window.addEventListener("load", () => { 
    if ("serviceWorker" in navigator) { // register a service worker
        navigator.serviceWorker.register("service-worker.js");
    }
});*/

window.addEventListener('pagehide', function (event) {
    if (event.persisted) {
      // If the event's persisted property is `true` the page is about
      // to enter the Back-Forward Cache, which is also in the frozen state
      setCookie("cacheReload", "true", op.c.t); // set 'cache reload' cookie
    }
}), { 
    capture: true 
};

/////////////////////////////////////////////

// REFERENCED FROM WEB.DEV: https://web.dev/customize-install/

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => { 
    if (!vw.pH && !vw.tB) { // mobile
        op.pwa.iBtn = document.getElementById("dw_btn"); // pwa install button
        op.pwa.iBtn_h = document.getElementById("dw_btn_h4"); // pwa install button h4
    } else if (vw.pH) { // phablet
        op.pwa.iBtn = document.getElementsByClassName("dw_btns")[0];
        op.pwa.iBtn_h = document.getElementsByClassName("dw_btn_h4s")[0];
    } else if (vw.tB) { // tablet
        op.pwa.iBtn = document.getElementsByClassName("dw_btns")[1];
        op.pwa.iBtn_h = null;
    }

    e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
    deferredPrompt = e; // Stash the event so it can be triggered later.
    showInstallPromotion(); // Update UI notify the user they can install the PWA

    console.log(`'beforeinstallprompt' event was fired.`); // Optionally, send analytics event that PWA install promo was shown.
});
/*
function showInstallPromotion() { // activate install button
    op.pwa.a = true;
    if (hm.e && (vw.pH || (!vw.pH && !vw.tB))) { // mobile/phablet - hamburger menu
        if (op.pwa.x) {
            op.pwa.iBtn.classList.remove("o-img"); // show button
            op.pwa.iBtn.classList.add("hoverB");
            setTimeout(function() {
                op.pwa.iBtn.addEventListener("click", installPrompt); // add click function

                op.pwa.iBtn.addEventListener('mousemove', hoverInit);
                op.pwa.iBtn.addEventListener('mouseleave', hoverEnd);

            }, op.t);            
        } else {
            installBtnToggle(true);
        }
    } else if (vw.tB) {
        if (op.pwa.x) {
            op.pwa.iBtn.classList.remove("o-img"); // show button
            op.pwa.iBtn.classList.add("hoverB");
            setTimeout(function() {
                op.pwa.iBtn.addEventListener("click", installPrompt); // add click function

                op.pwa.iBtn.addEventListener('mousemove', hoverInit);
                op.pwa.iBtn.addEventListener('mouseleave', hoverEnd);

            }, op.t);            
        } else {
            installBtnToggle(true);
        }
    }

    // other stuff
}*/
/*
function hideInstallPromotion() { // de-activate install button
    if (op.pwa.i) { // if installed
        installBtnToggle(false);
    } else {
        if (hm.e && (vw.pH || (!vw.pH && !vw.tB))) {
            op.pwa.iBtn.removeEventListener("click", installPrompt); // remove click function
            op.pwa.iBtn.classList.add("o-img"); // hide button
            op.pwa.iBtn.classList.remove("hoverB");

            op.pwa.iBtn.removeEventListener('mousemove', hoverInit);
            // op.pwa.iBtn.removeEventListener('mouseleave', hoverEnd);

        } else if (vw.tB) {
            op.pwa.iBtn.removeEventListener("click", installPrompt); // remove click function
            op.pwa.iBtn.classList.add("o-img"); // hide button
            op.pwa.iBtn.classList.remove("hoverB");

            op.pwa.iBtn.removeEventListener('mousemove', hoverInit);
            // op.pwa.iBtn.removeEventListener('mouseleave', hoverEnd);
        }
    }

    // other stuff
}*/
/*
async function installPrompt() {
    hideInstallPromotion(); // Hide the app provided install promotion

    deferredPrompt.prompt(); // Show the install prompt
    const { outcome } = await deferredPrompt.userChoice;  // Wait for the user to respond to the prompt
    console.log(`User response to the install prompt: ${outcome}`); // Optionally, send analytics event with outcome of user choice

    deferredPrompt = null; // We've used the prompt, and can't use it again, throw it away
}*/
/*
async function checkInstallation() {
    const relatedApps = await navigator.getInstalledRelatedApps();
    relatedApps.forEach((app) => {
        console.log(app.id, app.platform, app.url);
    });
}
checkInstallation();
*/
/*
window.addEventListener('appinstalled', () => {
    
    op.pwa.i = true;
    hideInstallPromotion(); // Hide the app-provided install promotion
    deferredPrompt = null; // Clear the deferredPrompt so it can be garbage collected
    console.log('PWA was installed'); // Optionally, send analytics event to indicate successful install

});*/

//////////////////////////////////////////

// REFERENCED FROM MEDIUM: https://medium.com/js-bytes/how-to-keep-your-screen-awake-using-javascript-aa15775d9bff

// let screenLock;

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

/////////////////////////////////////////
/*
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
    let displayMode = 'browser';
    if (evt.matches) {
        displayMode = 'standalone';
    } else {
        reL();
    }

});

window.matchMedia('(display-mode: browser)').addEventListener('change', (evt) => {
    let displayMode = 'standalone';
    if (evt.matches) {
        displayMode = 'browser';
    } else {
        reL();
    }

});*/

//////////////////////////////////////////
/*
var fullscreenActive = false;

window.addEventListener("click", function(event) { // 
    if ((getPWADisplayMode() === "twa" || getPWADisplayMode() === "standalone") && !fullscreenActive) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenActive = true;
        }).catch((err) => {
            fullscreenActive = false;
        });
    }
});*/

window.addEventListener("touchstart", function(event) { // IF TOUCH detected on screen
    tch.e = true;
    tch.s = true;
    if (event.touches.length === 1) { // ensure only 1 touch on screen at all times
        tch.d = false;
        tch.yA = event.touches[0].clientY;
    }
    /*
    if ((getPWADisplayMode() === "twa" || getPWADisplayMode() === "standalone") && !fullscreenActive) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenActive = true;
        }).catch((err) => {
            fullscreenActive = false;
        });
    }*/

    cursorSmall.classList.add("d_n");
    cursorBig.classList.add("d_n"); // remove cursor from view

    // if (!op.pwa.s) {
        touchActive = true;
    // }

    if (cursorBased) {
        cursorBased = false;
    }

    if (!screenInteract) {
        screenInteract = true;
    }
});

window.addEventListener("touchmove", function(event) {

    cursorSmall.classList.add("d_n");
    cursorBig.classList.add("d_n"); // remove cursor from view

    // if (!op.pwa.s) {
        touchActive = true;
    // }

    if (cursorBased) {
        cursorBased = false;
    }

    /*
    if ((getPWADisplayMode() === "twa" || getPWADisplayMode() === "standalone") && !fullscreenActive) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenActive = true;
        }).catch((err) => {
            fullscreenActive = false;
        });
    }*/
    if (event.touches.length === 1) {
        var drg = 0;
        tch.yB = event.touches[0].clientY;
        if (!tch.d) {
            tch.d = true;
        } else {
            drg = tch.yB - tch.yA;
            tch.drV = Math.abs(drg); // get abs of drg
            if (drg < 0) { // scroll down
                tch.dr = true;
            } else if (drg > 0) { // scroll up
                tch.dr = false;
            }
        }
        if (tch.e && tch.drV) { // ONLY APPLY TO VERTICAL TOUCH DRAGS ONLY (USED FOR SCROLLING PURPOSE)
    
            op.s = false; // allow scroll
            op.sc = true;
        }
    }
});

window.addEventListener("touchend", function(event) {
    if (event.touches.length === 0) {
        var drg = 0;
        if (tch.d) { // if dragging
            drg = tch.yB - tch.yA;
            tch.drV = Math.abs(drg); // get abs of drg
            if (drg < 0) { // scroll down
                tch.dr = true;
            } else if (drg > 0) { // scroll up
                tch.dr = false;
            }
        } else {
            tch.d = false;
            tch.dr = null; // reset
            tch.yA = 0;
            tch.yB = 0;
            tch.drV = 0;
        }
        setTimeout(function() {
            tch.s = false;
        }, 10);
    }
});

/////////////////////////////////////////////

// REFERENCE: https://blog.logrocket.com/creating-custom-mouse-cursor-css/

const cursorSmall = document.querySelector('.cursor.small');
const cursorBig = document.querySelector('.cursor.big');
const hoverBtns = document.querySelectorAll('a, .hoverB');
var cursorTempActive = false,
    cursorActive = false,
    touchActive = false,
    hoverActive = false;

var cursorBased = false,
    screenInteract = false;

const positionElement = (e)=> {

    if (op.pwa.s) {
        cursorTempActive = true;
    }

    // if ((window.matchMedia('(orientation: landscape)').matches && ((wiD >= 1200 && wiH >= 700) || wiH >= 800))) { // ONLY IN DESKTOP PARAMs
    if (((window.matchMedia('(orientation: landscape)').matches && ((wiD >= 1200) || wiH >= 800)) || (op.pwa.s && cursorTempActive))) { // ONLY IN DESKTOP PARAMs
        if (!tch.e || (touchActive && !tch.s)) { // IF NO TOUCH
            const mouseY = e.clientY;
            const mouseX = e.clientX;

            if (!cursorBased && screenInteract) {
                cursorSmall.classList.remove("d_n");
                cursorBig.classList.remove("d_n"); // remove cursor from view
            }

            // if (!touchActive) { // if NO TOUCH BEFORE CURSOR
            cursorSmall.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            if (!hoverActive) {
                cursorBig.style.transform = `translate3d(calc(${mouseX}px - 0.2rem), calc(${mouseY}px - 0.2rem), 0)`;
            } 

            // } else {
                /*
                if (!op.pwa.s) {
                    cursorSmall.classList.add("d_n");
                    cursorBig.classList.add("d_n"); // remove cursor from view
                }

                if (!pg.msg.c && !pg.msg.k && !pg.cond.a && !hm.s && !pg.msg.fo && op.c.e) { // show message to prevent mousemove/cursor
                    if (pg.msg.net_p.classList.contains("predicate") || pg.msg.net_p.classList.contains("balanced")) {
                        pg.msg.net_p.classList.remove("predicate"); 
                        pg.msg.net_p.classList.remove("balanced");
                    }
                    pg.msg.net_p.classList.add("negate"); // set color
                    if (pg.msg.net_i.classList.contains("wifi_off_w_img") || pg.msg.net_i.classList.contains("cookies_w_img") || pg.msg.net_i.classList.contains("wifi_w_img")) {
                        pg.msg.net_i.classList.remove("wifi_off_w_img"); 
                        pg.msg.net_i.classList.remove("cookies_w_img");
                        pg.msg.net_i.classList.remove("wifi_w_img");
                    }
                    pg.msg.net_i.classList.add("info_w_img"); // set content
                    pg.msg.net_p.classList.add("md");
                    pg.msg.net_t.innerHTML = "cursor disabled";
                    pg.msg.net_e.innerHTML = "touch detected"; // add text
                    pg.msg.net_e.classList.remove("d_n");
                    pg.msg.ce = true;
                    pg.msg.cep = true;
        
                    msg_toggle(pg.msg.net, null, true, false, false); // show message
                }
            }*/

            if ((cursorSmall.classList.contains("d_n") && cursorBig.classList.contains("d_n") && !touchActive) || (!cursorBased && screenInteract)) {
                cursorSmall.classList.remove("d_n");
                cursorBig.classList.remove("d_n");
                cursorActive = true;
            } else if (cursorSmall.classList.contains("z_O") && cursorActive) {
                cursorSmall.classList.remove("z_O");
            } else if (cursorBig.classList.contains("z_O") && rL.i) {
                cursorBig.classList.remove("z_O");
            }

            if (!cursorBased) {
                cursorBased = true;
            }

        } else if (tch.e && !touchActive) { // IF TOUCH DETECTED
            
            cursorSmall.classList.add("d_n");
            cursorBig.classList.add("d_n"); // remove cursor from view

            // if (!op.pwa.s) {
                touchActive = true;
            // }

            if (cursorBased) {
                cursorBased = false;
            }
        }
    }

    if (!screenInteract) {
        screenInteract = true;
    }
}

function hoverInit(e) { // desktop hover effect
    const mouseY = e.clientY;
    const mouseX = e.clientX;

    cursorBig.classList.add("extra");
    cursorBig.style.transform = `translate3d(calc(${mouseX}px - 0.7rem), calc(${mouseY}px - 0.7rem), 0)`;

    hoverActive = true;

    if (e.currentTarget.getAttribute("data-pwanavbutton") === "true" && !tch.s) {
        e_Fd(e.currentTarget.children[0].children[0], false);
        if (!op.darkMode) {
            e.currentTarget.children[0].children[0].style.backgroundColor = "#F4F4F4";
        } else {
            e.currentTarget.children[0].children[0].style.backgroundColor = "#303030";
        }
    }
}

function hoverEnd(e) {
    if (e) {
        const mouseY = e.clientY;
        const mouseX = e.clientX;
    }

    cursorBig.classList.remove("extra");

    hoverActive = false;

    if (e) {
        if (e.currentTarget.getAttribute("data-pwanavbutton") === "true" && !tch.s) {
            if (!e.currentTarget.classList.contains("buttonActive")) {
                e_Fd(e.currentTarget.children[0].children[0], true);
            }
            e.currentTarget.children[0].children[0].style.backgroundColor = "";
        }
    }
}

function hoverMiddle(e) {
    const mouseY = e.clientY;
    const mouseX = e.clientX; //

    if (e.currentTarget.getAttribute("onclick") === 'toggleColorMode(event)' || (e.currentTarget.classList.contains("toggleBackg") && !e.currentTarget.classList.contains("hide"))) {

        if ((e.currentTarget.classList.contains("toggleBackg") && !e.currentTarget.classList.contains("hide") && e.currentTarget.classList.contains("hoverB") && !e.currentTarget.classList.contains("quickToggle"))) {
            cursorBig.classList.remove("extra");
            cursorBig.style.transform = `translate3d(calc(${mouseX}px - 0.2rem), calc(${mouseY}px - 0.2rem), 0)`;
        } else {
            cursorBig.style.transform = `translate3d(calc(${mouseX}px - 0.7rem), calc(${mouseY}px - 0.7rem), 0)`;
        }

        hoverActive = false; //
        
    } else /*if (!e.currentTarget.classList.contains("toggleBackg") || (e.currentTarget.classList.contains("toggleBackg") && !e.currentTarget.classList.contains("hide")))*/ {

        cursorBig.classList.remove("extra");

        cursorBig.style.transform = `translate3d(calc(${mouseX}px - 0.2rem), calc(${mouseY}px - 0.2rem), 0)`;

        hoverActive = false;
    }
}

window.addEventListener('mousemove', positionElement);

for (i = 0; i <= hoverBtns.length - 1; i++) {
    hoverBtns[i].addEventListener('mousemove', hoverInit);
}

for (i = 0; i <= hoverBtns.length - 1; i++) {
    hoverBtns[i].addEventListener('mouseleave', hoverEnd);
}

for (i = 0; i <= hoverBtns.length - 1; i++) {
    hoverBtns[i].addEventListener('click', hoverMiddle);
}

////////////////////////////////////////////

window.addEventListener("scroll", function() {
    if (!pos.yA) {
        pos.yA = pos.y; // add a secondary y-pos for comparison during scroll (distance)
    }
    op.p.e = true;
});

window.addEventListener("pointerdown", function(e) { // tap/click down
    op.p.e = false;
    switch (e.pointerType) {
    case "pen": // stylus/pen/pencil

        cursorSmall.classList.add("d_n");
        cursorBig.classList.add("d_n"); // remove cursor from view

        // if (!op.pwa.s) {
            touchActive = true;
        // }

        if (cursorBased) {
            cursorBased = false;
        }

        if (!screenInteract) {
            screenInteract = true;
        }

        /*
        if (!pg.msg.c && !pg.msg.k && !pg.cond.a && !hm.s && !pg.msg.fo && op.c.e) { // show message to prevent pen
            if (pg.msg.net_p.classList.contains("predicate") || pg.msg.net_p.classList.contains("balanced")) {
                pg.msg.net_p.classList.remove("predicate"); 
                pg.msg.net_p.classList.remove("balanced");
            }
            pg.msg.net_p.classList.add("negate"); // set color
            if (pg.msg.net_i.classList.contains("wifi_off_w_img") || pg.msg.net_i.classList.contains("cookies_w_img") || pg.msg.net_i.classList.contains("wifi_w_img")) {
                pg.msg.net_i.classList.remove("wifi_off_w_img"); 
                pg.msg.net_i.classList.remove("cookies_w_img");
                pg.msg.net_i.classList.remove("wifi_w_img");
            }
            pg.msg.net_i.classList.add("info_w_img"); // set content
            pg.msg.net_p.classList.add("md");
            pg.msg.net_t.innerHTML = "event disabled";
            pg.msg.net_e.innerHTML = "pen detected"; // add text
            pg.msg.net_e.classList.remove("d_n");
            pg.msg.ce = true;
            pg.msg.cep = true;

            op.p.s = true;

            msg_toggle(pg.msg.net, null, true, true, true); // show a permanent message

            // msg_toggle(pg.msg.net, null, true, false, false); // show message
            // e.preventDefault();
        }*/
    break;
    case "mouse":
    case "touch": // revoke above message if shown
        if (op.p.s) {
            msg_toggle(pg.msg.net, null, false, true, true); // hide/revoke //
            op.p.s = false;
        }
    break;
    /*
    default:
        console.log(`pointerType ${e.pointerType} is not supported`);*/
    }
});

window.addEventListener("pointerup", function(e) { // release/click up
    op.p.e = true;
});

window.addEventListener("pointermove", function(e) { // release/click up
    op.p.e = true;
});


// op.L = setInterval(pL, op.Ls); // check site paramters
// pos.L = setInterval(sL, op.Ls); // check live scroll pos.
// pos.Lc = setInterval(c_Sr, (op.Ls * op.e)); // check scroll parameters (at half intervals)