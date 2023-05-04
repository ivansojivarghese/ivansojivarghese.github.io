
// misc.

var wH = window.innerHeight, // height
    cH = document.documentElement.clientHeight, // [for mobile/tablet] height, exclusive of URL bar
    //elementHeight = document.getElementById("control-height"),
    //barHeight = getBd(elementHeight, "height") - wH,
    //barHeightTemp = barHeight, // temp. hold
    wD = window.innerWidth, // width 
    Rd = [], // load-ready - boolean statuses for loading resource elements
    timer = {}; // keep track of timer instances
    dev = {
        mode : false,  // toggle between develop(er/ing) mode: FOR DEVELOPER PURPOSE ONLY! - ACTIVATE WHEN NEEDED (or OFFLINE)
        mtne : false, // maintenance check
        url : "https://ivansojivarghese.github.io/", // live URL that [currently] hosts the site: FOR TESTING PURPOSE - CHANGE WHEN NEEDED
        info : { // personal information - CHANGE WHEN NEEDED
            work : "web dev", // work label
            workType : "freelance", // 'full-time', 'part-time', 'casual' or 'freelance'
            college : "ntu", // name of institution
            course : "computer science", // course name
            location : "singapore", // geographic location/region/city/country/state
            coords : "1.349°N 103.685°E", // geographic coords - last 2 decimals omitted for privacy
            distance : 97,
            hoursNo : 183,
            cappuccinosNo : 245
        },
        version : "2.0", // site version
        version_up : "2.1", // version upgrade (if applicable, during maintenance)
    },
    pos = { // scroll pos. (window)
        y : 0, // y-pos
        yA : 0, // y-pos (secondary - comparison)
        a : [0, 0, 0], // comparison array (between consecutive 'n' y-pos values)
        d : [], // scroll speed array (between consecutive changing y-pos values) 
        v : [], // rec. scroll speed of user (instantaneously - updated for every scroll)
        s : 0, // scroll speed
        m : 0, // no. of comparison matches (count)
        n : 0, // no. of comparison increments (count)
        c : false, // scrolling change/activity status
        r : true, /// scrolling direction - true if down
        L : null, // loop variables
        Lc : null
    },
    pg = { // pages
        e : false,
        t : "", // reference window category
        w : "", // current [open] window
        sc : { // sections
            m : document.getElementById("main_sc") // main
        },
        msg : { // messages
            c : false, // check (if feature is active)
            el : document.getElementById("msg_sc"), // el
            t : document.getElementById("msg_tint"), // tint
            ckA : document.getElementById("ckA_msg"), // cookie-acceptance
            /*
            ckD : document.getElementById("ckD_msg"), // cookie-deny
            ckDp1 : document.getElementById("ckD_msg-p1"), // para 1
            ckDp2 : document.getElementById("ckD_msg-p2"), // para 2
            ckDp3 : document.getElementById("ckD_msg-p3"), // para 3
            ckDs : document.getElementById("ckD_msg_timer"), // cookie-deny timer span
            */
            net : document.getElementById("net_msg"), // network
            net_i : document.getElementById("net_msg-i"), // network - icon
            net_t : document.getElementById("net_msg-t") // network - text
        },
        cond : { // conditions
            el : document.getElementById("cond_sc"), // main
            tnc : document.getElementById("tnc"), // tnc [https://www.nibusinessinfo.co.uk/content/sample-website-terms-and-conditions-use]
            dcr : document.getElementById("dcr"), // disclaimer [https://www.nibusinessinfo.co.uk/content/sample-website-disclaimer]
            cpy : document.getElementById("cpy"), // copyright [https://www.nibusinessinfo.co.uk/content/sample-website-copyright-statement]
            prv : document.getElementById("prv") // privacy policy [https://cdn.websitepolicies.com/wp-content/uploads/2022/04/privacy-policy-template.pdf]
        }
    };    

/////////////////////////////////////////////////////

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
    op.Ld.dom = renderTime();
}); 
window.addEventListener("load", function() { // 2 - full load
    op.Ld.a = renderTime();
}); 

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
    console.log("LCP:", lastEntry.startTime);
    console.log(lastEntry);
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

