
// JSON fetch APIs

var LOC = enLoc("c", "Singapore"), // ENTER CURRENT (residing) LOCATION - Proper/full form [Capitalise first letter] - 'status', City, State, Country
    c_Loc = { // CURRENT (residing) Location object
        p : {}, // location
        w : {}, // weather
        el : {
            cty : document.getElementById("loc_city"), // location city
            cds : document.getElementById("loc_coords"), // location coords
            wi : document.getElementById("loc_weather_icon"), // location weather icon
            ws : document.getElementById("loc_weather_status"), // location weather status
            wt : document.getElementById("loc_weather_temp") // location weather temp.
        }
    },
    u_Loc = { // USER Location object
        ip : {}, // IP address details
        p : {}, 
        w : {},
        el : {
            tme : document.getElementById("us_loc_time"), // location time
            wi : document.getElementById("us_loc_weather_icon"), // weather icon
            ws : document.getElementById("us_loc_weather_status"), // weather status
            wt : document.getElementById("us_loc_weather_temp") // weather temp
        }
    };


function fchLd() { // fetch load
    geoFch(LOC.f, c_Loc, "p", "w"); // set values to c_Loc (current location)
    if (vw.pH || vw.tB) { // if at phablet/tablet size or greater
        geoIP_Fch(u_Loc, "ip", "tm"); // set values to u_Loc (user[in viewport] location)
    }
}

async function geoFch(c, obj, y, x) { // geocoding/geolocation API
    var lat,
        lat_A,
        lng,
        lng_A,
        s = obj.el,
        r_i;
    
    Rd[Rd.length] = undefined; // set ready-condition boolean [array] space
    r_i = Rd.length - 1;

    const promise = await fetch("https://us1.locationiq.com/v1/search.php?key=pk.2c8acb12acafbc6ca756eb382066219e&q=" + c + "&addressdetails=1&format=json&limit=1")
        .then((p) => p.json()) // arrow functions (ES6) - return a promise, after request has been made - 'r' represents the promise
        .then((d) => d) // receive the DATA - convert to JSON format; // 5000 requests per day - 2 requests per second
        .then((z) => z["0"]) // zero in to results
        .then((o) => {
            obj[y] = o; // set values
        });
    
    lat = Number(obj[y].lat); // get coords (convert from string to number format)
    lat_A = (lat > 0) ? "??N" : "??S"; // direction based on coord ref.
    lng = Number(obj[y].lon);
    lng_A = (lng > 0) ? "??E" : "??W";

    weaFch(lat, lng, obj[y].address.country, obj[y].address.country_code, c_Loc, x, r_i, true); // get weather info using coords
    
    s.cds.innerHTML = lat.toFixed(4) + lat_A + ", " + lng.toFixed(4) + lng_A; // place coords to HTML
}

async function weaFch(lat, lon, con, con_cd, obj, x, d, rte) { // weather API
    var u = checkImpF(con, con_cd, f_countries), // attach appropriate unit based on location
        s = obj.el,
        w_icon,
        w_status,
        w_temp,
        w_reading;

    if (rte) { // primary route (API)
        const promise = await fetch("https://api.weatherbit.io/v2.0/current?lat=" + lat + "&lon=" + lon + "&key=fb71a575c33f447a977fd0ff8038c068&units=" + u.s)
            .then((p) => p.json())
            .then((d) => d)
            .then((z) => z.data["0"]) // max 15,000 calls per month (500 calls per day)
            .then((o) => {
                obj[x] = o;
                obj[x].unit = u.r; // set unit reading scale (C or F)
            })
            .catch((e) => { // catch any errors when fetching (may occur when limit exceeded)
                weaFch(lat, lon, con, con_cd, obj, x, d, false); // re-call function with different API, if primary fails
            });

        w_icon = obj[x].weather.icon; // icon
        w_status = obj[x].weather.description; // status
        w_temp = obj[x].temp.toFixed(); // get temp. (rounded)
        w_reading = obj[x].unit;

        s.wi.style.backgroundImage = "url(png/weather/" + w_icon + ".png)"; // set image
        s.wt.innerHTML = w_temp  + w_reading;

    } else { // secondary route (API - if primary fails)
        var temp_u = (u.s === "M") ? "metric" : "imperial", // set temp units based on user location
            i_url;

        const promise = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=62dfc011a0d14a0996e185364706fe76&units=" + temp_u)
        .then((p) => p.json())
        .then((d) => d) // 1,000,000 calls per month - 60 calls / minute    
        .then((o) => {
            obj[x] = o;
            obj[x].unit = u.r;
        });

        i_url = obj[x].weather["0"].icon; // icon url
        w_icon = "http://openweathermap.org/img/wn/" + i_url + "@2x.png"; // get relative icon address
        
        w_status = obj[x].weather["0"].description; // weather status
        w_temp = obj[x].main.temp.toFixed(); // weather temp.
        w_reading = obj[x].unit;

        s.wi.style.backgroundImage = "url(" + w_icon + ")"; // concatenate
        s.wt.innerHTML = w_temp + w_reading;
    }

    if (s.ws) { // if element defined
        s.ws.innerHTML = w_status; // add info
    }
    if (s.wt.innerHTML !== "") { // set condition if data has been inserted
        Rd[d] = true; // set ready-condition
    }
}

