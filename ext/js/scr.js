
// scroll-based functions

var sc_a = document.getElementById("scroll_arrow"),
    yP, // live scroll pos. (in y-pos)
    _L,

    ldsc = { // scroll(ed) properties of "lead_sc"
        el : document.getElementById("lead_sc"), // element
        b : 0, // bounding property (TBA)
    }; 

function scr_peek() { // peek down the page when clicked upon
    var t = wH * 0.5;
    window.scrollTo(0, t);
}

function sL() { // scroll loop - main
    yP = window.scrollY;
    ldsc.b = getBd(ldsc.el, "top"); // return 'top' bound of "lead_sc" - relative to top of viewport

    if (ldsc.b < (wH * 0.99)) { // if element in view of the user (viewport)
        sc_a.style.opacity = 0; // fade-out
        sc_a.removeEventListener("click", scr_peek); // remove click
        sc_a.style.cursor = "none"; 

        // modLoc(); // add modification(s) to location (refer to fch.js)
    } else {
        sc_a.style.cursor = "pointer"; // reverse effect - if in view
        sc_a.addEventListener("click", scr_peek);
        sc_a.style.opacity = 1;
    }
}


sc_a.addEventListener("click", scr_peek); 

_L = setInterval(sL, 1000/60); // run function as loop code at 60rec/s