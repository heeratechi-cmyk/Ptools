import React from 'react';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

export default function ImageResizer() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const onFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));
    setWidth(img.width);
    setHeight(img.height);
  };

  const handleResize = async () => {
    if (!selectedFile) return;

    setStatus('processing');
    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setResultUrl(url);
          setStatus('success');
        }
      }, selectedFile.type);
    } catch (err) {
      setError('Failed to resize image.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
    setSelectedFile(null);
  };

  if (status === 'processing') return <ProcessingState message="Resizing image..." />;
  if (status === 'success') return <SuccessState downloadUrl={resultUrl!} fileName={`resized-${selectedFile?.name}`} onReset={reset} />;
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      {!selectedFile ? (
        <FileUpload 
          onFilesSelected={onFileSelect}
          accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
          label="Select an image to resize"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-slate-900">{selectedFile.name}</span>
            <button onClick={reset} className="text-sm text-red-600 font-bold">Remove</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Width (px)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Height (px)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
              />
            </div>
          </div>

          <button
            onClick={handleResize}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Resize Image
          </button>
        </div>
      )}
    </div>
  );
}
