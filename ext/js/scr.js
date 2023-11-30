
// scroll-based loops/functions (local)

var im = { // #intro_main
        nav : document.getElementsByClassName("navbarlinks"), 
        Li : document.getElementById("localInfo"),
        wd : document.getElementById("wordsTyper"),
        gh : document.getElementById("logo-h"),
        pfg : document.getElementById("profile_greetingFull"),
        pfi : document.getElementById("profile_image"),
        el : document.getElementById("intro_main"),
        elw : document.getElementById("intro_ws"),
        b5 : document.getElementById("bg-cir5"),
        L : document.getElementById("lead_sc"),
        Lp : document.getElementById("lead_point"),
        Lph : document.getElementById("lead_point_0-5"),
        Lpf : document.getElementById("lead_point_1"),
        Lps : document.getElementById("lead_point_2"),
        Lp1 : document.getElementById("pLa-1"),
        Lp2 : document.getElementById("pLa-2"),
        Lp3 : document.getElementById("pLa-3"),
        Lp4 : document.getElementById("pLa-4"),
        // dotsIn : [],
        s2 : false,
        s3 : false,
        s4 : false,
        s5 : false,
        s6 : null,
        s7 : false,
        s8 : false,
        s9 : false,
        p : 0,
        sM : 0.25 // scroll mod.
        // s : true, // code execution status
    },
    ld = { // #lead_sc
        csm : document.getElementById("c_Info-m"),
        cs : document.getElementsByClassName("c_Info_s"),
        csa : document.getElementsByClassName("c_Info_a"),
        qIn : document.querySelector(".q_Info"),
        q1 : document.getElementById("qIn1"),
        q3 : document.getElementById("qIn3"),
        q7 : document.getElementById("qIn7"),
        q9 : document.getElementById("qIn9"),
        q11 : document.getElementById("qIn11"),
        qis : document.getElementsByClassName("q_Info_scr"),
        eduI : document.getElementById("educationIcon"),
        lcF : document.getElementById("locationInfo"),
        cFc : document.getElementById("coffeeCups"),
        dis : document.getElementById("distanceInfo"),
        hrs : document.getElementById("hoursInfo"),
        pb : document.getElementById("profile_btn"),
        m : document.getElementById("mid_sc"),
        Lpm : document.getElementById("lead_point_3"),
        Lp4 : document.getElementById("lead_point_4"),
        pbn : document.getElementById("phablet_banner"),
        pds : document.getElementsByClassName("pscroll"),
        rf : aH * op.svA[1],
        rfe : aH * op.svA[0],
        rfd : 0,
        rf2 : 0,
        rf3 : 0,
        rf4 : 0,
        rf5 : 0,
        rf6 : 0,
        x : false,
        x2 : false,
        x3 : false,
        x4 : false,
        x5 : false,
        x6 : false,
        x7 : false,
        x8 : false,
        x9 : false,
        x10 : false,
        x11 : false,
        x12 : false,
        L : null
    },
    pf = { // #prefooter_sc
        el : document.getElementById("prefooter_sc"),
        wc : document.getElementById("wordcloud_sc"),
        dw : document.getElementById("mid_tablet_sc"),
        w : document.getElementById("pf_wow"),
        w1 : document.getElementById("wow_head1"),
        w2 : document.getElementById("wow_head2"),
        w3 : document.getElementById("wow_head3"),
        sc : document.getElementById("scroll_banner"),
        ds : document.getElementById("design_banner"),
        xds : document.getElementsByClassName("xscroll"),
        sb : document.getElementById("pf_scrollbar"),
        rsc : document.getElementById("random_sc"), 
        rb : document.getElementById("random_box"),
        rbc : document.querySelectorAll(".random_boxCircle"),
        rbc_t1 : document.getElementById("rbc_t1"),
        ld_tr : document.querySelectorAll("#landscape_parallax .img.mini"),
        ld_tra : [],
        ld_p : document.querySelector("#landscape_parallax .plane_img"),
        ld_pL : null,
        x : false,
        x2 : false,
        x3 : false,
        x4 : false,
        x5 : false,
        x6 : false,
        x7 : false,
        x8 : false,
        x9 : false,
        x10 : false,
        x11 : false,
        x12 : false,
        x12a : false,
        x13 : false,
        x14 : false,
        x15 : false,
        x15a : false,
        rf : 0,
        rf2 : 0,
        rf3 : 0,
        rf4 : 0,
        rf5 : 0,
        rf6 : 0,
        rf7 : 0,
        rf8 : 0,
        rf9 : 0,
        rf9a : 0,
        rf10 : 0,
        rf10a : 0,
        rf11 : 0,
        rf12 : 0,
        rf13 : 0,
        rf14 : 0,
        rf15 : 0,
        rf16 : 0,
        rf17 : 0,
        rf17a : 0,
        rf17b : 0,
        rf18 : 0,
        rf19 : 0,
        rf20 : 0,
        rf21 : 0
    },
    sI_1 = { // stats numerals
        a : 0, // initial   
        // n : (op.lang === "gb") ? 97 : kmToMiles(97), // km : miles
        n : 97,
        e : (!vw.dk) ? document.getElementById("sIn1") : document.getElementById("qIn9"), // element
        _L : undefined, // spaces for _L (loop) iterations
        s : false // run (execution) status
    },
    sI_2 = {
        a : 0,
        n : 183, // hours
        e : (!vw.dk) ? document.getElementById("sIn2") : document.getElementById("qIn11"), 
        _L : undefined,
        s : false
    },
    sI_3 = {
        a : 0,
        n : 245, // cappuccinos
        e : (!vw.dk) ? document.getElementById("sIn3") : document.getElementById("qIn7"),
        _L : undefined,
        s : false
    };
    /*
    wC_spd = -7, // wordcloud transformation speed
    wC_hold = { // wordcloud holder/index
        s1 : [],
        s2 : [],
        s3 : [],
        s4 : []
    },
    wC_a = "";*/


