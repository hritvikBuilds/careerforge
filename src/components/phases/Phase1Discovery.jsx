import React, { useState } from 'react';
import { 
  Search, ExternalLink, Copy, Check, ArrowRight, 
  CheckCircle2, AlertTriangle, FileText, UploadCloud, Edit3
} from 'lucide-react';
import { generateSearchQueries } from '../../services/candidateSuiteEngine';
import TextInput from '../common/TextInput';
import CleanTextarea from '../common/CleanTextarea';
import ResumeUploadZone from '../common/ResumeUploadZone';

export default function Phase1Discovery({
  resume,
  setResume,
  jobDescription,
  setJobDescription,
  targetRole,
  setTargetRole,
  targetCompany,
  setTargetCompany,
  atsAnalysis,
  onProceedToPhase2
}) {
  const [resumeMode, setResumeMode] = useState('upload'); // 'upload' | 'text'
  const [copiedQueryIndex, setCopiedQueryIndex] = useState(null);

  const searchQueries = generateSearchQueries(
    targetRole, 
    atsAnalysis.matchedKeywords.concat(atsAnalysis.missingKeywords).slice(0, 5),
    'Remote'
  );

  const handleCopyQuery = (query, index) => {
    navigator.clipboard.writeText(query);
    setCopiedQueryIndex(index);
    setTimeout(() => setCopiedQueryIndex(null), 2000);
  };

  const handleResumeFileParsed = (extractedText) => {
    setResume(extractedText);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner - Clean */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-stone-50 to-indigo-50/50 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            Phase 1: Resume Upload & Match Analysis
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload your resume in PDF or Word (DOCX) format. We extract and analyze your skills against the job description.
          </p>
        </div>
        <button
          onClick={onProceedToPhase2}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-xs flex-shrink-0"
        >
          <span>Enhance Resume in Phase 2</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Role & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <TextInput
            id="target-role"
            label="Target Job Title / Role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <TextInput
            id="target-company"
            label="Target Company"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. Stripe, Notion, Google"
          />
        </div>
      </div>

      {/* Inputs: Resume (Upload & Text) & Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left: Candidate Resume with Upload Zone */}
        <div className="flex flex-col bg-white border border-stone-200/80 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <h3 className="font-semibold text-xs text-stone-800">
                Candidate Resume
              </h3>
            </div>

            {/* Toggle: Upload Document vs Edit Raw Text */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setResumeMode('upload')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                  resumeMode === 'upload'
                    ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UploadCloud className="w-3 h-3" />
                <span>Upload File</span>
              </button>

              <button
                type="button"
                onClick={() => setResumeMode('text')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 ${
                  resumeMode === 'text'
                    ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Text</span>
              </button>
            </div>
          </div>

          {/* Mode 1: PDF/Word Upload */}
          {resumeMode === 'upload' && (
            <div className="space-y-3">
              <ResumeUploadZone 
                onResumeParsed={handleResumeFileParsed}
                currentResume={resume}
              />

              {resume && (
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-stone-600">
                      Extracted Text Preview:
                    </span>
                    <button
                      type="button"
                      onClick={() => setResumeMode('text')}
                      className="text-[11px] text-sky-600 hover:underline font-medium"
                    >
                      Click to edit raw text
                    </button>
                  </div>
                  <div className="bg-stone-50/70 border border-stone-200/70 rounded-xl p-3 font-mono text-xs text-stone-600 max-h-48 overflow-y-auto whitespace-pre-wrap select-text">
                    {resume}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Direct Text Area */}
          {resumeMode === 'text' && (
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste or edit your raw resume text here..."
              rows={13}
              className="w-full flex-1 bg-stone-50/40 hover:bg-white focus:bg-white border border-stone-200/80 rounded-xl p-3 text-xs font-mono text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all resize-y leading-relaxed"
            />
          )}
        </div>

        {/* Right: Job Description */}
        <CleanTextarea
          title="Target Job Description (JD)"
          subtitle="Paste the job posting requirements and responsibilities."
          badgeText="Target Benchmark"
          badgeColor="bg-indigo-50 text-indigo-700 border-indigo-200"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job posting here (Role, Responsibilities, Requirements, Qualifications)..."
          rows={14}
        />
      </div>

      {/* Skill Match Breakdown */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center space-x-1.5">
            <Search className="w-4 h-4 text-sky-600" />
            <span>Keyword & Skill Coverage</span>
          </h3>
          <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full">
            Match: {atsAnalysis.overallScore}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Matched Skills */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3">
            <span className="text-xs font-bold text-emerald-800 flex items-center mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Matched in Your Resume ({atsAnalysis.matchedKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {atsAnalysis.matchedKeywords.length > 0 ? (
                atsAnalysis.matchedKeywords.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-100/70 text-emerald-800"
                  >
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-400 italic">No matches yet. Upload your resume above.</span>
              )}
            </div>
          </div>

          {/* Missing Skills from JD */}
          <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3">
            <span className="text-xs font-bold text-amber-800 flex items-center mb-2">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Missing from Resume ({atsAnalysis.missingKeywords.length})
            </span>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {atsAnalysis.missingKeywords.length > 0 ? (
                atsAnalysis.missingKeywords.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-100/70 text-amber-800"
                  >
                    + {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-700 italic">100% matched! Perfect coverage.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Boolean Job Search Query Builder */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-stone-900 mb-1 flex items-center space-x-1.5">
          <Search className="w-4 h-4 text-sky-600" />
          <span>Direct ATS Search Links</span>
        </h3>
        <p className="text-xs text-stone-500 mb-3">
          Find direct job postings on Greenhouse, Lever, and Ashby bypassing agency middlemen.
        </p>

        <div className="space-y-2.5">
          {searchQueries.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-stone-50/70 border border-stone-200/70 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="min-w-0 flex-1 w-full">
                <span className="text-xs font-bold text-stone-800 block">{item.platform}</span>
                <p className="font-mono text-[11px] text-stone-600 bg-white px-2 py-1 rounded border border-stone-200/70 mt-1 select-all overflow-x-auto truncate">
                  {item.query}
                </p>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleCopyQuery(item.query, idx)}
                  className="px-2.5 py-1 rounded-lg bg-white text-xs text-stone-700 font-medium flex items-center space-x-1 border border-stone-200 shadow-2xs"
                >
                  {copiedQueryIndex === idx ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-stone-400" />
                  )}
                  <span>Copy</span>
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-sky-50 text-xs text-sky-700 font-semibold flex items-center space-x-1 border border-sky-200"
                >
                  <span>Search</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
