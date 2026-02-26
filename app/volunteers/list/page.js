'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import Loader from '../../components/loader'

export default function VolunteerListPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    fetchVolunteers()
  }, [])

  async function fetchVolunteers() {
    setLoading(true)
    const res = await fetch('/api/volunteer')
    const data = await res.json()
    setVolunteers(data)
    setLoading(false)
  }

  const totalVolunteers = volunteers.length
  const totalPages = Math.ceil(totalVolunteers / rowsPerPage)
  const paginatedVolunteers = volunteers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  if (loading) {
    return (
      <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm flex items-center justify-center">
        <Loader fullScreen={false} />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Volunteers</h1>
        <p className="text-sm text-gray-500">View all submitted volunteer applications.</p>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Email', 'Phone', 'Skills', 'Availability', 'Actions'].map((heading, idx) => (
                  <th
                    key={idx}
                    className={`py-3.5 px-5 text-xs font-semibold uppercase tracking-wider text-gray-500 text-nowrap ${idx === 5 ? 'text-right' : ''}`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {paginatedVolunteers.length > 0 &&
                paginatedVolunteers.map((vol) => (
                  <tr key={vol._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-gray-900">{vol.name}</td>
                    <td className="py-3.5 px-5">{vol.email}</td>
                    <td className="py-3.5 px-5">{vol.phone}</td>
                    <td className="py-3.5 px-5">{vol.skills}</td>
                    <td className="py-3.5 px-5">{vol.availability}</td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelected(vol)}
                        className="text-emerald-600 hover:bg-emerald-50 rounded-lg p-2 cursor-pointer transition-all duration-200"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200 text-sm text-gray-500">
          <div>
            Showing <span className="font-medium text-gray-700">{Math.min((currentPage - 1) * rowsPerPage + 1, totalVolunteers)}</span> to{' '}
            <span className="font-medium text-gray-700">{Math.min(currentPage * rowsPerPage, totalVolunteers)}</span> of{' '}
            <span className="font-medium text-gray-700">{totalVolunteers}</span> entries
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 hover:bg-gray-50 hover:border-emerald-300 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-default disabled:hover:bg-white disabled:hover:border-gray-200"
            >
              <FaAnglesLeft />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 hover:bg-gray-50 hover:border-emerald-300 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-default disabled:hover:bg-white disabled:hover:border-gray-200"
            >
              <FaAnglesRight />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900">Volunteer Details</h2>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg p-1.5 cursor-pointer transition-all duration-200"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Name</p>
                <p className="text-sm text-gray-900">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email</p>
                <p className="text-sm text-gray-900">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Phone</p>
                <p className="text-sm text-gray-900">{selected.phone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Skills</p>
                <p className="text-sm text-gray-900">{selected.skills}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Availability</p>
                <p className="text-sm text-gray-900">{selected.availability}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Message</p>
              <p className="text-sm text-gray-900 whitespace-pre-line">{selected.message}</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                Submitted: {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
