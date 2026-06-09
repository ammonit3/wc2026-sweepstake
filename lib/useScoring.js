"use client";
import { useEffect, useState } from "react";
import { computeScoring } from "./scoring";

// Fetches /api/matches, recomputes the whole sweepstake, refreshes every 60s.
export function useScoring() {
  const [state, setState] = useState({ loading: true, matches: [], result: null, source: null, note: null });

  async function load() {
    try {
      const res = await fetch("/api/matches", { cache: "no-store" });
      const data = await res.json();
      const matches = data.matches || [];
      setState({ loading: false, matches, result: computeScoring(matches), source: data.source, note: data.note });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, note: "Could not load match data." }));
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  return state;
}
