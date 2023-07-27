
// locally run JS fetching (respective to each page)

var fchL = {
        1 : { // #intro_sc profile image
            el : document.getElementById("profile_image"),
            u : 'ext/jpg/ivan_profile.jpg'
        },
        2 : { // logo_hybrid
            el : document.getElementsByClassName("logo-hybrid"),
            u : 'logo/logo_hybrid.png'
        },
        3 : { // favicon inverse
            el : document.getElementsByClassName("logo-inverse"),
            u : 'logo/favicon_inverse_512.png'
        }
    },
    fch = {
        L : null
    },
    qInfo = [ // quick information
        document.getElementById("qIn1"), // work
        document.getElementById("qIn2"), // workType
        document.getElementById("qIn3"), // college
        document.getElementById("qIn4"), // course
        document.getElementById("qIn5"), // location
        document.getElementById("qIn6") // coords
    ],
    sInfo = [
        document.getElementById("sIn1"), // distance
        document.getElementById("sIn2"), // hours
        document.getElementById("sIn3"), // cappuccinos
    ],
    el = {
        x : false, // code execution
        x2 : false, 
        x3 : false, 
        x4 : false, 
        x5 : false,
        x6 : false,
        x7 : false,
        x8 : false,
        x9 : false,
        x10 : false,
        x11 : false,
        x12 : false,
        c4 : false,
        a : true, // scroll arrow anchor status
        ac : false, // scroll arrow click check
        g : false, // gyro sensor check
        n : document.querySelectorAll(".navbarlinks"),
        isc : document.getElementById("intro_sc"),
        i : document.getElementById("profile_image"),
        pb : document.getElementById("profile_banner"),
        pgph : document.getElementById("pr_gt_ph"),
        Lt : document.getElementById("localTime"),
        Ltd : document.getElementById("localTimeDet"),
        lk3 : document.getElementById("link_3"),
        lk3a : document.getElementById("link_3a"),
        lk3b : document.getElementById("link_3b"),
        lk3c : document.getElementById("link_3c"),
        lk3cb : document.getElementById("link_3cbtn"),
        lk4 : document.getElementById("link_4"),
        chev : document.getElementById("chev_d"),
        bgC : document.querySelectorAll(".bg-circle"),
        bgC4 : document.getElementById("bg-cir4"),
        ldw : document.getElementById("lead_wrap"),
        ldP : document.getElementById("lead_point"),
        ldP1 : document.getElementById("lead_point_1"),
        ldP4 : document.getElementById("lead_point_4"),
        q1_t : document.getElementById("qIn1_typer"),
        cIa : document.getElementsByClassName("c_Info_arrows"),
        qIc : document.getElementsByClassName("q_Info_icons"),
        mdh : document.getElementById("mid_sc_h")
    },
    bd = { // bounds
        b0 : null,
        b1 : null,
        b2 : null,
        b3 : null,
        b4 : null
    };

let gyroscope = null;
var gyroscopeX = 0,
    gyroscopeY = 0;

var apiTimeout = timeout * 0.25, // 25% timeout for APIs to load
    apiInit = 0, // init time for API load
    apiSuccess = false, // check
    ipAPIres = {},
    weatherAPIres = {},
    weather = {
        elw : document.getElementById("localWeather"),
        elc : document.getElementById("localCity"),
        c : document.getElementById("localCityName"),
        r : document.getElementById("localWeatherReading"),
        u : document.getElementById("localWeatherUnit"),
        i : document.getElementById("localWeatherIcon")
    };



function live_update() {
    if (rL.i && ((vw.pH && wiD >= 700) || (vw.dk))) {
        timeNow(el.Ltd);
    }
}

function displayErrorCheck() {
    var b = Math.round(getBd(el.isc, "bottom"));
    if (!vw.pH && !vw.tB && tDevice && pos.aT && (b !== aH)) { // if mobile
        return true;
    }
    return false;
}

function loadUp() {
    var a, b;
    for (var f in fchL) { // loop through required fetch objects above
        a = fchL[f].el;
        b = fchL[f].u;
        resLoad(a, b); // start fetching with target element and relative path
    }
}

