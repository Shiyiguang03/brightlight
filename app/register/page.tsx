'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';

const countries = [
  { code: '+60', name: 'Malaysia' },
  { code: '+65', name: 'Singapore' },
  { code: '+62', name: 'Indonesia' },
  { code: '+1', name: 'United States' },
];

export default function RegisterPage() {
  const [countryCode, setCountryCode] = useState('+60');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [modalMessage, setModalMessage] = useState('');

  const showMessage = (message: string, type: 'success' | 'error' = 'error') => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !password || !confirmPassword) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

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
          role: 'CUSTOMER',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Account created successfully!', 'success');

        // Redirect to login after showing success
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        showMessage(data.message || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showMessage('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
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
                  marginTop: '10px',
                  marginBottom: '8px',
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
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

      {/* ==================== NICE MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl" style={{ border: '1px solid #e6dfd5' }}>

            <div className="text-center">
              {/* Icon */}
              <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 
                ${modalType === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className="text-3xl">
                  {modalType === 'success' ? '✅' : '⚠️'}
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
                {modalType === 'success' ? 'Continue to Login' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}