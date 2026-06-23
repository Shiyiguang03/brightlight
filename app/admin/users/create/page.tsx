'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'AGENT',
  });

  const [permissions, setPermissions] = useState({
    viewRepairRequests: true,
    updateRepairStatus: true,
    contactCustomers: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (key: string) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof permissions],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match");
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
          password: formData.password,
          role: formData.role,
          // You can store permissions later if needed
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Account created successfully! Temporary password: ${formData.phone}`);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'AGENT',
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>Create staff / agent</h1>

        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8 mt-6" style={{ borderColor: '#e6dfd5' }}>

          {/* ACCOUNT DETAILS */}
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wider mb-4 text-center" style={{ color: '#9f7a5f' }}>ACCOUNT DETAILS</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#9f7a5f' }}>First name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#e6dfd5' }} placeholder="e.g. Ahmad" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#9f7a5f' }}>Last name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#e6dfd5' }} placeholder="e.g. Razif" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#9f7a5f' }}>Email address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#e6dfd5' }} placeholder="user@brightlight.my" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#9f7a5f' }}>Phone number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#e6dfd5' }} placeholder="+60 12 345 6789" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#9f7a5f' }}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#e6dfd5' }} placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: '#9f7a5f' }}>Confirm password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#e6dfd5' }} placeholder="Repeat password" />
              </div>
            </div>
          </div>

          {/* SELECT ROLE */}
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wider mb-4 text-center" style={{ color: '#9f7a5f' }}>SELECT ROLE</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['AGENT', 'STAFF', 'MANAGER'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-4 rounded-2xl border text-center transition-all ${formData.role === role ? 'bg-[#fef3c7] border-[#d97706]' : 'border-[#e6dfd5] hover:bg-[#fefce8]'}`}
                >
                  <div className="text-2xl mb-2">
                    {role === 'AGENT' && '🎧'}
                    {role === 'STAFF' && '🛠️'}
                    {role === 'MANAGER' && '🛡️'}
                  </div>
                  <p className="font-semibold" style={{ color: '#453227' }}>{role}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PERMISSIONS */}
          <div className="mb-8">
            <p className="text-sm font-bold tracking-wider mb-4 text-center" style={{ color: '#9f7a5f' }}>PERMISSIONS</p>
            
            <div className="space-y-4">
              {[
                { key: 'viewRepairRequests', label: 'View repair requests', desc: 'Can see all work orders' },
                { key: 'updateRepairStatus', label: 'Update repair status', desc: 'Can change work order progress' },
                { key: 'contactCustomers', label: 'Contact customers', desc: 'Can message via live agent' },
              ].map((perm) => (
                <div key={perm.key} className="flex items-center justify-between px-4 py-3 border rounded-2xl" style={{ borderColor: '#e6dfd5' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#453227' }}>{perm.label}</p>
                    <p className="text-xs" style={{ color: '#9f7a5f' }}>{perm.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={permissions[perm.key as keyof typeof permissions]} 
                      onChange={() => handlePermissionChange(perm.key)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d97706]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-lg transition"
            style={{ backgroundColor: '#d97706' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {message && (
            <div className="mt-4 p-4 rounded-2xl text-sm text-center" style={{ backgroundColor: '#fef3c7', color: '#453227' }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}