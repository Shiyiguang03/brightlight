'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function RequestRepairPage() {
  const [formData, setFormData] = useState({
    deviceType: 'Laptop',
    brand: '',
    otherBrand: '',
    model: '',
    otherModel: '',
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
    deliveryOption: 'dropoff',
    pickupAddress: '',
    termsAccepted: false,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [inputKey, setInputKey] = useState(Date.now());

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [modalMessage, setModalMessage] = useState('');

  const popularBrands = [
    'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI',
    'Microsoft', 'Samsung', 'LG', 'Razer', 'Huawei'
  ];

  const brandModels: Record<string, string[]> = {
    'Apple': ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac Mini'],
    'Dell': ['XPS 13', 'XPS 15', 'Inspiron', 'Latitude', 'G Series'],
    'HP': ['Pavilion', 'Envy', 'Spectre', 'EliteBook', 'ProBook', 'Omen'],
    'Lenovo': ['ThinkPad X1', 'ThinkPad T Series', 'IdeaPad', 'Legion', 'Yoga'],
    'ASUS': ['Zenbook', 'VivoBook', 'ROG Strix', 'TUF Gaming', 'ExpertBook'],
    'Acer': ['Aspire', 'Swift', 'Spin', 'Predator', 'Nitro'],
    'MSI': ['GF Series', 'GS Series', 'Stealth', 'Creator', 'Titan'],
    'Microsoft': ['Surface Laptop', 'Surface Pro', 'Surface Book'],
    'Samsung': ['Galaxy Book', 'Galaxy Book Pro'],
    'LG': ['Gram'],
    'Razer': ['Blade', 'Book'],
    'Huawei': ['MateBook'],
  };

  const getAvailableModels = () => {
    if (!formData.brand || formData.brand === 'Other') {
      return ['Other'];
    }
    const models = brandModels[formData.brand] || [];
    return [...models, 'Other'];
  };

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
      setFormData(prev => ({ ...prev, deviceImages: [...formData.deviceImages, ...selectedFiles] }));

      const previews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);

    const newImages = formData.deviceImages.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, deviceImages: newImages }));
    setInputKey(Date.now());
  };

  // Modal functions
  const showMessage = (message: string, type: 'success' | 'error') => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      showMessage('Please accept the Terms & Conditions to continue.', 'error');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      showMessage('Please login first to submit a repair request.', 'error');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    const user = JSON.parse(storedUser);
    const finalBrand = formData.brand === 'Other' ? formData.otherBrand : formData.brand;
    const finalModel = formData.model === 'Other' ? formData.otherModel : formData.model;

    const formDataToSend = new FormData();
    formDataToSend.append('userId', user.id.toString());
    formDataToSend.append('deviceType', formData.deviceType);
    formDataToSend.append('brand', finalBrand);
    formDataToSend.append('model', finalModel);
    formDataToSend.append('serialNumber', formData.serialNumber);
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
    formDataToSend.append('deliveryOption', formData.deliveryOption);
    formDataToSend.append('pickupAddress', formData.pickupAddress || '');

    formData.deviceImages.forEach((file) => {
      formDataToSend.append('deviceImages', file);
    });

    try {
      const response = await fetch('/api/request-repair', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend Error:', errorText);
        showMessage('Failed to submit request. Please try again.', 'error');
        return;
      }

      showMessage('Repair request submitted successfully!', 'success');

      setTimeout(() => {
        window.location.href = '/my-repairs';
      }, 1800);

    } catch (error) {
      console.error(error);
      showMessage('Something went wrong. Please try again.', 'error');
    }
  };

  const availableModels = getAvailableModels();
  const isFormValid = formData.serialNumber.trim() !== '' && formData.termsAccepted;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fcfbf7', color: '#453227' }}>
      <Navbar />

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>
              Request Repair
            </h1>
            <p className="mt-2" style={{ color: '#7c6251' }}>
              Fill in the details below and we’ll get back to you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white border rounded-3xl shadow-xl p-8" style={{ borderColor: '#e6dfd5' }}>

            {/* Device Information */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#453227' }}>Device Information</h2>

              {/* Device Type */}
              <div className="mb-6">
                <label className="block text-xs font-bold tracking-wider mb-3" style={{ color: '#7c6251' }}>
                  SELECT DEVICE TYPE
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Laptop', 'PC/Desktop', 'Others'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleDeviceSelect(type)}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition"
                      style={{
                        backgroundColor: formData.deviceType === type ? '#fef3c7' : '#ffffff',
                        borderColor: formData.deviceType === type ? '#d97706' : '#e6dfd5',
                        color: formData.deviceType === type ? '#b45309' : '#5c4436'
                      }}
                    >
                      <span className="font-semibold text-sm">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand + Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>BRAND</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 border rounded-xl text-sm"
                    style={{ borderColor: '#e6dfd5' }}
                  >
                    <option value="">Select Brand</option>
                    {popularBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {formData.brand === 'Other' && (
                    <input
                      type="text"
                      name="otherBrand"
                      value={formData.otherBrand}
                      onChange={handleChange}
                      placeholder="Please specify brand"
                      className="w-full h-12 px-4 border rounded-xl mt-2 text-sm"
                      style={{ borderColor: '#e6dfd5' }}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>MODEL</label>
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 border rounded-xl text-sm"
                    style={{ borderColor: '#e6dfd5' }}
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  {formData.model === 'Other' && (
                    <input
                      type="text"
                      name="otherModel"
                      value={formData.otherModel}
                      onChange={handleChange}
                      placeholder="Please specify model"
                      className="w-full h-12 px-4 border rounded-xl mt-2 text-sm"
                      style={{ borderColor: '#e6dfd5' }}
                    />
                  )}
                </div>
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-xs font-bold mb-2 flex items-center gap-2" style={{ color: '#6b5446' }}>
                  SERIAL NUMBER <span className="text-red-500">*</span>
                  <div className="group relative inline-block">
                    <span className="cursor-help text-[#d97706] font-bold text-base">ⓘ</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-72 p-4 bg-white border rounded-2xl shadow-xl text-xs z-50" style={{ borderColor: '#e6dfd5' }}>
                      <p className="font-semibold mb-2 text-[#453227]">How to find your Serial Number:</p>
                      <ul className="list-disc pl-4 space-y-1.5 text-[#5c4436]">
                        <li>Check the bottom of your laptop</li>
                        <li>Look inside the battery compartment</li>
                        <li>Check in BIOS/UEFI settings (press F2/Del during boot)</li>
                        <li>Look at the original box or receipt</li>
                      </ul>
                    </div>
                  </div>
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Enter device serial number"
                  required
                  className="w-full h-12 px-4 border rounded-xl text-sm"
                  style={{ borderColor: '#e6dfd5' }}
                />
              </div>
            </div>

            {/* Problem Description */}
            <div className="mb-6">
              <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>PROBLEM DESCRIPTION</label>
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the issue you're facing in detail..."
                required
                className="w-full p-4 border rounded-2xl text-sm resize-y"
                style={{ borderColor: '#e6dfd5' }}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>
                DEVICE IMAGES / DAMAGE PHOTOS (OPTIONAL)
              </label>
              <div className="border-2 border-dashed rounded-2xl p-6 text-center" style={{ borderColor: '#d97706', backgroundColor: '#fdfbf7' }}>
                {imagePreviews.length === 0 ? (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold">Click or drop images here</p>
                      <p className="text-xs mt-1" style={{ color: '#7c6251' }}>(PNG, JPG up to 10MB)</p>
                    </div>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold" style={{ color: '#b45309' }}>
                        Uploaded Photos ({imagePreviews.length})
                      </span>
                      <label className="text-xs px-3 py-1.5 rounded-lg cursor-pointer text-white" style={{ backgroundColor: '#d97706' }}>
                        + Add More
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} className="w-full h-20 object-cover rounded-xl border" />
                          <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Device Password */}
            <div className="mb-6">
              <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>DEVICE PASSWORD (IF ANY)</label>
              <input type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank if you prefer not to provide" className="w-full h-12 px-4 border rounded-2xl text-sm" style={{ borderColor: '#e6dfd5' }} />
            </div>

            {/* Accessories */}
            <div className="mb-6">
              <label className="block text-xs font-bold tracking-wider mb-3" style={{ color: '#6b5446' }}>
                ACCESSORIES INCLUDED
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: 'Charger', name: 'hasCharger' },
                  { label: 'Power Cord', name: 'hasPowerCord' },
                  { label: 'Mouse', name: 'hasMouse' },
                  { label: 'Bag', name: 'hasBag' },
                  { label: 'Other', name: 'hasOther' },
                ].map((item) => {
                  const checked = formData[item.name as keyof typeof formData] as boolean;
                  return (
                    <label key={item.name} className="flex items-center gap-3 p-3 rounded-2xl border cursor-pointer" style={{ backgroundColor: checked ? '#fef3c7' : '#ffffff', borderColor: checked ? '#d97706' : '#e6dfd5' }}>
                      <input type="checkbox" name={item.name} checked={checked} onChange={handleChange} className="accent-[#d97706]" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </label>
                  );
                })}
              </div>
              {formData.hasOther && (
                <input type="text" name="otherItems" value={formData.otherItems} onChange={handleChange} placeholder="Please specify other accessories..." className="w-full h-12 px-4 border rounded-2xl mt-3 text-sm" style={{ borderColor: '#e6dfd5' }} />
              )}
            </div>

            {/* Delivery Option */}
            <div className="mb-6">
              <label className="block text-xs font-bold tracking-wider mb-3" style={{ color: '#6b5446' }}>
                DELIVERY OPTION
              </label>
              <div className="flex gap-3 mb-3">
                <label className="flex-1 p-4 rounded-2xl border cursor-pointer transition" style={{ backgroundColor: formData.deliveryOption === 'dropoff' ? '#fef3c7' : '#ffffff', borderColor: formData.deliveryOption === 'dropoff' ? '#d97706' : '#e6dfd5' }}>
                  <input type="radio" name="deliveryOption" value="dropoff" checked={formData.deliveryOption === 'dropoff'} onChange={handleChange} className="mr-2 accent-[#d97706]" />
                  <span className="font-semibold text-sm" style={{ color: formData.deliveryOption === 'dropoff' ? '#b45309' : '#5c4436' }}>Drop off at shop</span>
                </label>

                <label className="flex-1 p-4 rounded-2xl border cursor-pointer transition" style={{ backgroundColor: formData.deliveryOption === 'pickup' ? '#fef3c7' : '#ffffff', borderColor: formData.deliveryOption === 'pickup' ? '#d97706' : '#e6dfd5' }}>
                  <input type="radio" name="deliveryOption" value="pickup" checked={formData.deliveryOption === 'pickup'} onChange={handleChange} className="mr-2 accent-[#d97706]" />
                  <span className="font-semibold text-sm" style={{ color: formData.deliveryOption === 'pickup' ? '#b45309' : '#5c4436' }}>We pick up from you</span>
                </label>
              </div>

              {formData.deliveryOption === 'dropoff' && (
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: '#fefce8', borderColor: '#e6dfd5' }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#453227' }}>Drop off Address:</p>
                  <p className="text-sm" style={{ color: '#5c4436' }}>
                    Bright Light Technology Services<br />
                    No. 123, Jalan Teknologi, Taman Teknologi,<br />
                    57000 Kuala Lumpur
                  </p>
                  <p className="text-xs mt-2" style={{ color: '#7c6251' }}>
                    Operating Hours: 9:00 AM – 6:00 PM (Monday – Saturday)
                  </p>
                </div>
              )}

              {formData.deliveryOption === 'pickup' && (
                <div>
                  <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>YOUR ADDRESS FOR PICKUP</label>
                  <textarea name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} rows={3} placeholder="Enter your full address for pickup..." required className="w-full p-4 border rounded-2xl text-sm" style={{ borderColor: '#e6dfd5' }} />
                </div>
              )}
            </div>

            {/* Preferred Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>PREFERRED START DATE (OPTIONAL)</label>
                <input type="date" name="preferredStartDate" value={formData.preferredStartDate} onChange={handleChange} className="w-full h-12 px-4 border rounded-2xl text-sm" style={{ borderColor: '#e6dfd5' }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: '#6b5446' }}>PREFERRED END DATE (OPTIONAL)</label>
                <input type="date" name="preferredEndDate" value={formData.preferredEndDate} onChange={handleChange} className="w-full h-12 px-4 border rounded-2xl text-sm" style={{ borderColor: '#e6dfd5' }} />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-6 p-6 rounded-2xl border" style={{ backgroundColor: '#fefce8', borderColor: '#e6dfd5' }}>
              <h3 className="font-bold text-base mb-4" style={{ color: '#453227' }}>Terms & Conditions</h3>

              <ol className="text-sm space-y-3 mb-5 pl-5 list-decimal" style={{ color: '#5c4436' }}>
                <li>
                  All services provided included testing before handing over to customers. Any defects, need to be informed via SMS / WhatsApp / Phone Call / Email within <strong>7 DAYS</strong> from the handover date.
                </li>
                <li>
                  Item(s) not collected for <strong>3 MONTHS</strong> after informing via SMS/WhatsApp/Phone Call/Email will be considered <strong>CASE CLOSED</strong> and we have the rights to <strong>DISPOSE</strong> the item(s).
                </li>
                <li>
                  For data backup, all backed up data will be kept <strong>ONLY FOR 1 MONTH</strong> and we reserve the rights to <strong>DESTROY</strong> the data.
                </li>
              </ol>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 accent-[#d97706] flex-shrink-0"
                />
                <span className="text-sm font-medium" style={{ color: '#453227' }}>
                  I have read and agree to the Terms & Conditions above.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full h-14 rounded-2xl font-bold text-white text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#d97706' }}
            >
              Submit Repair Request
            </button>

            <p className="text-center text-xs mt-4" style={{ color: '#7c6251' }}>
              Our dedicated response team will reach out to you within 24 hours after request submission.
            </p>
          </form>
        </div>
      </div>

      {/* ==================== MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl" style={{ border: '1px solid #e6dfd5' }}>
            <div className="text-center">
              <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${modalType === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className="text-3xl">{modalType === 'success' ? '✅' : '⚠️'}</span>
              </div>
              <p className="text-lg font-medium mb-6" style={{ color: '#453227' }}>{modalMessage}</p>
              <button
                onClick={closeModal}
                className="w-full py-3.5 rounded-2xl font-bold text-lg text-white"
                style={{ backgroundColor: modalType === 'success' ? '#16a34a' : '#d97706' }}
              >
                {modalType === 'success' ? 'Continue' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}