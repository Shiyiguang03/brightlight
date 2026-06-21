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
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Function to load user from localStorage
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Load user on first mount
    loadUser();

    // Listen for profile picture update from Profile page
    const handleProfileUpdate = () => {
      loadUser();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path: string) => pathname === path;

  // ✅ Bulletproof Avatar sizing using strict inline styles
  const Avatar = () => {
    if (user?.profileImage) {
      return (
        <img 
          src={user.profileImage} 
          alt="Profile" 
          style={{ 
            width: '36px', 
            height: '36px', 
            minWidth: '36px', 
            minHeight: '36px',
            objectFit: 'cover' 
          }}
          className="rounded-full border border-[#e6dfd5]" 
        />
      );
    }
    
    // Fallback to first letter of full name, email, or 'U'
    const firstLetter = user?.fullName?.[0] || user?.email?.[0] || 'U';
    return (
      <div 
        style={{ 
          width: '36px', 
          height: '36px', 
          minWidth: '36px', 
          minHeight: '36px' 
        }}
        className="rounded-full bg-[#fef3c7] flex items-center justify-center text-[#d97706] font-bold text-sm border border-[#e6dfd5]"
      >
        {firstLetter.toUpperCase()}
      </div>
    );
  };

  // ✅ Get the best display name (First name, or beginning of email)
  const displayName = user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  return (
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e6dfd5' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo + Links */}
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
            
            {/* Live Agent */}
            <a 
              href="https://wa.me/60123456789" 
              target="_blank"
              className="hidden md:flex items-center gap-x-2 px-4 py-2 text-sm font-medium rounded-xl transition hover:opacity-90"
              style={{ color: '#b45309', backgroundColor: '#fef3c7' }}
            >
              Live Agent
            </a>

            {/* User Profile - Desktop: Picture + Name | Mobile: Picture only */}
            {user && (
              <Link 
                href="/profile" 
                className="flex items-center gap-x-2 px-2 py-1 rounded-xl hover:bg-stone-100 transition"
              >
                <Avatar />
                
                {/* Username only on desktop (hidden on mobile, block on md+) */}
                <span className="hidden md:block text-sm font-medium" style={{ color: '#453227' }}>
                  {displayName}
                </span>
              </Link>
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

                  {user && (
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-stone-50"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}