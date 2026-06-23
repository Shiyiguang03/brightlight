'use client';

import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function ViewSwitcher() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>
          Switch View
        </h1>
        <p className="mb-8" style={{ color: '#7c6251' }}>
          As Super Admin, you can preview different user interfaces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Super Admin View */}
          <Link 
            href="/admin/dashboard" 
            className="block p-6 bg-white border rounded-2xl hover:shadow-md transition"
            style={{ borderColor: '#e6dfd5' }}
          >
            <div className="flex items-center gap-x-4">
              <div className="text-3xl">🛡️</div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#453227' }}>Super Admin View</h3>
                <p className="text-sm" style={{ color: '#7c6251' }}>Full control panel with all management tools</p>
              </div>
            </div>
          </Link>

          {/* Staff View */}
          <Link 
            href="/staff" 
            className="block p-6 bg-white border rounded-2xl hover:shadow-md transition"
            style={{ borderColor: '#e6dfd5' }}
          >
            <div className="flex items-center gap-x-4">
              <div className="text-3xl">🛠️</div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#453227' }}>Staff View</h3>
                <p className="text-sm" style={{ color: '#7c6251' }}>Manage repair requests and update status</p>
              </div>
            </div>
          </Link>

          {/* Future: Agent View (placeholder for now) */}
          <div className="block p-6 bg-white border rounded-2xl opacity-60 cursor-not-allowed" style={{ borderColor: '#e6dfd5' }}>
            <div className="flex items-center gap-x-4">
              <div className="text-3xl">🎧</div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#453227' }}>Agent View</h3>
                <p className="text-sm" style={{ color: '#7c6251' }}>Coming soon...</p>
              </div>
            </div>
          </div>

          {/* Future: Manager View */}
          <div className="block p-6 bg-white border rounded-2xl opacity-60 cursor-not-allowed" style={{ borderColor: '#e6dfd5' }}>
            <div className="flex items-center gap-x-4">
              <div className="text-3xl">📋</div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#453227' }}>Manager View</h3>
                <p className="text-sm" style={{ color: '#7c6251' }}>Coming soon...</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}