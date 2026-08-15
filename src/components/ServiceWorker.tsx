"use client";

import { useEffect } from "react";

export function ServiceWorker() {
  useEffect(() => {
    // Em desenvolvimento NÃO registramos o SW: evita cache obsoleto de chunks
    // (quebra o app após rebuilds) e não interfere com o Fast Refresh do Next.
    if (process.env.NODE_ENV !== "production") return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
