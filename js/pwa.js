
var sI_1 = {},
    sI_2 = {},
    sI_3 = {};

var pwa_Ld = null,
    sectionScroll = false,
    sectionScrollPos = 0;

var btty = {
    level : 0,
    chargingTime : 0,
    dischargingTime : 0,
    charging : null
};

var rL = {
    el : document.getElementById("load_sc"), 
    r : document.getElementById("loadR"), // loading rings (container)
    p : document.getElementById("loadR-p"), // loading ring (primary)
    d : document.getElementById("loadR-e"), // loading ring (end)
    c : document.getElementById("loadR-s") // loading ring (secondary)
}

const sections = document.querySelector('.pwa .sections');
// const navbarButtons = document.querySelectorAll('.pwa .navbar .button');

var oriHeight_L = null,
    tabs = ["home", "clicks", "code", "diary", "about"],
    defTab = tabs[0],
    activeTab = defTab;

sI_1 = { // stats numerals
    a : 0, // initial   
    n : 97,
    _L : undefined, // spaces for _L (loop) iterations
    s : false // run (execution) status
};
sI_2 = {
    a : 0,
    n : 183, // hours
    _L : undefined,
    s : false
};
sI_3 = {
    a : 0,
    n : 245, // cappuccinos
    _L : undefined,
    s : false
};

screen.orientation.addEventListener("change", function() {
    const sections = document.querySelector('.pwa .sections');
    if (screen.orientation.angle == 90 || screen.orientation.angle == 270) { // P to L
        // sections.style.height = "100svh";
    }
    if (screen.orientation.angle == 0 || screen.orientation.angle == 180) { // L to P
        /*
        if (window.innerWidth < 490) {
            sections.style.height = "calc(" + dev.uH.getBoundingClientRect().height + "px - 4rem)";
        }
        oriHeight_L = setInterval(function() {
            if (window.innerWidth < 490) {
                sections.style.height = "calc(" + dev.uH.getBoundingClientRect().height + "px - 4rem)";
                clearInterval(oriHeight_L);
            }
        }, 10);*/
    }
});

