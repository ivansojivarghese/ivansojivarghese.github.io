
// effects

function e_Fd(el, s) { // effect - fading (provided 'trs' class is added to el)
    if (s) { // check if class is present before removing
        el.classList.add("z_O"); // fade out
    } else {
        el.classList.remove("z_O"); // fade in
    }
}

function e_Xt(el, m, s) { // effect - translate-x fade in (countering .z_O series CSS classes)
    var cL = "z_O" + m; // add modifer string character to class .z_O
    if (s) {
        el.classList.remove(cL); // remove the class
    } else { 
        el.classList.add(cL); // add ""
    }
}

function e_Sdv(el, s) { // effect - slide up/down (vertically) [text, images, etc.]
    if (s) { // slide from bottom (to up)
        el.classList.remove("down");
    } else { // slide from top (to bottom)
        el.classList.add("down");
    }
}
/*
function e_Sdh(el, tg, w, r, x, y) { // effect - slide in/out (horizontally)
    var e = el.id; // get 'id' attribute value of element
    c_css("#" + e + "::before", "{ width: " + w + "%; }", true, trD_a); // apply [temporary] width to 'slider'
    setTimeout(function() {
        e_Fd(tg, false); // fade in the target element
        if (x && y) { // if any class replacement requested
            c_rep(el, y, x); // replace classes in element
        }
        c_css("#" + e + "::before", "{ width: " + 0 + "%; right: " + r + "%; }", true, trD_a); // remove the width added
        setTimeout(function() {
            c_css("#" + e + "::before", "{ display: none; }", false); // no display afterwards
        }, trD_a);
    }, trD_a); // after .trs.md duration
}*/

function e_Ic(el, p, f) { // effect - iterating digits on a numeral (in a string/text setting)
    p = (p !== null) ? String(p) : p;  // convert to string format (if not null)
    var r = p ? [1] : [0.65, 0.85, 0.95, 1], // break-points - to adjust (soothen) speed of setInterval rotation for natural effect (alt. [no/few breakpoints] in special cases such as digit incrementing)
        t = 0; 
    if (p) {
        el._L[p] = setInterval(function() {
            st_L(el, p, r, t, f)
        }, 1000/f); // 'f' is initial speed throttle
    } else {
        el._L = setInterval(function() {
            st_L(el, p, r, t, f)
        }, 1000/f); // 'f' is initial speed throttle
    }
}

function e_Tp(cL, n) { // reveal text (with individual character span elements) - 'typing' fade-in effect
    cL[n].classList.add("bC_d"); // add background color (#303030) to span character 
    setTimeout(function() {
        cL[n].classList.replace("c_t", "c_d"); // make font color visible
        cL[n].classList.remove("bC_d"); // remove background
        if (n < (cL.length - 1)) { // if index not reached loop limit (no. of elements in class)
            n++; // increment index and re-invoke function
            setTimeout(function() {
                e_Tp(cL, n);
            }, trD); // re-invoke after slight delay to give processing time
        }
    }, trD);
}

/////////////////////////////////////////////////

function st_L(el, p, b, z, s) { // iterate to the target value
    if (p) { // using indexed elements
        if (el.a[p] < (b[z] * el.n[p])) { // loop numeral till target breakpoint (before speed slows down)
            el.a[p]++; // target subsequent breakpoint
            el.e[p].innerHTML = el.a[p]; 
        } else if (el.a[p] > (b[z] * el.n[p])) { // if target numbers are in reverse order (i.e. negatives)
            el.a[p]--; // reverse the sequence
            el.e[p].innerHTML = el.a[p]; 
        } else { // same process - using indexed elements
            clearInterval(el._L[p]); // clear the var[obj] at global, then set again with lower speed (half value)
            z++; // standby for subsequent breakpoint 
            if (z <= b.length - 1) {
                el._L[p] = setInterval(function() { // new interval loop with slower speed
                    st_L(el, p, b, z, s/2)
                }, 1000/(s/2)); 
            }
        }
    } else { // normal - no indexing elements used
        if (el.a < (b[z] * el.n)) { 
            el.a++; 
            el.e.innerHTML = el.a; 
        } else if (el.a < (b[z] * el.n)) {
            el.a--; 
            el.e.innerHTML = el.a; 
        } else {
            clearInterval(el._L); // clear the var[obj] at global, then set again with lower speed (half value)
            z++; // standby for subsequent breakpoint 
            if (z <= b.length - 1) {
                el._L = setInterval(function() { // new interval loop with slower speed
                    st_L(el, p, b, z, s/2)
                }, 1000/(s/2)); 
            }
        }
    }
}

function i_Sp(t) { // return the required no. of iterations per second (for digit incrementation effect)
    var r = 1; // default iteration rate: 1 iteration per second 
    return (t / r); // return the 'speed' : 'distance' / 'time' as per d=vt formula

    // return value based on distance (i.e. value of target from zero)
        // low distance = low value
        // high distance = high value
}

/////////////////////////////////////////

// REFERENCED FROM KIRUPA.COM @https://forum.kirupa.com/t/make-your-inputs-pop-with-the-typewriter-effect/646148

var words;

let count = 0;
let letter = 0;
let wordToPrint = "";
let direction = "forward";

function e_wCycle(el, w) { // word typing effect
    if (words === undefined) {
        words = w;
    }
    let word = words[count];

    if (direction == "forward") { // moving characters forward
        if (letter < word.length) {
            wordToPrint += word[letter];
            letter++;

            updateText(wordToPrint, el);
        } else { // moving backward
            direction = "backward";
        }
    } else {
        if (wordToPrint.length > 1) {
            wordToPrint = wordToPrint.slice(0, -1);

            updateText(wordToPrint, el);
        } else {
            startOver();
        }
    }
}

function startOver() {
    resetState();

    if (count < words.length - 1) {
        count++;
    } else {
        count = 0;
    }
}

function resetState() {
    letter = 0;
    wordToPrint = " ";
    direction = "forward";
}

function updateText(text, el) {
    el.textContent = text;
}