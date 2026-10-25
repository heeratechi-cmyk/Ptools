import React from 'react';

export default function PercentageCalculator() {
  const [val1, setVal1] = React.useState('');
  const [val2, setVal2] = React.useState('');
  const [result, setResult] = React.useState<number | null>(null);

  const calculate = () => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (!isNaN(v1) && !isNaN(v2)) {
      setResult((v1 / 100) * v2);
    }
  };

  return (
    <div className="p-12 max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">What is X% of Y?</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Percentage (X)</label>
          <div className="relative">
            <input 
              type="number" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
              placeholder="e.g. 20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Of Number (Y)</label>
          <input 
            type="number" 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
            placeholder="e.g. 500"
          />
        </div>
        
        <button
          onClick={calculate}
          className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Calculate
        </button>

        {result !== null && (
          <div className="mt-8 p-8 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
            <div className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-2">Result</div>
            <div className="text-4xl font-extrabold text-emerald-600">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
