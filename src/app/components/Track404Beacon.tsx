"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { TRACK_404_URL } from "../../lib/config";

/**
 * Fires a fire-and-forget beacon to the backend whenever a not-found boundary
 * renders, so the admin panel (API Monitoring > 404 Pages) can see which
 * riseflake.com URLs are actually broken. Renders nothing; never throws —
 * a tracking beacon failing must never affect the 404 page itself.
 */
export default function Track404Beacon() {
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
    if (!path) return;

    try {
      const payload = JSON.stringify({
        source: "website",
        path,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(TRACK_404_URL, new Blob([payload], { type: "application/json" }));
      } else {
        fetch(TRACK_404_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // never let tracking failures affect the 404 page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
