
// locally run JS fetching (respective to each page)

var fchL = {
        1 : { // #intro_sc profile image
            el : document.getElementById("profile_image"),
            u : 'ext/jpg/ivan_profile.jpg'
        },
        2 : { // logo_hybrid
            el : document.getElementsByClassName("logo-hybrid"),
            u : 'logo/logo_hybrid.png'
        }
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
    c_css("#intro_sc", "height: calc(" + cH + "px - 7rem);", false, null); // set landing page to full height (exclusive of url bar on mobile/tablet devices)
    c_css("#profile_image, #intro_sc .content", "margin-top: calc((" + cH + "px - 27.5rem) / 5);", false, null); // margins are relative to the height
    c_css("#ham_C", "margin-top: calc((" + cH + "px - 16rem) / 2);", false, null);
    if (!op.b.s) { // if browser platform is NOT Safari

        // ONLY APPLY FOR DESKTOP VIEWPORTS!

        /*
        c_css(".bt:active", "background-color: #E4E4E4;", false, null); // apply button active states
        c_css(".bt.md:active", "background-color: #565656;", false, null);*/
    }
}

function load_js_e() { // load JS (page specific)
    var b = getBd(hm.b, "bottom"); // obtain 'bottom' bound of ham. button
        // t = Math.ceil(((b - 1) / 10) * 2), // obtain approx. no. of max iterations (in 1000/30 ms. intervals) - round up for an inclusive value
        // m = (op.Ls * 2) * t; // calculate max time (ms.) for button offset alignment
        
    hm.f = b; // update the hamburger menu object properties
    // m.ft = m;
}

function load_js_eN() { // load JS, after page load (page specific)
    var b = getBd(im.L, "top");

    im.j = 1 / b; // opacity fade out rate (100vh - b)
    re = im.j;
}