import React, { useState } from 'react';
import { QrCode, Upload, Smartphone } from 'lucide-react';

const AdminPaymentsManagement: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState({
    upiId: 'admin@upi',
    qrCodeImage: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPaymentMethod(prev => ({ ...prev, qrCodeImage: e.target.files![0] }));
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    // Mock save process
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Payment method updated successfully!');
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payment Method Setup</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UPI Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            UPI Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                value={paymentMethod.upiId}
                onChange={(e) => setPaymentMethod(prev => ({ ...prev, upiId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter UPI ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR Code Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  className="w-full"
                />
                {paymentMethod.qrCodeImage && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {paymentMethod.qrCodeImage.name}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Upload a QR code image for users to scan and make payments
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Saving...' : 'Save Payment Method'}
            </button>
          </div>
        </div>

        {/* Current QR Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Current Payment Method
          </h3>

          <div className="text-center space-y-4">
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="w-32 h-32 mx-auto bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">QR Code</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Current UPI ID:</p>
              <p className="font-mono text-lg bg-gray-50 p-2 rounded">{paymentMethod.upiId}</p>
              <p className="text-sm text-gray-500">
                Users will see this QR code and UPI ID for payments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Instructions</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Update your UPI ID that users will use for payments</li>
          <li>• Upload a QR code image that corresponds to your UPI ID</li>
          <li>• Users will see this information when making payments</li>
          <li>• You can update these details anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPaymentsManagement;