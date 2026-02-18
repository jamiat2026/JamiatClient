'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Logo from '../../../public/logo.png';
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center animate-fade-in">
        <Image src={Logo} className=" w-16 mb-4 mx-auto" />

        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to <br /> Jamiat Admin Panel</h2>
        <p className="text-sm text-gray-500 mb-2">Please sign in to continue</p>

        <form onSubmit={handleEmailSignIn} className="text-left space-y-3">
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
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-black transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>

        <div className="my-4 text-xs text-gray-400">or</div>

        <button
          onClick={() => signIn("google")}
          className="flex w-full cursor-pointer hover:bg-gray-100 items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:shadow transition"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        <div className="mt-4 text-xs text-gray-500">
          First time here?{" "}
          <a className="text-gray-800 underline" href="/set-password">
            Set your password
          </a>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          By signing in, you agree to our terms and conditions.
        </div>
      </div>
    </div>
  );
}
