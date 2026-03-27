"use client";
import { useState } from "react";

export default function EmergencyAboutEditor({ data, onSave, saving }) {
  const [form, setForm] = useState(data || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Fund Title</label>
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
          placeholder="e.g., Emergency Relief Fund"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">About the Event</label>
        <textarea
          name="aboutContent"
          value={form.aboutContent || ""}
          onChange={handleChange}
          rows={10}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none"
          placeholder="Describe the emergency and why funds are needed..."
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save About Content"}
        </button>
      </div>
    </div>
  );
}
