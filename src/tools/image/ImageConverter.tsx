import React from 'react';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

interface ConverterProps {
  from: string;
  to: string;
}

const ImageConverter: React.FC<ConverterProps> = ({ from, to }) => {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const handleConvert = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];

    setStatus('processing');
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      const mimeType = to === 'PNG' ? 'image/png' : to === 'JPG' ? 'image/jpeg' : 'image/webp';
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setResultUrl(url);
          setStatus('success');
        }
      }, mimeType);
    } catch (err) {
      setError(`Failed to convert image to ${to}.`);
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
  };

  if (status === 'processing') return <ProcessingState message={`Converting to ${to}...`} />;
  if (status === 'success') return <SuccessState downloadUrl={resultUrl!} fileName={`converted-pixeltools.${to.toLowerCase()}`} onReset={reset} />;
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      <FileUpload 
        onFilesSelected={handleConvert}
        accept={from === 'JPG' ? { 'image/jpeg': ['.jpg', '.jpeg'] } : from === 'PNG' ? { 'image/png': ['.png'] } : { 'image/*': [] }}
        label={`Select ${from} image to convert to ${to}`}
      />
    </div>
  );
};

export const JpgToPng = () => <ImageConverter from="JPG" to="PNG" />;
export const PngToJpg = () => <ImageConverter from="PNG" to="JPG" />;
export const WebpConverter = () => <ImageConverter from="Image" to="WebP" />;

export default ImageConverter;
