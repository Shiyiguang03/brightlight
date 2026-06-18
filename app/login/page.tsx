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

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');
  const [countryCode, setCountryCode] = useState('+60');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      alert('Please enter Email/Phone and Password');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user info for Navbar
        localStorage.setItem('user', JSON.stringify(data.user));

        alert(`Welcome back, ${data.user.fullName}!`);
        window.location.href = '/'; // Go to Home page
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="w-full max-w-md" style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Main Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 w-full" style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', width: '100%', boxSizing: 'border-box' }}>
          
        {/* Unified Header Wrapper (Keeps them on the same line) */}
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  width: '100%', 
  marginBottom: '28px',
  boxSizing: 'border-box'
}}>
  
  {/* Professional Back Button */}
  <a 
    href="/" 
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      fontWeight: '700',
      color: '#475569',
      textDecoration: 'none',
      padding: '8px 14px',
      borderRadius: '10px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f1f5f9';
      e.currentTarget.style.color = '#0f172a';
      e.currentTarget.style.borderColor = '#cbd5e1';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#f8fafc';
      e.currentTarget.style.color = '#475569';
      e.currentTarget.style.borderColor = '#e2e8f0';
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '14px', height: '14px' }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    <span>Back to Home</span>
  </a>

  {/* Logo (Naturally aligned on the same row) */}
  <img
    src="/images/logo.jpg"
    alt="Logo"
    style={{ 
      height: '44px', 
      objectFit: 'contain', 
      margin: '0' 
    }}
  />

  {/* Hidden spacer to keep the logo perfectly balanced */}
  <div style={{ width: '115px', display: 'block' }} className="hidden sm:block"></div>
  
</div>

          {/* Header */}
          <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900" style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0' }}>
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 mt-1" style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', margin: '4px 0 0 0' }}>
              Sign in to Bright Light Technology Services
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6" style={{ marginBottom: '24px' }}>
            <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-3" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.05em' }}>
              I AM LOGGING IN AS...
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

          <form onSubmit={handleLogin}>

            {/* Email or Phone with Country Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2" style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px' }}>
                EMAIL OR PHONE NUMBER
              </label>

              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', height: '56px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
                
                {/* Country Code Dropdown */}
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{ height: '100%', padding: '0 14px', backgroundColor: '#f8fafc', border: 'none', borderRight: '1px solid #cbd5e1', fontWeight: '700', fontSize: '15px', color: '#334155', outline: 'none', cursor: 'pointer' }}
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or phone number"
                  style={{ flex: 1, height: '100%', padding: '0 16px', fontSize: '16px', fontWeight: '500', color: '#0f172a', border: 'none', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
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

            {/* Login Button */}
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
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                marginBottom: '24px',
              }}
            >
              Login
            </button>

          </form>

          {/* OR Divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: '20px 0', boxSizing: 'border-box' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ padding: '0 16px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.1em', backgroundColor: '#ffffff', userSelect: 'none' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {/* Google Button */}
          <button 
            type="button"
            onClick={() => alert('Google login will be added later')}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginBottom: '24px',
              boxSizing: 'border-box',
            }}
          >
            <svg style={{ width: '20px', height: '20px', minWidth: '20px' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign Up Link */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', margin: '0' }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }} className="hover:underline">
              Sign Up
            </a>
          </p>

        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '24px', lineHeight: '1.5' }}>
          System owned & rented by Bright Light Technology Services
          <span style={{ display: 'block', color: '#cbd5e1', marginTop: '2px' }}>(Co. Reg. 201903248994)</span>
        </footer>

      </div>
    </div>
  );
}