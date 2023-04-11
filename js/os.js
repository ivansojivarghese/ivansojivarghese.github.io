
var op = { // site 'options'
        sys : "", // operating system
        uA : navigator.userAgent, // user agent
        Ls : 1000/60 // loop (interval) speed - sec./rev.
    },
    uA_L;


function isDarkMode() { // dark mode detection
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

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
        }
    }
}

function applyManifest() {
    var m = document.getElementById("mft"); // installing appropriate manifest

    if (op.sys === "Android") {
        if (isDarkMode()) {
            m.setAttribute("href", "app_dark.webmanifest");
        } /*else {
            m.setAttribute("href", "app.webmanifest");
        }*/
    } else if (op.sys === "iOS") {

        //

    } else if (op.sys === "Windows") {
        if (isDarkMode()) {
            m.setAttribute("href", "");
        } else {
            m.setAttribute("href", "app_windows.webmanifest");
        }
    }

    // document.head.append(m);
}


uA_L = setInterval(function() {
    if (navigator.userAgent) {
        op.uA = navigator.userAgent;
        osCheck();
        applyManifest();
        clearInterval(uA_L);
    }
}, op.Ls);