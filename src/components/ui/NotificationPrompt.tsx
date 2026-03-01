"use client";

import { useEffect, useState } from "react";

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");

  useEffect(() => {
    // Only show if browser supports notifications and permission not yet decided
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    if (Notification.permission === "default") {
      // Delay showing the prompt so it doesn't appear immediately on load
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  async function requestPermission() {
    try {
      // Register service worker
      await navigator.serviceWorker.register("/sw.js");

      const permission = await Notification.requestPermission();
      setStatus(permission === "granted" ? "granted" : "denied");

      if (permission === "granted") {
        // Show a test notification
        new Notification("Vertech News", {
          body: "You'll be notified when new AI news arrives!",
          icon: "/icon-192.png",
        });
      }

      // Hide prompt after a moment
      setTimeout(() => setShow(false), 2000);
    } catch {
      setShow(false);
    }
  }

  function dismiss() {
    setShow(false);
    // Remember dismissal for this session
    sessionStorage.setItem("notification-dismissed", "true");
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-surface border border-neon-cyan/30 rounded-lg p-4 backdrop-blur-md shadow-lg">
        {status === "idle" && (
          <>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-neon-cyan text-sm">&#128276;</span>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-sm font-bold text-text-primary">
                  Stay Updated
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Enable notifications to get alerts when breaking AI news drops.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3 ml-11">
              <button
                onClick={requestPermission}
                className="px-3 py-1.5 font-mono text-xs bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan rounded hover:bg-neon-cyan/20 transition-colors"
              >
                Enable
              </button>
              <button
                onClick={dismiss}
                className="px-3 py-1.5 font-mono text-xs text-text-dim hover:text-text-secondary transition-colors"
              >
                Not now
              </button>
            </div>
          </>
        )}

        {status === "granted" && (
          <div className="flex items-center gap-3">
            <span className="text-neon-green text-lg">&#10003;</span>
            <p className="font-mono text-xs text-neon-green">
              Notifications enabled!
            </p>
          </div>
        )}

        {status === "denied" && (
          <div className="flex items-center gap-3">
            <span className="text-text-dim text-lg">&#10005;</span>
            <p className="font-mono text-xs text-text-dim">
              Notifications blocked. You can enable them in browser settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
