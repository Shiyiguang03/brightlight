'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface User {
  id: number;
  fullName: string;
  email: string | null;
  phone: string;
  role: string;
  createdAt: string;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CUSTOMER' | 'STAFF' | 'AGENT'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // ==================== EDIT MODAL STATE ====================
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Search + Filter
  useEffect(() => {
    let result = users;

    // Tab filter
    if (activeTab !== 'ALL') {
      result = result.filter(u => u.role === activeTab);
    }

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(u =>
        u.fullName.toLowerCase().includes(term) ||
        u.phone.toLowerCase().includes(term) ||
        (u.email && u.email.toLowerCase().includes(term))
      );
    }

    setFilteredUsers(result);
  }, [searchTerm, activeTab, users]);

  const getRoleColor = (role: string) => {
    if (role === 'CUSTOMER') return '#e0e7ff';
    if (role === 'STAFF') return '#fef3c7';
    if (role === 'AGENT') return '#dcfce7';
    return '#f3e8ff';
  };

  // ==================== OPEN EDIT MODAL ====================
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // ==================== RESET PASSWORD ====================
  const handleResetPassword = async () => {
    if (!selectedUser) return;

    if (!confirm(`Reset password for ${selectedUser.fullName} to their phone number?`)) {
      return;
    }

    setResetting(true);

    try {
      // Call backend to reset password
      const res = await fetch(`/api/admin/users/${selectedUser.id}/reset-password`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message || 'Failed to reset password');
        return;
      }

      // Professional WhatsApp Message
      const message = `Dear ${selectedUser.fullName},

Your password has been reset by our admin team.

Your new temporary password is: ${selectedUser.phone}

Please log in to your account and change your password immediately for security purposes.

Thank you for your understanding.

Best regards,
Bright Light Technology Services
WhatsApp: +60 11-6319 9899`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${selectedUser.phone.replace(/\D/g, '')}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      alert('Password has been reset. WhatsApp message opened.');

      setShowEditModal(false);
      setSelectedUser(null);

    } catch (error) {
      console.error(error);
      alert("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>All Users</h1>
            <p style={{ color: '#7c6251' }}>Manage customer, staff and agent accounts.</p>
          </div>

          {/* Search Bar */}
          <div className="w-80">
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-2xl px-5 py-3 text-sm"
              style={{ borderColor: '#e6dfd5' }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['ALL', 'CUSTOMER', 'STAFF', 'AGENT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-[#d97706] text-white' : 'bg-white border hover:bg-[#fef3c7]'}`}
              style={{ borderColor: '#e6dfd5', color: activeTab === tab ? 'white' : '#453227' }}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}s
            </button>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: '#e6dfd5' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#e6dfd5', backgroundColor: '#fefce8' }}>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#453227' }}>USER</th>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#453227' }}>ROLE</th>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#453227' }}>JOINED</th>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#453227' }}>ORDERS</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#7c6251]">No users found.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-[#fefce8]" style={{ borderColor: '#f1f5f9' }}>
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: '#453227' }}>{user.fullName}</div>
                      <div className="text-sm" style={{ color: '#7c6251' }}>{user.email || user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: getRoleColor(user.role), color: '#453227' }}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#7c6251' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#7c6251' }}>
                      0
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-sm font-semibold px-4 py-1.5 rounded-xl border hover:bg-[#fef3c7]"
                        style={{ borderColor: '#e6dfd5', color: '#b45309' }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== EDIT USER MODAL ==================== */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4" style={{ border: '1px solid #e6dfd5' }}>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#453227' }}>Edit User</h2>
            <p className="text-sm mb-6" style={{ color: '#7c6251' }}>{selectedUser.fullName}</p>

            <div className="space-y-4">
              {/* Reset Password Button */}
              <button
                onClick={handleResetPassword}
                disabled={resetting}
                className="w-full py-3.5 rounded-2xl font-semibold text-white text-base"
                style={{ backgroundColor: '#d97706' }}
              >
                {resetting ? 'Resetting Password...' : 'Reset Password to Phone Number'}
              </button>

              <p className="text-xs text-center" style={{ color: '#7c6251' }}>
                This will set the password to: <span className="font-mono">{selectedUser.phone}</span>
              </p>

              {/* Permission Editing (Hidden for now) */}
              {/* 
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Permissions (Coming Soon)</p>
                <div className="text-xs text-[#7c6251]">This feature is currently disabled.</div>
              </div>
              */}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 py-3 rounded-2xl font-semibold border"
                style={{ borderColor: '#e6dfd5', color: '#453227' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}