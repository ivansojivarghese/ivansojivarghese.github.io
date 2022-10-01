
// scroll-based loops/functions (local)

var pK = { // peeking chevron
        el : document.getElementById("peekCh"), // element
        b : 0, // bounding
        s : false, // execution
        t : 0.4 // window target (percentile)
    },
    s_L = null; // loop variable


function sc_L() { // functions (live on scroll)
    pK.b = getBd(pK.el, "top");

    if (pK.b < (wH * 0.8) && chkVL(pK.b, false) && !pK.s && rL.i) {
        pK.el.style.transform = "rotate(-180deg)";
        pK.s = true;
    }
}


pK.el.addEventListener("click", function() {
    var t = wH * 0.4;
    window.scrollTo(0, t);
});

// s_L = setInterval(sc_L, op.Ls);