
// scroll-based loops/functions (local)

var im = { // #intro_main
        el : document.getElementById("intro_main"),
        t : document.getElementById("h_tint"), // background tint
        L : document.getElementById("lead_sc"),
        j : 0,
        p : 0.5, // parallax scroll constant
        s : true // code execution status
    },
    s_L = null; // loop variable


function sc_L() { // functions (live on scroll)
    var d = (pos.yA !== 0) ? Math.abs(pos.y - pos.yA) : 0; // obtain distance of scroll
    if (d > pos.st) { // check if scroll distance is valid (of a true scroll - prevents unwanted scrolling)
        if (pos.y === 0 && !pos.r && num_Ct(pos.v, op.e, true) && im.s) { // during a high-speed reverse scroll to the top (pos.y < threshold of viewport)
            im.t.classList.add("trs"); // add transitioning for 'smoothening' of effect
            im.s = false;
        } else {
            if (im.s && im.t.classList.contains("trs")) { // remove the effect once scrolling complete (high-speed)
                im.t.classList.remove("trs");
            } else if ((pos.y > 0) || num_Ct(pos.v, op.e, false) || pos.r) { // reset
                im.s = true; // enabler
            }
        }
    }

    // im.t.style.backgroundColor = "rgba(48, 48, 48, " + (pos.y * im.j) + ")"; // #intro_main tint opacity
    /*
    if (!op.s) {
        im.el.style.transform = "translateY(" + (pos.y * im.p) + "px)"; // #intro_main transform
    }*/
}

s_L = setInterval(sc_L, op.Ls); // live loop