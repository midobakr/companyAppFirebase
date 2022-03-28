/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
self.addEventListener("push", (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    vibrate: [300, 100, 400],
  });
});
self.addEventListener("notificationclick", function (event) {
  return clients.openWindow("/");
});
