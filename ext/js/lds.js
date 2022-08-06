
// load location elements/objects/functions

var c_name = LOC[LOC.s], // name of city (or location)
    insc = {
        s : document.getElementById("scroll_arrow"), // scroll arrow
        c : document.getElementById("intsc_c"), // intro content
        p : document.getElementById("profile_img") // profile image

        // pe : document.getElementById("intscP_p"), // intro para. (phablet)
        // i : document.getElementById("profile_img_p") // profile image
    },  

    loc_cds_D = 4, // no. of decimal places for loc_coords
    loc_lat_i = { // loc_coords lat. increment main object
        a : {}, // initials (TBA object)
        n : {}, // final count (TBA object)
        e : document.getElementsByClassName("loc_coords_lat"), // element(s)
        _L : [] // spaces for _L (loop) iterations
    },
    loc_lng_i = { // loc_coords lng. increment main object
        a : {}, 
        n : {}, // final count (TBA object)
        e : document.getElementsByClassName("loc_coords_lng"), // element(s)
        _L : [] 
    };


function int_LoadUp() { // load-up (animated) for landing zone (unique for every page)
    /*
    if (vw.pH || vw.tB) { // if in tablet/phablet res. or greater
        e_Xt(insc.p, "t", true); // fade in/transform text effect
    }*/

    document.body.classList.add("ovy-s"); // set overflow-y to body (default for all 'int_LoadUp' functions)
    hm.b.addEventListener("click", h_mTg); // add click event to for ham. menu access
    rL.i = true; // int loaded
}
    
function loadUp() {
    var c_nId = 'loc_city_name', // loc city name id (element - applicable to mobile only)
        _L = loc_cds_D, // loc_coords max. decimals
        _I = 0; // loc_coords_initial

    c_css(".trs, .trs-p::before, .trs-p::after", "{ transition-duration:" + (trD/1000) + "s; }", null, null); // apply default transitioning timing (as new rule to common styling)
    c_css(".trs.md, .trs-p.md::before, .trs-p.md::after", "{ transition-duration:" + (trD_a/1000) + "s; }", null, null); // "" new rule - animation timing

    insc.s.addEventListener("click", scr_peek);  // add click event to scroll arrow

    if (!vw.pH && !vw.tB) { // apply to only mobile devices
        insc.c.style.marginTop = "calc(((0.95 * " + cH + "px) - 31.1rem) / 2)"; // calculated formula - centralising element [to centre] inbetween top & bottom margined elements
        lcsc.wtR = 0.6; // default rate of translation
    } else if (vw.pH && !vw.tB) { // apply only to phablet devices
        insc.c.style.marginTop = "calc(((0.95 * " + cH + "px) - 28.1rem) / 2)"; // same formula - slight difference in measurements (due to change in profile_img size)
        lcsc.wtR = 0.5; // slower rate (due to shortened 'height:width' ratio)
    } else if (!vw.pH && vw.tB) { // apply only to tablet devices
        c_rep(insc.p, "m_Az", "m_L-15"); // apply left margin only
    }

    c_Loc.el.cty.innerHTML = "<span id=" + c_nId + ">" + c_name + "</span>"; // enter the city name (or city, state/country if needed) - contain inside span
    lcsc.ct = document.getElementById(c_nId); // add to global

    lcsc.sc = document.getElementById("loc_city_sec"); // location - city (secondary element)
    lcsc.sc.innerHTML = c_name;
    if (vw.tB) { // apply to tablet/desktop device
        // c_rep(lcsc.t, "m_L-10", "z_O"); // replace marginalisation with zero opacity
        lcsc.i.classList.add("d_n"); // add no display to background image (location)
        lcsc.t.classList.remove("m_L-10");
        lcsc.t.classList.add("img", "trs", "c_w");

        hdcnt.el.classList.add("c_d"); // changes to font-color in #hd_cnt
        hdcnt.g.classList.remove("c_t");

        thwsc.n.classList.add("inC"); // inverse-color to slide-in/out effect

        // lcsc.t.classList.add("trs"); // add transitioning
        // lcsc.t.classList.add("c_w"); // add font-color: white
    }

    for (i = 0; i <= _L; i++) { // add initial(s) numerals of loc_coords to HTML - lat./lng.
        // lat.
        loc_lat_i.a[String(i)] = _I; // add to initials' properties in main objects
        loc_lat_i.e[i].innerHTML = _I; // referece to html
        // lng.
        loc_lng_i.a[String(i)] = _I;
        loc_lng_i.e[i].innerHTML = _I;
    }

    if (vw.pH || vw.tB) { // if phablet/tablet orientation (see below)
        sts2.e = document.getElementById("stat_2_ph"); // set 'stats_2' header el.
    }
    if (vw.tB) { // if tablet orientation (only)
        sts3.e = document.getElementById("stat_3_ph"); // set new el. 
    }

    fchLd(); // fetch APIs
}