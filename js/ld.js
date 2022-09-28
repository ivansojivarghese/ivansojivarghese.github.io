

var /*wH = window.innerHeight, 
    cH = document.documentElement.clientHeight, // [for mobile/tablet] height, exclusive of URL bar
    wD = window.innerWidth, 
    */
    disp = document.getElementById("display_sc"), // display   
    rL = { // page loader
        f : { // - favicon/logo
            el : document.getElementsByClassName("logo"), // element
            u : 'logo/favicon.png' // relative path
        },
        el : document.getElementById("load_sc"), // load_sc
        g : document.getElementById("load_logo"), // loading logo
        t : document.getElementById("load_temP"), // loading logo/ring - 'template'
        r : document.getElementById("loadR"), // loading rings (container)
        p : document.getElementById("loadR-p"), // loading ring (primary)
        d : document.getElementById("loadR-e"), // loading ring (end)
        c : document.getElementById("loadR-s"), // loading ring (secondary)
        e : false, // code-execution boolean
        e2 : false, // ""
        e3 : false,
        s : false, // int_Load status
    },
    eR = { // error categories
        m : document.getElementById("error_sc"), // main
        e : false, // code-execution boolean
        vs : document.getElementById("error_vs"), // viewport - small
        vL : document.getElementById("error_vL"), // viewport - large
        ld : document.getElementById("error_lnd") // landscape
    },


    bC_d = "#303030", // contrast colour - dark
    bC_L = "#FFF", // contrast colour - light
    bC_t = "transparent",
    trD_a = 500, // transition duration - for animation (in ms.)
    sV_a = 0.8, // user viewport threshold - for scroll-based functions

    _Ld, // loop
    up = { // [user] input
        t : undefined, // type
        id : 0 // unique id (for reference)
    },

    r, // before-load parameters
    vw; // viewport variables

    


function docRead() {
    switch (document.readyState) { // check 'ready state' of document
        case "complete": // if DOM, styles, images and scripts all loaded
            r = pgOr(wD, wH); // get screen orientation (using dimensions)
            vw = vwP(wD, wH, r); // set device size/orientation params
            if (!rL.e) { // ensure once execution
                if (!rL.e2) {
                    rL.e2 = true;
                    load_css(); // apply CSS (common)
                    resLoad(rL.f.el, rL.f.u); // load up site favicon (logo)
                }
                if (rdS(Rd) && !rL.e3) { // when favicon has loaded
                    rL.e3 = true; 
                    rL.g.classList.remove("z_O"); // show logo
                    setTimeout(function() {
                        rL.t.classList.remove("z_O"); // standby loading rings
                        rL.r.classList.remove("z_O");
                    }, op.t); // same duration as .trs transition duration property
                    setTimeout(function() { // run loading animation
                        rL.g.classList.add("z_O"); 
                        rL.t.classList.add("template");
                        setTimeout(function() { // hide the logo and show the rings
                            rL.t.classList.add("z_O");
                            load_css_e(); // load css styles to 'head' (indiv.)
                            loadUp();  // trigger ALL PROMISES (fetching of resources)
                            rL.e = true; // execute following code block once only
                        }, op.t); 
                    }, 800); // total loading duration to be min. 1.2sec
                }
            }  else if (rdS(Rd)) { // show webpage once all processes (requests, etc.) are complete

                rL.s = true; // set load status to true

                    /// loadR-e to complete the ring
                        // activate animation when ring is untransversed (animationiteration event)
                            // set a variable to true to activate
                        // .5s later: pause all animations (rings)
                        // trs to display page

                // show the page
                    // set scroll 

                // console.log("loaded");

                clearInterval(_Ld); // stop ready-check loop
            }
        break;
    }
}

function load_e() { // end the loading sequence
    if (rL.s) { // only if status is true

        // CHECK HERE: If error or normal?

        // if error

        // if normal
        rL.d.style.animationName = "loadR_end"; // set ending animation detail
        setTimeout(function() {
            rL.el.classList.add("z_O"); // hide in view - timed to coexist with ending (animation) detail
            setTimeout(function() {
                rL.el.classList.add("d_n"); // remove loader from display

                rL.r.classList.add("aniM-p"); // stop animation in the rings
                rL.p.classList.add("aniM-p");
                rL.c.classList.add("aniM-p");

                disp.classList.remove("z_O"); // show the page
                document.body.classList.add("ovy-s"); // enable scrolling
            }, op.t); // give time for opacity .trs to completely hide element
        }, op.te - op.t);
        rL.p.removeEventListener("animationiteration", load_e); // remove listening event from primary loading ring
    }
}

