import React from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';

export default function SplitPdf() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [pageCount, setPageCount] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [splitRange, setSplitRange] = React.useState('');

  const onFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
      setSplitRange(`1-${pdf.getPageCount()}`);
    } catch (err) {
      setError('Invalid PDF file.');
      setStatus('error');
    }
  };

  const handleSplit = async () => {
    if (!selectedFile) return;

    setStatus('processing');
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const splitPdf = await PDFDocument.create();
      
      const ranges = splitRange.split(',').map(r => r.trim());
      const pagesToCopy: number[] = [];
      
      for (const range of ranges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= pageCount) pagesToCopy.push(i - 1);
          }
        } else {
          const pageNum = Number(range);
          if (pageNum > 0 && pageNum <= pageCount) pagesToCopy.push(pageNum - 1);
        }
      }

      if (pagesToCopy.length === 0) throw new Error('No valid pages selected.');

      const copiedPages = await splitPdf.copyPages(sourcePdf, pagesToCopy);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      const pdfBytes = await splitPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'Failed to split PDF.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
    setError('');
    setSelectedFile(null);
    setPageCount(0);
  };

  if (status === 'processing') return <ProcessingState message="Splitting your PDF..." />;
  if (status === 'success') return <SuccessState downloadUrl={resultUrl!} fileName="split-pixeltools.pdf" onReset={reset} />;
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      {!selectedFile ? (
        <FileUpload 
          onFilesSelected={onFileSelect}
          accept={{ 'application/pdf': ['.pdf'] }}
          label="Select a PDF to split"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{pageCount} Pages</p>
            </div>
            <button onClick={reset} className="text-sm text-red-600 font-bold">Remove</button>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Page Range (e.g., 1-3, 5, 8-10)</label>
            <input 
              type="text" 
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={splitRange}
              onChange={(e) => setSplitRange(e.target.value)}
            />
          </div>

          <button
            onClick={handleSplit}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Extract Pages
          </button>
        </div>
      )}
    </div>
  );
}
