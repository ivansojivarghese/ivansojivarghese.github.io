

var disp = document.getElementById("display_sc"), // display   
    fter = { // footer
        el : document.getElementById("footer_sc"), // element
        elm : document.getElementById("footer_main_sc"), // element - main
        y : document.getElementById("f_yr"), // copyright year
        v : document.getElementsByClassName("f_vr") // site version
    },
    eR_t = { // error small texts
        z : document.getElementById("err_t_z")
    },
    _Ld, // loop
    _Le, // loop (applicable, if error)
    r, // before-load parameters
    vw; // viewport variables

eR = { // error
    a : [], // error precedence array
    s : eR.s, // status
    h : "", // hold-value placement (error page id)
    p : "", // current error (id)
    e : false, // code-execution boolean
    v : { // version
        u : document.getElementById("vrU"), // version upgrade
        u_e : document.getElementsByClassName("vr-u") // "" elements class
    },
    m : document.getElementById("error_sc"), // main
    z : document.getElementById("error_z"), // zoom
    z_e : { // zoom, extension (if applicable)
        h : document.getElementById("error_z_h"), // header
        s : document.getElementById("error_z_s") // span
    },
    sp : document.getElementById("error_sp"), // split screen
    vs : document.getElementById("error_vs"), // viewport - small
    vL : document.getElementById("error_vL"), // viewport - large
    ld : document.getElementById("error_lnd"), // landscape
    ld_e : { // extension
        x : false // execution
    },
    dp : document.getElementById("error_dp"), // low performance
    or : document.getElementById("error_or"), // orientation change
    ck : document.getElementById("error_cke"), // cookies
    mt : document.getElementById("error_mt"), // maintenance
    vp : document.getElementById("error_vp"), // vpn
    vp_e : {
        h : document.getElementById("error_vph4"), // h4
    },
    pl : document.getElementById("error_pl"), // platform/browser
    pl_e : {
        p : document.getElementById("error_plp"), // p
        h : document.getElementById("error_plh4"), // h4
    },
    fC : document.getElementById("error_fC"), // focus
    fC_e : {
        x : false
    },
    fS : document.getElementById("error_fS"), // fullscreen
    fS_e : {
        x : false // execution
    },
    tr : document.getElementById("error_tr"), // translation 
    tr_e : {
        x : false 
    }
};

rL = { // page/resource loader
    el : document.getElementById("load_sc"), // load_sc
    m : document.getElementById("load_box"), // load_sc main
    dt : document.getElementById("load_dot"), // loading dot
    n : document.getElementById("load_icon"), // loading icon (for any message)
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
    e6 : false,
    e7 : false,
    o_c : false, // orientation-change check (during load)
    s : false, // int load status
    y : false, // ready (render) load status
    i : rL.i, // full load status
    r_s : false, // [loader] loading ring status
    i_s : false // [loader] information status
};


function engLangVar(c) { // return variant of language (eng) per user country location
    var res = "gb"; // default (en-GB)
    for (var x in f_countries) {
        if (f_countries[x].iso_A2 === c) { // if matches given list
            res = "us"; // american (en-US)
            break;
        }
    }
    return res;
}

