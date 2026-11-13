import React, { useState } from 'react';
import { 
  MessagesSquare, HelpCircle, ChevronDown, ChevronUp, Copy, Check, DollarSign, Award, ArrowRight
} from 'lucide-react';
import { generateInterviewQuestions, generateSalaryNegotiation } from '../../services/candidateSuiteEngine';
import CleanTextarea from '../common/CleanTextarea';

export default function Phase3Interview({
  targetRole,
  targetCompany,
  jobDescription,
  enhancedResume,
  onProceedToPhase4
}) {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'star' | 'salary'
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState(null);

  const [starData, setStarData] = useState({
    situation: 'At my previous company, payment reconciliation across three third-party gateways suffered from high latency and unhandled concurrency timeouts during peak hours.',
    task: 'I was responsible for redesigning the transaction ingestion pipeline to guarantee idempotency and reduce SQL query latency without interrupting live merchant checkouts.',
    action: 'I migrated legacy sync operations into an event-driven queue, implemented Redis distributed locking with unique idempotency keys, and added composite indexes to our PostgreSQL database.',
    result: 'Reduced database query response times by 35%, eliminated duplicate transaction processing completely, and maintained 99.99% uptime during Black Friday.'
  });
  const [copiedStar, setCopiedStar] = useState(false);

  const questions = generateInterviewQuestions(targetRole, jobDescription, enhancedResume);
  const salaryData = generateSalaryNegotiation(targetRole, targetCompany);

  const handleCopyScript = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(idx);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  const fullStarPitch = `Situation: ${starData.situation}\n\nTask: ${starData.task}\n\nAction: ${starData.action}\n\nResult: ${starData.result}`;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/60 via-stone-50 to-sky-50/60 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            Phase 3: Interview Mastery & STAR Prep
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Predict interview questions and craft compelling oral STAR answers based on your background.
          </p>
        </div>
        <button
          onClick={onProceedToPhase4}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-xs flex-shrink-0"
        >
          <span>Track Applications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeTab === 'questions'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Question Predictor</span>
        </button>

        <button
          onClick={() => setActiveTab('star')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeTab === 'star'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>STAR Story Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('salary')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeTab === 'salary'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Salary Negotiation</span>
        </button>
      </div>

      {/* TAB 1: QUESTION PREDICTOR */}
      {activeTab === 'questions' && (
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-stone-50/70 transition-colors"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1 pr-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center font-mono flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-700 block">
                        {q.type}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 mt-0.5 leading-snug">
                        {q.question}
                      </h4>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-3.5 sm:p-4 pt-0 border-t border-stone-100 bg-stone-50/40 space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-amber-800 text-[10px] uppercase tracking-wider block mb-0.5">
                        Why it is asked:
                      </span>
                      <p className="text-stone-700 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70 text-xs">
                        {q.whyAsked}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-emerald-800 text-[10px] uppercase tracking-wider block mb-0.5">
                        High-Scoring Angle:
                      </span>
                      <p className="text-stone-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/70 text-xs">
                        {q.suggestedResponse}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STAR BUILDER */}
      {activeTab === 'star' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-500">
            Structure your project into the STAR format. Combines into a crisp 90-second interview answer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <CleanTextarea
              title="1. Situation"
              badgeText="Context"
              badgeColor="bg-sky-50 text-sky-800 border-sky-200"
              value={starData.situation}
              onChange={(e) => setStarData({ ...starData, situation: e.target.value })}
              placeholder="What was the challenge or bottleneck?"
              rows={3}
            />

            <CleanTextarea
              title="2. Task"
              badgeText="Ownership"
              badgeColor="bg-indigo-50 text-indigo-800 border-indigo-200"
              value={starData.task}
              onChange={(e) => setStarData({ ...starData, task: e.target.value })}
              placeholder="What were you personally tasked to resolve?"
              rows={3}
            />

            <CleanTextarea
              title="3. Action"
              badgeText="Execution"
              badgeColor="bg-cyan-50 text-cyan-800 border-cyan-200"
              value={starData.action}
              onChange={(e) => setStarData({ ...starData, action: e.target.value })}
              placeholder="What engineering/product steps did you take?"
              rows={3}
            />

            <CleanTextarea
              title="4. Result"
              badgeText="Metrics"
              badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
              value={starData.result}
              onChange={(e) => setStarData({ ...starData, result: e.target.value })}
              placeholder="What was the quantifiable improvement?"
              rows={3}
            />
          </div>

          {/* Integrated Script */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                Integrated 90-Second Oral Script
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fullStarPitch);
                  setCopiedStar(true);
                  setTimeout(() => setCopiedStar(false), 2000);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700 flex items-center space-x-1"
              >
                {copiedStar ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-800 font-mono leading-relaxed whitespace-pre-wrap select-all">
              {fullStarPitch}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SALARY */}
      {activeTab === 'salary' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-stone-700">
            <span className="font-bold text-emerald-900 block mb-0.5">Strategy:</span>
            {salaryData.strategyTip}
          </div>

          <div className="space-y-3">
            {salaryData.scripts.map((script, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">{script.title}</h4>
                    <span className="text-[10px] text-stone-400">{script.scenario}</span>
                  </div>
                  <button
                    onClick={() => handleCopyScript(script.text, idx)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700 flex items-center space-x-1"
                  >
                    {copiedScriptIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed select-all">
                  {script.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
