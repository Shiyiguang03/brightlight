'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { createClient } from '@supabase/supabase-js';

// ✅ Create Supabase client OUTSIDE the component (best practice)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Press & Hold password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfileImage(parsedUser.profileImage || null);
    }
  }, []);

  // ==================== Profile Picture Functions (UNCHANGED) ====================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id || Date.now()}-${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage.from('profile-pictures').upload(fileName, selectedFile);
      if (error) {
        alert('Upload failed: ' + error.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('profile-pictures').getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      const res = await fetch('/api/update-profile-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, imageUrl }),
      });

      if (!res.ok) {
        alert('Failed to save image');
        setUploading(false);
        return;
      }

      const updatedUser = { ...user, profileImage: imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setProfileImage(imageUrl);
      window.dispatchEvent(new Event('profile-updated'));

      setSelectedFile(null);
      setPreviewUrl(null);
      alert('Profile picture updated successfully!');
    } catch (err) {
      alert('Something went wrong');
    }
    setUploading(false);
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    await fetch('/api/update-profile-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, imageUrl: null }),
    });

    const updatedUser = { ...user, profileImage: null };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfileImage(null);
    window.dispatchEvent(new Event('profile-updated'));
  };

  // ==================== PROPER Change Password (Updated) ====================
  const handleChangePassword = async () => {
    setPasswordMessage('');

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordMessage('Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordMessage(data.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordMessage('Something went wrong. Please try again.');
    }
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

          {/* Profile Picture Section */}
          <div className="mb-10">
            <h3 className="font-semibold mb-4" style={{ color: '#453227' }}>Profile Picture</h3>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: '#e6dfd5' }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
                    {user.fullName?.[0] || 'U'}
                  </div>
                )}
              </div>

              <div className="flex-1">
                {!selectedFile ? (
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition hover:opacity-90"
                           style={{ backgroundColor: '#d97706', color: 'white' }}>
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                    {profileImage && (
                      <button onClick={handleRemovePhoto} className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition hover:bg-red-50"
                              style={{ borderColor: '#e6dfd5', color: '#b91c1c' }}>
                        Remove Photo
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleUploadPhoto} disabled={uploading}
                            className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 disabled:opacity-70"
                            style={{ backgroundColor: '#d97706', color: 'white' }}>
                      {uploading ? 'Saving...' : 'Save New Photo'}
                    </button>
                    <button onClick={handleCancelSelection} disabled={uploading}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition hover:bg-stone-50"
                            style={{ borderColor: '#e6dfd5', color: '#453227' }}>
                      Cancel
                    </button>
                  </div>
                )}
                <p className="text-xs mt-2" style={{ color: '#9f7a5f' }}>
                  JPG or PNG • Recommended size: 400x400
                </p>
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

          {/* Change Password Section */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#453227' }}>Change Password</h3>
            
            <div className="space-y-4 max-w-md">

              {/* Current Password */}
              <div>
                <label className="text-xs font-bold tracking-wider block mb-1" style={{ color: '#9f7a5f' }}>CURRENT PASSWORD</label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? "text" : "password"} 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm pr-12" 
                    style={{ borderColor: '#e6dfd5', color: '#453227', backgroundColor: '#ffffff' }}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowOldPassword(true)}
                    onMouseUp={() => setShowOldPassword(false)}
                    onMouseLeave={() => setShowOldPassword(false)}
                    onTouchStart={() => setShowOldPassword(true)}
                    onTouchEnd={() => setShowOldPassword(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#9f7a5f">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs font-bold tracking-wider block mb-1" style={{ color: '#9f7a5f' }}>NEW PASSWORD</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm pr-12" 
                    style={{ borderColor: '#e6dfd5', color: '#453227', backgroundColor: '#ffffff' }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowNewPassword(true)}
                    onMouseUp={() => setShowNewPassword(false)}
                    onMouseLeave={() => setShowNewPassword(false)}
                    onTouchStart={() => setShowNewPassword(true)}
                    onTouchEnd={() => setShowNewPassword(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#9f7a5f">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-xs font-bold tracking-wider block mb-1" style={{ color: '#9f7a5f' }}>CONFIRM NEW PASSWORD</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 text-sm pr-12" 
                    style={{ borderColor: '#e6dfd5', color: '#453227', backgroundColor: '#ffffff' }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onMouseDown={() => setShowConfirmPassword(true)}
                    onMouseUp={() => setShowConfirmPassword(false)}
                    onMouseLeave={() => setShowConfirmPassword(false)}
                    onTouchStart={() => setShowConfirmPassword(true)}
                    onTouchEnd={() => setShowConfirmPassword(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#9f7a5f">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {passwordMessage && (
                <p className={`text-sm font-medium ${passwordMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
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

export const dynamic = 'force-dynamic';