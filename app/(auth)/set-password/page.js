'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/logo.png";

function SetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const qpEmail = searchParams.get("email") || "";
    const qpToken = searchParams.get("token") || "";
    setEmail(qpEmail);
    setToken(qpToken);
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data?.error || "Failed to set password.");
      return;
    }

    router.replace("/login");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center animate-fade-in">
        <Image src={Logo} className=" w-16 mb-4 mx-auto" alt="Jamiat" />

        <h2 className="text-3xl font-bold mb-4 text-gray-800">Set Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          Create a password to sign in with email.
        </p>

        <form onSubmit={handleSubmit} className="text-left space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Paste token from email"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-black transition disabled:opacity-60"
          >
            {loading ? "Setting password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SetPasswordInner />
    </Suspense>
  );
}