function navButtonActive(b, e, v) {
    var target = e.currentTarget || e;
    const buttons = document.querySelectorAll('.pwa .navbar .button');

    /*
    if (target.classList.contains("about") || target.classList.contains("about_dark")) {
        const profile_image = document.querySelector('.pwa .profile_image');
        e_Fd(profile_image, false);
    }*/

    if (target.classList.contains("hoverB") || v) {

        for (i = 0; i < buttons.length; i++) { // remove from other non-targets
            if (buttons[i] !== target) {
                if ((buttons[i].classList.contains("buttonActive") && !op.darkChange) || (!buttons[i].classList.contains("buttonActive") && op.darkChange)) {
                    var old;
                    for (j = 0; j < buttons[i].classList.length; j++) {
                        if (buttons[i].classList[j] !== "button" && buttons[i].classList[j] !== "buttonActive" && buttons[i].classList[j] !== "trs" && buttons[i].classList[j] !== "hoverB") {
                            old = buttons[i].classList[j];
                            break;
                        }
                    }
                    if (op.darkMode) {
                        buttons[i].children[0].style.backgroundImage = "url('../pwa/" + old + ".png')";
                    } else if (!op.darkMode) {
                        buttons[i].children[0].style.backgroundImage = "url('../pwa/" + old + ".png')";
                    }
                    e_Fd(buttons[i].children[0].children[0], true); 
                    buttons[i].classList.remove("buttonActive");

                    buttons[i].classList.add("hoverB");
                    buttons[i].addEventListener('mousemove', hoverInit);
                    buttons[i].addEventListener('mouseleave', hoverEnd);

                }
            }
        }

        if (!target.classList.contains("buttonActive") || (target.classList.contains("buttonActive") && (target.classList.contains(b) || target.classList.contains(b + "_dark")))) { // set on target
            if ((op.darkMode && op.darkChange && target.classList.contains("buttonActive")) || (!op.darkMode && !op.darkChange && !target.classList.contains("buttonActive"))) {
                target.children[0].style.backgroundImage = "url('../pwa/" + b + "_active.png')";
            } else if ((!op.darkMode && op.darkChange && target.classList.contains("buttonActive")) || (op.darkMode && !op.darkChange && !target.classList.contains("buttonActive"))) {
                target.children[0].style.backgroundImage = "url('../pwa/" + b + "_active_dark.png')";
            }

            if (!v && !target.classList.contains("buttonActive")) {
                navigator.vibrate(50); // vibrate
            }

            e_Fd(target.children[0].children[0], false); 
            target.classList.add("buttonActive");

            target.classList.remove("hoverB");
            target.removeEventListener('mousemove', hoverInit);

            if (!target.getAttribute("onclick") === 'toggleColorMode(event)') {
                cursorBig.classList.remove("extra");
            }
            hoverActive = false;
        }

        if (b && !v) { // navigate to section
            const mainSection = document.querySelector('.pwa .sections.scrollBarFunction');

            const targetSection = document.querySelector('.pwa .sections .' + b);
            const activeSection = document.querySelector('.pwa .sections .' + activeTab);

            activeSection.classList.remove("scrollBarContainer");
            activeSection.classList.add("d_n");

            mainSection.scrollTop = 0;

            targetSection.classList.remove("d_n");
            targetSection.classList.add("scrollBarContainer");

            activeTab = b;
        }
    }
}
/*
for (g = 0; g < navbarButtons.length; g++) {
    navbarButtons[g].addEventListener("mousedown", function(e) {
        if (!e.currentTarget.classList.contains("buttonActive")) {
            var target = e.currentTarget;
            e_Fd(target.children[0].children[0], true); 
            setTimeout(function() {
                target.children[0].style.transform = "scale(0.9)";
            }, 10);
        }
    });
    navbarButtons[g].addEventListener("mouseup", function(e) {
        if (!e.currentTarget.classList.contains("buttonActive")) {
            var target = e.currentTarget;
            target.children[0].style.transform = "none";
            setTimeout(function() {
                e_Fd(target.children[0].children[0], false); 
            }, 10);
        }
    });
}*/

function timeOfDay() {
    var d = new Date();
    time = d.getHours();
    if (time < 12) {
        return "morning";
    } else if (time < 17) {
        return "afternoon";
    } else if (time < 24) {
        return "evening";
    }
}

