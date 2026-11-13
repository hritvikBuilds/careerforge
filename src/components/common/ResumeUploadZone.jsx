import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X, RefreshCw } from 'lucide-react';
import { parseResumeFile } from '../../services/fileParser';

export default function ResumeUploadZone({ onResumeParsed, currentResume }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setIsLoading(true);

    try {
      const extractedText = await parseResumeFile(file);
      const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

      setUploadedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        wordCount,
        type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') || file.name.endsWith('.doc') ? 'word' : 'text'
      });

      onResumeParsed(extractedText);
    } catch (err) {
      console.error('File parsing error:', err);
      setError(err.message || 'Failed to read file. Please ensure it is a valid PDF or Word document.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.rtf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* When a file is uploaded & parsed */}
      {uploadedFile ? (
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
              uploadedFile.type === 'pdf'
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-sky-50 text-sky-600 border border-sky-200'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-stone-900 truncate">
                  {uploadedFile.name}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  ({uploadedFile.size})
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Extracted {uploadedFile.wordCount} words • Ready for ATS analysis</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3 text-stone-400" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={clearFile}
              title="Remove file"
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-200'
              : 'border-stone-200 hover:border-sky-300 hover:bg-stone-50/60 bg-white'
          }`}
        >
          {isLoading ? (
            <div className="py-3 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-7 h-7 text-sky-600 animate-spin" />
              <p className="text-xs font-semibold text-stone-800">
                Reading and extracting text from your resume...
              </p>
              <p className="text-[11px] text-stone-400">
                Processed 100% locally in your browser.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 shadow-2xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-800">
                  Upload your Resume (PDF or Word DOCX)
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Drag & drop here, or <span className="text-sky-600 font-semibold underline">browse files</span>
                </p>
              </div>
              <div className="flex items-center space-x-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  PDF (.pdf)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  Word (.docx, .doc)
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                  Text (.txt)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
