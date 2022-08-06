
// scroll-based functions

var yP, // live scroll pos. (in y-pos)
    _L,
    ldsc = { // scroll(ed) properties of "lead_sc"
        el : document.getElementById("lead_sc"), // element
        b : 0, // bounding property (TBA)
        g : document.getElementById("ldsc_g"), // element - group
        g1 : document.getElementById("ldsc_g1"), // elements - group items
        g2 : document.getElementById("ldsc_g2"),
        g3 : document.getElementById("ldsc_g3"),
        s_r : 0, // reference point
        bg : 0, // bounding - g3
        s : false
    },
    lcsc = { // scroll(ed) properties of "loc_sc"
        el : document.getElementById("loc_sc"), // element
        t : document.getElementById("loc_sc-info"), // element text info
        w : document.getElementById("wea_sc"), // element - weather info
        x : document.getElementById("txt_sc"), // element - text
        i : document.getElementById("loc_img"), // location image
        g : document.getElementById("grt_sc"), // succeeding text
        c : c_Loc.el.cty, // location city (container)
        a : c_Loc.el.cds, // location coords
        wt : c_Loc.el.wt, // location weather temp.
        wi : c_Loc.el.wi, // weather icon
        b : 0, // bounding property (TBA)
        s : false, // run (execution) status
        bt : 0, // bounding
        st : false, // execution status
        bw : 0, // bounding
        bw_h : 0, // bounding
        sw : false,
        w_r : 0, // reference point
        w_r2 : 0, // 2nd reference point
        w_rp : 0, // target opacity scroll distance (see below)
        ct : null, // location city (target) - TBA
        bC_af : "rgba(255, 255, 255, 0.9)", // background-color: white - almost full opacity
        wtR : 0, // wea_sc translation rate

        // bC_L : "rgba(255, 255, 255, 0.3)" // background-color: white - low opacity
    },
    thwsc = { // scroll(ed) properties of "thw_sc"
        el : document.getElementById("thw_sc"), // element
        e : document.getElementById("thw_e"), // emphasis - h2 header
        h2 : document.getElementsByClassName("thw_h2"), // h2 headers 
        w : document.getElementById("thw_w"), // h2 - 'words'
        n : document.getElementById("thw_n"), // h2 - 'numbers'
        nt : document.getElementById("thw_nt"), // h2 - 'numbers' target
        d1 : document.getElementById("thw_d1"), // e-dt elements
        d2 : document.getElementById("thw_d2"),   
        d_r : 0, // e-dt reference point
        sd : false, // execution status - d_r
        b : 0, // bounding property value
        s : false, // execution status
        bn : 0, // bounding - 'numbers'
        sn : false // execution status - 'numbers'
    },
    stssc = { // scroll(ed) properties of "sts_sc"
        el : document.getElementById("sts_sc"), // element
        b : 0, // bounding
        s : false, // execution status
        m : 3, // no. of stats numerals
        m1 : {
            a : 0, // initial
            n : 21, // final count - no. of locations (defined as a specific area/region/neighbourhood that can be considered independant of any other)
            e : document.getElementById("sts_1"), // element (to target 'innerHTML')
            _L : undefined // spaces for _L (loop) iterations
        },
        m2 : {
            a : 0,
            n : 97, // total km travelled (approx.)
            e : document.getElementById("sts_2"),
            _L : undefined
        },
        m3 : {
            a : 0,
            n : 183, // no. of hours committted
            e : document.getElementById("sts_3"),
            _L : undefined
        }
    },
    hdcnt = { // scroll(ed) properties of "hd_cnt"
        el : document.getElementById("hd_cnt"), // element
        g : document.getElementById("grt_sc"), // element - text
        // we : document.getElementById("wea_sc"), // element - weather info
        // wb : 0, // bounding property - weather (TBA)
        // wt : c_Loc.el.wt, // obtain current weather temp.
        // wi : c_Loc.el.wi, // "" icon
        b : 0, // bounding property (TBA)
        s : false, // run (execution) status
        bg : 0, // bounding - element, text
        // sw : false // run status - weather element
    };


function scr_peek() { // peek down the page when clicked upon
    if (rL.i) {
        var t = wH * 0.5;
        window.scrollTo(0, t);
    }
}

