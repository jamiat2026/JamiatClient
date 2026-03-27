"use client"
import { useEffect, useState } from "react"
import { TbEdit, TbTrash } from "react-icons/tb"
import { Link2 } from "lucide-react"

export default function IslamicToolsEditor() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ zakatLink: "", hijriLink: "" })
  const [saving, setSaving] = useState(false)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    fetch("/api/islamic-tools")
      .then((res) => res.json())
      .then((d) => {
        const item = Array.isArray(d) ? d[0] : d
        setData(item)
        setForm(item || { zakatLink: "", hijriLink: "" })
        setLoading(false)
      })
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/islamic-tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const updated = await res.json()
    setData(updated)
    setForm(updated)
    setEdit(false)
    setSaving(false)
  }

  async function handleDelete() {
    if (!window.confirm("Delete the links?")) return
    setSaving(true)
    await fetch("/api/islamic-tools", { method: "DELETE" })
    setData(null)
    setForm({ zakatLink: "", hijriLink: "" })
    setEdit(false)
    setSaving(false)
  }

  if (loading) return <div className="mt-10">Loading...</div>

  return (
    <div className="space-y-10 p-6 bg-white rounded-2xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 border-b pb-4 mb-4">External Tool Links</h2>
        <p className="text-sm text-gray-500 mb-6">Manage the Zakat Calculator and Hijri Calendar links. These links will open in a new tab when clicked on the front end.</p>
      </div>

      {(edit || !data) ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Zakat Calculator Link</label>
            <input
              name="zakatLink"
              value={form.zakatLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Hijri Calendar Link</label>
            <input
              name="hijriLink"
              value={form.hijriLink}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex gap-2 justify-end mt-8 border-t border-gray-100 pt-6">
            <button
              className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-6 py-2 cursor-pointer text-white transition rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : data ? "Update Links" : "Add Links"}
            </button>

            {data && (
              <button
                className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-red-600 hover:bg-red-50 sm:px-4 px-3 py-2 cursor-pointer text-red-600 transition rounded-xl"
                onClick={handleDelete}
                disabled={saving}
              >
                <TbTrash className="text-lg" />
              </button>
            )}

            <button
              className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border border-emerald-600 hover:bg-emerald-50 px-4 sm:px-6 py-2 cursor-pointer text-emerald-600 transition rounded-xl"
              onClick={() => {
                setEdit(false)
                setForm(data || { zakatLink: "", hijriLink: "" })
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end pt-2">
            <button
              className="flex flex-row gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm text-sm sm:text-base border border-emerald-500/50"
              onClick={() => setEdit(true)}
            >
              Edit Links <TbEdit className="text-xl" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 text-gray-800 shadow-sm flex flex-col gap-2">
              <div className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                <Link2 size={16} /> Zakat Calculator Link
              </div>
              <div className="text-sm sm:text-base break-all">
                {data?.zakatLink ? (
                  <a href={data.zakatLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {data.zakatLink}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No link provided</span>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 text-gray-800 shadow-sm flex flex-col gap-2">
              <div className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                <Link2 size={16} /> Hijri Calendar Link
              </div>
              <div className="text-sm sm:text-base break-all">
                {data?.hijriLink ? (
                  <a href={data.hijriLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {data.hijriLink}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No link provided</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
