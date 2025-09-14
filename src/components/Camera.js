import React, { useRef, useState } from 'react';

const Camera = ({ onFileSelect, isProcessing }) => {
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setUploadedImage(imageData);
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          onFileSelect(img);
        };
        img.onerror = (error) => {
          console.error('Error loading uploaded image:', error);
          alert('Error loading uploaded image. Please try a different file.');
        };
        img.src = imageData;
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetUpload = () => {
    setUploadedImage(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-section">
        <h2>📁 Upload Goose Photo</h2>
        
        <div className="upload-preview">
          {uploadedImage ? (
            <div className="uploaded-image-container">
              <img src={uploadedImage} alt="Uploaded goose" />
              <div className="upload-overlay">
                <p>✅ Photo uploaded! Analyzing...</p>
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📁</div>
              <p>Upload a photo of a goose</p>
              <p>Supports JPG, PNG, and other image formats</p>
            </div>
          )}
        </div>

        <div className="upload-controls">
          {!uploadedImage && (
            <label className="file-label">
              📁 Choose Photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                disabled={isProcessing}
              />
            </label>
          )}

          {uploadedImage && (
            <button 
              className="upload-button reset" 
              onClick={resetUpload}
              disabled={isProcessing}
            >
              🔄 Upload Another
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Camera;