function fetchPWAInfo() {
    const sections = document.querySelector('.pwa .sections');
    const navbar = document.querySelector('.pwa .navbar');

    const temp = document.querySelector('.pwa .weather #temp');
    const unit = document.querySelector('.pwa .weather #unit');
    const greeting = document.querySelector('.pwa .home #greeting');
    const wordcloud = document.querySelectorAll('.pwa .home .wordcloud h1');

    const homeBtn = document.querySelector('.pwa .navbar .button.home');

    var selectedWords = [];

    // battery

    if ('getBattery' in navigator) {
        const batteryIcons = document.querySelectorAll('.pwa .banner .battery'); 
        navigator.getBattery().then(monitorBattery);
        for (j = 0; j < batteryIcons.length; j++) {
            batteryIcons[j].parentElement.classList.add("hoverB", "trs");

            batteryIcons[j].parentElement.addEventListener('mousemove', hoverInit);
            batteryIcons[j].parentElement.addEventListener('mouseleave', hoverEnd);
            batteryIcons[j].parentElement.addEventListener('click', hoverMiddle);
        }
    }

    // dark mode

    if (!getCookie("darkMode")) { // if no manual control from user
        if (op.darkMode) { // if dark mode
            toggleColorMode(null, true); // start-up with preset color theme
        } else {
            autoDarkMode(); // EXPERIMENTAL: Check device ambient light to activate dark mode
        }
    } else {
        if (getCookie("darkMode") === "true") { // manual: dark mode
            op.darkMode = true;
            toggleColorMode(null, true); 
        } else if (getCookie("darkMode") === "false") { // manual: light mode
            op.darkMode = false;
        }
    }

    // home
    /*
    if (r.o === "portrait" && window.innerWidth < 490) {
        sections.style.height = "calc(" + dev.uH.getBoundingClientRect().height + "px - 4rem)";
    }*/

    navButtonActive('home', homeBtn, true);

    greeting.innerHTML = timeOfDay();
    temp.innerHTML = Math.round(weatherAPIres.main.temp);
    unit.innerHTML = (tempUnit(ipAPIres.country.iso_code) === "metric") ? "C" : "F";

    for (i = 0; i < wordcloud.length; i++) { // get words from skills in msc.js
        var random1 = getRandomInt(1, 5),
            random2 = getRandomInt(0, 10),
            wd = 0,
            textColor = [], hsb = [], rgb = [], step = 0.01, bright = 0;
        if (selectedWords.indexOf(dev.skills["s" + random1][random2]) === -1) {
            selectedWords[selectedWords.length] = dev.skills["s" + random1][random2];
            wordcloud[i].innerHTML = dev.skills["s" + random1][random2];
 
            textColor = randomRGB(); // add random text colors suitable for dark+light themes
            hsb = RGBToHSB(textColor[0], textColor[1], textColor[2]);
            bright = getBrightness(textColor[0], textColor[1], textColor[2]);

            if (bright < 127) {
                while (bright < 127 && hsb[2] >= 0 && hsb[2] <= 100) {
                    hsb[2] += step;
                    var rgb2 = HSBToRGB(hsb[0], hsb[1], hsb[2]);
                    bright = getBrightness(rgb2[0], rgb2[1], rgb2[2]);
                }
            } else {
                while (bright > 127 && hsb[2] >= 0 && hsb[2] <= 100) {
                    hsb[2] -= step;
                    var rgb2 = HSBToRGB(hsb[0], hsb[1], hsb[2]);
                    bright = getBrightness(rgb2[0], rgb2[1], rgb2[2]);
                }
            }

            rgb = HSBToRGB(hsb[0], hsb[1], hsb[2]);
            wordcloud[i].style.color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";

            wd = getBd(wordcloud[i], "width");
            if (wd > ((0.9 * wiD) - op.fN)) {
                wordcloud[i].style.display = "none";
                wordcloud[i].remove();
            }
        } else {
            wordcloud[i].style.display = "none";
            wordcloud[i].remove();
        }
    }

    // about

    const aboutS1 = document.querySelector('.pwa .about #span1');
    const aboutS2 = document.querySelector('.pwa .about #span2');
    const aboutS2_1 = document.querySelector('.pwa .about #span2_1');
    const aboutS3 = document.querySelector('.pwa .about #span3');
    const aboutS4 = document.querySelector('.pwa .about #span4');

    aboutS1.innerHTML = dev.info.work[0];
    aboutS2.innerHTML = dev.info.work[1];
    aboutS2_1.innerHTML = dev.info.work[2];
    aboutS3.innerHTML = gps.city.toLowerCase();
    aboutS4.innerHTML = new Date().getFullYear() - 2018;
}

