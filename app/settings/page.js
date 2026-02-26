'use client';

import { useEffect, useState } from 'react';
import { TbEdit } from "react-icons/tb";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import { TbTrash } from 'react-icons/tb';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    email: '',
    role: '',
    access: [],
    password: '',
  });

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: '',
    access: [],
    password: '',
    sendInviteEmail: true,
  });
  async function handleDeleteUser(email) {
    const confirmed = confirm(`Are you sure you want to delete the user ${email}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('User deleted successfully');
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  }
  const ACCESS_OPTIONS = ["dashboard", "donations", "settings", "cms", "donors"];
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(users.length / rowsPerPage);
  const paginatedUsers = users?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setUpdateFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      access: user.access || [],
      password: '',
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    const payload = { ...updateFormData };
    if (!payload.password) {
      delete payload.password;
    }

    const res = await fetch(`/api/users/${encodeURIComponent(updateFormData.email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await fetchUsers();
      setEditingUser(null);
    } else {
      alert('Failed to update user');
    }
  }

  function handleAccessChange(option, isNewForm = false) {
    const form = isNewForm ? newUserData : updateFormData;
    const currentAccess = new Set(form.access);
    if (currentAccess.has(option)) {
      currentAccess.delete(option);
    } else {
      currentAccess.add(option);
    }

    const updatedAccess = Array.from(currentAccess);
    if (isNewForm) {
      setNewUserData((prev) => ({ ...prev, access: updatedAccess }));
    } else {
      setUpdateFormData((prev) => ({ ...prev, access: updatedAccess }));
    }
  }

  async function handleAddSubmit() {
    if (!newUserData.sendInviteEmail && !newUserData.password) {
      alert("Please set a password or enable invite email.");
      return;
    }

    const payload = {
      email: newUserData.email,
      role: newUserData.role,
      access: newUserData.access,
      password: newUserData.password || undefined,
      skipEmail: !newUserData.sendInviteEmail || !!newUserData.password,
    };

    console.log("📤 Sending invite payload:", payload); // 👈 Log here

    try {
      const res = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const manual = !newUserData.sendInviteEmail || !!newUserData.password;
      setNewUserData({
        name: '',
        email: '',
        role: '',
        access: [],
        password: '',
        sendInviteEmail: true,
      });
      alert(manual ? "User created with manual password." : "Invite sent successfully!");
    } catch (err) {
      console.error('❌ Error in adding user:', err);
      alert("Failed to invite user");
    }
  }
  if (loading) {
    return (
      <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading users...</p>
      </div>
    );
  }

  const inputClass = "p-2.5 text-sm w-full border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <div className="min-h-full w-full bg-gray-50/50 p-4 sm:p-8 rounded-3xl border border-gray-200/60 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage users, roles, and access permissions.</p>
      </div>

      {/* Users Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                {["Avatar", "Email", "Name", "Role", "Access", "Actions"].map((title, idx) => (
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
              {paginatedUsers.length > 0 &&
                paginatedUsers.map((user) => {
                  const color = user.colorCode || "#6B7280";
                  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || "US";

                  return (
                    <tr key={user.email} className="border-b border-gray-100 last:border-none hover:bg-gray-50/60 transition-all">
                      <td className="py-3 px-4">
                        <div
                          style={{ backgroundColor: `${color}20`, color }}
                          className="min-w-8 w-8 min-h-8 h-8 rounded-full font-bold flex items-center justify-center text-xs"
                        >
                          {initials}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium text-nowrap">{user.name || "—"}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{user.role || "—"}</td>
                      <td className="py-3 px-4 text-sm text-gray-500 text-nowrap">{user.access?.join(', ') || "—"}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(user)}
                            className="cursor-pointer text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-all"
                            title="Edit user"
                          >
                            <TbEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.email)}
                            className="cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                            title="Delete user"
                          >
                            <TbTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <p className="text-base">No users found.</p>
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
            <span className="font-medium text-gray-700">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
            <span className="font-medium text-gray-700">{Math.min(currentPage * rowsPerPage, users.length)}</span> of{' '}
            <span className="font-medium text-gray-700">{users.length}</span> entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-default transition-all"
            >
              <FaAnglesLeft size={12} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 border border-gray-200 bg-white hover:bg-gray-100 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-default transition-all"
            >
              <FaAnglesRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit/Add Form Section */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 space-y-5">
          {editingUser ? (
            <>
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Edit User</h2>
              <div className="flex flex-col gap-y-4">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="text"
                      value={updateFormData.email}
                      disabled
                      className={`${inputClass} bg-gray-100 cursor-not-allowed opacity-60`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      value={updateFormData.name}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <input
                      type="text"
                      value={updateFormData.role}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, role: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password"
                      value={updateFormData.password}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, password: e.target.value })}
                      placeholder="Leave blank to keep current"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Access Permissions</p>
                  <div className="flex flex-wrap gap-4">
                    {ACCESS_OPTIONS.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={updateFormData.access.includes(option)}
                          onChange={() => handleAccessChange(option)}
                          className="custom-checkbox"
                        />
                        <span className="text-sm capitalize text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold tracking-tight text-gray-900">Add New User</h2>
              <div className="flex flex-col gap-y-4">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Name</label>
                    <input
                      type="text"
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <input
                      type="text"
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newUserData.sendInviteEmail}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, sendInviteEmail: e.target.checked })
                    }
                    className="custom-checkbox"
                  />
                  <span className="text-sm text-gray-700">Send invite email</span>
                </div>

                {!newUserData.sendInviteEmail && (
                  <div>
                    <label className={labelClass}>Password</label>
                    <input
                      type="password"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Access Permissions</p>
                  <div className="flex flex-wrap gap-4">
                    {ACCESS_OPTIONS.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newUserData.access.includes(option)}
                          onChange={() => handleAccessChange(option, true)}
                          className="custom-checkbox"
                        />
                        <span className="text-sm capitalize text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Form Actions Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          {editingUser ? (
            <>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleUpdate}
                className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-all shadow-sm border border-emerald-500/50"
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="submit"
              onClick={handleAddSubmit}
              className="px-6 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-all shadow-sm border border-emerald-500/50"
            >
              Add User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

