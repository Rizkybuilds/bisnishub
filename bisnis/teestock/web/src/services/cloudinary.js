const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'z6qhdkde';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'teestock_preset';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '978731328676184';

/**
 * Upload a file directly from browser to Cloudinary CDN
 */
export async function uploadToCloudinary(file) {
  if (!file) throw new Error("Tidak ada berkas yang dipilih");

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('api_key', API_KEY);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Gagal mengunggah foto ke Cloudinary CDN. Pastikan preset Unsigned.");
  }

  // Automatic auto-format and auto-quality transformation
  const optimizedUrl = data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
  return {
    url: optimizedUrl,
    publicId: data.public_id,
    width: data.width,
    height: data.height
  };
}
