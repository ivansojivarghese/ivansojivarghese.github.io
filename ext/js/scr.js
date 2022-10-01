
// scroll-based loops/functions (local)

var pK = { // peeking chevron
        el : document.getElementById("peekCh"), // element
    },
    ldsc = { // #lead_sc
        el : document.getElementById("lead_sc"),
        b : 0, // bounding
        s : false // execution
    }, 
    s_L = null; // loop variable


function sc_L() { // functions (live on scroll)
    ldsc.b = getBd(ldsc.el, "top");

    if (ldsc.b < (wH * 0.9) && chkVL(ldsc.b, false) && !ldsc.s && rL.i) {
        e_Fd(pK.el, true);
        setTimeout(function() {
            pK.el.classList.add("d_n")
        }, op.t);
        ldsc.s = true; 
    } else if (ldsc.b >= (wH * 0.99)) {
        pK.el.classList.remove("d_n")
        setTimeout(function() {
            e_Fd(pK.el, false);
            ldsc.s = false;
        }, 10);
    }
}


pK.el.addEventListener("click", function() {
    var t = wH * 0.4;
    window.scrollTo(0, t);
});

s_L = setInterval(sc_L, op.Ls);