function sc_L() { // functions (live on scroll)
    var d = (pos.yA !== 0) ? Math.abs(pos.y - pos.yA) : 0, // obtain distance of scroll
        b = { // element bounds
            e : im.elw.getBoundingClientRect(), // #intro_ws
            q1 : ld.q1.getBoundingClientRect(), // #q1 heading
            L : im.L.getBoundingClientRect(), // #lead_sc
            Lp : im.Lp.getBoundingClientRect(), // #lead_point
            Lpf : im.Lpf.getBoundingClientRect(), // #lead_point_1
            Lps : im.Lps.getBoundingClientRect(), // #lead_point_2
            Lpm : ld.Lpm.getBoundingClientRect(), // #lead_point_3
            pb : ld.pb.getBoundingClientRect(), // #profile_btn
            pL3 : im.Lp3.getBoundingClientRect(), // parallax arrow 3
            pL4 : im.Lp4.getBoundingClientRect(), // parallax arrow 4 (hidden)
            md : ld.m.getBoundingClientRect(), // mid_sc
            pf : pf.el.getBoundingClientRect(), // prefooter_sc el.
            pfw : pf.w.getBoundingClientRect(), // prefooter_sc 'wow'
            pfs : pf.sb.getBoundingClientRect(), // prefooter_sc scrollbar
            pfw1 : pf.w1.getBoundingClientRect(), // w1
            pfw2 : pf.w2.getBoundingClientRect(), // w2
            pfw3 : pf.w3.getBoundingClientRect(), // w3
            pfsc : pf.sc.getBoundingClientRect(), // scroll_banner
            pfds : pf.ds.getBoundingClientRect(), // design_banner
            fm : document.getElementById("footer_main_sc").getBoundingClientRect(), // footer_main_sc
            fb : document.getElementById("footer_blurb").getBoundingClientRect() // footer_blurb
        };
    for (i = 0; i <= ld.cs.length - 1; i++) {
        b["csI" + (i + 1)] = ld.cs[i].getBoundingClientRect(); // c_info h5 bounds
    }
    for (j = 0; j <= pf.xds.length - 1; j++) {
        b["pfxds" + (j + 1)] = pf.xds[j].getBoundingClientRect(); // design xscroll circles bounds
    }

    if (pos.aT) {
        im.L.style.transform = "translateY(0px)"; // #lead_sc
        im.Lp1.style.transform = "translateY(" + (pos.y * 0.45) + "px) rotate(90deg)"; // parallax arrow 1
        im.Lp2.style.transform = "translateY(" + (pos.y * 0.8) + "px) rotate(90deg)"; // parallax arrow 2
        e_Fd(im.Lp1, true);
        e_Fd(im.Lp2, true); // hide arrows
        im.s4 = false;
        im.s6 = false;
        im.s9 = false;
    } else if (!pos.aT && !im.s9) { // show arrows
        im.s9 = true;
        e_Fd(im.Lp1, false);
        e_Fd(im.Lp2, false); 
    }

    im.L.style.transform = "translateY(" + (pos.y * (-1 * im.sM)) + "px)"; // #lead_sc
    im.b5.style.transform = "translateY(" + (pos.y * -0.75) + "px)"; // bg-circle 5

    if (b.Lp.top < 0 && !im.s7) { // #lead_point
        im.s7 = true;
        e_Fd(im.Lp1, true); // hide arrow 1
    } else if (b.Lp.top > 0 && im.s7) {
        im.s7 = false;
        e_Fd(im.Lp1, false); // show arrow 1
    }

    if (b.Lps.top < 0 && !im.s8) { // #lead_point_2
        im.s8 = true;
        e_Fd(im.Lp2, true); // hide arrow 2
    } else if (b.Lps.top > 0 && im.s8) {
        im.s8 = false;
        e_Fd(im.Lp2, false); // show arrow 2
    }

    if ((pos.r && !im.s5) || (!pos.r && im.s4) || (pos.r && im.s5)) { // downward scroll (plus, msc. conditions)

        if (!im.s5 || !pos.aTs) {

            if (b.e.top < aH) {

                im.Lp1.style.transform = "translateY(" + (pos.y * 0.45) + "px) rotate(90deg)"; // parallax arrow 1
                im.Lp2.style.transform = "translateY(" + (pos.y * 0.8) + "px) rotate(90deg)"; // parallax arrow 2
                im.s6 = false;
            }

            if (b.L.bottom < aH) {
                var r = aH - b.L.bottom;
                im.Lp3.style.transform = "translateX(" + ((r / 2) * 0.5) + "px) translateY(" + (r * -0.4) + "px)"; // parallax arrow 3
                im.Lp4.style.transform = "translateY(" + (r * -0.4) + "px)"; // parallax arrow 4 (hidden)
            } else {
                im.Lp3.style.transform = "translateX(-2rem)"; // parallax arrow 3
            }
        } else {
            if (pos.r && !im.s4) {
                im.p = op.d.getTime(); // get time of change
                im.s4 = true;
                setTimeout(function() {
                    im.s4 = false;
                }, op.t);
            } else if (pos.r && im.s4) {
                if ((op.d.getTime() - im.p) > op.t) {
                    im.s5 = false; // confirmed
                    im.s4 = false;
                }
            }
        }
    }  
    
    if ((!pos.r || (pos.r && im.s4)) && !pos.aT) { // upward scroll

        if (im.s5 && !pos.aTs) { // /*(!pos.aTs || !pos.aT */ ) {
            if (b.e.top < aH) {
                im.Lp1.style.transform = "translateY(" + (pos.y * 0.45) + "px) rotate(-90deg)"; // parallax arrow 1
                im.Lp2.style.transform = "translateY(" + (pos.y * 0.8) + "px) rotate(-90deg)"; // parallax arrow 2
                im.s6 = true; 
            }

            if (b.L.bottom < aH) {
                var r = aH - b.L.bottom;
                im.Lp3.style.transform = "translateX(" + ((r / 2) * 0.5) + "px) translateY(" + (r * -0.4) + "px) rotate(180deg)"; // parallax arrow 3
                im.Lp4.style.transform = "translateY(" + (r * -0.4) + "px)"; // parallax arrow 4 (hidden)
            } else {
                im.Lp3.style.transform = "translateX(-2rem) rotate(180deg)"; // parallax arrow 3
            }
        } else {
            if (!pos.r && !im.s4) {
                im.p = op.d.getTime(); // get time of change
                im.s4 = true;
                setTimeout(function() {
                    im.s4 = false;
                }, op.t);
            } else if (!pos.r && im.s4) {
                if ((op.d.getTime() - im.p) > op.t) {
                    im.s5 = true; // confirmed
                    im.s4 = false;
                }
            }
        }
    } else if (pos.aT && im.s5) {
        im.s5 = false;
        im.s4 = false;
    }

    if (b.pL3.bottom < (0 - b.pL3.height)) { // parallax arrow 3
        im.s2 = true;
        c_rep(im.Lp3, "d_i", "d_n");
    } else if (b.pL4.bottom > (0 - b.pL4.height) && im.s2) {
        im.s2 = false;
        c_rep(im.Lp3, "d_n", "d_i");
    }

    if (b.Lpf.top <= ld.rf) { // c_Info header
        ld.x2 = true;
        if (!ld.x && rL.i) {
            ld.x = true;
            ld.rfd = pos.y;
        }
        var m = (pos.y - ld.rfd) * (im.sM / (ld.rf - (ld.rfe * (1 - im.sM)))), // modifier
            t = (-1 * (((pos.y * (1 + m)) - ld.rfd) * ((op.fN * 3.5) / (ld.rf - ld.rfe)))),
            p = 1 - ((t) / (op.fN * -3.5));
        if (t >= op.fN * -3.5) {
            im.Lpf.style.transform = "translateY(" + t + "px)";
            im.Lph.style.opacity = p;
        } else if (t < op.fN * -3.5) {
            im.Lpf.style.transform = "translateY(" + (op.fN * -3.5) + "px)";
            im.Lph.style.opacity = "0";
        }
    } else if (ld.x2) {
        ld.x2 = false;
        im.Lpf.style.transform = "translateY(0px)";
        im.Lph.style.opacity = "1";
    }

    ld.cs[0].style.transform = "translateY(" + (pos.y * -0.1) + "px)"; // c_Info 1
    ld.cs[1].style.transform = "translateY(" + (pos.y * -0.15) + "px)"; // c_Info 2
    ld.cs[2].style.transform = "translateY(" + (pos.y * -0.2) + "px)"; // c_Info 3
    ld.cs[3].style.transform = "translateY(" + (pos.y * -0.25) + "px)"; // c_Info 4
    ld.cs[4].style.transform = "translateY(" + (pos.y * -0.3) + "px)"; // c_Info 5

    for (j = 0; j <= ld.cs.length - 1; j++) { // c_Info h5
        if (ld.cs[j - 1]) {
            if (b["csI" + (j + 1)].top < b["csI" + (j)].bottom) { // if 2 h5 elements intersect
                ld.x3 = true;
                break;
            } else {
                ld.x3 = false;
            }
        }
    }

    if (ld.x3 && b.Lpm.top < (aH * 0.5)) { // hide c_Info
        ld.csm.classList.add("o-img");

        ld.csa[0].setAttribute("onclick", "event.preventDefault()"); // 'photos'
        ld.csa[0].removeAttribute("href");
        // ld.csa[0].classList.add("u-d");

        ld.csa[1].setAttribute("onclick", "event.preventDefault()"); // 'projects'
        ld.csa[1].removeAttribute("href");
        // ld.csa[1].classList.add("u-d");

    } else { // show
        ld.csm.classList.remove("o-img");

        ld.csa[0].setAttribute("onclick", "location.href='https://ivansojivarghese.github.io/clicks'");
        ld.csa[0].setAttribute("href", "javascript:void(0)");
        // ld.csa[0].classList.remove("u-d");

        ld.csa[1].setAttribute("onclick", "location.href='https://ivansojivarghese.github.io/code'");
        ld.csa[1].setAttribute("href", "javascript:void(0)");
        // ld.csa[1].classList.remove("u-d");
    }

    // q_info

    if (b.q1.top && b.q1.top < aH && ld.x4) { // heading 1
        ld.x4 = false;
        ld.L = setInterval(function() {
            e_wCycle(qInfo[0], dev.info.work, ld.L);
        }, op.t);
    }

    // prefooter_sc
    
    if (b.pfw.top && b.pfw.top < aH) {
        if (!pf.x7) {
            pf.rf6 = pos.y;
            pf.x7 = true;
        }

        pf.w1.style.transform = "translateY(" + ((pos.y - pf.rf6) * -1.5) + "px)"; // 'wow' header, w
        // pf.w2.style.transform = "translateY(" + ((pos.y - pf.rf6) * -2) + "px)"; // o
        pf.w3.style.transform = "translateY(" + ((pos.y - pf.rf6) * -0.75) + "px)"; // w
    }

    // scroll

    if (b.pfsc.top && (b.pfsc.top < aH) && !pf.x) {
        pf.x = true;
        pf.sc.classList.add("inview");
    }

    // design 

    if (b.pfds.top && b.pfds.top < aH) {
        if (!pf.x2) {
            pf.x2 = true;
            pf.rf = pos.y;
        }
        pf.xds[0].style.transform = "translateX(" + ((pos.y - pf.rf) * 0.2) + "px)";
        pf.xds[1].style.transform = "translateX(" + ((pos.y - pf.rf) * 0.4) + "px)";
        pf.xds[2].style.transform = "translateX(" + ((pos.y - pf.rf) * 0.1) + "px)";

    } else if (b.pfds.top && b.pfds.top > aH && pf.x2) {
        pf.xds[0].style.transform = "translateX(-3rem)";
        pf.xds[1].style.transform = "translateX(-2rem)";
        pf.xds[2].style.transform = "translateX(-4rem)";
    }

    // live section scrollbar

    if (b.pf.top && b.pf.top < aH && !pf.x5) {
        if (!pf.x3) {
            pf.x3 = true;
            pf.rf2 = b.pf.height;
            pf.rf3 = pos.y;
        }
        
        var h = (((pos.y - pf.rf3) / pf.rf2) * aH);
        if (!pf.x4) {
            pf.sb.style.bottom = "calc(" + (b.fm.height + b.pf.height) + "px - " + (aH - b.pf.top) + "px + " + h + "px)";
        }
        pf.sb.style.height = h + "px";
    } 

    if (b.pfs.top && (b.pfs.top < 0 || pf.x4) && !pf.x5) {
        if (!pf.x4) {
            pf.x4 = true;
            pf.rf4 = pos.y;
            pf.rf5 = b.pfds.bottom;
        }

        var t = ((pos.y - pf.rf4) / (pf.rf5 - aH));
        pf.sb.style.bottom = "calc(" + (b.fm.height + b.pf.height) + "px - " + (aH - b.pf.top) + "px + " + h + "px - " + (aH * t) + "px)";

    }

    if (b.pfs.bottom < b.md.bottom && !pf.x6) {
        pf.x6 = true;
        e_Fd(pf.sb, true);
    } else if (b.pfs.bottom > b.md.bottom && pf.x6) {
        pf.x6 = false;
        e_Fd(pf.sb, false);
    }

    // footer blurb

    if (b.fb.top && b.fb.top < aH) {
        e_Fd(pf.sb, true);
        pf.x5 = true;
    } else if (b.fb.top && b.fb.top > aH && pf.x5) {
        e_Fd(pf.sb, false);
        pf.x5 = false;
    }

    ///////////////////////////////////////////////////

    if (d > pos.st) { // check if scroll distance is valid (of a true scroll - prevents unwanted scrolling)
        if (getCookie("statsIncr") !== "true") { // check if cookie exists
            var b1 = getBd(sI_1.e, "top"), // get respective 'top' boundaries for each stat
                b2 = getBd(sI_2.e, "top"),
                b3 = getBd(sI_3.e, "top");

            if (chkVL(b1) && (b1 < wH) && !sI_1.s) { // stats 1 (if within viewport visual)
                e_Ic(sI_1, null, sI_1.n);
                sI_1.s = true; // only execute each block once
            }
            if (chkVL(b2) && (b2 < wH) && !sI_2.s) { // stats 2
                e_Ic(sI_2, null, sI_2.n);
                sI_2.s = true;
            }
            if (chkVL(b3) && (b3 < wH) && !sI_3.s) { // stats 3
                e_Ic(sI_3, null, sI_3.n);
                sI_3.s = true;
                setCookie("statsIncr", "true", op.c.t); // create cookie to detemine if stats have been incremented by user (on initial usage)
            }
        } else {
            if (!sI_1.s) {
                sI_1.e.innerHTML = sI_1.n; // apply automatically (no increment)
                sI_2.e.innerHTML = sI_2.n;
                sI_3.e.innerHTML = sI_3.n;
                sI_1.s = true; // apply once
            }
        }
        /*
        if (pos.y === 0 && !pos.r && num_Ct(pos.v, op.e, true) && im.s) { // during a high-speed reverse scroll to the top (pos.y < threshold of viewport)
            im.t.classList.add("trs"); // add transitioning for 'smoothening' of effect
            im.s = false;
        } else {
            if (im.s && im.t.classList.contains("trs")) { // remove the effect once scrolling complete (high-speed)
                im.t.classList.remove("trs");
            } else if ((pos.y > 0) || num_Ct(pos.v, op.e, false) || pos.r) { // reset
                im.s = true; // enabler
            }
        }*/

        //////////////////////////////////

        // q_Info

        if (b.pb.bottom > aH && b.Lps.top > aH) {
            if (checkScrollDir(pos.a)) { // scrolling down
                ld.qis[1].style.transform = "translateY(calc(0.5rem * " + (pos.s) + "))";
                ld.qis[2].style.transform = "translateY(calc(1rem * " + (pos.s) + "))";
                ld.qis[3].style.transform = "translateY(calc(1.5rem * " + (pos.s) + "))";
                ld.qis[4].style.transform = "translateY(calc(2rem * " + (pos.s) + "))";
                ld.qis[5].style.transform = "translateY(calc(2.5rem * " + (pos.s) + "))";
                ld.qis[6].style.transform = "translateY(calc(3rem * " + (pos.s) + "))";
                ld.qis[7].style.transform = "translateY(calc(3.5rem * " + (pos.s) + "))";
            } 
        } else {
            if (checkScrollDir(pos.a)) { // scrolling down
                var _L = ld.qis.length - 1;
                for (j = 0; j <= _L; j++) {
                    ld.qis[j].style.transform = "translateY(0px)";
                }
            } 
        }

        if (b.pb.bottom < 0 && b.Lps.top < 0) {
            if (!checkScrollDir(pos.a)) { // scrolling up
                ld.qis[0].style.transform = "translateY(calc(-3.5rem * " + (pos.s) + "))";
                ld.qis[1].style.transform = "translateY(calc(-3rem * " + (pos.s) + "))";
                ld.qis[2].style.transform = "translateY(calc(-2.5rem * " + (pos.s) + "))";
                ld.qis[3].style.transform = "translateY(calc(-2rem * " + (pos.s) + "))";
                ld.qis[4].style.transform = "translateY(calc(-1.5rem * " + (pos.s) + "))";
                ld.qis[5].style.transform = "translateY(calc(-1rem * " + (pos.s) + "))";
                ld.qis[6].style.transform = "translateY(calc(-0.5rem * " + (pos.s) + "))";
            } 
        } else {
            if (!checkScrollDir(pos.a)) { // scrolling up
                var _L = ld.qis.length - 1;
                for (j = 0; j <= _L; j++) {
                    ld.qis[j].style.transform = "translateY(0px)";
                }
            } 
        }

    } else {
        if (!pos.s) { // if no scrolling
            var _L = ld.qis.length - 1;
            for (j = 0; j <= _L; j++) {
                ld.qis[j].style.transform = "translateY(0px)";
            }
        }
    }

    requestAnimationFrame(sc_L);
}

