import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { detectDominantColor } from '../utils/colorDetect';

const CLOUDINARY_CLOUD_NAME = 'dhcyh666o';
const CLOUDINARY_UPLOAD_PRESET = 'aashirwad_fashion';
const MAX_VARIANTS = 5;
const MAX_SIZE_MB = 20;

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'aashirwad-fashion/variants');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST', body: formData
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

export default function ColorVariantUploader({ variants = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileRef = useRef(null);
  const editFileRef = useRef(null);
  const [editIdx, setEditIdx] = useState(null);

  // Upload multiple files at once (up to 5)
  const handleMultiUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_VARIANTS - variants.length);
    if (!files.length) return;
    setUploading(true);
    const newVariants = [...variants];
    for (const file of files) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) { alert(`${file.name} is too large (max 20MB)`); continue; }
      try {
        const url = await uploadToCloudinary(file);
        // AI color detection
        const color = await detectDominantColor(url);
        newVariants.push({ color: color.name, colorCode: color.hex, image: url, stock: 10 });
      } catch { alert(`Failed to upload ${file.name}`); }
    }
    onChange(newVariants);
    setUploading(false);
    e.target.value = '';
  };

  // Replace single variant image
  const handleEditUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || editIdx === null) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) { alert('File too large (max 20MB)'); return; }
    setUploadingIdx(editIdx);
    try {
      const url = await uploadToCloudinary(file);
      const color = await detectDominantColor(url);
      const updated = [...variants];
      updated[editIdx] = { ...updated[editIdx], image: url, color: color.name, colorCode: color.hex };
      onChange(updated);
    } catch { alert('Upload failed'); }
    setUploadingIdx(null);
    setEditIdx(null);
    e.target.value = '';
  };

  const removeVariant = (i) => {
    onChange(variants.filter((_, idx) => idx !== i));
  };

  const updateColor = (i, field, val) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>
          🎨 Colour Variants ({variants.length}/{MAX_VARIANTS})
        </label>
        {variants.length < MAX_VARIANTS && (
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleMultiUpload} style={{ display: 'none' }} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ background: uploading ? '#ccc' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              {uploading ? <><Loader size={13} /> Uploading...</> : <><Upload size={13} /> Upload {MAX_VARIANTS - variants.length} more</>}
            </button>
          </>
        )}
      </div>

      {/* Hidden edit file input */}
      <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditUpload} style={{ display: 'none' }} />

      {variants.length === 0 && (
        <div onClick={() => !uploading && fileRef.current?.click()}
          style={{ border: '2px dashed #ddd', borderRadius: 10, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}>
          <Upload size={28} color="#aaa" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, color: '#555', fontWeight: 600, margin: 0 }}>Upload up to 5 colour photos</p>
          <p style={{ fontSize: 11, color: '#999', marginTop: 4 }}>AI will auto-detect colours • Max 20MB each</p>
        </div>
      )}

      {/* Variant Cards */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
        {variants.map((cv, i) => (
          <div key={i} style={{ position: 'relative', width: 100, background: '#fff', borderRadius: 10, border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {/* Image */}
            <div style={{ position: 'relative', height: 90, background: '#f5f5f5', cursor: 'pointer' }}
              onClick={() => { setEditIdx(i); editFileRef.current?.click(); }}>
              {uploadingIdx === i ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader size={20} color="#888" />
                </div>
              ) : (
                <>
                  <img src={cv.image} alt={cv.color} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                    <div style={{ background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '4px 8px' }}>
                      <Upload size={14} color="#fff" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Color info */}
            <div style={{ padding: '6px 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <input type="color" value={cv.colorCode || '#000000'}
                  onChange={e => updateColor(i, 'colorCode', e.target.value)}
                  style={{ width: 20, height: 20, border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 0 }} />
                <input value={cv.color} onChange={e => updateColor(i, 'color', e.target.value)}
                  style={{ flex: 1, border: 'none', fontSize: 11, fontWeight: 600, outline: 'none', background: 'transparent', color: '#333' }}
                  placeholder="Colour name" />
              </div>
            </div>

            {/* Remove button */}
            <button type="button" onClick={() => removeVariant(i)}
              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(229,0,16,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              ×
            </button>

            {/* AI badge */}
            <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>
              AI ✨
            </div>
          </div>
        ))}

        {/* Add more slot */}
        {variants.length > 0 && variants.length < MAX_VARIANTS && (
          <div onClick={() => !uploading && fileRef.current?.click()}
            style={{ width: 100, height: 130, border: '2px dashed #ddd', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fafafa', gap: 6 }}>
            <Upload size={20} color="#aaa" />
            <span style={{ fontSize: 10, color: '#aaa', fontWeight: 600 }}>Add more</span>
          </div>
        )}
      </div>

      {variants.length > 0 && (
        <p style={{ fontSize: 10, color: '#888', marginTop: 8 }}>
          💡 Click on image to replace • Click colour swatch to change • AI auto-detects colour names
        </p>
      )}
    </div>
  );
}
