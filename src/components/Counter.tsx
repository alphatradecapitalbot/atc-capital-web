"use client";

import { useState, useEffect } from "react";

export default function Counter({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>{value}</span>;
  }

  return <span>{value.toLocaleString()}</span>;
}
