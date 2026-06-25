import AdminLayout from '@/components/AdminLayout';

export default function ActivityLogs() {
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>Activity Logs</h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>System activity history will appear here.</p>

        <div className="bg-white border rounded-2xl p-8 text-center" style={{ borderColor: '#e6dfd5' }}>
          <p className="text-lg" style={{ color: '#9f7a5f' }}>No activity logs yet.</p>
          <p className="text-sm mt-2" style={{ color: '#7c6251' }}>
            Activity logs will be recorded automatically as you and your team use the system.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
