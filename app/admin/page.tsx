"use client";

import { useState, useEffect } from "react";
import AdminClient from "./components/AdminClient";

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AdminClient />;
}
