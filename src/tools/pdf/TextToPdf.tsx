import React from 'react';
import { jsPDF } from 'jspdf';
import { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';
import { Type } from 'lucide-react';

export default function TextToPdf() {
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const generatePdf = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    try {
      const doc = new jsPDF();
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 15, 15);
      
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setText('');
    setStatus('idle');
    setResultUrl(null);
    setError('');
  };

  if (status === 'processing') return <ProcessingState message="Generating your PDF..." />;
  if (status === 'success') return <SuccessState downloadUrl={resultUrl!} fileName="pixeltools-text.pdf" onReset={reset} />;
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      <div className="mb-6">
        <label htmlFor="text-input" className="block text-sm font-bold text-slate-700 mb-2">
          Enter Text
        </label>
        <textarea
          id="text-input"
          rows={12}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none text-slate-800"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={generatePdf}
          disabled={!text.trim()}
          className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
        >
          <Type className="w-5 h-5" />
          Generate PDF
        </button>
      </div>
    </div>
  );
}
