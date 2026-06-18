'use client';

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

  // ✅ Updated handleRegister (Now actually works)
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
          phone: countryCode + phone,
          email: email || null,
          password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Account created successfully!');
        window.location.href = '/login'; // redirect to login
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-full max-w-md" style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Main Card Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 w-full" style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Logo */}
          <div className="flex justify-center mb-6" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <img
              src="/images/logo.jpg"
              alt="Logo"
              className="h-12 w-auto object-contain"
              style={{ height: '48px', objectFit: 'contain' }}
            />
          </div>

          {/* Header Typography */}
          <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900" style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0' }}>
              Create Account
            </h1>
            <p className="text-sm text-slate-500 mt-1" style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', margin: '4px 0 0 0' }}>
              Join Bright Light Technology Services
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Role Selection Grid */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-3" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.05em' }}>
                I AM A...
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
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
                        border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#2563eb' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#475569',
                        transition: 'all 0.2s',
                      }}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name Input Field */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>
                FULL NAME
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', height: '56px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  style={{ flex: 1, height: '100%', padding: '0 16px', fontSize: '16px', fontWeight: '500', color: '#0f172a', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Phone Number Field with Integrated Country Dropdown */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>
                PHONE NUMBER
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', height: '56px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{ height: '100%', padding: '0 16px', backgroundColor: '#f8fafc', border: 'none', borderRight: '1px solid #cbd5e1', fontWeight: '700', fontSize: '15px', color: '#334155', outline: 'none', cursor: 'pointer' }}
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
                  style={{ flex: 1, height: '100%', padding: '0 16px', fontSize: '16px', fontWeight: '500', color: '#0f172a', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                Select your country prefix (e.g., <strong>+60</strong> for Malaysia).
              </p>
            </div>

            {/* Email Address Input Field */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>
                EMAIL ADDRESS
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', height: '56px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ flex: 1, height: '100%', padding: '0 16px', fontSize: '16px', fontWeight: '500', color: '#0f172a', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>
                PASSWORD
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', height: '56px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ flex: 1, height: '100%', padding: '0 16px', fontSize: '16px', fontWeight: '500', color: '#0f172a', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Confirm Password Input Field */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>
                CONFIRM PASSWORD
              </label>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', height: '56px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ flex: 1, height: '100%', padding: '0 16px', fontSize: '16px', fontWeight: '500', color: '#0f172a', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Primary Form Submit Action Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                marginTop: '10px',
              }}
            >
              Create Account
            </button>

          </form>

          {/* Navigation Route Redirection */}
          <div className="text-center mt-6 text-sm text-slate-500" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
            Already have an account?{' '}
            <a
              href="/login"
              style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}
              className="hover:underline"
            >
              Login
            </a>
          </div>

        </div>

        {/* Corporate Legal Footer */}
        <footer style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '24px', lineHeight: '1.5' }}>
          System owned & rented by Bright Light Technology Services
          <span style={{ display: 'block', color: '#cbd5e1', marginTop: '2px' }}>(Co. Reg. 201903248994)</span>
        </footer>

      </div>
    </div>
  );
}