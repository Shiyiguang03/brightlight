'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar'; // Connects the global customizable navigation menu list

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

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#fcfbf7', color: '#453227' }}>
      
      {/* Universal Shared Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #2e1f15 0%, #451a03 50%, #78350f 100%)' }} className="text-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-x-2 px-4 py-1.5 rounded-full text-sm mb-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' }}>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="font-medium" style={{ color: '#fef3c7' }}>Trusted by 500+ customers in northern Peninsular Malaysia especially in Penang</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
            Computer(Desktop/Laptop). & Peripheral's Repairs<br />
            <span style={{ color: '#fde68a' }}>Done Right. Tracked Live.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl mb-10" style={{ color: '#f5eae0' }}>
            Book a repair in 2 minutes. Choose self drop-off or we pickup.<br />
            Watch real-time progress. Pay only when you're happy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
              className="inline-flex items-center justify-center gap-x-3 text-white font-bold px-8 py-4 rounded-2xl text-lg transition shadow-xl"
              style={{ backgroundColor: '#d97706' }}
            >
              Request Repair Now
            </button>

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
              className="inline-flex items-center justify-center gap-x-3 border font-bold px-8 py-4 rounded-2xl text-lg transition hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
            >
              Track My Repair
            </button>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <div className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl border p-8 grid grid-cols-2 md:grid-cols-4 gap-y-8" style={{ borderColor: '#e6dfd5' }}>
          <div className="text-center">
            <div className="text-4xl font-extrabold" style={{ color: '#453227' }}>1,248</div>
            <div className="text-sm font-medium mt-1" style={{ color: '#7c6251' }}>Devices Repaired</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold" style={{ color: '#453227' }}>4.96</div>
            <div className="text-sm font-medium mt-1" style={{ color: '#7c6251' }}>Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold" style={{ color: '#453227' }}>98%</div>
            <div className="text-sm font-medium mt-1" style={{ color: '#7c6251' }}>Fixed on First Visit</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold" style={{ color: '#453227' }}>2hrs</div>
            <div className="text-sm font-medium mt-1" style={{ color: '#7c6251' }}>Average Diagnosis Time</div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <section id="how" className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-12">
          <span className="font-bold tracking-wider text-sm" style={{ color: '#b45309' }}>SIMPLE PROCESS</span>
          <h2 className="text-4xl font-bold tracking-tight mt-3" style={{ color: '#453227' }}>How Bright Light Works</h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {[
            { step: "1", title: "Submit Request", desc: "Tell us about your device and issue. Takes less than 2 minutes." },
            { step: "2", title: "Pickup or Drop-off", desc: "Choose self drop-off at our center or let us collect it from you." },
            { step: "3", title: "Diagnosis & Quote", desc: "We diagnose within 1 working day and send you a transparent quote." },
            { step: "4", title: "Live Progress Tracking", desc: "Watch every status update in real-time." },
            { step: "5", title: "Pay & Collect", desc: "Pay securely when repair is done. We deliver back or you pick up." },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border hover:shadow-lg transition" style={{ borderColor: '#e6dfd5' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 font-black text-2xl" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
                {item.step}
              </div>
              <h4 className="font-bold text-xl mb-2" style={{ color: '#453227' }}>{item.title}</h4>
              <p className="text-sm" style={{ color: '#6b5446' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white py-16 border-y" style={{ borderColor: '#e6dfd5' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="font-bold text-sm" style={{ color: '#b45309' }}>WHAT WE FIX</span>
              <h2 className="text-4xl font-bold tracking-tight" style={{ color: '#453227' }}>Popular Repair Services</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "Screen Replacement", "Battery Replacement", "Motherboard Repair",
              "Virus & Malware", "Data Recovery", "RAM / Storage Upgrade"
            ].map((service, index) => (
              <div key={index} className="transition p-5 rounded-2xl border" style={{ backgroundColor: '#fcfbf7', borderColor: '#e6dfd5' }}>
                <div className="font-bold" style={{ color: '#453227' }}>{service}</div>
                <div className="text-xs mt-1" style={{ color: '#7c6251' }}>Laptop & Desktop</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section id="delivery" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <span className="font-bold" style={{ color: '#b45309' }}>FLEXIBLE OPTIONS</span>
          <h2 className="text-4xl font-bold tracking-tight mt-2" style={{ color: '#453227' }}>How do you want to send your device?</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-3xl p-8 bg-white" style={{ borderColor: '#e6dfd5' }}>
            <div className="font-bold text-2xl mb-2" style={{ color: '#453227' }}>Self Drop-off</div>
            <div className="text-emerald-700 font-bold mb-4">FREE</div>
            <ul className="space-y-2 text-sm font-medium" style={{ color: '#6b5446' }}>
              <li>✓ Drop at our center</li>
              <li>✓ Same-day diagnosis available</li>
              <li>✓ Best for urgent repairs</li>
            </ul>
          </div>

          <div className="border-2 bg-white rounded-3xl p-8 relative shadow-sm" style={{ borderColor: '#d97706' }}>
            <div className="absolute -top-3 right-6 text-white text-xs font-bold px-4 py-1 rounded-full" style={{ backgroundColor: '#d97706' }}>POPULAR</div>
            <div className="font-bold text-2xl mb-2" style={{ color: '#453227' }}>We Pickup & Deliver</div>
            <div className="font-bold mb-4" style={{ color: '#b45309' }}>RM30 onwards</div>
            <ul className="space-y-2 text-sm font-medium" style={{ color: '#6b5446' }}>
              <li>✓ We come to you</li>
              <li>✓ Real-time tracking</li>
              <li>✓ Most convenient option</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div style={{ backgroundColor: '#1f130b' }} className="text-white py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">Ready to get your device fixed?</h2>
          <p className="mb-8" style={{ color: '#d9c8bc' }}>Join hundreds of happy customers who track their repair in real time.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="px-10 py-4 bg-white font-bold rounded-2xl text-lg hover:bg-amber-50 transition" style={{ color: '#1f130b' }}>Create Free Account</a>
            <a href="/login" className="px-10 py-4 border hover:bg-white/5 font-bold rounded-2xl text-lg transition" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>Login</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-10" style={{ borderColor: '#e6dfd5' }}>
        <div className="max-w-6xl mx-auto px-6 text-sm flex flex-col md:flex-row justify-between gap-y-4" style={{ color: '#7c6251' }}>
          <div>© 2026 Bright Light Repair. All rights reserved.</div>
          <div className="flex gap-x-6">
            <a href="#" className="hover:text-stone-900">Privacy</a>
            <a href="#" className="hover:text-stone-900">Terms</a>
            <a href="https://wa.me/60123456789" target="_blank" style={{ color: '#b45309' }}>WhatsApp Support</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/60123456789?text=Hi%20Bright%20Light%2C%20I%20need%20help%20with%20my%20laptop" 
        target="_blank"
        className="fixed bottom-6 right-6 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-50 text-3xl"
        style={{ backgroundColor: '#d97706' }}
      >
        💬
      </a>
    </div>
  );
}