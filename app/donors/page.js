"use client"
import { useEffect, useState } from 'react'
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6"
import Loader from '../components/loader'

export default function DonorsPage() {
  const [donors, setDonors] = useState([])
  const [projects, setProjects] = useState([])
  const [donations, setDonations] = useState([])
  const [clerkUsers, setClerkUsers] = useState([]);
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)

      const [donorRes, projectRes, donationRes, clerkUsersRes] = await Promise.all([
        fetch('/api/donors'),
        fetch('/api/projects'),
        fetch('/api/save-donation'),
        fetch('/api/clerk-users') // 🆕 Call Clerk users API
      ])

      const donors = await donorRes.json()
      const projectsData = await projectRes.json()
      const projects = projectsData.projects || projectsData
      const donations = await donationRes.json()
      const clerkUsersData = await clerkUsersRes.json()

      setDonors(donors)
      setProjects(projects)
      setDonations(donations)
      setClerkUsers(clerkUsersData)

      setLoading(false)
    }
    fetchAll()
  }, [])

  const getProjectName = (id) => {
    const project = projects.find((p) => p._id === id);
    return project ? project.title || project.name : id; // fallback if not found
  };

  const totalPages = Math.ceil(donors.length / rowsPerPage)
  const paginatedDonors = donors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Donors</h1>
        <p className="text-sm text-gray-500">View donor contributions and registered users.</p>
      </div>

      {/* Donors Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                {["Avatar", "Name", "Email", "Total Donated", "Total Projects", "Projects Donated"].map((title, idx) => (
                  <th
                    key={idx}
                    className="py-3 px-4 text-nowrap text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedDonors.map((donor) => {
                const color = donor.colorCode || "#6B7280"
                const initials =
                  donor.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "US"
                return (
                  <tr key={donor._id} className="border-b border-gray-100 last:border-none hover:bg-gray-50/60 transition-all">
                    <td className="py-3 px-4">
                      <div
                        style={{
                          backgroundColor: `${color}20`,
                          color: color,
                        }}
                        className="min-w-8 w-8 min-h-8 h-8 rounded-full font-bold flex items-center justify-center text-xs"
                      >
                        {initials}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{donor.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{donor.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-semibold">₹{donor.totalDonated}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{donor.totalProjects}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      <ul className="space-y-0.5">
                        {donor.projectsDonatedTo?.length > 0 ? (
                          donor.projectsDonatedTo.map((pid) => (
                            <li key={pid}>{getProjectName(pid)}</li>
                          ))
                        ) : (
                          <li className="text-gray-400">—</li>
                        )}
                      </ul>
                    </td>
                  </tr>
                )
              })}

              {paginatedDonors.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <p className="text-base">No donors found.</p>
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
            <span className="font-medium text-gray-700">{Math.min((currentPage - 1) * rowsPerPage + 1, donors.length)}</span> to{' '}
            <span className="font-medium text-gray-700">{Math.min(currentPage * rowsPerPage, donors.length)}</span> of{' '}
            <span className="font-medium text-gray-700">{donors.length}</span> entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="p-2.5 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-default transition-all"
            >
              <FaAnglesLeft size={12} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="p-2.5 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-default transition-all"
            >
              <FaAnglesRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Registered Users Section */}
      <div className="flex flex-col gap-1 pt-4">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Registered Users</h2>
        <p className="text-sm text-gray-500">Users registered via authentication.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                {["Profile", "Name", "Email", "Phone"].map((title, idx) => (
                  <th
                    key={idx}
                    className="py-3 px-4 text-nowrap text-xs font-bold uppercase tracking-wider text-gray-500"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clerkUsers.length > 0
                ? clerkUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50/60 transition-all">
                    <td className="py-3 px-4">
                      <img
                        src={user.image_url}
                        alt={user.first_name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{`${user.first_name || ''} ${user.last_name || ''}`}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {user.email_addresses?.[0]?.email_address || '—'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {user.phone_numbers?.[0]?.phone_number || '—'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-gray-400">
                      <p className="text-base">No registered users found.</p>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

