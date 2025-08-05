import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ThemeToggler } from "@/components/ThemeToggler";
import { AdminSidebar } from "./_components/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if ((userId as string) !== (process.env.ADMIN_USER_ID as string)) {
    return redirect("/");
  }
  
  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex w-full flex-col md:pl-72">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex h-16 items-center px-4 md:hidden">
              {/* Space for mobile trigger button */}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggler />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
