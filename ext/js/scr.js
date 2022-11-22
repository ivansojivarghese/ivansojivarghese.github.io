
// scroll-based loops/functions (local)

var im = { // #intro_main
        el : document.getElementById("intro_main"),
        t : document.getElementById("h_tint"), // background tint
        L : document.getElementById("lead_sc"),
        // tp : document.getElementById("tpZ"), // trapezoid
        j : 0,
        p : 0.25, // parallax scroll constant
        s : true // code execution status
    },
    s_L = null; // loop variable

/*pK = { // peeking chevron
        el : document.getElementById("peekCh"), // element
        t : cH * 0.4 // target
    },
    ldsc = { // #lead_sc
        el : document.getElementById("lead_sc"),
        b : 0, // bounding
        s : false // execution
    }, 
    s_L = null; // loop variable*/


function sc_L() { // functions (live on scroll)
    /*
    if (pos.y > 0) {
        hm.b.classList.remove("en"); // remove ':active' feedback when scrolled
    } else if (!pos.c) {
        setTimeout(function() {
            hm.b.classList.add("en"); // active if live-scroll is false (at pos.y = 0)
        }, op.t); // set after trs. duration
    }*/

    if ((pos.y < (cH / op.e)) && !pos.r && num_Ct(pos.v, op.e, true) && im.s) { // during a high-speed reverse scroll to the top (pos.y < threshold of viewport)

        im.t.classList.add("trs");
        im.t.style.backgroundColor = "rgba(48, 48, 48, 0)"; // set opacity to 0
        
        // re = im.j / 2;

        im.s = false;
        console.log("high speed");
    } else {
        if (im.s) {
            im.t.style.backgroundColor = "rgba(48, 48, 48, " + (pos.y * im.j) + ")"; // #intro_main tint opacity
        }
        
        // if (pos.y > (cH / op.e)) {
        if (pos.r) {

            im.s = true; // enabler
            im.t.classList.remove("trs");
            // re = im.j;
        }
    }
    if (!op.s) {
        im.el.style.transform = "translateY(" + (pos.y * im.p) + "px)";
    }

    // hamB.style.transform = "translateY(" + (pos.y * 0.5) + "px)";

    /*
    ldsc.b = getBd(ldsc.el, "top");

    if (ldsc.b < (cH * 0.95) && chkVL(ldsc.b, false) && !ldsc.s && rL.i) { // if following section at 95% mark of viewport (when scrolled)
        e_Fd(pK.el, true);
        setTimeout(function() {
            pK.el.classList.add("d_n") // hide chevron
        }, op.t);
        ldsc.s = true; 
    } else if (ldsc.b >= (cH * 0.95)) {
        pK.el.classList.remove("d_n") // show chevron when scrolling back
        setTimeout(function() {
            e_Fd(pK.el, false);
            ldsc.s = false;
        }, 10);
    }*/
}

/*
pK.el.addEventListener("click", function() {
    if (op.b.f) {
        document.documentElement.classList.add("scB"); // add the smooth scrolling class for FireFox platform users
    }
    window.scrollTo(0, pK.t); // peek to target - 40% of following section
});*/

s_L = setInterval(sc_L, op.Ls); // live loop