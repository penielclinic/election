"use client";
import dynamic from "next/dynamic";

const ApplyClient = dynamic(() => import("./components/ApplyClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
      로딩 중...
    </div>
  ),
});

export default function ApplyPage() {
  return <ApplyClient />;
}
