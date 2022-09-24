
// misc.

var hm = { // hamburger menu object
        b : document.getElementById("ham_button"), // button
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
    Rd = []; // load-ready - boolean statuses for loading resource elements

///////////////////////////////////////

function reL() { // reload page
    this.location.reload();
    window.location.assign(window.location.href); // FIREFOX support
}

async function resLoad(el, src) { // load a resource to element (img)
    var id = this.location.href, // obtain site URL
        g = (el.length > 1) ? true : false, // grouped elements if length > 1
        i = Rd.length; // GET current index
    if (g) {
        for (var j = i; j <= (i + (el.length - 1)); j++) { 
            Rd[j] = false // loop through (create new) 'Rd' booleans to address group resources 
        }
    } else {
        Rd[i] = false; // apply normally
    }
    const promise = await fetch(id + src) // fetch resource (relatively)
        .then((p) => { // WAIT for result
            const res = p.url; // obtain url 
            if (g) { 
                for (var k = 0; k <= (el.length - 1); k++) {
                    el[k].style.backgroundImage = "url(" + res + ")"; // style
                    Rd[i + k] = true; // verify resource(s) ha(s/ve) been loaded
                }
            } else {
                el.style.backgroundImage = "url(" + res + ")"; // style
                Rd[i] = true;
            }
        })
}

//////////////////////////////////////////

function i_ty(e) { // input type - touch, pen or mouse
    var t = e.pointerType; // obtain pointerType property of PointerEvent interface
    up.t = t; // set to global variable
    up.id = e.pointerId; // set a unique id (for later identification)
    if (t === 'mouse') {
        hm.id = up.id; // equate the id values for 'mouse' input
    }
}

function h_mBv() { // ham. menu button hover stroke(s) dynamics
    if (rL.i) { // only works when int_loaded
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
    }
}

function h_mBs(s) { // ham. menu stroke(s) dynamics
    if (s) {
        hm.zh = false;

        c_rep(hm.k[0], "bC_d", "bC_L"); // change to light contrast (white) base colours
        hm.k[1].style.opacity = 0;
        c_rep(hm.k[2], "bC_d", "bC_L");

        hm.b.classList.add("md_a"); // add a modifier (change in dimensions and padding + addition of bkCol change on :active)

        hm.k[0].style.transform = "translateY(0.565rem) rotate(45deg)"; // rotate to form a cross (closing icon)
        hm.k[2].style.transform = "translateY(-0.165rem) rotate(-45deg)";

        hm.b.removeEventListener("mouseover", h_mBv); // remove hover feature
        hm.b.removeEventListener("mouseout", h_mBv);
    } else {
        c_rep(hm.k[0], "bC_L", "bC_d"); // reverse effect
        hm.k[1].style.opacity = 1;
        c_rep(hm.k[2], "bC_L", "bC_d");

        hm.b.classList.remove("md_a");

        hm.k[0].style.transform = "";
        hm.k[2].style.transform = "";

        hm.b.addEventListener("mouseover", h_mBv); // add hover feature - default
        hm.b.addEventListener("mouseout", h_mBv);
    }   
}

function h_mTg() { // ham. menu toggle
    var s = vw.tB, // get viewport resolution type (check for tablet/desktop)
        h = s ? hm.sc_t : hm.sc, // select mobile or tablet/desktop versions depending on viewport variables
        c = hm.z; 
    if (c && rL.i) { // open menu
        hm.z = false; // change status
        c_rep(document.body, "ovy-s", "ovy-h"); // disable scrolling
        h_mBs(c); // perform button [stroke] dynamisms
        h.style.zIndex = 200; // bring forward to visibility
        if (s) { // if tablet/desktop viewport
            e_Xt(h, "h", true); // reveal menu (slide in)
            hm.t.style.zIndex = 200;
            hm.t.style.backgroundColor = "rgba(48, 48, 48, 0.6)"; // change to transparent (dark) background
        } else {
            e_Fd(h, false); // reveal menu (fade in)
        }
    } else { // close menu
        hm.a = true; // set click activity to true
        hm.z = true;
        hm.m = false; // hover effect requires add. 'mouse' [trigger]movement from user
        h_mBs(c); // perform button [stroke] dynamisms
        h.style.zIndex = "";
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

function num_E(n) { // numeral digit extractor (interger + decimals if any, returns object)
    n = String(n); // convert to string type (if from number type)
    var _L = n.length - 1,
        d = 1, // decimal place property naming (if any)
        _s = true, // switch status (check in control flow switch)
        res = {
            0 : "" // integer 
        };
    for (i = 0; i <= _L; i++) { // loop through received digit sequence (in numeral)
        if (n[i] !== "." && _s) {
            res["0"] += n[i]; // add integer digit(s), inclusive of negative sign
        } else {
            if (_s) {
                i++; // avoid reading decimal point
                _s = false; // change to 'switched' status
            } else {
                d++; // increment (naming purpose)
            }
            res[String(d)] = n[i]; // add digit to new property in object
        }
    }
    return res; // return res.0 = integer, res.1 = first decimal digit, etc.
}

function num_S(n, c, a) { // convert any value to string format + divide into individual span elements
    var e = String(n),
        cL = c + a, // add personalised classes to the span elements
        _L = e.length - 1,
        res = "";
    for (i = 0; i <= _L; i++) {
        res += "<span class=" + cL + ">" + e[i] + "</span>";
    }
    return res;
}

function s_Rep(s, p, n) { // extract/replace [string] character at indiv. pos. with new value
    var a = s.split(''); // split string to indiv. characters
    a[p] = n; // replace with new character
    return a.join(''); // join up characters
}

function getBd(el, p) { // retrieve getBoundingClientRect (bounding rectangle)
    var elB = el.getBoundingClientRect(),
        elBp = elB[p]; // accessing specific property in bound(ed) object
    return elBp;
}

function chkVL(n, s) { // numeral - check for positive/non-zero value
    var res = false;
    if (s) { // check for positive numeral
        if (n > 0) {
            res = true;
        }
    } else {
        if (n !== 0) { // check for non-zero numeral
            res = true;
        }
    }
    return res;
}

function c_css(n, r, e, t) { // create new CSS class - dynamically using JS
    var style = document.createElement("STYLE"); // create 'style' tag
    style.type = "text/css"; 
    style.innerHTML = n + " " + r; // combine name + rule(s)
    document.head.appendChild(style); // append to head
    if (e) { // if to-expiry is active
        setTimeout(function() {
            style.remove(); // remove style element after stipulated time
        }, t);
    }
}

function c_rep(el, d, n) { // replace CSS classes in elements
    el.classList.replace(d, n);
}

hm.b.addEventListener("mouseover", h_mBv); // hover effect (with cursor only)
hm.b.addEventListener("mouseout", h_mBv);

window.addEventListener("resize", function() {
    if (wH !== window.innerHeight && wD !== window.innerWidth) { // check for change in width/height values before proceeding
        wH = window.innerHeight; // update on window size variables
        wD = window.innerWidth; 
        cH = document.documentElement.clientHeight;
        reL(); // reload page
    }
});

hm.b.addEventListener("mousemove", function(event) { 
    hm.m = true; // user mouse movement detected (within element [hamburger-menu button] space)
    event.stopPropagation(); // avoid 'rippling' the event to parents (esp. window)
});

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