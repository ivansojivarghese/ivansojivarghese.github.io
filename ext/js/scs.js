
// scroll - stats incrementing effect

var sts1 = { // stats numerals
        a : 0, // initial   
        n : 21, // final count - no. of locations (defined as a specific area/region/neighbourhood that can be considered independant of any other)
        e : document.getElementById("stat_1"), // header element
        _L : undefined, // spaces for _L (loop) iterations
        s : false // run (execution) status
    },
    sts2 = {
        a : 0,
        n : 97, // km
        e : document.getElementById("stat_2"), 
        _L : undefined,
        s : false
    },
    sts3 = {
        a : 0,
        n : 183, // hours
        e : document.getElementById("stat_3"),
        _L : undefined,
        s : false
    },
    _Ls; 


function stL() { // scroll-based functions loop (for stats)
    var b1 = getBd(sts1.e, "top"), // get respective 'top' boundaries for each stat
        b2 = getBd(sts2.e, "top"),
        b3 = getBd(sts3.e, "top");
    if (chkVL(b1) && (b1 < wH) && !sts1.s) { // stats 1 (if within viewport visual)
        st_I(sts1);
        sts1.s = true; // only execute each block once
    }
    if (chkVL(b2) && (b2 < wH) && !sts2.s) { // stats 2
        st_I(sts2);
        sts2.s = true;
    }
    if (chkVL(b3) && (b3 < wH) && !sts3.s) { // stats 3
        st_I(sts3);
        sts3.s = true;
    }
}

function st_I(el) { // iterate (effect) to a numeral
    var r = [0.65, 0.85, 0.95, 1], // break-points - to adjust (soothen) speed of setInterval rotation for natural effect
        f = 100, // no. of recursions per second (1000ms.)
        t = 0; 
    el._L = setInterval(function() {
        st_L(el, r, t, f)
    }, 1000/f); // 'f' is initial speed throttle
}

function st_L(el, b, z, s) { // iterate to the target value
    if (el.a < (b[z] * el.n)) { // loop numeral till target breakpoint (before speed slows down)
        el.a++; // target subsequent breakpoint
        el.e.innerHTML = el.a; 
    } else { // breakpoint reached, slow speed
        clearInterval(el._L); // clear the var[obj] at global, then set again with lower speed (half value)
        z++; // standby for subsequent breakpoint 
        if (z <= b.length - 1) {
            el._L = setInterval(function() { // new interval loop with slower speed
                st_L(el, b, z, s/2)
            }, 1000/(s/2));
        }
    }
}

function getBd(el, p) { // retrieve getBoundingClientRect (bounding rectangle)
    var elB = el.getBoundingClientRect(),
        elBp = elB[p]; // accessing specific property in bound(ed) object
    return elBp;
}

function chkVL(n) { // numeral - check for positive value
    var res;
    if (n > 0) {
        res = true;
    } else {
        res = false;
    }
    return res;
}


_Ls = setInterval(stL, 1000/60);