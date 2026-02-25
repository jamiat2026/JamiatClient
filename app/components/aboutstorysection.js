"use client";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useSession } from "next-auth/react";

export default function AboutStorySectionEditor() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/aboutstorysection")
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

  function handleArrayChange(section, idx, field, value) {
    setForm((f) => {
      const items = [...(f[section] || [])];
      items[idx] = { ...items[idx], [field]: value };
      return { ...f, [section]: items };
    });
  }

  function handleAddItem(section) {
    setForm((f) => ({
      ...f,
      [section]: [...(f[section] || []), { title: "", content: "" }],
    }));
  }

  function handleRemoveItem(section, idx) {
    setForm((f) => ({
      ...f,
      [section]: f[section]?.filter((_, i) => i !== idx) || [],
    }));
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/aboutstorysection", {
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
        <p className="mb-4 text-sm text-gray-500">No Story section found.</p>
        <button
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
          onClick={() => setEdit(true)}
        >
          Create
        </button>
      </div>
    );

  const renderArrayEditor = (label, section) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 mb-2 items-center justify-between">
        <label className="text-sm font-bold uppercase tracking-wider text-gray-500">{label}</label>
        <button
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
          onClick={() => handleAddItem(section)}
          type="button"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {(form[section] || []).map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 border border-gray-200 p-4 rounded-xl bg-white hover:shadow-md transition-shadow"
          >
            <input
              placeholder="Title"
              value={item.title || ""}
              onChange={(e) =>
                handleArrayChange(section, idx, "title", e.target.value)
              }
              className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2"
            />
            <textarea
              placeholder="Content"
              value={item.content || ""}
              onChange={(e) =>
                handleArrayChange(section, idx, "content", e.target.value)
              }
              className="border border-gray-300 w-full rounded-lg bg-white px-3 py-2"
              rows={3}
            />
            <button
              className="self-end text-gray-400 hover:text-red-500 cursor-pointer hover:bg-red-50 rounded-full p-2.5 transition-colors"
              onClick={() => handleRemoveItem(section, idx)}
              type="button"
            >
              <TbTrash className="text-xl" />
            </button>
          </div>
        ))}
      </div>
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

          {renderArrayEditor("Journey", "journey")}
          {renderArrayEditor("Impact", "impact")}
          {renderArrayEditor("Future", "future")}

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

          <div>
            <span className="text-base sm:text-xl font-semibold">Title:</span>
            <span className="block mt-2 text-base sm:text-lg">
              {data.title}
            </span>
          </div>

          <div>
            <span className="text-base sm:text-xl font-semibold">
              Subtitle:
            </span>
            <span className="block mt-2">{data.subtitle}</span>
          </div>

          <hr className="text-gray-300 my-8" />

          {["journey", "impact", "future"].map((section) => (
            <div key={section} className="space-y-4">
              <span className="text-base sm:text-xl font-semibold block">
                {section.charAt(0).toUpperCase() + section.slice(1)}:
              </span>
              {data[section] && data[section].length > 0 ? (
                data[section].map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
                  >
                    <div className="font-semibold text-base text-gray-800">
                      {item.title || "No Title"}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {item.content || "No Content"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Section is empty</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
