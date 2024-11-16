



/////////////////////////////////////////////////////////////////////////////////////////////////////////////



const staticCacheName = 'media-player';
const assets = [
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/Poppins-Regular.woff2?v=1720415271771',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/Raleway-Regular.woff2?v=1720415279863',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/fullscreen.svg?v=1720502110723',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/picture_in_picture.svg?v=1720502115220',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/settings.svg?v=1720503275108',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/pause.svg?v=1720867026860',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/load.svg?v=1720870567725',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/mute.svg?v=1720880526225',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/upload.svg?v=1720947329500',
  /*'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/play.svg?v=1720968680771',*/
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/play_png.png?v=1720969234660',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/settings_w.svg?v=1721565436819',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/web_upload.svg?v=1721565884097',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/Media%20Player%20OG%20Image.png?v=1721623654736',
  'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/play_video.svg?v=1721638402042',

  'https://ivansojivarghese.github.io/media-player/play.png',
  'https://ivansojivarghese.github.io/media-player/play.svg',
  'https://ivansojivarghese.github.io/media-player/play_maskable.png',
  'https://ivansojivarghese.github.io/media-player/play_maskable_monochrome.png',
  'https://ivansojivarghese.github.io/media-player/play_maskable_monochrome_409.png',
  'https://ivansojivarghese.github.io/media-player/play_small.png',
  'https://ivansojivarghese.github.io/media-player/web_upload.png',

  'https://ivansojivarghese.github.io/media-player/js/index.js',
  'https://ivansojivarghese.github.io/media-player/js/dev.js',
  'https://ivansojivarghese.github.io/media-player/js/msc.js',
  'https://ivansojivarghese.github.io/media-player/js/network.js',
  'https://ivansojivarghese.github.io/media-player/js/request.js',
  'https://ivansojivarghese.github.io/media-player/js/script.js',
  'https://ivansojivarghese.github.io/media-player/js/video.js',

  'https://ivansojivarghese.github.io/media-player/css/main.css',
  'https://ivansojivarghese.github.io/media-player/css/new.css',
  'https://ivansojivarghese.github.io/media-player/css/res_m.css',
  'https://ivansojivarghese.github.io/media-player/css/style.css',

  'https://ivansojivarghese.github.io/media-player/svg/install.svg',
  'https://ivansojivarghese.github.io/media-player/svg/pause.svg',
  'https://ivansojivarghese.github.io/media-player/svg/play.svg',
  'https://ivansojivarghese.github.io/media-player/svg/fullscreen.svg',
  'https://ivansojivarghese.github.io/media-player/svg/fullscreen_exit.svg',
  'https://ivansojivarghese.github.io/media-player/svg/pip.svg',
  'https://ivansojivarghese.github.io/media-player/svg/pip_exit.svg',
  'https://ivansojivarghese.github.io/media-player/svg/seek.svg',
  'https://ivansojivarghese.github.io/media-player/svg/rewind.svg',
  'https://ivansojivarghese.github.io/media-player/svg/fitscreen.svg',
  'https://ivansojivarghese.github.io/media-player/svg/settings.svg',
  'https://ivansojivarghese.github.io/media-player/svg/skip_previous.svg',
  'https://ivansojivarghese.github.io/media-player/svg/replay.svg',
  'https://ivansojivarghese.github.io/media-player/svg/error.svg'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close(); // Close the notification

  /*
  event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
          // Focus the first controlled client (e.g., the window/tab that triggered the notification)
          for (const client of clientList) {
              if ('focus' in client) {
                  return client.focus(); // Focus the existing tab/window
              }
          }
      }).catch(error => {
          console.error("Error focusing the client:", error);
      })
  );*/

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
      windowClient.url.indexOf(event.notification.data.url) >= 0
        ? (windowClient.focus(), true)
        : false,
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
      clients
        .openWindow(event.notification.data.url)
        .then((windowClient) => (windowClient ? windowClient.focus() : null));
    }),
  );
});

