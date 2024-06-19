
var developer = false, // // toggle between develop(er/ing) mode: FOR DEVELOPER PURPOSE ONLY! - ACTIVATE WHEN NEEDED (or OFFLINE)
    keyStatus = {}, // keys down/up status
    disabledEvent, // function declaration (global)
    checkDevTools, // function, check for devTools presence (global)
    minimalUserResponseInMiliseconds = 200, // assumed user response time
    checkInterval = 100,
    devActivity = 0, // no. of times devTools opened by user
    devStatus = false,
    devError = false,
    devErrorMessage = false,
    devErrorAlert = false,
    timeout = 20000; // default timeout (.ms)


// CODE referenced from user @molnarg from 'https://stackoverflow.com/users/1463900/molnarg', stackoverflow 2022
// Other references:
// https://x-c3ll.github.io/posts/javascript-antidebugging/
// https://weizman.github.io/page-js-anti-debug-2/
// https://blog.allenchou.cc/post/js-anti-debugging/


if ((!developer && localStorage.getItem("devtools") === null) || localStorage.getItem("devtools") === "true") { // anti-debugging features
    checkDevTools = function() {
        if (!devErrorAlert) {
            console.log(Object.defineProperties(new Error, { // check if DevTools are open
                message: {
                    get() { // Chrome/Firefox/Opera/Edge
                        alert('Close Developer Tools.'),
                        devActivity++;
                        devErrorAlert = true,
                        devError = true
                    }
                },
                toString: {
                    value() { // Safari
                        (new Error).stack.includes('toString@') && alert('Close Developer Tools.');
                        if (op.b.s) {
                            devActivity++;
                            devError = true,
                            devErrorAlert = true 
                        }
                    }
                }
                // enumerable: true
            }));
        } else { // continue checking if DevTools is open
            console.log(Object.defineProperties(new Error, { 
                message: {
                    get() { // Chrome/Firefox/Opera/Edge
                        // alert('Close Developer Tools.')
                        devStatus = true
                    }
                },
                toString: {
                    value() { // Safari
                        (new Error).stack.includes('toString@') /*&& alert('Close Developer Tools.')*/
                        if (op.b.s) {
                            devStatus = true
                        }
                    }
                }
                // enumerable: true
            }));
            if (devStatus) { // devtools still open
                devError = true;
                devStatus = false;
            } else { // devtools closed
                devError = false;
                devErrorAlert = false;
            }
        }

        setTimeout(checkDevTools, checkInterval); // check at intervals
    }

    checkDevTools();

    // CODE referenced from 'https://doodstream.com/'

    function check() { 
        console.clear(); // clear console always
        before = new Date().getTime();
        eval('debugger'); // check for dev tools usage, break if detected
        after = new Date().getTime();
        if (((after - before) > minimalUserResponseInMiliseconds && !devErrorMessage) || (devError && !devErrorMessage)) {
            document.write("<h1 style='width: auto; font-size: 3rem; font-family: sans-serif; margin: 1em; line-height: 1.3em;'>Close<br>Developer<br>Tools.</h1>");
            document.documentElement.style.overflow = "hidden";
            document.documentElement.style.userSelect = "none";
            document.title = "Ivan Varghese";
            devErrorMessage = true;
            devError = true;
            // self.location.replace(window.location.protocol + window.location.href.substring(window.location.protocol.length)); // reload
        } else {
            before = null;
            after = null;
            delete before;
            delete after;
        }
        if (!devError && devActivity) {
            // console.log("reL");
            reL(); // reload after devTools are closed
        }
        setTimeout(check, checkInterval); // check every 100ms
    }

    check(); 

    disabledEvent = function(e) { // cancel any event
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
        e.preventDefault();
        return false;
    };

    window.addEventListener("DOMContentLoaded", function() {
        document.addEventListener("contextmenu", function(e) { // prevent right context-menu from showing
            e.preventDefault();
        }, false);
        document.addEventListener("wheel", function(e) { // prevent mouse wheel scrolling zoom
            if (keyStatus.Control || e.ctrlKey) {
                disabledEvent(e);
                e.preventDefault();
            } 
        }, {
            passive : false
        }); 
        document.addEventListener("keydown", function(e) { // disable access to DevTools via various keyboard shortcuts
            var p = e.code;
            keyStatus[p] = true;
            
            if (e.ctrlKey && (e.keyCode == 67 || e.code === "KeyC")) { // ctrl + c
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.keyCode == 88 || e.code === "KeyX")) { // ctrl + x
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.keyCode == 86 || e.code === "KeyV")) { // ctrl + v
                disabledEvent(e);
            }   
            if (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.code === "KeyI")) { // Ctrl + shift + i (dev tools)
                disabledEvent(e);
            }
            if (e.ctrlKey && e.shiftKey && (e.keyCode == 74 || e.code === "KeyJ")) { // Ctrl + shift + j (dev tools)
                disabledEvent(e);
            }
            if (e.ctrlKey && e.shiftKey && (e.keyCode == 67 || e.code === "KeyC")) { // Ctrl + shift + c (dev tools)
                disabledEvent(e);
            }
            if ((e.keyCode == 83 || e.code === "KeyS") && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) { // cmd + s (save page)
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.keyCode == 85 || e.code === "KeyU")) {  // Ctrl + u (view source)
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.keyCode == 80 || e.code === "KeyP")) { // Ctrl + p (print page)
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.keyCode == 79 || e.code === "KeyO")) { // Ctrl + o (open page)
                disabledEvent(e);
            }
            if (event.keyCode == 114 || e.code === "F3") { // F3 (search in page)
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.keyCode == 70 || e.code === "KeyF")) { // Ctrl + f (search in page)
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.keyCode == 71 || e.code === "KeyG")) { // Ctrl + g (search in page)
                disabledEvent(e);
            }
            if (e.ctrlKey && e.shiftKey && (e.keyCode == 71 || e.code === "KeyG")) { // Ctrl + shift + g (search in page)
                disabledEvent(e);
            }
            if (e.shiftKey && (e.keyCode == 114 || e.code === "F3")) { // shift + F3 (search in page)
                disabledEvent(e);
            }
            if (e.ctrlKey && (e.code === "NumpadAdd" || e.code === "NumpadSubtract" || e.keyCode == "61" || e.keyCode == "107" || e.keyCode == "173" || e.keyCode == "109" || e.keyCode == "187" || e.keyCode == "189")) { // Ctrl + '+/-' (prevent zoom in/out)
                disabledEvent(e);
                e.preventDefault();
            }
            if ((e.altKey && (e.keyCode == 37 || e.code === "ArrowLeft")) || (e.keyCode == 8 || e.code === "Backspace")) { // go back, 'alt' + back arrow
                disabledEvent(e);
            }
            if ((e.altKey && (e.keyCode == 39 || e.code === "ArrowRight")) || e.shiftKey && (e.keyCode == 8 || e.code === "Backspace")) { // go forward, 'alt' + forward arrow
                disabledEvent(e);
            }
            if (e.keyCode == 122 || e.code === "F11") { // F11 (fullscreen)
                disabledEvent(e);
            }
            if (e.keyCode == 123 || e.code === "F12") { // F12 (dev tools)
                disabledEvent(e);
            }
            if (e.keyCode == 44 || e.code === "PrintScreen") { // PrintScreen
                disabledEvent(e);
                navigator.clipboard.writeText('');
            }
        }, false);
        document.addEventListener("keyup", function(e) {
            var p = e.code;
            keyStatus[p] = false;

        }, false);
        document.addEventListener("click", function(e) {
            pre_Ed(e);
        }, false);
        function pre_Ed(e) { // prevent external-directs on internal links (tabs, windows) using middle clicks (mousewheel)
            var m = false;
            if (e && (e.which == 2 || e.button == 4 )) { // check for mousewheel (middle) click
                m = true;
            }
            if ((keyStatus.Control || e.ctrlKey) && (keyStatus.Shift || e.shiftKey)) { // if 'ctrl' + 'shift' pressed
                disabledEvent(e); // open link in foreground tab
            }
            if ((keyStatus.Control || e.ctrlKey) || m) { // if 'Ctrl' key pressed - open link in background tab
                disabledEvent(e);
            }
            if (keyStatus.Shift || e.shiftKey) { // if 'shift' key pressed
                disabledEvent(e); // open link in new window
            }
        }
    });
}