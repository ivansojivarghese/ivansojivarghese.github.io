
// misc.

var hm_sc = document.getElementById("ham_sc"); // ham. menu screen

function reL() { // reload page
    this.location.reload();
    window.location.assign(window.location.href); // FIREFOX support
}

function h_mTg(e) { // ham. menu toggle
    var c = e.classList.contains("open"); // if button contains specific keyword
    if (c) { // open menu
        hm_sc.style.display = "block"; // display
        setTimeout(function() { 
            hm_sc.style.opacity = "1"; // reveal menu
        }, 10); // delay to process transition
        document.body.style.overflow = "hidden"; // disable scrolling
    } else { // close menu
        hm_sc.style.opacity = "0";
        document.body.style.overflowY = "scroll";
        setTimeout(function() {
            hm_sc.style.display = "none";
        }, 200); // wait for transition to finish
   }
}

window.addEventListener("resize", function() {
    if (wH !== window.innerHeight && wD !== window.innerWidth) { // check for change in width/height values
        wH = window.innerHeight; // update on window size variables
        wD = window.innerWidth; 
        cH = document.documentElement.clientHeight;
        reL(); // reload page
    }
});