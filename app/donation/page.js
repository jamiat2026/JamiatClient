'use client'

import { useEffect, useState } from 'react'
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import Loader from '../components/loader'

export default function DonationPage() {
  const [donations, setDonations] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const totalPages = Math.ceil(donations.length / rowsPerPage)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const [donRes, projRes] = await Promise.all([
        fetch('/api/save-donation'),
        fetch('/api/projects'),
      ])
      const donations = await donRes.json()
      const projects = await projRes.json()
      setDonations(donations)
      setProjects(projects.projects || projects)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const getProjectName = (id) => {
    if (!id) return '-'
    const proj = projects.find((p) => p._id === id)
    return proj ? proj.title : id
  }

  const paginatedDonations = donations.slice(
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Donation Records</h1>
        <p className="text-sm text-gray-500">
          Track and manage donation entries across all projects.
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                {[
                  'Name',
                  'Email',
                  'Amount',
                  'Type',
                  'Frequency',
                  'Project',
                  'Status',
                  'Date',
                ].map((heading, idx, arr) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-500 ${idx === arr.length - 1 ? 'text-right' : ''
                      }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedDonations.length > 0 &&
                paginatedDonations.map((donation) => (
                  <tr
                    key={donation._id}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50/60 transition-all"
                  >
                    <td className="py-3 px-4 text-nowrap text-sm text-gray-900 font-medium">{donation.name}</td>
                    <td className="py-3 px-4 text-nowrap text-sm text-gray-500">{donation.email}</td>
                    <td className="py-3 px-4 text-nowrap text-sm text-gray-900 font-semibold">₹{donation.amount}</td>
                    <td className="py-3 px-4 text-nowrap text-sm text-gray-500">{donation.donationType}</td>
                    <td className="py-3 px-4 text-nowrap text-sm text-gray-500">{donation.donationFrequency}</td>
                    <td className="py-3 px-4 text-nowrap text-sm text-gray-500">{getProjectName(donation.projectId)}</td>
                    <td className="py-3 px-4 text-nowrap">
                      {donation.paymentId ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Success</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">Failed</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-nowrap text-right text-xs text-gray-400">
                      {donation.createdAt
                        ? new Date(donation.createdAt).toLocaleString()
                        : ''}
                    </td>
                  </tr>
                ))}

              {paginatedDonations.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <p className="text-base">No donation records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 text-sm">
          <p className="text-gray-500">
            Showing{' '}
            <span className="font-medium text-gray-700">{Math.min((currentPage - 1) * rowsPerPage + 1, donations.length)}</span> to{' '}
            <span className="font-medium text-gray-700">{Math.min(currentPage * rowsPerPage, donations.length)}</span> of{' '}
            <span className="font-medium text-gray-700">{donations.length}</span> entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="p-2.5 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-default transition-all"
            >
              <FaAnglesLeft size={12} />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-default transition-all"
            >
              <FaAnglesRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
