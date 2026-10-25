import React from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import FileUpload, { ProcessingState, SuccessState, ErrorState } from '../../components/FileUpload';
import { Settings, Type, RotateCcw, Layout, Droplets } from 'lucide-react';

export default function PdfWatermark() {
  const [status, setStatus] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);

  // Watermark Settings
  const [text, setText] = React.useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = React.useState(50);
  const [opacity, setOpacity] = React.useState(0.3);
  const [rotation, setRotation] = React.useState(-45);
  const [color, setColor] = React.useState('#6366f1'); // Indigo 500

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const applyWatermark = async () => {
    if (!file) return;

    setStatus('processing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const { r, g, b } = hexToRgb(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Calculate position (centered)
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        page.drawText(text, {
          x: width / 2 - (textWidth / 2) * Math.cos(rotation * Math.PI / 180),
          y: height / 2 - (textHeight / 2),
          size: fontSize,
          font: font,
          color: rgb(r, g, b),
          opacity: opacity,
          rotate: degrees(rotation),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('Failed to apply watermark. The PDF might be encrypted or corrupted.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResultUrl(null);
    setError('');
    setFile(null);
  };

  if (status === 'processing') return <ProcessingState message="Adding watermark..." />;
  if (status === 'success') return (
    <div className="flex flex-col items-center py-12">
      <SuccessState 
        downloadUrl={resultUrl!} 
        fileName={`watermarked-${file?.name || 'document.pdf'}`} 
        onReset={reset}
        message="Watermark Applied!"
      />
    </div>
  );
  if (status === 'error') return <ErrorState message={error} onReset={reset} />;

  return (
    <div className="p-8">
      {!file ? (
        <FileUpload 
          onFilesSelected={handleFileSelect}
          accept={{ 'application/pdf': ['.pdf'] }}
          label="Select a PDF to watermark"
        />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={reset} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider">Change File</button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Type className="w-3 h-3" /> Watermark Text
                </label>
                <input 
                  type="text" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Settings className="w-3 h-3" /> Font Size
                  </label>
                  <input 
                    type="number" 
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <RotateCcw className="w-3 h-3" /> Rotation
                  </label>
                  <input 
                    type="number" 
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Droplets className="w-3 h-3" /> Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  Color
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-12 rounded-xl border-none cursor-pointer bg-transparent"
                  />
                  <input 
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={applyWatermark}
            className="premium-button-primary w-full py-5 text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-200"
          >
            Apply Watermark
          </button>
        </div>
      )}
    </div>
  );
}
