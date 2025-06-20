import '@/app/globals.css'
import type React from "react"
import { User } from "@/types/userType";
import { Sidebar1 } from "@/components/views/sidebar1"
import { Sidebar2 } from "@/components/views/sidebar2"
import { Header } from "@/components/views/header"
import { cookies } from 'next/headers'
import { encrypt, decrypt } from "@/routes/utils/auth";
// import { tokenPayload } from "@/types/payloadType";
// import { useEffect, useState} from "react";
// import { useRouter } from "next/navigation";

// import { UserContext } from "@/app/context/UserContext";
// import { usePathname } from 'next/navigation';
// import { getUser } from '@/lib/dal';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookie = await cookies();
  const data = cookie.get('token')?.value
  const user = await decrypt(data) as User;
  const renderSidebar = () => {
    switch (user?.role) {
      case 'Admin Travel Agent':
        return <Sidebar1 />;
      case 'Tim Keuangan':
        return <Sidebar2 />;
      default:
        return null; // atau Sidebar umum kalau ada
    }
  }
  return (
    // <UserContext.Provider value={ user }>
      <div className="flex h-screen">
        { renderSidebar() }
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={ user } />
          <main className="flex-1 overflow-y-auto bg-[#f5f5f5] p-4">{children}</main>
        </div>
      </div>
    // </UserContext.Provider>
  )
}