function load_css() { // load up CSS (common)
    c_css("#load_C", "margin-top: calc((" + cH + "px - 8rem) / 2);", false, null); // align loader to centre of viewport
    c_css(".trs", "transition-duration: " + (op.t / 1000) + "s;", false, null); // transition duration (convert to sec.)
    c_css("#loadR-e", "animation-duration: " + (op.te / 1000) + "s;", false, null); // loading ring (end) animation dur.
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

function rdS(v) { // check ready-state (boolean conditions) of webpage - ensure images, APIs, external scripts (etc.) have been loaded before display
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
/*
function load_e() { // page load end
    var i = 0,
        _L = rL.r.length - 1,
        _A = ["L_fb-c", "L_pa", "L_z-br", "bC_d", "L_fs", "c-xy", "z_O"], // respective CSS style rules to be added to loading ring elements
        _AL = _A.length - 1,
        d = function() { // function expression
            for (j = 0; j <= _L; j++) { // loop through the 2 loading rings
                rL.r[j].classList.add(_A[i]);  // add each class above to them
            }
            i++; // increment index
        };
    setTimeout(function() { // add remaining classes
        d();
        setTimeout(function() {
            while (i < _AL) {
                d();
            }
            setTimeout(function() {
                d(); // remove rings from display (through adding of 'z_O')
                e_Fd(rL.g, false); // fade in logo
                setTimeout(function() {
                    e_Fd(rL.el, true) // fade out
                    er_C();
                }, (trD_a * 2)); // maximise on-screen visibility of logo
            }, trD_a);
        }, trD_a); // other classes at no delay - instantaneous
    }, trD_a);  // first class with .trs.md delay
}*/

function er_C() { // check for errors
    if (vw.z_S) { // if viewport size is too small
        erPg_D("vs");
    } else if (vw.z_L) { // if viewport size is too large
        erPg_D("vL");
    } else if (vw.mB_L) { // determine if viewport in landscape mode: when height (in landscape) below 500 (assumption that phone average viewport width is below 500)
        erPg_D("ld");
    } else if (!eR.e) { // if no errors detected (and block not executed yet)
        eR.e = true;
        dsC.classList.remove("d_n"); // show display (webpage)
        setTimeout(function() {
            e_Fd(dsC, false); // fade in body
            rL.el.classList.add("d_n"); 
            setTimeout(function() {
                intro_L(); // load up 'landing' area
            }, trD_a + trD);
        }, trD);
    }
}

function intro_L() { // load up the landing page (#intro_sc)
    /*
    var a = getBd(hD.g_i, "height"), // get height of 'logo_hybrid.png'
        b = (a / 192) * 1181, // obtaining display width (px) of logo: (a / h) * w - in reference to logo_hybrid.png
        c = (b / wD) * 100; // obtain percetile (of display width) against viewport width

    e_Sd(hD.g, hD.g_i, c, (92 - c), null, null); // 'slide-in/out' logo at head - [variable percentile]% width, [100vw - 8% - percentile]% right*/

    /*
    if (vw.tB) { // tablet or desktop
        e_Sd(hD.g, hD.g_i, 40, 52, null, null); // 'slide-in/out' logo at head - 40% width, 52% right
    } else { // mobile or phablet
        e_Sd(hD.g, hD.g_i, 70, 22, null, null); // 'slide-in/out' logo at head - 70% width, 22% right
    }*/

    setTimeout(function() {
        int_LoadUp(); // perform load-up for other elements in landing zone (differs by page - refer to respective lds.js)
    }, (trD_a * 2));
}

function erPg_D(p) { // error page display
    var el = eR[p];
    eR.m.classList.remove("d_n"); // display
    el.classList.remove("d_n");
    setTimeout(function() {
        e_Fd(el, false); // fade in
    }, trD)
}


rL.p.addEventListener("animationiteration", load_e); // read a function upon every loading ring iteration (transversing)

history.scrollRestoration = "manual"; // prevent automatic scroll rendering from browser (in memory)

_Ld = setInterval(docRead, 1000/60); // run 'load' scripts upon startup