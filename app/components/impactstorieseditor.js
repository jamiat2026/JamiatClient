'use client'

import { useEffect, useRef, useState } from 'react'
import { GraduationCap, Heart, Users, Calculator, Plus, Trash2 } from 'lucide-react'

const ICON_MAP = {
  GraduationCap,
  Heart,
  Users,
  Calculator,
}

const ICONS = [
  { label: 'Graduation Cap', value: 'GraduationCap' },
  { label: 'Heart', value: 'Heart' },
  { label: 'Users', value: 'Users' },
  { label: 'Calculator', value: 'Calculator' },
]


export default function ImpactSectionEditor() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState({
    quote: '',
    name: '',
    location: '',
    initials: '',
    icon: ICONS[0].value,
  })
  const [adding, setAdding] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, [])

  async function fetchStories() {
    setLoading(true)
    const res = await fetch('/api/impact-stories')
    const data = await res.json()
    setStories(data)
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this story?')) return
    setDeleting(id)
    await fetch(`/api/impact-stories?id=${id}`, { method: 'DELETE' })
    setDeleting(null)
    setStories((prev) => prev.filter((s) => s._id !== id))
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    setAdding(true)
    await fetch('/api/impact-stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setAdding(false)
    setShowAdd(false)
    setForm({
      quote: '',
      name: '',
      location: '',
      initials: '',
      icon: ICONS[0].value,
    })
    fetchStories()
  }

  function handleScrollToForm() {
    setShowAdd(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  return (
    <div className="p-6 min-h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Impact Stories</h2>
          <p className="text-xs text-gray-500">Manage testimonials and impact stories.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-gray-500">Loading...</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-500">No stories found.</div>
      ) : (
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-2 grid-cols-1 gap-4">
          {stories.map((story) => {
            const Icon = ICON_MAP[story.icon] || Users;

            return (
              <div key={story._id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className='flex flex-row justify-between'>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-700 rounded-full p-2 text-xs font-semibold">{story.initials}</span>
                      <span className="font-semibold text-sm text-gray-800">{story.name}</span>
                    </div>

                    <span className="text-gray-500 text-xs mt-1 block">({story.location})</span>

                    <div className="text-xs text-gray-400 mt-1">
                      {story.createdAt ? new Date(story.createdAt).toLocaleString() : ''}
                    </div>

                    <p className="text-gray-600 text-sm mt-2">"{story.quote}"</p>
                  </div>

                  <Icon className="min-w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-row gap-2 items-center justify-end w-full mt-3">
                  <button
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 cursor-pointer transition-all"
                    onClick={() => handleDelete(story._id)}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div ref={formRef} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900">Add Impact Story</h2>

        <div className="flex flex-col gap-y-4">
          <div className="grid sm:grid-cols-2 gap-3 w-full">
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Quote</label>
              <textarea
                name="quote"
                value={form.quote}
                onChange={handleFormChange}
                required
                className="px-4 py-2.5 text-sm w-full border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                rows={3}
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                className="px-4 py-2.5 text-sm w-full border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleFormChange}
                required
                className="px-4 py-2.5 text-sm w-full border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Initials</label>
              <input
                name="initials"
                value={form.initials}
                onChange={handleFormChange}
                required
                maxLength={2}
                className="px-4 py-2.5 text-sm w-full border border-gray-200 rounded-xl bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
            <div className='sm:col-span-1 col-span-2'>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Icon</label>
              <select
                name="icon"
                value={form.icon}
                onChange={handleFormChange}
                className="px-4 py-2.5 text-sm w-full border border-gray-200 rounded-xl bg-white appearance-none cursor-pointer focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              >
                {ICONS.map((icon) => (
                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleAdd}
              disabled={adding}
              className="flex items-center gap-2 px-6 py-2.5 font-semibold cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus size={16} />
              {adding ? 'Adding...' : 'Add Story'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}