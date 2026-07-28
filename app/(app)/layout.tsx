import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("laundry_session")?.value;
  const user = token ? await verifyToken(token) : null;
  const settings = await db.setting.findMany();
  const sm = Object.fromEntries(settings.map(s => [s.key, s.value || ""]));
  const laundryName = sm.laundry_name || "Laundry Express";

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <nav className="bg-white border-end shadow-sm d-flex flex-column" style={{ width: 250, minHeight: "100vh", position: "sticky", top: 0 }}>
        <div className="p-3 border-bottom">
          <h5 className="fw-bold mb-0 text-primary"><i className="bi bi-droplet-half me-2"></i>{laundryName}</h5>
          <small className="text-muted">{user?.name} ({user?.role})</small>
        </div>
        <div className="flex-grow-1 p-2">
          {[
            { href: "/dashboard", icon: "speedometer2", label: "Dashboard" },
            { href: "/customers", icon: "people", label: "Customers" },
            { href: "/services", icon: "tags", label: "Services" },
            { href: "/orders", icon: "receipt", label: "Orders" },
            { href: "/payments", icon: "credit-card", label: "Payments" },
            { href: "/reports", icon: "bar-chart", label: "Reports" },
            { href: "/settings", icon: "gear", label: "Settings" },
          ].map(l => (
            <a key={l.href} href={l.href} className="btn btn-light w-100 text-start mb-1 d-flex align-items-center gap-2">
              <i className={`bi bi-${l.icon}`}></i> {l.label}
            </a>
          ))}
        </div>
        <div className="p-2 border-top">
          <form action="/api/auth/logout" method="POST">
            <button className="btn btn-outline-danger w-100 btn-sm" type="submit"><i className="bi bi-box-arrow-right me-1"></i> Logout</button>
          </form>
        </div>
      </nav>
      <div className="flex-grow-1">
        <div className="p-3 p-md-4">{children}</div>
      </div>
    </div>
  );
}
