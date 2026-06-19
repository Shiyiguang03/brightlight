'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function RequestRepairPage() {
  const [formData, setFormData] = useState({
    deviceType: 'Laptop',
    brand: '',
    model: '',
    serialNumber: '',
    problemDescription: '',
    deviceImages: [] as File[],
    password: '',
    hasCharger: false,
    hasPowerCord: false,
    hasMouse: false,
    hasBag: false,
    hasOther: false,
    otherItems: '',
    preferredStartDate: '',
    preferredEndDate: '',
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Set default dates (Today + 7 days)
  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      preferredStartDate: formatDate(today),
      preferredEndDate: formatDate(nextWeek),
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDeviceSelect = (type: string) => {
    setFormData(prev => ({ ...prev, deviceType: type }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, deviceImages: selectedFiles }));

      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  // Remove image function
  const removeImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    const newImages = formData.deviceImages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, deviceImages: newImages }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    alert('Please login first to submit a repair request.');
    window.location.href = '/login';
    return;
  }

  const user = JSON.parse(storedUser);

  const formDataToSend = new FormData();
  formDataToSend.append('userId', user.id.toString());
  formDataToSend.append('deviceType', formData.deviceType);
  formDataToSend.append('brand', formData.brand);
  formDataToSend.append('model', formData.model);
  formDataToSend.append('serialNumber', formData.serialNumber || '');
  formDataToSend.append('problemDescription', formData.problemDescription);
  formDataToSend.append('password', formData.password || '');
  formDataToSend.append('hasCharger', formData.hasCharger.toString());
  formDataToSend.append('hasPowerCord', formData.hasPowerCord.toString());
  formDataToSend.append('hasMouse', formData.hasMouse.toString());
  formDataToSend.append('hasBag', formData.hasBag.toString());
  formDataToSend.append('hasOther', formData.hasOther.toString());
  formDataToSend.append('otherItems', formData.otherItems || '');
  formDataToSend.append('preferredStartDate', formData.preferredStartDate || '');
  formDataToSend.append('preferredEndDate', formData.preferredEndDate || '');

  formData.deviceImages.forEach((file) => {
    formDataToSend.append('deviceImages', file);
  });

  try {
    const response = await fetch('/api/request-repair', {
      method: 'POST',
      body: formDataToSend,
    });

    // ✅ Better error handling
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend Error:', errorText);
      alert('Failed to submit request. Check console for details.');
      return;
    }

    const data = await response.json();

    alert('Repair request submitted successfully!');
    window.location.href = '/my-repairs';

  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-slate-50" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <div className="py-12 px-4" style={{ padding: '48px 16px' }}>
        <div className="max-w-3xl mx-auto" style={{ width: '100%', maxWidth: '768px', margin: '0 auto' }}>
          
          <div className="text-center mb-10" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className="text-3xl font-bold text-slate-900" style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0' }}>
              Request Repair
            </h1>
            <p className="text-slate-500 mt-2" style={{ fontSize: '15px', color: '#64748b', marginTop: '8px', margin: '8px 0 0 0' }}>
              Fill in the details below and we’ll get back to you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8"
            style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', boxSizing: 'border-box' }}>

            {/* Device Information */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 16px 0' }}>
                Device Information
              </h2>

              {/* Device Type Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '10px', letterSpacing: '0.05em' }}>
                  SELECT DEVICE TYPE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {/* Laptop */}
                  <button type="button" onClick={() => handleDeviceSelect('Laptop')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.deviceType === 'Laptop' ? '#f0f7ff' : '#ffffff', border: formData.deviceType === 'Laptop' ? '2px solid #2563eb' : '1px solid #cbd5e1', color: formData.deviceType === 'Laptop' ? '#2563eb' : '#475569' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '32px', height: '32px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>Laptop</span>
                  </button>

                  {/* PC/Desktop */}
                  <button type="button" onClick={() => handleDeviceSelect('PC/Desktop')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.deviceType === 'PC/Desktop' ? '#f0f7ff' : '#ffffff', border: formData.deviceType === 'PC/Desktop' ? '2px solid #2563eb' : '1px solid #cbd5e1', color: formData.deviceType === 'PC/Desktop' ? '#2563eb' : '#475569' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '32px', height: '32px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h14.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>PC / Desktop</span>
                  </button>

                  {/* Others */}
                  <button type="button" onClick={() => handleDeviceSelect('Others')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.deviceType === 'Others' ? '#f0f7ff' : '#ffffff', border: formData.deviceType === 'Others' ? '2px solid #2563eb' : '1px solid #cbd5e1', color: formData.deviceType === 'Others' ? '#2563eb' : '#475569' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '32px', height: '32px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.68-.69-1.25-1.59-1.59-2.61m6.49 2.61c.68-.69 1.25-1.59 1.59-2.61m-8.08 0a7.5 7.5 0 0 1 14.98 0M4.5 12a7.5 7.5 0 0 0 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-.513 1.41.513M5.106 17.785l1.15-.827m11.479.827-1.149-.827M8.14 21.27l.707-1.03m6.308 1.03-.707-1.03M12 3v1.5" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: '700' }}>Others</span>
                  </button>
                </div>
              </div>

              {/* Brand, Model, Serial */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>BRAND</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Dell, HP, Lenovo" style={{ width: '100%', height: '52px', padding: '0 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>MODEL</label>
                  <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="e.g. XPS 13" style={{ width: '100%', height: '52px', padding: '0 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>SERIAL NUMBER (OPTIONAL)</label>
                  <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} placeholder="Enter your system serial designation number" style={{ width: '100%', height: '52px', padding: '0 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>PROBLEM DESCRIPTION</label>
              <textarea name="problemDescription" value={formData.problemDescription} onChange={handleChange} rows={4} placeholder="Describe the issue you're facing in detail..." style={{ width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} required />
            </div>

            {/* Image Upload with Remove Button */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                DEVICE IMAGES / DAMAGE PHOTOS (OPTIONAL)
              </label>
              <div style={{ position: 'relative', minHeight: '120px', border: '2px dashed #cbd5e1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '24px', cursor: 'pointer', boxSizing: 'border-box' }}>
                {imagePreviews.length === 0 && (
                  <>
                    <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0', fontWeight: '600' }}>Drag & drop your images here</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>(PNG, JPG, up to 10MB)</p>
                  </>
                )}

                {imagePreviews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', width: '100%' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img src={preview} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input type="file" name="deviceImages" onChange={handleImageChange} multiple accept="image/png, image/jpeg" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', opacity: '0', cursor: 'pointer' }} />
              </div>
            </div>

            {/* Device Password */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>DEVICE PASSWORD (IF ANY)</label>
              <input type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank if you prefer not to provide" style={{ width: '100%', height: '52px', padding: '0 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* Accessories with Other */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '10px', letterSpacing: '0.05em' }}>
                ACCESSORIES INCLUDED
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="grid grid-cols-2 md:grid-cols-4">
                {[
                  { label: 'Charger', name: 'hasCharger' },
                  { label: 'Power Cord', name: 'hasPowerCord' },
                  { label: 'Mouse', name: 'hasMouse' },
                  { label: 'Bag', name: 'hasBag' },
                  { label: 'Other', name: 'hasOther' },
                ].map((item) => {
                  const isChecked = formData[item.name as keyof typeof formData] as boolean;
                  return (
                    <label key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', border: isChecked ? '1px solid #2563eb' : '1px solid #e2e8f0', backgroundColor: isChecked ? '#f0f7ff' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s', boxSizing: 'border-box' }}>
                      <input type="checkbox" name={item.name} checked={isChecked} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: isChecked ? '#2563eb' : '#334155' }}>{item.label}</span>
                    </label>
                  );
                })}
              </div>

              {formData.hasOther && (
                <div style={{ marginTop: '12px' }}>
                  <input type="text" name="otherItems" value={formData.otherItems} onChange={handleChange} placeholder="Please specify other accessories..." style={{ width: '100%', height: '52px', padding: '0 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              )}
            </div>

            {/* Preferred Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid grid-cols-1 md:grid-cols-2">
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                  PREFERRED START DATE (OPTIONAL)
                </label>
                <input type="date" name="preferredStartDate" value={formData.preferredStartDate} onChange={handleChange} style={{ width: '100%', height: '52px', padding: '0 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                  PREFERRED END DATE (OPTIONAL)
                </label>
                <input type="date" name="preferredEndDate" value={formData.preferredEndDate} onChange={handleChange} style={{ width: '100%', height: '52px', padding: '0 16px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#0f172a', backgroundColor: '#ffffff', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" style={{ width: '100%', height: '56px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '14px', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '12px', boxSizing: 'border-box' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} >
              Submit Repair Request
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', margin: '0', lineHeight: '1.5' }}>
              Our dedicated response team will reach out to you within 24 hours after request submission.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}