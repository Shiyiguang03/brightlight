'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'STAFF',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ User created successfully! Temporary password: ${formData.phone}`);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          role: 'STAFF',
        });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>Create New User</h1>
        <p className="mb-8" style={{ color: '#7c6251' }}>Create Staff or Agent account</p>

        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8 shadow-sm" style={{ borderColor: '#e6dfd5' }}>
          
          <div className="mb-5">
            <label className="block text-sm font-bold mb-2" style={{ color: '#453227' }}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3"
              style={{ borderColor: '#e6dfd5' }}
              placeholder="Enter full name"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold mb-2" style={{ color: '#453227' }}>Phone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3"
              style={{ borderColor: '#e6dfd5' }}
              placeholder="+60123456789"
            />
            <p className="text-xs mt-1" style={{ color: '#9f7a5f' }}>This will be used as temporary password</p>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold mb-2" style={{ color: '#453227' }}>Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
              style={{ borderColor: '#e6dfd5' }}
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" style={{ color: '#453227' }}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
              style={{ borderColor: '#e6dfd5' }}
            >
              <option value="STAFF">Staff (Technician)</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition"
            style={{ backgroundColor: '#d97706' }}
          >
            {loading ? 'Creating User...' : 'Create User'}
          </button>

          {message && (
            <div className="mt-4 p-4 rounded-xl text-sm" style={{ backgroundColor: '#fef3c7', color: '#453227' }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}