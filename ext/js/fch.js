
// locally run JS fetching (respective to each page)

var fchL = { // load up images (from HTML context)
        1 : { // #intro_sc profile image
            el : document.getElementsByClassName("profile_image"),
            u : 'ext/jpg/ivan_profile.jpg'
        },
        2 : { // logo_hybrid
            el : document.getElementsByClassName("logo-hybrid"),
            u : 'logo/logo_hybrid.png'
        },
        3 : { // favicon inverse
            el : document.getElementsByClassName("logo-inverse"),
            u : 'logo/favicon_inverse_512.png'
        },
        4 : { // logo_hybrid_inverse
            el : document.getElementsByClassName("logo-hybrid-inverse"),
            u : 'logo/logo_hybrid_inverse.png'
        },
        5 : {
            el : document.getElementsByClassName("logo-inverse-dark"),
            u : 'logo/favicon_dark_512.png'
        },
        6 : {
            el : document.getElementsByClassName("signature"),
            u : 'ext/png/signature.png'
        },
        7 : {
            el : document.getElementsByClassName("signature_w"),
            u : 'ext/png/signature_white.png'
        }
    },
    fch = {
        L : null
    },
    qInfo = [ // quick information
        document.getElementById("qIn1"), // work
        document.getElementById("qIn2"), // workType
        document.getElementById("qIn3"), // college
        document.getElementById("qIn4"), // course
        document.getElementById("qIn5"), // location
        document.getElementById("qIn6"), // coords
        document.getElementById("qIn7"), // cups
        document.getElementById("qIn8"), // coffee
        document.getElementById("qIn9"), // distance
        document.getElementById("qIn10"), // 
        document.getElementById("qIn11"), // time
        document.getElementById("qIn12"), // 
    ],
    sInfo = [
        document.getElementById("sIn1"), // distance
        document.getElementById("sIn2"), // hours
        document.getElementById("sIn3"), // cappuccinos
    ],
    wInfo_n = dev.skillsNum, // MAX/MIN no. of words in cloud lines
    wInfo = { // wordcloud h3 info (MAX/MIN. wInfo_n WORDS - UPDATE IF NEEDED, INCLUDE &nbsp; FOR EACH)
        s1 : [],
        s2 : [],
        s3 : [],
        s4 : []
    },
    wInfo_p = { // wordcloud h3 initial indexed elements
        s1 : 0,
        s2 : 0,
        s3 : 0,
        s4 : 0,
    },
    wInfo_s = { // wordcloud h3 info span total (live) widths
        s1 : 0,
        s2 : 0,
        s3 : 0,
        s4 : 0
    },
    wInfo_i = { // wordcloud h3 indiv. widths
        s1 : [],
        s2 : [], 
        s3 : [],  
        s4 : []
    },
    wInfo_ref = [], // reference array to find missing values
    prArr = [], // previous arrays (max. 5)

    /*
    wInfo_f = { // wordcloud h3 next index element
        s1 : 0,
        s2 : 0, 
        s3 : 0,
        s4 : 0
    },
    wInfo_r = { // wordcloud h3 RIGHT reload
        s1 : false,
        s2 : false,
        s3 : false,
        s4 : false
    },*/

    el = {
        x : false, // code execution
        x2 : false, 
        x3 : false, 
        x4 : false, 
        x5 : false,
        x6 : false,
        x7 : false,
        x8 : false,
        x9 : false,
        x10 : false,
        x11 : false,
        x12 : false,
        x13 : false,
        c4 : false,
        c5 : false,
        a : true, // scroll arrow anchor status
        ac : false, // scroll arrow click check
        g : false, // gyro sensor check
        n : document.querySelectorAll(".navbarlinks"),
        isc : document.getElementById("intro_sc"),
        imn : document.getElementById("intro_main"),
        cis : document.getElementById("cursorIntSpace"),
        cbs : document.getElementById("cursorBlendSpace"),
        cisX : 0,
        cisY : 0,
        cisXNum : 0,
        cisYNum : 0,
        i : document.getElementById("profile_image"),
        wdT : document.getElementById("wordsTyperDet"),
        pb : document.getElementById("profile_banner"),
        pgph : document.getElementById("pr_gt_ph"),
        Lt : document.getElementById("localTime"),
        Ltd : document.getElementById("localTimeDet"),
        Ltf : document.getElementById("localInfo"),
        lk3attach : false,
        lk3 : document.getElementById("link_3"),
        lk3a : document.getElementById("link_3a"),
        lk3b : document.getElementById("link_3b"),
        lk3c : document.getElementById("link_3c"),
        lk3cb : document.getElementById("link_3cbtn"),
        lk3cbs : document.querySelectorAll("#link_3cbtn span"),
        scBi : false, // scroll down button hover intervaling
        scBh : false, // "" full hover effect status
        scBe : false, // "" on hover status
        // scBy : false, // "" hover completion?
        lk4 : document.getElementById("link_4"),
        chev : document.getElementById("chev_d"),
        bgC : document.querySelectorAll(".bg-circle"),
        bgC4 : document.getElementById("bg-cir4"),
        ldw : document.getElementById("lead_wrap"),
        ldP : document.getElementById("lead_point"),
        ldP1 : document.getElementById("lead_point_1"),
        ldP4 : document.getElementById("lead_point_4"),
        disUnit : document.getElementById("distanceVariant"),
        q10 : document.getElementById("qIn10"),
        eInfo : document.getElementById("educationInfo"),
        q1_t : document.getElementById("qIn1_typer"),
        cIa : document.getElementsByClassName("c_Info_arrows"),
        qIc : document.getElementsByClassName("q_Info_icons"),
        mdh : document.getElementById("mid_sc_h"),
        fC : document.querySelectorAll("#fullCoords span"),
        wChe : {
            s1 : document.getElementById("wordclouds1"), //
            s2 : document.getElementById("wordclouds2"), //
            s3 : document.getElementById("wordclouds3"), //
            s4 : document.getElementById("wordclouds4") //
        },
        wCh : {
            s1 : document.querySelectorAll("#wordclouds1 span"), //
            s2 : document.querySelectorAll("#wordclouds2 span"), //
            s3 : document.querySelectorAll("#wordclouds3 span"), //
            s4 : document.querySelectorAll("#wordclouds4 span") //
        },
        wdTL : null,
        Ldpllx : document.getElementById("landscape_parallax"),
        Ldpllx_c : document.querySelector("#landscape_parallax .clouds"), // 
        Ldpllx_ca : [], // translateY values array
        Ldpllx_caX : [], // translateX values array
        Ldpllx_caXe : [], // translateX values array (extra)
        Ldpllx_ci : null,
        Ldpllx_g : document.querySelector("#landscape_parallax .terrain")
    },
    bd = { // bounds
        b0 : null,
        b1 : null,
        b2 : null,
        b3 : null,
        b4 : null
    };

let gyroscope = null;
var gyroscopeX = 0,
    gyroscopeY = 0;

var cursorDotsSize = 1,
    cursorDotsXArray = [],
    cursorDots;

var cursorBlendDotsRatios = [0.9, 0.8, 0.6, 0.4, 0.2, 0.1, 0.05]; // intervals

    /*
var apiTimeout = timeout * 0.25, // 25% timeout for APIs to load
    apiInit = 0, // init time for API load
    apiSuccess = false, // check
    ipAPIres = {},
*/

var nearbyCoordsDis = 50, // km
    weatherAPIres = {},
    weather = {
        elw : document.getElementById("localWeather"),
        elc : document.getElementById("localCity"),
        c : document.getElementById("localCityName"),
        r : document.getElementById("localWeatherReading"),
        u : document.getElementById("localWeatherUnit"),
        i : document.getElementById("localWeatherIcon")
    };

for (i = 0; i < dev.skillsNum; i++) {
    wInfo_ref[wInfo_ref.length] = i;
}

////////////////////////////

var hamScZdx = function() {
        var h_sc = document.getElementById("ham_sc"),
            lk3 = document.getElementById("link_3");

        if (hm.s) {
            h_sc.classList.remove("z-N"); // when ham_sc closes
            lk3.classList.remove("z_Os");
        } else {
            h_sc.classList.add("z-N"); // when ham_sc opens
            lk3.classList.add("z_Os");
        }
    };