function load_css_e() { // load CSS styles (page specific)
    var mg = "(" + aH + "px - 27.5rem) / 5"; // margin

    if (!vw.pH && !vw.tB) { // mobile
        c_css(".bg-circles", "height: calc(" + aH + "px + 8rem);", false, null);
        c_css(".bg-circles .circle-3", "top: calc(7rem + (" + mg + ") + 12rem);", false, null); // 7rem + profile_image top margin + inward offset of 2rem (rel. to p. image height)
        c_css("#bg-cir5", "top: calc(" + aH + "px + 6rem)", false, null);

        c_css("#profile_image, #intro_sc .content", "margin-top: calc(" + mg + ")", false, null); // margins are relative to the height
        c_css("#link_3", "height: calc(" + aH + "px - (30.32rem + 2 * (" + mg + ")));", false, null);

        c_css("#c_Info-m", "margin-top: calc(" + (aH * 0.5) + "px)", false, null);

        c_css("#prefooter_sc", "padding-top: " + aH + "px", false, null);
        c_css("#scroll_banner, #design_banner", "margin-top: " + (aH * 0.5) + "px", false, null);

        c_css("#ham_C", "margin-top: calc((" + aH + "px - 16rem) / 2);", false, null);

    } else if (vw.pH) { // phablet
        var qI_o = ["work_w_img", "school_w_img", "location_w_img"],
            qI_c = ["work_img", "school_img", "location_img"];

        el.i.classList.remove("m_Az");
        el.i.classList.add("d_i");
        el.i.classList.add("m_L-10");

        el.pb.classList.add("m_T");

        im.L.classList.remove("bC_d");
        im.L.classList.remove("c_w");
        el.ldP1.innerHTML = "i create";

        el.q1_t.classList.remove("bC_L");
        el.q1_t.classList.add("bC_d");

        if (wiD >= 700) {
            timeNow(el.Ltd);

            el.pgph.innerHTML = "Hello. I'm";
            el.Lt.classList.remove("d_n"); // show time
            el.Lt.classList.add("d_i");

            el.mdh.innerHTML = "hours &";
        }

        for (j = 0; j <= (el.cIa.length - 1); j++) { // change arrows
            el.cIa[j].classList.remove("lead_arrow_forward_w_img");
            el.cIa[j].classList.add("lead_arrow_forward_img");
        }

        for (k = 0; k <= (el.qIc.length - 1); k++) { // change icons
            el.qIc[k].classList.remove(qI_o[k]);
            el.qIc[k].classList.add(qI_c[k]);
        }
    } else if (vw.tB) { // tablet

        el.i.classList.remove("m_Az");
        el.pb.classList.remove("m_L-10");
        el.pb.classList.remove("m_wd");

        pg.sc.d.classList.add("h-f");
        c_rep(el.ldw, "m_L-20", "m_L-10");

        pg.sc.e.classList.add("h-f");
        pg.sc.e.classList.add("bC_d");
        pg.sc.e.classList.add("c_w");

        c_css("#intro_sc", "height: calc(" + aH + "px - 5.5rem)", false, null);
        c_css(".q_Info, .q_Info > div", "margin: 0 !important", false, null);
        c_css("#lead_wrap", "padding-bottom: 0", false, null);

        if (vw.dk) { // desktop
            for (w = 0; w <= el.n.length - 1; w++) { // set up animating navbar elements
                el.n[w].classList.add("up");
                if (w < el.n.length - 1) {
                    el.n[w].classList.add("d_n");
                } else {
                    // remove dark-mode function on button
                }
            }

        }

    }

    if (!vw.pH && !vw.tB) { // mobile
        if (wD >= 290 && aH <= 640 && !vw.mB_L) { // if width min at 290px; height max at 640px; portrait view
            if (!(wD >= 310 && aH <= 550)) { // if width/height NOT within 310px and 550px
                c_css("#profile_image", "width: 17rem; height: 17rem;", false, null); // apply style mod
                c_css("#link_3", "height: calc(" + aH + "px - (29.32rem + 2 * (" + mg + ")));", false, null);
            } else {
                c_css("#link_3", "height: calc(" + aH + "px - (26.32rem + ((480px - 27.5rem) / 3)));", false, null);
            }
        }
    }

    if (!op.b.s) { // if browser platform is NOT Safari

        // ONLY APPLY FOR DESKTOP VIEWPORTS!

        /*
        c_css(".bt:active", "background-color: #E4E4E4;", false, null); // apply button active states
        c_css(".bt.md:active", "background-color: #565656;", false, null);*/
    }
}

