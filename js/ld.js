

var disp = document.getElementById("display_sc"), // display   
    fter = { // footer
        el : document.getElementById("footer_sc"), // element
        y : document.getElementById("f_yr"), // copyright year
        v : document.getElementsByClassName("f_vr") // site version
    },
    rL = { // page/resource loader
        /*
        f : { // - favicon/logo
            el : document.getElementsByClassName("logo"), // element
            u : 'logo/favicon.png' // relative path
        },
        f_s : {
            el : document.getElementsByClassName("logo-secondary"),
            u : '../logo/favicon_secondary.png'
        },
        w_s : { // - wifi slow
            el : document.getElementsByClassName("wifi_slow_img"),
            u : '../svg/wifi_slow.svg'
        },
        w_fw : { // - wifi off (white)
            el : document.getElementsByClassName("wifi_off_w_img"),
            u : '../svg/wifi_off_white.svg'
        },
        w_w : { // wifi (white)
            el : document.getElementsByClassName("wifi_w_img"),
            u : '../svg/wifi_white.svg'
        },*/
        el : document.getElementById("load_sc"), // load_sc
        m : document.getElementById("load_box"), // load_sc main
        dt : document.getElementById("load_dot"), // loading dot
        n : document.getElementById("load_icon"), // loading icon (for any message)

        //g : document.getElementById("load_logo"), // loading logo
        //t : document.getElementById("load_temP"), // loading logo/ring - 'template'

        x : document.getElementById("load_text"), // loading text
        xc : document.getElementById("load_text_cnt"), // loading text content
        xe : document.getElementById("load_text_ex"), // loading text extra
        xep : document.getElementById("load_text_ex_p"), // "" primary
        xes : document.getElementById("load_text_ex_s"), // "" secondary
        xea : document.getElementById("load_text_arrow"), // "" arrow
        r : document.getElementById("loadR"), // loading rings (container)
        p : document.getElementById("loadR-p"), // loading ring (primary)
        d : document.getElementById("loadR-e"), // loading ring (end)
        c : document.getElementById("loadR-s"), // loading ring (secondary)
        e : false, // code-execution boolean
        e2 : false, // ""
        e3 : false,
        e4 : false,
        e5 : false,
        s : false, // int load status
        y : false, // ready (render) load status
        i : false // full load status
    },
    eR = { // error 
        h : "", // hold-value placement (error page id)
        e : false, // code-execution boolean
        v : { // version
            u : document.getElementById("vrU"), // version upgrade
            u_e : document.getElementsByClassName("vr-u") // "" elements class
        },
        m : document.getElementById("error_sc"), // main
        vs : document.getElementById("error_vs"), // viewport - small
        vL : document.getElementById("error_vL"), // viewport - large
        ld : document.getElementById("error_lnd"), // landscape
        mt : document.getElementById("error_mt"), // maintenance
        ck : document.getElementById("error_cke") // cookies
    },





    bC_d = "#303030", // contrast colour - dark
    bC_L = "#FFF", // contrast colour - light
    bC_t = "transparent",
    trD_a = 500, // transition duration - for animation (in ms.)
    sV_a = 0.8, // user viewport threshold - for scroll-based functions

    _Ld, // loop
    _Le, // loop (applicable, if error)

    r, // before-load parameters
    vw; // viewport variables

    



