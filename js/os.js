
var uA_L,
    tDevice, // check if device is touch-based
    op = { // site 'options'
        as : false, // anchor scrolling?
        sys : "", // operating system
        uA : navigator.userAgent, // user agent
        Ls : 1000/60, // loop (interval) speed - sec./rev.
        // i : 60, // iterations (per sec.)
        pwa : {
            s : (getPWADisplayMode() === "twa" || getPWADisplayMode() === "standalone" || getPWADisplayMode() === "browser") ? true : false // check whether if opened as app
        },
        Lf : {
            fb : document.hasFocus()
        }
    },
    gpsPos = null,
    gpsID = null;

var toggles = {
    motionSense : localStorage.getItem('motionSense') === null ? 0 : Number(localStorage.getItem('motionSense')) ? 1 : 0,
    location : localStorage.getItem('location') === null ? 0 : Number(localStorage.getItem('location')) ? 1 : 0,
    battery : localStorage.getItem('battery') === null ? 0 : Number(localStorage.getItem('battery')) ? 1 : 0,
    screenWake : localStorage.getItem('screenWake') === null ? 0 : Number(localStorage.getItem('screenWake')) ? 1 : 0,
    rotationLock : localStorage.getItem('rotationLock') === null ? 0 : Number(localStorage.getItem('rotationLock')) ? 1 : 0,
};

var screenLock;

///////////////////////////////////////////////////

function isDarkMode() { // dark mode detection
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',({ matches }) => { // detect color theme (live) change
    if (matches) { // change to dark mode
        if ((!getCookie("darkMode") && localStorage.getItem('incognito') !== '1') && !op.darkMode) {
            op.darkChange = true;
            toggleColorMode(null);
            op.darkMode = true;
            op.darkChange = false;

            if (localStorage.getItem('systemColor') !== '0') {
                localStorage.setItem('systemColor', '1');
            }
            localStorage.setItem('themeColor', '1');
        }
    } else { // change to light mode
        if ((!getCookie("darkMode") && localStorage.getItem('incognito') !== '1') && op.darkMode) {
            op.darkChange = true;
            toggleColorMode(null);
            op.darkMode = false;
            op.darkChange = false;

            if (localStorage.getItem('systemColor') !== '0') {
                localStorage.setItem('systemColor', '1');
            }
            localStorage.setItem('themeColor', '0');
        }
    }
});

op.darkMode = isDarkMode();

var colorStates = 0;
// var hamAuto = document.querySelector('.pwa .about .ham_auto');

if (localStorage.getItem('systemColor') === null) {
    localStorage.setItem('systemColor', '1');
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkTheme.matches) {
        localStorage.setItem('themeColor', '1');
    } else {
        localStorage.setItem('themeColor', '0');
    }
} else if (localStorage.getItem('systemColor') === '0') {
    if (localStorage.getItem('themeColor') === '0') {
        op.darkMode = false;
    } else if (localStorage.getItem('themeColor') === '1') {
        op.darkMode = true;
        var loader = document.querySelector(".loader_pwa");
        var load_r = document.querySelectorAll(".load_r_pwa");
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#303030');
        loader.style.backgroundColor = "#303030";
        let i = 0;
        while (i < load_r.length) {
            load_r[i].style.borderTopColor = "#FFF";
            i++;
        }
    }
} else if (localStorage.getItem('systemColor') === '1') {
    if (localStorage.getItem('themeColor') === '1') {
        op.darkChange = true;
        toggleColorMode(null);
        op.darkMode = true;
        op.darkChange = false;

        if (localStorage.getItem('systemColor') !== '0') {
            localStorage.setItem('systemColor', '1');
        }
        localStorage.setItem('themeColor', '1');
    }
}

