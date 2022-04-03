
// loading sequence(s) for images

var img_p = document.getElementsByClassName("img_place"),
    img_pL = img_p.length - 1,
    _Li;


function img_L() { // img loading
    for (i = 0; i <= img_pL; i++) { // run through all img_place elements
        var b = getBd(img_p[i], "top");
        if (b < wH) { // if in view to user
            var el = img_p[i],
                s = el.dataset.img; // obtain img reference no.

            img_Ld(el, s);
        }
    }
}

function img_Ld(el, s) { // img load detect
    var url = "jpg/clicks/img_" + s + ".jpg", // image url
        g = document.createElement("img"),
        cir = el.children[0].children[0].children[0], // loading circle
        m = el.children[1]; // image el
    g.src = url; // attach url to 'dummy' img element

    g.addEventListener("load", function() { // detect load
        m.style.backgroundImage = "url(" + url + ")"; // transfer url to background img.
        setTimeout(function() {
            cir.classList.remove("md"); // hide loader
            m.classList.remove("md"); // show image
        }, 500);

        g = null; // remove value
    });
}


_Li = setInterval(img_L, 1000/60);