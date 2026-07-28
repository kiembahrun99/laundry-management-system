"use client";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ username: fd.get("username"), password: fd.get("password") }), headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-sm rounded-4 border-0" style={{ width: 380 }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-droplet-half text-primary" style={{ fontSize: 48 }}></i>
            <h4 className="fw-bold mt-2">Laundry POS</h4>
            <p className="text-muted small">Sign in to continue</p>
          </div>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input name="username" className="form-control" required autoFocus />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-100">
              {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : "Sign In"}
            </button>
          </form>
          <div className="mt-3 small text-muted text-center">admin / admin123 • employee / employee123</div>
        </div>
      </div>
    </div>
  );
}
