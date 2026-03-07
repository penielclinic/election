"use client";
import dynamic from "next/dynamic";

const AdminClient = dynamic(() => import("./components/AdminClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      로딩 중...
    </div>
  ),
});

export default function AdminPage() {
  return <AdminClient />;
}
