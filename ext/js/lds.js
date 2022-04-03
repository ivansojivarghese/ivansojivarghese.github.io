
// load location elements/objects/functions

var c_name = LOC[LOC.s], // name of city (or location)
    loc_Csec = document.getElementById("loc_city_sec"), // location - city (secondary element)
    int_c = document.getElementById("intro_con"); // intro content 

    
function loadUp() {
    if (!vw.pH && !vw.tB) { // apply to only mobile devices
        int_c.style.marginTop = "calc(((0.95 * " + cH + "px) - 31.1rem) / 2)"; // calculated formula - centralising element [to centre] inbetween top & bottom margined elements
    }
    c_Loc.el.cty.innerHTML = c_name; // enter the city name (or city, state/country if needed)
    loc_Csec.innerHTML = c_name;

    if (vw.pH || vw.tB) { // if phablet/tablet orientation (see below)
        sts2.e = document.getElementById("stat_2_ph"); // set 'stats_2' header el.
    }
    if (vw.tB) { // if tablet orientation (only)
        sts3.e = document.getElementById("stat_3_ph"); // set new el. 
    }

    fchLd(); // fetch APIs
}