function sL() { // scroll loop - main
    yP = window.scrollY; // scroll position of webpage, y-relative

    ldsc.b = getBd(ldsc.el, "top"); // return 'top' bound of "lead_sc" - relative to top of viewport
    lcsc.b = getBd(lcsc.el, "top"); // "" "loc_sc"
    thwsc.b = getBd(thwsc.e, "top"); // "" "thw_e"
    thwsc.bn = getBd(thwsc.n, "top"); // "" "thw_n"
    stssc.b = getBd(stssc.el, "top"); // "" "sts_sc"
    hdcnt.b = getBd(hdcnt.el, "top"); // "" "hd_cnt"
    if (rL.i && vw.tB) { // if in tablet/desktop view
        ldsc.bg = getBd(ldsc.g3, "top"); // "" "ldsc_g3"
        hdcnt.bg = getBd(hdcnt.g, "bottom"); // "" "grt_sc"
    }

    // hdcnt.wb = getBd(hdcnt.we, "top"); // "" "wea_sc"

    /*
    if (rL.i && vw.tB) { // if in tablet/desktop view
        lcsc.bt = getBd(lcsc.t, "top"); // "" "loc_sc-info"
    }*/


    // scroll-based effect, scroll arrow - #intro_sc
    if (ldsc.b < (wH * 0.99)) { // if element in view of the user (viewport)
        insc.s.removeEventListener("click", scr_peek); // remove click
        insc.s.style.opacity = 0; // fade-out
    } else { // disable button 
        insc.s.style.opacity = 1;
        insc.s.addEventListener("click", scr_peek);
    }
    
    // location effects - #loc_sc
    if (rL.i) {
        
        // #intro_sc
        // insc.i.style.transform = "translateY(" + (yP * 0.1) + "px)"; // parallax scroll

        if (!vw.tB) { // (blocks inside '!vw.tB' only execute in mobile/phablet versions)
            if ((chkVL(lcsc.b, true) && !lcsc.s && (lcsc.b < (wH * sV_a))) || (lcsc.s && (lcsc.b < (wH * sV_a)))) { // if element within (viewport visible area, AND positive bounding value, AND code block have not been executued) OR (within viewport visible area, AND code block executed) 
                if (!lcsc.s) {  // if code executed status is false?
                    lcsc.w_r = yP; // set reference point for '#wea_sc' parallax scroll
                    s_Loc(); // run code - fade-in city name and coords
                    lcsc.s = true; // code block executed (only once)
                } else if (lcsc.b < 0) {  // if element reaches at top of viewport
                    var t,
                        f;
                    if (!lcsc.sw) {
                        lcsc.w_r2 = yP; // obtain reference point
                        lcsc.bw = getBd(lcsc.w, "bottom"); // bottom of "wea_sc" relative to viewport
                        lcsc.bw_h = getBd(lcsc.wt, "height"); // height of "loc_weather_temp"
                        lcsc.w_rp = (wH - (lcsc.bw - lcsc.bw_h)) * 2; // obtain [scroll] distance required for opacity fade-out (viewport height - (bottom value - height value))
                        lcsc.sw = true; // one execution only
                    }
                    t = lcsc.w_r2 + lcsc.w_rp; // target: ref. point (taken at initial) + req. distance
                    f = (t - yP) * (1 / lcsc.w_rp); // Set opacity of image - relative to scroll pos. and target ref. point
                    if (f < 0) {
                        c_rep(lcsc.g, "c_t", "c_d"); // set font color to white contrast (in following section)
                        lcsc.i.style.opacity = 0; // "loc_img"

                        lcsc.wi.style.opacity = 0; 
                        lcsc.wt.style.opacity = 0;
                    } else {
                        lcsc.i.style.opacity = f; // [gradual, scroll-based] reduction in opacity

                        lcsc.wi.style.opacity = f; // apply to weather icon/temp
                        lcsc.wt.style.opacity = f;
                    }
                } else {
                    lcsc.i.style.opacity = 1; // full opacity when not in view (scroll pos. above)
                    if (lcsc.sw) { // execute only if section has been scrolled
                        lcsc.wi.style.opacity = 1; 
                        lcsc.wt.style.opacity = 1;
                    }
                }
                
                /*else if (hdcnt.wb > 0) { // when element is out of view 
                    lcsc.el.style.backgroundColor = lcsc.bC_L;  // apply low opacity if code executed (= section has been scrolled by user previously)
                    hdcnt.el.style.backgroundColor = bC_t; // "" 'hd_cnt'
                    crcnt.g.style.color = bC_t; // blend-in with background

                    if (hdcnt.sw) { // if element has been scrolled upon
                        e_Fd(hdcnt.wi, false); // show (fade-out) weather icon
                    }
                } else if (!hdcnt.sw && (hdcnt.wb < 0) || hdcnt.sw) { // if element within visible viewport area
                    // hdcnt.el.style.backgroundColor = bC_d; // "" 'hd_cnt'
                    // lcsc.el.style.backgroundColor = bC_d;
                    crcnt.g.style.color = bC_L; // contrast with background - hence, reveal to user

                    e_Fd(hdcnt.wi, true); // hide (fade-out) weather icon
                    hdcnt.sw = true; // set true to code-ex status
                } */
                lcsc.w.style.transform = "translateY(" + ((yP - lcsc.w_r) * lcsc.wtR) + "px)"; // parallax scroll 'wea_sc'
                lcsc.i.style.transform = "translateY(" + (yP * -0.1) + "px)";  // parallax scroll loc_img
            } else if (lcsc.b > wH) { // if user scrolls up above section 

                // lcsc.el.style.backgroundColor = bC_L; // add full opacity - ensure image is not visible in other sections of page
            }
        } else {

            // scroll-based effect - #lead_sc 
            if (ldsc.bg < wH) { // inside viewport
                if (!ldsc.s) {
                    ldsc.s_r = yP; // set reference point - only oncce
                    ldsc.s = true;
                } else {
                    ldsc.g1.style.transform = "translateY(" + ((yP - ldsc.s_r) * 0.15) + "px)"; // translate elements in exp. visual fashion
                    ldsc.g2.style.transform = "translateY(" + ((yP - ldsc.s_r) * 0.3) + "px)";
                    ldsc.g3.style.transform = "translateY(" + ((yP - ldsc.s_r) * 0.5) + "px)";
                }

                // (yP - lcsc.w_r) * 0.6) + "px
            }

            // scroll-based effect - #hd_cnt
            if (hdcnt.bg < (wH * (sV_a / 1.5))) {
                c_rep(hdcnt.el, "c_d", "c_w");
                hdcnt.el.classList.add("bC_d");
            } else {
                c_rep(hdcnt.el, "c_w", "c_d");
                hdcnt.el.classList.remove("bC_d");
            }

        }
    }

    // scroll-based effect - #wea_sc 
    /*
    if (chkVL(lcsc.bw) && (lcsc.bw < (wH * (1 - sV_a))) && !lcsc.sw) {
        lcsc.w.classList.add("trs"); 
        e_Fd(lcsc.w, true); // fade-out element
        lcsc.el.style.backgroundColor = bC_d; // change to dark contrast - background
        lcsc.x.style.color = bC_L;
        lcsc.sw = true;
    }*/
    /*
    // scroll-based effect - #loc_sc-info (only applicable to tablet/desktop viewports)
    if (chkVL(lcsc.bt) && (lcsc.bt < (wH * sV_a)) && !lcsc.st && vw.tB) {
       
        // e_Fd(lcsc.t, false); // fade-in image element
        setTimeout(function() {
            e_Fd(lcsc.a, false); // fade-in coords
            c_Loc.c(); // perform an 'incrementing' effect on coords
        }, trD_a);
        lcsc.st = true; // code executed
    }*/

    // scroll-based effect - "hd_cnt"
    /*
    if (chkVL(hdcnt.b) && !hdcnt.s && (hdcnt.b < (wH * 1.5))) {
        // hdcnt.el.style.transform = "translateY(" + (yP * -0.05) + "px)";
    }*/

    // scroll-based effects - #hd_cnt
    /*
    if (chkVL(hdcnt.b) && !hdcnt.s && (hdcnt.b < (wH * sV_a))) { // if element within viewport visible area
        var t_span = document.getElementsByClassName(c_Loc.L), // retrieve all span elements within temp. reading
            i = 0; // start from index=0
        hdcnt.s = true; // code block executed 
        e_Tp(t_span, i); // start 'typing' effect
        setTimeout(function() {
            hdcnt.wi.classList.remove("z_O"); // show weather icon
            hdcnt.s = true; // code block executed 
        }, trD_a);
    } */

    // parallax effects - #hd_cnt
    /*
    if (rL.i && !vw.tB) {
        // hdcnt.el.style.transform = "translateY(" + (yP * -0.65) + "px)"; // wea_sc shows up to user just as loc_city name is revealed
        hdcnt.el.style.transform = "translateY(" + (yP * -0.4) + "px)"; // wea_sc shows up to user just as loc_city name is revealed
        // crcnt.el.style.transform = "translateY(" + (yP * 0.3) + "px)";  // parallax effects - #cr_cnt
        crcnt.el.style.transform = "translateY(" + (yP * -0.3) + "px)";  // parallax effects - #cr_cnt
    } else {
        crcnt.el.style.transform = "translateY(" + (yP * -0.45) + "px)";  // change of translation rate/direction
    }*/

    /*
    if (chkVL(hdcnt.b) && (hdcnt.b < (wH * 0.5))) {
        // hdcnt.el.classList.add("bC_d");
        // c_rep(hdcnt.g, "c_t", "c_w");
    }
    // scroll-based effect - #grt_sc
    if (chkVL(ldsc.bg) && (ldsc.bg < (wH * (sV_a / 1.5)))) {
        // c_rep(ldsc.g1, "bC_d", "bC_t");
        // c_rep(ldsc.g2, "bC_d", "bC_t");
        // hdcnt.el.classList.add("bC_d");
        // c_rep(hdcnt.g, "c_t", "c_d");
    }*/
    
    // scroll-based effects - #thw_sc
    if (chkVL(thwsc.b, true) && !thwsc.s && (thwsc.b < (wH * sV_a))) { // if detected within viewport threshold
        var _L = thwsc.h2.length - 1,
            i = 0,
            d;
        e_Fd(thwsc.e, false); // reveal element (fade-in) - emphasis h2
        e_Fd(thwsc.h2[i], false); // reveal normal h2
        i++;
        d = setInterval(function() {
            e_Fd(thwsc.h2[i], false); // reveal (fade-out) other h2 elements through interval looping
            if (i < _L) {
                i++;
            } else {
                clearInterval(d);
                setTimeout(function() {
                    e_Fd(thwsc.w, false);
                }, trD);
            }
        }, trD);
    }

    if (chkVL(thwsc.bn, false)) {
        if (thwsc.bn < wH) {
            if (!thwsc.sd) {
                thwsc.d_r = yP; // note reference point
                thwsc.sd = true; // execute once
            }
            thwsc.d1.style.transform = "translateY(" + ((yP - thwsc.d_r) * 0.3) + "px)"; // translate e-dots
            thwsc.d2.style.transform = "translateY(" + ((yP - thwsc.d_r) * 0.6) + "px)";
            if (!thwsc.sn && (thwsc.bn < (wH * sV_a))) { // within 80% viewport
                e_Sd(thwsc.n, thwsc.nt, 90, 0, null, null); // perform 'slide-in/out' effect on 'numbers' h2
                thwsc.sn = true; // perform block once only
            } else if (thwsc.bn < (wH * (1 - sV_a))) { 
                hdcnt.el.classList.add("bC_d"); // change background color as 'numbers' h2 hides in view (20% of viewport)
            } else {
                hdcnt.el.classList.remove("bC_d");
            }
        } 
    }

    // scroll-based/parallax effects - "sts_sc"
    stssc.el.style.transform = "translateY(" + (yP * 0.1) + "px)"; // y-translate slower than scroll
    if (chkVL(stssc.b, true) && stssc.b < wH && !stssc.s) { // execute once
        var r = "m0"; // reference 'coded' var (initial)
        for (i = 1; i <= stssc.m; i++) {
            r = s_Rep(r, 1, i); // replace numeral in reference code, sync with stats no.
            e_Ic(stssc[r], null, i_Sp(stssc[r].n)); // perform incrementing effect (on each stat)
        }
        stssc.s = true;
    }
}

function s_Loc() { // location/weather reveal - triggered by user scroll
    var t_span = document.getElementsByClassName(c_Loc.L), // retrieve all span elements within weather temp. reading
        i = 0; // start from index=0
    e_Sd(lcsc.c, lcsc.ct, 90, 0, "c_d", "c_t"); // slide-in/slide-out reveal city name
    lcsc.i.style.backgroundImage = "linear-gradient(" + lcsc.bC_af + ", " + lcsc.bC_af + "), url('ext/jpg/location_portrait.jpg')"; // add white tint to image
    lcsc.el.style.backgroundColor = bC_t; // make section translucent to reveal image
    setTimeout(function() {
        e_Fd(lcsc.a, false); // fade-in coords
        e_Fd(lcsc.wi, false); // fade-in weather icon
        e_Tp(t_span, i); // start 'typing' effect
        c_Loc.c(); // perform an 'incrementing' effect on coords
    }, trD_a);
}


_L = setInterval(sL, 1000/60); // run function as loop code at 60rec/s