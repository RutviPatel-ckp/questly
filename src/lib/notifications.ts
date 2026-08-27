// Browser push notification utilities for Brainly Weird

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

// Convert a URL base64 string to a Uint8Array for the Push API
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if push notifications are supported
export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

// Get the current notification permission state
export function getPermissionState(): NotificationPermission {
  if (!("Notification" in window)) return "denied";
  return Notification.permission;
}

// Register the service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    return registration;
  } catch (err) {
    console.error("Service worker registration failed:", err);
    return null;
  }
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<{
  endpoint: string;
  p256dh: string;
  auth: string;
} | null> {
  if (!isPushSupported()) return null;
  if (!VAPID_PUBLIC_KEY) {
    console.warn("VAPID public key not configured — notifications will use browser-only mode");
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    // Register service worker if not already done
    const registration = await registerServiceWorker();
    if (!registration) return null;

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as ArrayBuffer,
    });

    const keys = subscription.toJSON().keys;
    if (!keys) return null;

    return {
      endpoint: subscription.endpoint,
      p256dh: keys.p256dh as string,
      auth: keys.auth as string,
    };
  } catch (err) {
    console.error("Push subscription failed:", err);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (err) {
    console.error("Unsubscribe failed:", err);
    return false;
  }
}

// Check if currently subscribed
export async function isSubscribed(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch {
    return false;
  }
}

// Show a local browser notification (no push needed — works even without VAPID keys)
export function showLocalNotification(title: string, body: string, tag?: string): void {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: tag || "brainly-weird-local",
  });
}

// Streak reminder messages
const STREAK_MESSAGES = [
  (name: string, streak: number) =>
    `Hey! ${name} misses you! Your ${streak}-day streak is at risk — come back and keep it going! 🔥`,
  (name: string, streak: number) =>
    `Don't break the chain! ${name} has a fun lesson ready for you. Your streak is ${streak} days strong! 📚`,
  (name: string, streak: number) =>
    `${name} is getting lonely! Pop in for a quick lesson to keep your ${streak}-day streak alive. ⭐`,
  (name: string, streak: number) =>
    `Your ${streak}-day streak needs you! ${name} has something cool to teach today. 🧠`,
];

// Show a streak reminder notification
export function showStreakReminder(companionName: string, streak: number): void {
  const msg = STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
  showLocalNotification("🔥 Streak Reminder", msg(companionName, streak), "streak-reminder");
}
