'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Upload, CheckCircle } from 'lucide-react';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { saveImage } from '@/lib/imageCache';

type Props = {
  onClose: () => void;
  setPhoto: (url: string) => void; // base64 string
};

export default function PhotoUpload({ onClose, setPhoto }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  /* Convert Blob → Base64 */
  const toBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!['image/jpeg', 'image/png'].includes(selected.type)) {
      toast.error('Only JPG or PNG files are allowed');
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB');
      return;
    }

    try {
      const compressed = await imageCompression(selected, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      // ❗ Preview can be blob (temporary, local-only)
      setPreview(URL.createObjectURL(compressed));
    } catch {
      toast.error('Failed to process image');
    }
  };

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const getCroppedBlob = async (): Promise<Blob> => {
    if (!preview || !croppedAreaPixels) {
      throw new Error('Missing preview or crop data');
    }

    const image = new Image();
    image.src = preview;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9));
  };

  const handleSave = async () => {
    if (!preview || !croppedAreaPixels) {
      toast.error('Please select and crop a photo');
      return;
    }

    try {
      setSaving(true);

      const croppedBlob = await getCroppedBlob();
      const base64 = await toBase64(croppedBlob);

      await saveImage('profile-photo', base64);

      setPhoto(base64);

      toast.success('Profile photo updated');
      onClose();
    } catch {
      toast.error('Failed to save photo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/40 ${saving ? 'pointer-events-none' : ''}`}
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Profile Photo</h2>

        {preview ? (
          <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        ) : (
          <label
            htmlFor="photo-upload"
            className="flex items-center justify-center gap-2 border border-dashed rounded-lg py-6 cursor-pointer hover:bg-gray-50"
          >
            <Upload size={18} />
            <span>Select photo</span>
          </label>
        )}

        <input
          id="photo-upload"
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleSelect}
          hidden
        />

        <div className="flex gap-3 mt-6">
          <button
            disabled={saving}
            onClick={onClose}
            className="flex-1 border py-2 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
