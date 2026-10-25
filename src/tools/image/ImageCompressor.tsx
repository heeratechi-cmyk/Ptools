import React from 'react';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

export default function ImageCompressor() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [quality, setQuality] = React.useState(0.8);
  const [targetSizeKb, setTargetSizeKb] = React.useState(100);
  const [mode, setMode] = React.useState<'quality' | 'target'>('quality');
  const [originalSize, setOriginalSize] = React.useState(0);
  const [compressedSize, setCompressedSize] = React.useState(0);

  const compressToTarget = async (img: HTMLImageElement, fileType: string, targetBytes: number): Promise<Blob> => {
    let minQuality = 0.01;
    let maxQuality = 1.0;
    let bestBlob: Blob | null = null;
    let iterations = 0;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);

    // Binary search for the best quality to match target size
    while (iterations < 12) {
      const midQuality = (minQuality + maxQuality) / 2;
      const blob: Blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b!), fileType, midQuality);
      });

      if (!bestBlob || Math.abs(blob.size - targetBytes) < Math.abs(bestBlob.size - targetBytes)) {
        bestBlob = blob;
      }

      if (blob.size > targetBytes) {
        maxQuality = midQuality;
      } else {
        minQuality = midQuality;
      }
      
      iterations++;
      
      // If we are extremely close (within 1%), stop early
      if (Math.abs(blob.size - targetBytes) / targetBytes < 0.01) break;
    }

    return bestBlob!;
  };

  const handleCompress = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setOriginalSize(file.size);

    setStatus('processing');
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      let finalBlob: Blob;

      if (mode === 'quality') {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        finalBlob = await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          }, file.type, quality);
        });
      } else {
        // Target size mode
        const targetBytes = targetSizeKb * 1024;
        finalBlob = await compressToTarget(img, file.type, targetBytes);
      }

      setCompressedSize(finalBlob.size);
      const url = URL.createObjectURL(finalBlob);
      setResultUrl(url);
      setStatus('success');
      
      // Clean up URL
      URL.revokeObjectURL(img.src);
    } catch (err) {
      setError('Failed to compress image. Make sure it is a valid format.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
    setError('');
  };

  if (status === 'processing') return <ProcessingState message="Compressing image..." />;
  if (status === 'success') return (
    <div className="flex flex-col items-center py-12">
      <SuccessState 
        downloadUrl={resultUrl!} 
        fileName="compressed-pixeltools.jpg" 
        onReset={reset}
        message="Image Compressed!"
      />
      <div className="mt-4 text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-full font-medium">
        Original: {(originalSize / 1024).toFixed(1)} KB → 
        <span className="text-indigo-600 ml-1 font-bold">Compressed: {(compressedSize / 1024).toFixed(1)} KB</span>
      </div>
    </div>
  );
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      <div className="flex p-1 bg-slate-100 rounded-xl mb-8 max-w-sm mx-auto">
        <button 
          onClick={() => setMode('quality')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'quality' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          By Quality
        </button>
        <button 
          onClick={() => setMode('target')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'target' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          By File Size
        </button>
      </div>

      <div className="mb-10 max-w-md mx-auto">
        {mode === 'quality' ? (
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-bold text-slate-700">Compression Quality</label>
              <span className="text-2xl font-black text-indigo-600">{Math.round(quality * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1.0" 
              step="0.01" 
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
              <span>Small Size</span>
              <span>Perfect Quality</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-bold text-slate-700">Target File Size</label>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-indigo-600">
                  {targetSizeKb >= 1024 ? (targetSizeKb / 1024).toFixed(1) : targetSizeKb}
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {targetSizeKb >= 1024 ? 'MB' : 'KB'}
                </span>
              </div>
            </div>
            <input 
              type="range" 
              min="10" 
              max="10240" 
              step={targetSizeKb < 500 ? 5 : targetSizeKb < 2000 ? 50 : 250}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={targetSizeKb}
              onChange={(e) => setTargetSizeKb(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
              <span>Min: 10 KB</span>
              <span>Max: 10 MB</span>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {[10, 50, 100, 150, 200, 300, 500, 1024, 2048, 5120, 10240].map(size => (
                <button
                  key={size}
                  onClick={() => setTargetSizeKb(size)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    targetSizeKb === size 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  {size >= 1024 ? `${size/1024}MB` : `${size}KB`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <FileUpload 
        onFilesSelected={handleCompress}
        accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }}
        label="Select an image to compress"
      />
      
      <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">!</div>
        <p className="text-xs text-indigo-800 leading-relaxed">
          <strong>Tip:</strong> For best results with a specific file size, use JPG or WebP formats. Target size compression uses an intelligent multi-pass algorithm to get as close as possible to your desired KB value while preserving clarity.
        </p>
      </div>
    </div>
  );
}