function getColorModeIcon() { // get icon (light/dark mode) in mobile/phablet modes
    if (vw.pH) { // phablet
        return document.querySelector("#ham_phablet_sc #dm_btn .img_icon");
    } else { // mobile
        return document.querySelector("#ham_sc #dm_btn .img_icon");
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

            home_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .home') : document.querySelector('.pwa .navbar .home_dark'),
            clicks_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .clicks') : document.querySelector('.pwa .navbar .clicks_dark'),
            code_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .code') : document.querySelector('.pwa .navbar .code_dark'),
            diary_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .diary') : document.querySelector('.pwa .navbar .diary_dark'),
            about_icon = (!op.darkMode || init) ? document.querySelector('.pwa .navbar .about') : document.querySelector('.pwa .navbar .about_dark'),

            ig_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .instagram') : document.querySelector('.pwa .about .instagram_w'),
            fb_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .facebook') : document.querySelector('.pwa .about .facebook_w'),
            lk_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .linkedin') : document.querySelector('.pwa .about .linkedin_w'),
            gh_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .github') : document.querySelector('.pwa .about .github_w'),
            x_icon = (!op.darkMode || init) ? document.querySelector('.pwa .about .x') : document.querySelector('.pwa .about .x_w'),

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

        if (active_icon === null) {
            active_icon = document.querySelector('.pwa .navbar .button.' + defTab);
        }
        if (active_icon_name === "") {
            active_icon_name = defTab;
        }
    }

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
                div.setAttribute("class", "cursorInt");
                div.style.left = rdn + "rem";
                pitch_d.appendChild(div);
            }
        }
    } 

    if (!op.darkMode || init) { // if light, change to dark

        if (op.pwa.s) {
            logo_h_img_pwa.classList.remove("logo-full");
            sig_pwa.classList.remove("signature");

            home_icon.classList.remove("home");
            clicks_icon.classList.remove("clicks");
            code_icon.classList.remove("code");
            diary_icon.classList.remove("diary");
            about_icon.classList.remove("about");

            ig_icon.classList.remove("instagram");
            fb_icon.classList.remove("facebook");
            lk_icon.classList.remove("linkedin");
            gh_icon.classList.remove("github");
            x_icon.classList.remove("x");

            logo_h_img_pwa.classList.add("logo-hybrid-inverse");
            sig_pwa.classList.add("signature_w");

            home_icon.classList.add("home_dark");
            clicks_icon.classList.add("clicks_dark");
            code_icon.classList.add("code_dark");
            diary_icon.classList.add("diary_dark");
            about_icon.classList.add("about_dark");

            ig_icon.classList.add("instagram_w");
            fb_icon.classList.add("facebook_w");
            lk_icon.classList.add("linkedin_w");
            gh_icon.classList.add("github_w");
            x_icon.classList.add("x_w");

            weather_icon.style.borderRadius = "0.5rem";
            navbar_pwa.classList.add("shade");

            navButtonActive(active_icon_name, active_icon, true);
        }

        if (hm.s) { // if open
            h_sc.classList.add("z-N");
        }
        lk3.classList.remove("z-G");
        ft_cnt.classList.add("p-r", "z-N");

        ham_b.addEventListener("click", hamScZdx); 

        ///////////////////////////////////////

        dw_img.classList.remove("download_img");
        ch_img.classList.remove("chevron_down_img");
        logo_h_img.classList.remove("logo-hybrid");
        logo_inv_img.classList.remove("logo-inverse");
        pl3.classList.remove("lead_arrow_forward_img");

        dw_img.classList.add("download_w_img");
        ch_img.classList.add("chevron_down_w_img");
        logo_h_img.classList.add("logo-hybrid-inverse");
        logo_inv_img.classList.add("logo-inverse-dark");
        pl3.classList.add("lead_arrow_forward_w_img");

        ////////////////////////////////////////

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

    } else { // if dark, change to light

        if (op.pwa.s) {
            logo_h_img_pwa.classList.remove("logo-hybrid-inverse");
            sig_pwa.classList.remove("signature_w");

            home_icon.classList.remove("home_dark");
            clicks_icon.classList.remove("clicks_dark");
            code_icon.classList.remove("code_dark");
            diary_icon.classList.remove("diary_dark");
            about_icon.classList.remove("about_dark");

            ig_icon.classList.remove("instagram_w");
            fb_icon.classList.remove("facebook_w");
            lk_icon.classList.remove("linkedin_w");
            gh_icon.classList.remove("github_w");
            x_icon.classList.remove("x_w");

            logo_h_img_pwa.classList.add("logo-full"); 
            sig_pwa.classList.add("signature");

            home_icon.classList.add("home");
            clicks_icon.classList.add("clicks");
            code_icon.classList.add("code");
            diary_icon.classList.add("diary");
            about_icon.classList.add("about");

            ig_icon.classList.add("instagram");
            fb_icon.classList.add("facebook");
            lk_icon.classList.add("linkedin");
            gh_icon.classList.add("github");
            x_icon.classList.add("x");

            weather_icon.style.borderRadius = "";
            navbar_pwa.classList.remove("shade");

            navButtonActive(active_icon_name, active_icon, true);
        }

        ham_b.removeEventListener("click", hamScZdx);
        lk3.classList.remove("z_Os"); //

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
        pl3.classList.add("lead_arrow_forward_img");

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

////////////////////////////

function live_update() {
    if (rL.i && ((vw.pH && wiD >= 700) || (vw.dk))) {
        timeNow(el.Ltd);
    }
}

function displayErrorCheck() {
    var b = Math.round(getBd(el.isc, "bottom"));
    if (!vw.pH && !vw.tB && tDevice && pos.aT && (b !== aH)) { // if mobile
        return true;
    }
    return false;
}

function loadUp() {
    var a, b;
    for (var f in fchL) { // loop through required fetch objects above
        a = fchL[f].el;
        b = fchL[f].u;
        resLoad(a, b); // start fetching with target element and relative path
    }
}

function load_css_e() { // load CSS styles (page specific)
    var mg = "(" + aH + "px - 27.5rem) / 5"; // margin

    if (!vw.pH && !vw.tB) { // mobile
        c_css(".bg-circles", "height: calc(" + aH + "px + 8rem);", false, null);
        c_css(".bg-circles .circle-3", "top: calc(7rem + (" + mg + ") + 12rem);", false, null); // 7rem + profile_image top margin + inward offset of 2rem (rel. to p. image height)
        c_css("#bg-cir5", "top: calc(" + aH + "px + 6rem)", false, null);

        c_css("#profile_image, #intro_sc .content", "margin-top: calc(" + mg + ")", false, null); // margins are relative to the height
        c_css("#link_3", "height: calc(" + aH + "px - (30.32rem + 2 * (" + mg + ")));", false, null);

        c_css("#c_Info-m", "margin-top: calc(" + (aH * 0.5) + "px)", false, null);

        c_css("#prefooter_sc", "padding-top: " + aH + "px", false, null);
        c_css("#scroll_banner, #design_banner", "margin-top: " + (aH * 0.5) + "px", false, null);

        c_css("#ham_C", "margin-top: calc((" + aH + "px - 16rem) / 2);", false, null);

    } else if (vw.pH) { // phablet
        var qI_o = ["work_w_img", "school_w_img", "location_w_img"],
            qI_c = ["work_img", "school_img", "location_img"];

        el.i.classList.remove("m_Az");
        el.i.classList.add("d_i");
        el.i.classList.add("m_L-10");

        el.pb.classList.add("m_T");

        im.L.classList.remove("bC_d");
        im.L.classList.remove("c_w");
        el.ldP1.innerHTML = "i create";

        el.q1_t.classList.remove("bC_L");
        el.q1_t.classList.add("bC_d");

        if (wiD >= 700) {
            timeNow(el.Ltd);

            el.pgph.innerHTML = "Hello. I'm";
            el.Lt.classList.remove("d_n"); // show time
            el.Lt.classList.add("d_i");

            el.mdh.innerHTML = "hours &";
        }

        for (j = 0; j <= (el.cIa.length - 1); j++) { // change arrows
            el.cIa[j].classList.remove("lead_arrow_forward_w_img");
            el.cIa[j].classList.add("lead_arrow_forward_img");
        }

        for (k = 0; k <= (el.qIc.length - 1); k++) { // change icons
            el.qIc[k].classList.remove(qI_o[k]);
            el.qIc[k].classList.add(qI_c[k]);
        }
    } else if (vw.tB) { // tablet

        el.i.classList.remove("m_Az");
        el.pb.classList.remove("m_L-10");
        el.pb.classList.remove("m_wd");

        pg.sc.d.classList.add("h-f");
        c_rep(el.ldw, "m_L-20", "m_L-10");

        pg.sc.e.classList.add("h-f");
        pg.sc.e.classList.add("bC_d");
        pg.sc.e.classList.add("c_w");

        c_css("#intro_sc", "height: calc(" + aH + "px - 5.5rem)", false, null);
        c_css("#lead_wrap", "padding-bottom: 0", false, null);

        if (vw.dk) { // desktop

            var ld_cloud_d = 10,
                ld_cloud_w = ld_cloud_d * op.fN // width in rem (px) of element
                ld_cloud_n = Math.ceil(wD / ld_cloud_w) + 1;

            for (w = 0; w <= el.n.length - 1; w++) { // set up animating navbar elements
                el.n[w].classList.add("up");
                if (w < el.n.length - 1) {
                    el.n[w].classList.add("d_n");
                } else {
                    // remove dark-mode function on button
                }
            }

            el.Ltf.classList.remove("d_n");
            c_rep(im.L, "h-f", "h-fd"); 
            c_css("#lead_wrap", "padding-top: calc(100vh - (17.4rem / 2))", false, null);

            // console.log("ipapi1");

            if (ipAPIres.online && weatherAPIres.online) {
                if (ipAPIres.city === gps.city && ipAPIres.country.iso_code === gps.country && (coordsDistance(gps.lat, ipAPIres.lat, gps.lon, ipAPIres.lon) < nearbyCoordsDis)) { // IF USER in same city/region/country

                    qInfo[4].innerHTML = "in your city!";
                    
                } else if (ipAPIres.country.iso_code === gps.country && (coordsDistance(gps.lat, ipAPIres.lat, gps.lon, ipAPIres.lon) < nearbyCoordsDis)) { // IF USER is in same country & region, BUT different city

                    qInfo[4].innerHTML = "closer than you think <span class='key-sm'>:</span>)";

                } else if (ipAPIres.country.iso_code === gps.country && (coordsDistance(gps.lat, ipAPIres.lat, gps.lon, ipAPIres.lon) >= nearbyCoordsDis)) { // IF USER in same country

                    qInfo[4].innerHTML = "quite within, but far <span class='key-sm'>;</span>)";

                } else if (apiSuccess && weather.c.innerHTML !== "-" && weather.i.style.backgroundImage ) {

                    qInfo[4].innerHTML = "earth";
                }

            } else {

                qInfo[4].innerHTML = "earth";
            }

            // LANDSCAPE PARALLAX
            
            for (i = 0; i < ld_cloud_n; i++) {
                var randomY = getRandomInt(0, 3); // get random translateY value
                const div = document.createElement("DIV");
                el.Ldpllx_ca[i] = randomY; // y transform
                el.Ldpllx_caX[i] = ((i - 1) * ld_cloud_d); // x transform
                el.Ldpllx_caXe[i] = getRandomInt(1, 6); // x-transform extra
                div.setAttribute("class", "img cloud_img trs p-a");
                div.style.transform = "translateX(" + ((i - 1) * ld_cloud_d) + "rem) translateY(" + randomY + "rem)";
                el.Ldpllx_c.appendChild(div); //
            }

            el.Ldpllx_ci = document.querySelectorAll("#landscape_parallax .cloud_img"); // get all clouds

        } else {
            c_css(".q_Info, .q_Info > div", "margin: 0 !important", false, null);
        }

    }

    if (!vw.pH && !vw.tB) { // mobile
        if (wD >= 290 && aH <= 640 && !vw.mB_L) { // if width min at 290px; height max at 640px; portrait view
            if (!(wD >= 310 && aH <= 550)) { // if width/height NOT within 310px and 550px
                c_css("#profile_image", "width: 17rem; height: 17rem;", false, null); // apply style mod
                c_css("#link_3", "height: calc(" + aH + "px - (29.32rem + 2 * (" + mg + ")));", false, null);
            } else {
                c_css("#link_3", "height: calc(" + aH + "px - (26.32rem + ((480px - 27.5rem) / 3)));", false, null);
            }
        }
    }

    if (!op.b.s) { // if browser platform is NOT Safari

        // ONLY APPLY FOR DESKTOP VIEWPORTS!

        /*
        c_css(".bt:active", "background-color: #E4E4E4;", false, null); // apply button active states
        c_css(".bt.md:active", "background-color: #565656;", false, null);*/
    }
}

////////////////////////////////////////////////////////////////////////////
/*
async function ipAPI(v) {  // 50,000 per month limit, https://ipinfo.io/ 
    await fetch("https://ipinfo.io" + v + "/json?token=38ec70e8a088d5")
        .then((response) => {
            return response.json().then((data) => {
                ipAPIres = data;
                ipAPIres.lat = data.loc.slice(0, ipAPIres.loc.indexOf(",")), // get user latitude;
                ipAPIres.lon = data.loc.slice(ipAPIres.loc.indexOf(",") + 1, ipAPIres.loc.length), // get user longitude;
                ipAPIres.online = true;
            }).catch((error) => {
                ipAPIres.error = true;
            });
        })
}*/

async function weatherAPI(lat, lon, unit) { // 1,000,000 per month, 60 per minute limits, https://openweathermap.org/
    await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + unit + "&appid=62dfc011a0d14a0996e185364706fe76")
        .then((response) => {
            return response.json().then((data) => {
                weatherAPIres = data;
                weatherAPIres.online = true;
            }).catch((error) => {
                weatherAPIres.error = true;
            });
        })
}

