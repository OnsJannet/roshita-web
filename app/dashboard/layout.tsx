"use client";
import { useEffect, useState } from 'react';
import {  SidebarProvider } from "@/components/ui/sidebar";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [defaultOpen, setDefaultOpen] = useState(false);

  useEffect(() => {
    // Access cookies on the client side
    const cookieStore = document.cookie; 
    const sidebarState = cookieStore.includes('sidebar:state=true');
    setDefaultOpen(sidebarState);
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {children}
    </SidebarProvider>
  );
}