function docRead() {
    switch (document.readyState) { // check 'ready state' of document
        case "interactive":
            if (!rL.e4) {
                rL.e4 = true;
                e_Fd(rL.m, false); // show load-box
            }
        case "complete": // if DOM, styles, images and scripts all loaded
            if (!rL.e) { // ensure once execution
                if (!rL.e2) { 
                    setCookie("windowResize", false, op.c.t);
                    rL.e2 = true;
                    if (!rL.e4) {
                        rL.e4 = true;
                        e_Fd(rL.m, false); // show load-box (either flow)
                    }
                    if (getCookie("initialAccess") !== "true" && !dev.mode) { // create an access cookie (checks for first-time access)
                        // resLoad(rL.f.el, rL.f.u); // load up site favicon (logo)
                        setCookie("initialAccess", "true", op.c.t); // access cookie lasts for 24 hours
                        setCookie("maxHeight", cH, op.c.t); // max height 
                        op.c.a = true; // user initial access detected
                    } else {
                        Rd[Rd.length] = true; // accelerate load process
                        op.c.a = false; // user NOT initial access
                        if (getCookie("cookiesAccepted") === "true" || dev.mode) { // if cookies have been accepted by user
                            pg.msg.el.classList.add("d_n"); // remove user cookie-acceptance message
                            op.c.u = true; // message accepted
                            /*
                            if (getCookie("maxHeight") < cH || op.nav.r) { // if height fluctuates from additional URL bars, etc.
                                setCookie("maxHeight", cH, op.c.t); // update
                                aH = getCookie("maxHeight");
                            } /*else if () {
                                setCookie("maxHeight", aH, op.c.t); // update
                            }*/
                        } 
                    }

                    // resLoad(rL.f_s.el, rL.f_s.u); // favicon_secondary
                    // resLoad(rL.w_fw.el, rL.w_fw.u); // wifi_off_white
                    // resLoad(rL.w_s.el, rL.w_s.u); // wifi_off_white
                    // resLoad(rL.w_w.el, rL.w_w.u); // wifi_white

                    // load_js_e(); // load js (indiv.)
                    // loadUp();  // trigger ALL PROMISES (fetching of resources)

                }
                if ((rdS(Rd) && !rL.e3 && !op.ne.w && loadS_res(res_ar)) /*|| (rdS(Rd) && op.ne.w && op.ne.s)*/) { // when elements have loaded
                    rL.e3 = true; 
                    // rL.s = true;
                    /*
                    if (op.c.a) { // only if first-time access
                        e_Fd(rL.g, false); // show logo
                    }*/
                    rL.dt.classList.add("d_n"); // hide loading dot
                    setTimeout(function() {
                        /*
                        if (op.c.a) {
                            e_Fd(rL.t, false); // standby loading rings
                        }*/
                        e_Fd(rL.r, false);
                    }, op.t); // same duration as .trs transition duration property
                    setTimeout(function() { // run loading animation
                        // rL.g.classList.add("z_O"); 
                        /*
                        if (op.c.a) {
                            rL.t.classList.add("template");
                        }*/
                        setTimeout(function() { // hide the logo and show the rings
                            /*
                            if (op.c.a) {
                                rL.t.classList.add("z_O");
                            }*/
                            load_js_e(); // load js (indiv.)
                            // load_css_e(); // load css styles to 'head' (indiv.)
                            loadUp();  // trigger ALL PROMISES (fetching of resources)
                            rL.e = true; // execute following code block once only
                        }, op.t); 
                    }, 800); // total loading duration to be min. 1.2sec

                } else if ((op.ne.w && op.ne.s) || (!op.ne.w && op.ne.s && op.ne.off)) { // if slow network (or fast network after offline)

                    // console.log("slow speed");
                    // rL.n.classList.add("wifi_slow_img");

                    if (!op.ne.off) {
                        c_rep(rL.n, "wifi_off_img", "wifi_slow_img");
                        if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w_s) {
                            rL.xc.innerHTML = "network is slow";
                        }
                    }

                    // resLoad(rL.w_s.el, rL.w_s.u);

                    rL.e = true;
                    rL.e5 = true;

                    // e_Fd(rL.n, false); 
                    // e_Fd(rL.x, false);
                
                } else if (op.Ld.dom > op.Ld.t || (getCookie("networkReload") === "true" && op.ne.w)) { // timeout 1

                    rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
                    rL.n.classList.add("timeout_img");
                    // c_rep(rL.n, "", "timeout_img");
                    e_Fd(rL.n, false); 

                    rL.dt.classList.add("md"); 
                    // op.nc = false;
                    op.ne.s = 0;

                    if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t) { // check if fonts are downloaded
                        rL.xc.innerHTML = "timeout";
                        e_Fd(rL.x, false); // show message when timeout
                    }

                    window.stop(); // stop all network resource(s) fetching
                    clearInterval(_Ld); // stop loading process
                    clearInterval(op.ne.L); // clear network check loop

                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                    estimateNetworkSpeed_abort.abort();

                } else if (op.n === false) { // if network offline
                    rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
                    // rL.n.classList.add("wifi_off_img");
                    c_rep(rL.n, ["wifi_slow_img", "wifi_find_img"], "wifi_off_img");
                    e_Fd(rL.n, false); 

                    rL.dt.classList.add("md"); 
                    // op.nc = false;
                    op.ne.off = true; // unexpected offline
                    op.ne.s = 0;
                    op.ne.w = false;
                    
                    if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w_o) { // check if fonts are downloaded
                        rL.xc.innerHTML = "offline";
                        e_Fd(rL.x, false); // show message when internet not connected
                    }
                }

            } else if (op.n && op.nc) { // if network change - from offline to online
                rL.dt.classList.remove("md", "aniM-f"); 
                if (!op.ne.reCon) {
                    c_rep(rL.n, ["wifi_off_img", "wifi_slow_img"], "wifi_find_img");
                }

                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w_f) { // check if fonts are downloaded
                    if (!op.nR) {
                        rL.xc.innerHTML = "reconnecting";
                    }
                    e_Fd(rL.x, false); // show message when internet not connected
                } else {
                    rL.xc.innerHTML = "";
                }

                if (!op.nR) {
                    op.nR = true;
                    if (getCookie("networkReload") !== "true") {
                        setCookie("networkReload", "true", op.c.t); // reload (due to network) cookie
                    }
                    setTimeout(function() {
                        rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // approx. speed
                        c_rep(rL.dt, "aniM", "aniM-f"); 
                        rL.dt.classList.add("e"); // stop animation on 'load_dot', change to green
                        if ((isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w) || (svg.w)) { // show connected
                            c_rep(rL.n, "wifi_find_img", "wifi_img");
                            rL.xc.innerHTML = "connected";
                        } else {
                            rL.n.classList.remove("wifi_find_img");
                            rL.xc.innerHTML = "";
                        }
                        op.ne.reCon = true;
                        setTimeout(function() {
                            reL();
                        }, op.te);
                    }, op.ne.bD); // reload page after interval
                }

                // console.log("reconnecting");

            } else if (rdS(Rd) && op.ne.w && op.ne.s && op.n && op.ne.noCon) { // if network slow (with background processes loaded)
                if (!op.ne.x) {
                    countdownTimerSec((op.Ld.t / 1000), op.ne.t2, null, timeout2); // start timeout 2 timer
                    // countdownTimerSec(100, op.ne.t2, null, timeout2); // TESTING!
                    op.ne.x = true; // execute once
                }

                if (!op.ne.t2s) { // no timeout 
                    switch (networkTrend(op.ne.b)) { // check recent [live] network trend
                        case true: // positive
                            changeSVGColor(op.col.p, rL.xea, false); // turns green
                            rL.xea.style.transform = "rotate(-90deg)"; // point up
                        break;
                        case false: // negative
                            changeSVGColor(op.col.n, rL.xea, false); // turns red
                            rL.xea.style.transform = "rotate(90deg)"; // point down
                        break;
                        case null: // constant
                            changeSVGColor(op.col.b, rL.xea, false); // turns black
                            rL.xea.style.transform = "rotate(0deg)";
                        break;
                    }

                    rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // approx. speed
                    op.ne.noCon = (loadS_res(res_ar)) ? false : true; // check loading of resources

                    // rL.n.classList.add("wifi_slow_img");

                    if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w_s && svg.L_a) { // check if fonts are downloaded
                        e_Fd(rL.xe, false); // show speed
                        e_Fd(rL.n, false); // show message
                        e_Fd(rL.x, false);

                        // rL.e5 = false;
                        rL.e5 = (loadS_res(res_ar)) ? false : true;
                    }
                } else { // timeout 2
                    op.ne.s = 0;
                    rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                    if (networkTrend(op.ne.b) || networkTrend(op.ne.b) === false) {
                        changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                        rL.xea.style.transform = "rotate(0deg)";
                    }
                    rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
                    rL.dt.classList.add("md"); // turns red 
                    if (svg.t) {
                        c_rep(rL.n, "wifi_slow_img", "timeout_img");
                    }
                    if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t) {
                        rL.xc.innerHTML = "timeout";
                    } else {
                        rL.xc.innerHTML = "";
                    }
                    window.stop(); // stop all network resource(s) fetching
                    clearInterval(_Ld); // stop loading process
                    clearInterval(op.ne.L); // clear network check loop

                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                    estimateNetworkSpeed_abort.abort();
                }
                /*
                e_Fd(rL.xe, false); // show speed
                e_Fd(rL.n, false); // show message
                e_Fd(rL.x, false);

                rL.e5 = false;
                */
            } else if (op.n === false) { // if network offline
                rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
                // rL.n.classList.add("wifi_off_img");
                c_rep(rL.n, ["wifi_slow_img", "wifi_find_img"], "wifi_off_img");
                e_Fd(rL.n, false); 

                rL.dt.classList.add("md");
                // op.nc = false;
                op.ne.s = 0;
                op.ne.w = false;

                rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                if (networkTrend(op.ne.b) || networkTrend(op.ne.b) === false) {
                    changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                    rL.xea.style.transform = "rotate(0deg)";
                }
                
                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w_o) { // check if fonts are downloaded
                    rL.xc.innerHTML = "offline";
                    e_Fd(rL.x, false); // show message when internet not connected
                } 
            } else if (rdS(Rd) && !rL.e5 && rL.y && loadS_res(res_ar)) { // show webpage once all processes (requests, etc.) are complete
                // if (!op.ne.w) {
                // rL.s = true; // set load status to true
                // }
                if ((getCookie("networkReload") === "true")) {
                    setCookie("networkReload", null, -1); // delete the cookie (since network is of normal speed, loaded normally)
                }
                
                e_Fd(rL.xe, true); // hide network stats
                e_Fd(rL.dt, true);
                rL.dt.classList.add("aniM-f"); // hide load dot
                e_Fd(rL.n, true);
                e_Fd(rL.x, true);
                setTimeout(function() { // show loading ring
                    e_Fd(rL.r, false);
                    load_js_e(); // load js (indiv.)
                    loadUp();  // trigger ALL PROMISES (fetching of resources)
                    rL.e = true; // execute following code block once only
                    rL.s = true;
                    clearInterval(_Ld); // stop ready-check loop

                    countdownTimerSec((op.Ld.t / 1000), op.ne.t2, null, timeout2); // start timeout 2 timer

                }, op.t); // same duration as .trs transition duration property
                
                /*
                setTimeout(function() { // run loading animation
                    setTimeout(function() { // hide the logo and show the rings
                        load_js_e(); // load js (indiv.)
                        // load_css_e(); // load css styles to 'head' (indiv.)
                        loadUp();  // trigger ALL PROMISES (fetching of resources)
                        rL.e = true; // execute following code block once only
                    }, op.t); 
                }, 800); // total loading duration to be min. 1.2sec
                */

                // (rdS(Rd) && !rL.e3 && !op.ne.w && loadS_res(res_ar)

                    /// loadR-e to complete the ring
                        // activate animation when ring is untransversed (animationiteration event)
                            // set a variable to true to activate
                        // .5s later: pause all animations (rings)
                        // trs to display page

                // show the page
                    // set scroll 

                if (!op.ne.w) { // if network NOT slow
                    clearInterval(_Ld); // stop ready-check loop
                }

            } else if (op.ne.s >= op.ne.h && rL.e5) {
                rL.e5 = false; // fix - if code block had executed unwantedly, but network speed remains optimal.
            }
        break;
    }
}

