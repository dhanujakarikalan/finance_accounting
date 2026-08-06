// src/components/FileUploader.jsx
import React, { useState, useRef } from "react";
import { WEBHOOK_URL } from "../config";
import Loader from "./Loader";
import ResultCard from "./ResultCard";

const FileUploader = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (files && files[0]) {
      console.log('File selected:', files[0]);
      setFile(files[0]);
      setError(null);
      setResult(null);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    handleFiles(dt.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerBrowse = () => {
    inputRef.current.click();
  };

  const upload = async (e) => {
    // Prevent the click from bubbling to the parent div which also opens the file dialog
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    console.log('Starting upload for file:', file);
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      console.log('Webhook response:', data);
      setResult(data);
      if (onResult) onResult(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onClick={triggerBrowse}
        onTouchEnd={(e) => { e.preventDefault(); triggerBrowse(); }}
        onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') {e.preventDefault(); triggerBrowse();}}}
        role="button"
        tabIndex={0}
      >
        <p className="text-gray-600 mb-2">Drag & drop your invoice (PDF, JPG, PNG) here</p>
        <p className="text-sm text-gray-500">or</p>
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
          onClick={(e) => {
            e.stopPropagation();
            triggerBrowse();
          }}
        >
          Browse Files
        </button>
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          ref={inputRef}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium">{file.name}</span>
          {file && (
            <button
              type="button"
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={(e) => {
                console.log('Upload button clicked');
                upload(e);
              }}
              disabled={uploading}
            >
              Analyze Invoice
            </button>
          )}
        </div>
      )}

      {uploading && (
        <div className="mt-4 flex items-center space-x-2">
          <Loader />
          <span className="text-sm text-gray-600">Processing...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded text-red-800 text-sm">
          Error: {error}
        </div>
      )}

      {result && <ResultCard data={result} />}
    </div>
  );
};

export default FileUploader;
