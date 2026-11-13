import React, { useState, useEffect } from 'react';
import { 
  KanbanSquare, Plus, Mail, Check, Copy, Trash2, Clock, DollarSign, X
} from 'lucide-react';
import { generateFollowUpEmails } from '../../services/candidateSuiteEngine';
import TextInput from '../common/TextInput';
import CleanTextarea from '../common/CleanTextarea';

const INITIAL_APPLICATIONS = [
  {
    id: '1',
    company: 'Stripe',
    role: 'Senior Full Stack Software Engineer',
    salary: '$190,000 - $220,000',
    date: '2026-11-10',
    status: 'screening',
    notes: 'Phone screen went well. Technical deep-dive scheduled.'
  },
  {
    id: '2',
    company: 'Notion',
    role: 'Senior Product Engineer',
    salary: '$185,000 - $215,000',
    date: '2026-11-08',
    status: 'technical',
    notes: 'Completed system design interview on workspace sync.'
  },
  {
    id: '3',
    company: 'Vercel',
    role: 'Staff Solutions Architect',
    salary: '$200,000 - $240,000',
    date: '2026-11-05',
    status: 'applied',
    notes: 'Submitted tailored ATS-optimized resume.'
  }
];

const COLUMNS = [
  { id: 'applied', title: 'Applied', color: 'border-sky-200 text-sky-800 bg-sky-50/30' },
  { id: 'screening', title: 'Screening', color: 'border-indigo-200 text-indigo-800 bg-indigo-50/30' },
  { id: 'technical', title: 'Technical', color: 'border-amber-200 text-amber-800 bg-amber-50/30' },
  { id: 'final', title: 'Final Round', color: 'border-violet-200 text-violet-800 bg-violet-50/30' },
  { id: 'offer', title: 'Offer', color: 'border-emerald-200 text-emerald-800 bg-emerald-50/30' }
];

export default function Phase4Tracker({
  candidateName,
  targetCompany,
  targetRole
}) {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'followup'
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('careerforge_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({
    company: targetCompany || '',
    role: targetRole || '',
    salary: '$180,000 - $220,000',
    status: 'applied',
    notes: 'Applied with ATS-optimized resume.'
  });

  const [copiedEmailIndex, setCopiedEmailIndex] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('careerforge_applications', JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  const handleAddApplication = () => {
    if (!newApp.company || !newApp.role) return;
    const item = {
      id: Date.now().toString(),
      ...newApp,
      date: new Date().toISOString().split('T')[0]
    };
    setApplications([item, ...applications]);
    setShowAddModal(false);
    setNewApp({
      company: '',
      role: '',
      salary: '',
      status: 'applied',
      notes: ''
    });
  };

  const handleMoveStatus = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const handleDeleteApplication = (id) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const followUpEmails = generateFollowUpEmails(
    candidateName,
    targetCompany || 'Target Company',
    targetRole || 'Target Role'
  );

  const handleCopyEmail = (body, idx) => {
    navigator.clipboard.writeText(body);
    setCopiedEmailIndex(idx);
    setTimeout(() => setCopiedEmailIndex(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/50 via-stone-50 to-sky-50/50 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            Phase 4: Pipeline Management & Follow-ups
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Track interview rounds across your applications and copy pre-written thank-you notes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-xs flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200/80 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeTab === 'kanban'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <KanbanSquare className="w-3.5 h-3.5" />
          <span>Kanban ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('followup')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
            activeTab === 'followup'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Thank You Letters</span>
        </button>
      </div>

      {/* TAB 1: KANBAN (Mobile Touch-Swipeable) */}
      {activeTab === 'kanban' && (
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 sm:gap-3">
          {COLUMNS.map((col) => {
            const colApps = applications.filter(a => a.status === col.id);
            return (
              <div
                key={col.id}
                className={`border rounded-2xl p-3 flex flex-col min-w-[260px] sm:min-w-0 snap-center shadow-2xs ${col.color}`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    {col.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-white/80 text-stone-700">
                    {colApps.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 min-h-[180px]">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs space-y-1.5 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-stone-900 leading-tight">
                            {app.company}
                          </h5>
                          <p className="text-[11px] text-stone-500 leading-snug">
                            {app.role}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="text-stone-300 hover:text-rose-500 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {app.salary && (
                        <div className="text-[10px] text-emerald-800 font-mono flex items-center bg-emerald-50 px-1.5 py-0.2 rounded w-fit">
                          <DollarSign className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
                          <span>{app.salary}</span>
                        </div>
                      )}

                      {/* Status Selector */}
                      <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px]">
                        <span className="text-stone-400 flex items-center">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          {app.date}
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => handleMoveStatus(app.id, e.target.value)}
                          className="bg-stone-50 text-stone-700 text-[10px] px-1.5 py-0.5 rounded border border-stone-200 focus:outline-none"
                        >
                          {COLUMNS.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="h-full flex items-center justify-center p-3 border border-dashed border-stone-300/60 rounded-xl text-center">
                      <span className="text-[11px] text-stone-400">Empty</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: FOLLOW-UP LETTERS */}
      {activeTab === 'followup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followUpEmails.map((email, idx) => (
            <div key={idx} className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  {email.title}
                </h4>
                <button
                  onClick={() => handleCopyEmail(email.body, idx)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700 flex items-center space-x-1"
                >
                  {copiedEmailIndex === idx ? (
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

              <div className="p-2 bg-sky-50/50 rounded-lg text-[10px] font-mono text-sky-900 truncate">
                <span className="text-stone-400">Subject: </span>
                {email.subject}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs font-mono text-stone-800 whitespace-pre-wrap leading-relaxed select-all">
                {email.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 max-w-md w-full shadow-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Track Application</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <TextInput
                label="Company Name *"
                value={newApp.company}
                onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                placeholder="e.g. Stripe, Google"
              />

              <TextInput
                label="Role *"
                value={newApp.role}
                onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
              />

              <TextInput
                label="Target Salary"
                value={newApp.salary}
                onChange={(e) => setNewApp({ ...newApp, salary: e.target.value })}
                placeholder="e.g. $180,000 - $210,000"
              />

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Stage</label>
                <select
                  value={newApp.status}
                  onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2 text-xs text-stone-800"
                >
                  {COLUMNS.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <CleanTextarea
                title="Notes"
                value={newApp.notes}
                onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                placeholder="e.g. Recruiter phone screen scheduled..."
                rows={2}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddApplication}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white shadow-2xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
