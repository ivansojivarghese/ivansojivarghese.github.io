
// hamburger menu functions

var up = { // [user] input
        t : undefined, // type
        id : 0 // unique id (for reference)
    };

hm = { // hamburger menu object
    b : document.getElementById("hamburger_button"), // button
    k : document.getElementsByClassName("st"), // button strokes
    sc : document.getElementById("ham_sc"), // menu screen
    f : 0, // button offset
    e : false, // code execution
    h : false, // latch (to prevent doubling)

    // ft : 0, // "" offset (alignment/scroll) time
    /////

    c : document.getElementById("ham_button-c"), // button strokes container
    sc_t : document.getElementById("ham-tB_sc"), // menu screen - tablet/desktop
    s : hm.s, // menu open status
    z : true, // ready status (ready to be opened?)
    zh : true, // ready status (button hover effect)
    m : false, // mouse-move status (within button)
    a : false, // click activity (from open menu - close menu)
    k3 : false, // link_3 activation
    bL : false,
    bLS : null, // button strokes show loop
    bLH : null, // button strokes hide loop
    id : 0 // input id
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
        if (hm.k3) {
            el.lk3.classList.add("z-G");
        }
        hm.zh = false;
        
        // c_rep(hm.k[0], "bC_d", "bC_L"); // change (upper/lower) strokes to light contrast (white) base colours
        hm.k[1].classList.remove("z_F");
        e_Fd(hm.k[1], true); // hide middle stroke from view
        // c_rep(hm.k[2], "bC_d", "bC_L");

        // hm.b.classList.add("md"); // add a modifier (addition of bkCol change on :active)

        hm.k[0].style.width = "2.5rem";
        hm.k[0].style.transform = "translateY(0.75rem) rotate(45deg)"; // rotate to form a cross (closing icon)
        hm.k[2].style.transform = "translateY(-0.75rem) rotate(-45deg)";

        /*
        hm.b.removeEventListener("mouseover", h_mBv); // remove hover feature
        hm.b.removeEventListener("mouseout", h_mBv);
        */
    } else { // if closing
        // c_rep(hm.k[0], "bC_L", "bC_d"); // reverse effect
        hm.k[1].classList.add("z_F");
        e_Fd(hm.k[1], false);
        // c_rep(hm.k[2], "bC_L", "bC_d");

        hm.b.classList.remove("md");

        hm.k[0].style.width = "1rem";
        hm.k[0].style.transform = "";
        hm.k[2].style.transform = "";
        /*
        hm.b.addEventListener("mouseover", h_mBv); // add hover feature - default
        hm.b.addEventListener("mouseout", h_mBv);
        */
        setTimeout(function() {
            if (hm.k3) {
                el.lk3.classList.remove("z-G");
            }
        }, op.t);
    }   
}

