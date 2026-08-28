// Service worker intentionally disabled — this file exists only to
// self-unregister if an older version of the SW was previously installed,
// so it can't serve stale content or cause a blank page.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      const registrations = await self.registration;
      await registrations.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
  self.clients.claim();
});
