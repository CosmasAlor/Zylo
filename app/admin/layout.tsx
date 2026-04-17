import { AdminSignOutButton } from "@/modules/admin/components/admin-signout-button";
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container-app flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight">Zylo Admin</h1>
            <nav className="flex items-center gap-4 text-sm font-medium mt-1">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/admin/appointments" className="text-muted-foreground hover:text-foreground">
                Appointments
              </Link>
              <Link href="/admin/blog" className="text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/admin/gallery" className="text-muted-foreground hover:text-foreground">
                Gallery
              </Link>
              <Link href="/admin/cms" className="text-muted-foreground hover:text-foreground">
                CMS
              </Link>
              <Link href="/admin/media" className="text-muted-foreground hover:text-foreground">
                Media
              </Link>
            </nav>
          </div>
          <AdminSignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