function h_mTg() { // ham. menu toggle
    var s = vw.tB, // get viewport resolution type (check for tablet/desktop)
        h = s ? hm.sc_t : hm.sc, // select mobile or tablet/desktop versions depending on viewport variables
        y = pos.y, // get current y-pos
        f = hm.f, // get button offset
        p = y / f, // offset percentile
        c = hm.z;  // open/close status

        // t = hm.ft, // get button offset alignment time (max)

    if (c) { // open menu

        if (!hm.h) { 

            h_mBs(c); // perform button [stroke] dynamisms

            if (el.ac) {
                el.lk3.classList.add("d_n");
                el.lk3.classList.add("z-G"); // hide arrow
                el.lk3.removeEventListener("click", peek);
                e_Fd(el.lk3b, true); // fade out 
                e_Fd(el.chev, true); 
                el.lk3b.style.height = "0px"; // set link to 0 height
                if (el.c4) {
                    el.bgC[el.bgC.length - 1].classList.add("d_n"); // bg-circle 5
                    el.bgC[el.bgC.length - 1].classList.add("z_O"); // bg-circle 5
                }
            }

            setTimeout(function() {
                installBtnToggle(true);
            }, op.te);
            
            hm.e = true;
            // hm.h = false;
            setTimeout(function() { // latch set-up to avoid double call
                hm.s = true;
                hm.h = true;
            }, op.te);

            if (y !== 0) { // if page has been scrolled (offset) from original
            // op.s = true; 

                im.el.style.transform = "none";

                window.scrollTo(0, 0); // scroll to top (to allow full view of menu)

                // op.s = true; // 'force' disable scroll (secondary)

                // document.body.style.position = "fixed";

                // document.documentElement.classList.remove("scB");

                // console.log(p*t);

                
                setTimeout(function() {
                    // console.log(p);

                    if (p >= 0.55 && !pos.c && !hm.z) { // if offset greater than 55%, conduct secondary check using live-scroll (has to be false - i.e. page is stationary)
                        op.s = true; // 'force' disable scroll (secondary)
                        scr_t(false, null);
                    } else if (!hm.z) {
                        op.s = true; // 'force' disable scroll (secondary)
                        scr_t(false, null);
                    } else {
                        op.s = true;
                    }
                    /*
                    setTimeout(function() {

                    }, (p * t));*/

                    /*
                    if (!op.b.f) {
                        document.documentElement.classList.add("scB");
                    }*/

                }, /*(p * t)*/ 10); // delay function to allow 'pos.c' variable to update

            } else {
                scr_t(false, null);
                op.s = true;
            }
            /*
            if (hm.h) {
                h_mBs(c); // perform button [stroke] dynamisms
            }*/
            // c_rep(h, "z-G", "z-F"); // bring forward in visibility
            im.el.classList.add("z-F");

            ////// 

            if (s) { // if tablet/desktop viewport
                e_Xt(h, "h", true); // reveal menu (slide in)
                hm.t.style.zIndex = 200;
                hm.t.style.backgroundColor = "rgba(48, 48, 48, 0.6)"; // change to transparent (dark) background
            } else {

                h.classList.remove("z-G");
                // c_rep(h, "z_N", "z_G");
                e_Fd(h, false); // reveal menu (fade in)

            }

            hm.z = false; // change status

            /*
            setTimeout(function() {
                int_m.classList.add("h-fx");
            }, 200);*/
            

            //////
        }

    } else { // close menu

        if (hm.h) {

            hm.a = true; // set click activity to true
            hm.z = true;
            hm.m = false; // hover effect requires add. 'mouse' [trigger]movement from user
            h_mBs(c); // perform button [stroke] dynamisms
            // c_rep(h, "z-F", "z-G"); // bring forward in visibility
            im.el.classList.remove("z-F");

            if (s) {
                e_Xt(h, "h", false); // hide menu
                hm.t.style.zIndex = "";
                hm.t.style.backgroundColor = ""; // change to transparent (dark) background
            } else {
                
                e_Fd(h, true); // hide menu
                setTimeout(function() {
                    h.classList.add("z-G");

                    // c_rep(h, "z_G", "z_N");
                    
                    if (el.ac) {
                        el.lk3.classList.remove("d_n");
                        setTimeout(function() {
                            e_Fd(el.lk3b, false); // fade in
                            load_eN();
                            setTimeout(function() {
                                el.lk3.classList.remove("z-G"); // hide arrow
                                el.lk3.addEventListener("click", peek);
                                if (el.c4) {
                                    el.bgC[el.bgC.length - 1].classList.remove("d_n"); // bg-circle 5
                                    setTimeout(function() {
                                        el.bgC[el.bgC.length - 1].classList.remove("z_O"); // bg-circle 5
                                    }, 10);
                                }
                            }, op.t);
                        }, 10);
                    }
                }, op.t);
            }

            scr_t(true, null);    
            op.s = false;

            hm.e = false;

            setTimeout(function() {
                hm.h = false;
                hm.s = false;
            }, op.t);
        }
    }
}

function hamButtonLoad(m) {
    if (m && !hm.bL) { // show
        var j = 0,
            v = [1, 1.75, 2.5],
            showStroke = function() {
                if (j < hm.k.length) {
                    e_Fd(hm.k[j], false);
                    hm.k[j].classList.add("z_F");
                    hm.k[j].style.width = v[j] + "rem";
                    j++;
                } else {
                    hm.b.addEventListener("click", h_mTg); // hamburger menu toggle (open/close)
                    hm.bL = true;
                    clearInterval(hm.bLS);
                }
            };

        showStroke();
        hm.bLS = setInterval(showStroke, (op.t / 2));
    } else if (!m && hm.bL) { // hide
        var j = hm.k.length - 1,
            hideStroke = function() {
                if (j >= 0) {
                    e_Fd(hm.k[j], true);
                    hm.k[j].classList.remove("z_F");
                    hm.k[j].style.width = "";
                    j--;
                } else {
                    hm.b.removeEventListener("click", h_mTg); // hamburger menu toggle (open/close)
                    hm.bL = false;
                    clearInterval(hm.bLH);
                }
            };

        hideStroke();
        hm.bLH = setInterval(hideStroke, (op.t / 2));
    }
}

function installBtnToggle(m) {
    if (m) {
        if (op.pwa.a && !op.pwa.x && !op.pwa.i) {
            op.pwa.x = true;
            op.pwa.iBtn.style.transform = "none";
            e_Fd(op.pwa.iBtn_h, false);
            op.pwa.iBtn.classList.remove("o-img"); // show button
            setTimeout(function() {
                op.pwa.iBtn.addEventListener("click", installPrompt); // add click function
            }, op.t);
        }
    } else {
        if (op.pwa.x) {
            op.pwa.iBtn.removeEventListener("click", installPrompt); // remove click function
            e_Fd(op.pwa.iBtn_h, true);
            op.pwa.iBtn.style.transform = "translateX(calc(7.63rem - 5vw))";
            op.pwa.iBtn.classList.add("o-img"); // hide button
            setTimeout(function() {
                op.pwa.x = false;
            }, op.t);
        }
    }
}


// hm.b.addEventListener("mouseover", h_mBv); // hover effect (with cursor only)
// hm.b.addEventListener("mouseout", h_mBv);
/*
hm.b.addEventListener("mousemove", function(event) { 
    hm.m = true; // user mouse movement detected (within element [hamburger-menu button] space)
    event.stopPropagation(); // avoid 'rippling' the event to parents (esp. window)
});*/

// hm.b.addEventListener("click", h_mTg); // hamburger menu toggle (open/close)


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
