import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="flex min-h-screen" style={{ paddingTop: 'var(--hdr-h)' }}>
        <AdminSidebar />

        {/* Main Content */}
        <main className="admin-main">
          <div className="full-width-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