////////////////////////////////////////////////////////////////////////////

async function ipAPI(v) {  // 50,000 per month limit, https://ipinfo.io/ 
    await fetch("https://ipinfo.io" + v + "/json?token=38ec70e8a088d5")
        .then((response) => {
            return response.json().then((data) => {
                ipAPIres = data;
                ipAPIres.online = true;
            }).catch((error) => {
                ipAPIres.error = true;
            });
        })
}

async function weatherAPI(lat, lon, unit) { // 1,000,000 per month, 60 per minute limits, https://openweathermap.org/
    await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + unit + "&appid=62dfc011a0d14a0996e185364706fe76")
        .then((response) => {
            return response.json().then((data) => {
                weatherAPIres = data;
                weatherAPIres.online = true;
            }).catch((error) => {
                weatherAPIres.error = true;
            });
        })
}

function tempUnit(c) { // return unit of measure per user country location
    var res = "metric"; // default
    for (var x in f_countries) {
        if (f_countries[x].iso_A2 === c) { // if matches given list
            res = "imperial";
            break;
        }
    }
    return res;
}

/////////////////////////////////////////////////////////////////////////////

function load_js_e() { // load JS (page specific)
    var b = getBd(hm.b, "bottom"), // obtain 'bottom' bound of ham. button
        _Lq = qInfo.length, // number of elements
        i = 0;

        // t = Math.ceil(((b - 1) / 10) * 2), // obtain approx. no. of max iterations (in 1000/30 ms. intervals) - round up for an inclusive value
        // m = (op.Ls * 2) * t; // calculate max time (ms.) for button offset alignment
    
    hm.f = b; // update the hamburger menu object properties
    // m.ft = m;

    for (var d in dev.info) { // loop through to concatenate information to text
        if (i < _Lq) {
            if (i !== 0) {
                qInfo[i].innerHTML = dev.info[d];
            } else { // run typing effect

                ld.x4 = true;
            }
            i++;
        }
    }

    if (vw.dk) { // if desktop
        timeNow(el.Ltd); // show time
        el.Lt.classList.remove("d_n");

        apiInit = op.d.getTime();
        ipAPI(""); // get user IP information API (ENTER A region IP value for testing, "/" + IP Address)

        var dkAPI = function() {
            if (ipAPIres.error) {

                apiSuccess = null;

                ///////
                // SET a loop to continously check for variable within timeout time

            } else if (ipAPIres.online) { // if no errors & online, proceed
                var lat = ipAPIres.loc.slice(0, ipAPIres.loc.indexOf(",")), // get user latitude
                    lon = ipAPIres.loc.slice(ipAPIres.loc.indexOf(",") + 1, ipAPIres.loc.length), // get user longitude
                    unit = tempUnit(ipAPIres.country);

                weatherAPI(lat, lon, unit); // get user location weather information API

                var wtAPI = function() {
                    if (weatherAPIres.error) {

                        apiSuccess = null;
                        /////////////

                    } else if (weatherAPIres.online) {

                        // EDIT INFO TO HTML
                        weather.r.innerHTML = Math.round(weatherAPIres.main.temp); // weather reading
                        weather.u.innerHTML = (tempUnit(ipAPIres.country) === "metric") ? "C" : "F"; // weather unit
                        weather.c.innerHTML = ipAPIres.city; // weather city

                        var weatherIcon = async function() { // weather icon
                            await fetch("https://openweathermap.org/img/wn/" + weatherAPIres.weather["0"].icon + "@2x.png")
                                .then((response) => {
                                    weather.i.style.backgroundImage = "url('https://openweathermap.org/img/wn/" + weatherAPIres.weather["0"].icon + "@2x.png')";
                                    apiSuccess = true;
                                }).catch((error) => {
                                    apiSuccess = null;
                                });
                        }

                        weatherIcon();

                    } else if ((op.d.getTime() - apiInit) < apiTimeout) {
                        setTimeout(wtAPI, op.t); // recheck variable if API load still within timeout range

                    } else {

                        apiSuccess = null;
                        ////////////
                    }
                }

                wtAPI();

            } else if ((op.d.getTime() - apiInit) < apiTimeout) {
                setTimeout(dkAPI, op.t); // recheck variable if API load still within timeout range

            } else {

                apiSuccess = null;
                ///////////
            }
        }

        dkAPI();
    }
}

