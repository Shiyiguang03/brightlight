'use client';

import React, { useState, useEffect } from 'react';

export default function BrightLightHome() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar - Updated with Login State */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-x-3">
              <img 
                src="/images/logo.jpg" 
                alt="Bright Light Logo" 
                className="h-10 w-auto object-contain" 
              />
              <div>
                <span className="font-bold text-2xl text-slate-900">Bright</span>
                <span className="text-blue-600 font-bold text-2xl">Light</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-x-8 text-sm font-medium">
              <a href="#how" className="text-slate-600 hover:text-slate-900 transition">How it Works</a>
              <a href="#services" className="text-slate-600 hover:text-slate-900 transition">Services</a>
              <a href="#delivery" className="text-slate-600 hover:text-slate-900 transition">Delivery Options</a>
            </div>

            <div className="flex items-center gap-x-3">
              <a 
                href="https://wa.me/60123456789" 
                target="_blank"
                className="hidden md:flex items-center gap-x-2 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-xl transition"
              >
                Chat on WhatsApp
              </a>
              
              {userName ? (
                // Show when logged in
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
                // Show when not logged in
                <>
                  <a href="/login" className="px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition">
                    Login
                  </a>
                  <a href="/register" className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm">
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-x-2 bg-white/20 px-4 py-1.5 rounded-full text-sm mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">Trusted by 500+ customers in Pahang & KL</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
            Laptop & Computer Repair.<br />
            <span className="text-blue-200">Done Right. Tracked Live.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-blue-100 mb-10">
            Book a repair in 2 minutes. Choose self drop-off or we pickup.<br />
            Watch real-time progress. Pay only when you're happy.
          </p>

<div className="flex flex-col sm:flex-row gap-4 justify-center">
  
  {/* Request Repair Now - Requires Login */}
  <button 
    onClick={() => {
      const user = localStorage.getItem('user');
      if (user) {
        window.location.href = '/request-repair';
      } else {
        alert('Please login first to submit a repair request.');
        window.location.href = '/login';
      }
    }}
    className="inline-flex items-center justify-center gap-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition shadow-xl"
  >
    Request Repair Now
  </button>

  {/* Track My Repair - Requires Login */}
  <button 
    onClick={() => {
      const user = localStorage.getItem('user');
      if (user) {
        window.location.href = '/my-repairs';
      } else {
        alert('Please login first to track your repairs.');
        window.location.href = '/login';
      }
    }}
    className="inline-flex items-center justify-center gap-x-3 border border-white/70 hover:bg-white/10 font-semibold px-8 py-4 rounded-2xl text-lg transition"
  >
    Track My Repair
  </button>

</div>
        </div>
      </section>

      {/* Trust Stats */}
      <div className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl border p-8 grid grid-cols-2 md:grid-cols-4 gap-y-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900">1,248</div>
            <div className="text-slate-600 text-sm mt-1">Devices Repaired</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900">4.96</div>
            <div className="text-slate-600 text-sm mt-1">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900">98%</div>
            <div className="text-slate-600 text-sm mt-1">Fixed on First Visit</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900">2hrs</div>
            <div className="text-slate-600 text-sm mt-1">Average Diagnosis Time</div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <section id="how" className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold tracking-wider text-sm">SIMPLE PROCESS</span>
          <h2 className="text-4xl font-bold tracking-tight mt-3 text-slate-900">How Bright Light Works</h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {[
            { step: "1", title: "Submit Request", desc: "Tell us about your device and issue. Takes less than 2 minutes." },
            { step: "2", title: "Pickup or Drop-off", desc: "Choose self drop-off at our center or let us collect it from you." },
            { step: "3", title: "Diagnosis & Quote", desc: "We diagnose within hours and send you a transparent quote." },
            { step: "4", title: "Live Progress Tracking", desc: "Watch every status update in real-time." },
            { step: "5", title: "Pay & Collect", desc: "Pay securely when repair is done. We deliver back or you pick up." },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-5 font-bold text-2xl">
                {item.step}
              </div>
              <h4 className="font-semibold text-xl mb-2 text-slate-900">{item.title}</h4>
              <p className="text-slate-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white py-16 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-blue-600 font-semibold text-sm">WHAT WE FIX</span>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">Popular Repair Services</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Screen Replacement", "Battery Replacement", "Motherboard Repair",
              "Virus & Malware", "Data Recovery", "RAM / Storage Upgrade"
            ].map((service, index) => (
              <div key={index} className="bg-slate-50 hover:bg-slate-100 transition p-5 rounded-2xl border">
                <div className="font-semibold text-slate-900">{service}</div>
                <div className="text-xs text-slate-600 mt-1">Laptop & Desktop</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section id="delivery" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <span className="text-blue-600 font-semibold">FLEXIBLE OPTIONS</span>
          <h2 className="text-4xl font-bold tracking-tight mt-2 text-slate-900">How do you want to send your device?</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-3xl p-8">
            <div className="font-bold text-2xl mb-2 text-slate-900">Self Drop-off</div>
            <div className="text-emerald-600 font-medium mb-4">FREE</div>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li>✓ Drop at our center</li>
              <li>✓ Same-day diagnosis available</li>
              <li>✓ Best for urgent repairs</li>
            </ul>
          </div>

          <div className="border-2 border-blue-600 rounded-3xl p-8 relative">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">POPULAR</div>
            <div className="font-bold text-2xl mb-2 text-slate-900">We Pickup & Deliver</div>
            <div className="text-blue-600 font-medium mb-4">RM15–35 (depending on area)</div>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li>✓ We come to your home/office</li>
              <li>✓ Real-time tracking</li>
              <li>✓ Most convenient option</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="bg-slate-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">Ready to get your device fixed?</h2>
          <p className="text-slate-300 mb-8">Join hundreds of happy customers who track their repair in real time.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="px-10 py-4 bg-white text-slate-900 font-semibold rounded-2xl text-lg hover:bg-slate-100 transition">Create Free Account</a>
            <a href="/login" className="px-10 py-4 border border-white/40 hover:bg-white/5 font-semibold rounded-2xl text-lg transition">Login</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-10">
        <div className="max-w-6xl mx-auto px-6 text-sm text-slate-600 flex flex-col md:flex-row justify-between gap-y-4">
          <div>© 2026 Bright Light Repair. All rights reserved.</div>
          <div className="flex gap-x-6">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="https://wa.me/60123456789" target="_blank" className="hover:text-green-600">WhatsApp Support</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/60123456789?text=Hi%20Bright%20Light%2C%20I%20need%20help%20with%20my%20laptop" 
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-50 text-3xl"
      >
        💬
      </a>
    </div>
  );
}