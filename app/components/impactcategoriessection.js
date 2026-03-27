"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import LucideIconPicker from "./LucideIconPicker";

export default function ImpactCategoriesEditor() {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState({ title: "", subtitle: "" });
  const [categories, setCategories] = useState([]);
  const [edit, setEdit] = useState(false);

  const [newCategory, setNewCategory] = useState({
    key: "",
    color: "",
    title: "",
    subtitle: "",
    description: "",
    link: "",
    icon: "",
    stats: [],
  });

  const [editingKey, setEditingKey] = useState(null);
  const [newStat, setNewStat] = useState({ label: "", value: "", progress: 0 });
  const [editingStatIndex, setEditingStatIndex] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/impactcategories");
      const data = await res.json();
      setSection(data.section || { title: "", subtitle: "" });
      setCategories(data.categories || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Save whole doc (section + categories)
  const saveDoc = async (updated) => {
    const res = await fetch("/api/impactcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    setSection(data.section || { title: "", subtitle: "" });
    setCategories(data.categories || []);
  };

  // Save section only
  const handleSaveSection = () => {
    saveDoc({ section, categories });
    setEdit(false);
  };

  // Save or update stat
  const handleSaveStat = () => {
    if (!newStat.label || !newStat.value) {
      alert("Stat needs both label and value.");
      return;
    }

    let updatedStats;
    if (editingStatIndex !== null) {
      updatedStats = newCategory.stats.map((s, i) =>
        i === editingStatIndex ? newStat : s
      );
      setEditingStatIndex(null);
    } else {
      updatedStats = [...newCategory.stats, newStat];
    }

    setNewCategory({ ...newCategory, stats: updatedStats });
    setNewStat({ label: "", value: "", progress: 0 });
  };

  // Add / Update category
  const handleAddCategory = () => {
    if (!newCategory.key) {
      alert("Each category needs a key (e.g. education, healthcare).");
      return;
    }

    let updated;
    if (editingKey) {
      updated = categories.map((c) => (c.key === editingKey ? newCategory : c));
      setEditingKey(null);
    } else {
      updated = [...categories, newCategory];
    }

    saveDoc({ section, categories: updated });

    setNewCategory({
      key: "",
      color: "",
      title: "",
      subtitle: "",
      description: "",
      link: "",
      icon: "",
      stats: [],
    });
  };

  // Remove category
  const handleRemoveCategory = (key) => {
    const updated = categories.filter((c) => c.key !== key);
    saveDoc({ section, categories: updated });
  };

  // Edit category (populate form)
  const handleEditCategory = (cat) => {
    setNewCategory(cat);
    setEditingKey(cat.key);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  // Add stat to current newCategory
  const handleAddStat = () => {
    if (!newStat.label || !newStat.value) {
      alert("Stat needs both label and value.");
      return;
    }
    setNewCategory({
      ...newCategory,
      stats: [...newCategory.stats, newStat],
    });
    setNewStat({ label: "", value: "", progress: 0 });
  };

  // Edit stat
  const handleEditStat = (index) => {
    setNewStat(newCategory.stats[index]);
    setEditingStatIndex(index);
  };

  // Remove stat
  const handleRemoveStat = (index) => {
    const updatedStats = newCategory.stats.filter((_, i) => i !== index);
    setNewCategory({ ...newCategory, stats: updatedStats });
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading editor...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Section Title/Subtitle */}
      <div>
        {edit ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Title</label>
              <input
                type="text"
                placeholder="Title"
                value={section.title}
                onChange={(e) =>
                  setSection({ ...section, title: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Subtitle</label>
              <input
                type="text"
                placeholder="Subtitle"
                value={section.subtitle}
                onChange={(e) =>
                  setSection({ ...section, subtitle: e.target.value })
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div className="flex gap-2 justify-end border-t border-gray-100 pt-4">
              <button
                onClick={handleSaveSection}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Save Section
              </button>
              <button
                onClick={() => setEdit(false)}
                className="flex items-center gap-2 px-5 py-2 border border-emerald-600 hover:bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div>
                <span className="text-base sm:text-lg font-semibold text-gray-900">Title:</span>
                <span className="block mt-1 text-sm text-gray-600">
                  {section.title}
                </span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Subtitle:
                </span>
                <span className="block mt-1 text-sm text-gray-600">
                  {section.subtitle}
                </span>
              </div>
            </div>

            <button
              className="flex flex-row gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm text-sm border border-emerald-500/50"
              onClick={() => setEdit(true)}
            >
              Edit <Pencil size={14} />
            </button>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Categories */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Categories</h2>
        {categories.length === 0 && (
          <p className="text-sm text-gray-500">No categories added yet.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const CatIcon = cat.icon ? LucideIcons[cat.icon] : null;
            return (
            <div
              key={cat.key}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {CatIcon && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: (cat.color || '#10b981') + '18' }}>
                      <CatIcon size={15} style={{ color: cat.color || '#10b981' }} />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm text-gray-900">{cat.title}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg p-1.5 cursor-pointer transition-all"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleRemoveCategory(cat.key)}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 cursor-pointer transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">{cat.subtitle}</p>

              <div className="flex gap-2 items-center mb-3">
                <span className="text-xs text-gray-400">Color:</span>
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{
                    backgroundColor: cat.color?.startsWith("#")
                      ? cat.color
                      : "#10b981",
                  }}
                ></div>
                <span className="text-xs text-gray-400">
                  {cat.color || "#10b981"}
                </span>
                {cat.icon && (
                  <span className="text-xs text-gray-400 ml-2">Icon: {cat.icon}</span>
                )}
              </div>

              {cat.stats && cat.stats.length > 0 && (
                <div className="space-y-2">
                  {cat.stats.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{s.label}</span>
                        <span className="font-medium">{s.value}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${s.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
          })}
        </div>
      </div>

      {/* Add / Edit Category */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">
          {editingKey ? "Edit Category" : "Add Category"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Key</label>
            <input
              type="text"
              placeholder="e.g. education"
              value={newCategory.key}
              disabled={!!editingKey}
              onChange={(e) =>
                setNewCategory({ ...newCategory, key: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Title</label>
            <input
              type="text"
              placeholder="Category title"
              value={newCategory.title}
              onChange={(e) =>
                setNewCategory({ ...newCategory, title: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Subtitle</label>
            <input
              type="text"
              placeholder="Category subtitle"
              value={newCategory.subtitle}
              onChange={(e) =>
                setNewCategory({ ...newCategory, subtitle: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Link</label>
            <input
              type="text"
              placeholder="Category link"
              value={newCategory.link}
              onChange={(e) =>
                setNewCategory({ ...newCategory, link: e.target.value })
              }
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Card Color</label>
            <input
              type="color"
              value={
                newCategory.color?.startsWith("#") ? newCategory.color : "#10b981"
              }
              onChange={(e) =>
                setNewCategory({ ...newCategory, color: e.target.value })
              }
              className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
            />
            <span className="text-xs text-gray-400">{newCategory.color || "#10b981"}</span>
          </div>
          <LucideIconPicker
            value={newCategory.icon}
            onChange={(iconName) =>
              setNewCategory({ ...newCategory, icon: iconName })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
          <textarea
            placeholder="Category description"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
            rows={3}
          />
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {editingStatIndex !== null ? "Edit Stat" : "Add Stat"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Label</label>
              <input
                type="text"
                placeholder="Stat label"
                value={newStat.label}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Value</label>
              <input
                type="text"
                placeholder="Stat value"
                value={newStat.value}
                onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Progress %</label>
              <input
                type="number"
                placeholder="0"
                value={newStat.progress}
                onChange={(e) =>
                  setNewStat({ ...newStat, progress: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleSaveStat}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all cursor-pointer active:scale-95"
          >
            <Plus size={14} />
            {editingStatIndex !== null ? "Update Stat" : "Add Stat"}
          </button>

          {newCategory.stats.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Stats Preview</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {newCategory.stats.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 border border-gray-200 rounded-xl bg-white flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-800">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.value}</p>

                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 relative">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${s.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 mt-1 block text-right">
                        {s.progress}%
                      </span>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditStat(i)}
                        className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg p-1.5 cursor-pointer transition-all"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleRemoveStat(i)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 cursor-pointer transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-5 py-2.5 font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus size={16} />
            {editingKey ? "Update Category" : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
