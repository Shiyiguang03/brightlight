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
  const [activeTab, setActiveTab] = useState<'ALL' | 'CUSTOMER' | 'STAFF' | 'AGENT'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users'); // We'll create this API next
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = activeTab === 'ALL' 
    ? users 
    : users.filter(u => u.role === activeTab);

  const getRoleColor = (role: string) => {
    if (role === 'CUSTOMER') return '#e0e7ff';
    if (role === 'STAFF') return '#fef3c7';
    if (role === 'AGENT') return '#dcfce7';
    return '#f3e8ff';
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>All Users</h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>Manage customer, staff and agent accounts.</p>

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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-[#7c6251]">No users found.</td></tr>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}