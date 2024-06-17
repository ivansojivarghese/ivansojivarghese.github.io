
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

self.addEventListener("message", (event) => {
	// console.log(`Message received: ${event.data.data}`);
	if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    } else {
		caches.open(event.data.data); // FROM utcCommit
	}
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

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	if (event.notification.tag === "update") {
		//For root applications: just change "'./'" to "'/'"
		//Very important having the last forward slash on "new URL('./', location)..."
		/*
		const rootUrl = new URL('/', location).href; 
		event.waitUntil(
			clients.matchAll().then(matchedClients =>
			{
				for (let client of matchedClients)
				{
					if (client.url.indexOf(rootUrl) >= 0)
					{
						return client.focus();
					}
				}

				return clients.openWindow(rootUrl).then(function (client) { client.focus(); });
			})
		);*/

		const rootUrl = new URL('/', location).href; 
		let clickResponsePromise = Promise.resolve();
		if (event.notification.data && event.notification.data.url) { //

			clients.matchAll().then(matchedClients =>
			{
				for (let client of matchedClients)
				{
					if (client.url.indexOf(rootUrl) >= 0)
					{
						return client.focus();
					}
				}

				// return clients.openWindow(rootUrl).then(function (client) { client.focus(); });
			});

			clickResponsePromise = clients.openWindow(event.notification.data.url);
		}

		event.waitUntil(clickResponsePromise);
	}
});

async function checkClientIsVisible() { // REFERENCE: https://stackoverflow.com/questions/45150642/check-if-window-is-active-from-service-worker
	const windowClients = await clients.matchAll({
	  type: "window",
	  includeUncontrolled: true,
	});
  
	for (var i = 0; i < windowClients.length; i++) {
	  if (windowClients[i].visibilityState === "visible") {
		return true;
	  }
	}
  
	return false;
}

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

			updateCachedContent(); // PERFORM CACHE UPDATE

			checkClientIsVisible().then((res) => { // SHOW NOTIF. ONLY WHEN APP IS OUT OF VIEW/FOCUS
				if (!res) {
					if (Notification.permission === "granted") {
						setTimeout(function() { // AFTER 2 MIN.
							// var badgeNum = 0;
							/*
							caches.has("updateNotifications").then((res) => { // To display a number in the app badge
								if (res) {
									const cacheAllowlist = ["updateNotifications"]; // IF EXISTING
			
									caches.keys().then((keyList) => //
										Promise.all(
											keyList.map(async (key) => {
												if (cacheAllowlist.includes(key)) { // REFERENCED FROM: https://stackoverflow.com/questions/64322483/retrieving-values-from-browser-cache
													const cacheStorage = await caches.open(key);
													const cachedResponse = await cacheStorage.match(data[0].author.url); 
													badgeNum = await cachedResponse.json();
													badgeNum++;
													response.json().badgeNum = badgeNum;

													caches.open("updateNotifications").then((cache) => {
														cache.put(data[0].author.url, response.json().badgeNum);
													});

													navigator.setAppBadge(badgeNum);
												}
											}),
										),
									);
								} else {
									badgeNum = 1; // IF NOT EXISTING
									response.json().badgeNum = badgeNum;
									caches.open("updateNotifications").then((cache) => {
										cache.put(data[0].author.url, response.json().badgeNum);
									});
									navigator.setAppBadge(badgeNum);
								}
							});*/

							// if (!caches.has("DARK_MODE")) { // LIGHT THEME
							self.registration.showNotification("Software updated", {
								body: "Our updates provide you with a better experience",
								badge: "favicon/monochrome-96x96_background.png",
								icon: "svg/update.svg",
								vibrate: [50],
								tag: "update",
								data: {
									url: 'https://ivansojivarghese.github.io/',
								}
							}); //
							/*} else { // DARK THEME
								self.registration.showNotification("Software Update", {
									body: "We were updated to provide a better experience.",
									badge: "favicon/maskable-512x512_dark.png",
									icon: "favicon/android-chrome-192x192_dark.png",
									vibrate: [50],
									tag: "update",
									data: {
										url: 'https://ivansojivarghese.github.io/',
									}
								});
							}*/

						}, 120000);
					}
				}
			}); //
			
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

// REFERENCED FROM: https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/background-syncs#use-the-periodic-background-sync-api-to-regularly-get-fresh-content
// https://github.com/captainbrosset/devtools-tips/blob/ebfb2c7631464149ce3cc7700d77564656971ff4/src/sw.js#L141 

async function updateCachedContent() {
    const requests = await findCacheEntriesToBeRefreshed();
    const cache = await caches.open(CACHE_NAME);

    for (const request of requests) {
        try {
            // Fetch the new version.
            const fetchResponse = await fetch(request);
            // Refresh the cache.
            await cache.put(request, fetchResponse.clone());
        } catch (e) {
            // Fail silently, we'll just keep whatever we already had in the cache.
        }
    }
}

// Find the entries that are already cached and that we do want to update. This way we only
// update these ones and let the user visit new pages when they are online to populate more things
// in the cache.
async function findCacheEntriesToBeRefreshed() {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    return requests.filter(request => {
        return !DONT_UPDATE_RESOURCES.some(pattern => request.url.includes(pattern));
    });
}