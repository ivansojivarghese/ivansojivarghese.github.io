

var wH = window.innerHeight, 
    cH = document.documentElement.clientHeight, // [for mobile/tablet] height, exclusive of URL bar
    wD = window.innerWidth, 
    Ldr = document.getElementById("loader"), 
    cir_L = document.getElementById("cir1"), // loading (animated) circle
    dsC = document.getElementById("disCon"), // display control
    eR = {
        m : document.getElementById("error"), // main
        vs : document.getElementById("error_vs"), // viewport - small
        vL : document.getElementById("error_vL"), // viewport - large
        ld : document.getElementById("error_lnd") // landscape
    },
    cE_L = true, // code-execution boolean
    b_Dim, // ham. menu 'bubbling' dimensions
    _Ld, // loop

    Rd = [], // load-ready? - conditions
    r, // before-load parameters
    h,
    w,
    vw;

    
function docRead() {
    switch (document.readyState) {
        case "complete": // if DOM, styles, images and scripts all loaded
            h = window.innerHeight;
            w = window.innerWidth;
            r = pgOr(w, h); // get screen orientation
            vw = vwP(w, h, r); // set device size/orientation params

            if (cE_L) { // execute following code block once only
                loadUp(); 
                b_Dim = r.n * 2.5; // largest dimension to 'bubble' out + 150% extra
                cE_L = false;
            }
            if (rdS(Rd)) {
                Ldr.style.opacity = 0; // hide loader
                setTimeout(function() {
                    Ldr.style.display = "none";
                }, 200);
                if (vw.z_S) { // if viewport size is too small
                    eR.m.style.display = "block";
                    eR.vs.style.display = "block"; // activate error page
                } else if (vw.z_L) { // if viewport size is too large
                    eR.m.style.display = "block";
                    eR.vL.style.display = "block";
                } else if (vw.mB_L) { // determine if viewport in landscape mode: when height (in landscape) below 500 (assumption that phone average viewport width is below 500)
                    eR.m.style.display = "block";
                    eR.ld.style.display = "block"; // activate [mobile] landscape-mode error
                } else {    
                    dsC.style.display = "block";
                    document.body.style.overflowY = "scroll"; // activate page
                    cir_L.style.animationPlayState = "paused"; // pause loading 
                    clearInterval(_Ld);
                }
            }
        break;
    }
}

function vwP(w, h, r) { // check device[viewport] size/orientation parameters
    var v = {
        z_S : false, // viewport size - small
        z_L : false, //  viewport size - large
        mB_L : false, // mobile - landscape
        pH : false, // phablet
        tB : false // tablet - landscape
    };
    if (w > 3100) { // if width greater than 3100, larger than average
        v.z_L = true;
    }
    if (r.o === "portrait") { // portrait view (for mobile and tablet)
        if (w < 220 || h < 440) { // if width less than 220, or height less than 440
            v.z_S = true;
        } else if (w > 700 && h > 1400) { // targeting hybrid desktop-tablets - disabling for use in portrait view
            v.z_L = true;
        } else if (w >= 500) { // portrait tablet (phablet)
            v.pH = true;
        }
    } else if (r.o === "landscape") { // landscape tablet/mobile, or greater (desktop)
        if (h < 220 || w < 440) { // height less than 220, or width less than 440
            v.z_S = true;
        } else if (h < 500) { // height less than 500 (mobile)
            v.mB_L = true;
        } else {
            v.tB = true; 
        }
    }
    return v;
}

function rdS(v) { // check ready-state (boolean conditions) of webpage
    var res = true,
        m = v.length - 1,
        _L = (m >= 0) ? m : 0;
    for (i = 0; i <= _L; i++) { // loop through ready-conditions variable
        if (v[i] !== true) {
            res = false; // check for all variables to TRUE
        }
    }
    return res;
}

function pgOr(w, h) { // check device orientation
    var s = {
        o : undefined, // orientation
        n : undefined, // pixel dimension of largest side
    };
    if (h > w || h === w) {
        s.o = "portrait"; // landscape if window innerHeight is greater than innerWidth
        s.n = h; // largest side is the height
    } else if (h < w) {
        s.o = "landscape";
        s.n = w; // largest side is the width
    }
    return s;
}


history.scrollRestoration = "manual"; // prevent automatic scroll rendering from browser (in memory)

_Ld = setInterval(docRead, 1000/60);