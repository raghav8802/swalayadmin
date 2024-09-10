"use client"
import React, { useState } from 'react';

function Agreement() {
  const [signatureURL, setSignatureURL] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSignatureURL(result);
        setUploadDate(new Date().toISOString());
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    setSignatureURL(null);
    setUploadDate(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 p-8">
      <div className="bg-white text-gray-900 rounded-lg shadow-2xl p-12 w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8">TO WHOMSOEVER IT MAY CONCERN</h1>
        <p className="mb-6 text-lg leading-relaxed">
          This is to inform that we <strong>“name of sub-label”</strong> have licensed our content Exclusively to <strong>“name of main label”</strong> for monetization of content across any and all platforms and services including but not limited to CRBT, IVR, Full Tracks (Operator Based), and OTT platforms (international and domestic), streaming services, video streaming/download, etc., across various services and all telecom operators for the territory of the world on terms as detailed below –
        </p>
        <p className="mb-4 text-lg"><strong>License Type</strong> – Exclusive</p>
        <p className="mb-4 text-lg"><strong>Content</strong> – All Past catalogue and Future new releases.</p>
        <p className="mb-4 text-lg"><strong>Territory</strong> – Worldwide</p>
        <p className="mb-4 text-lg"><strong>Term</strong> – This B2B is valid from the Date of Signing of this Document and valid till one year and will be auto-renewed for another year if not requested and agreed for termination on or before one month of expiry of this document in writing by both parties.</p>
        <p className="mt-8 text-lg">Regards,</p>
        <p className="mb-8 text-lg">For <strong>“name of sub-label”</strong></p>

        <div className="border-2 border-gray-300 rounded-lg mt-4 mb-6 w-full h-56 flex items-center justify-center">
          {signatureURL ? (
            <img src={signatureURL} alt="Signature" className="w-full h-full object-contain" />
          ) : (
            <p className="text-gray-500">No signature uploaded</p>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition"
          />
          <button
            onClick={clearSignature}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Clear
          </button>
        </div>
          <button
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            I Agree
          </button>

        {/* {signatureURL && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Signature Preview:</h2>
            <img src={signatureURL} alt="Signature" className="border border-gray-300 rounded-lg" />
            {uploadDate && <p className="mt-2 text-gray-600">Uploaded on: {uploadDate}</p>}
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Agreement;






/*"use client"
import React, { useState } from 'react';

function Agreement() {
  const [signatureURL, setSignatureURL] = useState<string | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSignatureURL(result);
        setUploadDate(new Date().toISOString());
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSignature = () => {
    setSignatureURL(null);
    setUploadDate(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 p-8">
      <div className="bg-white text-gray-900 rounded-lg shadow-2xl p-12 w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8">TO WHOMSOEVER IT MAY CONCERN</h1>
        <p className="mb-6 text-lg leading-relaxed">
          This is to inform that we <strong>“name of sub-label”</strong> have licensed our content Exclusively to <strong>“name of main label”</strong> for monetization of content across any and all platforms and services including but not limited to CRBT, IVR, Full Tracks (Operator Based), and OTT platforms (international and domestic), streaming services, video streaming/download, etc., across various services and all telecom operators for the territory of the world on terms as detailed below –
        </p>
        <p className="mb-4 text-lg"><strong>License Type</strong> – Exclusive</p>
        <p className="mb-4 text-lg"><strong>Content</strong> – All Past catalogue and Future new releases.</p>
        <p className="mb-4 text-lg"><strong>Territory</strong> – Worldwide</p>
        <p className="mb-4 text-lg"><strong>Term</strong> – This B2B is valid from the Date of Signing of this Document and valid till one year and will be auto-renewed for another year if not requested and agreed for termination on or before one month of expiry of this document in writing by both parties.</p>
        <p className="mt-8 text-lg">Regards,</p>
        <p className="mb-8 text-lg">For <strong>“name of sub-label”</strong></p>

        <div className="border-2 border-gray-300 rounded-lg mt-4 mb-6 w-full h-56 flex items-center justify-center">
          {signatureURL ? (
            <img src={signatureURL} alt="Signature" className="w-full h-full object-contain" />
          ) : (
            <p className="text-gray-500">No signature uploaded</p>
          )}
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 transition"
          />
          <button
            onClick={clearSignature}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Clear
          </button>
        </div>

        {signatureURL && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Signature Preview:</h2>
            <img src={signatureURL} alt="Signature" className="border border-gray-300 rounded-lg" />
            {uploadDate && <p className="mt-2 text-gray-600">Uploaded on: {uploadDate}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Agreement;
*/