function startLoadPWA() {
    var y = op.d.getFullYear(), // get copyright year
        typer = null;

    const typerDet = document.querySelector('.pwa #wordsTyperDet');

    /*
    const stats = document.querySelector('.pwa .home .stats.container');

    const stat1 = document.querySelector('.pwa .home #stat1');
    const stat2 = document.querySelector('.pwa .home #stat2');
    const stat3 = document.querySelector('.pwa .home #stat3');*/

    // const aboutOffline = document.querySelector('.pwa .about .container.offline');
    /*
    var pwa_L = null,
        stats_e = false;

    const disVar = document.querySelector('.pwa #distanceVariantPWA');
    */

    fter.y[0].innerHTML = y;
    fter.v[0].innerHTML = dev.version;

    /*
    sI_1.e = stat1;
    sI_2.e = stat2;
    sI_3.e = stat3;

    if (window.innerWidth >= (800 + (window.innerWidth * 0.075) + (5 * op.fN))) {
        aboutOffline.classList.add("mod");
    }*/

    typer = setInterval(function() { // typing effect
        e_wCycle(typerDet, dev.info.work, typer);
    }, op.t);

    op.lang = engLangVar(countryAPIres.country);
    
    // sI_1.n = (op.lang === "gb") ? 97 : kmToMiles(97), // km : miles
    // disVar.innerHTML = (op.lang === "gb") ? "km" : "miles";
    /*
    pwa_L = setInterval(function() {
        var statsTop = stats.getBoundingClientRect();
        if (statsTop.top < aH && !stats_e) {
            stats_e = true;
            e_Ic(sI_1, null, sI_1.n);
            e_Ic(sI_2, null, sI_2.n);
            e_Ic(sI_3, null, sI_3.n);
        }
    }, (1000 / dev.t));*/
}

function randomRGB() {
    var r = getRandomInt(0, 256),
        g = getRandomInt(0, 256),
        b = getRandomInt(0, 256);
    return [r, g, b];
}