async function geoIP_Fch(obj, y, x) { // IP address to approx. geolocation converter API
    var lat,
        lng,
        c,
        t_L,
        r_i;

    Rd[Rd.length] = undefined;
    r_i = Rd.length - 1;

    const promise = await fetch("https://ipgeolocation.abstractapi.com/v1/?api_key=d48adb952199422b80166245051a126a") // obtain user geolocation using public IP Address
        .then((p) => p.json())
        .then((d) => d) // 20,000 calls per month
        .then((o) => {
            obj[y] = o;
        });

    lat = obj[y].latitude; // get coords
    lng = obj[y].longitude;
    c = obj[y].country;

    tmFch(obj[y].timezone.name, obj, x); // set Time info
    
    t_L = setInterval(function() { // loop (every second) to track time
        tmFch(obj[y].timezone.name, obj, x); // set Time info (repeating interval)
    }, 60000);
    weaFch(lat, lng, c, null, u_Loc, "w", r_i, true); // set weather info
}

async function tmFch(tz, obj, y) { // time zone to time API
    var s = obj.el,
        str,
        dt;

    const promise = await fetch("https://api.ipgeolocation.io/timezone?apiKey=0bbc4727966a4b7286fc20fab600a35a&tz=" + tz)
        .then((p) => p.json())
        .then((d) => d) // 30,000 calls per month - 1000 per day
        .then((o) => {
            obj[y] = o;
        })
        .catch((e) => {
            console.log(e);
        });

    if (obj[y].time_24) { // if property is defined (exists as per normal)
        str = obj[y].time_24.slice(0, 5); // slice the time (HH:MM) within string 
    } else { // obtain time using built-in JS methods
        dt = new Date();
        var dt_h = dt.getHours(),  // hours and minutes
            dt_m = dt.getMinutes(),
            _h = (dt_h < 10) ? "0" + dt_h : dt_h, // add zero as prefix if single digit values
            _m = (dt_m < 10) ? "0" + dt_m : dt_m;
        str = _h + ":" + _m;
    }

    s.tme.innerHTML = str; // place in HTML
}

////////////////////////////////

function enLoc(v, city, state, country) { // enter location details form
    var r = {
            f : city, // full form - for API geocoding fetching, etc.
            c : city, // city form - to place in visible HTML
            s : v // status check (boolean) to show full or city form
        };
    for (i = 2; i <= (arguments.length - 1); i++) {
        if (arguments[i] !== undefined) {
            r.f += ", " + arguments[i]; // concatenate extra details[strings] if needed
        }
    }
    return r;
}

function checkImpF(c, cd, arr) { // return 'F' if country uses imperial - fahrenheit degree scale (refer to fahrenheit_countries.json)
    var _L = arr.length - 1,
        u = {
            s : "M", // return unit system (metric by default)
            r : "??C" // unit system reading (Degree Celcius by default)
        };
    for (i = 0; i <= _L; i++) {
        if ((c === arr[i].country) || ((cd === arr[i].iso_A2) || (cd === arr[i].iso_A2.toLowerCase()))) { // if a match is found (contry full name or ISO_A2 code), change the units
            u.s = "I"; // return imperial
            u.r = "??F"; // change to Degree Fahrenheit
        }
    }
    return u;
}