function tempUnit(c) { // return unit of measure per user country location
    var res = "metric"; // default
    for (var x in f_countries) {
        if (f_countries[x].iso_A2 === c) { // if matches given list
            res = "imperial";
            break;
        }
    }
    return res;
}

/////////////////////////////////////////////////////////////////////////////

function load_js_e() { // load JS (page specific)

    if (!el.c5) { // once

        el.c5 = true;

        var b = getBd(hm.b, "bottom"), // obtain 'bottom' bound of ham. button
            _Lq = qInfo.length, // number of elements
            i = 0;

        hm.f = b; // update the hamburger menu object properties

        // el.disUnit.innerHTML = (op.lang === "gb") ? "km" : "miles";
        // el.q10.innerHTML = (op.lang === "gb") ? "km" : "miles";

        for (var d in dev.info) { // loop through to concatenate information to text
            if (i < _Lq) {
                if (i !== 0 && i !== 6 && i !== 7 && ((i !== 3 && i !== 4 && vw.dk) || !vw.dk)) {
                    qInfo[i].innerHTML = dev.info[d];
                } else { // run typing effect
                    try {
                        ld.x4 = true;
                    } catch (error) {
                        
                    }
                } 
                i++;
            }
        }

        if (vw.dk) { // if desktop
            var b = 0;
            for (var c in gpsInfo) {
                if (b === 3) {
                    el.fC[b].innerHTML = gpsInfo[c];
                    el.fC[b + 1].innerHTML = "&nbsp;&nbsp;";
                    b++;
                } else if (b === 2 || b === 7) { // location masks
                    el.fC[b].innerHTML = 'xx"';
                } else {
                    el.fC[b].innerHTML = gpsInfo[c];
                }
                b++;
            }

            timeNow(el.Ltd); // show time
            el.Lt.classList.remove("d_n");

            // ADD cursor interaction 'dots'
            while (el.cisY < aH) { // y-axis
                while (el.cisX < wiD) { // x-axis
                    const div = document.createElement("div");
                    div.classList.add("cursorInt");
                    div.classList.add("trs");
                    div.setAttribute("id", "cursorInt_" + "X" + (el.cisX + ((cursorDotsSize * 0.75) * op.fN)) + "Y" + (el.cisY + ((cursorDotsSize * 0.75) * op.fN)));
                    div.style.top = el.cisY + "px";
                    div.style.left = el.cisX + "px";
                    if (el.cisYNum === 0) {
                        cursorDotsXArray[cursorDotsXArray.length] = el.cisX; // add to x-array
                    }
                    el.cis.appendChild(div);
                    el.cisX += (cursorDotsSize * op.fN);
                    if (el.cisYNum === 0) {
                        el.cisXNum++;
                    }
                }
                el.cisY += (cursorDotsSize * op.fN);
                el.cisX = 0;
                el.cisYNum++;
            }

            cursorDots = document.getElementsByClassName("cursorInt"); //

            // ADD cursor BLEND 'dots' (between intro_sc and lead_sc)
            var top = 0;

            for (i = 1; i <= cursorBlendDotsRatios.length; i++) {
                var dotsFreq = Math.round(el.cisXNum * cursorBlendDotsRatios[i - 1]),
                    dotsAlloc = [], // allocated dot spaces
                    count = 0;

                while (count < dotsFreq) {
                    var randomNum = Math.floor(Math.random() * (cursorDotsXArray.length)); // get random x-pos

                    while (dotsAlloc.includes(randomNum)) {
                        randomNum = Math.floor(Math.random() * (cursorDotsXArray.length)); // get random x-pos again if duplicated
                    }
                    dotsAlloc[dotsAlloc.length] = randomNum;

                    const div = document.createElement("div");
                    div.classList.add("cursorInt");
                    div.classList.add("trs");
                    div.style.top = top + "px";
                    div.style.left = cursorDotsXArray[randomNum] + "px";
                    div.setAttribute("id", "cursorInt_" + "X" + (cursorDotsXArray[randomNum] + ((cursorDotsSize * 0.75) * op.fN)) + "Y" + (el.cisY + ((cursorDotsSize * 0.75) * op.fN)));

                    el.cbs.appendChild(div);
                    count++;
                }
                top += (cursorDotsSize * op.fN);
                el.cisY += (cursorDotsSize * op.fN);

                // console.log(dotsFreq);
            }

            /*
            apiInit = op.d.getTime();
            ipAPI("/219.93.183.103"); // get user IP information API (ENTER A region IP value for testing, "/" + IP Address)
            */

            var dkAPI = function() {

                // console.log("ipapi2");

                if (ipAPIres.error) {

                    apiSuccess = null; 

                    ///////
                    // SET a loop to continously check for variable within timeout time

                } else if (ipAPIres.online && !ipAPIres.verified) { // verify IP API 1
                
                    ipAPI2(clientAPIres.ipString); // get IP information API 2

                    setTimeout(function() {
                        if (ipAPIres.city !== ipAPI2res.city) {
                            ipAPI3();   
                        } else {
                            ipAPIres.verified = true;

                            dkAPI();
                        }
                        setTimeout(function() {
                            if (ipAPI3res.city !== ipAPI2res.city && ipAPI3res.city !== ipAPIres.city) { // if none matching

                                ipAPI4(clientAPIres.ipString);

                                setTimeout(function() {
                                    if (ipAPI4res.city === ipAPI3res.city) { // ip4 with ip3
                                        ipAPIres.city = ipAPI3res.city;
                                        ipAPIres.lat = ipAPI3res.latitude;
                                        ipAPIres.lon = ipAPI3res.longitude;
                                        ipAPIres.timezone = ipAPI3res.time_zone.name;

                                        ipAPIres.verified = true;

                                        dkAPI();

                                    } else if (ipAPI4res.city === ipAPI2res.city) { // ip4 with ip2
                                        ipAPIres.city = ipAPI2res.city;
                                        ipAPIres.lat = ipAPI2res.location.latitude;
                                        ipAPIres.lon = ipAPI2res.location.longitude;
                                        ipAPIres.timezone = ipAPI2res.location.time_zone;

                                        ipAPIres.verified = true;

                                        dkAPI();

                                    } else if (ipAPI4res.city === ipAPIres.city) { // ip4 with ip1
                                        // ipAPIres.city = ipAPIres.city;

                                        ipAPIres.verified = true;

                                        dkAPI();

                                    } else { // no consistent matches

                                        ipAPIres.failed = true;
                                    }
                                }, dev.i);

                            } else { // if one matching
                                if (ipAPI3res.city === ipAPI2res.city) { // ip3 with ip2
                                    ipAPIres.city = ipAPI2res.city;
                                    ipAPIres.lat = ipAPI2res.location.latitude;
                                    ipAPIres.lon = ipAPI2res.location.longitude;
                                    ipAPIres.timezone = ipAPI2res.location.time_zone;
                                } else if (ipAPI3res.city === ipAPIres.city) { // ip3 with ip1
                                    // ipAPIres.city = ipAPIres.city;
                                }

                                ipAPIres.verified = true;

                                dkAPI();
                            }
                        }, dev.i);
                    }, dev.i);

                } else if ((ipAPIres.online && ipAPIres.verified) || ipAPIres.failed) { // if no errors & online, proceed

                    var // lat = ipAPIres.loc.slice(0, ipAPIres.loc.indexOf(",")), // get user latitude
                        // lon = ipAPIres.loc.slice(ipAPIres.loc.indexOf(",") + 1, ipAPIres.loc.length), // get user longitude
                        unit = tempUnit(ipAPIres.country.iso_code);
                    
                    weatherAPI(ipAPIres.lat, ipAPIres.lon, unit); // get user location weather information API

                    var wtAPI = function() {
                        if (weatherAPIres.error) {

                            apiSuccess = null;
                            /////////////

                        } else if (weatherAPIres.online) {

                            // EDIT INFO TO HTML
                            weather.r.innerHTML = Math.round(weatherAPIres.main.temp); // weather reading
                            weather.u.innerHTML = (tempUnit(ipAPIres.country.iso_code) === "metric") ? "C" : "F"; // weather unit
                            weather.c.innerHTML = ipAPIres.city; // weather city

                            var weatherIcon = async function() { // weather icon
                                await fetch("https://openweathermap.org/img/wn/" + weatherAPIres.weather["0"].icon + "@2x.png")
                                    .then((response) => {
                                        weather.i.style.backgroundImage = "url('https://openweathermap.org/img/wn/" + weatherAPIres.weather["0"].icon + "@2x.png')";
                                        apiSuccess = true;
                                    }).catch((error) => {
                                        apiSuccess = null;
                                    });
                            }

                            weatherIcon();

                        } else if ((op.d.getTime() - apiInit) < apiTimeout) {
                            setTimeout(wtAPI, op.t); // recheck variable if API load still within timeout range

                        } else {

                            apiSuccess = null;
                            ////////////
                        }
                    }

                    wtAPI();

                } else if ((op.d.getTime() - apiInit) < apiTimeout) {
                    setTimeout(dkAPI, op.t); // recheck variable if API load still within timeout range

                } else {

                    apiSuccess = null;
                    ///////////
                }
            }

            dkAPI(); // get desktop APIs

        }
    }
}

