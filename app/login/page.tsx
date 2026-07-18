'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('error');
  const [modalMessage, setModalMessage] = useState('');

  const showMessage = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      showMessage('Please enter Email/Phone and Password', 'error');
      return;
    }

    setLoading(true);

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
        sessionStorage.setItem('user', JSON.stringify(data.user));
        showMessage(`Welcome back, ${data.user.fullName}!`, 'success');

        // Redirect after showing success message
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } else {
        showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
      }
    } catch (error) {
      console.error(error);
      showMessage("We couldn't reach the server. Please check your connection and try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#fcfbf7' }}>

        <div className="w-full max-w-md" style={{ width: '100%', maxWidth: '440px' }}>

          <div className="bg-white border rounded-3xl shadow-xl p-8 w-full" style={{ borderColor: '#e6dfd5' }}>

            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '28px'
            }}>
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#6b5446',
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#f5eae0',
                }}
              >
                ← Back to Home
              </a>

              <img src="/images/logo.jpg" alt="Logo" style={{ height: '44px', objectFit: 'contain' }} />
              <div style={{ width: '115px' }} className="hidden sm:block"></div>
            </div>

            {/* Header Text */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold" style={{ color: '#453227' }}>Welcome Back</h1>
              <p className="text-sm mt-1" style={{ color: '#7c6251' }}>
                Sign in to Bright Light Technology Services
              </p>
            </div>

            <form onSubmit={handleLogin}>

              {/* Email or Phone Number */}
              <div className="mb-4">
                <label className="block text-xs font-bold tracking-wider mb-2" style={{ color: '#9f7a5f' }}>
                  EMAIL OR PHONE NUMBER
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or phone number"
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 16px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#453227',
                    border: '1px solid #e6dfd5',
                    borderRadius: '12px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-6">
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
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '56px',
                  backgroundColor: loading ? '#9f7a5f' : '#d97706',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '24px',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

            </form>

            {/* OR Divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e6dfd5' }}></div>
              <span style={{ padding: '0 16px', fontSize: '12px', fontWeight: '700', color: '#9f7a5f' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e6dfd5' }}></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={() => showMessage('Google login will be added soon!', 'info')}
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: '#ffffff',
                border: '1px solid #e6dfd5',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                color: '#453227',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                marginBottom: '24px',
              }}
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#7c6251', margin: '0' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: '#d97706', fontWeight: '700', textDecoration: 'none' }} className="hover:underline">
                Sign Up
              </a>
            </p>

          </div>

          <footer style={{ textAlign: 'center', fontSize: '11px', color: '#9f7a5f', marginTop: '24px', lineHeight: '1.5' }}>
            System owned & rented by Bright Light Technology Services<br />
            (Co. Reg. 201903248994)
          </footer>

        </div>
      </div>

      {/* ==================== NICE MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl" style={{ border: '1px solid #e6dfd5' }}>

            <div className="text-center">
              {/* Icon */}
              <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 
                ${modalType === 'success' ? 'bg-green-100' : modalType === 'error' ? 'bg-red-100' : 'bg-[#fef3c7]'}`}>
                <span className="text-3xl">
                  {modalType === 'success' ? '✅' : modalType === 'error' ? '⚠️' : 'ℹ️'}
                </span>
              </div>

              {/* Message */}
              <p className="text-lg font-medium mb-6" style={{ color: '#453227' }}>
                {modalMessage}
              </p>

              {/* Button */}
              <button
                onClick={closeModal}
                className="w-full py-3.5 rounded-2xl font-bold text-lg transition hover:opacity-90"
                style={{
                  backgroundColor: modalType === 'success' ? '#16a34a' : '#d97706',
                  color: 'white'
                }}
              >
                {modalType === 'success' ? 'Continue' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}