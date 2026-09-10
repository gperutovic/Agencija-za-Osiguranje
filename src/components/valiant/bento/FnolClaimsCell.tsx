import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldAlert, ArrowRight, UserCheck, Clock } from 'lucide-react';

export const FnolClaimsCell: React.FC = () => {
  return (
    <div className="rr-surface-card p-6 flex flex-col justify-between relative overflow-hidden group h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="rr-pill rr-pill--warning">
              <span className="rr-pill__dot" />
              Engine 03
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">AVG RESPONSE: 1.4H</span>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Autonomous FNOL & Life-Safety Triage
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Immediate incident triage detecting life-safety threats, verifying policy terms in real time, and dispatching dedicated Senior Adjusters.
        </p>

        {/* Visual Workflow Steps (RankRush Pipeline Cards) */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <div className="text-slate-300">
              <span className="text-red-400 font-bold font-mono">01.</span> Life-Safety 911 Emergency Intercept
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-white/[0.06] text-[11px]">
            <Clock className="w-4 h-4 text-[#fb6504] shrink-0" />
            <div className="text-slate-300">
              <span className="text-[#fb6504] font-bold font-mono">02.</span> Automated Policy Limit Verification
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 border border-white/[0.06] text-[11px]">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">03.</span> Direct Commercial Adjuster Assigned
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-white/[0.06]">
        <Link
          to="/claims/file"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all"
        >
          <span>Report an Incident (FNOL Intake)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
