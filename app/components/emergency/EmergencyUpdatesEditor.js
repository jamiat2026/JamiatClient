"use client";
import { useState } from "react";
import { TbTrash, TbPlus } from "react-icons/tb";

export default function EmergencyUpdatesEditor({ data, onSave, saving }) {
  const [updates, setUpdates] = useState(data?.liveUpdates || []);

  const handleAddUpdate = () => {
    setUpdates([{ title: "", content: "", timestamp: new Date().toISOString() }, ...updates]);
  };

  const handleRemoveUpdate = (index) => {
    setUpdates(updates.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...updates];
    updated[index][field] = value;
    setUpdates(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Live Updates</label>
        <button
          onClick={handleAddUpdate}
          className="flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition"
        >
          <TbPlus size={20} /> Add Update
        </button>
      </div>

      <div className="space-y-4">
        {updates.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-4 relative">
            <button
              onClick={() => handleRemoveUpdate(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <TbTrash size={20} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400">Title</label>
                <input
                  value={item.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  placeholder="Update Title"
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-400">Timestamp</label>
                <input
                  type="datetime-local"
                  value={item.timestamp ? new Date(item.timestamp).toISOString().slice(0, 16) : ""}
                  onChange={(e) => handleChange(index, "timestamp", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-400">Content</label>
              <textarea
                value={item.content}
                onChange={(e) => handleChange(index, "content", e.target.value)}
                placeholder="Write the update details here..."
                rows={3}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        ))}
      </div>

      {updates.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
          No live updates yet.
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={() => onSave({ liveUpdates: updates })}
          disabled={saving}
          className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Updates"}
        </button>
      </div>
    </div>
  );
}