if (getCookie("maxHeight")) {
    var aH = getCookie("maxHeight"); // get height from cookie
} else {
    aH = cH;
}

op = { 
    c : { // cookies
        u : false, // [user] cookies-enabled-acceptance
        // uM : 5, // "" deny message limit (sec.)
        // uT : "cD", // "" timer tracker
        // uR : false, // "" redirect check
        e : null, // enabled check
        a : null, // user access (inital) check [browser-dependant]
        t : 1, // default time limit (days)
        x : false // code execution
    },
    Ld : {
        dom : 0, // 'domcontentloaded'
        a : 0, // 'load'
        t : 10000 // threshold for timeout
    },
    nav : { // navigation
        d : document.referrer, // check for previous URI
        r : (document.referrer === window.location.href) ? true : false, // page reload check
        fb : false, // page forward/backward nav. check
        n : false, // page nav. check (direct)
        b : true // URL bar in view check
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
        r : false, // count incrementation check
        d : false, // slow speed boolean var hold
        v : false, // normal (high) speed ""
        w : true, // slow speed check - less than threshold?
        L : null // loop
    },
    r : null, // resource link origin
    n : null, // online status (internet connectivity)
    nc : false, // online status change
    s : false, // check boolean - 'force' disable scroll
    d : new Date(), // instance of Date
    p : { // pointer (press/tap/click)
        e : true, // execution boolean
        L : false, // check boolean - for long (extended) press/tap/click
        tA : 0, // time - initial (at pointerdown)
        tB : 0 // time - final (at pointerup)
    },
    aP : 5, // approximator value
    t : 200, // transition duration - default (in ms.)
    te : 500, // transition duration (extended)
    // Ls : 1000/60, // loop (interval) speed - sec./rev.
    e : 2, // use loop speed (modifier) base value OR/AND site operations variable value
    f : window.getComputedStyle(document.body).getPropertyValue('font-size'), // get root font-size
    b : { // browser check (major platforms)
        c : false, // chrome
        f : false, // firefox
        s : false, // safari
        o : false, // opera
        e : false // edge
    },
    L : null // loop variable
};

const checkOnlineStatus = async () => { // check for internet connectivity
    try {
        const url = dev.mode ? dev.url : op.r;
        const online = await fetch(url + "msc/onlineResourceLocator.png", { // send a 'ping' signal to resource locator
            cache : "no-store"
        });
        return online.status >= 200 && online.status < 300; // determine network status from return value
    } catch (err) {
        return false;
    }
}

const estimateNetworkSpeed = async() => { // estimate network speed
    try {
        var s;
        op.ne.a = op.d.getTime(); // start time of fetch
        const url = dev.mode ? dev.url : op.r;
        const online = await fetch(url + "msc/networkSpeedEstimator.jpg", { // send a 'ping' signal to resource locator
            cache : "no-store"
        });
        op.ne.t = op.d.getTime(); // end time of fetch
        op.ne.s = (op.ne.f / ((op.ne.t - op.ne.a) / 1000)) / 1000000; // approx. network speed (in MBps)
        if (op.ne.s !== Infinity && op.ne.s !== 0) { // get valid values only
            s = op.ne.s < op.ne.h ? true : false; // check for slow network (if less than 5 MBps speed)
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
}

const networkConditions = async() => {
    const status = await checkOnlineStatus(); // check internet connection
    const speed = await estimateNetworkSpeed(); // check internet slow speed
    op.n = status;
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
}

op.r = getSiteRes(); // get site resource origin
networkConditions(); // perform network check on startup

op.ne.L = setInterval(async () => {
    networkConditions(); // continuously check on network
}, op.ne.bD);

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
}

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
                if (res === 0 || d) {
                    break;
                } else if (t_ar[t_ar.length - 1] !== base) { // no trend
                    res = 0; // constant trend (default)
                } else if (c < op.ne.bt) {
                    c++; // increment count
                } else {
                    full = base; // trend confirmed
                    break;
                }
            }
        }
    } else {
        res = 0; // return as constant
    }
    
    return (res !== 0) ? full: null;
    // return (res !== 0 /*|| something*/) ? res > 0 ? true : false : null;
}

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
    this.location.reload();
    window.location.assign(window.location.href); // FIREFOX support
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
}