function js_load() { // check JS load progress (indiv.)
    if (apiSuccess === false) { // check load status of APIs
        return false;
    } else if (apiSuccess === null) { // if API fails to load
        weather.elw.classList.add("d_n"); // don't display
        weather.elc.classList.add("d_n");
        return null; // null
    } else if (apiSuccess && weather.c.innerHTML !== "-" && weather.i.style.backgroundImage) { // if API loaded up
        return true;
    }
}

function js_load_e() { // js_load extension (custom condition)
    return (js_load() === null && vw.dk);
}

function js_live() { // update js - in live
    var // e = (!vw.pH && !vw.tB) ? el.lk3b : el.lk3c,
        e = el.lk3b,
        eB = (!vw.pH && !vw.tB) ? el.lk3 : el.lk3cb;
    if (!el.ac) { 
        if ((!pg.msg.fo && pos.aT) && el.x) { // if page online AND not scrolled
            e.classList.remove("d_n");
            load_eN(); // reload scroll arrow feature
            el.x = false;
        }
    } else {
        if ((!pos.aT && !el.x3) || pg.msg.fo) { // if scrolled OR offline
            el.x3 = true;
            eB.removeEventListener("click", peek); 
            if (eB === el.lk3) {
                el.lk3attach = false;
            }
            e_Fd(e, true); // fade out 
            if (!vw.pH && !vw.tB) {
                e_Fd(el.chev, true); 
            } else if (vw.dk) {
                // e_Fd(eB, true); 
                eB.classList.add("left");
                eB.classList.remove("hoverB", "revert");
                eB.removeEventListener("mousemove", hoverInit);
                eB.removeEventListener("mousemove", peekDesktop);
                el.lk3c.classList.add("z_O");
            }
            setTimeout(function() {
                e.style.height = "0px"; // set link to 0 height
            }, op.t);
        } else if (pos.aT && el.x3 && !pg.msg.fo) { // back to top AND online
            e_Fd(e, false); // fade in
            load_eN();
            setTimeout(function() {
                el.x3 = false;
            }, op.t);
        } else if (!pos.aT && el.lk3attach && eB === el.lk3) { // if scrolled & peek function not removed (bug fix)
            eB.removeEventListener("click", peek);
        }
    }
    if (!pos.aT && !el.x9) { // hide hamburger button
        el.x9 = true;
        hamButtonLoad(false);
    } else if (pos.aT && el.x9 && !el.x10) { // show
        el.x9 = false;
        el.x10 = true;
        hamButtonLoad(true);
    } else if (pos.aT && !pos.c && el.x10 && el.x2 && el.x9) { // show
        el.x9 = false;
        hamButtonLoad(true); 
    }
}

