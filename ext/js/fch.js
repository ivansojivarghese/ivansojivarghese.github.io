
// locally run JS fetching (respective of each page)

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
    c_css("#ham_C", "margin-top: calc((" + cH + "px - 8rem) / 2);", false, null);
}