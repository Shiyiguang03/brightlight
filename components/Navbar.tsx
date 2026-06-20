'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const ALL_MENU_ITEMS = [
  { label: 'Home Page', href: '/' },
  { label: 'How it Works', href: '/#how' },
  { label: 'Services', href: '/#services' },
  { label: 'Delivery Options', href: '/#delivery' },
  { label: 'My Repairs Dashboard', href: '/my-repairs' },
  { label: 'Submit New Request', href: '/request-repair' },
];

const IMPORTANT_DESKTOP_LINKS = [
  { label: 'My Repairs', href: '/my-repairs' },
  { label: 'New Request', href: '/request-repair' },
];

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.fullName);
    }

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e6dfd5' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-x-6">
            <Link href="/" className="flex items-center gap-x-3 shrink-0">
              <img src="/images/logo.jpg" alt="Bright Light Logo" className="h-10 w-auto object-contain" />
              <div>
                <span style={{ color: '#453227' }} className="font-bold text-2xl">Bright</span>
                <span style={{ color: '#d97706' }} className="font-bold text-2xl">Light</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-x-6 text-sm font-medium">
              {IMPORTANT_DESKTOP_LINKS.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="transition hover:opacity-80"
                  style={{ color: isActive(item.href) ? '#d97706' : '#5c4436' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-x-4">
            
            <a 
              href="https://wa.me/60123456789" 
              target="_blank"
              className="hidden md:flex items-center gap-x-2 px-4 py-2 text-sm font-medium rounded-xl transition hover:opacity-90"
              style={{ color: '#b45309', backgroundColor: '#fef3c7' }}
            >
              Live Agent
            </a>

            {/* === CLICKABLE USERNAME (No Dropdown) === */}
            {userName ? (
              <div className="flex items-center gap-x-3">
                <Link 
                  href="/profile"
                  className="text-sm font-medium px-3 py-1.5 rounded-xl hover:bg-stone-100 transition"
                  style={{ color: '#453227' }}
                >
                  Hi, {userName.split(' ')[0]}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-x-2">
                <Link href="/login" style={{ color: '#453227' }} className="px-5 py-2 text-sm font-semibold hover:bg-stone-50 rounded-xl transition">
                  Login
                </Link>
                <Link href="/register" style={{ backgroundColor: '#d97706' }} className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl hover:opacity-90 transition shadow-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Menu Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-x-2 px-3 py-2 text-sm font-bold rounded-xl border transition hover:bg-stone-50"
                style={{ color: '#453227', borderColor: '#e6dfd5', backgroundColor: '#fdfbf7' }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ color: '#d97706' }}>
                  {isDropdownOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
                <span>Menu</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg border bg-white py-2 z-50" style={{ borderColor: '#e6dfd5' }}>
                  <div className="px-4 py-1 text-[10px] font-bold text-stone-400 tracking-wider uppercase border-b border-stone-100 pb-1.5 mb-1">
                    Navigation Menu
                  </div>
                  
                  {ALL_MENU_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold transition hover:bg-stone-50"
                      style={{ color: isActive(item.href) ? '#d97706' : '#5c4436' }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}