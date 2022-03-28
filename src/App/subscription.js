const publicVapidKey =
  "BGoYWF08O9yIeCH8ZB6jymtlhq54Wk8Lvit8i-UsMhJlh1el0UYiK0FsCTpQlM8wQ2G5ttLDzVNkByNZWtw-G4I";

// Copied from the web-push documentation
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const sendSubscription = async () => {
  if ("serviceWorker" in navigator) {
    Notification.requestPermission();

    const registration = await navigator.serviceWorker.ready;
    let subRegistration = await registration.pushManager.getSubscription();

    if (subRegistration === null) {
      subRegistration = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      fetch("/subscription", {
        // fetch('http://192.168.1.8:3333/subscription', {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subRegistration),
      });
    }
  }
};
const deleteSubscription = async () => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    let subRegistration = await registration.pushManager.getSubscription();
    let res = await fetch("/subscription", {
      // let res = await fetch('http://192.168.1.8:3333/subscription', {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subRegistration),
    });
    res = await res.json();

    if (res === 400) {
      await subRegistration.unsubscribe();
      subRegistration = await registration.pushManager.getSubscription();
    }

    localStorage.removeItem("token");
  } else {
    localStorage.removeItem("token");
  }
  return "done";
};

export { sendSubscription, deleteSubscription };
