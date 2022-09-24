
// locally run JS fetching

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