function docRead() {
    switch (document.readyState) { // check 'ready state' of document
        case "interactive":
            if (!rL.e4) {
                rL.e4 = true;
                e_Fd(rL.m, false); // show load-box
            }
        case "complete": // if DOM, styles, images and scripts all loaded
            if (!devError) {

                (function() { // estimate processor speed

                    // JSBenchmark by Aaron Becker: @ https://stackoverflow.com/questions/19754792/measure-cpu-performance-via-js

                    var _speedconstant = 1.15600e-8; //if speed=(c*a)/t, then constant=(s*t)/a and time=(a*c)/s
                    var d = new Date();
                    var amount = 150000000;
                    var estprocessor = 1.7; //average processor speed, in GHZ

                    // console.log("JSBenchmark by Aaron Becker, running loop " + amount + " times.     Estimated time (for " + estprocessor + "ghz processor) is " + (Math.round(((_speedconstant * amount) / estprocessor) * 100) / 100) + "s");
                    
                    for (var i = amount; i > 0; i--) {}
                    var newd = new Date();
                    var accnewd = Number(String(newd.getSeconds()) + "." + String(newd.getMilliseconds()));
                    var accd = Number(String(d.getSeconds()) + "." + String(d.getMilliseconds()));
                    var di = accnewd - accd;

                    if (d.getMinutes() != newd.getMinutes()) {
                        di = (60 * (newd.getMinutes() - d.getMinutes())) + di
                    }
                    spd = ((_speedconstant * amount) / di);

                    // console.log("Time: " + Math.round(di * 1000) / 1000 + "s, estimated speed: " + Math.round(spd * 1000) / 1000 + "GHZ");

                    if ((Math.round(spd * 1000) / 1000) > 0) {
                        op.pSpda[op.pSpda.length] = Math.round(spd * 1000) / 1000; // store instantaneous calculated speed
                    }
                })();

                
                // Warning: the method will be executed forever, ideal for live counters
                // CODE REFERENCED FROM CARLOS DELGADO @https://ourcodeworld.com/articles/read/1390/how-to-determine-the-screen-refresh-rate-in-hz-of-the-monitor-with-javascript-in-the-browser#disqus_thread

                getScreenRefreshRate(function(FPS){ // average screen refresh rate
                    // console.log(`${FPS} FPS`);
                    if (!op.sfrx) {
                        if (FPS > 0) {
                            op.sfra[op.sfra.length] = FPS; // array of values
                        }
                    } else {
                        op.sfa = FPS; // live
                    }
                }, true);


                if (!vw.mB_L && !vw.z_S && !op.zoomDefault) { // if NOT mobile landscape OR small display or undefaulted zoom (UPDATE VARIABLES AT LINE 668, 771 BELOW! @load_e function condition 2)
                    setCookie("testCookie", "true", op.c.t); // set a test cookie
                    if (getCookie("testCookie")) { // check for cookies, // UPDATE AT LINE 771 BELOW!

                        if (getCookie("maxHeight")) {
                            if (Number(getCookie("maxHeight")) !== window.innerHeight) {
                                setCookie("maxHeight", null, -1);
                                reL();
                            }
                        } else if (getCookie("initialAccess") === "true") {
                            setCookie("maxHeight", cH, op.c.t);
                        }

                        if (!getCookie("maxWidth") && getCookie("initialAccess") === "true") {
                            setCookie("maxWidth", window.innerWidth, op.c.t);
                        }

                        if (!rL.e) { // ensure once execution

                            if (getCookie("displayErrorReload") === "true") {
                                op.er.d = true;
                            } else if (getCookie("cacheReload") === "true") {
                                op.er.ch = true;    
                            } else if (getCookie("lowPerformance") === "true") {
                                op.er.dp = true;
                            }

                            if (!rL.e2) { 
                                setCookie("windowResize", false, op.c.t);
                                rL.e2 = true;
                                if (!rL.e4) {
                                    rL.e4 = true;
                                    e_Fd(rL.m, false); // show load-box (either flow)
                                }
                                if (getCookie("initialAccess") !== "true" /*&& !dev.mode*/) { // create an access cookie (checks for first-time access)

                                    setCookie("initialAccess", "true", op.c.t); // access cookie lasts for 24 hours
                                    setCookie("maxHeight", cH, op.c.t); // max innerheight ""
                                    setCookie("maxWidth", window.innerWidth, op.c.t); // max innerWidth ""
                                    op.c.a = true; // user initial access detected

                                } else {
                                    Rd[Rd.length] = true; // accelerate load process
                                    op.c.a = false; // user NOT initial access
                                    if (getCookie("cookiesAccepted") === "true" /*|| dev.mode*/) { // if cookies have been accepted by user
                                        pg.msg.el.classList.add("d_n"); // remove user cookie-acceptance message
                                        op.c.u = true; // message accepted
                                    } 
                                }

                                // resLoad(rL.f_s.el, rL.f_s.u); // favicon_secondary
                                // resLoad(rL.w_fw.el, rL.w_fw.u); // wifi_off_white
                                // resLoad(rL.w_s.el, rL.w_s.u); // wifi_off_white
                                // resLoad(rL.w_w.el, rL.w_w.u); // wifi_white

                                // load_js_e(); // load js (indiv.)
                                // loadUp();  // trigger ALL PROMISES (fetching of resources)

                            }
                            if ((rdS(Rd) && !rL.e3 && (op.ne.w === false) && loadS_res(res_ar) && op.n && !rL.i_s) /*|| (rdS(Rd) && op.ne.w && op.ne.s)*/) { // when elements have loaded (normal)
                                rL.e3 = true; 

                                rL.r_s = true;
                                rL.i_s = false;

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
                            
                            } else if ((op.n === null && op.ne.w === null && !op.ne.x2) || (op.n && !op.ne.w && !op.ne.x2)) { // potential timeout 1 (@load_dot)

                                countdownTimerSec((op.Ld.t / 1000), op.ne.t1, null, timeout1); // start timeout 1 timer
                                op.ne.x2 = true;

                            } else if (((op.Ld.dom > op.Ld.t || (getCookie("networkReload") === "true" && op.ne.w)) || (op.Ld.b && op.Ld.s && !op.ne.w && op.ne.s) || op.ne.t1s) && !rL.r_s) { // timeout 1

                                rL.i_s = true;
                                rL.r_s = false;

                                rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
                                rL.n.classList.add("timeout_img");
                                // c_rep(rL.n, "", "timeout_img");
                                e_Fd(rL.n, false); 

                                rL.dt.classList.add("md"); 
                                // op.nc = false;
                                op.ne.s = 0;

                                rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                                if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                                    changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                                    rL.xea.style.transform = "rotate(0deg)";
                                }

                                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t && !op.ne.tc) { // check if fonts are downloaded
                                    if (getCookie("networkReload") === "true" || (op.Ld.b && op.ne.w)) {
                                        rL.xc.innerHTML = "cancelled";
                                        op.ne.tc = true;
                                    } else {
                                        rL.xc.innerHTML = "timeout";
                                        op.ne.tc = true;
                                    }
                                    e_Fd(rL.x, false); // show message when timeout
                                }

                                setTimeout(function() {
                                    window.stop(); // stop all network resource(s) fetching
                                    clearInterval(_Ld); // stop loading process
                                    clearInterval(op.ne.L); // clear network check loop

                                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                                    estimateNetworkSpeed_abort.abort();
                                }, op.te);

                            } else if (op.n === false && !rL.r_s) { // if network offline

                                rL.i_s = true;
                                rL.r_s = false;

                                if (!op.ne.x1) {
                                    countdownTimerSec((op.Ld.t / 1000), op.ne.t0, null, timeout0); // start timeout 0 timer
                                    op.ne.x1 = true;
                                }

                                rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
                                // rL.n.classList.add("wifi_off_img");
                                // c_rep(rL.n, ["wifi_slow_img", "wifi_find_img"], "wifi_off_img");

                                if (!op.ne.t0s) {
                                    c_rep(rL.n, ["wifi_slow_img", "wifi_find_img"], "wifi_off_img");
                                } else { // if timeout 0
                                    if (svg.t) {
                                        c_rep(rL.n, "wifi_off_img", "timeout_img");
                                    } else {
                                        rL.n.classList.remove("wifi_off_img");
                                    }
                                }

                                e_Fd(rL.n, false); 

                                rL.dt.classList.add("md"); 
                                // op.nc = false;
                                console.log("unexp off");
                                op.ne.off = true; // unexpected offline
                                op.ne.s = 0;
                                op.ne.w = false;
                                
                                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w_o && !op.ne.t0s) { // check if fonts are downloaded
                                    rL.xc.innerHTML = "offline";
                                    e_Fd(rL.x, false); // show message when internet not connected

                                } else if (op.ne.t0s) { // if timeout 0

                                    if (svg.t) {
                                        rL.xc.innerHTML = "timeout";
                                        e_Fd(rL.x, false); // show message when timeout
                                    } else {
                                        rL.xc.innerHTML = "";
                                    }

                                    op.ne.s = 0;
                                    rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                                    if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                                        changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                                        rL.xea.style.transform = "rotate(0deg)";
                                    }

                                    setTimeout(function() {
                                        window.stop(); // stop all network resource(s) fetching
                                        clearInterval(_Ld); // stop loading process
                                        clearInterval(op.ne.L); // clear network check loop
                
                                        checkOnlineStatus_abort.abort(); // abort any existing fetching
                                        estimateNetworkSpeed_abort.abort();
                                    }, op.te);
                                }
                            }

                        } else if (op.n && op.nc && !rL.r_s && op.ne.off) { // if network change - from offline to online

                            rL.i_s = true;
                            rL.r_s = false;

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

                                    countdownTimerSec((op.Ld.t / 1000), op.ne.t4, null, timeout4); // start timeout 4 timer

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

                            } else if ((getCookie("networkReload") === "true" && !op.n) || op.ne.t4s) { // cancelled by user OR timeout 4

                                op.ne.s = 0;
                                op.ne.w = false;

                                rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed

                                if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                                    changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                                    rL.xea.style.transform = "rotate(0deg)";
                                }

                                c_rep(rL.dt, "e", "md"); // set dot to red
                                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t) {
                                    c_rep(rL.n, "wifi_img", "timeout_img"); // change icon to timeout
                                    if (!op.ne.x3) { // execute once
                                        if (op.ne.t4s) {
                                            rL.xc.innerHTML = "timeout";
                                            op.ne.x3 = true;
                                        } else {
                                            rL.xc.innerHTML = "cancelled";
                                            op.ne.x3 = true;
                                        }
                                    }
                                } else {
                                    e_Fd(rL.n, true); // hide
                                    rL.xc.innerHTML = "";
                                }

                                setTimeout(function() {
                                    window.stop(); // stop all network resource(s) fetching
                                    clearInterval(_Ld); // stop loading process
                                    clearInterval(op.ne.L); // clear network check loop

                                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                                    estimateNetworkSpeed_abort.abort();

                                    setCookie("networkReload", null, -1); // delete cookie variable
                                }, op.te);
                            }

                            // console.log("reconnecting");

                        } else if (rdS(Rd) && op.ne.w && op.ne.s && op.n && op.ne.noCon && !rL.r_s) { // if network slow (with background processes loaded)

                            rL.i_s = true;
                            rL.r_s = false;

                            if (!op.ne.x) {
                                countdownTimerSec((op.Ld.t / 1000), op.ne.t2, null, timeout2); // start timeout 2 timer
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
                                if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
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
                                setTimeout(function() {
                                    window.stop(); // stop all network resource(s) fetching
                                    clearInterval(_Ld); // stop loading process
                                    clearInterval(op.ne.L); // clear network check loop

                                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                                    estimateNetworkSpeed_abort.abort();
                                }, op.te);
                            }
                            /*
                            e_Fd(rL.xe, false); // show speed
                            e_Fd(rL.n, false); // show message
                            e_Fd(rL.x, false);

                            rL.e5 = false;
                            */
                        } else if (!op.n && !rL.r_s) { // if network offline

                            rL.i_s = true;
                            rL.r_s = false;

                            if (getCookie("networkReload") === "true" || op.ne.t4s) { // cancelled by user

                                op.ne.s = 0;
                                op.ne.w = false;

                                rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed

                                if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                                    changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                                    rL.xea.style.transform = "rotate(0deg)";
                                }

                                c_rep(rL.dt, "e", "md"); // set dot to red
                                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t) {
                                    c_rep(rL.n, "wifi_img", "timeout_img"); // change icon to timeout

                                    if (!op.ne.x3) { // execute once
                                        if (op.ne.t4s) {
                                            rL.xc.innerHTML = "timeout";
                                            op.ne.x3 = true;
                                        } else {
                                            rL.xc.innerHTML = "cancelled";
                                            op.ne.x3 = true;
                                        }
                                    }
                                } else {
                                    e_Fd(rL.n, true); // hide
                                    rL.xc.innerHTML = "";
                                }

                                setTimeout(function() {
                                    window.stop(); // stop all network resource(s) fetching
                                    clearInterval(_Ld); // stop loading process
                                    clearInterval(op.ne.L); // clear network check loop

                                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                                    estimateNetworkSpeed_abort.abort();

                                    setCookie("networkReload", null, -1); // delete cookie variable
                                }, op.te);

                            } else {
                                rL.dt.classList.add("aniM-f"); // stop animation on 'load_dot'
                                // rL.n.classList.add("wifi_off_img");
                                if (!op.ne.t2s) {
                                    c_rep(rL.n, ["wifi_slow_img", "wifi_find_img"], "wifi_off_img");
                                } else { // if timeout 2
                                    if (svg.t) {
                                        c_rep(rL.n, "wifi_off_img", "timeout_img");
                                    } else {
                                        rL.n.classList.remove("wifi_off_img");
                                    }
                                }
                                
                                e_Fd(rL.n, false); 

                                rL.dt.classList.add("md");
                                // op.nc = false;
                                console.log("unexp off");
                                op.ne.off = true; // unexpected offline
                                op.ne.s = 0;
                                op.ne.w = false;

                                rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                                if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                                    changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                                    rL.xea.style.transform = "rotate(0deg)";
                                }
                                
                                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.w_o && !op.ne.t2s) { // check if fonts are downloaded
                                    rL.xc.innerHTML = "offline";
                                    e_Fd(rL.x, false); // show message when internet not connected
                                } else if (op.ne.t2s) { // if timeout 2
                                    if (svg.t) {
                                        rL.xc.innerHTML = "timeout";
                                        e_Fd(rL.x, false); // show message when timeout
                                    } else {
                                        rL.xc.innerHTML = "";
                                    }
                                    setTimeout(function() {
                                        window.stop(); // stop all network resource(s) fetching
                                        clearInterval(_Ld); // stop loading process
                                        clearInterval(op.ne.L); // clear network check loop

                                        checkOnlineStatus_abort.abort(); // abort any existing fetching
                                        estimateNetworkSpeed_abort.abort();
                                    }, op.te);
                                }
                            }
                            
                        } else if (rdS(Rd) && !rL.e5 && rL.y && loadS_res(res_ar)) { // show webpage once all processes (requests, etc.) are complete
                            // if (!op.ne.w) {
                            // rL.s = true; // set load status to true
                            // }

                            rL.r_s = true;
                            rL.i_s = false;

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
                                countdownTimerSec((op.Ld.t / 1000), op.ne.t3, null, timeout3); // start timeout 2 timer
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
                    } else {
                        if (!op.ne.x4) { // if cookies disabled
                            countdownTimerSec((op.Ld.t / 1000), op.ne.t0_5, null, timeout0_5); // timeout 0.5
                            rL.s = true; // page loaded
                            op.ne.x4 = true;
                            e_Fd(rL.m, false); // show load-box (either flow)
                        }
                    }
                } else {
                    if (!op.ne.x4) { // if error (visual)
                        countdownTimerSec((op.Ld.t / 1000), op.ne.t0_5, null, timeout0_5); // timeout 0.5
                        rL.s = true; // page loaded
                        op.ne.x4 = true;
                        e_Fd(rL.m, false); // show load-box (either flow)
                    }
                }
            } else {
                document.write("<h1 style='width: auto; font-size: 3rem; font-family: sans-serif; margin: 1em; line-height: 1.3em;'>Close<br>Developer<br>Tools.</h1>");
                rL.s = true; // page loaded
                
                window.stop(); // stop all network resource(s) fetching
                clearInterval(_Ld); // stop loading process
                clearInterval(op.ne.L); // clear network check loop

                checkOnlineStatus_abort.abort(); // abort any existing fetching
                estimateNetworkSpeed_abort.abort();
            }
        break;
    }
}