function toggleColorMode(e, init) { // light/dark modes toggling
    if (colorStates < 2) {

        if (localStorage.getItem('systemColor') === '1' && !op.darkChange && !init) {
            localStorage.setItem('systemColor', '0');
        } 

        var scrolltop_img = (!op.darkMode || init) ? document.querySelector(".scrolltop_img") : document.querySelector(".scrolltop_w_img");
            icon = null,

            fvc = document.querySelectorAll(".favicons"),
            fvc_d = ["safari-pinned-tab-dark.svg", "apple-touch-icon_dark.png", "favicon_dark.ico", "favicon/favicon_dark.svg", "favicon/android-chrome-512x512_dark.png", "favicon/android-chrome-192x192_dark.png", "favicon/favicon-32x32_dark.png", "favicon/favicon-16x16_dark.png"]; // dark favicons
            fvc_L = ["safari-pinned-tab.svg", "apple-touch-icon.png", "favicon.ico", "favicon/favicon.svg", "favicon/android-chrome-512x512.png", "favicon/android-chrome-192x192.png", "favicon/favicon-32x32.png", "favicon/favicon-16x16.png"]; // light favicons

        if (!init && !op.darkChange) {
            colorStates++;
        }

        if (e) {
            op.darkChange = true;
        }

        toggleColorMode_e(init); // perform page specific actions

        if (e || op.darkChange) { // if manually controlled
            var hamAuto;
            if (!op.pwa.s) {
                if (vw.tB) {
                    hamAuto = document.querySelector(".tablet .ham_auto");
                } else if (vw.pH) {
                    hamAuto = document.querySelector(".phablet .ham_auto");
                } else {
                    hamAuto = document.querySelector(".mobile .ham_auto");
                }
            } else {
                hamAuto = document.querySelector('.pwa .about .ham_auto');
            }
            // if (colorStates <= 2) {
                if (!op.autoDarkChange && e) {
                    e_Fd(hamAuto, true); // remove 'auto' label
                    op.refuseAutoDark = true;
                } else {
                    op.autoDarkChange = false;
                }
                /*
                if (colorStates === 2) {
                    colorStates = 0;
                    setCookie("darkMode", null, -1);
                    e_Fd(hamAuto, false); // show 'auto' label
                } else {
                    colorStates++;
                }*/
            // } 
        }

        if ((!op.darkMode || init) /*&& colorStates <= 2 && colorStates !== 0*/) { // if light, change to dark

            localStorage.setItem('themeColor', '1');

            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#303030');

            for (i = 0; i < fvc.length; i++) { // change favicon
                fvc[i].setAttribute("href", fvc_d[i]); 
            }

            if (e !== null) {
                icon = (e.target.classList.contains("dark_mode_img")) ? e.target : e.target.children[0];

                setCookie("darkMode", "true", op.c.t);
            } else {
                if (!op.pwa.s) {
                    if (vw.tB || vw.dk) { // tablet OR desktop
                        icon = document.querySelector(".head #dm_btn .img_icon");
                    } else if (vw.pH || !vw.pH) { // mobile or phablet
                        icon = getColorModeIcon();
                    }
                } else {
                    icon = document.querySelector('.pwa .about .dark_mode_img');
                }
            }

            op.darkMode = true; //

            if (fab2Check && motionType === "commute") {
                document.body.classList.remove("commuteColorChange");
                // document.body.classList.add("commuteColorChangeDark");
                // document.body.classList.remove("lightBackground");
            }

            c_css(".lightText, .darkText", "transition-duration: 0s !important;", true, op.t); // remove 'trs' effect on text

            // needs to be generic to use in all pages
            c_css(".lightBackground", "background-color: #303030 !important;", false, null, op, "darkMode");
            c_css(".darkBackground", "background-color: #FFF !important;", false, null, op, "darkMode");
            c_css(".darkText", "color: #FFF !important;", false, null, op, "darkMode");
            c_css(".lightText", "color: #303030 !important;", false, null, op, "darkMode");

            c_css(".pwa .toggleBackg", "background-color: #3D3D3D !important;", false, null, op, "darkMode");
            c_css(".pwa .toggleBackg.toggleOn", "background-color: var(--predicate_col) !important;", false, null, op, "darkMode");
            c_css(".pwa .toggleSwitch", "background-color: #E4E4E4 !important;", false, null, op, "darkMode");

            c_css(".cursor", "mix-blend-mode: exclusion !important;", false, null, op, "darkMode");

            c_css("#ckA_msg", "border-top: 0.2rem solid #FFF", false, null, op, "darkMode"); //

            c_css(".load_r", "border-top-color: #FFF;", false, null, op, "darkMode");

            c_css("#footer_sc .bC_mL", "background: #3D3D3D !important; z-index: 10 !important;", false, null, op, "darkMode");

            scrolltop_img.classList.remove("scrolltop_img");

            scrolltop_img.classList.add("scrolltop_w_img");

            icon.classList.remove("dark_mode_img");
            icon.classList.add("light_mode_img");

            if (!op.pwa.s) {
                if (vw.dk) {
                    icon.parentElement.title = "Light theme";
                }
            }

        } else /*if (colorStates <= 2 && colorStates !== 0)*/ { // if dark, change to light

            localStorage.setItem('themeColor', '0');

            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F4F4F4');

            for (i = 0; i < fvc.length; i++) { // change favicon
                fvc[i].setAttribute("href", fvc_L[i]); 
            }

            if (e !== null) {
                icon = (e.target.classList.contains("light_mode_img")) ? e.target : e.target.children[0];

                setCookie("darkMode", "false", op.c.t);
            } else {
                if (!op.pwa.s) {
                    if (vw.tB || vw.dk) { // tablet OR desktop
                        icon = document.querySelector(".head #dm_btn .img_icon");
                    } else if (vw.pH || !vw.pH) { // mobile or phablet
                        icon = getColorModeIcon();
                    }
                } else {
                    icon = document.querySelector('.pwa .about .light_mode_img');
                }
            }

            c_css(".lightText, .darkText", "transition-duration: 0s !important;", true, op.t);

            icon.classList.remove("light_mode_img");
            icon.classList.add("dark_mode_img");

            if (!op.pwa.s) {
                if (vw.dk) {
                    icon.parentElement.title = "Dark theme";
                }
            }

            scrolltop_img.classList.remove("scrolltop_w_img");

            scrolltop_img.classList.add("scrolltop_img");
            
            op.darkMode = false;

            if (fab2Check && motionType === "commute") {
                document.body.classList.add("commuteColorChange");
                // document.body.classList.remove("commuteColorChangeDark");
                // document.body.classList.add("lightBackground");
            }
        }

        if (op.darkChange) {
            op.darkChange = false;
        }
    } else {
        var hamAuto = document.querySelector('.pwa .about .ham_auto');
        e_Fd(hamAuto, false);

        localStorage.setItem('systemColor', '1');

        setCookie("darkMode", null, -1);
        op.refuseAutoDark = false;

        colorStates = 0;
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
    } else if (navigator.standalone || isStandalone) { // return APP mode & BROWSER (effective 140524)
        return 'standalone';
    } else {
        return 'browser';
    }
}
/*
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => { // check for changes in display
    let displayMode = 'browser';
    if (evt.matches) {
        displayMode = 'standalone';
    }
    // Log display mode change to analytics
    console.log('DISPLAY_MODE_CHANGED', displayMode);
});*/

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

// REFERENCE: https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript

function deleteAllCookies() { // DELETES undomained cookies in user's browser
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
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