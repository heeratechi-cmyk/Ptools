import React from 'react';
import { Repeat } from 'lucide-react';

export default function CaseConverter() {
  const [text, setText] = React.useState('');

  const convert = (type: 'upper' | 'lower' | 'sentence' | 'title') => {
    let result = text;
    if (type === 'upper') result = text.toUpperCase();
    if (type === 'lower') result = text.toLowerCase();
    if (type === 'sentence') {
      result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    }
    if (type === 'title') {
      result = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    }
    setText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8">
      <textarea
        className="w-full h-[300px] p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none text-slate-800 mb-6"
        placeholder="Paste your text here to change case..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <button onClick={() => convert('upper')} className="py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all">UPPERCASE</button>
        <button onClick={() => convert('lower')} className="py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all">lowercase</button>
        <button onClick={() => convert('sentence')} className="py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all">Sentence case</button>
        <button onClick={() => convert('title')} className="py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all">Title Case</button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={() => setText('')}
          className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
