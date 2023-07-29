
// scroll-based loops/functions (local)

var im = { // #intro_main
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
        qis : document.getElementsByClassName("q_Info_scr"),
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
        x : false,
        x2 : false,
        x3 : false,
        x4 : false,
        x5 : false,
        x6 : false,
        L : null
    },
    pf = { // #prefooter_sc
        el : document.getElementById("prefooter_sc"),
        w : document.getElementById("pf_wow"),
        w1 : document.getElementById("wow_head1"),
        w2 : document.getElementById("wow_head2"),
        w3 : document.getElementById("wow_head3"),
        sc : document.getElementById("scroll_banner"),
        ds : document.getElementById("design_banner"),
        xds : document.getElementsByClassName("xscroll"),
        sb : document.getElementById("pf_scrollbar"),
        x : false,
        x2 : false,
        x3 : false,
        x4 : false,
        x5 : false,
        x6 : false,
        x7 : false,
        rf : 0,
        rf2 : 0,
        rf3 : 0,
        rf4 : 0,
        rf5 : 0,
        rf6 : 0
    },
    sI_1 = { // stats numerals
        a : 0, // initial   
        n : 97, // km 
        e : document.getElementById("sIn1"), // element
        _L : undefined, // spaces for _L (loop) iterations
        s : false // run (execution) status
    },
    sI_2 = {
        a : 0,
        n : 183, // hours
        e : document.getElementById("sIn2"), 
        _L : undefined,
        s : false
    },
    sI_3 = {
        a : 0,
        n : 245, // cappuccinos
        e : document.getElementById("sIn3"),
        _L : undefined,
        s : false
    };


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
        ld.csa[0].classList.add("u-d");

        ld.csa[1].setAttribute("onclick", "event.preventDefault()"); // 'projects'
        ld.csa[1].removeAttribute("href");
        ld.csa[1].classList.add("u-d");
    } else { // show
        ld.csm.classList.remove("o-img");

        ld.csa[0].setAttribute("onclick", "location.href='https://ivansojivarghese.github.io/clicks'");
        ld.csa[0].setAttribute("href", "javascript:void(0)");
        ld.csa[0].classList.remove("u-d");

        ld.csa[1].setAttribute("onclick", "location.href='https://ivansojivarghese.github.io/code'");
        ld.csa[1].setAttribute("href", "javascript:void(0)");
        ld.csa[1].classList.remove("u-d");
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
                lp4 : ld.Lp4.getBoundingClientRect()
            };

        if (!pos.aT) { // during scroll
            im.wd.style.transform = "translateY(" + (pos.y * 0.05) + "px)";
            im.gh.style.transform = "translateY(" + (ghTransform) + "px)";
            im.pfi.style.transform = "translateY(" + (pos.y * 0.15) + "px)";
            im.pfg.style.opacity = gh_mb_frc;

            im.L.style.transform = "translateY(" + (pos.y * -0.1) + "px)";
            ld.qIn.style.transform = "translateY(" + (pos.y * -0.75) + "px)";

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

        } else { // default at top
            im.wd.style.transform = "";
            im.gh.style.transform = "";
            im.pfi.style.transform = "";
            im.pfg.style.opacity = 1;

            im.L.style.transform = "";
            ld.qIn.style.transform = "";
        }
    }

    requestAnimationFrame(sc_LpH);
}


if (!vw.pH && !vw.tB) { // only in mobile view
    sc_L();
} else if (vw.pH || vw.tB) { // phablet/tablet
    sc_LpH();
}