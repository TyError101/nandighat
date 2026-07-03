import Link from "next/link";
import { Waves, ArrowLeft } from "lucide-react";

const MOCK_ROWS = [
  { id: "NG-2026-000001", name: "रमेश पटेल", mobile: "9876543210", city: "Kevadia", date: "12 Jun 2026", status: "Approved" },
  { id: "NG-2026-000002", name: "सुनिता पटेल", mobile: "9876543211", city: "Kevadia", date: "12 Jun 2026", status: "Approved" },
  { id: "NG-2026-000003", name: "विजय शर्मा", mobile: "9123456780", city: "Ahmedabad", date: "13 Jun 2026", status: "Pending" },
  { id: "NG-2026-000004", name: "कमला देवी", mobile: "9988776655", city: "Indore", date: "14 Jun 2026", status: "Pending" },
  { id: "NG-2026-000005", name: "अनिल जोशी", mobile: "9090909090", city: "Bhopal", date: "15 Jun 2026", status: "Rejected" },
];

const statusColor: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Waves className="h-4 w-4" />
            </div>
            <p className="text-base font-bold text-secondary">नंदी घाट Admin</p>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-secondary">
            <ArrowLeft className="h-4 w-4" /> होम
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold text-secondary">पंजीकरण / Registrations</h1>
        <p className="text-muted-foreground">कुल {MOCK_ROWS.length} पंजीकरण</p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-secondary/5 text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">नाम / Name</th>
                <th className="px-4 py-3 font-semibold">मोबाइल</th>
                <th className="px-4 py-3 font-semibold">शहर</th>
                <th className="px-4 py-3 font-semibold">दिनांक</th>
                <th className="px-4 py-3 font-semibold">स्थिति</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ROWS.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.mobile}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.city}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}