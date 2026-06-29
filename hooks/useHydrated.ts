"use client";
import { useEffect, useState } from "react";

/**
 * Returns false on the server and the first client render, true after mount.
 * Use to gate UI that depends on persisted (localStorage) state so the initial
 * client render matches the server HTML and avoids hydration mismatches.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