function load_e() { // end the loading sequence

    if (rL.s && !op.ne.w) { // only if status is true (default)
        rL.d.style.animationName = "loadR_end"; // set ending animation detail
        load_css_e(); // load css styles to 'head' (indiv.)
        setTimeout(function() {
            rL.el.classList.add("z_O"); // hide in view - timed to coexist with ending (animation) detail

            // er_C(); // check for errors

            setTimeout(function() {
                rL.el.classList.add("d_n"); // remove loader from display

                rL.r.classList.add("aniM-p"); // stop animation in the rings
                rL.p.classList.add("aniM-p");
                rL.c.classList.add("aniM-p");

                if (eR.h) { // if error is detected
                    if (eR[eR.h].classList.contains("d_n")) {
                        eR.m.classList.remove("d_n");
                        eR[eR.h].classList.remove("d_n");
                    }
                    e_Fd(eR[eR.h], false); // show the error
                } else {
                    disp.classList.remove("d_n"); // show the page
                    setTimeout(function() {
                        e_Fd(disp, false);  
                        if (op.c.u) { // if cookie-use accepted
                            load_eN(); // complete any due tasks (page-specific)
                            scr_t(true, null); // enable scrolling
                        } else {
                            setTimeout(function() {
                                /*
                                pg.msg.t.classList.remove("md"); // add tint
                                e_Sdv(pg.msg.ckA, true); 
                                */
                                if (!pg.msg.c) {
                                    msg_toggle(pg.msg.ckA, null, true, true, null); // show cookie-acceptance message
                                }
                            }, op.te);
                        }
                    }, 10);
                }

                // load_js_eN(); // load js, after page load
                load_jscss_N(); // load js/css (common), after page load

                rL.i = true; // page fully loaded
            }, op.t); // give time for opacity .trs to completely hide element
        }, op.te - op.t);
        rL.p.removeEventListener("animationiteration", load_e); // remove listening event from primary loading ring
    }
}