function sc_LpH() { // scroll loop - phablet
    var d = (pos.yA !== 0) ? Math.abs(pos.y - pos.yA) : 0, // obtain distance of scroll
        b = {
            q1 : ld.q1.getBoundingClientRect(), // #q1 heading
            pb : ld.pbn.getBoundingClientRect() // #profile_banner
        };

    if (d > pos.st) { // check if scroll distance is valid (of a true scroll - prevents unwanted scrolling)
        if (getCookie("statsIncr") !== "true") { // check if cookie exists
            var b1 = getBd(sI_1.e, "top"), // get respective 'top' boundaries for each stat
                b2 = getBd(sI_2.e, "top"),
                b3 = getBd(sI_3.e, "top");

            if (chkVL(b1) && (b1 < wH) && !sI_1.s) { // stats 1 (if within viewport visual)
                e_Ic(sI_1, null, sI_1.n);
                sI_1.s = true; // only execute each block once
            }
            if (chkVL(b2) && (b2 < wH) && !sI_2.s) { // stats 2
                e_Ic(sI_2, null, sI_2.n);
                sI_2.s = true;
            }
            if (chkVL(b3) && (b3 < wH) && !sI_3.s) { // stats 3
                e_Ic(sI_3, null, sI_3.n);
                sI_3.s = true;
                setCookie("statsIncr", "true", op.c.t); // create cookie to detemine if stats have been incremented by user (on initial usage)
            }
        } else {
            if (!sI_1.s) {
                sI_1.e.innerHTML = sI_1.n; // apply automatically (no increment)
                sI_2.e.innerHTML = sI_2.n;
                sI_3.e.innerHTML = sI_3.n;
                sI_1.s = true; // apply once
            }
        }
    }

    if (b.q1.top && b.q1.top < aH && ld.x4) {
        ld.x4 = false;
        ld.L = setInterval(function() {
            e_wCycle(qInfo[0], dev.info.work, ld.L);
        }, op.t);
    }

    if (wiD >= 700) {
        if (b.pb.top && b.pb.top < aH) {
            if (!ld.x5) {
                ld.x5 = true;
                ld.rf2 = pos.y;
            }
            ld.pds[0].style.transform = "translateX(" + ((pos.y - ld.rf2) * 0.2) + "px)";
            ld.pds[1].style.transform = "translateX(" + ((pos.y - ld.rf2) * 0.4) + "px)";

        } else if (b.pb.top && b.pb.top > aH && ld.x5) {

            ld.pds[0].style.transform = "translateX(-3rem)";
            ld.pds[1].style.transform = "translateX(-2rem)";
        }
    }

    if (vw.dk) { // if desktop
        var mb = num_Fs(window.getComputedStyle(im.pfg).getPropertyValue('margin-bottom')),
            ghTransform = pos.y * -0.35,
            gh_mb_frc = 1 - (Math.abs(ghTransform) / mb), // opacity decrease
            b = {
                wd : im.wd.getBoundingClientRect(),
                q : ld.qIn.getBoundingClientRect(),
                lp4 : ld.Lp4.getBoundingClientRect(),
                q3 : ld.q3.getBoundingClientRect(),
                lc : ld.lcF.getBoundingClientRect(),
                cf : ld.cFc.getBoundingClientRect(),
                ds : ld.dis.getBoundingClientRect(),
                hs : ld.hrs.getBoundingClientRect(),
                wc : pf.wc.getBoundingClientRect(),
                dw : pf.dw.getBoundingClientRect(),
                rb : pf.rb.getBoundingClientRect(),
                rbc1 : pf.rbc[0].getBoundingClientRect(),
                rbc2 : pf.rbc[1].getBoundingClientRect(),
                ldpr : el.Ldpllx.getBoundingClientRect(),
                ldg : el.Ldpllx_g.getBoundingClientRect()
            };


        if (!pos.aT) { // during scroll

            // INTRO
            im.Li.style.opacity = "0";

            im.nav[0].style.transform = "translateY(" + (pos.y * 0.25) + "px)"; // NAV
            im.nav[1].style.transform = "translateY(" + (pos.y * 0.1) + "px)";
            im.nav[2].style.transform = "translateY(" + (pos.y * 0.2) + "px)";
            im.nav[3].style.transform = "translateY(" + (pos.y * 0.15) + "px)";
            im.nav[4].style.transform = "translateY(" + (pos.y * 0.05) + "px)";

            im.wd.style.transform = "translateY(" + (pos.y * 0.05) + "px)";
            im.gh.style.transform = "translateY(" + (ghTransform) + "px)";
            im.pfi.style.transform = "translateY(" + (pos.y * 0.15) + "px)";
            im.pfg.style.opacity = gh_mb_frc;

            im.L.style.transform = "translateY(" + (pos.y * -0.1) + "px)";
            ld.qIn.style.transform = "translateY(" + (pos.y * -0.75) + "px)";

            // c_css(".cursorInt", "opacity: 0 !important;", false, null);

            /*
            for (q = el.cisYNum; q >= (el.cisYNum - rows); q--) {
                var r = 0;
                while (r > (-1 * el.cisXNum)) {
                    r--;
                    cursorDots[r + (q * el.cisXNum)].classList.add("z_O");
                }
            }*/
            // cursorDots[cD].classList.add("z_O");

            if (b.lc.top && b.lc.top < aH) { // COORDS parallax
                var h = b.lc.height;
                if (!ld.x8) {
                    ld.rf5 = pos.y;
                    ld.x8 = true;
                }

                el.fC[0].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * 1) + "rem)";
                el.fC[1].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * 0.1) + "rem)";
                el.fC[2].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * -0.3) + "rem)";
                el.fC[3].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * -0.8) + "rem)";

                el.fC[5].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * -1) + "rem)";
                el.fC[6].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * 0.5) + "rem)";
                el.fC[7].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * -0.5) + "rem)";
                el.fC[8].style.transform = "translateY(" + (((1 - (pos.y - ld.rf5) / h)) * -0.3) + "rem)";

            }

            if (b.ds.top && b.ds.top < aH) { // DISTANCE 
                if (getCookie("statsIncr") !== "true") { // check if cookie exists
                    
                    if (chkVL(b1) && (b1 < wH) && !sI_1.s) { 
                        e_Ic(sI_1, null, sI_1.n);
                        sI_1.s = true;
                        setCookie("statsIncr", "true", op.c.t); // create cookie to detemine if stats have been incremented by user (on initial usage)
                    }
                } else {
                    if (!ld.x11) {
                        ld.q9.innerHTML = sI_1.n; // apply automatically (no increment)
                        ld.x11 = true; // apply once
                    }
                }
            }

            if (b.hs.top && b.hs.top < aH) { // HOURS 
                if (getCookie("statsIncr") !== "true") { // check if cookie exists
                    
                    if (chkVL(b2) && (b2 < wH) && !sI_2.s) { 
                        e_Ic(sI_2, null, sI_2.n);
                        sI_2.s = true;
                        setCookie("statsIncr", "true", op.c.t); // create cookie to detemine if stats have been incremented by user (on initial usage)
                    }
                } else {
                    if (!ld.x12) {
                        ld.q11.innerHTML = sI_2.n; // apply automatically (no increment)
                        ld.x12 = true; // apply once
                    }
                }
            }

            if (b.cf.top && b.cf.top < aH) { // CUPS 
                if (getCookie("statsIncr") !== "true") { // check if cookie exists
                    
                    if (chkVL(b3) && (b3 < wH) && !sI_3.s) { 
                        e_Ic(sI_3, null, sI_3.n);
                        sI_3.s = true;
                        setCookie("statsIncr", "true", op.c.t); // create cookie to detemine if stats have been incremented by user (on initial usage)
                    }
                } else {
                    if (!ld.x9) {
                        ld.q7.innerHTML = sI_3.n; // apply automatically (no increment)
                        ld.x9 = true; // apply once
                    }
                }
            }

            if (b.q.top < b.lp4.top) {
                ld.Lp4.style.opacity = 0;
            } else if (b.q.top < b.wd.bottom) { // if q_Info intersects wordsTyper
                if (!ld.x6) {
                    ld.rf3 = b.q.top - b.lp4.top;  // start lead_point_4 opacity reduction
                    ld.x6 = true;
                }
                var r = b.q.top - b.lp4.top;
                ld.Lp4.style.opacity = (r / ld.rf3);
            } else {
                ld.Lp4.style.opacity = 1;
            }

            if (b.q3.top < (aH / 2)) {
                ld.eduI.style.transform = "translateY(2.5rem)";
            } else if (b.q3.top < aH) { // if in view
                if (!ld.x7) {
                    ld.rf4 = b.q3.top;  // start edu_info icon transform
                    ld.x7 = true;
                }
                var t = (b.q3.top - (ld.rf4 / 2));
                ld.eduI.style.transform = "translateY(" + ((1 - (t / (ld.rf4 / 2))) * (2.5 * op.fN)) + "px)";
            } else {
                ld.eduI.style.transform = "";
            }

            // PREFOOTER
            if (b.dw.top && b.dw.top < aH) {
                if (!pf.x8) {
                    pf.rf7 = pos.y;
                    pf.x8 = true;
                }
                pf.dw.style.transform = "translateY(" + ((pos.y - pf.rf7) * 0.05) + "px)";
            }

            if (b.wd.top > b.q.top && b.wd.bottom < b.q.bottom) { // words typer
                im.wd.classList.remove("z-N");
                im.wd.classList.add("z-G");
            } else {
                im.wd.classList.add("z-N");
                im.wd.classList.remove("z-G");
            }

            // RANDOM_SC
            if (b.rb.top && b.rb.top < aH) {
                var w = !pf.x14 ? (aH - b.rb.top) / op.fN : pf.rf20,
                    h = !pf.x15 ? (aH - b.rb.top) / op.fN : (aH - pf.rf21) / op.fN;

                    // h = !pf.x14 ? (aH - b.rb.top) / op.fN : (((aH - b.rb.top) / op.fN) + 5);

                pf.rb.style.width = "calc(5rem + " + w + "rem)"; // width increase
                pf.rb.style.height = "calc(5rem + " + h + "rem)"; // height ""

                pf.rsc.style.height = "calc(100vh + 4rem + " + h + "rem)"; // section height increase

                pf.rb.style.transform = "translateY(" + (w / 4) + "rem)"; // parallax

                if (b.rb.top < (aH / 2)) { // internal circles movement

                    var rbLeft = b.rb.left;
                    if (!pf.x9) {
                        pf.rf8 = b.rbc1.left; // left capture (circle 1)
                        pf.rf9 = b.rb.top;
                        pf.rf10 = pos.y;

                        pf.x9 = true;
                    }

                    e_Fd(pf.rbc[0], false);
                    e_Fd(pf.rbc[1], false);

                    if (!pf.x10) {
                        pf.rbc[0].style.transform = "translateX(" + ((pf.rf8 - rbLeft) / op.fN) + "rem) translateY(" + ((pf.rf9 - ((pf.rf10 + pf.rf9) - pos.y)) / (op.fN * 1.37)) + "rem)";
                        pf.rbc[1].style.left = ((((pf.rf10 + pf.rf9) - (pos.y * 0.975)) / pf.rf9) * 100) + "%";
                    } else if (!pf.x11) {

                        var yBounce = (pf.rf12 - ((pos.y - pf.rf14) / op.fN)),
                            xBounce = ((pf.rf8 - rbLeft) / op.fN) - ((3 * Math.cos(2 * Math.PI)) * (pf.rf12 - yBounce));

                        pf.rbc[0].style.transform = "translateX(" + xBounce + "rem) translateY(" + yBounce + "rem)";
                        pf.rbc[1].style.left = ((((pf.rf10 + pf.rf9) - (pos.y * 0.975)) / pf.rf9) * 100) + "%";

                    } else if (!pf.x12) {

                        var yBounce = (pf.rf12 - ((pos.y - pf.rf14) / op.fN)),
                            xBounce = ((pos.y - pf.rf15) / (op.fN / 4));

                        pf.rbc[0].style.transform = "translateX(" + xBounce + "rem) translateY(" + yBounce + "rem)";
                        pf.rbc[1].style.left = ((((pf.rf10 + pf.rf9) - (pos.y * 0.975)) / pf.rf9) * 100) + "%";

                        pf.x14 = true;
                        pf.rf20 = w;

                    } else if (!pf.x13) {

                        var yBounce = !pf.x12a ? pf.rf16 + 2 + ((pos.y - pf.rf17) / (op.fN / 3)) : (Math.abs(pf.rf10a) / op.fN) + ((aH / 2) / op.fN),
                            // xBounce = ((pos.y - pf.rf15) / (op.fN / 4));
                            // xBounce = pf.rf17a;
                            xBounce = ((b.rb.width / op.fN) - 16) / 2;

                        if (!pf.x12a) { //
                            e_Fd(pf.rbc_t1, false); // reveal text
                            pf.rbc[0].classList.add("extra"); // upgrade circle to text box
                            pf.x12a = true;
                            pf.rf9a = pos.y;
                            pf.rf10a = b.rb.top;
                        }

                        pf.rbc[0].style.transform = "translateX(" + xBounce + "rem) translateY(" + yBounce + "rem)";
                        pf.rbc[1].style.left = ((((pf.rf10 + pf.rf9) - (pos.y * 0.975)) / pf.rf9) * 100) + "%";

                        if (pf.x12) {

                            var colChange = function(a, b, c) {
                                    return (((pf.rf17b - c) / pf.rf17b) * (b - a)) + a;
                                },
                                def = 48, // #303030
                                rCol = 135, // #87CEEB
                                gCol = 206,
                                bCol = 235;

                            var rColCh = colChange(def, rCol, b.ldpr.top),
                                gColCh = colChange(def, gCol, b.ldpr.top),
                                bColCh = colChange(def, bCol, b.ldpr.top),
                                rV = (rColCh <= rCol) ? rColCh : rCol,
                                gV = (gColCh <= gCol) ? gColCh : gCol,
                                bV = (bColCh <= bCol) ? bColCh : bCol;

                            // RANDOM BOX BACK. COL. CHANGE
                            pf.rb.style.backgroundColor = "rgb(" + rV + ", " + gV + ", " + bV + ")";

                            // 48, 48, 48
                            // 135, 206, 235

                        }

                    } else {

                        var yBounce = pf.rf16 + 2 + ((pos.y - pf.rf17) / (op.fN / 3));
                            xBounce = pf.rf18 - ((pos.y - pf.rf19) / (op.fN / 4));

                        pf.rbc[0].style.transform = "translateX(" + xBounce + "rem) translateY(" + yBounce + "rem)";
                        pf.rbc[1].style.left = ((((pf.rf10 + pf.rf9) - (pos.y * 0.975)) / pf.rf9) * 100) + "%";

                    }

                    if (b.rbc1.right > b.rbc2.left && !pf.x10 /*&& b.rbc1.bottom > b.rbc2.top && b.rbc1.left < b.rbc2.right && b.rbc1.top < b.rbc2.bottom*/) { // collision between the 2 circles

                        pf.rf11 = ((pf.rf8 - rbLeft) / op.fN);
                        pf.rf12 = ((pf.rf9 - ((pf.rf10 + pf.rf9) - pos.y)) / (op.fN * 1.37));

                        pf.rf13;
                        pf.rf14 = pos.y;

                        pf.x10 = true;
                    }

                    if ((b.rbc1.left < b.rb.left) && pf.x10) {
                        // pf.rbc[0].style.background = "red";

                        pf.rf15 = pos.y;

                        pf.x11 = true;
                    }

                    if ((b.rbc1.top < 0) && pf.x11 & !pf.x12) {

                        var transport = function() { 
                            var r, // elements in focus
                                s = getRandomInt(2, 10); // approx. duration
                            
                            do {
                                r = getRandomInt(0, 3);
                            }
                            while (pf.ld_tra.includes(r));

                            pf.ld_tr[r].style.transitionDuration = 0 + "s";
                            pf.ld_tr[r].classList.remove("z_O");
                            pf.ld_tr[r].classList.remove("v_n");
                            setTimeout(function() {
                                pf.ld_tr[r].style.transitionDuration = s + "s";
                                pf.ld_tr[r].style.transform = "translateX(calc(100vw + 2rem))";
                                pf.ld_tra[pf.ld_tra.length] = r; // add to active array
                            }, 200);
                            setTimeout(function() {
                                pf.ld_tr[r].style.transitionDuration = 0.2 + "s";
                                pf.ld_tr[r].classList.add("z_O");
                                // pf.ld_tr[r].classList.add("v_n");
                                setTimeout(function() {
                                    pf.ld_tr[r].style.transform = "none";
                                    pf.ld_tra.push(pf.ld_tra.splice(pf.ld_tra.indexOf(r), 1)[0]); // push target to last
                                    pf.ld_tra.pop(); // remove from active array
                                }, 200);
                            }, ((s * 1000) + 500));

                            setTimeout(transport, 5000);

                        };

                        pf.rf16 = (pf.rf12 - ((pos.y - pf.rf14) / op.fN));
                        pf.rf17 = pos.y;
                        pf.rf17a = ((pos.y - pf.rf15) / (op.fN / 4)); // convert to text

                        pf.rf17b = b.ldpr.top;

                        transport();

                        pf.x12 = true;
                    }

                    if (pf.x12a) {
                        var a = (-1 * ((pos.y - pf.rf9a) / op.fN));
                        el.Ldpllx.style.transform = "translateY(calc(5rem + " + (a / 4) + "rem))";
                    }

                    if ((b.rbc1.right > b.rb.right) && pf.x12 && !pf.x13) {

                        pf.rf18 = ((pos.y - pf.rf15) / (op.fN / 4));
                        pf.rf19 = pos.y;

                        pf.x13 = true;
                    }

                    // LANDSCAPE PARALLAXING
                    if (b.ldpr.top < aH) {
                        // clouds
                        for (i = 0; i < ld_cloud_n; i++) {
                            var a = ((pos.y - pf.rf9a) / op.fN) / el.Ldpllx_caXe[i];
                            el.Ldpllx_ci[i].style.transform = "translateX(" + (el.Ldpllx_caX[i] + a) + "rem) translateY(" + el.Ldpllx_ca[i] + "rem)";
                        }
                    }

                    if (b.ldg.top < aH && !pf.x15a) {
                        // FLYING PLANE ANIMATION
                        pf.x15a = true;

                        var aValue = (aH - (op.fN * 4)) / ((wiD / 2) * ((wiD / 2) - wiD)), // get value of 'a' from 'y=ax(x-wiD)'
                            bValue = ((aH - (op.fN * 4)) - (aValue * Math.pow((wiD / 2), 2))) / (wiD / 2), // get value of 'b' from 'ax^2 + bx = y' ; derive a parabolic model based off device height/width
                            model = function(x) {
                                return (aValue * Math.pow(x, 2)) + (bValue * x);
                            },
                            inVel = 0.1, // initial
                            fnVel = 1,
                            liveX = 1,
                            xDivide = 2,
                            inAngle = -1 * (90 - (Math.atan(model(dev.t) / dev.t) * (180 / Math.PI))), // initial angle
                            conAngle = 0,
                            xLoop = null;

                        pf.ld_p.style.transitionDuration = inVel + "s"; // set initial velocity (low duration)

                        pf.ld_p.style.transform = "translateX(" + liveX + "px) translateY(" + (-1 * model(liveX)) + "px) rotate(" + inAngle + "deg)";

                            // 1.85 to 1

                        xLoop = setInterval(function() {
                            var angleMod = (liveX <= (wiD / xDivide)) ? -1 : 1,
                                xDivideMod = xDivide - ((liveX / (wiD / xDivide)) * (xDivide - 1));
                            if (xDivideMod < 1) {
                                xDivideMod = 1;
                            }

                            liveX += (dev.t / 5); // default fps increment
                            conAngle = angleMod * (inAngle + ((90 - (Math.atan((model(wiD / xDivide) - model(liveX)) / ((wiD / xDivide) - liveX)) * (180 / Math.PI))))); // initial angle
                            /*if ((model(wiD / xDivide) - model(liveX))) {

                            }*/

                            console.log(conAngle + ", " + liveX + ", " + (model(wiD / 2) - model(liveX)) + ", " + ((wiD / 2) - liveX));
                            // console.log(xDivideMod + ", " + conAngle + ", " + (Math.atan(model(liveX) / ((wiD / xDivideMod) - liveX))));

                            var u = (liveX <= (wiD / xDivide)) ? (((liveX / (wiD / xDivide)) * (fnVel - inVel)) + inVel) : (fnVel - (((liveX - (wiD / xDivide)) / (wiD / xDivide)) * (fnVel - inVel)));
                            pf.ld_p.style.transitionDuration = u + "s";  // slower duration as flight progresses up

                            // if (liveX <= (wiD + dev.t)) { // run till after end of viewport
                            if (liveX <= (wiD / 1.85)) { // DEV
                                pf.ld_p.style.transform = "translateX(" + liveX + "px) translateY(" + (-1 * model(liveX)) + "px) rotate(" + conAngle + "deg)";
                                setInterval(xLoop, (u * 1000)); // restart loop with updated interval
                            } else {
                                clearInterval(xLoop);
                            }
                        }, (inVel * 1000));


                        /* // ROTATIONS OF THE PLANE
                        var w = (wiD + (2 * op.fN)),
                            h = (-0.00015 * Math.pow(w, 2)) + (0.525 * w) + (op.fN * 2),
                            angle = -1 * Math.atan(h / w) * (180 / Math.PI);

                        pf.ld_p.style.transform = "rotate(" + angle + "deg)";

                        setTimeout(function() {
                            pf.ld_p.style.transitionDuration = "3s";
                            // pf.ld_p.style.transitionDelay = "2s";
                            pf.ld_p.style.transform = "rotate(" + angle + "deg) translateX(" + w + "px) translateY(" + (-1 * (h / op.fN)) + "rem)";
                        }, 10);*/

                    }

                    if (b.ldg.bottom < aH && !pf.x15) {
                        pf.rf21 = b.rb.top;
                        pf.x15 = true;
                    }

                } else {

                    e_Fd(pf.rbc[0], true); // reverse effect
                    e_Fd(pf.rbc[1], true);

                    pf.rbc[0].style.transform = "";
                    pf.rbc[1].style.left = "";
                }
            }

        } else { // default at top
            im.wd.style.transform = "";
            im.gh.style.transform = "";
            im.pfi.style.transform = "";
            im.pfg.style.opacity = 1;

            im.L.style.transform = "";
            ld.qIn.style.transform = "";

            im.Li.style.opacity = "1";
        }
    }

    requestAnimationFrame(sc_LpH);
}

