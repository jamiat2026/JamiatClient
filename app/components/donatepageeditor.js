"use client";

import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { useSession } from "next-auth/react";

export default function DonatePageEditor() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/donatepage")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setForm(d || {});
      })
      .catch((err) => {
        console.error("Failed to load donate page data", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleStatChange(e) {
    const { name, value } = e.target;
    const [statKey, field] = name.split(".");

    setForm((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statKey]: {
          ...((prev.stats && prev.stats[statKey]) || {}),
          [field]: value,
        },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/donatepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lastUpdatedBy: userEmail }),
      });

      const updated = await res.json();
      setData(updated);
      setForm(updated);
      setEdit(false);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>;

  if (!data && !edit) {
    return (
      <div className="p-6">
        <p className="mb-4 text-sm text-gray-500">No donate page data found.</p>
        <button
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
          onClick={() => setEdit(true)}
        >
          Create
        </button>
      </div>
    );
  }

  return (
    <>
      {edit ? (
        <div className="space-y-8 p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Heading</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Subheading</label>
            <textarea
              name="subtitle"
              value={form.subtitle || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Stats</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "activeDonors", title: "Active Donors" },
                { key: "livesImpacted", title: "Lives Impacted" },
                { key: "statesReached", title: "States Reached" },
              ].map((stat) => (
                <div key={stat.key} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-700">{stat.title}</p>
                  <input
                    name={`${stat.key}.value`}
                    value={form.stats?.[stat.key]?.value || ""}
                    onChange={handleStatChange}
                    placeholder="Value"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    name={`${stat.key}.label`}
                    value={form.stats?.[stat.key]?.label || ""}
                    onChange={handleStatChange}
                    placeholder="Label"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end border-t border-gray-100 pt-6">
            <button
              className="flex flex-row sm:text-base text-sm gap-2 items-center font-medium bg-emerald-600 hover:bg-emerald-700 sm:px-6 px-4 py-2 cursor-pointer text-white transition rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="flex flex-row sm:text-base text-sm gap-2 items-center font-medium border border-emerald-600 hover:bg-emerald-50 sm:px-6 px-4 py-2 cursor-pointer text-emerald-600 transition rounded-xl"
              onClick={() => {
                setEdit(false);
                setForm(data);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 p-6">
          <div className="flex justify-end pt-2">
            <button
              className="flex flex-row gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm text-sm sm:text-base border border-emerald-500/50"
              onClick={() => setEdit(true)}
            >
              Edit Section <TbEdit className="text-xl" />
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Heading</p>
            <p className="mt-2 text-xl font-bold text-gray-900">{data?.title}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Subheading</p>
            <p className="mt-2 text-gray-700">{data?.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "activeDonors", title: "Active Donors" },
              { key: "livesImpacted", title: "Lives Impacted" },
              { key: "statesReached", title: "States Reached" },
            ].map((stat) => (
              <div key={stat.key} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                <p className="text-2xl font-bold text-gray-900">{data?.stats?.[stat.key]?.value || "-"}</p>
                <p className="text-sm text-gray-500 mt-1">{data?.stats?.[stat.key]?.label || stat.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
