
// scroll-based loops/functions (local)

var im = { // #intro_main
        el : document.getElementById("intro_main"),
        elw : document.getElementById("intro_ws"),
        L : document.getElementById("lead_sc"),
        Lp : document.getElementById("lead_point"),
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
        p : 0
        // s : true, // code execution status
    },
    ld = { // #lead_sc
        cs : document.getElementsByClassName("c_Info_s"),
        x : false,
        rf : 0,
        rfe : 0
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
/*
for (k = 0; k <= ld.cs.length - 1; k++) {
    ld["csX" + (k + 1)] = false;
}*/


function sc_L() { // functions (live on scroll)
    var d = (pos.yA !== 0) ? Math.abs(pos.y - pos.yA) : 0, // obtain distance of scroll
        b = { // element bounds
            e : im.elw.getBoundingClientRect(), // #intro_ws
            L : im.L.getBoundingClientRect(), // #lead_sc
            Lp : im.Lp.getBoundingClientRect(), // #lead_point
            Lpf : im.Lpf.getBoundingClientRect(), // #lead_point_1
            Lps : im.Lps.getBoundingClientRect(), // #lead_point_2
            pL3 : im.Lp3.getBoundingClientRect(), // parallax arrow 3
            pL4 : im.Lp4.getBoundingClientRect() // parallax arrow 4 (hidden)
        };
    /*
    for (i = 0; i <= ldc_L; i++) {
        b["Lc" + (i + 1)] = ld.cs[i].getBoundingClientRect(); // get bounds for lead_sc indiv. points
    }*/

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

        im.L.style.transform = "translateY(" + (pos.y * -0.25) + "px)"; // #lead_sc

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

        if (b.Lpf.top < (aH * op.svA[1])) { // c_Info header
            if (!ld.x) {
                ld.x = true;
                ld.rf = pos.y;
                ld.rfe = aH * op.svA[0];
            }
            im.Lpf.style.transform = "translateY(" + ((pos.y - (ld.rf - ld.rfe)) * ((op.fN * -3.5) / (ld.rf - ld.rfe))) + "px)";
        }

        ld.cs[0].style.transform = "translateY(" + (pos.y * -0.1) + "px)"; // c_Info 1
        ld.cs[1].style.transform = "translateY(" + (pos.y * -0.15) + "px)"; // c_Info 2
        ld.cs[2].style.transform = "translateY(" + (pos.y * -0.2) + "px)"; // c_Info 3
        ld.cs[3].style.transform = "translateY(" + (pos.y * -0.25) + "px)"; // c_Info 4
        ld.cs[4].style.transform = "translateY(" + (pos.y * -0.3) + "px)"; // c_Info 5

        /*
        for (j = 0; j <= ldc_L; j++) { // #lead_sc paragraph points
            if (b["Lc" + (j + 1)].top < (op.svA * aH) && !ld["csX" + (j + 1)]) {
                ld.cs[j].classList.remove("z_Ot"); // show
                ld["csX" + (j + 1)] = true;
            }
        }*/
    }

    requestAnimationFrame(sc_L);
}

sc_L();