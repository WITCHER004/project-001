"use client";

import { useEffect, useState } from "react";

/**
 * True between 9:00 PM and 5:00 AM local time. Polls once a minute so a
 * session that's left open across the 9pm boundary flips over live, without
 * needing a page refresh.
 */
export function useLateNightMode(): boolean {
  const [isLateNight, setIsLateNight] = useState(false);

  useEffect(() => {
    const check = () => {
      const hour = new Date().getHours();
      setIsLateNight(hour >= 21 || hour < 5);
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);

  return isLateNight;
}
