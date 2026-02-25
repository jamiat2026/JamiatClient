'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Logo from '../../../public/logo.png';
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, session, router]);

  async function handleEmailSignIn(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password, or password not set.");
      return;
    }
    router.replace('/');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_40px_rgba(16,185,129,0.12)] border border-emerald-100/60 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="p-3 bg-emerald-50 rounded-2xl ring-1 ring-emerald-200/50">
            <Image src={Logo} className="w-12 h-12 object-contain" alt="Logo" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 tracking-tight leading-snug">
          Welcome to <br />
          <span className="text-emerald-600" translate="no">Jamiat Admin</span>
        </h2>
        <p className="text-sm text-gray-400 mt-2 mb-6">Sign in to your account to continue</p>

        <form onSubmit={handleEmailSignIn} className="text-left space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white/80 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm bg-white/80 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg hover:shadow-emerald-200/50 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={() => signIn("google")}
          className="flex w-full cursor-pointer items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-200"
        >
          <FcGoogle className="text-lg" />
          Sign in with Google
        </button>

        <div className="mt-5 text-xs text-gray-400">
          First time here?{" "}
          <a className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors" href="/set-password">
            Set your password
          </a>
        </div>

        <div className="mt-4 text-[11px] text-gray-300">
          By signing in, you agree to our terms and conditions.
        </div>
      </div>
    </div>
  );
}
