import React from 'react';
import { jsPDF } from 'jspdf';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

export default function ImageToPdf() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const handleConvert = async (files: File[]) => {
    if (files.length === 0) return;

    setStatus('processing');
    try {
      const doc = new jsPDF();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        if (i > 0) doc.addPage();
        
        const img = new Image();
        img.src = imageData;
        await new Promise((resolve) => (img.onload = resolve));

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgWidth = img.width;
        const imgHeight = img.height;
        
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const w = imgWidth * ratio;
        const h = imgHeight * ratio;
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        doc.addImage(imageData, 'JPEG', x, y, w, h);
      }

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
    } catch (err) {
      setError('Failed to convert images to PDF. Please try again with valid image files.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
    setError('');
  };

  if (status === 'processing') return <ProcessingState message="Converting images to PDF..." />;
  if (status === 'success') return <SuccessState downloadUrl={resultUrl!} fileName="images-pixeltools.pdf" onReset={reset} />;
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      <FileUpload 
        onFilesSelected={handleConvert}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
        multiple={true}
        maxFiles={50}
        label="Select images to convert to PDF"
      />
    </div>
  );
}
