
// misc.

var dev = {
        mode : true,  // toggle between develop(er/ing) mode: FOR DEVELOPER PURPOSE ONLY! - ACTIVATE WHEN NEEDED
        url : "https://ivansojivarghese.github.io/" // live URL that [currently] hosts the site: FOR TESTING PURPOSE - CHANGE WHEN NEEDED
    },
    op = { // site 'options'
        s : false, // check boolean - 'force' disable scroll
        t : 200, // transition duration - default (in ms.)
        te : 500, // transition duration (extended)
        Ls : 1000/60, // loop (interval) speed - sec./rev.
        b : { // browser check (major platforms)
            i : false, // samsung internet
            c : false, // chrome
            f : false, // firefox
            s : false, // safari
            o : false, // opera
            e : false // edge
        }
    },
    pos = { // scroll pos.
        y : 0, // y-pos
        a : [0, 0, 0, 0, 0], // comparison array (between consecutive 'n' y-pos values) 
        m : 0, // no. of comparison matches (count)
        i : 0, // loop iterator (for comparison array)  
        c : false, // scrolling change/activity status
        k : null, // at null state = 0
        L : null, // loop variables
        Lc : null
    },
    wH = window.innerHeight, // height
    cH = document.documentElement.clientHeight, // [for mobile/tablet] height, exclusive of URL bar
    wD = window.innerWidth, // width 
    Rd = []; // load-ready - boolean statuses for loading resource elements

///////////////////////////////////////

function reL() { // reload page
    this.location.reload();
    window.location.assign(window.location.href); // FIREFOX support
}

async function resLoad(el, src) { // load a resource to element (img)
    var id = dev.mode ? dev.url : this.location.href, // obtain site URL
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
                if (el[0]) { // support for class elements ('el') with only 1 element
                    el[0].style.backgroundImage = "url(" + res + ")"; // style
                } else {
                    el.style.backgroundImage = "url(" + res + ")"; // style
                }
                Rd[i] = true;
            }
        })/*
        .catch((e) => {

        })*/
}

//////////////////////////////////////////

function sL() { // scroll pos. loop
    pos.y = window.scrollY; // update
}

function c_Sr() { // check for scrolling activity (in live)
    var _L = pos.a.length - 1;
    if (!pos.k) { // if not defined
        pos.k = nwCiArr(pos.a); // define - y-pos (previous 'n' iterations as array - for comparison with live y-pos)  
    }
    if (pos.y !== pos.a[pos.k[pos.i]]) { // if live value is not same as previous
        pos.c = true; // set scrolling to true
        pos.m = 0; // reset no. of matches - reset counter
    } else {
        if (pos.m < (_L - 1)) { 
            pos.m++; // increment no. of positive matches (to reach required threshold)
        } else {
            pos.c = false; // false only when consecutive pos-y values (in pos.a array) match with each other (hence, not scrolling)
        }
    }
    pos.a[pos.i] = pos.y; // update
    if (pos.i < _L) {
        pos.i++; // increment array index accordingly
    } else {
        pos.i = 0;
    }
    if (op.s) { // 'force' enable/disable scroll when required
        document.documentElement.style.overflowY = "hidden"; // html
        document.body.style.overflowY = "hidden"; // body
    } else {
        document.documentElement.style.overflowY = "";
        document.body.style.overflowY = "";
    }
    if (op.b.f && document.documentElement.classList.contains("scB")) { // optimisation for Firefox users
        document.documentElement.classList.remove("scB"); // smooth scrolling is always disabled
    }
}

//////////////////////////////////////////

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

//////////////////////////////////////////

function e_Fd(el, s) { // effect - fading (provided 'trs' class is added to el)
    if (s) { // check if class is present before removing
        el.classList.add("z_O"); // fade out
    } else {
        el.classList.remove("z_O"); // fade in
    }
}

function getBd(el, p) { // retrieve getBoundingClientRect (bounding rectangle)
    var elB = el.getBoundingClientRect(),
        elBp = elB[p]; // accessing specific property in bound(ed) object
    return elBp;
}

function nwCiArr(ar) { // create a comparison [previous index] array
    var a = [],
        _L = ar.length - 1;
    for (i = 0, j = -1; i <= _L; i++, j++) {
        if (i > 0) {
            a[i] = j; // first element = last index of 'ar' array
        }
        else {
            a[i] = _L; // subsequent elements iterate the index, starting from 0
        }
    }
    return a;
}

//////////////////////////////////////////

function c_css(n, r, e, t) { // create new CSS class - dynamically using JS
    var style = document.createElement("STYLE"); // create 'style' tag
    style.type = "text/css"; 
    style.innerHTML = n + " { " + r + " }"; // combine name + rule(s)
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

//////////////////////////////////////////

function scr_t(s) { // scroll toggle
    var h = document.documentElement,
        b = document.body;
    if (s) {
        c_rep(h, "ovy-h", "ovy-s"); // enable scrolling at html
        c_rep(b, "ovy-h", "ovy-s"); // body
    } else {
        c_rep(h, "ovy-s", "ovy-h"); // disable scrolling at html
        c_rep(b, "ovy-s", "ovy-h"); // body
    }
}

//////////////////////////////////////////

window.addEventListener("resize", function() {
    if (wH !== window.innerHeight && wD !== window.innerWidth) { // check for change in width/height values before proceeding
        wH = window.innerHeight; // update on window size variables
        wD = window.innerWidth; 
        cH = document.documentElement.clientHeight;
        reL(); // reload page
    }
});

pos.L = setInterval(sL, op.Ls); // check live scroll pos.
pos.Lc = setInterval(c_Sr, (op.Ls * 2)); // check scroll parameters (at half intervals)