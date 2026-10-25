import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2, AlertCircle, FileType, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
  label?: string;
}

export default function FileUpload({
  onFilesSelected,
  accept,
  maxFiles = 1,
  multiple = false,
  className,
  label = "Drop files here or click to upload"
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border border-dashed rounded-3xl p-16 transition-all cursor-pointer flex flex-col items-center justify-center text-center group",
          isDragActive 
            ? "border-indigo-600 bg-indigo-50/50 shadow-inner" 
            : "border-slate-200 hover:border-indigo-400/50 hover:bg-slate-50/50",
          files.length > 0 && "py-12"
        )}
      >
        <input {...getInputProps()} />
        <div className="w-18 h-18 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
          <Upload className="w-8 h-8" />
        </div>
        <p className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{label}</p>
        <div className="flex items-center gap-3 text-slate-400 text-[13px] font-semibold uppercase tracking-wider">
          <span>{multiple ? `Max ${maxFiles} items` : "Single object"}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>Local Latency</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:border-slate-300">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <FileType className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{file.name}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProcessingState({ message = "Processing buffer..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative w-14 h-14 mb-8">
        <div className="absolute inset-0 border-3 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-3 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em]">{message}</p>
    </div>
  );
}

export function SuccessState({ 
  message = "Operation complete", 
  downloadUrl, 
  fileName,
  onReset
}: { 
  message?: string; 
  downloadUrl?: string; 
  fileName?: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 shadow-sm shadow-emerald-100 border border-emerald-100/50">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">{message}</h3>
      <p className="text-slate-500 mb-12 font-medium">Your processed manifest is ready for deployment.</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={fileName}
            className="premium-button-primary min-w-[200px] py-4 flex items-center justify-center gap-2 group"
          >
            Download Resource
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        )}
        <button
          onClick={onReset}
          className="premium-button-secondary min-w-[200px] py-4"
        >
          Reset Terminal
        </button>
      </div>
    </div>
  );
}

export function ErrorState({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-600 mb-8 shadow-sm shadow-rose-100 border border-rose-100/50">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">System Exception</h3>
      <p className="text-slate-500 mb-12 max-w-sm font-medium leading-relaxed">{message}</p>
      <button
        onClick={onReset}
        className="premium-button-primary bg-rose-600 hover:bg-rose-700 shadow-rose-100"
      >
        Retry Operation
      </button>
    </div>
  );
}
