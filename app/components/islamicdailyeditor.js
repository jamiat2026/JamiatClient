"use client"
import { useEffect, useState } from "react"
import { TbEdit, TbTrash, TbPlus, TbX, TbBook, TbQuote, TbStar } from "react-icons/tb"
import { BookOpen, Sparkles } from "lucide-react"

const emptyForm = { dailyHadith: "", quranicVerse: "", dailyQuote: "" }

export default function IslamicDailyEditor() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Fetch all cards
  useEffect(() => {
    fetchCards()
  }, [])

  async function fetchCards() {
    setLoading(true)
    const res = await fetch("/api/islamic-daily")
    const data = await res.json()
    setCards(Array.isArray(data) ? data : data ? [data] : [])
    setLoading(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function openAddForm() {
    setForm({ ...emptyForm })
    setEditingId(null)
    setShowForm(true)
  }

  function openEditForm(card) {
    setForm({
      dailyHadith: card.dailyHadith || "",
      quranicVerse: card.quranicVerse || "",
      dailyQuote: card.dailyQuote || "",
    })
    setEditingId(card._id)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  async function handleSave() {
    setSaving(true)
    const body = editingId ? { ...form, _id: editingId } : { ...form }
    await fetch("/api/islamic-daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    await fetchCards()
    cancelForm()
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this card?")) return
    setDeletingId(id)
    await fetch(`/api/islamic-daily?id=${id}`, { method: "DELETE" })
    await fetchCards()
    setDeletingId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading cards...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 bg-white rounded-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Sparkles size={20} className="text-emerald-500" />
            Daily Content Cards
          </h2>
          <p className="text-sm text-gray-500">
            Create cards with Daily Hadith, Quranic Verse, and Quote. Each card will be rendered on the frontend.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer border border-emerald-500/50 shrink-0"
          >
            <TbPlus className="text-lg" />
            Add New Card
          </button>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Add / Edit Form */}
      {showForm && (
        <div className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              {editingId ? (
                <>
                  <TbEdit className="text-emerald-600 text-lg" />
                  Edit Card
                </>
              ) : (
                <>
                  <TbPlus className="text-emerald-600 text-lg" />
                  New Card
                </>
              )}
            </h3>
            <button
              onClick={cancelForm}
              className="text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer"
            >
              <TbX className="text-xl" />
            </button>
          </div>

          {/* Daily Hadith */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <TbBook className="text-emerald-500" /> Daily Hadith
            </label>
            <textarea
              name="dailyHadith"
              value={form.dailyHadith}
              onChange={handleChange}
              placeholder="Enter the Daily Hadith..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-gray-800 placeholder:text-gray-400 transition"
            />
          </div>

          {/* Quranic Verse */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-500" /> Quranic Verse
            </label>
            <textarea
              name="quranicVerse"
              value={form.quranicVerse}
              onChange={handleChange}
              placeholder="Enter a Quranic Verse..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-gray-800 placeholder:text-gray-400 transition"
            />
          </div>

          {/* Daily Quote */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <TbQuote className="text-emerald-500" /> Daily Quote
            </label>
            <textarea
              name="dailyQuote"
              value={form.dailyQuote}
              onChange={handleChange}
              placeholder="Enter a Daily Quote..."
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-gray-800 placeholder:text-gray-400 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t border-emerald-100">
            <button
              onClick={cancelForm}
              className="flex items-center gap-2 font-medium text-sm border border-gray-300 hover:bg-gray-50 px-5 py-2.5 cursor-pointer text-gray-600 transition rounded-xl"
            >
              Cancel
            </button>
            <button
              className="flex items-center gap-2 font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm disabled:opacity-50"
              onClick={handleSave}
              disabled={saving || (!form.dailyHadith && !form.quranicVerse && !form.dailyQuote)}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                "Update Card"
              ) : (
                "Add Card"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Cards List */}
      {cards.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Sparkles size={40} className="mb-3 text-gray-300" />
          <p className="text-base font-medium text-gray-500">No cards yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add New Card" to create your first daily content card.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {cards.map((card, idx) => (
            <div
              key={card._id}
              className="group border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Daily Card
                  </span>
                  {card.createdAt && (
                    <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
                      {new Date(card.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditForm(card)}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                    title="Edit card"
                  >
                    <TbEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(card._id)}
                    disabled={deletingId === card._id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                    title="Delete card"
                  >
                    {deletingId === card._id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <TbTrash className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Hadith */}
                <div className="px-5 py-4 flex flex-col gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <TbBook className="text-sm" /> Daily Hadith
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {card.dailyHadith || <span className="text-gray-400 italic">No content</span>}
                  </div>
                </div>

                {/* Quranic Verse */}
                <div className="px-5 py-4 flex flex-col gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <BookOpen size={13} /> Quranic Verse
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {card.quranicVerse || <span className="text-gray-400 italic">No content</span>}
                  </div>
                </div>

                {/* Quote */}
                <div className="px-5 py-4 flex flex-col gap-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                    <TbQuote className="text-sm" /> Daily Quote
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {card.dailyQuote || <span className="text-gray-400 italic">No content</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
