
var op = { // site 'options'
        sys : "", // operating system
        isDarkMode : function() { // dark mode detection
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    };


function osCheck() {
    var userAgent = navigator.userAgent;
    if (userAgent.match(/iPhone|iPad|iPod/i)) { // iOS
        op.sys = "iOS";
    } else if (userAgent.match(/Android/i)) {// android
        op.sys = "Android";
    } else if (userAgent.match(/Windows/i)) { // windows
        op.sys = "Windows";
    } else if (userAgent.match(/Mac/i)) { // mac
        op.sys ="MacOS";
    } else if (userAgent.match(/X11/i) && !userAgent.match(/Linux/i)) { // unix
        op.sys = "UNIX";
    } else if (userAgent.match(/Linux/i) && userAgent.match(/X11/i)) { // linux
        op.sys = "Linux";
    }
}

function applyManifest() {
    var m = document.createElement("LINK"); // installing appropriate manifest
    m.setAttribute("rel", "manifest");

    if (isDarkMode()) {
        m.setAttribute("href", "app_dark.webmanifest");
    } else {
        m.setAttribute("href", "app.webmanifest");
    }
    
    document.head.append(m);
}


osCheck();
applyManifest();