// custom functions
/*
function getIndex(el) {
    if (el) {
        for (f = 0; f <= (wInfo_n - 1); f++) {
            if (el.classList.contains("r" + f)) { // check for reference index, and return it
                return f;
            }
        }
    }
    return null;
}

function totalWidth(els) { // get total width of word elements in line
    var w = 0, addon = 0;
    for (q = 0; q <= (els.length - 1); q++) {
        if (num_Fs(els[q].style.width)) {
            addon = num_Fs(els[q].style.width);
        } else {
            addon = num_Fs(window.getComputedStyle(els[q]).getPropertyValue('width'))
        }
        w += addon;
    }
    if (w === 0) {
        return false;
    } else {
        return w;
    }
}

function cumulativeWidth(x, w) { // get width of elements till x-index
    var c = 0;
    for (i = 0; i < x; i++) {
        c += w[i];
    }
    return c;
}*/


if (!vw.pH && !vw.tB) { // only in mobile view
    sc_L();
} else if (vw.pH || vw.tB) { // phablet/tablet
    sc_LpH();
}


function uncalledCode() { // CODE NOT NEEDED (currently)
    if (b.wc.top && b.wc.top < aH) { // transformation effect

        if (!ld.x10) {
            ld.rf6 = pos.y;
            ld.x10 = true;
        }
        for (var a in el.wCh) { // load up (& initial show some) keywords on all lines
            var targets = document.querySelectorAll("#wordcloud" + a + " span.v_s"), // select visible words on screen
                targetsIndex = new Array(targets.length);
            for (d = 0; d <= targets.length - 1; d++) { // UPDATE reference targets that are visible
                for (e = 0; e <= targets.length - 1; e++) {
                    targetsIndex[e] = getIndex(targets[e]); // targets[e].classList.contains("r");
                }
            }

            for (c = 0; c <= targets.length - 1; c++) {
                var target_bd;
                targets[c].style.transform = "translateX(" + ((pos.y - ld.rf6) * wC_spd) + "px)"; // transform across user viewport during scroll
                target_bd = targets[c].getBoundingClientRect(); // get live bounds 

                if (target_bd.left < 0) { // if HIDDEN away in viewport edges (LEFT)

                    if (targets[c].classList.contains("actv")) { // if word has been activated?
                        
                        /*
                        targets[c].classList.add("o-img", "trs"); // make transparent
                        wC_hold[wC_hold.length] = targets[c]; // add to hold
                        setTimeout(function() {
                            wC_hold[0].classList.remove("trs");
                            wC_hold.shift(); // remove from hold
                        }, op.t);
                        targets[c].style.width = (wInfo_i[a][targetsIndex[c]] + target_bd.left) + "px"; // dynamic width
                        */

                        targets[c].classList.remove("actv");

                        // targets[c].classList.add("deactv");
                    } 

                    /*
                    if (targets[c].classList.contains("actv") || targets[c].classList.contains("deactv")) {
                        targets[c].style.width = (wInfo_i[a][targetsIndex[c]] + target_bd.left) + "px"; // dynamic width
                    } else {
                        // targets[c].style.width = (wInfo_i[a][targetsIndex[c]] + target_bd.left) + "px"; // dynamic width
                        targets[c].style.width = (wiD - target_bd.left) + "px";
                    }*/

                } /*else if (target_bd.right >= wiD) { // RIGHT

                    // var wd = wiD - totalWidth(targets);
                    var iwd = getCSSProperty(targets[c], "width"),
                        wd = wiD - target_bd.right,
                        nwd = iwd + wd; // new (total) width
                    if (!targets[c].classList.contains("actv") && (nwd <= wInfo_i[a][c])) { // not activated yet
                        el.wCh[a][wInfo_f[a] - 1].style.width = nwd + "px";
                    }

                }*/ else if (target_bd.right <= wiD && target_bd.left >= 0) { // CENTRE (not infringing of EDGES)
                    
                    var iwd = getCSSProperty(targets[c], "width"),
                        wd = wiD - target_bd.left,
                        nwd = (wd > iwd) ? wd : iwd, // new (total) width
                        rf = getIndex(targets[c]); // get ref. index
                    
                    if (!targets[c].classList.contains("actv") && (nwd <= wInfo_i[a][rf])) {
                        targets[c].style.width = nwd + "px";
                    } else if (!targets[c].classList.contains("actv") && (nwd > wInfo_i[a][rf])) {
                        targets[c].style.width = wInfo_i[a][rf] + "px"; // full width
                        targets[c].classList.add("actv"); // activated (fully shown on screen)
                    }

                    // var iwd = getCSSProperty(targets[c], "width"); //

                    /*
                    if (!targets[c].classList.contains("actv") && (iwd <= wInfo_i[a][c])) { // not activated yet

                        // var r = wiD - target_bd.left;
                        //targets[c].style.width = r + "px";
                        // el.wCh[a][wInfo_f[a] - 1].style.width = (wiD - target_bd.left - pf.rf7) + "px"; // increase width

                        if (wiD - target_bd.left >= wInfo_i[a][c]) {
                            targets[c].classList.add("actv"); // activated (fully shown on screen)
                        } else {
                            targets[c].style.width = (iwd + (r * 0.9)) + "px";
                        }

                    } else if ((wiD - target_bd.left >= wInfo_i[a][c]) && iwd <= wInfo_i[a][c]) {
                        targets[c].style.width = wInfo_i[a][c] + "px";
                    }*/
                    
                    /*else if (!targets[c].classList.contains("actv")) {
                        el.wCh[a][wInfo_f[a] - 1].classList.add("actv"); // activated (fully shown on screen)
                    }*/

                } /*else if (target_bd.right > wiD && target_bd.left >= 0) { // LEFT IN, but RIGHT OUT

                    var iwd = getCSSProperty(targets[c], "width"),
                        wd = wiD - target_bd.left,
                        nwd = (wd > iwd) ? wd : iwd; // new (total) width
                    
                    if (!targets[c].classList.contains("actv") && (nwd <= wInfo_i[a][c])) {
                        targets[c].style.width = nwd + "px";
                    } else if (!targets[c].classList.contains("actv") && (nwd > wInfo_i[a][c])) {
                        targets[c].style.width = wInfo_i[a][c] + "px"; // full width
                        targets[c].classList.add("actv"); // activated (fully shown on screen)
                    }
                }*/

                if (target_bd.right < 0) { // RIGHT ""

                    // var elm;
                    // wC_clone_hold[wC_clone_hold.length] = targets[c].cloneNode(true); // clone the element node

                    targets[c].classList.remove("v_s");
                    targets[c].classList.add("v_n");

                    /*
                    elm = wC_clone_hold[wC_clone_hold.length - 1];
                    if (!elm.classList.contains("p-a")) { // ADD abs. positioning if not existing 
                        elm.classList.add("p-a");
                        elm.style.left = wInfo_s[a] + "px"; // left pos.
                    }*/

                    // wInfo_d[a]++; // no of hidden words

                    
                    // if (wInfo_d[a] > wInfo_p[a]) { // if hidden elms. MORE than no. of initial elements
                        
                        // for (x = 0; x <= (wInfo_p[a] - 1); x++) { // (non-abs.) initials

                            /*
                            var endElm = document.querySelectorAll("#wordcloud" + a + " span");
                            swap(el.wCh[a][x], endElm[endElm.length - 1], false); // SHIFT THE NODES TO THE BOTTOM to END

                            el.wCh[a][x].style.left = wInfo_s[a] + "px"; // ASSIGN Behind Final Line word
                            el.wCh[a][x].classList.remove("v_n");
                            el.wCh[a][x].classList.add("p-a", "v_s");
                            */
                        // }

                        /*
                        targets[c].remove(); // REMOVE from DOM
                        el.wChe[a].appendChild(elm); // append to last of line
                        for (j = (c + 1); c <= (wInfo_n - 1); j++) { // SHIFT OTHER ELEMENTS inward to COVER FOR DELETION
                            var lf = getCSSProperty(el.wCh[a][j], "left");
                            el.wCh[a].style.left = "";
                        }
                        wC_clone_hold.unshift(); // remove from array
                        */
                       /*
                    } else {


                    }*/
                }

                if (wInfo_f[a] === wInfo_n && !wInfo_r[a]) { // IF ALL ELEMENTS of LINE has been INSERTED into VIEW

                    // SHIFT ALL '.v_n' class elements to AFTER LAST KEYWORD
                    var vnelm = document.querySelectorAll("#wordcloud" + a + " span.v_n"),
                        vnI = getIndex(vnelm[0]), // get first index
                        lpos = [
                            getCSSProperty(el.wCh[a][wInfo_f[a] - 1], "left")
                        ];
                    /*
                    if (wC_a !== a) {
                        pf.x8 = false;
                        wC_a = a;
                    }*/
                    // if (!pf.x8) {
                        var npos = [
                            el.wCh[a][wInfo_f[a] - 1]
                        ];
                        // pf.x8 = true;
                    // }

                    if (vnelm.length) {
                        wInfo_r[a] = true;
                    }

                    if (vnelm.length) {
                        for (v = 0, n = vnI; v <= (vnelm.length - 1); v++, n++) {
                            if (npos && npos[n]) {
                                swap(vnelm[v], npos[n], false); // SWAP POSITIONS TO THE BACK
                                npos[npos.length] = vnelm[v];

                                if (!vnelm[v].classList.contains("p-a")) { // ADD STYLING
                                    vnelm[v].classList.add("p-r");
                                }

                                vnelm[v].style.width = wInfo_i[a][n] + "px"; // width
                                if ((n + 1) <= wInfo_p[a]) { // initials
                                    vnelm[v].style.left = (lpos[lpos.length - 1] + wInfo_i[a][wInfo_f[a] - 1]) + "px"; // left
                                } else { // others (hidden)
                                    vnelm[v].style.left = (lpos[lpos.length - 1] + wInfo_i[a][wInfo_f[a] - 1] + cumulativeWidth(v, wInfo_i[a])) + "px";
                                }

                                vnelm[v].classList.remove("v_n"); // vis.
                                vnelm[v].classList.add("v_s");

                                if (v === (vnelm.length - 1)) { // at last elm.

                                    wInfo_r[a] = false;

                                }
                            }
                        }
                    }
                }

                // new words (using comparison of live-width additions with viewport width) //
                if (totalWidth(targets) && (totalWidth(targets) < wiD)) { // ADD new words if space AVAILABLE
                    
                    if (wInfo_f[a] < wInfo_n) {
                        // console.log(totalWidth(targets));

                        var wd = wiD - totalWidth(targets),
                            lf = 0;

                        el.wCh[a][wInfo_f[a]].classList.remove("d_n");
                        el.wCh[a][wInfo_f[a]].classList.remove("v_n");

                        // console.log("fa: " + wInfo_f[a]);

                        if (el.wCh[a][wInfo_f[a]].classList.contains("z_O")) {

                            // console.log("fa: " + wInfo_f[a] + ", gi: " + getIndex(targets[c]));

                            // wC_hold[wC_hold.length] = getIndex(targets[c]); // add to hold

                            // wC_hold[wC_hold.length] = wInfo_f[a]; // add to hold
                            wC_hold[a][wC_hold[a].length] = wInfo_f[a]; // add to hold

                            // console.log("ah: " + a + wInfo_f[a]);

                            setTimeout(function() {

                                var rn = a.slice(1); // get line number

                                // console.log("wc: " + a + wC_hold[a][0]);

                                if (wC_hold[a][0]) { // remove if defined
                                    el.wCh[a][wC_hold[a][0]].classList.remove("z_O");
                                    wC_hold[a].shift(); // remove from hold

                                } else if (wC_hold["s" + (rn - 1)][0]) { // remove from previous line

                                    el.wCh["s" + (rn - 1)][wC_hold["s" + (rn - 1)][0]].classList.remove("z_O");
                                    wC_hold["s" + (rn - 1)].shift(); // remove from hold
                                }
                            }, 10);
                        }

                        el.wCh[a][wInfo_f[a]].classList.add("v_s", "p-a"); // add temp. abs. pos.
                        el.wCh[a][wInfo_f[a]].classList.add("r" + wInfo_f[a]); // index for reference
                        el.wCh[a][wInfo_f[a]].style.width = wd + "px";
                        el.wCh[a][wInfo_f[a]].style.transform = "translateX(" + ((pos.y - ld.rf6) * wC_spd) + "px)"; 

                        for (k = 0; k < wInfo_f[a]; k++) {
                            lf += wInfo_i[a][k];
                        }

                        el.wCh[a][wInfo_f[a]].style.left = lf + "px";

                        wInfo_f[a]++;

                        // console.log("insert more");
                    }
                }
            }
        }
    }
}