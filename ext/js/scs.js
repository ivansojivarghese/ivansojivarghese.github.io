
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
        e_Ic(sts1, null, sts1.n);
        sts1.s = true; // only execute each block once
    }
    if (chkVL(b2) && (b2 < wH) && !sts2.s) { // stats 2
        e_Ic(sts2, null, sts2.n);
        sts2.s = true;
    }
    if (chkVL(b3) && (b3 < wH) && !sts3.s) { // stats 3
        e_Ic(sts3, null, sts3.n);
        sts3.s = true;
    }
}
/*
function st_I(el, p, f) { // iterate (effect) to a numeral (in a string/text setting)
    p = (p !== null) ? String(p) : p;  // convert to string format (if not null)
    var r = p ? [1] : [0.65, 0.85, 0.95, 1], // break-points - to adjust (soothen) speed of setInterval rotation for natural effect (alt. [no/few breakpoints] in special cases)
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
}*/


_Ls = setInterval(stL, 1000/60);