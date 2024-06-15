
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
    fullScreen : localStorage.getItem('fullScreen') === null ? 0 : Number(localStorage.getItem('fullScreen')) ? 1 : 0,
    swap : localStorage.getItem('primarySegment') === null ? 0 : Number(localStorage.getItem('primarySegment')) ? 1 : 0,
    motionSense : localStorage.getItem('motionSense') === null ? 0 : Number(localStorage.getItem('motionSense')) ? 1 : 0,
    location : localStorage.getItem('location') === null ? 0 : Number(localStorage.getItem('location')) ? 1 : 0,
    sync : localStorage.getItem('sync') === null ? 0 : Number(localStorage.getItem('sync')) ? 1 : 0,
    battery : localStorage.getItem('battery') === null ? 0 : Number(localStorage.getItem('battery')) ? 1 : 0,
    screenWake : localStorage.getItem('screenWake') === null ? 0 : Number(localStorage.getItem('screenWake')) ? 1 : 0,
    rotationLock : localStorage.getItem('rotationLock') === null ? 0 : Number(localStorage.getItem('rotationLock')) ? 1 : 0,
};

var screenLock;

///////////////////////////////////////////////////

function isDarkMode() { // dark mode detection
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
/*
if (localStorage.getItem('systemColor') === '0') {
    if (op.darkMode) {
        setCookie("darkMode", true, op.c.t);
    } else {
        setCookie("darkMode", false, op.c.t);
    }
}*/

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',({ matches }) => { // detect color theme (live) change
    if (matches) { // change to dark mode
        if (!getCookie("darkMode") && colorStates === 0 && (localStorage.getItem('incognito') !== '1' || localStorage.getItem('systemColor') === '1') && !op.darkMode) {
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
        if (!getCookie("darkMode") && colorStates === 0 && (localStorage.getItem('incognito') !== '1' || localStorage.getItem('systemColor') === '1') && op.darkMode) {
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
if (localStorage.getItem('systemColor') === '0') {
    colorStates = 1;
}
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
        var load_message = document.querySelector("#load_message");
        var pwaSec = document.querySelector(".pwaSecondary");

        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#303030');
        loader.style.backgroundColor = "#303030";
        pwaSec.style.backgroundColor = "#303030";
        pwaSec.style.color = "#FFF";
        load_message.style.color = "#FFF";
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

function toggleColorMode(e, init, b) { // light/dark modes toggling
    if (colorStates < 2 || (colorStates === 2 && (op.darkMode !== isDarkMode()))) {

        if (colorStates === 2 && op.darkMode !== isDarkMode()) {
            var hamAuto = document.querySelector('.pwa .about .ham_auto');
            e_Fd(hamAuto, false);

            localStorage.setItem('systemColor', '1');

            setCookie("darkMode", null, -1);
            op.refuseAutoDark = false;

            op.darkChange = true;

            colorStates = 0;

            toggleColorMode(null, false, true);
        } else {

            if (localStorage.getItem('systemColor') === '1' && !op.darkChange && !init) {
                localStorage.setItem('systemColor', '0');
            } 

            var scrolltop_img = (!op.darkMode || init) ? document.querySelector(".scrolltop_img") : document.querySelector(".scrolltop_w_img");
                icon = null,

                fvc = document.querySelectorAll(".favicons"),
                fvc_d = ["safari-pinned-tab-dark.svg", "apple-touch-icon_dark.png", "favicon_dark.ico", "favicon/favicon_dark.svg", "favicon/android-chrome-512x512_dark.png", "favicon/android-chrome-192x192_dark.png", "favicon/favicon-32x32_dark.png", "favicon/favicon-16x16_dark.png"]; // dark favicons
                fvc_L = ["safari-pinned-tab.svg", "apple-touch-icon.png", "favicon.ico", "favicon/favicon.svg", "favicon/android-chrome-512x512.png", "favicon/android-chrome-192x192.png", "favicon/favicon-32x32.png", "favicon/favicon-16x16.png"]; // light favicons

            var title_settings = document.querySelector(".titlebar .settings"),
                title_info = document.querySelector(".titlebar .info");

            if (!init && !op.darkChange && !b) {
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

                title_settings.classList.remove("settings_img");
                title_info.classList.remove("info_img");

                title_settings.classList.add("settings_w_img");
                title_info.classList.add("info_w_img");

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

                c_css(".pwa .popups", "background-color: #303030;", false, null, op, "darkMode");

                c_css(".deviceInfoIcon.alert", "background-color: #3D3D3D;", false, null, op, "darkMode");

                c_css(".cursor", "mix-blend-mode: exclusion !important;", false, null, op, "darkMode");

                c_css("#ckA_msg", "border-top: 0.2rem solid #FFF", false, null, op, "darkMode"); //

                c_css(".load_r", "border-top-color: #FFF;", false, null, op, "darkMode");

                c_css("#footer_sc .bC_mL", "background: #3D3D3D !important; z-index: 10 !important;", false, null, op, "darkMode");

                // scrolltop_img.classList.remove("scrolltop_img");

                // scrolltop_img.classList.add("scrolltop_w_img");

                icon.classList.remove("dark_mode_img");
                icon.classList.add("light_mode_img");

                if (!op.pwa.s) {
                    if (vw.dk) {
                        icon.parentElement.title = "Light theme";
                    }
                }

            } else /*if (colorStates <= 2 && colorStates !== 0)*/ { // if dark, change to light

                var pwaSec = document.querySelector(".pwaSecondary");

                pwaSec.style.backgroundColor = "";
                pwaSec.style.color = "";

                localStorage.setItem('themeColor', '0');

                document.querySelector('meta[name="theme-color"]').setAttribute('content', '#F4F4F4');

                for (i = 0; i < fvc.length; i++) { // change favicon
                    fvc[i].setAttribute("href", fvc_L[i]); 
                }

                title_settings.classList.remove("settings_w_img");
                title_info.classList.remove("info_w_img");

                title_settings.classList.add("settings_img");
                title_info.classList.add("info_img");

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

                // scrolltop_img.classList.remove("scrolltop_w_img");

                // scrolltop_img.classList.add("scrolltop_img");
                
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

function toggleColorMode_e(init) { // toggle between light and dark modes (page specific)

    var h_sc = document.getElementById("ham_sc"),
        lk3 = document.getElementById("link_3"),
        ham_b = document.getElementById("hamburger_button"),
        pl3 = document.getElementById("pLa-3"),
        ft_cnt = document.querySelector("#footer_sc .content"), // footer content
        dw_img = (!op.darkMode || init) ? document.querySelector(".download_img") : document.querySelector(".download_w_img"), // download 
        ch_img = (!op.darkMode || init) ? document.querySelector(".chevron_down_img") : document.querySelector(".chevron_down_w_img"), // chevron
        logo_h_img = (!op.darkMode || init) ? document.querySelector(".logo-hybrid") : document.querySelector(".logo-hybrid-inverse"), // logo-hybrid
        logo_inv_img = (!op.darkMode || init) ? document.querySelector(".logo-inverse") : document.querySelector(".logo-inverse-dark"); // logo_inv

    if (op.pwa.s) {
        var logo_h_img_pwa = (!op.darkMode || init) ? document.querySelector(".pwa .logo-full") : document.querySelector(".pwa .logo-hybrid-inverse"), // pwa
            sig_pwa = (!op.darkMode || init) ? document.querySelector(".pwa .signature") : document.querySelector(".pwa .signature_w"), // signature

            weather_icon = document.querySelector('.pwa .weatherIcon .icon-container'),
            navbar_pwa = document.querySelector('.pwa .navbar'),
            fab = document.querySelector('.pwa .fab'),

            settings_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .banner .settings_img') : document.querySelector('.pwa .about .banner .settings_w_img'),
            batteryIcons = document.querySelectorAll('.pwa .banner .battery'),
            infoIcons = document.querySelectorAll('.pwa .banner .info'),

            home_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .home') : document.querySelector('.pwa .navbar .home_dark'),
            clicks_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .clicks') : document.querySelector('.pwa .navbar .clicks_dark'),
            code_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .code') : document.querySelector('.pwa .navbar .code_dark'),
            diary_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .diary') : document.querySelector('.pwa .navbar .diary_dark'),
            about_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .about') : document.querySelector('.pwa .navbar .about_dark'),

            ig_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .instagram') : document.querySelector('.pwa .about .instagram_w'),
            fb_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .facebook') : document.querySelector('.pwa .about .facebook_w'),
            lk_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .linkedin') : document.querySelector('.pwa .about .linkedin_w'),
            gh_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .github') : document.querySelector('.pwa .about .github_w'),
            x_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .x_twitter') : document.querySelector('.pwa .about .x_twitter_w'),

            close_icon = (!op.darkMode || init) ? document.querySelector('.pwa .popups .close_img') : document.querySelector('.pwa .popups .close_w_img'),

            humid_icon = (!op.darkMode || init) ? document.querySelector('.pwa .popups .humid_img') : document.querySelector('.pwa .popups .humid_w_img'),
            wind_icon = (!op.darkMode || init) ? document.querySelector('.pwa .popups .wind_img') : document.querySelector('.pwa .popups .wind_w_img'),
            temp_icon = (!op.darkMode || init) ? document.querySelector('.pwa .popups .temp_img') : document.querySelector('.pwa .popups .temp_w_img'),

            motionIcon = document.querySelector('.pwa .home .motionIcon'),

            icons = document.querySelectorAll('.pwa .navbar .button'),
            active_icon = null,
            active_icon_name = "";

        for (a = 0; a < icons.length; a++) {
            if (icons[a].classList.contains("buttonActive")) {
                active_icon = icons[a];
                for (b = 0; b < icons[a].classList.length; b++) {
                    var str = icons[a].classList[b];
                    for (c = 0; c < tabs.length; c++) {
                        if (str.indexOf(tabs[c]) !== -1) {
                            active_icon_name = tabs[c];
                            break;
                        }
                    }
                }
                break;
            }
        }

        getParameters();
        if (urlParams["nav1"]) {
            var target = urlParams["nav1"];
            activeTab = target;
        } else {
            activeTab = "home";
        }

        if (active_icon === null) {
            active_icon = document.querySelector('.pwa .navbar .button.' + activeTab) || document.querySelector('.pwa .navbar .button.' + activeTab + '_dark');
        }
        if (active_icon_name === "") {
            active_icon_name = activeTab;
        }
    }

    if (!op.pwa.s) {
        if (vw.pH) { // if phablet
            var c_Info_a = document.querySelectorAll(".c_Info_arrows"),
                w_img = (!op.darkMode || init) ? document.querySelector(".work_img") : document.querySelector(".work_w_img"),
                s_img = (!op.darkMode || init) ? document.querySelector(".school_img") : document.querySelector(".school_w_img"),
                l_img = (!op.darkMode || init) ? document.querySelector(".location_img") : document.querySelector(".location_w_img");
            pl3 = document.getElementById("hm_btn_ar");
            dw_img = (!op.darkMode || init) ? document.querySelector("#ham_phablet_sc .download_img") : document.querySelector("#ham_phablet_sc .download_w_img"); // download 
        } else if (vw.tB && !vw.dk) {
            var intro_L = document.getElementById("intro_link");
            dw_img = (!op.darkMode || init) ? document.querySelector("#dw_btn.tablet .download_img") : document.querySelector("#dw_btn.tablet .download_w_img");
        } else if (vw.dk) {
            var c_Info_a = document.querySelectorAll("#pitch_sc .img_icon"),
                lb_img = (!op.darkMode || init) ? document.querySelector(".lightbulb_img") : document.querySelector(".lightbulb_w_img"),
                pitch_d = document.querySelector("#pitch_dark"),
                pitch_d_val = 10;
            dw_img = (!op.darkMode || init) ? document.querySelector("#footer_sc .download_img") : document.querySelector("#footer_sc .download_w_img");

            if (pitch_d.children.length === 0) {
                var val_ar = [];
                for (j = 0; j < pitch_d_val; j++) {
                    var div = document.createElement("DIV"),
                        max = Math.floor(wiD / op.fN),
                        rdn = getRandomInt(0, max);
                    if (val_ar.indexOf(rdn) === -1) { // if not existing
                        val_ar[val_ar.length] = rdn;
                    } else { // if existing
                        rdn = getRandomInt(0, max); // get new
                        while (val_ar.indexOf(rdn) !== -1) {
                            rdn = getRandomInt(0, max); // get another if again existing
                        }
                    }
                    div.setAttribute("class", "cursorInt");//
                    div.style.left = rdn + "rem";
                    pitch_d.appendChild(div);
                }
            }
        }
    }
    /*
    if (colorStates === 1) { //
        colorStates = 0;//
    }*/

    if ((!op.darkMode || init)/* && colorStates <= 2 && colorStates !== 0*/) { // if light, change to dark

        if (op.pwa.s) {
            var str;

            var motion_icon = document.querySelector('.pwa .home .banner .motionIcon'),
                mI_img = motion_icon.children[0].classList,
                keyW = ["walk", "run", "commute"],
                target_mI = "",
                add_mI = "";
            for (i = 0; i < mI_img.length; i++) {
                if (mI_img[i].includes(keyW[0])) {
                    target_mI = mI_img[i];
                    add_mI = keyW[0] + "_w_img";
                    break;
                } else if (mI_img[i].includes(keyW[1])) {
                    target_mI = mI_img[i];
                    add_mI = keyW[1] + "_w_img";
                    break;
                } else if (mI_img[i].includes(keyW[2])) {
                    target_mI = mI_img[i];
                    add_mI = keyW[2] + "_w_img";
                    break;
                }
            }
            if (target_mI && add_mI) {
                mI_img.remove(target_mI);
                mI_img.add(add_mI);
            }

            logo_h_img_pwa.classList.remove("logo-full");
            sig_pwa.classList.remove("signature");

            for (j = 0; j < batteryIcons.length; j++) {
                for (i = 0; i < batteryIcons[j].classList.length; i++) {
                    str = batteryIcons[j].classList[i];
                    match = str.match("battery_");
                    if (match !== null) {
                        batteryIcons[j].classList.remove(str);
                        break;
                    }
                }
                switch (str) {
                    case "battery_full_img":
                    case "battery_6_img":
                    case "battery_5_img":
                    case "battery_4_img":
                    case "battery_3_img":
                    case "battery_2_img":
                        var dx = str.indexOf("_img"),
                            mod = "_w",
                            newStr = str.slice(0, dx) + mod + str.slice(dx);
                        batteryIcons[j].classList.add(newStr);
                    break;
                    default:
                        batteryIcons[j].classList.add(str);
                    break;
                }
            }

            for (k = 0; k < infoIcons.length; k++) {
                for (i = 0; i < infoIcons[k].classList.length; i++) {
                    str = infoIcons[k].classList[i];
                    match = str.match("info_");
                    if (match !== null) {
                        infoIcons[k].classList.remove(str);
                        break;
                    }
                }
                infoIcons[k].classList.add("info_w_img");
            }

            settings_icon.classList.remove("settings_img");

            home_icon.classList.remove("home");
            clicks_icon.classList.remove("clicks");
            code_icon.classList.remove("code");
            diary_icon.classList.remove("diary");
            about_icon.classList.remove("about");

            ig_icon.classList.remove("instagram");
            fb_icon.classList.remove("facebook");
            lk_icon.classList.remove("linkedin");
            gh_icon.classList.remove("github");
            x_icon.classList.remove("x_twitter");

            close_icon.classList.remove("close_img");

            humid_icon.classList.remove("humid_img");
            wind_icon.classList.remove("wind_img");
            temp_icon.classList.remove("temp_img");

            logo_h_img_pwa.classList.add("logo-hybrid-inverse");
            sig_pwa.classList.add("signature_w");

            settings_icon.classList.add("settings_w_img");

            home_icon.classList.add("home_dark");
            clicks_icon.classList.add("clicks_dark");
            code_icon.classList.add("code_dark");
            diary_icon.classList.add("diary_dark");
            about_icon.classList.add("about_dark");

            ig_icon.classList.add("instagram_w");
            fb_icon.classList.add("facebook_w");
            lk_icon.classList.add("linkedin_w");
            gh_icon.classList.add("github_w");
            x_icon.classList.add("x_twitter_w");

            close_icon.classList.add("close_w_img");

            humid_icon.classList.add("humid_w_img");
            wind_icon.classList.add("wind_w_img");
            temp_icon.classList.add("temp_w_img");

            if (weather_icon) {
                weather_icon.style.borderRadius = "0.5rem";
            }
            motionIcon.classList.add("shade");
            navbar_pwa.classList.add("shade");
            fab.classList.add("shade");
            fab2.classList.add("shade");

            navButtonActive(active_icon_name, active_icon, true);
        }

        if (hm.s) { // if open
            h_sc.classList.add("z-N");
        }
        // lk3.classList.remove("z-G");
        // ft_cnt.classList.add("p-r", "z-N");

        // ham_b.addEventListener("click", hamScZdx); 

        ///////////////////////////////////////

        // dw_img.classList.remove("download_img");
        // ch_img.classList.remove("chevron_down_img");
        // logo_h_img.classList.remove("logo-hybrid");
        // logo_inv_img.classList.remove("logo-inverse");
        // pl3.classList.remove("lead_arrow_forward_img");

        // dw_img.classList.add("download_w_img");
        // ch_img.classList.add("chevron_down_w_img");
        // logo_h_img.classList.add("logo-hybrid-inverse");
        // logo_inv_img.classList.add("logo-inverse-dark");
        // pl3.classList.add("lead_arrow_forward_w_img");

        ////////////////////////////////////////

        if (!op.pwa.s) {

            if (vw.pH) { // phablet
                for (i = 0; i < c_Info_a.length; i++) {
                    c_Info_a[i].classList.remove("lead_arrow_forward_img");
                    c_Info_a[i].classList.add("lead_arrow_forward_w_img");
                }

                w_img.classList.remove("work_img");
                s_img.classList.remove("school_img");
                l_img.classList.remove("location_img");

                w_img.classList.add("work_w_img");
                s_img.classList.add("school_w_img");
                l_img.classList.add("location_w_img");
            } else if (vw.tB && !vw.dk) { // tablet
                intro_L.classList.remove("d_n");

                c_css("#blend_sc div", "background-color: #3D3D3D;", false, null, op, "darkMode");

                c_css("#blend_sc div:nth-child(2)", "margin-left: 10vw;", false, null, op, "darkMode");
                c_css("#blend_sc div:nth-child(3)", "margin-left: 25vw;", false, null, op, "darkMode");
                c_css("#blend_sc div:nth-child(4)", "margin-left: 40vw;", false, null, op, "darkMode");
                c_css("#blend_sc div:nth-child(5)", "margin-left: 50vw;", false, null, op, "darkMode");

            } else if (vw.dk) { // desktop

                for (i = 0; i < c_Info_a.length; i++) {
                    c_Info_a[i].classList.remove("lead_arrow_forward_img");
                    c_Info_a[i].classList.add("lead_arrow_forward_w_img");
                }

                c_css("div.cursorInt", "background-color: #3D3D3D;", false, null, op, "darkMode");
                c_css("#localWeather .img_icon.d_i", "background-color: #C8C6C1", false, null, op, "darkMode");
                c_css("#link_4, #wordsTyperDet, #wordsTyperDet_cursor, #lightbulb_w_img", "opacity: 0.5;", false, null, op, "darkMode");
                c_css("#random_sc", "background-color: #4A4A4A;", false, null, op, "darkMode");

                lb_img.classList.remove("lightbulb_img");
                pitch_d.classList.remove("d_n");

                lb_img.classList.add("lightbulb_w_img");

            } else { // mobile

                c_css("#link_1", "opacity: 0.1;", false, null, op, "darkMode");
            }
        }

    } else /*if (colorStates <= 2 && colorStates !== 0)*/ { // if dark, change to light
        var str;

        if (op.pwa.s) {

            var motion_icon = document.querySelector('.pwa .home .banner .motionIcon'),
                mI_img = motion_icon.children[0].classList,
                keyW = ["walk", "run", "commute"],
                target_mI = "",
                add_mI = "";
            for (i = 0; i < mI_img.length; i++) {
                if (mI_img[i].includes(keyW[0])) {
                    target_mI = mI_img[i];
                    add_mI = keyW[0] + "_img";
                    break;
                } else if (mI_img[i].includes(keyW[1])) {
                    target_mI = mI_img[i];
                    add_mI = keyW[1] + "_img";
                    break;
                } else if (mI_img[i].includes(keyW[2])) {
                    target_mI = mI_img[i];
                    add_mI = keyW[2] + "_img";
                    break;
                }
            }
            if (target_mI && add_mI) {
                mI_img.remove(target_mI);
                mI_img.add(add_mI);
            }

            logo_h_img_pwa.classList.remove("logo-hybrid-inverse");
            sig_pwa.classList.remove("signature_w");

            for (j = 0; j < batteryIcons.length; j++) {
                for (i = 0; i < batteryIcons[j].classList.length; i++) {
                    str = batteryIcons[j].classList[i];
                    match = str.match("battery_");
                    if (match !== null) {
                        batteryIcons[j].classList.remove(str);
                        break;
                    }
                }
                switch (str) {
                    case "battery_full_w_img":
                    case "battery_6_w_img":
                    case "battery_5_w_img":
                    case "battery_4_w_img":
                    case "battery_3_w_img":
                    case "battery_2_w_img":
                        var dx = str.indexOf("_w_img"),
                            mod = "_img",
                            newStr = str.slice(0, dx) + mod;
                        batteryIcons[j].classList.add(newStr);
                    break;
                    default:
                        batteryIcons[j].classList.add(str);
                    break;
                }
            }

            for (k = 0; k < infoIcons.length; k++) {
                for (i = 0; i < infoIcons[k].classList.length; i++) {
                    str = infoIcons[k].classList[i];
                    match = str.match("info_");
                    if (match !== null) {
                        infoIcons[k].classList.remove(str);
                        break;
                    }
                }
                infoIcons[k].classList.add("info_img");
            }

            settings_icon.classList.remove("settings_w_img");

            home_icon.classList.remove("home_dark");
            clicks_icon.classList.remove("clicks_dark");
            code_icon.classList.remove("code_dark");
            diary_icon.classList.remove("diary_dark");
            about_icon.classList.remove("about_dark");

            ig_icon.classList.remove("instagram_w");
            fb_icon.classList.remove("facebook_w");
            lk_icon.classList.remove("linkedin_w");
            gh_icon.classList.remove("github_w");
            x_icon.classList.remove("x_twitter_w");

            close_icon.classList.remove("close_w_img");

            humid_icon.classList.remove("humid_w_img");
            wind_icon.classList.remove("wind_w_img");
            temp_icon.classList.remove("temp_w_img");

            logo_h_img_pwa.classList.add("logo-full"); 
            sig_pwa.classList.add("signature");

            settings_icon.classList.add("settings_img");

            home_icon.classList.add("home");
            clicks_icon.classList.add("clicks");
            code_icon.classList.add("code");
            diary_icon.classList.add("diary");
            about_icon.classList.add("about");

            ig_icon.classList.add("instagram");
            fb_icon.classList.add("facebook");
            lk_icon.classList.add("linkedin");
            gh_icon.classList.add("github");
            x_icon.classList.add("x_twitter");

            close_icon.classList.add("close_img");

            humid_icon.classList.add("humid_img");
            wind_icon.classList.add("wind_img");
            temp_icon.classList.add("temp_img");

            if (weather_icon) {
                weather_icon.style.borderRadius = "";
            }
            motionIcon.classList.remove("shade");
            navbar_pwa.classList.remove("shade");
            fab.classList.remove("shade");
            fab2.classList.remove("shade");

            navButtonActive(active_icon_name, active_icon, true);
        }

        // ham_b.removeEventListener("click", hamScZdx);
        // lk3.classList.remove("z_Os"); //
        /*
        setTimeout(function() {
            h_sc.classList.remove("z-N");
            lk3.classList.add("z-G");
            ft_cnt.classList.remove("p-r", "z-N");
        }, op.t);

        ///////////////////////////////////////

        dw_img.classList.remove("download_w_img");
        ch_img.classList.remove("chevron_down_w_img");
        logo_h_img.classList.remove("logo-hybrid-inverse");
        logo_inv_img.classList.remove("logo-inverse-dark");
        pl3.classList.remove("lead_arrow_forward_w_img");

        dw_img.classList.add("download_img");
        ch_img.classList.add("chevron_down_img");
        logo_h_img.classList.add("logo-hybrid");
        logo_inv_img.classList.add("logo-inverse");
        pl3.classList.add("lead_arrow_forward_img");*/

        if (!op.pwa.s) {
            if (vw.pH) {
                for (i = 0; i < c_Info_a.length; i++) {
                    c_Info_a[i].classList.remove("lead_arrow_forward_w_img");
                    c_Info_a[i].classList.add("lead_arrow_forward_img");
                }

                w_img.classList.remove("work_w_img");
                s_img.classList.remove("school_w_img");
                l_img.classList.remove("location_w_img");

                w_img.classList.add("work_img");
                s_img.classList.add("school_img");
                l_img.classList.add("location_img");
            } else if (vw.tB && !vw.dk) {

                intro_L.classList.add("d_n");

            } else if (vw.dk) { //
                for (i = 0; i < c_Info_a.length; i++) {
                    c_Info_a[i].classList.remove("lead_arrow_forward_w_img");
                    c_Info_a[i].classList.add("lead_arrow_forward_img");
                }

                lb_img.classList.remove("lightbulb_w_img");

                lb_img.classList.add("lightbulb_img");
                pitch_d.classList.add("d_n");

            } 
        }

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