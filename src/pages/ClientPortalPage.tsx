import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  FileCheck2,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { agencyRepository } from '../services/agencyRepository';
import {
  AdvisorThreadMessage,
  ClaimRecord,
  PolicyEndorsement,
  PolicyRecord,
} from '../types/domain';
import { downloadPolicyDocumentPdf } from '../utils/documentGenerator';
import { daysUntilDate, formatDateHr, formatDateTimeHr, formatEur } from '../utils/formatters';
import { ClaimStageTimeline } from './ClaimsFnolPage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

export const ClientPortalPage: React.FC = () => {
  const { user, isAgent, signInWithEmail, registerClient, signInAsDemo, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auth Gate Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Portal Workspace State
  const [activeTab, setActiveTab] = useState<'wallet' | 'claims' | 'messages'>('wallet');
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [messages, setMessages] = useState<AdvisorThreadMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Policy Modification Modal State
  const [endorsePolicy, setEndorsePolicy] = useState<PolicyRecord | null>(null);
  const [endorseType, setEndorseType] = useState<PolicyEndorsement['type']>('add_driver');
  const [endorseNote, setEndorseNote] = useState('');

  const loadWorkspace = async (uid: string) => {
    const [p, c, m] = await Promise.all([
      agencyRepository.getPolicies(uid),
      agencyRepository.getClaims(uid),
      agencyRepository.getMessages(uid),
    ]);
    setPolicies(p);
    setClaims(c);
    setMessages(m);
  };

  useEffect(() => {
    if (user) {
      void loadWorkspace(user.uid);
    }
  }, [user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email.includes('@') || password.length < 6) {
      setAuthError('Unesite ispravnu e-mail adresu i lozinku (najmanje 6 znakova).');
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const logged = await signInWithEmail(email, password);
        showToast(`Dobrodošli natrag, ${logged.fullName}.`, 'success');
      } else {
        if (fullName.trim().length < 3) {
          setAuthError('Unesite puno ime i prezime.');
          return;
        }
        const created = await registerClient({
          fullName,
          email,
          password,
          phone: phone || '+385 91 000 0000',
        });
        showToast(`Profil kreiran za ${created.fullName}.`, 'success');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickRenewal = async (policy: PolicyRecord) => {
    await agencyRepository.requestPolicyEndorsement(
      policy.id,
      'renewal_request',
      `Zahtjev za obnovu police ${policy.policyNumber} uz usporedbu novih tarifa.`
    );
    showToast(`Zahtjev za obnovu police ${policy.policyNumber} je zaprimljen.`, 'success');
    if (user) await loadWorkspace(user.uid);
  };

  const handleEndorsementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endorsePolicy || endorseNote.trim().length < 5) {
      showToast('Opišite traženu izmjenu (najmanje 5 znakova).', 'error');
      return;
    }
    await agencyRepository.requestPolicyEndorsement(
      endorsePolicy.id,
      endorseType,
      endorseNote.trim()
    );
    showToast(`Zahtjev za izmjenu police ${endorsePolicy.policyNumber} je spremljen.`, 'success');
    setEndorsePolicy(null);
    setEndorseNote('');
    if (user) await loadWorkspace(user.uid);
  };

  const handleAdditionalClaimUpload = async (claimId: string, file: File | undefined) => {
    if (!file || !user) return;
    const attachment = await agencyRepository.uploadClaimAttachment(claimId, file);
    await agencyRepository.appendClaimAttachment(claimId, attachment);
    showToast(`Dokument ${file.name} dodan u prijavu štete.`, 'success');
    await loadWorkspace(user.uid);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    await agencyRepository.sendMessage({
      threadUserId: user.uid,
      senderRole: 'client',
      senderName: user.fullName,
      text: newMessage.trim(),
    });
    setNewMessage('');
    await loadWorkspace(user.uid);
  };

  // EXPLICIT AUTHENTICATION GATE (Never auto-authenticated!)
  if (!user) {
    return (
      <div className="bg-canvas-warm py-14 sm:py-20">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Moj Profil
            </p>
            <h1 className="font-display text-4xl text-ink">
              {authMode === 'login' ? 'Prijava u digitalni novčanik' : 'Kreiraj klijentski račun'}
            </h1>
            <p className="text-sm text-ink-secondary">
              Pristupite aktivnim policama, Zelenoj karti, prijavljenim štetama i porukama sa
              svojim zastupnikom.
            </p>
          </div>

          <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-5 shadow-subtle">
            <div className="grid grid-cols-2 rounded-lg bg-canvas-warm p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 rounded-md ${
                  authMode === 'login' ? 'bg-canvas text-ink shadow-subtle' : 'text-ink-secondary'
                }`}
              >
                Prijava
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2 rounded-md ${
                  authMode === 'register' ? 'bg-canvas text-ink shadow-subtle' : 'text-ink-secondary'
                }`}
              >
                Registracija
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' ? (
                <>
                  <Input
                    label="Ime i prezime"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ana Horvat"
                  />
                  <Input
                    label="Mobitel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+385 91 234 5678"
                    tabular
                  />
                </>
              ) : null}

              <Input
                label="E-mail adresa"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ime@email.hr"
              />
              <Input
                label="Lozinka"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Najmanje 6 znakova"
              />
              {authError ? (
                <p role="alert" className="text-xs font-medium text-status-danger">
                  {authError}
                </p>
              ) : null}
              <Button type="submit" fullWidth size="lg" isLoading={authLoading}>
                {authMode === 'login' ? 'Prijavi se' : 'Registriraj račun'}
              </Button>
            </form>

            {/* Transparent Demo Access Controls */}
            <div className="pt-5 border-t border-hairline space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted text-center">
                Brzi demo pristup za evaluaciju
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const demo = signInAsDemo('client');
                    showToast(`Prijavljeni ste kao klijent ${demo.fullName}.`, 'info');
                  }}
                >
                  Klijent (Ana Horvat)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const demo = signInAsDemo('agent');
                    showToast(`Prijavljeni ste kao zastupnik ${demo.fullName}.`, 'info');
                    navigate('/admin');
                  }}
                >
                  Zastupnik (Admin)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED CLIENT WORKSPACE
  const totalAnnualSpend = policies.reduce((sum, p) => sum + p.annualPremium, 0);
  const nextExpiryDays =
    policies.length > 0
      ? Math.min(...policies.map((p) => Math.max(0, daysUntilDate(p.expiryDate))))
      : null;
  const openClaimsCount = claims.filter((c) => c.stage !== 'paid').length;

  return (
    <div className="bg-canvas-warm min-h-[80vh] py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Moj Profil • Digitalni novčanik
            </p>
            <h1 className="font-display text-3xl sm:text-5xl text-ink mt-1">
              Dobrodošli, {user.fullName}
            </h1>
            <p className="text-xs text-ink-muted mt-1 tabular-nums">
              {user.email} {user.oib ? `• OIB: ${user.oib}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isAgent ? (
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin')}>
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                <span>Otvori Operativu (/admin)</span>
              </Button>
            ) : null}
            <Button size="sm" onClick={() => navigate('/izracun')}>
              <Plus className="w-4 h-4" strokeWidth={1.75} />
              <span>Nova polica</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                showToast('Odjavili ste se iz sustava.', 'info');
              }}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>Odjava</span>
            </Button>
          </div>
        </div>

        {/* Overview KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Aktivne police</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">{policies.length}</div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Sljedeći istek police</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">
              {nextExpiryDays !== null ? `${nextExpiryDays} dana` : '—'}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Godišnji trošak polica</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">
              {formatEur(totalAnnualSpend)}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">Otvorene prijave štete</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">{openClaimsCount}</div>
          </div>
        </div>

        {/* Workspace Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-3">
          {(
            [
              { id: 'wallet', label: `Novčanik polica (${policies.length})` },
              { id: 'claims', label: `Moje štete (${claims.length})` },
              { id: 'messages', label: `Poruke sa zastupnikom (${messages.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === t.id
                  ? 'bg-ink text-white'
                  : 'bg-canvas border border-hairline text-ink-secondary hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DIGITAL POLICY WALLET */}
        {activeTab === 'wallet' ? (
          <div className="space-y-4">
            {policies.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center space-y-3">
                <p className="text-sm text-ink-secondary">
                  Još nemate spremljenih aktivnih polica na ovom računu.
                </p>
                <Button onClick={() => navigate('/izracun')}>Izračunaj prvu policu</Button>
              </div>
            ) : (
              policies.map((pol) => {
                const daysLeft = daysUntilDate(pol.expiryDate);
                return (
                  <article
                    key={pol.id}
                    className="rounded-editorial bg-canvas border border-hairline p-6 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-ink tabular-nums">
                            {pol.policyNumber}
                          </span>
                          <Badge
                            variant={
                              pol.status === 'pending_renewal'
                                ? 'accent'
                                : daysLeft <= 30
                                  ? 'warning'
                                  : 'success'
                            }
                          >
                            {pol.status === 'pending_renewal'
                              ? 'Obnova u obradi'
                              : daysLeft <= 30
                                ? `Istječe za ${daysLeft} dana`
                                : 'Aktivna'}
                          </Badge>
                        </div>
                        <h2 className="font-sans text-lg font-bold text-ink">{pol.carrierName}</h2>
                        <p className="text-sm text-ink-secondary">{pol.assetSummary}</p>
                        <p className="text-xs text-ink-muted tabular-nums">
                          Vrijedi: {formatDateHr(pol.startDate)} – {formatDateHr(pol.expiryDate)} •
                          Franšiza: {formatEur(pol.deductible)}
                        </p>
                      </div>

                      <div className="text-left md:text-right tabular-nums shrink-0">
                        <div className="text-2xl font-bold text-ink">
                          {formatEur(pol.annualPremium)}
                        </div>
                        <div className="text-xs text-ink-muted">
                          {formatEur(pol.monthlyPremium)} / mj.
                        </div>
                      </div>
                    </div>

                    {pol.endorsements.length > 0 ? (
                      <div className="rounded-lg bg-canvas-warm border border-hairline p-3 space-y-1">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Zadnji zahtjevi za izmjenu
                        </div>
                        {pol.endorsements.slice(0, 2).map((end) => (
                          <div key={end.id} className="text-xs text-ink flex justify-between gap-2">
                            <span>{end.summary}</span>
                            <span className="text-ink-muted tabular-nums shrink-0">
                              {formatDateHr(end.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="pt-4 border-t border-hairline flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPolicyDocumentPdf(pol, 'policy')}
                      >
                        <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Polica PDF</span>
                      </Button>
                      {pol.productLine === 'auto' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadPolicyDocumentPdf(pol, 'green_card')}
                        >
                          <FileCheck2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Zelena karta</span>
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPolicyDocumentPdf(pol, 'ipid')}
                      >
                        <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>IPID</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEndorsePolicy(pol)}
                      >
                        <span>Zatraži izmjenu</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => void handleQuickRenewal(pol)}
                        disabled={pol.status === 'pending_renewal'}
                      >
                        <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>
                          {pol.status === 'pending_renewal' ? 'Obnova zatražena' : 'Obnovi policu'}
                        </span>
                      </Button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        ) : null}

        {/* TAB 2: CLAIMS HISTORY & EXTRA UPLOAD */}
        {activeTab === 'claims' ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to="/prijava-stete"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>Prijavi novu štetu</span>
              </Link>
            </div>
            {claims.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center text-sm text-ink-secondary">
                Trenutno nemate prijavljenih šteta.
              </div>
            ) : (
              claims.map((claim) => (
                <article
                  key={claim.id}
                  className="rounded-editorial bg-canvas border border-hairline p-6 space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-ink tabular-nums">
                        {claim.referenceNumber} • Polica {claim.policyNumber}
                      </div>
                      <h3 className="font-sans text-base font-semibold text-ink mt-0.5">
                        {claim.carrierName} — {claim.incidentLocation}
                      </h3>
                      <p className="text-xs text-ink-secondary mt-1">{claim.description}</p>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-hairline text-xs font-semibold text-ink hover:bg-canvas-warm cursor-pointer">
                      <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Dodaj dokument ({claim.attachments.length})</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) =>
                          void handleAdditionalClaimUpload(claim.id, e.target.files?.[0])
                        }
                      />
                    </label>
                  </div>
                  <ClaimStageTimeline stage={claim.stage} />
                </article>
              ))
            )}
          </div>
        ) : null}

        {/* TAB 3: DOCUMENT & MESSAGE CENTER */}
        {activeTab === 'messages' ? (
          <div className="rounded-editorial bg-canvas border border-hairline overflow-hidden">
            <div className="px-6 py-4 border-b border-hairline bg-canvas-warm flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <MessageSquare className="w-4 h-4 text-accent" strokeWidth={1.5} />
                <span>Vaš dodijeljeni zastupnik: Marko Kovač (HANFA ZO-2024-11820)</span>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.senderRole === 'client' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-editorial px-4 py-3 text-sm ${
                      msg.senderRole === 'client'
                        ? 'bg-ink text-white'
                        : 'bg-canvas-warm border border-hairline text-ink'
                    }`}
                  >
                    <div className="text-[11px] opacity-70 mb-1">
                      {msg.senderName} • {formatDateTimeHr(msg.createdAt)}
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-hairline flex items-center gap-2.5"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Napišite poruku svom zastupniku..."
                className="flex-1 h-11 rounded-lg border border-hairline-strong px-3.5 text-sm text-ink focus:outline-none focus:border-accent"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" strokeWidth={1.75} />
                <span>Pošalji</span>
              </Button>
            </form>
          </div>
        ) : null}
      </div>

      {/* Policy Modification Modal */}
      <Modal
        isOpen={Boolean(endorsePolicy)}
        onClose={() => setEndorsePolicy(null)}
        title="Zahtjev za izmjenu police"
        subtitle={endorsePolicy ? `Polica: ${endorsePolicy.policyNumber}` : undefined}
      >
        <form onSubmit={handleEndorsementSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink">Vrsta izmjene</label>
            <select
              value={endorseType}
              onChange={(e) => setEndorseType(e.target.value as PolicyEndorsement['type'])}
              className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink"
            >
              <option value="add_driver">Dodavanje dodatnog vozača</option>
              <option value="change_address">Promjena adrese / prebivališta</option>
              <option value="add_coverage">Proširenje pokrića (npr. stakla, potres)</option>
              <option value="renewal_request">Zahtjev za prijevremenu obnovu</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink">Detalji izmjene *</label>
            <textarea
              rows={3}
              value={endorseNote}
              onChange={(e) => setEndorseNote(e.target.value)}
              placeholder="Upišite novu adresu, podatke o vozaču ili željeno dodatno pokriće..."
              className="w-full rounded-lg border border-hairline-strong p-3 text-sm text-ink focus:outline-none focus:border-accent"
            />
          </div>
          <Button type="submit" fullWidth>
            Pošalji zahtjev za izmjenu
          </Button>
        </form>
      </Modal>
    </div>
  );
};