function load_e() { // end the loading sequence
    if (!devError) {
        var performance = 0;
        op.pSpd = mean(op.pSpda) ? mean(op.pSpda) : 0; // store avg. clock speed
        op.sfr = mean(op.sfra) ? mean(op.sfra) : 0; // "" avg. screen refresh rate
        // check hardwareConcurrency, screen frame rate (fps) readings as well to combine into performance score, use in function

        if (op.sfr && !rL.e6) {
            rL.e6 = true;
            performance = devicePerformance(op.pSpd, op.sfr, op.pCores);
        }
        
        if (rL.e6) {
            if (performance === 0 && !rL.e7) { // device compatibility (speed/rendering) error check (no performance)

                rL.e7 = true;
                errorCheck(); // show error message

            } else if (performance <= 0.5 && !rL.e7) { // low performance

                rL.e7 = true;
                setCookie("lowPerformance", "true", op.c.t); // set cookie to show message

            } else if (op.ne.t3s) { // timeout 3

                setCookie("lowPerformance", null, -1); // delete if good performance

                rL.i_s = true;
                rL.r_s = false;

                op.ne.s = 0;
                rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                    changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                    rL.xea.style.transform = "rotate(0deg)";
                }

                if (svg.t) {
                    c_rep(rL.n, ["wifi_find_img", "wifi_img", "wifi_slow_img", "wifi_off_img"], "timeout_img");
                }
                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t) {
                    rL.xc.innerHTML = "timeout";
                } else {
                    rL.xc.innerHTML = "";
                }

                rL.d.style.animationName = "loadR_end"; // set ending animation detail
                setTimeout(function() {
                    e_Fd(rL.r, true); // hide loading ring

                    setTimeout(function() {
                        rL.r.classList.add("aniM-p"); // stop animation in the rings
                        rL.p.classList.add("aniM-p");
                        rL.c.classList.add("aniM-p");

                        rL.dt.classList.remove("d_n");
                        rL.dt.classList.add("md"); 
                        e_Fd(rL.dt, false); // show load dot (in red)
                        e_Fd(rL.n, false);
                        e_Fd(rL.x, false);
                    }, op.t);
                }, op.te - op.t);

                rL.p.removeEventListener("animationiteration", load_e); // remove listening event from primary loading ring
                setTimeout(function() {
                    window.stop(); // stop all network resource(s) fetching
                    clearInterval(_Ld); // stop loading process
                    clearInterval(op.ne.L); // clear network check loop

                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                    estimateNetworkSpeed_abort.abort();
                }, op.te);

            } else if ((rL.s && !op.ne.w && op.n) || ((vw.mB_L || vw.z_S || op.zoomDefault) && js_load() && isFontAvailable("Poppins") && isFontAvailable("Raleway"))) { // only if status is true (default)

                js_load();

                rL.i_s = false;
                rL.r_s = false;

                rL.d.style.animationName = "loadR_end"; // set ending animation detail
                load_css_e(); // load css styles to 'head' (indiv.)
                setTimeout(function() {
                    if (op.c.e || (op.ne.t0_5s || (!op.c.e && op.Ld.dom <= op.Ld.t))) {
                        rL.el.classList.add("z_O"); // hide in view - timed to coexist with ending (animation) detail
                    }
                    // er_C(); // check for errors

                    setTimeout(function() {
                        if (op.c.e || (op.ne.t0_5s || (!op.c.e && op.Ld.dom <= op.Ld.t)) || eR.s) {
                            rL.el.classList.add("d_n"); // remove loader from display
                        }
                        if (!cacheEnabled || aborted) {
                            rL.r.classList.add("d_n"); // hide rings
                            rL.dt.classList.remove("d_n"); // show dot
                        }

                        rL.r.classList.add("aniM-p"); // stop animation in the rings
                        rL.p.classList.add("aniM-p");
                        rL.c.classList.add("aniM-p");

                        if (op.ne.t0_5s || (!op.c.e && (op.Ld.dom > op.Ld.t)) || (!cacheEnabled || aborted) && !eR.s) { // timeout 0.5 | UPDATE LINE 716 ABOVE!

                            rL.el.classList.remove("d_n"); // show loader
                            rL.el.classList.remove("z_O"); 

                            rL.dt.classList.add("aniM-f"); 
                            rL.dt.classList.add("md"); // load_dot to red
                            e_Fd(rL.dt, false); // show load dot (in red)

                            op.ne.s = 0;
                            rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                            if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                                changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                                rL.xea.style.transform = "rotate(0deg)";
                            }

                            if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t) { // check if fonts are downloaded
                                if (aborted) {
                                    rL.n.classList.add("abort_img");
                                    rL.xc.innerHTML = "aborted";
                                } else if (!cacheEnabled) {
                                    rL.n.classList.add("cache_img");
                                    rL.xc.innerHTML = "caching blocked";
                                } else {
                                    rL.n.classList.add("timeout_img");
                                    rL.xc.innerHTML = "timeout";
                                }
                                // rL.n.classList.add("timeout_img");
                                // rL.xc.innerHTML = "timeout";
                                e_Fd(rL.n, false); // show icon 
                                e_Fd(rL.x, false); // show message 
                            } else if (svg.t) {
                                if (aborted) {
                                    rL.n.classList.add("abort_img");
                                } else if (!cacheEnabled) {
                                    rL.n.classList.add("cache_img");
                                } else {
                                    rL.n.classList.add("timeout_img");
                                }
                                // rL.n.classList.add("timeout_img");
                                e_Fd(rL.n, false); // show icon 
                            }

                            setTimeout(function() {
                                window.stop(); // stop all network resource(s) fetching
                                clearInterval(_Ld); // stop loading process
                                clearInterval(op.ne.L); // clear network check loop

                                checkOnlineStatus_abort.abort(); // abort any existing fetching
                                estimateNetworkSpeed_abort.abort();
                            }, op.te);

                        } else if (eR.h && (eR.h === eR.p)) { // if error is detected

                            if (eR[eR.h].classList.contains("d_n")) {
                                eR.m.classList.remove("d_n");
                                eR[eR.h].classList.remove("d_n");
                            }
                            e_Fd(eR[eR.h], false); // show the error

                            setTimeout(function() {
                                window.stop(); // stop all network resource(s) fetching
                                clearInterval(_Ld); // stop loading process
                                clearInterval(op.ne.L); // clear network check loop

                                checkOnlineStatus_abort.abort(); // abort any existing fetching
                                estimateNetworkSpeed_abort.abort();
                            }, op.te);

                        } else {
                            disp.classList.remove("d_n"); // show the page
                            setTimeout(function() {
                                e_Fd(disp, false);  
                                if (op.c.u) { // if cookie-use accepted
                                    load_eN(); // complete any due tasks (page-specific)
                                    scr_t(true, null); // enable scrolling
                                    op.s = false;
                                } else {
                                    setTimeout(function() {
                                        /*
                                        pg.msg.t.classList.remove("md"); // add tint
                                        e_Sdv(pg.msg.ckA, true); 
                                        */
                                        if (!pg.msg.k && !pg.msg.c && !pg.cond.a && !hm.s && (!getCookie("cookiesAccepted") || getCookie("cookiesAccepted") === "false")) {
                                            msg_toggle(pg.msg.ckA, null, true, true, null); // show cookie-acceptance message
                                        }
                                    }, op.te);
                                }
                                if (getCookie("initialAccess") === "true") {
                                    var u = dev.uH.getBoundingClientRect();
                                    uHeight = Math.round(u.height);
                                }
                            }, 10);
                        }

                        // load_js_eN(); // load js, after page load
                        load_jscss_N(); // load js/css (common), after page load

                        rL.i = true; // page fully loaded
                    }, op.t); // give time for opacity .trs to completely hide element
                }, op.te - op.t);
                rL.p.removeEventListener("animationiteration", load_e); // remove listening event from primary loading ring

            } else if (!op.ne.x4 && (!getCookie("testCookie") || vw.mB_L || vw.z_S || op.zoomDefault)) {

                countdownTimerSec((op.Ld.t / 1000), op.ne.t0_5, null, timeout0_5); // timeout 0.5
                rL.s = true; // page loaded
                op.ne.x4 = true;
                e_Fd(rL.m, false); // show load-box (either flow)
            
            } else if (op.ne.t0_5s) { // timeout

                rL.el.classList.remove("d_n"); // show loader
                rL.el.classList.remove("z_O"); 

                rL.dt.classList.add("aniM-f"); 
                rL.dt.classList.add("md"); // load_dot to red
                e_Fd(rL.dt, false); // show load dot (in red)

                op.ne.s = 0;
                rL.xep.innerHTML = op.ne.s.toFixed(1) + " mbps"; // 0mbps speed
                if (networkTrend(op.ne.b) || !networkTrend(op.ne.b)) {
                    changeSVGColor(op.col.b, rL.xea, false); // default the arrow
                    rL.xea.style.transform = "rotate(0deg)";
                }

                if (isFontAvailable("Poppins") && isFontAvailable("Raleway") && svg.t) { // check if fonts are downloaded
                    rL.n.classList.add("timeout_img");
                    rL.xc.innerHTML = "timeout";
                    e_Fd(rL.n, false); // show icon 
                    e_Fd(rL.x, false); // show message 
                } else if (svg.t) {
                    rL.n.classList.add("timeout_img");
                    e_Fd(rL.n, false); // show icon 
                }

                setTimeout(function() {
                    window.stop(); // stop all network resource(s) fetching
                    clearInterval(_Ld); // stop loading process
                    clearInterval(op.ne.L); // clear network check loop

                    checkOnlineStatus_abort.abort(); // abort any existing fetching
                    estimateNetworkSpeed_abort.abort();
                }, op.te);
            }
        }
    }
}

