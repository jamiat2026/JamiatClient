"use client"
import { useEffect, useState } from "react"
import { TbEdit, TbTrash, TbPlus, TbCloudUpload } from "react-icons/tb"

export default function HomeSocialHighlightEditor() {
  const [data, setData] = useState({ title: "Social Highlighting Work", subtitle: "Manage your social highlights and gallery items.", items: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    fetch("/api/homesocialhighlight")
      .then((res) => res.json())
      .then((d) => {
        if (d) {
          setData(d)
        }
        setLoading(false)
      })
  }, [])

  async function handleImageUpload(e, index) {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const result = await res.json()
      if (result.url) {
        const newItems = [...data.items]
        newItems[index].image = result.url
        setData({ ...data, items: newItems })
      }
    } catch (error) {
      console.error("Upload failed", error)
    }
  }

  function handleAddItem() {
    setData({
      ...data,
      items: [
        ...data.items,
        { image: "", tag: "", title: "" }
      ]
    })
  }

  function handleRemoveItem(index) {
    const newItems = data.items.filter((_, i) => i !== index)
    setData({ ...data, items: newItems })
  }

  function handleItemChange(index, field, value) {
    const newItems = [...data.items]
    newItems[index][field] = value
    setData({ ...data, items: newItems })
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/homesocialhighlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    setData(updated)
    setEdit(false)
    setSaving(false)
  }

  if (loading) return <div className="mt-10">Loading...</div>

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
            <p className="text-sm text-gray-500">{data.subtitle || "Manage your social highlights and gallery items."}</p>
         </div>
         {!edit && (
             <button
                className="flex flex-row gap-2 items-center font-semibold bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 cursor-pointer text-white transition-all rounded-xl shadow-sm text-sm sm:text-base border border-emerald-500/50"
                onClick={() => setEdit(true)}
                >
                Edit Section <TbEdit className="text-xl" />
             </button>
         )}
      </div>

      {edit ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Section Title</label>
            <input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Section Title"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Section Subtitle</label>
            <input
              value={data.subtitle || ""}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              placeholder="Section Subtitle"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Gallery Items</label>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <TbPlus /> Add New Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((item, index) => (
                <div key={index} className="relative group bg-gray-50/50 rounded-2xl p-4 border border-gray-200 hover:border-emerald-200 transition-all">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                  >
                    <TbTrash size={16} />
                  </button>

                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors">
                      {item.image ? (
                        <>
                          <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer text-white text-xs font-semibold flex items-center gap-2">
                              <TbCloudUpload size={18} /> Change Image
                              <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors">
                          <TbCloudUpload size={32} />
                          <span className="text-xs font-semibold uppercase tracking-wider">Upload Image</span>
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, index)} />
                        </label>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        value={item.tag}
                        onChange={(e) => handleItemChange(index, "tag", e.target.value)}
                        placeholder="Tag (e.g. FOOD DRIVE)"
                        className="w-full text-xs font-bold uppercase tracking-widest text-emerald-600 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-all"
                      />
                      <input
                        value={item.title}
                        onChange={(e) => handleItemChange(index, "title", e.target.value)}
                        placeholder="Card Title"
                        className="w-full text-sm font-semibold text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-8 border-t border-gray-100">
            <button
              className="px-6 py-2.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => {
                setEdit(false)
                // Reload data to discard changes
                fetch("/api/homesocialhighlight")
                  .then((res) => res.json())
                  .then((d) => { if (d) setData(d) })
              }}
            >
              Cancel
            </button>
            <button
              className="px-8 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95 disabled:opacity-50 cursor-pointer"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {data.items.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
              <p className="text-gray-400 font-medium">No items added yet. Click edit to start building your gallery.</p>
            </div>
          ) : (
            data.items.map((item, index) => (
              <div key={index} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="inline-block px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-bold tracking-[0.2em] rounded-lg mb-4 shadow-lg shadow-emerald-500/20">
                      {item.tag}
                   </div>
                   <h3 className="text-2xl font-bold text-white tracking-wide leading-tight">
                      {item.title}
                   </h3>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
