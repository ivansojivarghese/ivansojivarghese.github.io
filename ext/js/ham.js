
// hamburger menu functions

var hm = { // hamburger menu object
        b : document.getElementById("hamburger_button"), // button
        f : 0, // button offset
        ft : 0, // "" offset (alignment/scroll) time

        /////

        c : document.getElementById("ham_button-c"), // button strokes container
        k : document.getElementsByClassName("stroke"), // button strokes

        sc : document.getElementById("ham_sc"), // menu screen
        sc_t : document.getElementById("ham-tB_sc"), // menu screen - tablet/desktop

        t : document.getElementById("b_Tint"), // background tint
        z : true, // ready status (ready to be opened?)
        zh : true, // ready status (button hover effect)
        m : false, // mouse-move status (within button)
        a : false, // click activity (from open menu - close menu)
        id : 0 // input id
    },
    up = { // [user] input
        t : undefined, // type
        id : 0 // unique id (for reference)
    };


function i_ty(e) { // input type - touch, pen or mouse
    var t = e.pointerType; // obtain pointerType property of PointerEvent interface
    up.t = t; // set to global variable
    up.id = e.pointerId; // set a unique id (for later identification)
    if (t === 'mouse') {
        hm.id = up.id; // equate the id values for 'mouse' input
    }
}

function h_mBv() { // ham. menu button hover stroke(s) dynamics
    // if (rL.i) { // only works when int_loaded
        if ((hm.zh && (up.t === 'mouse')) || (hm.zh && hm.z)) {  // if ('hover-ready' AND mouse input) OR ('hover-ready' AND menu closed)
            hm.zh = false;
            hm.a = false; // reset
            hm.k[0].style.transform = "translateX(-50%)"; // half in view for 1st and 3rd strokes
            hm.k[2].style.transform = "translateX(50%)";
        } else if (hm.z && !hm.zh) { // if ONLY (menu closed) and 'hover-ready' is false
            if (hm.a) { // if button click just occurred (from open menu to close menu)
                hm.zh = false; // no hover effect
            } else {
                hm.zh = true; // otherwise - proceed as default (set 'hover-ready')
            }
            hm.k[0].style.transform = "";
            hm.k[2].style.transform = "";
        }
    // }
}

function h_mBs(s) { // ham. menu stroke(s) dynamics
    if (s) { // if opening
        hm.zh = false;

        c_rep(hm.k[0], "bC_d", "bC_L"); // change (upper/lower) strokes to light contrast (white) base colours
        e_Fd(hm.k[1], true); // hide middle stroke from view
        c_rep(hm.k[2], "bC_d", "bC_L");

        hm.b.classList.add("md"); // add a modifier (addition of bkCol change on :active)

        hm.k[0].style.transform = "translateY(0.75rem) rotate(45deg)"; // rotate to form a cross (closing icon)
        hm.k[2].style.transform = "translateY(-0.75rem) rotate(-45deg)";

        /*
        hm.b.removeEventListener("mouseover", h_mBv); // remove hover feature
        hm.b.removeEventListener("mouseout", h_mBv);
        */
    } else { // if closing
        c_rep(hm.k[0], "bC_L", "bC_d"); // reverse effect
        e_Fd(hm.k[1], false);
        c_rep(hm.k[2], "bC_L", "bC_d");

        hm.b.classList.remove("md");

        hm.k[0].style.transform = "";
        hm.k[2].style.transform = "";
        /*
        hm.b.addEventListener("mouseover", h_mBv); // add hover feature - default
        hm.b.addEventListener("mouseout", h_mBv);
        */
    }   
}

function h_mTg() { // ham. menu toggle
    var s = vw.tB, // get viewport resolution type (check for tablet/desktop)
        h = s ? hm.sc_t : hm.sc, // select mobile or tablet/desktop versions depending on viewport variables
        y = pos.y, // get current y-pos
        f = hm.f, // get button offset
        t = hm.ft, // get button offset alignment time (max)
        c = hm.z;  // open/close status
    if (c) { // open menu
        hm.z = false; // change status

        if (y !== 0) { // if page has been scrolled (offset) from original
            op.s = true; // 'force' disable scroll (secondary)
            window.scrollTo(0, 0); // scroll to top (to allow full view of menu)
            setTimeout(function() {
                // if (!pos.c) {
                    op.s = false; // 'force' enable scroll (secondary)
                    c_rep(document.body, "ovy-s", "ovy-h"); // disable scrolling after a delay
                // }
            }, (y / f) * t); // delay function to allow 'pos.c' variable to update
        } else {
            c_rep(document.body, "ovy-s", "ovy-h"); // disable scrolling normally
        }

        h_mBs(c); // perform button [stroke] dynamisms
        c_rep(h, "z-G", "z-F"); // bring forward in visibility

        ////// 

        if (s) { // if tablet/desktop viewport
            e_Xt(h, "h", true); // reveal menu (slide in)
            hm.t.style.zIndex = 200;
            hm.t.style.backgroundColor = "rgba(48, 48, 48, 0.6)"; // change to transparent (dark) background
        } else {
            e_Fd(h, false); // reveal menu (fade in)
        }

        //////

    } else { // close menu

        hm.a = true; // set click activity to true
        hm.z = true;
        hm.m = false; // hover effect requires add. 'mouse' [trigger]movement from user
        h_mBs(c); // perform button [stroke] dynamisms
        c_rep(h, "z-F", "z-G"); // bring forward in visibility

        if (s) {
            e_Xt(h, "h", false); // hide menu
            hm.t.style.zIndex = "";
            hm.t.style.backgroundColor = ""; // change to transparent (dark) background
        } else {
            e_Fd(h, true); // hide menu
        }

        c_rep(document.body, "ovy-h", "ovy-s"); // enable scrolling
    }
}


// hm.b.addEventListener("mouseover", h_mBv); // hover effect (with cursor only)
// hm.b.addEventListener("mouseout", h_mBv);
/*
hm.b.addEventListener("mousemove", function(event) { 
    hm.m = true; // user mouse movement detected (within element [hamburger-menu button] space)
    event.stopPropagation(); // avoid 'rippling' the event to parents (esp. window)
});*/

hm.b.addEventListener("click", h_mTg); // hamburger menu toggle (open/close)


window.addEventListener("mousemove", function() { // cursor movement through window
    if (hm.id !== up.id && hm.m) { // if (input id values do not match) AND [cursor]movement detected in hamburger button
        hm.zh = false; // set false to 'hover-ready'
    } else if (hm.z) { // if menu closed
        hm.zh = true; 
    }
    hm.m = false; // no user movement in hamburger-menu button
});

window.addEventListener("pointerdown", function(event) { // detection of touch/pen or mouse input from user
    i_ty(event);
}); 