function getBrightness(r, g, b) { // REF: https://mixable.blog/adjust-text-color-to-be-readable-on-light-and-dark-backgrounds-of-user-interfaces/
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

const RGBToHSB = (r, g, b) => { // REF: https://www.30secondsofcode.org/js/s/rgb-to-hsb/
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h =
        n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
};

const HSBToRGB = (h, s, b) => { // REF: https://www.30secondsofcode.org/js/s/hsb-to-rgb/
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
};

// REFERENCE: https://googlechrome.github.io/samples/battery-status/

function updateBatteryUI(battery) {
    const batteryIcons = document.querySelectorAll('.pwa .banner .battery');

    btty.level = (battery.level * 100);
    btty.chargingTime = battery.chargingTime;
    btty.dischargingTime = battery.dischargingTime;

    if (battery.charging === true) {
        btty.charging = true;
    } else if (battery.charging === false) {
        btty.charging = false;
    }

    for (j = 0; j < batteryIcons.length; j++) {
        for (i = 0; i < batteryIcons[j].classList.length; i++) {
            var str = batteryIcons[j].classList[i],
                match = str.match("battery_");
            if (match !== null) {
                batteryIcons[j].classList.remove(str);
                break;
            }
        }

        if (btty.charging) { // charging
            batteryIcons[j].classList.add("battery_chg_img");
        } else if (btty.level > 87.5) { // full
            var img = (!op.darkMode || init) ? "battery_full_img" : "battery_full_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 75) { // 6
            var img = (!op.darkMode || init) ? "battery_6_img" : "battery_6_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 62.5) { // 5
            var img = (!op.darkMode || init) ? "battery_5_img" : "battery_5_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 50) { // 4
            var img = (!op.darkMode || init) ? "battery_4_img" : "battery_4_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 37.5) { // 3
            var img = (!op.darkMode || init) ? "battery_3_img" : "battery_3_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 25) { // 2
            var img = (!op.darkMode || init) ? "battery_2_img" : "battery_2_w_img";
            batteryIcons[j].classList.add(img);
        } else if (btty.level > 12.5) { // 1
            batteryIcons[j].classList.add("battery_1_img");
        } else if (btty.level > 0) { // 0
            batteryIcons[j].classList.add("battery_0_img");
        }
    }
}
  
function monitorBattery(battery) {
    // Update the initial UI.
    updateBatteryUI(battery);

    // Monitor for futher updates.
    battery.addEventListener('levelchange',
        updateBatteryUI.bind(null, battery));
    battery.addEventListener('chargingchange',
        updateBatteryUI.bind(null, battery));
    battery.addEventListener('dischargingtimechange',
        updateBatteryUI.bind(null, battery));
    battery.addEventListener('chargingtimechange',
        updateBatteryUI.bind(null, battery));
}

var isScrolling; // REFERENCE: https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/

sections.addEventListener("scroll", function(event) {
    sectionScroll = true;
    sectionScrollPos = sections.scrollTop;

    // Clear our timeout throughout the scroll
	window.clearTimeout(isScrolling);

	// Set a timeout to run after scrolling ends
	isScrolling = setTimeout(function() {

		// Run the callback
		sectionScroll = false;

	}, dev.t);

}, false);

function e_Fd(el, s) { // effect - fading (provided 'trs' class is added to el)
    if (el) {
        if (s) { // check if class is present before removing
            el.classList.add("z_O"); // fade out
        } else {
            el.classList.remove("z_O"); // fade in
        }
    }
}

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

var loader = document.querySelector('#load_sc');

function pwaRead() {
    switch (document.readyState) { // check 'ready state' of document
        case "loading":
            deleteAllCookies();
            
            e_Fd(loader, false);
            
        break;
        case "interactive":
            deleteAllCookies();
            
            e_Fd(loader, false);
            
        break;
        case "complete":
            if (!devError && op.pwa.s && !rL.i) { // pwa
                var client_L = null, ip_L = null, weather_L = null;

                const pwa_body = document.querySelector('.pwa');
                const normal_body = document.querySelector('.non-pwa');

                const pwa_scrollF = document.querySelector('.pwa .scrollBarFunction');
                const pwa_home = document.querySelector('.pwa .home');
                pwa_home.classList.add("scrollBarContainer");
                pwa_scrollF.classList.add("z-I");

                c_css("#scrollBar", "right: 0.2rem; width: 0.2rem;", false, null);

                ////////

                c_css(".trs", "transition-duration: " + (op.t / 1000) + "s;", false, null); // transition duration (convert to sec.)
                c_css(".trs_e", "transition-duration: " + (op.te / 1000) + "s;", false, null); // transition duration [ext.] (convert to sec.)
        
                c_css(".m_T.vh", "margin-top: calc(" + (aH * 0.5) + "px)", false, null);
                c_css(".m_T.vhq", "margin-top: calc(" + (aH * 0.25) + "px)", false, null);

                c_css(".p_Bvhq", "padding-bottom: calc(" + (aH * 0.25) + "px)", false, null);
                c_css(".p_Tvhq", "padding-top: calc(" + (aH * 0.25) + "px)", false, null);

                ///////

                clientAPI();
                countryAPI("");
                setTimeout(function() {
                    client_L = setInterval(function() {
                        if (clientAPIres.online) {
                            ipAPI(clientAPIres.ipString);
                            clearInterval(client_L);
                            ip_L = setInterval(function() {
                                if (ipAPIres.online) {
                                    weatherAPI(ipAPIres.lat, ipAPIres.lon, tempUnit(ipAPIres.country.iso_code));
                                    clearInterval(ip_L);
                                    weather_L = setInterval(function() {
                                        if (weatherAPIres.online && countryAPIres.online) {
                                            clearInterval(weather_L);

                                            const weatherMain = weatherAPIres.weather[0].main;
                                            const weatherDes = weatherAPIres.weather[0].description;
                                            const sunrise = weatherAPIres.sys.sunrise;
                                            const sunset = weatherAPIres.sys.sunset;

                                            var day = true,
                                                icon = "";

                                            if (((new Date().valueOf() / 1000) > sunrise) && ((new Date().valueOf() / 1000) < sunset)) {
                                                day = true;
                                            } else {
                                                day = false;
                                            }

                                            switch (weatherMain) {
                                                case "Clear":
                                                    if (day) {
                                                        icon = "sunny";
                                                    } else {
                                                        icon = "clear";
                                                    }
                                                break;
                                                case "Clouds":
                                                    switch (weatherDes) {
                                                        case "few clouds":
                                                            if (day) {
                                                                icon = "mostly_sunny";
                                                            } else {
                                                                icon = "isolated_clouds";
                                                            }
                                                        break;
                                                        case "scattered clouds":
                                                            if (day) {
                                                                icon = "partly_cloudy";
                                                            } else {
                                                                icon = "partly_cloudy_night";
                                                            }
                                                        break;
                                                        case "broken clouds":
                                                            if (day) {
                                                                icon = "mostly_cloudy";
                                                            } else {
                                                                icon = "mostly_cloudy_night";
                                                            }
                                                        break;
                                                        case "overcast clouds":
                                                            if (day) {
                                                                icon = "cloudy";
                                                            } else {
                                                                icon = "cloudy_night";
                                                            }
                                                        break;
                                                    }
                                                break;
                                                case "Mist":
                                                case "Smoke":
                                                case "Haze":
                                                case "Dust":
                                                case "Fog":
                                                case "Sand":
                                                case "Ash":
                                                case "Squall":
                                                case "Tornado":
                                                    if (day) {
                                                        icon = "fog";
                                                    } else {
                                                        icon = "fog_night";
                                                    }
                                                break;
                                                case "Snow":
                                                    switch (weatherDes) {
                                                        case "snow":
                                                        case "light snow":
                                                            if (day) {
                                                                icon = "snowy";
                                                            } else {
                                                                icon = "snowy_night";
                                                            }
                                                        break;
                                                        case "sleet":
                                                        case "light shower sleet":
                                                        case "shower sleet":
                                                            if (day) {
                                                                icon = "sleet";
                                                            } else {
                                                                icon = "sleet_night";
                                                            }
                                                        break;
                                                        case "light rain and snow":
                                                        case "rain and snow":
                                                        case "light shower snow":
                                                        case "shower snow":
                                                            if (day) {
                                                                icon = "snowy_rain";
                                                            } else {
                                                                icon = "snowy_rain_night";
                                                            }
                                                        break;
                                                        case "heavy snow":
                                                        case "heavy shower snow":
                                                            if (day) {
                                                                icon = "blizzard";
                                                            } else {
                                                                icon = "blizzard_night";
                                                            }
                                                        break;
                                                    }
                                                break;
                                                case "Rain":
                                                    if (day) {
                                                        icon = "rainy";
                                                    } else {
                                                        icon = "rainy_night";
                                                    }
                                                break;
                                                case "Drizzle":
                                                    if (day) {
                                                        icon = "showers";
                                                    } else {
                                                        icon = "showers_night";
                                                    }
                                                break;
                                                case "Thunderstorm":
                                                    if (day) {
                                                        icon = "thunderstorms";
                                                    } else {
                                                        icon = "thunderstorms_night";
                                                    }
                                                break;
                                            }

                                            const tempIcon = document.querySelector('.pwa .weatherIcon');
                                            $(tempIcon).load("weather/" + icon + ".html", function() {
                                                pwa_body.classList.remove("d_n");
                                                fetchPWAInfo();
                                                setTimeout(function() {

                                                    rL.r_s = false;
                                                    rL.el = document.getElementById("load_sc"), 
                                                    rL.r = document.getElementById("loadR"); // loading rings (container)
                                                    rL.p = document.getElementById("loadR-p"); // loading ring (primary)
                                                    rL.d = document.getElementById("loadR-e"); // loading ring (end)
                                                    rL.c = document.getElementById("loadR-s"); // loading ring (secondary)

                                                    rL.p.removeEventListener("animationiteration", load_e);
                                                    rL.p.addEventListener("animationiteration", function() {
                                                        if (rL.r_s) {
                                                            rL.d.style.animationName = "loadR_end"; // set ending animation detail
                                                        }
                                                    });

                                                    setTimeout(function() {
                                                        rL.r_s = true;

                                                        // rL.el.classList.add("z_O");

                                                        //rL.r.classList.add("aniM-p"); // stop animation in the rings
                                                        //rL.p.classList.add("aniM-p");
                                                        //rL.c.classList.add("aniM-p");

                                                        setTimeout(function() {
                                                            e_Fd(loader, true);

                                                            setTimeout(function() {
                                                                loader.classList.add("d_n");
                                                            }, op.t);
                                                            
                                                            resetRefresh();
                                                            pwa_Load = true;

                                                            e_Fd(pwa_body, false);
                                                            startLoadPWA();
        
                                                            clearInterval(pwa_Ld);
                                                        }, op.t);
    
                                                    }, op.te);
                                                    
                                                }, 10);
                                            });
                                        }
                                    }, op.t);
                                }
                            }, op.t);
                        }
                    }, op.t);
                }, op.t);

                normal_body.classList.add("d_n");
                // document.title = "Ivan Varghese";

                $(sections).scroll(function() {
                    document.title = "Ivan Varghese"; // default the title
                });

                rL.i = true; // end load
                rL.s = true;
            } else if (devError) {
                document.write("<h1 style='width: auto; font-size: 3rem; font-family: sans-serif; margin: 1em; line-height: 1.3em;'>Close<br>Developer<br>Tools.</h1>");
                rL.s = true; // page loaded
                
                window.stop(); // stop all network resource(s) fetching
                clearInterval(_Ld); // stop loading process
                clearInterval(op.ne.L); // clear network check loop

                checkOnlineStatus_abort.abort(); // abort any existing fetching
                estimateNetworkSpeed_abort.abort();
            }

            if (document.querySelector('.non-pwa').classList.contains("d_n")) {
                pos.sB = document.querySelector('.pwa #scrollBar');
            } else {
                pos.sB = document.querySelector('.non-pwa #scrollBar');
            }
        break;
    }
}

function num_Fs(s) { // font-size literal to numeral (eg. "10px" -> 10)
    var _L = s.length - 1,
        res = "";
    for (i = 0; i <= _L; i++) {
        if (Number(s[i]) || Number(s[i]) === 0) {
            res += s[i];
        } else {
            break;
        }
    }
    return Number(res);
}

function isSingleFoldHorizontal() {
    const segments = window.visualViewport.segments;

    // single fold means the device has 1 fold and 2 display regions
    if( segments.length !== 2 ) {
        return false;
    }

    // horizontal fold means 1st segment top is smaller than 2nd segment top
    if( segments[0].top < segments[1].top ) {
        return true;
    }

    // if we reach this point, the fold is vertical
    return false;
}

if (op.pwa.s) {
    const scrollbar = document.querySelector('#scrollBar');

    const segments = window.visualViewport.segments;

    var primarySegment;

    if (segments && segments.length === 2) {
        // now we know the device is a foldable
        // and we can update CSS classes in our layout as appropriate 

        primarySegment = 0;

        var fontBuffer = isSingleFoldHorizontal() ? 6 : 3;

        var currentFontSize = num_Fs(window.getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = (currentFontSize - fontBuffer) + "px";

        scrollbar.style.display = "none";
    }

    window.onresize = function() {
        const segments = window.visualViewport.segments;
        if (segments && segments.length === 2) {
            // Make changes two split content into the segments.

            primarySegment = 0;

            var fontBuffer = isSingleFoldHorizontal() ? 6 : 3;

            document.documentElement.style.fontSize = "";

            var currentFontSize = num_Fs(window.getComputedStyle(document.documentElement).fontSize);
            document.documentElement.style.fontSize = (currentFontSize - fontBuffer) + "px";

            scrollbar.style.display = "none";
        } else {
            // Reset state to single viewport (normal responsive layout).

            document.documentElement.style.fontSize = "";

            scrollbar.style.display = "";
        }
    }

    pwa_Ld = setInterval(pwaRead, op.Ls); // run 'load' scripts upon startup
}