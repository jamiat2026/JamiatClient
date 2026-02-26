"use client";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { useSession } from "next-auth/react";

export default function AboutHeroSectionEditor() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/aboutvisionsection")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setForm(d || {});
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/aboutvisionsection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lastUpdatedBy: userEmail }),
    });
    const updated = await res.json();
    setData(updated);
    setForm(updated);
    setEdit(false);
    setSaving(false);
  }

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading...</div>;

  if (!data && !edit)
    return (
      <div className="p-6">
        <p className="mb-4 text-sm text-gray-500">No Vision section found.</p>
        <button
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
          onClick={() => setEdit(true)}
        >
          Create
        </button>
      </div>
    );

  return (
    <>
      {edit ? (
        <div className="space-y-10 p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Title</label>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Subtitle
            </label>
            <input
              name="subtitle"
              value={form.subtitle || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <hr className="text-gray-300 my-8" />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Vision</label>
            <textarea
              name="vision"
              value={form.vision || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Mission
            </label>
            <textarea
              name="mission"
              value={form.mission || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex gap-2 justify-end mt-8 border-t border-gray-100 pt-6">
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
        <div className="space-y-10 p-6">
          <div className="flex justify-end pt-2">
            <button
              className="flex flex-row gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm text-sm sm:text-base border border-emerald-500/50"
              onClick={() => setEdit(true)}
            >
              Edit Section <TbEdit className="text-xl" />
            </button>
          </div>

          <>
            <span className="text-base sm:text-xl font-semibold">Title:</span>
            <span className="block mt-2 text-base sm:text-lg">
              {data.title}
            </span>
          </>

          <>
            <span className="text-base sm:text-xl font-semibold">
              Subtitle:
            </span>
            <span className="block mt-2">{data.subtitle}</span>
          </>

          <>
            <span className="text-base sm:text-xl font-semibold">Vision</span>
            <span className="block mt-2">{data.vision}</span>
          </>

          <>
            <span className="text-base sm:text-xl font-semibold">Mission</span>
            <span className="block mt-2">{data.mission}</span>
          </>
        </div>
      )}
    </>
  );
}
