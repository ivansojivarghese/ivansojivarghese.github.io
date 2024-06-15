
/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// REFERENCED FROM WEB.DEV @https://web.dev/offline-fallback-page

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.
// Add a comment for your linter if you want:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";

// Font files
var fontFiles = [
	'msc/fonts/poppins/Poppins-Regular.woff2',
	'msc/fonts/raleway/Raleway-Regular.woff2'
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request ensures that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be
      // from the network.
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));

    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// On install, cache some stuff
self.addEventListener('install', function (event) {
	event.waitUntil(caches.open('core').then(function (cache) {

    /////////
		cache.add(new Request('ext/jpg/ivan_profile.jpg'));
		cache.add(new Request('logo/logo_hybrid.png'));
    cache.add(new Request('logo/logo_hybrid_inverse.png'));
    /////////

    cache.add(new Request('offline.html'));
    cache.add(new Request('css/fonts.css'));

		fontFiles.forEach(function (file) {
			cache.add(new Request(file));
		});
		return;
	}));
});

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
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
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
					return response || caches.match('offline.html');
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
					return response || (caches.match('css/sty.css') && caches.match('css/pwa.css') && caches.match('css/weather.css') && caches.match('css/res_m.css'));
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

self.addEventListener('periodicsync', (event) => {
	if (event.tag === 'content-sync') {
		event.waitUntil(doSync()); //
	}
});

var client; 
self.addEventListener("message", (event) => {
	// console.log(`Message received: ${event.data.data}`);
	caches.open(event.data.data); // FROM utcCommit
	client = event.source;
});

/*
self.addEventListener("fetch", (event) => {
	event.waitUntil(
		(async () => {
			// Exit early if we don't have access to the client.
			// Eg, if it's cross-origin.
			if (!event.clientId) return;

			// Get the client.
			const client = await self.clients.get(event.clientId);
			// Exit early if we don't get the client.
			// Eg, if it closed.
			if (!client) return;

			// Send a message to the client.
			client.postMessage({
				msg: "Hey I just got a fetch from you!",
				url: event.request.url,
			});
		})(),
	);
});  */

async function doSync() {
	return fetch('https://api.github.com/repos/ivansojivarghese/ivansojivarghese.github.io/commits?per_page=1')
	.then((response) => response.json())
	.then(async (data) => { //
		var utc = data[0].commit.author.date;
		var utcUpdated = await caches.has(utc);

		if (!utcUpdated) { // IF NOT EQUAL
			const cachesToKeep = ["offline", "core", "images", "pages"]; // KEEP THE REQUIRED CACHES WHERE NEEDED
			caches.keys().then((keyList) => 
				Promise.all(
					keyList.map((key) => {
						if (!cachesToKeep.includes(key)) {
							caches.delete(key); // DELETE EXISTING UTC
						}
					}),
				),
			);
			caches.open(utc); // ADD NEW UTC

			client.postMessage("show update");
			
			// DO A HARD RELOAD
			// REFERENCED FROM @Suhan, https://stackoverflow.com/questions/10719505/force-a-reload-of-page-in-chrome-using-javascript-no-cache
			/*
			$.ajax({
				url: window.location.href,
				headers: {
					"Pragma": "no-cache",
					"Expires": -1,
					"Cache-Control": "no-cache"
				}
			}).done(function () {
				window.location.reload(true);
			});*/
		}
	});

	/*
	var request = new XMLHttpRequest();
	request.open('GET', 'https://api.github.com/repos/ivansojivarghese/ivansojivarghese.github.io/commits?per_page=1', false);
	request.send(null);

	return request.getResponseHeader('link').match(/"next".*page=([0-9]+).*"last"/)[1];*/
}