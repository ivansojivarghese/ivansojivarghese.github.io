
/*
 * ServiceWorker to make site function as a PWA (Progressive Web App)
 *
 * Based on https://glitch.com/~pwa by https://glitch.com/@PaulKinlan
 */

const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
// const OFFLINE_URL = "offline.html";

// REFERENCED FROM : https://github.com/captainbrosset/devtools-tips/blob/ebfb2c7631464149ce3cc7700d77564656971ff4/src/sw.js#L22
// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/background-syncs#use-the-periodic-background-sync-api-to-regularly-get-fresh-content
const INITIAL_CACHED_RESOURCES = [
    
];
// Cached resources that match the following strings should not be periodically updated.
// These are the tips html pages themselves, and their images.
// Everything else, we try to update on a regular basis, to make sure lists of tips get updated and css/js are recent too.
const DONT_UPDATE_RESOURCES = [
	
];

// Font files
/*
var fontFiles = [
	'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/Poppins-Regular.woff2?v=1720415271771',
	'https://cdn.glitch.global/4604ff4b-6eb8-48c8-899f-321d23359af1/Raleway-Regular.woff2?v=1720415279863'
];*/
/*
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request ensures that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be
      // from the network.
      // await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));

    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});*/

// Specify what we want added to the cache for offline use
/*
self.addEventListener("install", (e) => {
  e.waitUntil(
    // Give the cache a name
    caches.open("glitch-hello-installable-cache").then((cache) => {
      // Cache the homepage and stylesheets - add any assets you want to cache!
      return cache.addAll(["/", "/style.css", "/index.js", "/scripts.js", "../main.css", "../res_m.css", "../index.html"]);
    })
  );
});*/

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

// Network falling back to cache approach

self.addEventListener("fetch", function (event) {
    
  // if (event.request.method !== "POST") {
    event.respondWith(
      fetch(event.request).catch(function () {
        return caches.match(event.request);
      })
    );
  /*} /*else {
    // Requests related to Web Share Target.
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const link = formData.get("link") || "";
        // Instead of the original URL `/save-bookmark/`, redirect
        // the user to a URL returned by the `saveBookmark()`
        // function, for example, `/`.
        //const responseUrl = await saveMedia(link);
        //return Response.redirect(responseUrl, 303);
        
        console.log(link);
      })(),
    );
  }*/
});
/*
function saveMedia(link) {
    
}*/

// Listen for push notifications
self.addEventListener("push", (e) => {
  const data = e.data.json();
  let promises = [];

  if ("setAppBadge" in self.navigator) {
    // this is hard-coded to "1" because getNotifications is tricky?
    const promise = self.navigator.setAppBadge(1);
    promises.push(promise);
  }

  // Promise to show a notification
  promises.push(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
    })
  );

  // Finally...
  event.waitUntil(Promise.all(promises));
});


self.addEventListener("fetch", (event) => {
  // Only call event.respondWith() if this is a navigation request
  // for an HTML page.

  // REFERENCED FROM https://cferdinandi.github.io/sw-fonts/

  // Get the request
	var request = event.request;

	// Bug fix
	// https://stackoverflow.com/a/49719964
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's
          // supported.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Always try the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is
          // likely due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(CACHE_NAME);
          // const cachedResponse = await cache.match(OFFLINE_URL);
          // return cachedResponse;
        }
      })()
    );
  }

  // If our if() condition is false, then this fetch handler won't
  // intercept the request. If there are any other fetch handlers
  // registered, they will get a chance to call event.respondWith().
  // If no fetch handlers call event.respondWith(), the request
  // will be handled by the browser as if there were no service
  // worker involvement.

  // CSS/JS files
  // Offline-first
  /*
  if (request.headers.get('Accept').includes('text/css') || request.headers.get('Accept').includes('text/javascript')) {
    event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request).then(function (response) {

					// Return the response
					return response;

				});
			})
		);
    return;
  }*/

});

self.addEventListener("fetch", (event) => {
	var request = event.request;
	// HTML files
	// Network-first
	if (request.headers.get('Accept').includes('text/html')) {
		event.respondWith(
			fetch(request).then(function (response) {

				// Save the response to cache
				if (response.type !== 'opaque') {
					var copy = response.clone();
					event.waitUntil(caches.open('pages').then(function (cache) {
						return cache.put(request, copy);
					}));
				}

				// Then return it
				return response;

			}).catch(function (error) {
				return caches.match(request).then(function (response) {
					return response /*|| caches.match('offline.html')*/;
				});
			})
		);
	}

});

self.addEventListener("fetch", (event) => {
	var request = event.request;
	// CSS/JS files
  // Offline-first
  if (request.headers.get('Accept').includes('text/css') || request.headers.get('Accept').includes('text/javascript')) {
	event.respondWith(
		fetch(request).then(function (response) {

			// Save the response to cache
			if (response.type !== 'opaque') {
				var copy = response.clone();
				event.waitUntil(caches.open('pages').then(function (cache) {
					return cache.put(request, copy);
				}));
			}

			// Then return it
			return response;

			}).catch(function (error) {
				return caches.match(request).then(function (response) {
					return response || (caches.match('../main.css') && caches.match('../res_m.css'));
				});
			})
		);
	}

});

self.addEventListener("fetch", (event) => {
	var request = event.request;
	// Images & Fonts
	// Offline-first
	if (request.headers.get('Accept').includes('image') || request.url.includes('Poppins') || request.url.includes('css/fonts.css')) {
		event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request).then(function (response) {

					// If an image, stash a copy of this image in the images cache
					if (request.headers.get('Accept').includes('image')) {
						var copy = response.clone();
						event.waitUntil(caches.open('images').then(function (cache) {
							return cache.put(request, copy);
						}));
					}

					// Return the requested file
					return response;

				});
			})
		);
	}

});