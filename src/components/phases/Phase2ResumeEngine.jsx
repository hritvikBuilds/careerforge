import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, CheckCircle2, ArrowRight, 
  Copy, Check, Download, FileText, UserCheck, RefreshCw, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateHumanCoverLetter, generateLinkedInAssets } from '../../services/candidateSuiteEngine';
import CleanTextarea from '../common/CleanTextarea';

export default function Phase2ResumeEngine({
  originalResume,
  enhancedResume,
  setEnhancedResume,
  jobDescription,
  targetRole,
  targetCompany,
  originalAtsAnalysis,
  enhancedAtsAnalysis,
  aiAuditOriginal,
  aiAuditEnhanced,
  diffAnalysis,
  onRegenerate,
  onOpenExportModal,
  onProceedToPhase3
}) {
  const [activeSubTab, setActiveSubTab] = useState('resume'); // 'resume' | 'coverletter' | 'linkedin'
  const [mobileViewToggle, setMobileViewToggle] = useState('enhanced'); // 'enhanced' | 'original'
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(enhancedResume);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  const candidateName = originalResume.split('\n')[0]?.trim() || 'Alex Rivera';
  const coverLetterText = generateHumanCoverLetter(
    candidateName,
    targetRole,
    targetCompany,
    enhancedResume,
    jobDescription
  );

  const linkedInAssets = generateLinkedInAssets(
    targetRole,
    targetCompany,
    enhancedAtsAnalysis.matchedKeywords
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sleek Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* ATS Score Card */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>ATS Match</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
              {enhancedAtsAnalysis.overallScore}%
            </span>
            <span className="text-xs text-stone-400 line-through font-mono">
              {originalAtsAnalysis.overallScore}%
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
              +{enhancedAtsAnalysis.overallScore - originalAtsAnalysis.overallScore}%
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${enhancedAtsAnalysis.overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Anti-AI Filtration Card */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Human Voice</span>
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 font-mono">
              {aiAuditEnhanced.humanAuthenticityScore}%
            </span>
            <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.2 rounded-full border border-sky-200">
              Zero AI Traces
            </span>
          </div>
          <p className="text-[10px] text-stone-400 mt-2 truncate">
            Scrubbed {diffAnalysis.totalReplacements} AI cliches into punchy human verbs.
          </p>
        </div>

        {/* Truth Verification Card */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Authenticity</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-2">
            <p className="text-xs font-semibold text-stone-800">
              100% Truth-Anchored
            </p>
            <p className="text-[10px] text-stone-500 mt-0.5">
              Zero fake roles or companies. Legitimate experience reframed.
            </p>
          </div>
          <button
            onClick={onProceedToPhase3}
            className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 flex items-center space-x-1 mt-2 pt-1 border-t border-stone-100"
          >
            <span>Next: Interview Prep</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('resume')}
          className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeSubTab === 'resume'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Enhanced Resume</span>
        </button>

        <button
          onClick={() => setActiveSubTab('coverletter')}
          className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeSubTab === 'coverletter'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cover Letter</span>
        </button>

        <button
          onClick={() => setActiveSubTab('linkedin')}
          className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeSubTab === 'linkedin'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>LinkedIn Pitch</span>
        </button>
      </div>

      {/* SUB-TAB 1: ENHANCED RESUME & DIFF VIEWER */}
      {activeSubTab === 'resume' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-stone-200/80 p-2 sm:p-3 rounded-2xl shadow-2xs">
            {/* Mobile View Switcher */}
            <div className="flex lg:hidden items-center bg-stone-100 p-0.5 rounded-xl text-xs">
              <button
                onClick={() => setMobileViewToggle('enhanced')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  mobileViewToggle === 'enhanced'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600'
                }`}
              >
                Enhanced
              </button>
              <button
                onClick={() => setMobileViewToggle('original')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  mobileViewToggle === 'original'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600'
                }`}
              >
                Baseline
              </button>
            </div>

            <span className="text-xs text-stone-500 hidden lg:inline">
              Single-column, ATS-machine readable layout. Edit directly below.
            </span>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1.5 ml-auto">
              <button
                onClick={onRegenerate}
                title="Regenerate enhancement"
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 font-medium flex items-center space-x-1"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Re-Enhance</span>
              </button>

              <button
                onClick={handleCopyResume}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs text-stone-700 font-medium flex items-center space-x-1"
              >
                {copiedResume ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenExportModal}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs text-white font-semibold flex items-center space-x-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* AI Traces Scrubbed Preview */}
          {diffAnalysis.totalReplacements > 0 && (
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-stone-800 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-sky-600" /> AI Cliches Replaced with Human Verbs
                </span>
                <span className="text-[10px] text-stone-400">
                  {diffAnalysis.totalReplacements} changes
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {diffAnalysis.aiReplacements.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-stone-50 border border-stone-200/70 text-[10px] text-stone-700">
                    <span className="line-through text-rose-500 mr-1 font-mono">"{item.originalWord}"</span>
                    → <span className="text-emerald-700 font-semibold font-mono">"{item.replacement}"</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Editor Layout: Side-by-Side on Desktop, Responsive Toggle on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Baseline Resume */}
            <div className={`flex flex-col bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs ${
              mobileViewToggle === 'enhanced' ? 'hidden lg:flex' : 'flex'
            }`}>
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-100">
                <h4 className="font-semibold text-xs text-stone-700 uppercase tracking-wider">
                  Baseline Resume
                </h4>
                <span className="text-xs font-mono text-stone-500">
                  ATS: {originalAtsAnalysis.overallScore}%
                </span>
              </div>
              <div className="flex-1 bg-stone-50/60 border border-stone-200/60 rounded-xl p-3 font-mono text-xs text-stone-600 whitespace-pre-wrap overflow-y-auto max-h-[500px] leading-relaxed select-text">
                {originalResume}
              </div>
            </div>

            {/* Enhanced Resume */}
            <div className={mobileViewToggle === 'original' ? 'hidden lg:block' : 'block'}>
              <CleanTextarea
                title="Enhanced Resume (ATS >85%)"
                subtitle="Optimized with target keywords, XYZ impact, and clean human phrasing."
                badgeText={`ATS ${enhancedAtsAnalysis.overallScore}%`}
                badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
                value={enhancedResume}
                onChange={(e) => setEnhancedResume(e.target.value)}
                placeholder="Enhanced resume content..."
                rows={18}
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COVER LETTER */}
      {activeSubTab === 'coverletter' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Tailored Cover Letter</span>
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(coverLetterText);
                setCopiedCoverLetter(true);
                setTimeout(() => setCopiedCoverLetter(false), 2000);
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 flex items-center space-x-1.5 border border-stone-200 transition-colors shadow-2xs"
            >
              {copiedCoverLetter ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-stone-50/70 p-4 sm:p-6 rounded-xl border border-stone-200/70 font-mono text-xs text-stone-800 leading-relaxed whitespace-pre-wrap select-all">
            {coverLetterText}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LINKEDIN */}
      {activeSubTab === 'linkedin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800">
                LinkedIn Recruiter Headline
              </h4>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(linkedInAssets.headline);
                  setCopiedLinkedIn(true);
                  setTimeout(() => setCopiedLinkedIn(false), 2000);
                }}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3 bg-sky-50/40 rounded-xl border border-sky-100 text-xs font-mono text-sky-900">
              {linkedInAssets.headline}
            </div>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Direct Recruiter DM (&lt;120 words)
              </h4>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(linkedInAssets.coldOutreach);
                  setCopiedLinkedIn(true);
                  setTimeout(() => setCopiedLinkedIn(false), 2000);
                }}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center space-x-1"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs font-mono text-stone-800 whitespace-pre-wrap">
              {linkedInAssets.coldOutreach}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