function load_css() { // load up CSS (common)
    c_css("#load_C", "margin-top: calc((" + aH + "px - 8rem) / 2);", false, null); // align loader to centre of viewport
    c_css(".trs", "transition-duration: " + (op.t / 1000) + "s;", false, null); // transition duration (convert to sec.)
    c_css(".trs_e", "transition-duration: " + (op.te / 1000) + "s;", false, null); // transition duration [ext.] (convert to sec.)
    c_css("#loadR-e", "animation-duration: " + (op.te / 1000) + "s;", false, null); // loading ring (end) animation dur.
    // c_css(".head_b", "height: calc(var(--doc-height) - 7rem);", false, null); // set landing page to full height (exclusive of url bar on mobile/tablet devices)

    if (vw.mB_L) { // in landscape view (mobile)
        c_css(".err", "margin-top: calc((" + aH + "px - " + (num_Fs(op.f) * (0.9 + 2.52 + 1.65)) + "px) / 2);", false, null); // approx. height of text elements container (centre-align)
        eR[eR.h].children[0].classList.remove("c-y"); // modify styling (remove centre-alignment)
    }
    /*
    if (op.b.f) {
        pg.cond.el.classList.add("h-fp");
    } else {
        pg.cond.el.classList.add("h-f");
    }*/
    
    /*
    if (!op.b.f) { // if browser platform is NOT Firefox
        document.documentElement.classList.add("scB"); // add smooth scroll behaviour
    }*/
}

