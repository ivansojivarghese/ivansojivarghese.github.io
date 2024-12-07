
import ColorThief from './node_modules/colorthief/dist/color-thief.mjs'

const colorThief = new ColorThief();
const img = document.querySelector('img');

if (img.complete) {
    colorThief.getColor(img);
} else {
    image.addEventListener('load', function() {
    colorThief.getColor(img);
    });
}