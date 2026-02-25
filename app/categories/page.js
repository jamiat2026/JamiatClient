"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import { TbEdit } from "react-icons/tb"
import { FaPlus } from "react-icons/fa6"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState("add") // "add" | "edit"
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function fetchCategories() {
    try {
      setLoading(true)
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    fetchCategories()
  }

  function openAddModal() {
    setFormData({ name: "", description: "" })
    setModalType("add")
    setModalOpen(true)
  }

  function openEditModal(cat) {
    setFormData({ name: cat.name, description: cat.description || "" })
    setEditId(cat._id)
    setModalType("edit")
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    if (modalType === "add") {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    } else if (modalType === "edit" && editId) {
      await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    }

    setSaving(false)
    setModalOpen(false)
    fetchCategories()
  }

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">Manage and organize your project categories.</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex flex-row text-sm sm:text-base gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm border border-emerald-500/50"
        >
          <FaPlus size={14} />
          Add Category
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{cat.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{cat.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="text-emerald-600 hover:bg-emerald-50 rounded-lg p-2 cursor-pointer transition-all"
                    title="Edit"
                  >
                    <TbEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-2 cursor-pointer transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {!categories.length && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <p className="text-base">No categories found.</p>
                <p className="text-sm mt-1">Create your first category to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 space-y-5">
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                {modalType === "add" ? "Add Category" : "Edit Category"}
              </h2>
              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="p-2.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="p-2.5 w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-all shadow-sm border border-emerald-500/50 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
