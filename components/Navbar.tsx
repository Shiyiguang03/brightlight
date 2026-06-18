'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.fullName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo + Brand (Same as Home Page) */}
          <Link href="/" className="flex items-center gap-x-3">
            <img 
              src="/images/logo.jpg" 
              alt="Bright Light Logo" 
              className="h-10 w-auto object-contain" 
            />
            <div>
              <span className="font-bold text-2xl text-slate-900">Bright</span>
              <span className="text-blue-600 font-bold text-2xl">Light</span>
            </div>
          </Link>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-x-4">
            {userName ? (
              // Logged in
              <div className="flex items-center gap-x-4">
                <span className="text-sm font-medium text-slate-700">
                  Hi, {userName.split(' ')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in
              <Link 
                href="/login" 
                className="px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}