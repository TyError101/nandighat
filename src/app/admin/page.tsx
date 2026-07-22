"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Waves, LogOut, Check, X } from "lucide-react";

type Row = {
  id: string;
  year: number;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  fullName: string;
  fullNameHi: string | null;
  mobile: string;
  city: string | null;
  slug: string;
};

const statusColor: Record<string, string> = {
  VERIFIED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  REJECTED: "bg-red-100 text-red-700",
};

const statusLabel: Record<string, string> = {
  VERIFIED: "स्वीकृत / Approved",
  PENDING: "लंबित / Pending",
  REJECTED: "अस्वीकृत / Rejected",
};

export default function AdminPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      if (data.success) setRows(data.rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/registrations");
        const data = await res.json();
        if (!cancelled && data.success) setRows(data.rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function updateStatus(id: string, status: "VERIFIED" | "REJECTED") {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

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
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm font-medium text-secondary"
          >
            <LogOut className="h-4 w-4" /> लॉगआउट / Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold text-secondary">पंजीकरण / Registrations</h1>
        <p className="text-muted-foreground">कुल {rows.length} पंजीकरण</p>

        {loading ? (
          <p className="mt-6 text-muted-foreground">लोड हो रहा है... / Loading...</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-secondary/5 text-secondary">
                <tr>
                  <th className="px-4 py-3 font-semibold">नाम / Name</th>
                  <th className="px-4 py-3 font-semibold">मोबाइल</th>
                  <th className="px-4 py-3 font-semibold">शहर</th>
                  <th className="px-4 py-3 font-semibold">वर्ष</th>
                  <th className="px-4 py-3 font-semibold">दिनांक</th>
                  <th className="px-4 py-3 font-semibold">स्थिति</th>
                  <th className="px-4 py-3 font-semibold">कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {r.fullNameHi || r.fullName}
                      <div className="text-xs text-muted-foreground">{r.fullName}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.mobile}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.city || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.year}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[r.status]}`}>
                        {statusLabel[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(r.id, "VERIFIED")}
                          disabled={updatingId === r.id || r.status === "VERIFIED"}
                          className="flex items-center gap-1 rounded-lg bg-green-100 px-2.5 py-1.5 text-xs font-semibold text-green-700 disabled:opacity-40"
                        >
                          <Check className="h-3.5 w-3.5" /> स्वीकृत
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "REJECTED")}
                          disabled={updatingId === r.id || r.status === "REJECTED"}
                          className="flex items-center gap-1 rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-40"
                        >
                          <X className="h-3.5 w-3.5" /> अस्वीकृत
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}