function cookiesAccept() { // acknowledge user acceptance and allow site access
    /*
    e_Sdv(pg.msg.ckA, false);
    pg.msg.t.classList.add("md"); // remove tint*/
    // pg.msg.el.classList.add("z_O");

    msg_toggle(pg.msg.ckA, null, false, true, null);

    setTimeout(function() {
        setCookie("cookiesAccepted", "true", op.c.t); // cookie: cookies accepted
        op.c.u = true;
        load_eN(); // continue load process if any (page specific)
    }, op.te);
}
/*
function cookiesDeny() { // deny site access (and begin to close tab)
    msg_toggle(pg.msg.ckD, null, true, true, null);
    countdownTimerSec(op.c.uM - 1, op.c.uT, pg.msg.ckDs, cookiesDenyRedirect); // countdown from 5 sec. for redirecting away from page
}

function cookiesDenyRedirect() {
    op.c.uR = true; // redirected
    pg.msg.ckDp1.classList.add("p_T", "ex"); // show/hide statements
    pg.msg.ckDp1.innerHTML = "site undirected";
    pg.msg.ckDp2.classList.add("d_n");
    pg.msg.ckDp3.classList.remove("d_n");
    if (document.referrer) { // if previous URI exists (from link path)
        window.history.back(); // redirect to previous page in history
    }
}

function cookiesDenyCancel() { // cancel close tab, back to original message
    if (op.c.uR) { // if redirected
        op.c.uR = false;
        setTimeout(function() {
            pg.msg.ckDp1.classList.remove("p_T", "ex");
            pg.msg.ckDp1.innerHTML = "exiting from site"; // reset back
            pg.msg.ckDp2.classList.remove("d_n");
            pg.msg.ckDp3.classList.add("d_n");
        }, op.t);
    }
    msg_toggle(pg.msg.ckD, null, false, true, null);
    clearInterval(timer[op.c.uT].L);
    setTimeout(function() {
        pg.msg.ckDs.innerHTML = op.c.uM; // reset time
    }, op.t);
}*/

//////////////////////////////////////////

function sL() { // scroll pos. loop
    pos.y = window.scrollY; // update
}

function pL() { // site parameters loop
    op.d = new Date(); // update Date object
    if (op.p.e) {
        op.p.tA = op.d.getTime();
    }

    // console.log(renderTime() + ", " + op.ne.s);

    if (op.s) { // 'force' enable/disable scroll when required
        document.documentElement.style.overflowY = "hidden"; // html
        document.body.style.overflowY = "hidden"; // body
        if (op.b.s) { // Safari compatibility
            document.documentElement.style.position = "fixed"; 
            document.body.style.position = "fixed";
        }
    } else {
        document.documentElement.style.overflowY = "";
        document.body.style.overflowY = "";
        if (op.b.s) {
            document.documentElement.style.position = "";
            document.body.style.position = "";
        }
    }

    if ((!hm.e && op.c.u) || pg.e) {
        var arg = pg.e ? pg[pg.t].el : null;
        if ((op.d.getTime() - op.p.tA) > op.t) { // detect long press/tap/click based on 2 reference times (check if greater than threshold)
            op.p.L = true;
            scr_t(false, arg);
        } else {
            op.p.L = false;
            scr_t(true, arg);
        }
    }
    /*
    if (op.c.uR && op.nav.fb) { // cookie-message redirect[ed] and forward/backward navigation
        pg.msg.ckDp1.innerHTML = "site redirected";
    }*/

    /*
    if (!op.nav.b) { // check if URL bar is NOT in view
        pg.msg.net.style.transform = "translateY(" + barHeightTemp + "px)";
    }*/

    // elementHeight = document.getElementById("control-height").innerHeight,
    // barHeight = getBd(elementHeight, "height") - wH;

     /*   // check if location bar is visible
    let locationBarVis = window.locationbar.visible ? true : false;

    // check if menu bar is visible
    let menuBarVis = window.menubar.visible ? true : false;

    // check if toolbar is visible
    let toolbarVis = window.toolbar.visible ? true : false;

    pg.msg.net_t.innerHTML = locationBarVis + " " + menuBarVis + " " + toolbarVis;*/
    // pg.msg.net_t.innerHTML = op.nav.b + " " + barHeight;

    // pg.msg.net_t.innerHTML = window.innerHeight + " " + document.documentElement.clientHeight + " " + barHeight;

    if ((op.n === false && !op.nc) || (op.n && op.nc)) { // if change in network connection (internet)
        op.nc = true; // network changed
        
        // pg.msg.net_i.classList.add("wifi_off_w_img"); // set content
        // pg.msg.net_t.innerHTML = "offline";

        if (!pg.msg.c) {
            msg_toggle(pg.msg.net, null, true, true, true);
        }

        // check for other messages, then open up
    }

    // console.log(op.ne.s + ", " + op.ne.w + ", " + op.nc);
}