function load_css() { // load up CSS (common)
    c_css("#load_C", "margin-top: calc((" + cH + "px - 8rem) / 2);", false, null); // align loader to centre of viewport
    c_css(".trs", "transition-duration: " + (op.t / 1000) + "s;", false, null); // transition duration (convert to sec.)
    c_css(".trs_e", "transition-duration: " + (op.te / 1000) + "s;", false, null); // transition duration [ext.] (convert to sec.)
    c_css("#loadR-e", "animation-duration: " + (op.te / 1000) + "s;", false, null); // loading ring (end) animation dur.

    c_css(".m_T.vh", "margin-top: calc(" + (aH * 0.5) + "px)", false, null);
    c_css(".m_T.vhq", "margin-top: calc(" + (aH * 0.25) + "px)", false, null);

    c_css(".p_Bvhq", "padding-bottom: calc(" + (aH * 0.25) + "px)", false, null);
    c_css(".p_Tvhq", "padding-top: calc(" + (aH * 0.25) + "px)", false, null);

    if (vw.mB_L && !vw.z_S && tDevice) { // in landscape view (mobile), but NOT small viewport
        c_css(".err", "margin-top: calc((" + cH + "px - " + (num_Fs(op.f) * (0.9 + 2.52 + 1.65)) + "px) / 2);", false, null); // approx. height of text elements container (centre-align)
        eR[eR.h].children[0].classList.remove("c-y"); // modify styling (remove centre-alignment)
    } 
    
    if (vw.tB) { // if tablet or desktop
        pg.msg.ckA.classList.add("c-x");
        pg.msg.ckA_wrap.classList.remove("m_L-1");

        pg.sc.f.classList.remove("p_Tvhq");
    }

    if (op.b.f) { // if FIREFOX browser
        eR.z_e.h.innerHTML = "<span class='em'>zooming</span> is unpermitted"; // change #error_z information
        eR.z_e.s.innerHTML = "default (original)";
        eR_t.z.innerHTML = "reload";
        eR_t.z.classList.remove("d_n");
    }
}