function load_eN() { // load, after cookie acceptance (page specific)

    if (!el.x13) { // common
        sI_1.n = (op.lang === "gb") ? 97 : kmToMiles(97), // km : miles

        el.disUnit.innerHTML = (op.lang === "gb") ? "km" : "miles";
        el.q10.innerHTML = (op.lang === "gb") ? "km" : "miles";

        el.x13 = true;
    }

    if (!vw.tB && !vw.pH) { // mobile
        // scroll arrow
        var h = getBd(el.lk3, "height");
        if (h >= 65) { // min. 65px height required
            el.c4 = true;
            el.bgC4.classList.remove("d_n"); // show circle 4
            if (h >= 85) {
                if (!el.x4) {
                    c_css(".bg-circles .circle-4", "top: calc(" + aH + "px - 4rem);", false, null); 
                    el.x4 = true;
                }
                el.bgC4.style.left = "60%";
                scrollArrowIterate(true, el.lk3b, "1rem", "calc(100% - 2.5rem)", "auto", "1.5rem", el.chev); // start iteration
                el.ac = false;
            } else {
                if (!el.x4) {
                    c_css(".bg-circles .circle-4", "top: calc(" + aH + "px - 3.5rem);", false, null); 
                    el.x4 = true;
                }
                if (!hm.e || hm.s) { // hamburger menu is not active
                    scrollArrowIterate(false, el.lk3b, "1rem", "calc(100% - 2.5rem)", "auto", "1.5rem", el.chev); // start iteration (single)
                    hm.k3 = true;
                    setTimeout(function() {
                        el.lk3.classList.remove("z-G");
                        el.lk3.addEventListener("click", peek); 
                        el.lk3attach = true;
                    }, op.te);
                }
                el.ac = true;
            }
            c_rep(el.lk3a, "h-z", "h-fp"); // show 'scroll-down' box 
            e_Fd(el.chev, false); // show chevron
        }
        if (!el.x2) { // show background circles + ham. button strokes at load
            el.x2 = true;
            setTimeout(function() {
                if (pos.aT) {
                    el.x9 = false;
                    hamButtonLoad(true); // ham. button
                }
            }, op.t);
            setTimeout(function() {
                showCircle();
            }, op.te);
        }
    } else if (vw.dk) { // desktop

        var w = 0;
            s = function() {
                if (w <= (el.n.length - 1)) {
                    if (w === (el.n.length - 1)) {
                        // add dark-mode function on button
                    } else {
                        el.n[w].classList.remove("d_n");
                    }
                    setTimeout(function() {
                        el.n[w].classList.remove("up");
                        w++;
                        setTimeout(s, (op.t / 4))
                    }, 10);
                }
            };
        if (!el.x12) { 
            var f;

            el.lk4.classList.remove("z_wd"); // add width on link_4
            s(); // start navbar animations

            ld.wdTL = setInterval(function() { // typing effect
                e_wCycle(el.wdT, dev.info.work, ld.wdTL);
            }, op.t);

            f = function() { // show local weather/city information

                // console.log("ipapi3");

                if (apiSuccess && weather.c.innerHTML !== "-" && weather.i.style.backgroundImage && ipAPIres.online && weatherAPIres.online) {
                    const singulars = [0, 1, -0, -1];
                    const singularsCheck = singulars.every(value => { // check if return temperature reading is a singular value
                        return value === Math.round(weatherAPIres.main.temp);
                      });

                    var unitTitle = (tempUnit(ipAPIres.country.iso_code) === "metric") ? "Celsius" : "Fahrenheit",
                        unitSingular = (singularsCheck) ? " degree " : " degrees ";

                    e_Fd(el.Ltf, false);

                    // add titles
                    el.Ltd.title = op.d; // time
                    weather.c.title = ipAPIres.city; // weather city name
                    weather.r.title = Math.round(weatherAPIres.main.temp) + unitSingular + unitTitle; // weather reading
                    weather.i.title = weatherAPIres.weather["0"].main; // weather description

                } else if ((op.d.getTime() - apiInit) < apiTimeout) {
                    setTimeout(function() {
                        f();
                    }, op.t);
                }
            };
            f();

            scrollArrowIterate(true, el.lk3c, "-0.5rem", "2.5rem", "auto", "-2rem", null); // scroll indicator
            el.x12 = true;

            // desktop wordcloud feature - keywords insertions
            // var line = 1;

            for (var a in el.wCh) { // load up (& initial show some) keywords on all lines

                for (i = 0; i <= (dev.skills[a].length - 1); i++) { // LOAD from skills array (msc.js)
                    wInfo[a][i] = dev.skills[a][i] + "&nbsp;";
                }

                for (b = 0; b <= el.wCh[a].length - 1; b++) {
                    var wd;
                    el.wCh[a][b].innerHTML = wInfo[a][b];

                    wd = getBd(el.wCh[a][b], "width"); // get width
                    wInfo_s[a] += wd; // update total line width
                    wInfo_i[a][b] = wd; // update indiv. word widths

                    if (wInfo_s[a] > wiD) { // check if within viewport width (single-line) space

                        // el.wCh[a][b].classList.add("d_n", "z_O", "trs"); // else, hide
                        // el.wCh[a][b].classList.add("z_O", "p-a", "trs_e"); // else, hide
                        
                        el.wCh[a][b].classList.add("d_n", "z_O", "p-a", "trs");
                        el.wCh[a][b].classList.add("h" + b);

                    } else {

                        el.wCh[a][b].classList.remove("h" + b);
                        el.wCh[a][b].classList.remove("v_n"); // show if visible
                        el.wCh[a][b].classList.add("v_s", "actv", "trs"); // show if visible + activated
                        el.wCh[a][b].classList.add("r" + b); // index for reference

                        // wInfo_f[a]++; // next indexed word in sequence

                        wInfo_p[a]++; // number of words at initial
                    }
                }

                // wordCloudTransform(line, el.wCh[a], wInfo_p[a]); // start wordclouding feature 

                // line++;
            }
        } 
        
        el.lk3cb.classList.remove("left"); // show scroll peek button
        el.lk3cb.classList.add("hoverB", "revert"); // 
        el.lk3cb.addEventListener("mousemove", hoverInit);
        el.lk3cb.addEventListener("mousemove", peekDesktop);
        el.lk3cb.addEventListener("mouseleave", peekDesktopLeave);
        el.lk3cb.addEventListener("click", peek); // add function
        el.lk3c.classList.remove("z_O");

        el.ac = true;
    }
}

