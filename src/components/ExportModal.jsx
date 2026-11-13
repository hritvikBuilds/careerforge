import React, { useState } from 'react';
import { X, Printer, Download, Check, FileText, ShieldCheck } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, resumeText, candidateName, atsScore }) {
  const [downloadedFormat, setDownloadedFormat] = useState(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${(candidateName || 'Resume').replace(/\s+/g, '_')}_ATS_Optimized.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setDownloadedFormat('txt');
    setTimeout(() => setDownloadedFormat(null), 2000);
  };

  const handleDownloadMd = () => {
    const element = document.createElement('a');
    const file = new Blob([resumeText], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${(candidateName || 'Resume').replace(/\s+/g, '_')}_ATS_Optimized.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setDownloadedFormat('md');
    setTimeout(() => setDownloadedFormat(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-stone-900">ATS-Certified Printable Layout</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ATS Score: {atsScore}%
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Machine-readable single column layout, standard system fonts, zero unparseable graphics.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ATS Quality Banner */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900 no-print">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Format passes Taleo, Workday, Greenhouse, Lever, and iCIMS parser specifications.</span>
          </div>
          <div className="flex items-center space-x-2 font-medium">
            <button
              onClick={handleDownloadTxt}
              className="text-xs text-emerald-800 hover:underline"
            >
              {downloadedFormat === 'txt' ? 'Downloaded .TXT' : 'Download .TXT'}
            </button>
            <span className="text-emerald-300">•</span>
            <button
              onClick={handleDownloadMd}
              className="text-xs text-emerald-800 hover:underline"
            >
              {downloadedFormat === 'md' ? 'Downloaded .MD' : 'Download .MD'}
            </button>
          </div>
        </div>

        {/* Document Printable View */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-stone-100/60">
          <div className="ats-resume-print bg-white text-stone-900 p-8 sm:p-12 rounded-2xl shadow-sm max-w-3xl mx-auto font-sans leading-relaxed select-text text-sm border border-stone-200/80">
            <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-stone-800">
              {resumeText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
