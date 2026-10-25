import React from 'react';
import { Type } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = React.useState('');

  const stats = {
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    lines: text === '' ? 0 : text.split('\n').length,
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
          <div className="text-2xl font-extrabold text-indigo-600">{stats.words}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Words</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
          <div className="text-2xl font-extrabold text-indigo-600">{stats.characters}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Characters</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
          <div className="text-2xl font-extrabold text-indigo-600">{stats.charactersNoSpaces}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">No Spaces</div>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
          <div className="text-2xl font-extrabold text-indigo-600">{stats.lines}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lines</div>
        </div>
      </div>

      <textarea
        className="w-full h-[300px] p-6 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-slate-800"
        placeholder="Type or paste your text here to count..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      
      <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
        <span>Processing happens live in your browser</span>
        <button onClick={() => setText('')} className="text-red-500 font-bold hover:underline">Clear Text</button>
      </div>
    </div>
  );
}
