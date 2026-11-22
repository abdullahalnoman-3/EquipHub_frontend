"use client";

import React, { useEffect, useState } from "react";
import api from "@/services/api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  Shield,
  UserCheck,
  User,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Filter,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      if (res.data?.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle live role change
  const handleRoleChange = async (userId: string, userName: string, newRole: string) => {
    const confirm = await Swal.fire({
      title: "Update User Role?",
      text: `Change ${userName}'s platform role to "${newRole}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, Make ${newRole}`,
    });

    if (!confirm.isConfirmed) return;

    setUpdatingId(userId);
    try {
      const res = await api.patch(`/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );

        toast.success(`Role updated to ${newRole}!`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const name = u.name || "";
    const email = u.email || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u._id?.toLowerCase().includes(searchTerm.toLowerCase());

    if (roleFilter === "all") return matchesSearch;
    return matchesSearch && u.role?.toLowerCase() === roleFilter.toLowerCase();
  });

  // Calculate counts
  const customerCount = users.filter((u) => u.role === "Customer").length;
  const ownerCount = users.filter((u) => u.role === "Owner").length;
  const adminCount = users.filter((u) => u.role === "Admin").length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";
      case "Owner":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform User Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review all registered accounts, inspect permissions, and manage user roles.
        </p>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{users.length}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">Customers</p>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{customerCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Equipment Owners</p>
          <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{ownerCount}</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">System Admins</p>
          <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{adminCount}</h3>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Users" },
            { id: "customer", label: "Customers" },
            { id: "owner", label: "Owners" },
            { id: "admin", label: "Admins" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                roleFilter === tab.id
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading user accounts...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No users found</h3>
          <p className="text-xs text-slate-400 mt-1">No user accounts match your search or filter.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Current Role</th>
                  <th className="py-4 px-6">Registered Date</th>
                  <th className="py-4 px-6 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.photoURL || u.avatar ? (
                          <img
                            src={u.photoURL || u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.name || "User"}</p>
                          <span className="text-[11px] font-mono text-slate-400">ID: {u._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                        {u.email}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getRoleBadge(u.role)}`}>
                        <Shield className="w-3 h-3" />
                        {u.role || "Customer"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <select
                          value={u.role || "Customer"}
                          disabled={updatingId === u._id}
                          onChange={(e) => handleRoleChange(u._id, u.name, e.target.value)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="Customer">Customer</option>
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                        </select>
                        {updatingId === u._id && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
