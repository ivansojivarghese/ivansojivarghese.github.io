
var sI_1 = {},
    sI_2 = {},
    sI_3 = {};

var sectionScroll = false,
    sectionScrollPos = 0;

const sections = document.querySelector('.pwa .sections');

function navButtonActive(b, e) {
    var target = e.currentTarget;
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

    const temp = document.querySelector('.pwa .weather #temp');
    const unit = document.querySelector('.pwa .weather #unit');
    const greeting = document.querySelector('.pwa .home #greeting');
    const wordcloud = document.querySelectorAll('.pwa .home .wordcloud h1');

    var selectedWords = [];

    sections.style.height = "calc(" + dev.uH.getBoundingClientRect().height + "px - 4rem)";

    greeting.innerHTML = timeOfDay();
    temp.innerHTML = Math.round(weatherAPIres.main.temp);
    unit.innerHTML = (tempUnit(ipAPIres.country.iso_code) === "metric") ? "C" : "F";

    for (i = 0; i < wordcloud.length; i++) { // get words from skills in msc.js
        var random1 = getRandomInt(1, 5),
            random2 = getRandomInt(0, 10),
            wd = 0,
            textColor = [];
        if (selectedWords.indexOf(dev.skills["s" + random1][random2]) === -1) {
            selectedWords[selectedWords.length] = dev.skills["s" + random1][random2];
            wordcloud[i].innerHTML = dev.skills["s" + random1][random2];
 
            textColor = randomRGB(); // add random text colors suitable for dark+light themes
            console.log(RGBToHSB(textColor[0], textColor[1], textColor[2]));

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
    const stat1 = document.querySelector('.pwa .home #stat1');
    const stat2 = document.querySelector('.pwa .home #stat2');
    const stat3 = document.querySelector('.pwa .home #stat3');

    sI_1.e = stat1;
    sI_2.e = stat2;
    sI_3.e = stat3;

    e_Ic(sI_1, null, sI_1.n);
    e_Ic(sI_2, null, sI_2.n);
    e_Ic(sI_3, null, sI_3.n);
}

function randomRGB() {
    var r = getRandomInt(0, 256),
        g = getRandomInt(0, 256),
        b = getRandomInt(0, 256);
    return [r, g, b];
}

const RGBToHSB = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
        n = v - Math.min(r, g, b);
    const h =
        n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
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