function wordCloudTransform(d) {
    var active = 0, 
        getHidden = 0,
        hElement = null,
        hElementWidth = 0,
        hWords = [],
        targetWords = [],
        singleArr = [],
        comboArr = [];

    for (j = 0; j < dev.skillsNum; j++) { // find out which words (in a line) are hidden
        for (b = 0; b < dev.skillsNum; b++) {
            if (el.wCh["s" + d][j].classList.contains("h" + b)) {
                hWords[hWords.length] = b;
            }
        }
    }

    wInfo_p["s" + d] = document.querySelectorAll("#wordclouds" + d + " span.actv").length; // update number of active elements
    active = wInfo_p["s" + d];
    getHidden = hWords[getRandomInt(0, hWords.length)];
    hElement = document.querySelector("#wordclouds" + d + " span.h" + getHidden);
    hElementWidth = wInfo_i["s" + d][getHidden];

    // check if only 1 word is needed for replacement
    for (i = 0; i < (active - 1); i++) { // 1st pass, check if any (single) words fit width of hidden target
        if (wInfo_i["s" + d][i] >= hElementWidth) {
            singleArr[singleArr.length] = wInfo_i["s" + d][i];
        }

        if (i === (active - 2) && singleArr.length) { // last
            var targetWidth = Math.min(...singleArr),
                id = 0;
            for (j = 0; j < (active - 1); j++) {
                if (targetWidth === wInfo_i["s" + d][j]) {
                    targetWords[targetWords.length] = el.wCh["s" + d][j];
                    id = j;
                    break;
                }
            }

            if (!targetWords[0].classList.contains("r" + id)) { // if target does not match intended target
                for (k = 0; k < dev.skillsNum; k++) { // find the target again
                    if (el.wCh["s" + d][k].classList.contains("r" + id)) {
                        targetWords[0] = el.wCh["s" + d][k];
                        break;
                    }
                }
            }
            targetWords[0].classList.remove("v_s", "actv", "r" + id); // remove active word

            var index = checkForClassesInt(targetWords[0], "h", "r");

            if (index !== null) {
                if (index[0] !== null) {
                    targetWords[0].classList.remove("h" + index[0]);
                }
                if (index[1] !== null) {
                    targetWords[0].classList.remove("r" + index[1]);
                }
            }

            // console.log(targetWords[0].classList);

            targetWords[0].classList.add("c_n");
            targetWords[0].classList.add("z_O", "d_n", "v_n", "p-a", "h" + getHidden);

            setTimeout(function() {
                targetWords[0].classList.remove("c_n");
            }, (dev.i * 3));

            // console.log(getHidden);
            
            hElement.classList.remove("d_n", "v_n", "p-a", "h" + getHidden); // show hidden word
            hElement.classList.add("actv", "v_s", "r" + id);
            setTimeout(function() {
                hElement.classList.remove("z_O"); //
            }, op.t);
        }
    }
    
    if (!singleArr.length) { // 2 words needed for replacement
        var ids = [];
        for (i = 0; i < (active - 1); i++) { // 2nd pass, get combos of widths of 2 words to check fit with target. return the min. value combo.
            var rmd = (active - 1) - i, cnt = 1;
            while (cnt <= rmd) {
                var val = wInfo_i["s" + d][i] + wInfo_i["s" + d][i + cnt];
                if (val >= hElementWidth) {
                    comboArr[comboArr.length] = val;
                    ids[ids.length] = [i, i + cnt];
                }
                cnt++;
            }

            if (i === (active - 2) && comboArr.length) { // if last
                var // targetWidth = Math.min(...comboArr), 
                    targetWidth = 0,
                    id = 0,
                    newComboArr = [],
                    idWords = [],
                    hiddenWords = [getHidden];
                targetWords = []; // reset

                for (j = 0; j < (comboArr.length); j++) { // 2 words in combo need to be active in display (and fit dimensions)
                    var res = true;
                    for (m = 0; m < ids[j].length; m++) {
                        if (!el.wCh["s" + d][ids[j][m]].classList.contains("actv")) { // no active detected
                            res = false;
                            break;
                        }
                    }
                    if (res) { 
                        newComboArr[newComboArr.length] = comboArr[j];
                    }
                }

                if (!newComboArr.length) { // if no active combinations exist
                    var act = document.querySelectorAll("#wordclouds" + d + " span.actv"),
                        actIds = [];
                    for (e = 0; e < act.length; e++) {
                        for (b = 0; b < dev.skillsNum; b++) {
                            if (act[e] === el.wCh["s" + d][b]) {
                                actIds[e] = b; // link up with variable elements
                            }
                        }
                    }
                    // get the combos from the active words
                    for (i = 0; i < (act.length - 1); i++) {
                        rmd = (act.length - 1) - i;
                        cnt = 1;
                        while (cnt <= rmd) {
                            var val = wInfo_i["s" + d][actIds[i]] + wInfo_i["s" + d][actIds[i] + cnt];
                            if (val >= hElementWidth) {
                                newComboArr[newComboArr.length] = val;
                                ids[ids.length] = [actIds[i], actIds[i] + cnt];
                            }
                            cnt++;
                        }
                    }
                }

                targetWidth = Math.min(...newComboArr); // target width with active words (min.)

                for (j = 0; j < (comboArr.length); j++) { // find the match
                    if (targetWidth === comboArr[j]) { 
                        id = j;
                        break;
                    }
                }
                idWords = (ids[j] !== undefined) ? ids[j] : ids[ids.length - 1];
                for (k = 0; k < idWords.length; k++) {
                    targetWords[targetWords.length] = el.wCh["s" + d][idWords[k]];
                }
                hiddenWords[hiddenWords.length] = idWords[1];

                // console.log(targetWords[0].innerHTML + ", " + targetWords[1].innerHTML + ", " + hElement.innerHTML);
                
                for (m = 0; m < targetWords.length; m++) {
                    if (!targetWords[m].classList.contains("r" + idWords[m])) { // if target does not match intended target
                        for (k = 0; k < dev.skillsNum; k++) { // find the target again
                            if (el.wCh["s" + d][k].classList.contains("r" + idWords[m])) {
                                targetWords[m] = el.wCh["s" + d][k];
                                break;
                            }
                        }
                    }
                }
                
                for (m = 0; m < targetWords.length; m++) {
                    var hAdd = true;
                    if (targetWords[m].classList.contains("r" + idWords[m])) { // if containing
                        targetWords[m].classList.remove("v_s", "actv", "r" + idWords[m]); // remove active word
                    } else {
                        for (b = 0; b < dev.skillsNum; b++) {
                            if (targetWords[m].classList.contains("r" + b)) {
                                targetWords[m].classList.remove("v_s", "actv", "r" + b); // remove active word
                                break;
                            }
                        }
                    }
                    for (j = 0; j < dev.skillsNum; j++) { // if target el. contains .h[n] class
                        if (targetWords[m].classList.contains("h" + j)) {
                            hAdd = false;
                            break;
                        }
                    }
                    if (hAdd) {
                        if (wordCloudCheck(d, hiddenWords[m])) { // check for duplicate

                            var tg = targetWords[m];

                            targetWords[m].classList.add("c_n");

                            targetWords[m].classList.add("z_O", "d_n", "v_n", "p-a", "h" + hiddenWords[m]);

                            setTimeout(function() {
                                tg.classList.remove("c_n");
                            }, op.t);

                            // console.log(hiddenWords[m]);

                        } else { // choose another number that is not taken
                            var existNum = [],
                                missingNum = [],
                                randNum = 0;
                            for (c = 0; c < dev.skillsNum; c++) { // get existing numbers in other spans
                                for (e = 0; e < dev.skillsNum; e++) {
                                    if (el.wCh["s" + d][c].classList.contains("h" + e)) {
                                        existNum[existNum.length] = e;
                                    } else if (el.wCh["s" + d][c].classList.contains("r" + e)) {
                                        existNum[existNum.length] = e;
                                    }
                                }
                            }
                            missingNum = findMissingInt(existNum, wInfo_ref);
                            randNum = (missingNum.length !== 0) ? missingNum[getRandomInt(0, missingNum.length)] : getHidden;

                            var tg = targetWords[m];

                            targetWords[m].classList.add("c_n");

                            targetWords[m].classList.add("z_O", "d_n", "v_n", "p-a", "h" + randNum);

                            setTimeout(function() {
                                tg.classList.remove("c_n");
                            }, op.t);

                        }
                    }
                }

                if (hElement.classList.contains("h" + getHidden)) { // if containing
                    hElement.classList.remove("z_O", "d_n", "v_n", "p-a", "h" + getHidden); // show hidden word
                } else {
                    for (b = 0; b < dev.skillsNum; b++) {
                        if (hElement.classList.contains("h" + b)) {
                            hElement.classList.remove("z_O", "d_n", "v_n", "p-a", "h" + b); // remove active word
                            break;
                        }
                    }
                }
                if (wordCloudCheck(d, idWords[0])) { // check for duplicate
                    hElement.classList.add("actv", "v_s", "r" + idWords[0]);

                    //console.log(idWords[0]);

                } else {
                    var existNum = [],
                        missingNum = [],
                        randNum = 0;
                    for (c = 0; c < dev.skillsNum; c++) { // get existing numbers in other spans
                        for (e = 0; e < dev.skillsNum; e++) {
                            if (el.wCh["s" + d][c].classList.contains("h" + e)) {
                                existNum[existNum.length] = e;
                            } else if (el.wCh["s" + d][c].classList.contains("r" + e)) {
                                existNum[existNum.length] = e;
                            }
                        }
                    }
                    missingNum = findMissingInt(existNum, wInfo_ref);
                    randNum = (missingNum.length !== 0) ? missingNum[getRandomInt(0, missingNum.length)] : id;

                    hElement.classList.add("actv", "v_s", "r" + randNum);

                    // console.log(missingNum[getRandomInt(0, missingNum.length)]);
                }
            }
        }   
    }

    var acArr = []; // active array
    var ctvWid = 0; // cumulative width
    for (k = 0; k < dev.skillsNum; k++) {  // detect for overflow in line
        if (el.wCh["s" + d][k].classList.contains("actv")) {
            ctvWid += wInfo_i["s" + d][k];
            if (ctvWid > wiD) {
                ctvWid -= wInfo_i["s" + d][k];
                break;
            } else {
                acArr[acArr.length] = k;
            }
        } // 
    }
    if (ctvWid < (wiD / 1.75)) { // potential underflowing, less than half of screen width

        // look at prev. 5 iterations, show numbers which have not been shown

        var allNums = [],
            missingNum = [];
        for (b = 0; b < prArr.length; b++) {
            for (c = 0; c < prArr[b].length; c++) {
                if (allNums.indexOf(prArr[b][c]) === -1) {
                    allNums[allNums.length] = prArr[b][c];
                }
            } //
        }

        // console.log(allNums);

        // return the missing numbers
        missingNum = findMissingInt(allNums, wInfo_ref);
        acArr = removeDuplicates(acArr.concat(missingNum)); // prevent duplicates

        ctvWid = 0;
        for (e = 0; e < acArr.length; e++) {
            ctvWid += wInfo_i["s" + d][acArr[e]];
            if (ctvWid > wiD) {
                ctvWid -= wInfo_i["s" + d][acArr[e]];
                acArr.pop();
                break;
            }
        }
        
    } else { // add to records
        if (prArr.length < 5) {
            prArr[prArr.length] = acArr;
        } else {
            prArr.shift(); // remove first instance
            prArr[prArr.length] = acArr; // update 5th instance
        }
    }

    // console.log(acArr); // only show the elements in the array

    ctvWid = 0;

    for (j = 0; j < dev.skillsNum; j++) {
        if (acArr.indexOf(j) !== -1) { // display
            if (!el.wCh["s" + d][j].classList.contains("actv")) { // show hidden word

                ctvWid += wInfo_i["s" + d][j];
                if (ctvWid < wiD) {
                    var index = null; // r-index
                    for (c = 0; c < dev.skillsNum; c++) {
                        if (el.wCh["s" + d][j].classList.contains("h" + c)) {
                            index = c;
                        }
                    }
                    if (index !== null) {
                        el.wCh["s" + d][j].classList.remove("z_O", "d_n", "v_n", "p-a", "h" + index);
                        el.wCh["s" + d][j].classList.add("actv", "v_s", "r" + index);
                    }
                }

            }
        } else { // hide
            if (el.wCh["s" + d][j].classList.contains("actv")) { // remove active word

                var index = null; // r-index
                for (c = 0; c < dev.skillsNum; c++) {
                    if (el.wCh["s" + d][j].classList.contains("r" + c)) {
                        index = c;
                    }
                }

                var existNum = [],
                    missingNum = [],
                    randNum = 0;
                for (c = 0; c < dev.skillsNum; c++) { // get existing numbers in other spans
                    for (e = 0; e < dev.skillsNum; e++) {
                        if (el.wCh["s" + d][c].classList.contains("h" + e)) {
                            existNum[existNum.length] = e;
                        } else if (el.wCh["s" + d][c].classList.contains("r" + e)) {
                            existNum[existNum.length] = e;
                        }
                    }
                }
                missingNum = findMissingInt(existNum, wInfo_ref);
                randNum = (missingNum.length !== 0) ? missingNum[getRandomInt(0, missingNum.length)] : (index !== null) ? index : null;
                if (index !== null) {
                    el.wCh["s" + d][j].classList.remove("v_s", "actv", "r" + index);
                    el.wCh["s" + d][j].classList.add("z_O", "d_n", "v_n", "p-a", "h" + randNum);
                }
            }
        }
    }
}

