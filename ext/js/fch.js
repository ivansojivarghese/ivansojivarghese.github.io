
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
        a : true, // scroll arrow anchor status
        ac : false, // scroll arrow click check
        lk3 : document.getElementById("link_3"),
        lk3a : document.getElementById("link_3a"),
        lk3b : document.getElementById("link_3b"),
        chev : document.getElementById("chev_d"),
        bgC : document.querySelectorAll(".bg-circle"),
        bgC4 : document.getElementById("bg-cir4")
    };


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

    // c_css("#profile_image, #intro_sc .content", "margin-top: calc((" + cH + "px - 27.5rem) / 5);", false, null); // margins are relative to the height

    c_css(".bg-circles", "height: " + aH + "px;", false, null);
    c_css(".bg-circles .circle-3", "top: calc(7rem + (" + mg + ") + 12rem);", false, null); // 7rem + profile_image top margin + inward offset of 2rem (rel. to p. image height)

    c_css("#profile_image, #intro_sc .content", "margin-top: calc(" + mg + ")", false, null); // margins are relative to the height
    c_css("#link_3", "height: calc(" + aH + "px - (30.32rem + 2 * (" + mg + ")));", false, null);

    // 0.72 + 1.8 + 2.8 + mg + 18 + mg + 7

    if (wD >= 290 && aH <= 640 && !vw.mB_L) { // if width min at 290px; height max at 640px; portrait view
        if (!(wD >= 310 && aH <= 550)) { // if width/height NOT within 310px and 550px
            c_css("#profile_image", "width: 17rem; height: 17rem;", false, null); // apply style mod
            c_css("#link_3", "height: calc(" + aH + "px - (29.32rem + 2 * (" + mg + ")));", false, null);
        } else {
            c_css("#link_3", "height: calc(" + aH + "px - (26.32rem + ((480px - 27.5rem) / 3)));", false, null);
        }
    }

    c_css("#ham_C", "margin-top: calc((" + aH + "px - 16rem) / 2);", false, null);

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
            qInfo[i].innerHTML = dev.info[d];
            i++;
        }
    }
}

function js_live() { // update js - in live
    if (!el.ac) {
        if ((!pg.msg.fo && pos.aT) && el.x) { // if page online AND not scrolled
            el.lk3b.classList.remove("d_n");
            load_eN(); // reload scroll arrow feature
            el.x = false;
        }
    } else {
        if ((!pos.aT && !el.x3) || pg.msg.fo) { // if scrolled OR offline
            el.x3 = true;
            el.lk3.removeEventListener("click", peek); // remove peek feature
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
}

function load_eN() { // load, after cookie acceptance (page specific)
    // scroll arrow
    var h = getBd(el.lk3, "height");
    if (h >= 65) { // min. 65px height required
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
            el.lk3.classList.remove("z-G");
            el.lk3.addEventListener("click", peek); // add peek feature
            el.ac = true;
        }
        c_rep(el.lk3a, "h-z", "h-fp"); // show 'scroll-down' box 
        e_Fd(el.chev, false); // show chevron
    }
    if (!el.x2) { // show background circles at load
        el.x2 = true;
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
    var t = aH * 0.2;
    window.scrollTo(0, t);

    // scroll to reasonable point in content area

    // 4 rem
    // 7rem
    // 1rem
}

function showCircle() { // show background circles in view
    var _L = el.bgC.length - 1,
        tgt;
    for (i = 0; i <= _L; i++) {
        if (el.bgC[i].classList.contains("z_O")) {
            tgt = i; 
            break;
        }
    }
    e_Fd(el.bgC[tgt], false);
    if (tgt < _L) {
        setTimeout(function() {
            showCircle();
        }, op.t);
    }
}

function pgTasks(id, m) { // conduct any page-specific tasks (JS/CSS)
    if (id === "sc") { // bg circles
        var _L = el.bgC.length - 1;
        if (m) {
            for (i = 0; i <= _L; i++) {
                el.bgC[i].classList.add("d_n");
                e_Fd(el.bgC[i], true);
            }
        } else {
            setTimeout(function() {
                for (i = 0; i <= _L; i++) {
                    el.bgC[i].classList.remove("d_n");
                }
                setTimeout(function() {
                    showCircle();
                }, 10);
            }, op.te);
        }
    }
}