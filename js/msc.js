
// misc.

var wH = window.innerHeight, // height
    cH = document.documentElement.clientHeight, // [for mobile/tablet] height, exclusive of URL bar
    wD = window.innerWidth, // width 
    Rd = [], // load-ready - boolean statuses for loading resource elements
    dev = {
        mode : false,  // toggle between develop(er/ing) mode: FOR DEVELOPER PURPOSE ONLY! - ACTIVATE WHEN NEEDED (or OFFLINE)
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
        version : "2.0" // site version
    },
    op = { // site 'options'
        c : { // cookies
            u : false, // [user] cookies-enabled-acceptance
            e : null, // enabled check
            a : null, // user access (inital) check [browser-dependant]
            aL : 1 // user access (initial) time limit (days)
        },
        r : null, // resource link origin
        n : null, // online status (internet connectivity)
        s : false, // check boolean - 'force' disable scroll
        sD : false, // site duplicate check (among similar browser tabs/windows)
        d : new Date(), // instance of Date
        p : { // pointer (press/tap/click)
            e : true, // execution boolean
            L : false, // check boolean - for long (extended) press/tap/click
            tA : 0, // time - initial (at pointerdown)
            tB : 0 // time - final (at pointerup)
        },
        t : 200, // transition duration - default (in ms.)
        te : 500, // transition duration (extended)
        Ls : 1000/60, // loop (interval) speed - sec./rev.
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
        cks : { // cookies
            el : document.getElementById("ckA_sc"), // el
        },
        cond : { // conditions
            el : document.getElementById("cond_sc"), // main
            tnc : document.getElementById("tnc"), // tnc [https://www.nibusinessinfo.co.uk/content/sample-website-terms-and-conditions-use]
            dcr : document.getElementById("dcr"), // disclaimer [https://www.nibusinessinfo.co.uk/content/sample-website-disclaimer]
            cpy : document.getElementById("cpy"), // copyright [https://www.nibusinessinfo.co.uk/content/sample-website-copyright-statement]
            prv : document.getElementById("prv") // privacy policy [https://cdn.websitepolicies.com/wp-content/uploads/2022/04/privacy-policy-template.pdf]
        }
    };

const checkOnlineStatus = async () => { // check for internet connectivity
    try {
        const url = dev.mode ? dev.url : op.r;
        const online = await fetch(url + "msc/onlineResourceLocator.png", {
            cache : "no-store"
        });
        return online.status >= 200 && online.status < 300;
    } catch (err) {
        return false;
    }
}

setInterval(async () => {
    const result = await checkOnlineStatus();
    op.n = result;
}, 3000);

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
    document.cookie = n + "=" + v + ";" + expires + ";path=/"; // attach cookie
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
    pg.cks.el.classList.add("z_O");
    setTimeout(function() {
        setCookie("cookiesAccepted", "true", 1); // cookie: cookies accepted
        pg.cks.el.classList.add("d_n"); // show page
        op.c.u = true;
    }, op.t);
}

//////////////////////////////////////////

function sL() { // scroll pos. loop
    pos.y = window.scrollY; // update
}

function pL() { // site parameters loop
    op.d = new Date(); // update Date object
    if (op.p.e) {
        op.p.tA = op.d.getTime();
    }

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

    // console.log(op.p.L);
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
/*
function e_Fd(el, s) { // effect - fading (provided 'trs' class is added to el)
    if (s) { // check if class is present before removing
        el.classList.add("z_O"); // fade out
    } else {
        el.classList.remove("z_O"); // fade in
    }
}*/

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

function c_rep(el, d, n) { // replace CSS classes in elements
    el.classList.replace(d, n);
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

const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--doc-height", `${window.innerHeight}px`); // update height values of body/html on clientHeight resize
}
window.addEventListener("resize", documentHeight);
documentHeight();

window.addEventListener("resize", function() {
    if (wH !== window.innerHeight && wD !== window.innerWidth) { // check for change in width/height values before proceeding
        wH = window.innerHeight; // update on window size variables
        wD = window.innerWidth; 
        cH = document.documentElement.clientHeight;
        reL(); // reload page
    }
});

localStorage.opensite = Date.now();
window.addEventListener("storage", function(e) {
    if (op.sD) {
        console.log("site duplicated");
    } else {
        if (e.key == "opensite") {
            localStorage.duplicatesite = Date.now();
        }
        if (e.key == "duplicatesite") {
            op.sD = true;
        }
    }
});

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