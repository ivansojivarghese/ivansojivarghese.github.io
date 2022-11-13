
// scroll-based loops/functions (local)

var int_H = document.getElementById("intro_hold"),
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

    int_H.style.transform = "translateY(" + (pos.y * 0.5) + "px)";

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