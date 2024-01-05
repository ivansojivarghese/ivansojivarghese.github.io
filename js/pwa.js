
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
    const temp = document.querySelector('.pwa .weather #temp');
    const unit = document.querySelector('.pwa .weather #unit');
    const greeting = document.querySelector('.pwa .home #greeting');

    greeting.innerHTML = timeOfDay();
    temp.innerHTML = Math.round(weatherAPIres.main.temp);
    unit.innerHTML = (tempUnit(ipAPIres.country.iso_code) === "metric") ? "C" : "F";
}