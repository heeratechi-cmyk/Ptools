import React from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function PdfPageCounter() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [count, setCount] = React.useState<number | null>(null);
  const [error, setError] = React.useState('');

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    
    setStatus('processing');
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setCount(pdf.numPages);
      setStatus('success');
    } catch (err) {
      setError('Failed to count pages. Please make sure it is a valid PDF.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setCount(null);
    setError('');
  };

  if (status === 'processing') return <ProcessingState message="Counting pages..." />;
  if (status === 'success') return (
    <div className="p-12 text-center">
      <div className="text-6xl font-extrabold text-indigo-600 mb-4">{count}</div>
      <p className="text-xl text-slate-600 mb-8">Pages found in document</p>
      <button
        onClick={reset}
        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
      >
        Count Another
      </button>
    </div>
  );
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      <FileUpload 
        onFilesSelected={handleFile}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Select a PDF to count pages"
      />
    </div>
  );
}
