"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

let mql: MediaQueryList | null = null;
function getMql() {
  mql ??= window.matchMedia(QUERY);
  return mql;
}

function subscribe(onChange: () => void) {
  const m = getMql();
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}

function getSnapshot() {
  return getMql().matches;
}

// El servidor no conoce el viewport: asumimos escritorio hasta hidratar.
function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
