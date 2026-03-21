import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { uploadAvatar } from '../../services/apiService';
import useAuthStore from '../../store/authStore';
import Avatar from './Avatar';
import toast from 'react-hot-toast';

/**
 * AvatarUpload
 * Drop-in replacement for the static avatar + camera button.
 * Handles file selection, resize/compress to base64, upload, store update.
 *
 * Props:
 *   size  — Avatar size ('md'|'lg'|'xl')
 *   shape — 'circle'|'rounded'
 */

const MAX_SIZE_KB = 200; // keep it small for MongoDB storage

function resizeToBase64(file, maxKB = MAX_SIZE_KB) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        // Scale down if needed
        const maxDim = 400;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        // Try quality 0.8 first, reduce if still too big
        let quality = 0.8;
        let result = canvas.toDataURL('image/jpeg', quality);
        while (result.length > maxKB * 1024 * 1.37 && quality > 0.2) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(result);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AvatarUpload({ size = 'xl', shape = 'circle' }) {
  const { user, updateUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const base64 = await resizeToBase64(file);
      setLocalAvatar(base64); // Show preview immediately
      await uploadAvatar(base64);
      updateUser({ avatar: base64 }); // Update Zustand so it persists in session
      toast.success('Profile photo updated!');
    } catch {
      setLocalAvatar(null);
      toast.error('Failed to upload photo. Try a smaller image.');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const avatar = localAvatar || user?.avatar;
  const sizeMap = { xs: 'w-6 h-6', sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12', xl: 'w-16 h-16' };

  return (
    <div className="relative flex-shrink-0">
      <Avatar src={avatar} name={user?.name} size={size} shape={shape} />

      {/* Camera overlay button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1 -right-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white p-1 rounded-full transition-colors disabled:opacity-50"
        title="Change profile photo"
      >
        {uploading
          ? <Loader2 className="w-3 h-3 animate-spin" />
          : <Camera className="w-3 h-3" />
        }
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}