function c_Sr() { // check for scrolling activity (in live)
    var d = (pos.yA !== 0) ? Math.abs(pos.y - pos.yA) : 0; // obtain distance of scroll
    if (d > pos.st) { // check if scroll distance is valid (of a true scroll - prevents unwanted scrolling)
        var _L = pos.a.length - 1,
            tB; 

        if (pos.y !== pos.a[_L]) {
            pos.c = true; // set scrolling to true
            pos.r = (pos.y > pos.a[_L]) ? true : false; // get direction of scroll
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
        /*
        if (op.p.L) {

        }

        if (op.b.f && document.documentElement.classList.contains("scB")) { // optimisation for Firefox users
            document.documentElement.classList.remove("scB"); // smooth scrolling is always disabled
        }*/
    } 
}

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
    if ((!v1 || !v2) && e) {
        return true;
    } else {
        if (e === null) {
            e = op.aP;
        }
        return Math.abs(v1 - v2) < e;
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
    var elB = el.getBoundingClientRect(),
        elBp = elB[p]; // accessing specific property in bound(ed) object
    return elBp;
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

function msg_toggle(el, el_s, s, t, t_m) { // toggle for messages
    if (s) { // show
        pg.msg.c = true;
        pg.msg.el.classList.remove("d_n"); // show page
        el.classList.remove("d_n");
        setTimeout(function() {
            e_Sdv(el, s); // show message
            if (t && t_m) {
                pg.msg.t.classList.add("a"); // add low tint
                pg.msg.t.classList.remove("md"); // add tint (if applicable)
            } else if (t) {
                pg.msg.t.classList.remove("md"); 
            }
            /*
            if (el === pg.msg.ckA) {
                pg.msg.ckD.style.height = getBd(el, "height") + "px"; // set height of cookie-deny message
            }*/
        }, 10); // after short delay
    } else { // hide
        e_Sdv(el, s); // hide message
        //if (el !== pg.msg.ckD) {
            pg.msg.c = false;
            if (t && t_m) {
                pg.msg.t.classList.remove("a"); // remove low tint
                pg.msg.t.classList.add("md"); // remove tint
            } else if (t) {
                pg.msg.t.classList.add("md"); 
            }
            setTimeout(function() {
                el.classList.add("d_n");
                pg.msg.el.classList.add("d_n"); // hide page
            }, op.t);
        /*
        } else {
            setTimeout(function() {
                el.classList.add("d_n");
            }, op.t);
        }*/
    }
    
    if (el_s) { // internal element reveal (if applicable)

    }

    // e_Sdv(el, s); // show cookie-acceptance message
}

function popU_toggle(el, el_s, s, m) { // pop-up toggle for page window
    if (s) { // close
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
        }

        hm.e = false;
        pg.e = false;
        /*
        if (op.b.f) {
            pg.cond.el.style.height = "";
        }*/
        
        // }, op.t);
    } else { // open
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

function c_css(n, r, e, t) { // create new CSS class - dynamically using JS
    var style = document.createElement("STYLE"); // create 'style' tag
    style.type = "text/css"; 
    style.innerHTML = n + " { " + r + " }"; // combine name + rule(s)
    document.head.appendChild(style); // append to head
    if (e) { // if to-expiry is active
        setTimeout(function() {
            style.remove(); // remove style element after stipulated time
        }, t);
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

function scr_t(s, pg) { // scroll toggle
    var h = document.documentElement,
        b = document.body;
    if (s) { // enable
        if (pg) { // if page
            /*
            if (op.b.s) { // safari compatibility
                pg.classList.remove("p-f");
            }*/
            c_rep(pg, "ovy-h", "ovy-s"); // enable scrolling
        } else { // or window
            /*
            if (op.b.s) { // safari compatibility
                h.classList.remove("p-f");
                b.classList.remove("p-f");
            }*/
            c_rep(h, "ovy-h", "ovy-s"); // enable scrolling at html
            c_rep(b, "ovy-h", "ovy-s"); // body
        }
    } else { // disable
        if (pg) {
            /*
            if (op.b.s) { // safari compatibility
                pg.classList.add("p-f");
            }*/
            c_rep(pg, "ovy-s", "ovy-h"); // disable scrolling
        } else {
            /*
            if (op.b.s) { // safari compatibility
                h.classList.add("p-f");
                b.classList.add("p-f");
            }*/
            c_rep(h, "ovy-s", "ovy-h"); // disable scrolling at html
            c_rep(b, "ovy-s", "ovy-h"); // body
        }
    }
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

window.addEventListener("resize", function() {
    if (wH !== window.innerHeight && wD !== window.innerWidth) { // check for change in width/height values before proceeding
        wH = window.innerHeight; // update on window size variables
        wD = window.innerWidth; 
        cH = document.documentElement.clientHeight;
        pg.sc.m.classList.add("d_n"); // remove page from display (for slow networks)
        setCookie("windowResize", true, op.c.t);
        reL(); // reload page
    }
});

window.addEventListener("orientationchange", function() {
    pg.sc.m.classList.add("d_n"); // remove page from display during orientation change (for slow networks)
});

//////////////////////////////////////////

window.addEventListener("visibilitychange", function() { // stop network check if tab/window in background
    if (document.hidden) {
        clearInterval(op.ne.L);
    } else {
        op.ne.L = setInterval(async () => {
            networkConditions(); // continuously check on network
        }, op.ne.bD);
    }
});

window.addEventListener("focus", function() { // window in focus

    // REMOVE 'HIDING' LAYER

    op.ne.L = setInterval(async () => {
        networkConditions(); // continuously check on network
    }, op.ne.bD);
});

window.addEventListener("blur", function() { // window out of focus

    // ADD 'HIDING' LAYER - PREVENT TO BE SEEN IN TAB PREVIEW

    clearInterval(op.ne.L);
});

//////////////////////////////////////////

localStorage.openSite = Date.now();
if (getCookie("duplicatedNum") === "") {
    setCookie("duplicatedNum", 0, null);
}

window.addEventListener("storage", function(e) {

    console.log(e.key);

    if (e.key === "openSite") {
        localStorage.duplicateSite = Date.now();
        op.c.x = true;
    }
    if (e.key === "duplicateSite") {
        var n = Number(getCookie("duplicatedNum"));
        if (!op.c.x) {
            if (!op.nav.r) {
                n++;
            }
            console.log("1: add");
            setCookie("duplicatedNum", n, null);
            op.c.x = true;
        }        
    } 
});

window.addEventListener("beforeunload", function() {

    // localStorage; - duplicate tab detection

    /*
    if (op.c.uR) { // if unloading when cookie-deny redirect message is active
        op.nav.fb = true; // automatically set forward/back nav. to true
    }*/
});

window.addEventListener("load", function() {
    rL.y = true; // page has been rendered
});

//////////////////////////////////////////

window.addEventListener("scroll", function() {
    if (!pos.yA) {
        pos.yA = pos.y; // add a secondary y-pos for comparison during scroll (distance)
    }
    op.p.e = true;
});

window.addEventListener("pointerdown", function() { // tap/click down
    op.p.e = false;
});

window.addEventListener("pointerup", function() { // release/click up
    op.p.e = true;
});

window.addEventListener("pointermove", function() { // release/click up
    op.p.e = true;
});


op.L = setInterval(pL, op.Ls); // check site paramters
pos.L = setInterval(sL, op.Ls); // check live scroll pos.
pos.Lc = setInterval(c_Sr, (op.Ls * op.e)); // check scroll parameters (at half intervals)