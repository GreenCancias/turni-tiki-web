'use strict';
const PREFIX = 'turni-tiki-app-files-';
const CACHE = PREFIX + 'b067e861bcaa5a89';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './favicon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(file => new URL(file, self.registration.scope).href))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url), scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => response.ok ? response : caches.match(new URL('./index.html', scope).href)).catch(() => caches.match(new URL('./index.html', scope).href)));
    return;
  }
  const files = FILES.map(file => new URL(file, scope).href);
  if (files.includes(url.href)) event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
