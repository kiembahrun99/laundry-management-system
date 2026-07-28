"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
export default function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [v, setV] = useState(params.get("q") || "");
  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams(params.toString());
      if (v) sp.set("q", v); else sp.delete("q");
      sp.set("page", "1");
      router.push("?" + sp.toString());
    }, 400);
    return () => clearTimeout(t);
  }, [v]);
  return <input className="form-control" placeholder={placeholder} value={v} onChange={e => setV(e.target.value)} />;
}
