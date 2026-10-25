import React from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

export default function ImageCropper() {
  const [image, setImage] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'cropping' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const onFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImage(reader.result as string);
      setStatus('cropping');
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;

    setStatus('processing');
    try {
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setResultUrl(url);
          setStatus('success');
        }
      }, 'image/jpeg');
    } catch (e) {
      setError('Failed to crop image.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setImage(null);
    setResultUrl(null);
  };

  if (status === 'processing') return <ProcessingState message="Creating your crop..." />;
  if (status === 'success') return <SuccessState downloadUrl={resultUrl!} fileName="cropped-pixeltools.jpg" onReset={reset} />;
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  if (status === 'cropping' && image) {
    return (
      <div className="p-8">
        <div className="relative h-[400px] w-full bg-slate-900 rounded-2xl overflow-hidden mb-6">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <button
            onClick={createCroppedImage}
            className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 whitespace-nowrap"
          >
            Apply Crop
          </button>
          <button
            onClick={reset}
            className="px-10 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <FileUpload 
        onFilesSelected={onFileSelect}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
        label="Select an image to crop"
      />
    </div>
  );
}
