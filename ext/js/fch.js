
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
        3 : { // favicon_secondary
            el : document.getElementsByClassName("logo-secondary"),
            u : 'logo/favicon_secondary.png'
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
        lk3a : document.getElementById("link_3a")
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
    var mg = "(" + cH + "px - 27.5rem) / 5"; // margin

    // c_css("#profile_image, #intro_sc .content", "margin-top: calc((" + cH + "px - 27.5rem) / 5);", false, null); // margins are relative to the height
    c_css("#profile_image, #intro_sc .content", "margin-top: calc(" + mg + ")", false, null); // margins are relative to the height
    c_css("#link_3", "height: calc(" + cH + "px - (30.32rem + 2 * (" + mg + ")));", false, null);

    // 0.72 + 1.8 + 2.8 + mg + 18 + mg + 7

    if (wD >= 290 && cH <= 640 && !vw.mB_L) { // if width min at 290px; height max at 640px; portrait view
        if (!(wD >= 310 && cH <= 550)) { // if width/height NOT within 310px and 550px
            c_css("#profile_image", "width: 17rem; height: 17rem;", false, null); // apply style mod
            c_css("#link_3", "height: calc(" + cH + "px - (29.32rem + 2 * (" + mg + ")));", false, null);
        } else {
            c_css("#link_3", "height: calc(" + cH + "px - (26.32rem + ((480px - 27.5rem) / 3)));", false, null);
        }
    }

    c_css("#ham_C", "margin-top: calc((" + cH + "px - 16rem) / 2);", false, null);

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

function load_eN() { // load, after cookie acceptance (page specific)
    el.lk3a.classList.add("h-fp");
}