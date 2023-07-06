
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
        c4 : false,
        a : true, // scroll arrow anchor status
        ac : false, // scroll arrow click check
        g : false, // gyro sensor check
        i : document.getElementById("profile_image"),
        pb : document.getElementById("profile_banner"),
        pgph : document.getElementById("pr_gt_ph"),
        Lt : document.getElementById("localTime"),
        lk3 : document.getElementById("link_3"),
        lk3a : document.getElementById("link_3a"),
        lk3b : document.getElementById("link_3b"),
        chev : document.getElementById("chev_d"),
        bgC : document.querySelectorAll(".bg-circle"),
        bgC4 : document.getElementById("bg-cir4"),
        ldP : document.getElementById("lead_point"),
        ldP1 : document.getElementById("lead_point_1"),
        q1_t : document.getElementById("qIn1_typer"),
        cIa : document.getElementsByClassName("c_Info_arrows"),
        qIc : document.getElementsByClassName("q_Info_icons")
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
            el.pgph.innerHTML = "Hello. I'm";
            el.Lt.classList.remove("d_n");
        }

        for (j = 0; j <= (el.cIa.length - 1); j++) { // change arrows
            el.cIa[j].classList.remove("lead_arrow_forward_w_img");
            el.cIa[j].classList.add("lead_arrow_forward_img");
        }

        for (k = 0; k <= (el.qIc.length - 1); k++) { // change icons
            el.qIc[k].classList.remove(qI_o[k]);
            el.qIc[k].classList.add(qI_c[k]);
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
}

function js_live() { // update js - in live
    // var d = (pos.yA !== 0) ? Math.abs(pos.y - pos.yA) : 0; // obtain distance of scroll
    // if (d > pos.st) {
        if (!el.ac) { 
            if ((!pg.msg.fo && pos.aT) && el.x) { // if page online AND not scrolled
                el.lk3b.classList.remove("d_n");
                load_eN(); // reload scroll arrow feature
                el.x = false;
            }
        } else {
            if ((!pos.aT && !el.x3) || pg.msg.fo) { // if scrolled OR offline
                el.x3 = true;
                el.lk3.removeEventListener("click", peek); 
                e_Fd(el.lk3b, true); // fade out 
                e_Fd(el.chev, true); 
                setTimeout(function() {
                    el.lk3b.style.height = "0px"; // set link to 0 height
                }, op.t);
            } else if (pos.aT && el.x3 && !pg.msg.fo) { // back to top AND online
                e_Fd(el.lk3b, false); // fade in
                load_eN();
                setTimeout(function() {
                    el.x3 = false;
                }, op.t);
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
    // }
}

function load_eN() { // load, after cookie acceptance (page specific)
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
            scrollArrowIterate(true); // start iteration
            el.ac = false;
        } else {
            if (!el.x4) {
                c_css(".bg-circles .circle-4", "top: calc(" + aH + "px - 3.5rem);", false, null); 
                el.x4 = true;
            }
            scrollArrowIterate(false); // start iteration (single)
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
}

function scrollArrowIterate(m) {
    el.a = true;
    el.lk3b.style.top = "1rem";
    el.lk3b.style.height = "calc(100% - 2.5rem)"; // full height
    if (m) { // repeating iterations
        setTimeout(function() {
            el.a = false;
            el.lk3b.style.top = "auto";
            el.lk3b.style.bottom = "1.5rem"; // reverse anchor
            el.lk3b.style.height = 0; // zero height
            setTimeout(function() {
                if (!pg.msg.fo && pos.aT) { // if NOT offline AND NOT scrolled
                    scrollArrowIterate(m); // repeat
                } else if (pg.msg.fo || !pos.aT) { // if offline OR scrolled
                    el.x = true;
                    el.lk3b.classList.add("d_n");
                    e_Fd(el.chev, true); // hide chevron
                }
            }, op.te);
        }, op.te);
    }
}

function peek() {
    var b = el.ldP.getBoundingClientRect(), 
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