function js_load() { // check JS load progress (indiv.)
    if (apiSuccess === false) { // check load status of APIs
        return false;
    } else if (apiSuccess === null) { // if API fails to load
        weather.elw.classList.add("d_n"); // don't display
        weather.elc.classList.add("d_n");
    } else if (apiSuccess && weather.c.innerHTML !== "-" && weather.i.style.backgroundImage) { // if API loaded up
        return true;
    }
}

function js_live() { // update js - in live
    var // e = (!vw.pH && !vw.tB) ? el.lk3b : el.lk3c,
        e = el.lk3b,
        eB = (!vw.pH && !vw.tB) ? el.lk3 : el.lk3cb;
    if (!el.ac) { 
        if ((!pg.msg.fo && pos.aT) && el.x) { // if page online AND not scrolled
            e.classList.remove("d_n");
            load_eN(); // reload scroll arrow feature
            el.x = false;
        }
    } else {
        if ((!pos.aT && !el.x3) || pg.msg.fo) { // if scrolled OR offline
            el.x3 = true;
            eB.removeEventListener("click", peek); 
            e_Fd(e, true); // fade out 
            if (!vw.pH && !vw.tB) {
                e_Fd(el.chev, true); 
            } else if (vw.dk) {
                // e_Fd(eB, true); 
                eB.classList.add("left");
            }
            setTimeout(function() {
                e.style.height = "0px"; // set link to 0 height
            }, op.t);
        } else if (pos.aT && el.x3 && !pg.msg.fo) { // back to top AND online
            e_Fd(e, false); // fade in
            load_eN();
            setTimeout(function() {
                el.x3 = false;
            }, op.t);
        } else if (!pos.aT && typeof eB.onclick == "peek") { // if scrolled & peek function not removed (bug fix)
            eB.removeEventListener("click", peek);
        }
    }
    if (!pos.aT && !el.x9) { // hide hamburger button
        el.x9 = true;
        hamButtonLoad(false);
    } else if (pos.aT && el.x9 && !el.x10) { // show
        el.x9 = false;
        el.x10 = true;
        hamButtonLoad(true);
    } else if (pos.aT && !pos.c && el.x10 && el.x2 && el.x9) { // show
        el.x9 = false;
        hamButtonLoad(true); 
    }
}