function load_jscss_N() { // load up JS/CSS (after page load; common)
    var h = getBd(fter.el, "height"),
        y = op.d.getFullYear(), // get copyright year
        i = 0;

    // c_css("#cond_sc", "height: " + wH + "px;", false, null);

    c_css("#footer_sc .w-s", "height: calc(" + h + "px - 6rem);", false, null); // set height of footer design element
    fter.y.innerHTML = y;
    while (fter.v[i]) { // add copyright year + site version no.
        fter.v[i].innerHTML = dev.version;
        i++;
    }
}

function load_js() { // [compatibility/variables] load
    browserCheck();
    errorCheck(); 
    pos.st = (op.e / 100) * aH; // set scroll-validity threshold
    // op.r = getSiteRes(); // get site resource origin

    // checkOnline();
    // op.n = checkOnlineStatus();
}

function browserCheck() { // detect browser (platform)
    var userAgent = navigator.userAgent;
    if (userAgent.match(/chrome|chromium|crios/i)) { // Chrome
        op.b.c = true; 
    } else if (userAgent.match(/firefox|fxios/i)) { // Firefox
        op.b.f = true;
    } else if (userAgent.match(/safari/i)) { // Safari
        op.b.s = true;
    } 
    if (userAgent.match(/opr\//i)) { // Opera
        op.b.o = true;
        op.b.c = false; // revoke true status(es) of other browsers - since userAgent contains them (matching elements) as well
        op.b.s = false;
    } else if (userAgent.match(/edg/i)) { // Edge
        op.b.e = true;
        op.b.c = false;
        op.b.s = false;
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
        if (w < 240 || h < 440) { // if width less than 220, or height less than 440
            v.z_S = true;
        } else if (w > 700 && h > 1400) { // targeting hybrid desktop-tablets - disabling for use in portrait view
            v.z_L = true;
        } else if (w >= 500) { // portrait tablet (phablet)
            v.pH = true;    
        }
    } else if (r.o === "landscape") { // landscape tablet/mobile, or greater (desktop)
        if (h < 220 || w < 440) { // height less than 220, or width less than 440
            v.z_S = true;
            v.mB_L = true;
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
        if (v[i] && v[i] !== true) {
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

function errorCheck() { // check for errors
    if (vw.z_S) { // if viewport size is too small
        eR.h = "vs";
    } else if (vw.z_L) { // if viewport size is too large
        eR.h = "vL";
    } else if (vw.mB_L) { // determine if viewport in landscape mode: when height (in landscape) below 500 (assumption that phone average viewport width is below 500)
        eR.h = "ld";
    } else if (!op.c.e) { // check if cookies have been disabled (or not detected)
        eR.h = "ck";
    } else if (op.mt) { // check if site under maintenance
        eR.h = "mt";
    } else if (!eR.e) { // if no errors detected (and block not executed yet)
        eR.e = true;
        /*
        dsC.classList.remove("d_n"); // show display (webpage)
        setTimeout(function() {
            e_Fd(dsC, false); // fade in body
            rL.el.classList.add("d_n"); 
            setTimeout(function() {
                intro_L(); // load up 'landing' area
            }, trD_a + trD);
        }, trD);*/
    }

    // var loadTime = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart;
    // console.log(loadTime);

    if (eR.h && isFontAvailable("Poppins") && isFontAvailable("Raleway")) {
        rL.y = true;
        eR.m.classList.remove("d_n"); // display the error
        eR[eR.h].classList.remove("d_n");
    } else if (eR.h && !isFontAvailable("Poppins") && !isFontAvailable("Raleway")) {
        _Le = setInterval(function() {
            if (isFontAvailable("Poppins") && isFontAvailable("Raleway")) {
                errorCheck(); // iterative
                clearInterval(_Le);
            }
        }, op.Ls);
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
/*
function erPg_D(p) { // error page display
    var el = eR[p];
    eR.m.classList.remove("d_n"); // display
    el.classList.remove("d_n");
    setTimeout(function() {
        e_Fd(el, false); // fade in
    }, op.t)
}*/
function mt_check(v) { // maintenance function (temporary)
    if (/*op.nav.d !== "" ||*/ dev.mtne) { // ([temporary check condition] || full maintenance)
        if (v) { // if version upgrade
            var i = 0;
            while (eR.v.u_e[i]) { // edit to element[s]
                eR.v.u_e[i].innerHTML = dev.version_up;
                i++;
            }
            c_rep(eR.v.u, "d_n", "d_i");
        }
        return true; 
    } else {
        return false;
    }
}

function timeout2() {
    op.ne.t2s = true; // timeout if loading is long (slow network)
}


if (getCookie("maxHeight") < cH || (op.nav.r && getCookie("windowResize") === "true")) { // if height fluctuates from additional URL bars, etc.
    setCookie("maxHeight", cH, op.c.t); // update
    aH = getCookie("maxHeight");
} 
r = pgOr(wD, cH); // get screen orientation (using dimensions)
vw = vwP(wD, cH, r); // set device size/orientation params
op.c.e = navigator.cookieEnabled; // check for enabled cookies
op.mt = mt_check(dev.version_up);
load_js();
load_css();


rL.p.addEventListener("animationiteration", load_e); // read a function upon every loading ring iteration (transversing)
history.scrollRestoration = "manual"; // prevent automatic scroll rendering from browser (in memory)
setTimeout(function() {
    _Ld = setInterval(docRead, op.Ls); // run 'load' scripts upon startup
}, op.t);