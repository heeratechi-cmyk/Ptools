import React from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

interface DevToolProps {
  title: string;
  placeholder: string;
  process: (input: string) => string;
  actionLabel: string;
}

const DevTool: React.FC<DevToolProps> = ({ title, placeholder, process, actionLabel }) => {
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const handleProcess = () => {
    try {
      const result = process(input);
      setOutput(result);
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Input</h3>
            <button onClick={() => setInput('')} className="text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-mono text-sm text-slate-800"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Output</h3>
            <button onClick={handleCopy} className="text-slate-400 hover:text-indigo-600 transition-colors">
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <textarea
            className="w-full h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-mono text-sm text-slate-800 read-only"
            placeholder="Result will appear here..."
            value={output}
            readOnly
          ></textarea>
        </div>
      </div>
      
      <div className="mt-8">
        <button
          onClick={handleProcess}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export const JsonFormatter = () => (
  <DevTool 
    title="JSON Formatter" 
    placeholder="Paste your JSON here..." 
    actionLabel="Format & Validate JSON"
    process={(val) => JSON.stringify(JSON.parse(val), null, 2)}
  />
);

export const Base64Tool = () => {
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  return (
    <div className="space-y-4">
      <div className="flex p-1 bg-slate-100 rounded-xl mx-8 mt-8">
        <button 
          onClick={() => setMode('encode')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'encode' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          Encode
        </button>
        <button 
          onClick={() => setMode('decode')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'decode' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          Decode
        </button>
      </div>
      <DevTool 
        title="Base64" 
        placeholder={mode === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."}
        actionLabel={mode === 'encode' ? "Encode to Base64" : "Decode from Base64"}
        process={(val) => mode === 'encode' ? btoa(val) : atob(val)}
      />
    </div>
  );
};

export const UrlEncoder = () => {
  const [mode, setMode] = React.useState<'encode' | 'decode'>('encode');
  return (
    <div className="space-y-4">
      <div className="flex p-1 bg-slate-100 rounded-xl mx-8 mt-8">
        <button 
          onClick={() => setMode('encode')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'encode' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          Encode
        </button>
        <button 
          onClick={() => setMode('decode')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'decode' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          Decode
        </button>
      </div>
      <DevTool 
        title="URL Encoder" 
        placeholder={mode === 'encode' ? "Enter URL to encode..." : "Enter encoded URL to decode..."}
        actionLabel={mode === 'encode' ? "Encode URL" : "Decode URL"}
        process={(val) => mode === 'encode' ? encodeURIComponent(val) : decodeURIComponent(val)}
      />
    </div>
  );
};

export const HtmlFormatter = () => (
  <DevTool 
    title="HTML Formatter" 
    placeholder="Paste HTML here..." 
    actionLabel="Format HTML"
    process={(val) => {
      let formatted = '';
      let indent = '';
      val.split(/>\s*</).forEach((node) => {
        if (node.match(/^\/\w/)) indent = indent.substring(2);
        formatted += indent + '<' + node + '>\r\n';
        if (node.match(/^<?\w[^>]*[^\/]$/) && !node.match(/^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)/)) indent += '  ';
      });
      return formatted.substring(1, formatted.length - 3);
    }}
  />
);

export const CssMinifier = () => (
  <DevTool 
    title="CSS Minifier" 
    placeholder="Paste CSS here..." 
    actionLabel="Minify CSS"
    process={(val) => val.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, '').replace(/ ?([\{\}\:\;\,]) ?/g, '$1').trim()}
  />
);

export const JsMinifier = () => (
  <DevTool 
    title="JS Minifier" 
    placeholder="Paste JavaScript here..." 
    actionLabel="Minify JS"
    process={(val) => val.replace(/\/\/.*?\n/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim()}
  />
);

export default DevTool;