function load_eN() { // load, after cookie acceptance (page specific)
    if (!vw.tB && !vw.pH) { // mobile
        // scroll arrow
        var h = getBd(el.lk3, "height");
        if (h >= 65) { // min. 65px height required
            el.c4 = true;
            el.bgC4.classList.remove("d_n"); // show circle 4
            if (h >= 85) {
                if (!el.x4) {
                    c_css(".bg-circles .circle-4", "top: calc(" + aH + "px - 4rem);", false, null); 
                    el.x4 = true;
                }
                el.bgC4.style.left = "60%";
                scrollArrowIterate(true, el.lk3b, "1rem", "calc(100% - 2.5rem)", "auto", "1.5rem", el.chev); // start iteration
                el.ac = false;
            } else {
                if (!el.x4) {
                    c_css(".bg-circles .circle-4", "top: calc(" + aH + "px - 3.5rem);", false, null); 
                    el.x4 = true;
                }
                scrollArrowIterate(false, el.lk3b, "1rem", "calc(100% - 2.5rem)", "auto", "1.5rem", el.chev); // start iteration (single)
                hm.k3 = true;
                setTimeout(function() {
                    el.lk3.classList.remove("z-G");
                    el.lk3.addEventListener("click", peek); 
                }, op.te);
                el.ac = true;
            }
            c_rep(el.lk3a, "h-z", "h-fp"); // show 'scroll-down' box 
            e_Fd(el.chev, false); // show chevron
        }
        if (!el.x2) { // show background circles + ham. button strokes at load
            el.x2 = true;
            setTimeout(function() {
                if (pos.aT) {
                    el.x9 = false;
                    hamButtonLoad(true); // ham. button
                }
            }, op.t);
            setTimeout(function() {
                showCircle();
            }, op.te);
        }
    } else if (vw.dk) { // desktop

        var w = 0;
            s = function() {
                if (w <= (el.n.length - 1)) {
                    if (w === (el.n.length - 1)) {
                        // add dark-mode function on button
                    } else {
                        el.n[w].classList.remove("d_n");
                    }
                    setTimeout(function() {
                        el.n[w].classList.remove("up");
                        w++;
                        setTimeout(s, (op.t / 2))
                    }, 10);
                }
            };
        if (!el.x12) { 
            el.lk4.classList.remove("z_wd"); // add width on link_4
            s(); // start navbar animations
            scrollArrowIterate(true, el.lk3c, "-0.5rem", "2.5rem", "auto", "-2rem", null); // scroll indicator
            el.x12 = true;
        } 
        el.lk3cb.classList.remove("left"); // show scroll peek button
        el.lk3cb.addEventListener("click", peek); // add function

        el.ac = true;
    }
}

function scrollArrowIterate(m, e, t, h, ta, b, ch) {
    el.a = true;
    e.style.top = t;
    e.style.height = h; // full height
    if (m) { // repeating iterations
        setTimeout(function() {
            el.a = false;
            e.style.top = ta;
            e.style.bottom = b; // reverse anchor
            e.style.height = 0; // zero height
            setTimeout(function() {
                if ((!pg.msg.fo && pos.aT) || vw.dk) { // if NOT offline AND NOT scrolled
                    scrollArrowIterate(m, e, t, h, ta, b, ch); // repeat
                } else if (pg.msg.fo || !pos.aT) { // if offline OR scrolled
                    el.x = true;
                    if (!vw.dk) {
                        e.classList.add("d_n");
                    }
                    if (ch) {
                        e_Fd(ch, true); // hide chevron
                    }
                }
            }, op.te);
        }, op.te);
    }
}

function peek() {
    var b = (!vw.tB && !vw.pH) ? el.ldP.getBoundingClientRect() : el.ldP4.getBoundingClientRect(), 
        t = b.top;
    document.documentElement.classList.add("scB");
    window.scrollTo(0, (t - aH)); // scroll to reasonable point in content area
}

function showCircle() { // show background circles in view
    if (!el.x6 || el.x7) {
        var _L = el.bgC.length - 1,
            tgt;

        _L = el.c4 ? _L : _L - 1;
        el.x6 = true;

        for (i = 0; i <= _L; i++) {
            if (el.bgC[i].classList.contains("z_O") || el.bgC[i].classList.contains("d_n")) {
                el.x7 = true;
                tgt = i; 
                break;
            }
        }
        if (tgt !== undefined) {
            el.bgC[tgt].classList.remove("d_n");
            setTimeout(function() {
                e_Fd(el.bgC[tgt], false);
                bd["b" + tgt] = el.bgC[tgt].getBoundingClientRect(); // add parameters for 3rd/4th circles
                if (tgt === _L && !el.x11) { // last target
                    el.x11 = true;
                    pgTasks("gy", true); // initiate gyroscope
                }
            }, 10);
            
            if (tgt < _L) {
                setTimeout(function() {
                    for (i = 0; i <= _L; i++) {
                        if (el.bgC[i].classList.contains("z_O") || el.bgC[i].classList.contains("d_n")) {
                            showCircle();
                            break;
                        }
                    }
                }, op.t);
            } else {
                el.x6 = false;
            }
        } 
    }
}

