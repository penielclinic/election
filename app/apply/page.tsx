"use client";

import { useState, useEffect } from "react";
import ApplyClient from "./components/ApplyClient";

export default function ApplyPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <ApplyClient />;
}