function wordCloudCheck(d, a) {
    var res = true;
    for (i = 0; i < dev.skillsNum; i++) {
        if (el.wCh["s" + d][i].classList.contains("h" + a) || el.wCh["s" + d][i].classList.contains("r" + a)) {
            res = false;
        }
    }

    // console.log(a + ", " + res);

    return res;
}

function scrollArrowIterate(m, e, t, h, ta, b, ch) {
    el.a = true;
    e.style.top = t;
    e.style.height = h; // full height
    if (m) { // repeating iterations
        setTimeout(function() {
            el.a = false;
            e.style.top = ta;
            e.style.bottom = b; // reverse anchor
            e.style.height = 0; // zero height
            setTimeout(function() {
                if ((!pg.msg.fo && pos.aT) || vw.dk) { // if NOT offline AND NOT scrolled
                    scrollArrowIterate(m, e, t, h, ta, b, ch); // repeat
                } else if (pg.msg.fo || !pos.aT) { // if offline OR scrolled
                    el.x = true;
                    if (!vw.dk) {
                        e.classList.add("d_n");
                    }
                    if (ch) {
                        e_Fd(ch, true); // hide chevron
                    }
                }
            }, op.te);
        }, op.te);
    }
}

function peek() {
    var b = (!vw.tB && !vw.pH) ? el.ldP.getBoundingClientRect() : el.ldP4.getBoundingClientRect(), 
        m = (!vw.tB && !vw.pH) ? 1 : (1 - 0.1),
        t = (!vw.tB && !vw.pH) ? b.top : b.bottom;
    op.psV = m * (t - aH);
    document.documentElement.classList.add("scB");
    window.scrollTo(0, op.psV); // scroll to reasonable point in content area

    op.ps = true;
}

function peekDesktop() { // 'scroll' letter transform effect
    // var pos = [0.1, 0.2, 0.3, 0.4, 0.5]; // respective 'croll' phrase alphabet pos. transformations
    // var pos = [2.6, 2.2, 1.8, 1.4, 1.0];
    // var pos = [1.4, 1.0, 0.7, 1.2, 1.6, 2.0];
    /*
    for (i = 0; i <= (el.lk3cbs.length - 1); i++) {
        // el.lk3cbs[i].style.transform = "translateY(" + pos[i] + "rem)";
        el.lk3cbs[i].style.transform = "translateY(calc(-" + pos[i] + "rem + 0.7rem))";
    }*/
    // var alpha = ["d", "o", "w", "n"];

    el.scBe = true;
    el.scBeK = true;

    if (!el.scBi && !el.scBh && el.scBe) {
        el.scBi = true;
        var j = 0, m = 6, c = 11;
        for (i = 0; i <= (el.lk3cbs.length - 1); i++) {
            if (el.lk3cbs[i].classList.contains("scr")) {
                j++;
            }
        }
        j = m - j;

        el.lk3cbs[j].classList.remove("scr");
        if (!el.lk3cbs[j].classList.contains("z_F")) {
            el.lk3cbs[j].classList.add("z_O", "up", "ex");
        }

        if ((m + j) < c) {
            el.lk3cbs[m + j].classList.remove("z_O");
            el.lk3cbs[m + j].classList.add("up", "ex", "z_F", "scr_e");
            if (el.lk3cbs[m + j].classList.contains("z_O")) {
                el.lk3cbs[m + j].classList.remove("z_O");
            }
            if (j < (m - 1)) {
                setTimeout(function() {
                    el.scBi = false;
                    peekDesktop();
                }, (op.t / 8));
            }
        } else {
            el.scBi = false;
            el.scBh = true;
        }
    }
}

function peekDesktopLeave() {

    el.scBe = false;

    if (!el.scBi && el.scBh && !el.scBe) {
        el.scBi = true;
        var j = 0, m = 6, c = 11;
        for (i = 0; i <= (el.lk3cbs.length - 1); i++) {
            if (el.lk3cbs[i].classList.contains("z_O") && !el.lk3cbs[i].classList.contains("scr_e")) {
                j++;
            }
        }
        j = m - j;

        if (el.lk3cbs[j].classList.contains("z_O")) {
            el.lk3cbs[j].classList.add("scr");
            el.lk3cbs[j].classList.remove("z_O");
            el.lk3cbs[j].classList.remove("up");
            el.lk3cbs[j].classList.remove("ex");
        }

        if ((m + j) < c) {
            el.lk3cbs[m + j].classList.add("z_O");
            el.lk3cbs[m + j].classList.remove("z_F");
            el.lk3cbs[m + j].classList.remove("up");
            el.lk3cbs[m + j].classList.remove("ex");

            if (j < (m - 1)) {
                setTimeout(function() {
                    el.scBi = false;
                    // el.scBy = true;
                    peekDesktopLeave();
                }, (op.t / 8));
            }
        } else {
            el.scBi = false;
            el.scBh = false;

            // el.scBy = false; //
        }

    } else {
        el.isc.addEventListener("mouseenter", function() {

            if (!el.scBe) {

                if (!el.scBi && el.scBh && !el.scBe) {
                    peekDesktopLeave();
                }
                el.lk3cb.removeEventListener("mousemove", peekDesktop);
                el.lk3cb.addEventListener("mouseenter", peekDesktop);
            }

        }, true);

        el.isc.addEventListener("mousemove", function() {

            if (el.scBe && el.scBh && !el.scBi && !hoverActive) {
                peekDesktopLeave();
            }

        }, true);
    }
}

function showCircle() { // show background circles in view
    if (!el.x6 || el.x7) {
        var _L = el.bgC.length - 1,
            tgt;

        _L = el.c4 ? _L : _L - 1;
        el.x6 = true;

        for (i = 0; i <= _L; i++) {
            if (el.bgC[i].classList.contains("z_O") || el.bgC[i].classList.contains("d_n")) {
                el.x7 = true;
                tgt = i; 
                break;
            }
        }
        if (tgt !== undefined) {
            el.bgC[tgt].classList.remove("d_n");
            setTimeout(function() {
                e_Fd(el.bgC[tgt], false);
                bd["b" + tgt] = el.bgC[tgt].getBoundingClientRect(); // add parameters for 3rd/4th circles
                if (tgt === _L && !el.x11) { // last target
                    el.x11 = true;
                    pgTasks("gy", true); // initiate gyroscope
                }
            }, 10);
            
            if (tgt < _L) {
                setTimeout(function() {
                    for (i = 0; i <= _L; i++) {
                        if (el.bgC[i].classList.contains("z_O") || el.bgC[i].classList.contains("d_n")) {
                            showCircle();
                            break;
                        }
                    }
                }, op.t);
            } else {
                el.x6 = false;
            }
        } 
    }
}

function pgTasks(id, m) { // conduct any page-specific tasks (JS/CSS)
    if (id === "sc") { // bg circles
        if (!el.x8) {
            el.x8 = true;
            setTimeout(function() {
                el.x8 = false;
            }, op.t);

            var _L = el.bgC.length - 1;
            _L = el.c4 ? _L : _L - 1;

            if (m && !el.x5) {
                el.x5 = true;
                for (i = 0; i <= _L; i++) {
                    el.bgC[i].classList.add("d_n");
                }
            } else if (!m && el.x5) {
                el.x5 = false;
                for (i = 0; i <= _L; i++) {
                    e_Fd(el.bgC[i], true);
                    el.bgC[i].classList.add("d_n");
                }
                setTimeout(function() {
                    for (i = 0; i <= _L; i++) {
                        if (el.bgC[i].classList.contains("z_O") || el.bgC[i].classList.contains("d_n")) {
                            showCircle();
                            break;
                        }
                    }
                }, op.te);
            }
        }
    } else if (id === "gy") { // use gyroscope
        if ('Gyroscope' in window && m) { // browser support

            // REFERENCED FROM MDN @: https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
            // Experimental feature

            try {
                gyroscope = new Gyroscope({ referenceFrame: "device", frequency: 30 });
                gyroscope.addEventListener("error", (event) => {
                    // Handle runtime errors.
                    if (event.error.name === "NotAllowedError") {
                        // Branch to code for requesting permission.
                        console.log("Permission needed to use sensor.");
                    } else if (event.error.name === "NotReadableError") {
                        console.log("Cannot connect to the sensor.");
                    }
                    pgTasks("gy", false);
                });
                gyroscope.addEventListener("reading", () => bgCirclesMove(gyroscope));
                gyroscope.start();
                el.g = true;
            } catch (error) {
                // Handle construction errors.
                if (error.name === "SecurityError") {
                    // See the note above about permissions policy.
                    console.log("Sensor construction was blocked by a permissions policy.");
                } else if (error.name === "ReferenceError") {
                    console.log("Sensor is not supported by the User Agent.");
                } else {
                    throw error;
                }
                pgTasks("gy", false);
            }
        } else { // no support
            el.g = false;
            el.bgC[3].style.animation = "bounceTop 10s ease-in-out infinite";
        }
    }
}

