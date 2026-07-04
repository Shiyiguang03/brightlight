'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'STAFF',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone) {
      setMessage("Phone number is required (will be used as password)");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email || null,
          password: formData.phone,           // ← Password = Phone Number
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Account created successfully!\nTemporary Password: ${formData.phone}`);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
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

  // Role-based permissions display
  const getRolePermissions = (role: string) => {
    if (role === 'AGENT') {
      return [
        { label: 'View Assigned Repairs', desc: 'Can only see repairs assigned to them' },
        { label: 'Contact Customers', desc: 'Can communicate with customers' },
      ];
    }
    if (role === 'STAFF') {
      return [
        { label: 'View All Repair Requests', desc: 'Can see all work orders' },
        { label: 'Update Repair Status', desc: 'Can change work order progress' },
        { label: 'Contact Customers', desc: 'Can message customers' },
      ];
    }
    if (role === 'MANAGER') {
      return [
        { label: 'View All Repair Requests', desc: 'Full access to all work orders' },
        { label: 'Update Repair Status', desc: 'Can change any work order status' },
        { label: 'Assign Work Orders', desc: 'Can assign repairs to staff' },
        { label: 'Manage Staff', desc: 'Can view and manage team members' },
      ];
    }
    return [];
  };

  const currentPermissions = getRolePermissions(formData.role);

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>Create Staff / Agent</h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>
          Create new accounts. <span className="font-medium">Password will be set to their phone number.</span>
        </p>

        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8" style={{ borderColor: '#e6dfd5' }}>

          {/* ACCOUNT DETAILS */}
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wider mb-4" style={{ color: '#78350f' }}>ACCOUNT DETAILS</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#453227' }}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                  style={{ borderColor: '#e6dfd5', color: '#453227' }}
                  placeholder="e.g. Ahmad"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#453227' }}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                  style={{ borderColor: '#e6dfd5', color: '#453227' }}
                  placeholder="e.g. Razif"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#453227' }}>Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                  style={{ borderColor: '#e6dfd5', color: '#453227' }}
                  placeholder="user@brightlight.my"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#453227' }}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 text-sm"
                  style={{ borderColor: '#e6dfd5', color: '#453227' }}
                  placeholder="+60 12 345 6789"
                />
                <p className="text-xs mt-1" style={{ color: '#9f7a5f' }}>
                  This will also be used as their temporary password
                </p>
              </div>
            </div>
          </div>

          {/* SELECT ROLE */}
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wider mb-4" style={{ color: '#78350f' }}>SELECT ROLE</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['AGENT', 'STAFF', 'MANAGER'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-4 rounded-2xl border text-center transition-all ${formData.role === role
                    ? 'bg-[#fef3c7] border-[#d97706] shadow-sm'
                    : 'border-[#e6dfd5] hover:bg-[#fefce8]'}`}
                >
                  <div className="text-3xl mb-2">
                    {role === 'AGENT' && '🎧'}
                    {role === 'STAFF' && '🛠️'}
                    {role === 'MANAGER' && '🛡️'}
                  </div>
                  <p className="font-bold text-lg" style={{ color: '#453227' }}>{role}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PERMISSIONS */}
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wider mb-4" style={{ color: '#78350f' }}>PERMISSIONS FOR {formData.role}</p>

            <div className="bg-[#fefce8] border rounded-2xl p-5" style={{ borderColor: '#e6dfd5' }}>
              {currentPermissions.length > 0 ? (
                <div className="space-y-4">
                  {currentPermissions.map((perm, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#d97706' }}></div>
                      <div>
                        <p className="font-semibold" style={{ color: '#453227' }}>{perm.label}</p>
                        <p className="text-sm" style={{ color: '#7c6251' }}>{perm.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#7c6251' }}>No specific permissions set for this role yet.</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-lg transition hover:opacity-90 disabled:opacity-70"
            style={{ backgroundColor: '#d97706' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {message && (
            <div className="mt-4 p-4 rounded-2xl text-sm text-center font-medium whitespace-pre-line"
              style={{ backgroundColor: '#fef3c7', color: '#453227' }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}