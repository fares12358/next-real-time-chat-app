'use client'
import { Room } from "@/Components";
import Image from "next/image";
import { AuthProvider } from "@/Context/AuthContext";
export default function Home() {
  return (
  <main className="w-full h-full overflow-auto scrollbar-hide">
    <AuthProvider>
      <Room/>
    </AuthProvider>
  </main>
  );
}
