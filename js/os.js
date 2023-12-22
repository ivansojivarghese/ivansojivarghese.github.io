
var uA_L,
    tDevice, // check if device is touch-based
    op = { // site 'options'
        as : false, // anchor scrolling?
        sys : "", // operating system
        uA : navigator.userAgent, // user agent
        Ls : 1000/60, // loop (interval) speed - sec./rev.
        // i : 60, // iterations (per sec.)
        pwa : {
            s : (getPWADisplayMode() === "twa" || getPWADisplayMode() === "standalone") ? true : false // check whether if opened as app
        },
        Lf : {
            fb : document.hasFocus()
        }
    };

///////////////////////////////////////////////////

function isDarkMode() { // dark mode detection
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',({ matches }) => { // detect color theme (live) change
    if (matches) { // change to dark mode
        if (!getCookie("darkMode") && !op.darkMode) {
            toggleColorMode(null);
            op.darkMode = true;
        }
    } else { // change to light mode
        if (!getCookie("darkMode") && op.darkMode) {
            toggleColorMode(null);
            op.darkMode = false;
        }
    }
});

op.darkMode = isDarkMode();

function toggleColorMode(e, init) { // light/dark modes toggling
    var scrolltop_img = (!op.darkMode || init) ? document.querySelector(".scrolltop_img") : document.querySelector(".scrolltop_w_img");
        icon = null,

        fvc = document.querySelectorAll(".favicons"),
        fvc_d = ["safari-pinned-tab-dark.svg", "apple-touch-icon_dark.png", "favicon_dark.ico", "favicon/favicon_dark.svg", "favicon/android-chrome-512x512_dark.png", "favicon/android-chrome-192x192_dark.png", "favicon/favicon-32x32_dark.png", "favicon/favicon-16x16_dark.png"]; // dark favicons
        fvc_L = ["safari-pinned-tab.svg", "apple-touch-icon.png", "favicon.ico", "favicon/favicon.svg", "favicon/android-chrome-512x512.png", "favicon/android-chrome-192x192.png", "favicon/favicon-32x32.png", "favicon/favicon-16x16.png"]; // light favicons


    toggleColorMode_e(init); // perform page specific actions

    if (!op.darkMode || init) { // if light, change to dark

        for (i = 0; i < fvc.length; i++) { // change favicon
            fvc[i].setAttribute("href", fvc_d[i]); 
        }

        if (e !== null) {
            icon = (e.target.classList.contains("dark_mode_img")) ? e.target : e.target.children[0];

            setCookie("darkMode", "true", op.c.t);
        } else {
            if (vw.tB || vw.dk) { // tablet OR desktop
                icon = document.querySelector(".head #dm_btn .img_icon");
            } else if (vw.pH || !vw.pH) { // mobile or phablet
                icon = getColorModeIcon();
            }
        }

        op.darkMode = true; //

        c_css(".lightText, .darkText", "transition-duration: 0s !important;", true, op.t); // remove 'trs' effect on text

        // needs to be generic to use in all pages
        c_css(".lightBackground", "background-color: #303030 !important;", false, null, op, "darkMode");
        c_css(".darkBackground", "background-color: #FFF !important;", false, null, op, "darkMode");
        c_css(".darkText", "color: #FFF !important;", false, null, op, "darkMode");
        c_css(".lightText", "color: #303030 !important;", false, null, op, "darkMode");

        c_css("#ckA_msg", "border-top: 0.2rem solid #FFF", false, null, op, "darkMode"); //

        c_css("#footer_sc .bC_mL", "background: #3D3D3D !important; z-index: 10 !important;", false, null, op, "darkMode");

        scrolltop_img.classList.remove("scrolltop_img");

        scrolltop_img.classList.add("scrolltop_w_img");

        icon.classList.remove("dark_mode_img");
        icon.classList.add("light_mode_img");

        if (vw.dk) {
            icon.parentElement.title = "Light theme";
        }

    } else { // if dark, change to light

        for (i = 0; i < fvc.length; i++) { // change favicon
            fvc[i].setAttribute("href", fvc_L[i]); 
        }

        if (e !== null) {
            icon = (e.target.classList.contains("light_mode_img")) ? e.target : e.target.children[0];

            setCookie("darkMode", "false", op.c.t);
        } else {
            if (vw.tB || vw.dk) { // tablet OR desktop
                icon = document.querySelector(".head #dm_btn .img_icon");
            } else if (vw.pH || !vw.pH) { // mobile or phablet
                icon = getColorModeIcon();
            }
        }

        c_css(".lightText, .darkText", "transition-duration: 0s !important;", true, op.t);

        icon.classList.remove("light_mode_img");
        icon.classList.add("dark_mode_img");

        if (vw.dk) {
            icon.parentElement.title = "Dark theme";
        }

        scrolltop_img.classList.remove("scrolltop_w_img");

        scrolltop_img.classList.add("scrolltop_img");
        
        op.darkMode = false;
    }
}

