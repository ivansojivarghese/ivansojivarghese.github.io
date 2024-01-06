
var sI_1 = {},
    sI_2 = {},
    sI_3 = {};

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
            wd = 0;
        if (selectedWords.indexOf(dev.skills["s" + random1][random2]) === -1) {
            selectedWords[selectedWords.length] = dev.skills["s" + random1][random2];
            wordcloud[i].innerHTML = dev.skills["s" + random1][random2];
            wd = getBd(wordcloud[i], "width");
            if (wd > ((0.9 * wiD) - op.fN)) {
                wordcloud[i].remove();
            }
            
            // add random text colors suitable for dark+light themes
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