function pgTasks(id, m) { // conduct any page-specific tasks (JS/CSS)
    if (id === "sc") { // bg circles
        if (!el.x8) {
            el.x8 = true;
            setTimeout(function() {
                el.x8 = false;
            }, op.t);

            var _L = el.bgC.length - 1;
            _L = el.c4 ? _L : _L - 1;

            if (m && !el.x5) {
                el.x5 = true;
                for (i = 0; i <= _L; i++) {
                    el.bgC[i].classList.add("d_n");
                }
            } else if (!m && el.x5) {
                el.x5 = false;
                for (i = 0; i <= _L; i++) {
                    e_Fd(el.bgC[i], true);
                    el.bgC[i].classList.add("d_n");
                }
                setTimeout(function() {
                    for (i = 0; i <= _L; i++) {
                        if (el.bgC[i].classList.contains("z_O") || el.bgC[i].classList.contains("d_n")) {
                            showCircle();
                            break;
                        }
                    }
                }, op.te);
            }
        }
    } else if (id === "gy") { // use gyroscope
        if ('Gyroscope' in window && m) { // browser support

            // REFERENCED FROM MDN @: https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
            // Experimental feature

            try {
                gyroscope = new Gyroscope({ referenceFrame: "device", frequency: 30 });
                gyroscope.addEventListener("error", (event) => {
                    // Handle runtime errors.
                    if (event.error.name === "NotAllowedError") {
                        // Branch to code for requesting permission.
                        console.log("Permission needed to use sensor.");
                    } else if (event.error.name === "NotReadableError") {
                        console.log("Cannot connect to the sensor.");
                    }
                    pgTasks("gy", false);
                });
                gyroscope.addEventListener("reading", () => bgCirclesMove(gyroscope));
                gyroscope.start();
                el.g = true;
            } catch (error) {
                // Handle construction errors.
                if (error.name === "SecurityError") {
                    // See the note above about permissions policy.
                    console.log("Sensor construction was blocked by a permissions policy.");
                } else if (error.name === "ReferenceError") {
                    console.log("Sensor is not supported by the User Agent.");
                } else {
                    throw error;
                }
                pgTasks("gy", false);
            }
        } else { // no support
            el.g = false;
            el.bgC[3].style.animation = "bounceTop 10s ease-in-out infinite";
        }
    }
}

function bgCirclesMove(e) { // live gyro-based movement of bg. circles
    var x = e.x, // x-axis
        y = e.y, // y-axis
        z = e.z; // z-axis

    gyroscopeX = (op.fN * y * 3);
    gyroscopeY = (op.fN * x * 3);

    if (op.Lf.h) { // if tab/window hidden
        el.bgC[0].style.left = "85%"; // circle 0.5
        el.bgC[1].style.top = "2.5rem"; // circle 1
        el.bgC[2].style.left = "15%"; // circle 2

        el.bgC[3].style.transform = "translate(0px, 0px)"; // circle 3
        
        if (!el.ac) {
            el.bgC[4].style.left = "60%"; // circle 4 
        } else {
            el.bgC[4].style.left = "80%"; // ci
        }
    } else {

        el.bgC[0].style.left = (85 + (gyroscopeX / 3)) + "%"; // circle 0.5
        el.bgC[1].style.top = "calc(2.5rem + " + (gyroscopeY / 4) + "px)"; // circle 1
        el.bgC[2].style.left = (15 + (gyroscopeX / 2)) + "%"; // circle 2

        el.bgC[3].style.transform = "translate(" + gyroscopeX + "px, " + gyroscopeY + "px)"; // circle 3

        if (!el.ac) {
            el.bgC[4].style.left = (60 + (gyroscopeX / 3)) + "%"; // circle 4 
        } else {
            el.bgC[4].style.left = (80 + (gyroscopeX / 3)) + "%"; // circle 4 
        }
    }
}

window.addEventListener("visibilitychange", function() { // modify sensor usage
    if (el.g) {
        if (document.hidden) { // hidden document
            gyroscope.stop();
        } else { // visible document
            gyroscope = new Gyroscope({ referenceFrame: "device", frequency: 30 });
            gyroscope.addEventListener("reading", () => bgCirclesMove(gyroscope));
            gyroscope.start();
        }
    }
});


fch.L = setInterval(live_update, dev.i);