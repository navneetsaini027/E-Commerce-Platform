import { useState, useRef } from 'react';
import { Upload, X, Link } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = 'dhcyh666o';
const CLOUDINARY_UPLOAD_PRESET = 'aashirwad_fashion';

export default function ImageUploader({ value, onChange, label = "Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('url'); // 'url' or 'upload'
  const fileRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Image must be less than 20MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'aashirwad-fashion');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Cloudinary error:', errData);
        throw new Error(errData.error?.message || 'Upload failed');
      }
      const data = await response.json();
      onChange(data.secure_url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message}. Check Cloudinary preset or use URL instead.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
        {label}
      </label>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={() => setMode('url')}
          style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 11, fontWeight: 600, cursor: "pointer", background: mode === 'url' ? "#1a1a2e" : "#f5f5f5", color: mode === 'url' ? "#fff" : "#555", display: "flex", alignItems: "center", gap: 4 }}>
          <Link size={11} /> URL
        </button>
        <button type="button" onClick={() => setMode('upload')}
          style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #ddd", fontSize: 11, fontWeight: 600, cursor: "pointer", background: mode === 'upload' ? "#1a1a2e" : "#f5f5f5", color: mode === 'upload' ? "#fff" : "#555", display: "flex", alignItems: "center", gap: 4 }}>
          <Upload size={11} /> Gallery
        </button>
      </div>

      {/* URL Input */}
      {mode === 'url' && (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none", boxSizing: "border-box" }}
        />
      )}

      {/* File Upload */}
      {mode === 'upload' && (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            style={{
              border: "2px dashed #ddd", borderRadius: 8, padding: "20px",
              textAlign: "center", cursor: uploading ? "not-allowed" : "pointer",
              background: "#fafafa", transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a2e"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#ddd"}
          >
            {uploading ? (
              <div>
                <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                <p style={{ fontSize: 12, color: "#888" }}>Uploading...</p>
              </div>
            ) : (
              <div>
                <Upload size={24} color="#888" style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>Click to upload from gallery</p>
                <p style={{ fontSize: 11, color: "#999", marginTop: 4 }}>JPG, PNG, WebP · Max 20MB</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div style={{ position: "relative", display: "inline-block", marginTop: 8 }}>
          <img src={value} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }} onError={e => e.target.style.display = "none"} />
          <button type="button" onClick={() => onChange('')}
            style={{ position: "absolute", top: -6, right: -6, background: "#E50010", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={12} />
          </button>
        </div>
      )}

      {error && <p style={{ fontSize: 11, color: "#E50010", marginTop: 6 }}>{error}</p>}
    </div>
  );
}