function load_jscss_N() { // load up JS/CSS (after page load; common)
    var h = getBd(fter.el, "height"),
        hm = getBd(fter.elm, "height"),
        y = op.d.getFullYear(), // get copyright year
        i = 0;

    // c_css("#cond_sc", "height: " + wH + "px;", false, null);

    if ((!vw.pH && !vw.tB) || vw.pH) { // mobile or phablet
        c_css("#footer_sc .w-s", "height: calc(" + h + "px - 6rem);", false, null); // set height of footer design element
    } else if (vw.tB) { // tablet
        c_css("#footer_sc .w-s", "height: calc(" + h + "px - 4rem);", false, null); // set height of footer design element
    }

    if (document.getElementById("pf_scrollbar") && document.getElementById("prefooter_sc")) {
        var hpf = getBd(document.getElementById("prefooter_sc"), "height");
        c_css("#pf_scrollbar", "bottom: calc(" + (hm + hpf) + "px - " + 0 + "px)", false, null);
    }
    fter.y.innerHTML = y;
    while (fter.v[i]) { // add copyright year + site version no.
        fter.v[i].innerHTML = dev.version;
        i++;
    }
}

function load_js() { // [compatibility/variables] load
    dev.sC_a = !tDevice ? [15, 85, 1, 99] : [20, 80, 1, 99]; // split-screen ratio array (mobile/tablet/phablet/touch-device : desktop)
    browserCheck(false); // primary check
    errorCheck(); 
    pos.st = (op.e / 100) * aH; // set scroll-validity threshold

    // op.r = getSiteRes(); // get site resource origin

    // checkOnline();
    // op.n = checkOnlineStatus();
}

