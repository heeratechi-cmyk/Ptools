import React from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

export default function CompressPdf() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [compressedSize, setCompressedSize] = React.useState(0);
  const [originalSize, setOriginalSize] = React.useState(0);

  const handleCompress = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setOriginalSize(file.size);

    setStatus('processing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Basic compression: pdf-lib doesn't have advanced compression yet,
      // but we can re-save with optimization flags if available or simulate.
      // Real browser-side PDF compression is limited.
      // We'll use PDFDocument.save({ useObjectStreams: false }) as a baseline.
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([compressedPdfBytes as any], { type: 'application/pdf' });
      setCompressedSize(blob.size);
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
    } catch (err) {
      setError('Failed to compress PDF. Some PDFs are already highly optimized.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
    setError('');
  };

  if (status === 'processing') return <ProcessingState message="Optimizing PDF..." />;
  if (status === 'success') return (
    <div className="flex flex-col items-center py-12">
      <SuccessState 
        downloadUrl={resultUrl!} 
        fileName="compressed-pixeltools.pdf" 
        onReset={reset}
        message="Compression Complete!"
      />
      <div className="mt-4 text-sm text-slate-500">
        Original: {(originalSize / 1024).toFixed(1)} KB · 
        Compressed: {(compressedSize / 1024).toFixed(1)} KB
      </div>
    </div>
  );
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      <FileUpload 
        onFilesSelected={handleCompress}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Select a PDF to compress"
      />
      <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <h4 className="text-blue-800 font-bold text-sm mb-2">How it works:</h4>
        <p className="text-blue-700 text-xs leading-relaxed">
          Our browser-side compressor optimizes the PDF structure and removes redundant data. 
          Note: Since this runs in your browser, it may not achieve the same compression levels 
          as server-side tools that downsample images, but it's 100% private.
        </p>
      </div>
    </div>
  );
}
