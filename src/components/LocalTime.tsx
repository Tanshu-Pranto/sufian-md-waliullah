"use client";

import { useSyncExternalStore } from "react";
import { profile } from "@/data/content";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: profile.timeZone,
  hour: "2-digit",
  minute: "2-digit",
});

// Ticks every 15s; minutes are all we show, so nothing visibly counts.
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};

export default function LocalTime() {
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(Date.now()),
    () => "--:--",
  );
  return <time suppressHydrationWarning>{time}</time>;
}