function browserCheck(m) { // detect browser (platform)
    if (m) {
        var browser = UMB.getCurrentBrowser(); // get current browser
        op.bInfo.n = browser;
        op.bInfo.cVer = UMB.getCurrentVersion(); // current version
        op.bInfo.cSts = UMB.getStatus(); // update status
        op.bInfo.p = UMB.getBrowserInfo(browser); // info
        switch (browser) {
            case "chrome":
                op.b.c = true;
            break;
            case "edge":
                op.b.e = true;
            break;
            case "firefox":
                op.b.f = true;
            break;
            case "safari":
                op.b.s = true;
            break;
            case "opera":
                op.b.o = true;
            break;
            default: // "ie", etc.
                op.bN = true;
            break;
        }
        switch (op.bInfo.cSts) {
            case "update":
                op.bN = true;
            break;
            case "warning":
                op.bN = true;
            break;
        }
    } else {
        var userAgent = navigator.userAgent;
        
        // REFERENCED FROM DAVID Nguyen: @https://codepen.io/sptnkh/pen/OamEJz
        if (userAgent.match(/FBAN|FBAV/i) || typeof FB_IAB !== 'undefined') { // Facebook in-app browser detected
            op.b.fbApp = true;
        }
        if (userAgent.match(/instagram/i)) { // @ https://codesandbox.io/embed/detect-in-app-browser-s4owq?codemirror=1
            // instagram browser
            op.b.iGApp = true;
        }
        if (userAgent.match(/line/i)) {
            // line browser
            op.b.LnApp = true;
        }
        if (userAgent.match(/chrome|chromium|crios/i)) { // Chrome
            op.b.c = true; 
        } else if (userAgent.match(/firefox|fxios/i)) { // Firefox
            op.b.f = true;
        } else if (userAgent.match(/safari/i) && (op.sys === "iOS" || op.sys === "MacOS")) { // Safari (only in iOS/MacOS systems)
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

    if (!op.bN) {
        for (var x in op.b) { // check for null values
            if (op.b[x]) {
                op.bN = false;
                break;
            } else {
                op.bN = true;
            }
        }
    }
}

function vwP(w, h, r) { // check device[viewport] size/orientation parameters
    var v = {
        z_S : false, // viewport size - small
        z_L : false, //  viewport size - large
        mB_L : false, // mobile - landscape
        pH : false, // phablet - portrait
        tB : false, // tablet - landscape
        dk : false, // desktop (or hybrid desktop) - landscape
    };
    if (w > 3100) { // if width greater than 3100, larger than average (SEE also msc.js Line 1866)
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
        if (h < 240 || w < 440) { // height less than 220, or width less than 440
            v.z_S = true;
            v.mB_L = true;
        } else if (h < 500) { // height less than 500 (mobile)
            v.mB_L = true;
        } else {
            v.tB = true; 
        }
        if ((w >= 1200 && h >= 700) || h >= 800) { // height more than 1200, width more than 700 OR height more than 800
            v.dk = true;
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

    var b = dev.cH.getBoundingClientRect(), // bounding rectangle
        bTop = Math.round(b.top),
        bBottom = Math.round(b.bottom),
        bLeft = Math.round(b.left),
        bRight = Math.round(b.right);

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // get user device registered time zone

    eR.a = ["fC", "tr", "fS", "mt", "ck", "vp", "or", "dp", "ld", "pl", "vL", "vs", "z", "sp"]; // error precedence array, UPDATE WHEN NEEDED!!

    // API stuff

    apiInit = op.d.getTime(); // start API load time (at init)
    ipAPI("/101.191.135.146"); // get user IP information API (ENTER A region IP value for testing, "/" + IP Address)
    clientAPI(); // get user IP information + proxy usage status (no arguments)
    if (ipAPIres.online) { // get USER ROAMING information using coords
        roamingAPI(ipAPIres.lat, ipAPIres.lon);
    }
    timeAPI(); // GET USER time information (from IP Address, alternative to ipAPI)

    // msc. stuff

    op.fS = checkFullScreen();
    op.sp = !(bTop > window.screen.availHeight || bBottom > window.screen.availHeight || bLeft > window.screen.availWidth || bRight > window.screen.availWidth) && ((((bTop / window.screen.availHeight) * 100) > dev.sC_a[0]) || (((bBottom / window.screen.availHeight) * 100) < dev.sC_a[1]) || (((bLeft / window.screen.availWidth) * 100) > dev.sC_a[2]) || (((bRight / window.screen.availWidth) * 100) < dev.sC_a[3]));
    translate_Check = checkTranslation();
    focus_Check = checkFocus();
    tDevice = isTouchSupported();

    if (op.sp || !viewportValid()) { // check if screen/window/tab is split (20:80 ratio max)
        op.spR = true;
        eR.h = "sp";
    } else if (op.zoomDefault && !vw.z_L && !tDevice) { // if viewport zoom not defaulted (100%)
        eR.h = "z";
    } else if (vw.z_S || (vw.mB_L && !tDevice)) { // if viewport size is too small (or incompatible)
        eR.h = "vs";
    } else if (vw.z_L) { // if viewport size is too large
        eR.h = "vL";
    } else if ((op.b.f || op.sys === null || op.bN) && !(vw.mB_L && tDevice)) { // browser/platform no support (firefox OR unknown system OR conflicting client hints [browser])
        if (op.b.f) {
            eR.pl_e.h.innerHTML = "firefox";
        } 
        if (op.bN) { // browser
            eR.pl_e.h.innerHTML = "conflicting hints";
        }
        if (op.sys === null) { // system
            eR.pl_e.h.innerHTML = "unknown system";
        }
        eR.h = "pl";
    } else if (vw.mB_L && tDevice) { // determine if viewport in landscape mode: when height (in landscape) below 500 (assumption that phone average viewport width is below 500)
        eR.ld_e.x = true; // if on first load
        eR.h = "ld";
    } else if ((devicePerformance(op.pSpd, op.sfr, op.pCores) === 0) && !rL.i && rL.e7) { // device compatibility (incompatible speed/rendering)
        eR.h = "dp";
    } else if ((ipAPIres.online && (tz !== ipAPIres.timezone)) || (ipifyAPIres.online && timeAPIres.online && (tz !== timeAPIres.timezone)) || (clientAPIres.online && clientAPIres.isBehindProxy) || (roamingAPIres.online && roamingAPIres.isRoaming)) { // potential vpn usage (when REST-fetched + device time zones don't match)
        
        var address = "";
        eR.h = "vp";
        if (ipAPIres.online) { // check on multiple APIs to get IP address
            address = ipAPIres.ip;
        } else if (ipifyAPIres.online) {
            address = ipifyAPIres.ip;
        } else if (clientAPIres.online) {
            address = clientAPIres.ipString;
        } else if (roamingAPIres.online) {
            address = "not obtainable";
        }

        eR.vp_e.h.classList.add("revert");
        eR.vp_e.h.innerHTML = "ip address: " + address;

    } else if (!op.c.e) { // check if cookies have been disabled (or not detected)
        var j = true;
        eR.h = "ck";
        setInterval(function() {
            if (navigator.cookieEnabled && j) { // check if cookies enabled
                reL(); 
                j = false;
            }
        }, op.Ls);
    } else if (op.mt) { // check if site under maintenance
        eR.h = "mt";
    } else if (op.fS) { // check if fullscreen
        eR.fS_e.x = op.fS; // if on first load
        eR.h = "fS";
    } else if (translate_Check) { // check if translated
        eR.tr_e.x = translate_Check; // first load
        eR.h = "tr";
    } else if (focus_Check && !developer) { // check if focused (and NOT developer mode)
        eR.fC_e.x = focus_Check; 
        er.h = "fC";
    } else if (!eR.e) { // if no errors detected (and block not executed yet)
        eR.e = true;
    }

    if (!eR.s) {
        if (eR.h && (eR.h === "z")) { // other msc. error info to display
            if (op.ne.w || op.b.f) { // if network slow
                eR_t.z.classList.remove("d_n"); // display error small text
            } else {
                if (!eR_t.z.classList.contains("d_n")) {
                    eR_t.z.classList.add("d_n"); // display error small text
                }
            }
        }
        if (eR.h && isFontAvailable("Poppins") && isFontAvailable("Raleway")) {
            eR.s = true;
            eR.p = eR.h;
            rL.y = true;
            eR.m.classList.remove("d_n"); // display the error
            eR[eR.h].classList.remove("d_n");
        } else if (eR.h && !isFontAvailable("Poppins") && !isFontAvailable("Raleway")) {
            eR.s = true;
            eR.p = eR.h;
            _Le = setInterval(function() {
                if (isFontAvailable("Poppins") && isFontAvailable("Raleway")) {
                    errorCheck(); // iterative
                    clearInterval(_Le);
                }
            }, op.Ls);
        }
    }
}

function errorPrecedence(n, p, a) { // check for priority of errors
    if (n !== p) {
        var nD = a.indexOf(n),
            pD = a.indexOf(p);
        if (nD !== pD) {
            if (nD > pD) {
                return true;
            } else if (nD < pD) {
                return false;
            }
        } else {
            return undefined;
        }
    } else {
        return null;
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
    }, (op.te * 2));
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

function timeout0_5() {
    op.ne.t0_5s = true;
}

function timeout0() {
    op.ne.t0s = true;
}

function timeout1() {
    op.ne.t1s = true; 
}

function timeout2() {
    op.ne.t2s = true; // timeout if loading is long (slow network)
}

function timeout3() {
    op.ne.t3s = true; // timeout
}

function timeout4() {
    op.ne.t4s = true;
}


if (getCookie("maxHeight") && (getCookie("maxHeight") < cH || (op.nav.r && getCookie("windowResize") === "true"))) { // if height fluctuates from additional URL bars, etc.
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
    try {
        if (UMB !== undefined) { // check if current platform is up-to-date
            browserCheck(true); // secondary check if online API is available
        }
    } catch (err) {
        // do something
        console.log("UMB not defined");
    }

    op.lang = engLangVar(); // set eng. language variant
    

    _Ld = setInterval(docRead, op.Ls); // run 'load' scripts upon startup

}, op.t);