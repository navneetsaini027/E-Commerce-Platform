// Cloudinary image upload utility
// Uses unsigned upload preset - no API key needed on frontend

const CLOUDINARY_CLOUD_NAME = 'dhcyh666o';
const CLOUDINARY_UPLOAD_PRESET = 'aashirwad_fashion';

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'aashirwad-fashion');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) throw new Error('Image upload failed');
  const data = await response.json();
  return data.secure_url;
};
