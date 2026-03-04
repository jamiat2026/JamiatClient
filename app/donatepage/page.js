"use client";

import DonatePageEditor from "../components/donatepageeditor";

export default function DonatePageCMS() {
  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Donate Page</h1>
        <p className="text-sm text-gray-500">
          Manage the donate page heading, subheading, and stats.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <DonatePageEditor />
      </div>
    </div>
  );
}
