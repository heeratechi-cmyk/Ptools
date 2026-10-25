import React from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

export default function MergePdf() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const handleMerge = async (files: File[]) => {
    if (files.length < 2) return;

    setStatus('processing');
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('Failed to merge PDFs. Make sure the files are valid PDF documents.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
    setError('');
  };

  if (status === 'processing') return <ProcessingState message="Merging your PDFs..." />;
  if (status === 'success') return <SuccessState downloadUrl={resultUrl!} fileName="merged-pixeltools.pdf" onReset={reset} />;
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      <FileUpload 
        onFilesSelected={handleMerge}
        accept={{ 'application/pdf': ['.pdf'] }}
        multiple={true}
        maxFiles={20}
        label="Select PDF files to merge"
      />
      <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
        <h4 className="text-amber-800 font-bold text-sm mb-2">Instructions:</h4>
        <ul className="text-amber-700 text-xs space-y-1 list-disc pl-4">
          <li>Select at least two PDF files to merge.</li>
          <li>Files will be merged in the order they are selected.</li>
          <li>Max file size recommended: 50MB total.</li>
        </ul>
      </div>
    </div>
  );
}
