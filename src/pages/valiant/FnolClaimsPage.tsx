import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  Search, 
  CheckCircle2, 
  Upload, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  UserCheck, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Shield 
} from 'lucide-react';
import { ValiantNavbar } from '../../components/valiant/Navbar';
import { ValiantFooter } from '../../components/valiant/Footer';
import { useValiantStore } from '../../services/valiantStore';
import { IncidentType, ClaimFnol, Policy } from '../../types/valiant';

export const FnolClaimsPage: React.FC = () => {
  const { policies, submitClaimFnol, initFirestoreSync } = useValiantStore();

  useEffect(() => {
    const unsub = initFirestoreSync();
    return () => {
      unsub();
    };
  }, [initFirestoreSync]);

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Stage 1: Life-Safety State
  const [lifeSafetyEmergency, setLifeSafetyEmergency] = useState<boolean | null>(null);

  // Stage 2: Policy Verification State
  const [searchPolicyKey, setSearchPolicyKey] = useState('VGR-CGL-2026-8801');
  const [verifiedPolicy, setVerifiedPolicy] = useState<Policy | null>(policies[0] || null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Stage 3: Incident Details
  const [incidentType, setIncidentType] = useState<IncidentType>('Third-Party Liability');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState('14:30');
  const [lossLocation, setLossLocation] = useState('Building 4, Cold Storage Dock 7, 1400 S. Desplaines St, Chicago, IL');
  const [description, setDescription] = useState(
    'During refrigerated pallet staging, an automated reach-truck mast sheared a critical overhead secondary glycol refrigerant pipe, causing pressurized coolant release and structural water intrusion to packing line 2.'
  );
  const [estimatedLoss, setEstimatedLoss] = useState<number>(38500);
  const [policeReportFiled, setPoliceReportFiled] = useState(true);

  // Stage 4: Evidence Drop-Zone
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string }>>([
    { name: 'Cold_Storage_Pipe_Rupture.jpg', size: '4.2 MB', type: 'image/jpeg' },
    { name: 'Chicago_Fire_Dept_Hazmat_Ticket.pdf', size: '1.8 MB', type: 'application/pdf' },
  ]);

  // Stage 5: Result
  const [submittedClaim, setSubmittedClaim] = useState<ClaimFnol | null>(null);

  // Verification Handler
  const handleVerifyPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerifyError(null);

    setTimeout(() => {
      const q = searchPolicyKey.trim().toUpperCase();
      const match = policies.find(
        (p) =>
          p.policy_number.toUpperCase() === q ||
          p.policy_number.toUpperCase().includes(q) ||
          q === '36-9812450'
      );

      if (match) {
        setVerifiedPolicy(match);
      } else {
        setVerifyError('No active commercial policy found matching number or EIN on date of loss.');
      }
      setIsVerifying(false);
    }, 450);
  };

  // Submit Handler
  const handleSubmitClaim = () => {
    if (!verifiedPolicy) return;

    const newClaim = submitClaimFnol({
      policy_id: verifiedPolicy.id,
      policy_number: verifiedPolicy.policy_number,
      incident_date: `${incidentDate}T${incidentTime}:00Z`,
      incident_type: incidentType,
      description,
      location: lossLocation,
      injuries_reported: false,
      police_report_filed: policeReportFiled,
      estimated_loss: estimatedLoss,
      document_urls: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
      ],
    });

    setSubmittedClaim(newClaim);
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col selection:bg-[#fb6504] selection:text-white font-sans">
      <ValiantNavbar />

      <main className="flex-1 py-12 relative overflow-hidden">
        <div className="ambient-glow-orange -top-20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <span className="rr-pill rr-pill--orange inline-flex">
              <span className="rr-pill__dot bg-[#fb6504]" />
              Autonomous FNOL Claims Rail
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              First Notice of Loss (FNOL) Claims Triage
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto">
              Automated claims intake, immediate life-safety triage, and instant licensed adjuster assignment.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="mb-8 p-3 rounded-2xl bg-[#0a0d16]/95 border border-white/[0.08] flex items-center justify-between text-xs font-mono">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#fb6504] font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-white/[0.05] border flex items-center justify-center text-[10px]">1</span>
              <span>Life-Safety</span>
            </div>
            <div className="h-[1px] flex-1 bg-white/[0.08] mx-2" />
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#fb6504] font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-white/[0.05] border flex items-center justify-center text-[10px]">2</span>
              <span>Policy Lookup</span>
            </div>
            <div className="h-[1px] flex-1 bg-white/[0.08] mx-2" />
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#fb6504] font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-white/[0.05] border flex items-center justify-center text-[10px]">3</span>
              <span>Incident Details</span>
            </div>
            <div className="h-[1px] flex-1 bg-white/[0.08] mx-2" />
            <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-[#fb6504] font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-white/[0.05] border flex items-center justify-center text-[10px]">4</span>
              <span>Evidence</span>
            </div>
            <div className="h-[1px] flex-1 bg-white/[0.08] mx-2" />
            <div className={`flex items-center gap-2 ${currentStep >= 5 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full bg-white/[0.05] border flex items-center justify-center text-[10px]">5</span>
              <span>Triage Summary</span>
            </div>
          </div>

          {/* Step Card Container */}
          <div className="rr-surface-card p-6 sm:p-10 shadow-2xl">
            {/* ======================================================== */}
            {/* STAGE 1: MANDATORY LIFE-SAFETY INTERCEPT */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto animate-pulse">
                    <ShieldAlert className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="rr-pill rr-pill--orange inline-flex font-mono">
                      MANDATORY LIFE-SAFETY PROTOCOL
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Are any active injuries, fires, or life-threatening emergencies present?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                      If anyone is injured or in immediate danger, do NOT submit online forms. First responder notification takes absolute precedence.
                    </p>
                  </div>

                  {lifeSafetyEmergency === true ? (
                    /* Life Safety Emergency Intercept HALT */
                    <div className="p-6 rounded-2xl bg-red-600/30 border border-red-500 text-left space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 text-white font-bold text-base">
                        <AlertTriangle className="w-5 h-5 text-red-300" />
                        <span>ONLINE INTAKE HALTED IMMEDIATELY</span>
                      </div>
                      <p className="text-xs text-red-100 leading-relaxed">
                        Please call emergency first responders right now. Once physical safety is confirmed and all injured parties are in professional medical care, you may resume claims settlement.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <a
                          href="tel:911"
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-600 text-white font-bold text-sm shadow-lg hover:bg-red-700 transition-colors cursor-pointer"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>Call 911 Emergency Services</span>
                        </a>
                        <a
                          href="tel:+18004928812"
                          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.1] text-white font-bold text-sm border border-white/20 hover:bg-white/20 transition-colors font-mono cursor-pointer"
                        >
                          <PhoneCall className="w-4 h-4 text-amber-400" />
                          <span>24/7 Crisis Line: 1-800-492-8812</span>
                        </a>
                      </div>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setLifeSafetyEmergency(false)}
                          className="text-xs text-slate-400 hover:text-white underline font-mono cursor-pointer"
                        >
                          No active emergency — proceed with property or liability claims form
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Dual Selection Action */
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => setLifeSafetyEmergency(true)}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                      >
                        YES — Emergency / Injury Present
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLifeSafetyEmergency(false);
                          setCurrentStep(2);
                        }}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-xs shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>NO — Property / Liability Only (Proceed)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 2: POLICY VERIFICATION */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 2 of 5 • Real-Time Policy Lookup
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Coverage Verification on Date of Loss
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Query active commercial insurance ledger to verify line of business and deductibles.
                  </p>
                </div>

                <form onSubmit={handleVerifyPolicy} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Enter Policy Number or Corporate EIN <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={searchPolicyKey}
                        onChange={(e) => setSearchPolicyKey(e.target.value)}
                        placeholder="e.g. VGR-CGL-2026-8801 or 36-9812450"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#fb6504] font-mono"
                      />
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="px-5 py-2.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isVerifying ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  {verifyError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{verifyError}</span>
                    </div>
                  )}

                  {verifiedPolicy && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                      <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>COVERAGE ACTIVE ON DATE OF LOSS</span>
                        </span>
                        <span>{verifiedPolicy.status.toUpperCase()}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono pt-2 text-slate-300">
                        <div>
                          <div className="text-slate-500 text-[9.5px]">CARRIER</div>
                          <div className="font-bold text-white truncate">{verifiedPolicy.carrier_name}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[9.5px]">LINE</div>
                          <div className="font-bold text-white">{verifiedPolicy.line_of_business}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[9.5px]">AGGREGATE LIMIT</div>
                          <div className="font-bold text-white">${(verifiedPolicy.aggregate_limit / 1000000).toFixed(0)}M</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[9.5px]">DEDUCTIBLE</div>
                          <div className="font-bold text-white">${verifiedPolicy.deductible.toLocaleString('en-US')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={!verifiedPolicy}
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <span>Proceed to Incident Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 3: INCIDENT DETAILS */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 3 of 5 • Loss Narrative & Parameters
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Incident Circumstances & Preliminary Loss Magnitude
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Chronological loss data to assist algorithmic reserve allocation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1.5">
                      Loss Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={incidentType}
                      onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white focus:outline-none focus:border-[#fb6504]"
                    >
                      <option value="Property Damage">Commercial Property Damage</option>
                      <option value="Third-Party Liability">Third-Party Operations Liability</option>
                      <option value="Cyber Breach">Cyber Security Incident / Extortion</option>
                      <option value="Bodily Injury">Bodily Injury (Non-Life Threatening)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-mono uppercase text-slate-300 mb-1.5">
                        Date of Loss <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white focus:outline-none focus:border-[#fb6504] font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono uppercase text-slate-300 mb-1.5">
                        Time of Loss
                      </label>
                      <input
                        type="time"
                        value={incidentTime}
                        onChange={(e) => setIncidentTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white focus:outline-none focus:border-[#fb6504] font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono uppercase text-slate-300 mb-1.5">
                      Loss Physical Location <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={lossLocation}
                        onChange={(e) => setLossLocation(e.target.value)}
                        placeholder="Street, City, State, Building / Suite..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-mono uppercase text-slate-300 mb-1.5">
                      Narrative Description of Circumstances <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detail specifically what occurred, equipment involved, and any immediate containment actions taken..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-[#fb6504] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono uppercase text-slate-300 mb-1.5">
                      Estimated Loss Range (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                      <input
                        type="number"
                        min={0}
                        value={estimatedLoss}
                        onChange={(e) => setEstimatedLoss(Number(e.target.value))}
                        className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-[#06080c] border border-white/[0.1] text-white focus:outline-none focus:border-[#fb6504] font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] w-full cursor-pointer">
                      <input
                        type="checkbox"
                        checked={policeReportFiled}
                        onChange={(e) => setPoliceReportFiled(e.target.checked)}
                        className="w-4 h-4 rounded text-[#fb6504] accent-[#fb6504]"
                      />
                      <div>
                        <div className="font-semibold text-white">Police / Fire Marshal Report Filed</div>
                        <div className="text-[10px] text-slate-400">Official incident report reference will be requested</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-semibold text-xs shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Evidentiary Upload</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 4: EVIDENTIARY DROP-ZONE */}
            {/* ======================================================== */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.08] pb-4">
                  <span className="text-xs font-mono text-[#fb6504] uppercase tracking-wider font-bold">
                    Stage 4 of 5 • Digital Evidence Vault
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                    Evidentiary Drop-Zone & Repair Documentation
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload scene photographs, invoices, fire marshal tickets, or repair estimates.
                  </p>
                </div>

                {/* Drop Area */}
                <div className="border-2 border-dashed border-white/[0.15] hover:border-[#fb6504]/50 rounded-2xl p-8 text-center bg-white/[0.01] transition-all space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#fb6504]/10 text-[#fb6504] border border-[#fb6504]/20 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Drag and drop evidence files here
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      JPG, PNG, PDF, or MP4 up to 50 MB per file
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFiles((prev) => [
                        ...prev,
                        { name: `Cold_Chain_Inspection_Log_${Date.now().toString().slice(-4)}.pdf`, size: '2.1 MB', type: 'application/pdf' },
                      ]);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.1] cursor-pointer"
                  >
                    Simulate File Selection
                  </button>
                </div>

                {/* File Attachment List */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase">Attached Evidence ({uploadedFiles.length})</div>
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#fb6504]" />
                        <span className="font-mono text-white">{file.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">({file.size})</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Encrypted (AES-256)</span>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitClaim}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white font-bold text-xs shadow-[0_0_25px_-3px_rgba(251,101,4,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Submit FNOL Claim to Triage Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* STAGE 5: TRIAGE SUMMARY & ADJUSTER ASSIGNMENT */}
            {/* ======================================================== */}
            {currentStep === 5 && submittedClaim && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="rr-pill rr-pill--orange inline-flex font-mono">
                    <span className="rr-pill__dot bg-emerald-400" />
                    CLAIM TRIAGED & DISPATCHED
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Claim #{submittedClaim.id.toUpperCase()} Successfully Lodged
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-lg mx-auto">
                    Immutable tracking ID generated • Policy #{verifiedPolicy?.policy_number} • Commercial coverage active
                  </p>
                </div>

                {/* Status Tracker */}
                <div className="p-4 rounded-2xl bg-[#06080c] border border-white/[0.08] max-w-xl mx-auto text-left space-y-3">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Real-Time Claim Triage Timeline
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <div>1. Triaged</div>
                      <div className="text-[9px] text-emerald-300 mt-0.5">COMPLETED</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#fb6504]/10 text-[#fb6504] border border-[#fb6504]/25">
                      <div>2. Adjuster</div>
                      <div className="text-[9px] text-[#fb6504] mt-0.5">ASSIGNED</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] text-slate-500 border border-white/[0.06]">
                      <div>3. Reserve</div>
                      <div className="text-[9px] mt-0.5">PENDING</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.02] text-slate-500 border border-white/[0.06]">
                      <div>4. Settlement</div>
                      <div className="text-[9px] mt-0.5">QUEUED</div>
                    </div>
                  </div>
                </div>

                {/* Assigned Adjuster Card */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] max-w-xl mx-auto text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#fb6504] to-[#ff7b1a] text-white flex items-center justify-center font-bold font-mono">
                      MV
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#fb6504] uppercase font-bold">Assigned Commercial Adjuster</div>
                      <div className="text-sm font-bold text-white">{submittedClaim.assigned_adjuster}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{submittedClaim.adjuster_email}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Direct Desk Phone:</span>
                    <span className="text-white font-bold">{submittedClaim.adjuster_phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link
                    to="/portal"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb6504] hover:bg-[#ff7b1a] text-white text-xs font-bold shadow-[0_0_20px_-3px_rgba(251,101,4,0.5)] transition-all cursor-pointer"
                  >
                    <span>View in Enterprise Client Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setSubmittedClaim(null);
                    }}
                    className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-bold border border-white/[0.1] transition-all cursor-pointer"
                  >
                    File Another Claim
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ValiantFooter />
    </div>
  );
};

