
var sI_1 = {},
    sI_2 = {},
    sI_3 = {};

var sectionScroll = false,
    sectionScrollPos = 0;

const sections = document.querySelector('.pwa .sections');

screen.orientation.addEventListener("change", function() {
    const sections = document.querySelector('.pwa .sections');
    if (screen.orientation.angle == 90 || screen.orientation.angle == 270) { // P to L
        sections.style.height = "100svh";
    }
    if (screen.orientation.angle == 0 || screen.orientation.angle == 180) { // L to P
        if (window.innerWidth < 490) {
            sections.style.height = "calc(" + dev.uH.getBoundingClientRect().height + "px - 4rem)";
        }
    }
});

function navButtonActive(b, e) {
    var target = e.currentTarget || e;
    const buttons = document.querySelectorAll('.pwa .navbar .button');

    for (i = 0; i < buttons.length; i++) { // remove from other non-targets
        if (buttons[i] !== target) {
            if (buttons[i].classList.contains("buttonActive")) {
                var old;
                for (j = 0; j < buttons[i].classList.length; j++) {
                    if (buttons[i].classList[j] !== "button" && buttons[i].classList[j] !== "buttonActive") {
                        old = buttons[i].classList[j];
                        break;
                    }
                }
                buttons[i].children[0].style.backgroundImage = "url('../pwa/" + old + ".png')";
                e_Fd(buttons[i].children[0].children[0], true); 
                buttons[i].classList.remove("buttonActive");
            }
        }
    }

    if (!target.classList.contains("buttonActive")) { // set on target
        target.children[0].style.backgroundImage = "url('../pwa/" + b + "_active.png')";
        e_Fd(target.children[0].children[0], false); 
        target.classList.add("buttonActive");

        navigator.vibrate(50); // vibrate
    }
}

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

    if (r.o === "portrait" && wiD < 490) {
        sections.style.height = "calc(" + dev.uH.getBoundingClientRect().height + "px - 4rem)";
    }

    navButtonActive('home', homeBtn);

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
}

function startLoadPWA() {
    const stats = document.querySelector('.pwa .home .stats.container');

    const stat1 = document.querySelector('.pwa .home #stat1');
    const stat2 = document.querySelector('.pwa .home #stat2');
    const stat3 = document.querySelector('.pwa .home #stat3');

    var pwa_L = null,
        stats_e = false;

    const disVar = document.querySelector('.pwa #distanceVariantPWA');

    sI_1.e = stat1;
    sI_2.e = stat2;
    sI_3.e = stat3;

    op.lang = engLangVar(countryAPIres.country);
    sI_1.n = (op.lang === "gb") ? 97 : kmToMiles(97), // km : miles
    disVar.innerHTML = (op.lang === "gb") ? "km" : "miles";

    pwa_L = setInterval(function() {
        var statsTop = stats.getBoundingClientRect();
        if (statsTop.top < aH && !stats_e) {
            stats_e = true;
            e_Ic(sI_1, null, sI_1.n);
            e_Ic(sI_2, null, sI_2.n);
            e_Ic(sI_3, null, sI_3.n);
        }
    }, (1000 / dev.t));
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