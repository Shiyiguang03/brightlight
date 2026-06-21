'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { createClient } from '@supabase/supabase-js';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // ✅ Moved inside the component (fixes build + upload error)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfileImage(parsedUser.profileImage || null);
    }
  }, []);

  // Upload Profile Picture
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id || Date.now()}-${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file);

      if (error) {
        alert('Upload failed: ' + error.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      const updatedUser = { ...user, profileImage: imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setProfileImage(imageUrl);

      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Something went wrong while uploading.');
    }

    setUploading(false);
  };

  // Change Password (Simple localStorage version)
  const handleChangePassword = () => {
    setPasswordMessage('');

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    if (oldPassword !== user.password) {
      setPasswordMessage('Old password is incorrect.');
      return;
    }

    // Update password in localStorage
    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordMessage('Password changed successfully!');
  };

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <p>Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fcfbf7', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>Profile Settings</h1>
        <p className="mb-8" style={{ color: '#7c6251' }}>Manage your account and profile information</p>

        <div className="bg-white rounded-3xl border p-8 shadow-sm" style={{ borderColor: '#e6dfd5' }}>

          {/* Profile Picture */}
          <div className="mb-10">
            <h3 className="font-semibold mb-4" style={{ color: '#453227' }}>Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: '#e6dfd5' }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
                    {user.fullName?.[0] || 'U'}
                  </div>
                )}
              </div>

              <div>
                <label className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition hover:opacity-90"
                       style={{ backgroundColor: '#d97706', color: 'white' }}>
                  {uploading ? 'Uploading...' : 'Upload New Photo'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                </label>
                <p className="text-xs mt-2" style={{ color: '#9f7a5f' }}>JPG or PNG • Recommended size: 400x400</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-10">
            <h3 className="font-semibold mb-4" style={{ color: '#453227' }}>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>FULL NAME</p>
                <p className="mt-1 text-lg" style={{ color: '#453227' }}>{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>PHONE NUMBER</p>
                <p className="mt-1 text-lg" style={{ color: '#453227' }}>{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>EMAIL ADDRESS</p>
                <p className="mt-1 text-lg" style={{ color: '#453227' }}>{user.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>ACCOUNT TYPE</p>
                <p className="mt-1 text-lg capitalize" style={{ color: '#453227' }}>{user.role?.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#453227' }}>Change Password</h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-bold tracking-wider block mb-1" style={{ color: '#9f7a5f' }}>CURRENT PASSWORD</label>
                <input 
                  type="password" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm" 
                  style={{ borderColor: '#e6dfd5' }}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-wider block mb-1" style={{ color: '#9f7a5f' }}>NEW PASSWORD</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm" 
                  style={{ borderColor: '#e6dfd5' }}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-wider block mb-1" style={{ color: '#9f7a5f' }}>CONFIRM NEW PASSWORD</label>
                <input 
                  type="password" 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 text-sm" 
                  style={{ borderColor: '#e6dfd5' }}
                  placeholder="Confirm new password"
                />
              </div>

              {passwordMessage && (
                <p className={`text-sm ${passwordMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMessage}
                </p>
              )}

              <button 
                onClick={handleChangePassword}
                className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: '#d97706', color: 'white' }}
              >
                Update Password
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}