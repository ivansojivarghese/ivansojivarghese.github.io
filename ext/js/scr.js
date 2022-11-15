
// scroll-based loops/functions (local)

var im = { // #intro_main
        el : document.getElementById("intro_main"),
        t : document.getElementById("h_tint"), // background tint
        tp : document.getElementById("tpZ"),
        tpR : 0
    };
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
    if (pos.y > 0) {
        hm.b.classList.remove("en"); // remove ':active' feedback when scrolled
    } else {
        hm.b.classList.add("en");
    }
    im.t.style.backgroundColor = "rgba(48, 48, 48, " + (pos.y * im.tpR) + ")"; // #intro_main tint opacity

    if (!op.s) {
        im.el.style.transform = "translateY(" + (pos.y * hm.p) + "px)";
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