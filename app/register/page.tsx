'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';

const roles = [
  'CUSTOMER',
  'AGENT',
  'STAFF',
  'MANAGEMENT',
  'SUPER ADMIN',
];

const countries = [
  { code: '+60', name: 'Malaysia' },
  { code: '+65', name: 'Singapore' },
  { code: '+62', name: 'Indonesia' },
  { code: '+1', name: 'United States' },
];

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');
  const [countryCode, setCountryCode] = useState('+60');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !password || !confirmPassword) {
      alert('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phone: countryCode + phone.replace(/\s+/g, ''),
          email: email || null,
          password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully!');
        window.location.href = '/login';
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ backgroundColor: '#fcfbf7', minHeight: '100vh' }} className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md" style={{ width: '100%', maxWidth: '440px' }}>
          
          <div className="bg-white border rounded-3xl shadow-xl p-8 w-full" style={{ borderColor: '#e6dfd5' }}>
            
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo.jpg"
                alt="Logo"
                style={{ height: '48px', objectFit: 'contain' }}
              />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold" style={{ color: '#453227' }}>Create Account</h1>
              <p className="text-sm mt-1" style={{ color: '#7c6251' }}>
                Join Bright Light Technology Services
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">

              {/* Role Selection */}
              <div className="mb-2">
                <label className="block text-xs font-bold tracking-wider mb-3" style={{ color: '#9f7a5f' }}>
                  I AM A...
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {roles.map((role) => {
                    const isSuperAdmin = role === 'SUPER ADMIN';
                    const isSelected = selectedRole === role;

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        style={{
                          gridColumn: isSuperAdmin ? 'span 2' : 'auto',
                          padding: '14px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                          letterSpacing: '0.05em',
                          cursor: 'pointer',
                          border: isSelected ? '1px solid #d97706' : '1px solid #e6dfd5',
                          backgroundColor: isSelected ? '#d97706' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#453227',
                          transition: 'all 0.2s',
                        }}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: '#9f7a5f' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#453227',
                    border: '1px solid #e6dfd5',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: '#9f7a5f' }}>
                  PHONE NUMBER
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e6dfd5', borderRadius: '12px', height: '56px', overflow: 'hidden' }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{
                      height: '100%',
                      padding: '0 16px',
                      backgroundColor: '#f5eae0',
                      border: 'none',
                      borderRight: '1px solid #e6dfd5',
                      fontWeight: '700',
                      fontSize: '15px',
                      color: '#453227',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    style={{
                      flex: 1,
                      height: '100%',
                      padding: '0 16px',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#453227',
                      border: 'none',
                      outline: 'none',
                    }}
                  />
                </div>
                <p className="text-xs mt-1.5" style={{ color: '#9f7a5f' }}>
                  Select your country prefix (e.g. <strong>+60</strong> for Malaysia)
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: '#9f7a5f' }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#453227',
                    border: '1px solid #e6dfd5',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: '#9f7a5f' }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#453227',
                    border: '1px solid #e6dfd5',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: '#9f7a5f' }}>
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#453227',
                    border: '1px solid #e6dfd5',
                    borderRadius: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: '#d97706',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px',
                  marginBottom: '8px',
                }}
              >
                Create Account
              </button>

            </form>

            {/* Login Link */}
            <div className="text-center mt-6 text-sm" style={{ color: '#7c6251' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: '#d97706', fontWeight: '700', textDecoration: 'none' }} className="hover:underline">
                Login
              </a>
            </div>

          </div>

          <footer style={{ textAlign: 'center', fontSize: '11px', color: '#9f7a5f', marginTop: '24px', lineHeight: '1.5' }}>
            System owned & rented by Bright Light Technology Services<br />
            (Co. Reg. 201903248994)
          </footer>

        </div>
      </div>
    </div>
  );
}