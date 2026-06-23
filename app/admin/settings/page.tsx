import AdminLayout from '@/components/AdminLayout';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>Settings</h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>Manage system settings and staff privileges.</p>

        <div className="bg-white border rounded-2xl p-8" style={{ borderColor: '#e6dfd5' }}>
          <p className="text-center text-lg" style={{ color: '#9f7a5f' }}>
            Settings page is under development.
          </p>
          <p className="text-center text-sm mt-2" style={{ color: '#7c6251' }}>
            You will be able to manage staff privileges here in the future.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}