import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/shared/Footer";
import NavBar from "@/components/shared/NavBar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from 'next/headers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const cookieStore = cookies();
    const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return <>

      <SidebarProvider defaultOpen={defaultOpen}>
          {children}
      </SidebarProvider>

  </>;
}
