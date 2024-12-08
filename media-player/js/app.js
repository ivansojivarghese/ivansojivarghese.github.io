
var imagePrimary = [];
var imagePalette = [];

function getImageData(url) {
    const image = new Image();
    image.crossOrigin = 'Anonymous'; // Needed for cross-origin images
    image.src = 'https://api.allorigins.win/raw?url=' + 'https://i.ytimg.com/vi_webp/XS7FNuhzYpc/maxresdefault.webp'; // attaching a proxy URL infront to bypass CORS

    image.onload = () => {
        const colorThief = new ColorThief();

        imagePrimary = colorThief.getColor(image);
        imagePalette = colorThief.getPalette(image);
    };
}