import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import PhaseNav from './components/PhaseNav';
import Phase1Discovery from './components/phases/Phase1Discovery';
import Phase2ResumeEngine from './components/phases/Phase2ResumeEngine';
import Phase3Interview from './components/phases/Phase3Interview';
import Phase4Tracker from './components/phases/Phase4Tracker';
import ExportModal from './components/ExportModal';
import SettingsModal from './components/SettingsModal';

import { SAMPLE_DATA } from './data/samples';
import { 
  calculateATSScore, 
  auditAITraces, 
  enhanceResume, 
  generateDiffAnalysis 
} from './services/atsEngine';
import { callGeminiCustomEnhance } from './services/geminiService';

export default function App() {
  const defaultSample = SAMPLE_DATA[0];

  const [activePresetId, setActivePresetId] = useState(defaultSample.id);
  const [targetRole, setTargetRole] = useState(defaultSample.targetRole);
  const [targetCompany, setTargetCompany] = useState(defaultSample.targetCompany);
  const [resume, setResume] = useState(defaultSample.resume);
  const [jobDescription, setJobDescription] = useState(defaultSample.jobDescription);
  const [enhancedResume, setEnhancedResume] = useState(() => 
    enhanceResume(defaultSample.resume, defaultSample.jobDescription, defaultSample.targetRole, defaultSample.targetCompany)
  );

  const [activePhase, setActivePhase] = useState(1); // Start on Phase 1 for resume upload
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Persistent settings
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('careerforge_config');
      return saved ? JSON.parse(saved) : {
        geminiApiKey: '',
        targetScore: 85,
        antiAiStrictness: 'strict',
        engineMode: 'local'
      };
    } catch {
      return {
        geminiApiKey: '',
        targetScore: 85,
        antiAiStrictness: 'strict',
        engineMode: 'local'
      };
    }
  });

  const handleSelectSample = (sampleId) => {
    const s = SAMPLE_DATA.find(x => x.id === sampleId);
    if (!s) return;
    setActivePresetId(s.id);
    setTargetRole(s.targetRole);
    setTargetCompany(s.targetCompany);
    setResume(s.resume);
    setJobDescription(s.jobDescription);
    const newEnhanced = enhanceResume(s.resume, s.jobDescription, s.targetRole, s.targetCompany);
    setEnhancedResume(newEnhanced);
  };

  const handleReset = () => {
    setActivePresetId(null);
    setTargetRole('');
    setTargetCompany('');
    setResume('');
    setJobDescription('');
    setEnhancedResume('');
  };

  const handleRegenerate = async () => {
    if (config.engineMode === 'gemini' && config.geminiApiKey) {
      try {
        const prompt = `Enhance the following candidate resume specifically for this job description.
CRITICAL CONSTRAINTS:
1. DO NOT fabricate any facts, companies, dates, or degrees. Keep 100% truthfulness.
2. Remove all generic AI phrases ("spearheaded", "orchestrated", "delved", "tapestry", "fostered", "pivotal", "leveraged"). Use punchy human engineering action verbs ("built", "shipped", "analyzed", "reduced").
3. Contextually insert missing relevant keywords from the JD that align with the candidate's actual background.
4. Target ATS Score > 85% with clean single-column format.

Target Role: ${targetRole}
Target Company: ${targetCompany}

Job Description:
${jobDescription}

Candidate Resume:
${resume}`;

        const result = await callGeminiCustomEnhance(config.geminiApiKey, prompt);
        setEnhancedResume(result);
        return;
      } catch (err) {
        alert(`Gemini API Error: ${err.message}. Falling back to Smart Local Engine.`);
      }
    }

    const newEnhanced = enhanceResume(resume, jobDescription, targetRole, targetCompany);
    setEnhancedResume(newEnhanced);
  };

  // When candidate uploads a new resume or modifies JD, re-enhance automatically
  useEffect(() => {
    if (resume && jobDescription) {
      const newEnhanced = enhanceResume(resume, jobDescription, targetRole, targetCompany);
      setEnhancedResume(newEnhanced);
    }
  }, [resume, jobDescription, targetRole, targetCompany]);

  const originalAtsAnalysis = useMemo(() => {
    return calculateATSScore(resume, jobDescription);
  }, [resume, jobDescription]);

  const enhancedAtsAnalysis = useMemo(() => {
    return calculateATSScore(enhancedResume, jobDescription);
  }, [enhancedResume, jobDescription]);

  const aiAuditOriginal = useMemo(() => {
    return auditAITraces(resume);
  }, [resume]);

  const aiAuditEnhanced = useMemo(() => {
    return auditAITraces(enhancedResume);
  }, [enhancedResume]);

  const diffAnalysis = useMemo(() => {
    return generateDiffAnalysis(resume, enhancedResume);
  }, [resume, enhancedResume]);

  const candidateName = useMemo(() => {
    return (resume.split('\n')[0] || 'Alex Rivera').trim();
  }, [resume]);

  const handleSaveConfig = (newCfg) => {
    setConfig(newCfg);
    try {
      localStorage.setItem('careerforge_config', JSON.stringify(newCfg));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Navigation Header */}
      <Header
        activePresetId={activePresetId}
        onSelectSample={handleSelectSample}
        onReset={handleReset}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        atsScore={enhancedAtsAnalysis.overallScore}
      />

      {/* Candidate Journey Phase Navigator */}
      <PhaseNav
        activePhase={activePhase}
        onSelectPhase={setActivePhase}
        atsScore={enhancedAtsAnalysis.overallScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {activePhase === 1 && (
          <Phase1Discovery
            resume={resume}
            setResume={setResume}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            targetCompany={targetCompany}
            setTargetCompany={setTargetCompany}
            atsAnalysis={originalAtsAnalysis}
            onProceedToPhase2={() => setActivePhase(2)}
          />
        )}

        {activePhase === 2 && (
          <Phase2ResumeEngine
            originalResume={resume}
            enhancedResume={enhancedResume}
            setEnhancedResume={setEnhancedResume}
            jobDescription={jobDescription}
            targetRole={targetRole}
            targetCompany={targetCompany}
            originalAtsAnalysis={originalAtsAnalysis}
            enhancedAtsAnalysis={enhancedAtsAnalysis}
            aiAuditOriginal={aiAuditOriginal}
            aiAuditEnhanced={aiAuditEnhanced}
            diffAnalysis={diffAnalysis}
            onRegenerate={handleRegenerate}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onProceedToPhase3={() => setActivePhase(3)}
          />
        )}

        {activePhase === 3 && (
          <Phase3Interview
            targetRole={targetRole}
            targetCompany={targetCompany}
            jobDescription={jobDescription}
            enhancedResume={enhancedResume}
            onProceedToPhase4={() => setActivePhase(4)}
          />
        )}

        {activePhase === 4 && (
          <Phase4Tracker
            candidateName={candidateName}
            targetCompany={targetCompany}
            targetRole={targetRole}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/70 bg-white/60 py-4 sm:py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CareerForge AI • Calm, Responsive Career Suite</span>
          <span className="text-stone-600 font-medium">
            ATS &gt;85% Verified • Zero AI Trace • PDF & Word (DOCX) Parser
          </span>
        </div>
      </footer>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        resumeText={enhancedResume}
        candidateName={candidateName}
        atsScore={enhancedAtsAnalysis.overallScore}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
