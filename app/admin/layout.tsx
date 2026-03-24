import Link from "next/link";
import { getUser } from "@/lib/supabase/auth";
import AdminSignOut from "@/components/admin/AdminSignOut";

export const metadata = {
  title: "Admin | VanshVriksha",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  // Login page renders without admin chrome
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-forest/10 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-display text-lg font-bold text-forest"
            >
              VanshVriksha
              <span className="ml-2 text-xs font-normal text-gold">Admin</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/admin"
                className="text-forest/60 transition-colors hover:text-forest"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/add"
                className="text-forest/60 transition-colors hover:text-forest"
              >
                Add Person
              </Link>
              <Link
                href="/tree"
                className="text-forest/60 transition-colors hover:text-forest"
              >
                View Tree
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-forest/40">{user.email}</span>
            <AdminSignOut />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
