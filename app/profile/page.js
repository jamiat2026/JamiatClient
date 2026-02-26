"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/users/${encodeURIComponent(session.user.email)}`);
          if (!res.ok) throw new Error("Failed to fetch user data");
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [session?.user?.email]);

  if (!session) {
    return (
      <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm flex items-center justify-center">
        <p className="text-sm text-gray-500">You are not signed in</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">View your account details and manage your session.</p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-16 text-center">
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      ) : userData ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 flex items-center gap-5">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-200 shadow-sm flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700">
                  {session.user.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">{session.user.name}</h2>
              <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {userData.role || "User"}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-gray-100">
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</p>
                <p className="text-sm font-medium text-gray-900">{userData.email}</p>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Role</p>
                <p className="text-sm font-medium text-gray-900">{userData.role}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Access Permissions</p>
            <div className="flex flex-wrap gap-2">
              {userData.access?.length > 0 ? userData.access.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200"
                >
                  {a}
                </span>
              )) : (
                <span className="text-sm text-gray-400">No access permissions assigned.</span>
              )}
            </div>
          </div>

          {/* Sign out */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 sm:px-8 py-4 flex justify-end">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-5 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl cursor-pointer transition-all shadow-sm border border-red-400/50"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-16 text-center">
          <p className="text-sm text-gray-400">No profile data found.</p>
        </div>
      )}
    </div>
  );
}