function bgCirclesMove(e) { // live gyro-based movement of bg. circles
    var x = e.x, // x-axis
        y = e.y, // y-axis
        z = e.z; // z-axis

    gyroscopeX = (op.fN * y * 3);
    gyroscopeY = (op.fN * x * 3);

    if (op.Lf.h) { // if tab/window hidden
        el.bgC[0].style.left = "85%"; // circle 0.5
        el.bgC[1].style.top = "2.5rem"; // circle 1
        el.bgC[2].style.left = "15%"; // circle 2

        el.bgC[3].style.transform = "translate(0px, 0px)"; // circle 3
        
        if (!el.ac) {
            el.bgC[4].style.left = "60%"; // circle 4 
        } else {
            el.bgC[4].style.left = "80%"; // ci
        }
    } else {

        el.bgC[0].style.left = (85 + (gyroscopeX / 3)) + "%"; // circle 0.5
        el.bgC[1].style.top = "calc(2.5rem + " + (gyroscopeY / 4) + "px)"; // circle 1
        el.bgC[2].style.left = (15 + (gyroscopeX / 2)) + "%"; // circle 2

        el.bgC[3].style.transform = "translate(" + gyroscopeX + "px, " + gyroscopeY + "px)"; // circle 3

        if (!el.ac) {
            el.bgC[4].style.left = (60 + (gyroscopeX / 3)) + "%"; // circle 4 
        } else {
            el.bgC[4].style.left = (80 + (gyroscopeX / 3)) + "%"; // circle 4 
        }
    }
}

function cursorDotsInt(e) {

    if (getCookie("highPerformance") === "true") {

        const mouseY = e.clientY;
        const mouseX = e.clientX;

        const opacityLv1 = 0.5; // base level 1 opacity val.

        var boundaries = [opacityLv1, (opacityLv1 * 1.25), (opacityLv1 * 1.5), (opacityLv1 * 1.75)]; // level 1, 2, 3 & 4 boundaries (opacity)
        var segBoundaries = [cursorDotsSize, (cursorDotsSize * 1.25), (cursorDotsSize * 1.5), (cursorDotsSize * 1.75)]; // "" (distance)

        var boundaryYU = mouseY + (segBoundaries[0] * op.fN), // set level 1 boundary
            boundaryYL = mouseY - (segBoundaries[0] * op.fN),
            boundaryXU = mouseX + (segBoundaries[0] * op.fN),
            boundaryXL = mouseX - (segBoundaries[0] * op.fN),

            boundary2YU = mouseY + (segBoundaries[1] * op.fN), // set level 2 boundary
            boundary2YL = mouseY - (segBoundaries[1] * op.fN),
            boundary2XU = mouseX + (segBoundaries[1] * op.fN),
            boundary2XL = mouseX - (segBoundaries[1] * op.fN),

            boundary3YU = mouseY + (segBoundaries[2] * op.fN), // set level 3 boundary
            boundary3YL = mouseY - (segBoundaries[2] * op.fN),
            boundary3XU = mouseX + (segBoundaries[2] * op.fN),
            boundary3XL = mouseX - (segBoundaries[2] * op.fN),

            boundary4YU = mouseY + (segBoundaries[3] * op.fN), // set level 4 boundary
            boundary4YL = mouseY - (segBoundaries[3] * op.fN),
            boundary4XU = mouseX + (segBoundaries[3] * op.fN),
            boundary4XL = mouseX - (segBoundaries[3] * op.fN);

        var cursorDotsX = [],
            cursorDotsY = [],

            cursorDotsX2 = [],
            cursorDotsY2 = [],

            cursorDotsX3 = [],
            cursorDotsY3 = [],

            cursorDotsX4 = [],
            cursorDotsY4 = [];

        for (j = 0; j <= (el.cisXNum - 1); j++) { // dots in x-axis [triangulation]
            var segmentIndex1 = cursorDots[j].getAttribute("id").indexOf("X"),
                segmentIndex2 = cursorDots[j].getAttribute("id").indexOf("Y"),
                segment = Number(cursorDots[j].getAttribute("id").slice((segmentIndex1 + 1), segmentIndex2)); // get x-pos of dot

            if (segment > boundaryXL && segment < boundaryXU) { // if within boundary 1

                cursorDotsX[cursorDotsX.length] = j; // add to x array

            } else if (segment > boundary2XL && segment < boundary2XU) { // boundary 2

                cursorDotsX2[cursorDotsX2.length] = j; // add to x array

            } else if (segment > boundary3XL && segment < boundary3XU) { // boundary 3

                cursorDotsX3[cursorDotsX3.length] = j; // add to x array
                
            } else if (segment > boundary4XL && segment < boundary4XU) { // boundary 4

                cursorDotsX4[cursorDotsX4.length] = j; // add to x array
                
            }
        }
        
        for (k = 0; k <= (el.cisYNum - 1); k++) { // dots in y-axis [triangulation]
            var segmentIndex1 = cursorDots[(k * el.cisXNum)].getAttribute("id").indexOf("Y"),
                segment = Number(cursorDots[(k * el.cisXNum)].getAttribute("id").slice((segmentIndex1 + 1))); // get y-pos of dot

            if (segment > boundaryYL && segment < boundaryYU) { // boundary 1

                cursorDotsY[cursorDotsY.length] = (k * el.cisXNum); // add to y array

            } else if (segment > boundary2YL && segment < boundary2YU) {

                cursorDotsY2[cursorDotsY2.length] = (k * el.cisXNum); // add to y array

            } else if (segment > boundary3YL && segment < boundary3YU) {

                cursorDotsY3[cursorDotsY3.length] = (k * el.cisXNum); // add to y array

            } else if (segment > boundary4YL && segment < boundary4YU) {

                cursorDotsY4[cursorDotsY4.length] = (k * el.cisXNum); // add to y array

            }
        }

        for (const dotX of cursorDotsX) { // triangulate to cursor and apply effect(s)
            for (const dotY of cursorDotsY) {
                cursorDots[dotX + dotY].style.opacity = boundaries[0];
                //cursorDots[dotX + dotY].style.background = "red";
                setTimeout(function() {
                    cursorDots[dotX + dotY].style.opacity = ""; // revert effect after user res. time
                }, dev.i);
            }
        }

        for (const dotX of cursorDotsX2) { // apply effects to other boundaries
            for (const dotY of cursorDotsY2) {
                cursorDots[dotX + dotY].style.opacity = boundaries[1];
                //cursorDots[dotX + dotY].style.background = "blue";
                setTimeout(function() {
                    cursorDots[dotX + dotY].style.opacity = "";
                }, dev.i);
            }
        }

        for (const dotX of cursorDotsX3) { // 
            for (const dotY of cursorDotsY3) {
                cursorDots[dotX + dotY].style.opacity = boundaries[2];
                //cursorDots[dotX + dotY].style.background = "yellow";
                setTimeout(function() {
                    cursorDots[dotX + dotY].style.opacity = "";
                }, dev.i);
            }
        }

        for (const dotX of cursorDotsX4) { // 
            for (const dotY of cursorDotsY4) {
                cursorDots[dotX + dotY].style.opacity = boundaries[3];
                //cursorDots[dotX + dotY].style.background = "green";
                setTimeout(function() {
                    cursorDots[dotX + dotY].style.opacity = "";
                }, dev.i);
            }
        }
    }

}

el.imn.addEventListener("mousemove", cursorDotsInt);


window.addEventListener("visibilitychange", function() { // modify sensor usage
    if (el.g) {
        if (document.hidden) { // hidden document
            gyroscope.stop();
        } else { // visible document
            gyroscope = new Gyroscope({ referenceFrame: "device", frequency: 30 });
            gyroscope.addEventListener("reading", () => bgCirclesMove(gyroscope));
            gyroscope.start();
        }
    }
});


fch.L = setInterval(live_update, dev.i);