///////////////////////////////////////////////////

function osCheck() {
    if (op.uA) {
        if (op.uA.match(/iPhone|iPad|iPod/i)) { // iOS
            op.sys = "iOS";
        } else if (op.uA.match(/Android/i)) {// android
            op.sys = "Android";
        } else if (op.uA.match(/Windows/i)) { // windows
            op.sys = "Windows";
        } else if (op.uA.match(/Mac/i)) { // mac
            op.sys ="MacOS";
        } else if (op.uA.match(/X11/i) && !op.uA.match(/Linux/i)) { // unix
            op.sys = "UNIX";
        } else if (op.uA.match(/Linux/i) && op.uA.match(/X11/i)) { // linux
            op.sys = "Linux";
        } else {
            op.sys = null; // unknown (unsupported)
        }
    }
}

// REFERENCED FROM KIRUPA.COM @https://www.kirupa.com/html5/check_if_you_are_on_a_touch_enabled_device.htm 

function isTouchSupported() {
    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    var generalTouchEnabled = "ontouchstart" in document.createElement("div");

    if ((msTouchEnabled || generalTouchEnabled || developer) && (op.sys === "iOS" || op.sys === "Android")) {
        return true;
    }
    return false;
}

function applyManifest() {
    var cfg = document.getElementById("msConfig"), // browser config.
        tCol = document.getElementById("msTcol"), // broswer tile col.
        tImg = document.getElementById("msTimg"), // browser tile img.
        m = document.getElementById("mft"); // get appropriate manifest

    if (op.sys === "Android") {

        m.setAttribute("href", "app.webmanifest");

    } else if (op.sys === "iOS") {

        

    } else if (op.sys === "Windows") { // if windows

        m.setAttribute("href", "app_windows.webmanifest");

        cfg.setAttribute("content", "browserconfig.xml");
        tCol.setAttribute("content", "#303030");
        tImg.setAttribute("content", "favicon/windows/mstile-144x144.png?1");

    }
}

// REFERENCED FROM WEB.DEV: https://web.dev/customize-install/

function getPWADisplayMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
        return 'twa';
    } else if (navigator.standalone || isStandalone) {
        return 'standalone';
    }
    return 'browser';
}

window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => { // check for changes in display
    let displayMode = 'browser';
    if (evt.matches) {
        displayMode = 'standalone';
    }
    // Log display mode change to analytics
    console.log('DISPLAY_MODE_CHANGED', displayMode);
});

function setCookie(n, v, days) { // create a cookie 
    const d = new Date(); // get current time
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires=" + d.toUTCString(); // add expiry time tag (days)
    if (days) {
        document.cookie = n + "=" + v + ";" + expires + ";path=/"; // attach cookie
    } else {
        document.cookie = n + "=" + v + ";path=/"; // attach cookie (with no expiration, deletes after browser session)
    }
}

function getCookie(n) { // obtain a cookie (if available)
    let name = n + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";"); // split cookie name-value pairs into array elements
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') { // ignore spaces at prefix and focus on significant characters
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) { // if cookie found
            return c.substring(name.length, c.length); // return its value
        }
    }
    return ""; // return nothing if not found
}

// REFERENCE: https://stackoverflow.com/questions/3400759/how-can-i-list-all-cookies-for-the-current-page-with-javascript

function listCookies() { // RETURNS an object with the listed cookies (site domain only, not third party)
    var theCookies = document.cookie.split('; ');
    var list = {};
    for (var i = 1 ; i <= theCookies.length; i++) {
        list[theCookies[i - 1].split("=")[0]] = theCookies[i - 1].split("=")[1];
    }
    return list;
}


uA_L = setInterval(function() {
    if (navigator.userAgent) {
        op.uA = navigator.userAgent;
        osCheck();
        applyManifest();
        tDevice = isTouchSupported(); // check if touch device
        clearInterval(uA_L);
    }
}, op.Ls);


// Dark mode detection (using device ambient light sensor | EXPERIMENTAL) 

// REFERENCE: https://deanhume.com/ambient-light-sensor/

if (window.AmbientLightSensor) {
    try {
        const sensor = new AmbientLightSensor();
        // Detect changes in the light
        sensor.onreading = () => {

            // Read the light levels in lux 
            // < 50 is dark room
            
            if (sensor.illuminance < 50 && !op.darkMode) {
                toggleColorMode(null);
                op.darkMode = true; // set to dark mode automatically
            } else if (op.darkMode) {
                toggleColorMode(null);
                op.darkMode = false;
            }
        }
        
        sensor.start();

    } catch(err) {
        console.log(err.name, err.message);
    }
}