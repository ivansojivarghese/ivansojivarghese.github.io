
var op_sys = "", // operating system
    mft = document.createElement("LINK"), // installing appropriate manifest
    isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    

    mft.setAttribute("rel", "manifest");
    function osCheck() {
        var userAgent = navigator.userAgent;
        if (userAgent.match(/iPhone|iPad|iPod/i)) { // iOS

        } else if () {// android

        }

        if (userAgent.search('Windows') !== -1) {
            op_sys = "Windows";
        } else if (userAgent.search('Mac') !== -1) {
            op_sys ="MacOS";
        } else if (userAgent.search('X11') !== -1 && !(userAgent.search('Linux') !== -1)) {
            op_sys = "UNIX";
        } else if (userAgent.search('Linux') !== -1 && userAgent.search('X11') !== -1) {
            op_sys = "Linux";
        }
    }
    if (isDarkMode()) {
        mft.setAttribute("href", "app_dark.webmanifest");
    } else {
        mft.setAttribute("href", "app.webmanifest");
    }
    document.head.append(mft);