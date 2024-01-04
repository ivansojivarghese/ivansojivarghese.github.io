
function navButtonActive(b, e) {
    var target = e.currentTarget;
    if (!target.classList.contains("buttonActive")) {
        target.children[0].style.backgroundImage = "url('../pwa/" + b + "_active.png')";
        e_Fd(target.children[0].children[0], false); 
        target.classList.add("buttonActive");
    }
}