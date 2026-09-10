import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, ArrowRight, UserCheck, Clock, Check } from 'lucide-react';

export const FnolClaimsCell: React.FC = () => {
  return (
    <div className="lg:col-span-4 vgr-bento-card p-6 flex flex-col justify-between relative overflow-hidden group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="vgr-pill bg-amber-500/10 text-amber-400 border-amber-500/20">
              Autonomous Claims Rail
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Mean: 1.4h</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Life-Safety Escalation & FNOL Triage
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Proprietary triage engine detecting bodily injury emergencies, verifying policy status in under 200ms, and dispatching licensed adjusters.
        </p>

        {/* Visual Workflow Steps */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <div className="text-slate-300">
              <span className="text-red-400 font-bold font-mono">STEP 1:</span> Life-Safety 911 Emergency Intercept
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px]">
            <Clock className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <div className="text-slate-300">
              <span className="text-[#38bdf8] font-bold font-mono">STEP 2:</span> Real-Time Coverage Verification
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[11px]">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">STEP 3:</span> Auto-Assigned Commercial Adjuster
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-2 border-t border-white/[0.06]">
        <Link
          to="/claims/file"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]"
        >
          <span>File a Claim (FNOL Intake)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

