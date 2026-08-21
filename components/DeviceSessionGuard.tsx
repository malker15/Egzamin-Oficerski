"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const DEVICE_ID_KEY = "officer_device_id_v1";
const CLAIMED_USER_KEY = "officer_device_claimed_user_v1";
const CHECK_INTERVAL_MS = 45_000;

type DeviceRpcResult = {
  ok?: boolean;
  status?: "claimed" | "active" | "switched" | "replaced" | "rate_limited";
  blocked_until?: string;
  switch_count?: number;
};

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (id) return id;
  id = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

function userAgent() {
  return typeof navigator === "undefined" ? "" : navigator.userAgent.slice(0, 512);
}

export default function DeviceSessionGuard() {
  const [message, setMessage] = useState("");
  const checkingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function endLocalSession(text: string) {
      localStorage.removeItem(CLAIMED_USER_KEY);
      await supabase.auth.signOut({ scope: "local" });
      if (!cancelled) setMessage(text);
    }

    async function run(mode: "claim" | "check") {
      if (checkingRef.current) return;
      checkingRef.current = true;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (!user) return;

        const deviceId = getOrCreateDeviceId();
        const fn = mode === "claim" ? "claim_account_device" : "check_account_device";
        const { data, error } = await supabase.rpc(fn, {
          p_device_id: deviceId,
          p_user_agent: userAgent(),
        });

        if (error) {
          console.error("Device session guard RPC error:", error);
          return;
        }

        const result = (data ?? {}) as DeviceRpcResult;
        if (result.ok) {
          localStorage.setItem(CLAIMED_USER_KEY, user.id);
          return;
        }

        if (result.status === "rate_limited") {
          const until = result.blocked_until ? new Date(result.blocked_until).toLocaleString("pl-PL") : "później";
          await endLocalSession(`Na tym koncie wykryto zbyt wiele zmian urządzenia. Logowanie na nowe urządzenia zostało czasowo zablokowane do ${until}.`);
          return;
        }

        if (result.status === "replaced") {
          await endLocalSession("To konto zostało zalogowane na innym urządzeniu. Ta sesja została zakończona.");
        }
      } finally {
        checkingRef.current = false;
      }
    }

    async function initialize() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) return;
      const claimedUser = localStorage.getItem(CLAIMED_USER_KEY);
      await run(claimedUser === user.id ? "check" : "claim");
    }

    initialize();

    const { data: authSub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem(CLAIMED_USER_KEY);
        return;
      }
      const user = session?.user;
      if (!user) return;
      const claimedUser = localStorage.getItem(CLAIMED_USER_KEY);
      void run(claimedUser === user.id ? "check" : "claim");
    });

    const interval = window.setInterval(() => void run("check"), CHECK_INTERVAL_MS);
    const onFocus = () => void run("check");
    const onVisibility = () => {
      if (document.visibilityState === "visible") void run("check");
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      authSub.subscription.unsubscribe();
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-red-900/60 bg-neutral-950 p-6 text-neutral-100 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">Sesja zakończona</p>
        <h2 className="mt-2 text-xl font-bold">Ochrona konta</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-300">{message}</p>
        <button
          type="button"
          onClick={() => setMessage("")}
          className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-bold text-neutral-950"
        >
          Rozumiem
        </button>
      </div>
    </div>
  );
}
