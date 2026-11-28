import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  FileImage,
  KeyRound,
  LogOut,
  MailCheck,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { IS_DEMO_MODE_ENABLED, useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { agencyRepository } from '../services/agencyRepository';
import {
  AdvisorThreadMessage,
  ClaimAttachment,
  ClaimRecord,
  PolicyEndorsement,
  PolicyRecord,
} from '../types/domain';
import {
  isValidCroatianPhone,
  isValidCroatianPostalCode,
  isValidOIB,
} from '../utils/croatianValidators';
import { downloadPolicyDocumentPdf } from '../utils/documentGenerator';
import { daysUntilDate, formatDateHr, formatDateTimeHr, formatEur } from '../utils/formatters';
import { ClaimStageTimeline, getClaimStageLabel } from './ClaimsFnolPage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { CardSkeleton, ErrorBanner } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export const ClientPortalPage: React.FC = () => {
  const {
    user,
    emailVerified,
    authReady,
    isAgent,
    signInWithEmail,
    signInWithGoogle,
    registerClient,
    sendPasswordReset,
    resendVerificationEmail,
    updateProfileData,
    changePassword,
    signInAsDemo,
    logout,
  } = useAuth();
  const { language, copy, t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Auth Gate Form State
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [oibInput, setOibInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Portal Workspace State
  const [activeTab, setActiveTab] = useState<'wallet' | 'claims' | 'messages' | 'settings'>('wallet');
  const [policies, setPolicies] = useState<PolicyRecord[]>([]);
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [messages, setMessages] = useState<AdvisorThreadMessage[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');
  const [reloadNonce, setReloadNonce] = useState(0);

  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [resendingVerify, setResendingVerify] = useState(false);

  // Policy Modification & Renewal Confirmation Modals
  const [endorsePolicy, setEndorsePolicy] = useState<PolicyRecord | null>(null);
  const [endorseType, setEndorseType] = useState<PolicyEndorsement['type']>('add_driver');
  const [endorseNote, setEndorseNote] = useState('');
  const [endorseSaving, setEndorseSaving] = useState(false);

  const [confirmRenewPolicy, setConfirmRenewPolicy] = useState<PolicyRecord | null>(null);
  const [renewSaving, setRenewSaving] = useState(false);

  // Profile Settings State
  const [profName, setProfName] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profOib, setProfOib] = useState('');
  const [profAddress, setProfAddress] = useState('');
  const [profCity, setProfCity] = useState('');
  const [profPostal, setProfPostal] = useState('');
  const [profSaving, setProfSaving] = useState(false);
  const [profError, setProfError] = useState('');

  // Password Change State
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    if (!user) return;
    setProfName(user.fullName);
    setProfPhone(user.phone || '');
    setProfOib(user.oib || '');
    setProfAddress(user.address || '');
    setProfCity(user.city || '');
    setProfPostal(user.postalCode || '');
  }, [user]);

  useEffect(() => {
    if (!user) {
      setPolicies([]);
      setClaims([]);
      setMessages([]);
      return;
    }
    setWorkspaceLoading(true);
    setWorkspaceError('');
    const unsubscribe = agencyRepository.subscribeClientWorkspace(
      user.uid,
      (partial) => {
        if (partial.policies) setPolicies(partial.policies);
        if (partial.claims) setClaims(partial.claims);
        if (partial.messages) setMessages(partial.messages);
        setWorkspaceLoading(false);
      },
      (err) => {
        setWorkspaceError(err.message);
        setWorkspaceLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user, reloadNonce]);

  // Dynamically resolve assigned advisor (NEVER hardcoded)
  const advisorInfo = useMemo(() => {
    const advisorName =
      user?.assignedAgent ||
      policies.find((p) => p.assignedAgent)?.assignedAgent ||
      messages.find((m) => m.senderRole === 'agent')?.senderName;

    if (advisorName) {
      const matched = BRAND_CONFIG.licensedAdvisors.find((a) => a.name === advisorName);
      const license =
        user?.assignedAgentLicense ||
        policies.find((p) => p.assignedAgent === advisorName)?.assignedAgentLicense ||
        matched?.hanfaLicense;
      return {
        label: license
          ? `${t('Vaš dodijeljeni zastupnik:', 'Your assigned advisor:')} ${advisorName} (HANFA ${license})`
          : `${t('Vaš dodijeljeni zastupnik:', 'Your assigned advisor:')} ${advisorName}`,
      };
    }

    return {
      label:
        language === 'en'
          ? `${BRAND_CONFIG.defaultAdvisorDeskEn} (HANFA ${BRAND_CONFIG.hanfaRegistrationNumber})`
          : `${BRAND_CONFIG.defaultAdvisorDeskHr} (HANFA ${BRAND_CONFIG.hanfaRegistrationNumber})`,
    };
  }, [user, policies, messages, language, t]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setResetSent(false);

    if (!email.includes('@')) {
      setAuthError(t('Unesite ispravnu e-mail adresu.', 'Enter a valid e-mail address.'));
      return;
    }

    if (authMode === 'reset') {
      setAuthLoading(true);
      try {
        await sendPasswordReset(email, language);
        setResetSent(true);
        showToast(
          t('Poveznica za reset lozinke poslana je na vaš e-mail.', 'Password reset link sent to your e-mail.'),
          'success'
        );
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : t('Greška pri slanju.', 'Failed to send reset link.'));
      } finally {
        setAuthLoading(false);
      }
      return;
    }

    if (password.length < 6) {
      setAuthError(t('Lozinka mora imati najmanje 6 znakova.', 'Password must be at least 6 characters.'));
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const logged = await signInWithEmail(email, password, language);
        showToast(t(`Dobrodošli natrag, ${logged.fullName}.`, `Welcome back, ${logged.fullName}.`), 'success');
      } else {
        if (fullName.trim().length < 3) {
          setAuthError(t('Unesite puno ime i prezime.', 'Enter your full name.'));
          return;
        }
        if (phone.trim() && !isValidCroatianPhone(phone)) {
          setAuthError(
            t('Unesite ispravan hrvatski broj telefona (npr. +385 91 234 5678).', 'Enter a valid Croatian phone number.')
          );
          return;
        }
        if (oibInput.trim() && !isValidOIB(oibInput)) {
          setAuthError(t('Uneseni OIB nije ispravan (11 znamenki, ISO 7064).', 'Invalid Croatian OIB (11 digits, ISO 7064).'));
          return;
        }
        const created = await registerClient(
          {
            fullName,
            email,
            password,
            phone: phone.trim(),
            oib: oibInput.trim() || undefined,
          },
          language
        );
        showToast(t(`Profil kreiran za ${created.fullName}.`, `Account created for ${created.fullName}.`), 'success');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : t('Prijava nije uspjela.', 'Authentication failed.'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const logged = await signInWithGoogle(language);
      showToast(t(`Prijavljeni ste kao ${logged.fullName}.`, `Signed in as ${logged.fullName}.`), 'success');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : t('Google prijava nije uspjela.', 'Google sign-in failed.'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleConfirmRenewal = async () => {
    if (!confirmRenewPolicy) return;
    setRenewSaving(true);
    try {
      await agencyRepository.requestPolicyEndorsement(
        confirmRenewPolicy.id,
        'renewal_request',
        `Zahtjev za obnovu police ${confirmRenewPolicy.policyNumber} uz usporedbu novih tarifa.`
      );
      showToast(
        t(
          `Zahtjev za obnovu police ${confirmRenewPolicy.policyNumber} je zaprimljen.`,
          `Renewal request for ${confirmRenewPolicy.policyNumber} submitted.`
        ),
        'success'
      );
      setConfirmRenewPolicy(null);
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Greška pri obnovi.', 'Renewal failed.'), 'error');
    } finally {
      setRenewSaving(false);
    }
  };

  const handleEndorsementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!endorsePolicy || endorseNote.trim().length < 5) {
      showToast(
        t('Opišite traženu izmjenu (najmanje 5 znakova).', 'Describe the requested change (min 5 characters).'),
        'error'
      );
      return;
    }
    setEndorseSaving(true);
    try {
      await agencyRepository.requestPolicyEndorsement(
        endorsePolicy.id,
        endorseType,
        endorseNote.trim()
      );
      showToast(
        t(
          `Zahtjev za izmjenu police ${endorsePolicy.policyNumber} je spremljen.`,
          `Endorsement request for ${endorsePolicy.policyNumber} saved.`
        ),
        'success'
      );
      setEndorsePolicy(null);
      setEndorseNote('');
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Spremanje nije uspjelo.', 'Save failed.'), 'error');
    } finally {
      setEndorseSaving(false);
    }
  };

  const handleAdditionalClaimUpload = async (claimId: string, file: File | undefined) => {
    if (!file || !user) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast(t('Datoteka prelazi 10 MB.', 'File exceeds 10 MB limit.'), 'error');
      return;
    }
    try {
      const attachment = await agencyRepository.uploadClaimAttachment(claimId, file);
      await agencyRepository.appendClaimAttachment(claimId, attachment);
      showToast(
        t(`Dokument ${file.name} dodan u prijavu štete.`, `Document ${file.name} attached to claim.`),
        'success'
      );
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Prijenos nije uspio.', 'Upload failed.'), 'error');
    }
  };

  const handleOpenAttachment = async (att: ClaimAttachment) => {
    const url = await agencyRepository.resolveAttachmentDownloadUrl(att);
    if (!url) {
      showToast(t('Pregled datoteke trenutno nije dostupan.', 'File preview unavailable.'), 'info');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || sendingMsg) return;
    setSendingMsg(true);
    try {
      await agencyRepository.sendMessage({
        threadUserId: user.uid,
        senderRole: 'client',
        senderName: user.fullName,
        text: newMessage.trim(),
      });
      setNewMessage('');
      setReloadNonce((n) => n + 1);
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('Slanje poruke nije uspjelo.', 'Failed to send message.'), 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfError('');
    if (profName.trim().length < 3) {
      setProfError(t('Unesite ime i prezime.', 'Enter your full name.'));
      return;
    }
    if (profPhone.trim() && !isValidCroatianPhone(profPhone)) {
      setProfError(t('Unesite ispravan hrvatski broj telefona.', 'Enter a valid Croatian phone number.'));
      return;
    }
    if (profOib.trim() && !isValidOIB(profOib)) {
      setProfError(t('OIB nije ispravan prema ISO 7064 provjeri.', 'Invalid Croatian OIB (ISO 7064).'));
      return;
    }
    if (profPostal.trim() && !isValidCroatianPostalCode(profPostal)) {
      setProfError(t('Poštanski broj mora biti između 10000 i 53296.', 'Postal code must be 10000–53296.'));
      return;
    }

    setProfSaving(true);
    try {
      await updateProfileData({
        fullName: profName,
        phone: profPhone,
        oib: profOib,
        address: profAddress,
        city: profCity,
        postalCode: profPostal,
      });
      showToast(t('Postavke profila su uspješno spremljene.', 'Profile settings saved.'), 'success');
    } catch (err) {
      setProfError(err instanceof Error ? err.message : t('Spremanje profila nije uspjelo.', 'Failed to save profile.'));
    } finally {
      setProfSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    if (newPwd.length < 6) {
      setPwdError(t('Nova lozinka mora imati najmanje 6 znakova.', 'New password must be at least 6 characters.'));
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError(t('Lozinke se ne podudaraju.', 'Passwords do not match.'));
      return;
    }
    setPwdSaving(true);
    try {
      await changePassword(currPwd, newPwd, language);
      setCurrPwd('');
      setNewPwd('');
      setConfirmPwd('');
      showToast(t('Lozinka je uspješno promijenjena.', 'Password updated successfully.'), 'success');
    } catch (err) {
      setPwdError(err instanceof Error ? err.message : t('Promjena lozinke nije uspjela.', 'Password change failed.'));
    } finally {
      setPwdSaving(false);
    }
  };

  if (!authReady) {
    return (
      <div className="bg-canvas-warm min-h-[70vh] py-14">
        <div className="max-w-md mx-auto px-4">
          <CardSkeleton rows={2} />
        </div>
      </div>
    );
  }

  // AUTHENTICATION GATE (Strict Firebase Auth — Zero demo bypasses in production!)
  if (!user) {
    return (
      <div className="bg-canvas-warm py-14 sm:py-20">
        <div className="max-w-md mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {copy.nav.myProfile}
            </p>
            <h1 className="font-display text-4xl text-ink">
              {authMode === 'login'
                ? t('Prijava u digitalni novčanik', 'Sign in to Digital Wallet')
                : authMode === 'register'
                  ? t('Kreiraj klijentski račun', 'Create Client Account')
                  : t('Oporavak lozinke', 'Reset Password')}
            </h1>
            <p className="text-sm text-ink-secondary">
              {t(
                'Pristupite aktivnim policama, Zelenoj karti, prijavljenim štetama i porukama sa svojim zastupnikom.',
                'Access active policies, Green Cards, claim timelines, and direct advisor messaging.'
              )}
            </p>
          </div>

          <div className="rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-5 shadow-subtle">
            {authMode !== 'reset' ? (
              <div className="grid grid-cols-2 rounded-lg bg-canvas-warm p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className={`py-2 rounded-md transition-colors ${
                    authMode === 'login' ? 'bg-canvas text-ink shadow-subtle' : 'text-ink-secondary'
                  }`}
                >
                  {t('Prijava', 'Sign In')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className={`py-2 rounded-md transition-colors ${
                    authMode === 'register' ? 'bg-canvas text-ink shadow-subtle' : 'text-ink-secondary'
                  }`}
                >
                  {t('Registracija', 'Register')}
                </button>
              </div>
            ) : null}

            <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
              {authMode === 'register' ? (
                <>
                  <Input
                    label={t('Ime i prezime *', 'Full name *')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ana Horvat"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label={t('Mobitel (opcionalno)', 'Phone (optional)')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+385 91 234 5678"
                      tabular
                    />
                    <Input
                      label={t('OIB (opcionalno)', 'OIB (optional)')}
                      value={oibInput}
                      onChange={(e) => setOibInput(e.target.value)}
                      placeholder="26182105152"
                      maxLength={11}
                      tabular
                    />
                  </div>
                </>
              ) : null}

              <Input
                label={t('E-mail adresa *', 'E-mail address *')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ime@email.hr"
              />

              {authMode !== 'reset' ? (
                <div className="space-y-1.5">
                  <Input
                    label={t('Lozinka *', 'Password *')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('Najmanje 6 znakova', 'At least 6 characters')}
                  />
                  {authMode === 'login' ? (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('reset');
                          setAuthError('');
                          setResetSent(false);
                        }}
                        className="text-xs font-medium text-ink-secondary hover:text-accent transition-colors"
                      >
                        {t('Zaboravili ste lozinku?', 'Forgot password?')}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {resetSent ? (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-status-success font-medium">
                  {t(
                    'Ako račun postoji, poslali smo upute za postavljanje nove lozinke na unesenu e-mail adresu.',
                    'If an account exists, we have sent password reset instructions to that address.'
                  )}
                </div>
              ) : null}

              {authError ? (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs font-medium text-status-danger"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              ) : null}

              <Button type="submit" fullWidth size="lg" isLoading={authLoading}>
                {authMode === 'login'
                  ? t('Prijavi se', 'Sign In')
                  : authMode === 'register'
                    ? t('Registriraj račun', 'Create Account')
                    : t('Pošalji poveznicu za oporavak', 'Send Reset Link')}
              </Button>

              {authMode === 'reset' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className="w-full text-center text-xs font-semibold text-ink-secondary hover:text-ink"
                >
                  {t('← Povratak na prijavu', '← Back to sign in')}
                </button>
              ) : null}
            </form>

            {/* Google Sign-In */}
            {authMode !== 'reset' ? (
              <>
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                    <span className="bg-canvas px-3 text-ink-muted">{t('ili', 'or')}</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => void handleGoogleSignIn()}
                  disabled={authLoading}
                >
                  <span>{t('Nastavi putem Google računa', 'Continue with Google')}</span>
                </Button>
              </>
            ) : null}

            {/* Strictly DEV + VITE_ENABLE_DEMO_MODE=true Only (NEVER shipped in production) */}
            {IS_DEMO_MODE_ENABLED ? (
              <div className="pt-5 border-t border-hairline space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted text-center">
                  DEV Demo Mode Only
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const demo = await signInAsDemo('client');
                      showToast(`DEV Client: ${demo.fullName}`, 'info');
                    }}
                  >
                    Klijent (Dev)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const demo = await signInAsDemo('agent');
                      showToast(`DEV Agent: ${demo.fullName}`, 'info');
                      navigate('/admin');
                    }}
                  >
                    Zastupnik (Dev)
                  </Button>
                </div>
              </div>
            ) : null}
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
        {/* Email Verification Banner */}
        {!emailVerified ? (
          <div className="rounded-editorial bg-amber-50 border border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink">
            <div className="flex items-start gap-2.5">
              <MailCheck className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
              <span>
                {t(
                  'Molimo potvrdite svoju e-mail adresu klikom na poveznicu poslanu na',
                  'Please verify your e-mail address via the link sent to'
                )}{' '}
                <strong>{user.email}</strong>.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              isLoading={resendingVerify}
              onClick={async () => {
                setResendingVerify(true);
                try {
                  await resendVerificationEmail();
                  showToast(t('Verifikacijski e-mail je ponovno poslan.', 'Verification e-mail re-sent.'), 'success');
                } catch {
                  showToast(t('Nije moguće poslati e-mail sada. Pokušajte kasnije.', 'Could not resend e-mail right now.'), 'error');
                } finally {
                  setResendingVerify(false);
                }
              }}
              className="self-start sm:self-auto shrink-0"
            >
              {t('Pošalji ponovno', 'Resend e-mail')}
            </Button>
          </div>
        ) : null}

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {t('Moj Profil • Digitalni novčanik', 'My Profile • Digital Wallet')}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl text-ink mt-1">
              {t('Dobrodošli,', 'Welcome,')} {user.fullName}
            </h1>
            <p className="text-xs text-ink-muted mt-1 tabular-nums">
              {user.email} {user.oib ? `• OIB: ${user.oib}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isAgent ? (
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin')}>
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                <span>{t('Otvori Operativu (/admin)', 'Open Ops Portal (/admin)')}</span>
              </Button>
            ) : null}
            <Button size="sm" onClick={() => navigate('/izracun')}>
              <Plus className="w-4 h-4" strokeWidth={1.75} />
              <span>{t('Nova polica', 'New policy')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                showToast(t('Odjavili ste se iz sustava.', 'You have signed out.'), 'info');
              }}
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>{t('Odjava', 'Sign Out')}</span>
            </Button>
          </div>
        </div>

        {workspaceError ? (
          <ErrorBanner
            message={workspaceError}
            onRetry={() => setReloadNonce((n) => n + 1)}
            retryLabel={t('Pokušaj ponovno', 'Retry')}
          />
        ) : null}

        {/* Overview KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">{t('Aktivne police', 'Active policies')}</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">{policies.length}</div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">{t('Sljedeći istek police', 'Next expiry')}</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">
              {nextExpiryDays !== null ? `${nextExpiryDays} ${t('dana', 'days')}` : '—'}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">{t('Godišnji trošak polica', 'Annual premium total')}</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">
              {formatEur(totalAnnualSpend)}
            </div>
          </div>
          <div className="rounded-editorial bg-canvas border border-hairline p-5">
            <div className="text-xs text-ink-muted">{t('Otvorene prijave štete', 'Open claims')}</div>
            <div className="text-3xl font-bold text-ink mt-1 tabular-nums">{openClaimsCount}</div>
          </div>
        </div>

        {/* Workspace Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-hairline pb-3">
          {(
            [
              { id: 'wallet', label: `${t('Novčanik polica', 'Policy Wallet')} (${policies.length})` },
              { id: 'claims', label: `${t('Moje štete', 'My Claims')} (${claims.length})` },
              { id: 'messages', label: `${t('Poruke sa zastupnikom', 'Messages')} (${messages.length})` },
              { id: 'settings', label: t('Postavke profila', 'Profile Settings') },
            ] as const
          ).map((tabItem) => (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => setActiveTab(tabItem.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tabItem.id
                  ? 'bg-ink text-white'
                  : 'bg-canvas border border-hairline text-ink-secondary hover:text-ink'
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {workspaceLoading && activeTab !== 'settings' ? (
          <CardSkeleton rows={2} />
        ) : null}

        {/* TAB 1: DIGITAL POLICY WALLET */}
        {!workspaceLoading && activeTab === 'wallet' ? (
          <div className="space-y-4">
            {policies.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center space-y-3">
                <p className="text-sm text-ink-secondary">
                  {t(
                    'Još nemate spremljenih aktivnih polica na ovom računu.',
                    'You do not have any issued policies in your wallet yet.'
                  )}
                </p>
                <Button onClick={() => navigate('/izracun')}>
                  {t('Izračunaj prvu policu', 'Get your first quote')}
                </Button>
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
                                : pol.status === 'expired'
                                  ? 'danger'
                                  : daysLeft <= 30
                                    ? 'warning'
                                    : 'success'
                            }
                          >
                            {pol.status === 'pending_renewal'
                              ? t('Obnova u obradi', 'Renewal pending')
                              : pol.status === 'expired'
                                ? t('Istekla', 'Expired')
                                : daysLeft <= 30
                                  ? t(`Istječe za ${daysLeft} dana`, `Expires in ${daysLeft} days`)
                                  : t('Aktivna', 'Active')}
                          </Badge>
                        </div>
                        <h2 className="font-sans text-lg font-bold text-ink">{pol.carrierName}</h2>
                        <p className="text-sm text-ink-secondary">{pol.assetSummary}</p>
                        <p className="text-xs text-ink-muted tabular-nums">
                          {t('Vrijedi:', 'Valid:')} {formatDateHr(pol.startDate)} – {formatDateHr(pol.expiryDate)} •{' '}
                          {t('Franšiza:', 'Deductible:')} {formatEur(pol.deductible)}
                        </p>
                      </div>

                      <div className="text-left md:text-right tabular-nums shrink-0">
                        <div className="text-2xl font-bold text-ink">
                          {formatEur(pol.annualPremium)}
                        </div>
                        <div className="text-xs text-ink-muted">
                          {formatEur(pol.monthlyPremium)} {copy.units.perMonthShort}
                        </div>
                      </div>
                    </div>

                    {pol.endorsements.length > 0 ? (
                      <div className="rounded-lg bg-canvas-warm border border-hairline p-3.5 space-y-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          {t('Zahtjevi za izmjenu i obnovu', 'Endorsement & renewal requests')}
                        </div>
                        {pol.endorsements.slice(0, 3).map((end) => (
                          <div
                            key={end.id}
                            className="text-xs text-ink flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-hairline last:border-0 last:pb-0"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Badge variant={end.status === 'completed' ? 'success' : 'warning'}>
                                  {end.status === 'completed'
                                    ? t('Odobreno', 'Approved')
                                    : t('Zatraženo', 'Requested')}
                                </Badge>
                                <span className="font-medium">{end.summary}</span>
                              </div>
                              {end.agentNote ? (
                                <p className="text-[11px] text-ink-secondary pl-1">
                                  {t('Napomena zastupnika:', 'Advisor note:')} {end.agentNote}
                                </p>
                              ) : null}
                            </div>
                            <span className="text-ink-muted tabular-nums shrink-0">
                              {formatDateHr(end.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="pt-4 border-t border-hairline flex flex-wrap items-center gap-2">
                      {pol.policyPdfUrl ? (
                        <a
                          href={pol.policyPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-hairline-strong bg-canvas hover:bg-canvas-warm text-xs font-semibold text-ink transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>{t('Službena polica (PDF)', 'Carrier Policy (PDF)')}</span>
                        </a>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void downloadPolicyDocumentPdf(pol, 'policy')}
                      >
                        <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{t('Polica PDF', 'Policy PDF')}</span>
                      </Button>
                      {pol.productLine === 'auto' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void downloadPolicyDocumentPdf(pol, 'green_card')}
                        >
                          <FileCheck2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>{t('Zelena karta', 'Green Card')}</span>
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void downloadPolicyDocumentPdf(pol, 'ipid')}
                      >
                        <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>IPID</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEndorsePolicy(pol)}>
                        <span>{t('Zatraži izmjenu', 'Request change')}</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setConfirmRenewPolicy(pol)}
                        disabled={pol.status === 'pending_renewal'}
                      >
                        <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
                        <span>
                          {pol.status === 'pending_renewal'
                            ? t('Obnova zatražena', 'Renewal requested')
                            : t('Obnovi policu', 'Renew policy')}
                        </span>
                      </Button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        ) : null}

        {/* TAB 2: CLAIMS HISTORY + FULL CHRONOLOGICAL TIMELINE & ATTACHMENTS */}
        {!workspaceLoading && activeTab === 'claims' ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to="/prijava-stete"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Prijavi novu štetu', 'File a new claim')}</span>
              </Link>
            </div>
            {claims.length === 0 ? (
              <div className="rounded-editorial bg-canvas border border-hairline p-8 text-center text-sm text-ink-secondary">
                {t('Trenutno nemate prijavljenih šteta.', 'You have no claims filed yet.')}
              </div>
            ) : (
              claims.map((claim) => (
                <article
                  key={claim.id}
                  className="rounded-editorial bg-canvas border border-hairline p-6 space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink tabular-nums">
                        <span>{claim.referenceNumber}</span>
                        <span className="text-ink-muted">•</span>
                        <span>
                          {t('Polica', 'Policy')} {claim.policyNumber}
                        </span>
                        {typeof claim.estimatedAmount === 'number' && claim.estimatedAmount > 0 ? (
                          <Badge variant="success">
                            {t('Procjena:', 'Est. payout:')} {formatEur(claim.estimatedAmount)}
                          </Badge>
                        ) : null}
                      </div>
                      <h3 className="font-sans text-base font-semibold text-ink">
                        {claim.carrierName} — {claim.incidentLocation}
                      </h3>
                      <p className="text-xs text-ink-secondary">{claim.description}</p>
                    </div>
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-hairline text-xs font-semibold text-ink hover:bg-canvas-warm cursor-pointer">
                      <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>
                        {t('Dodaj dokument', 'Add document')} ({claim.attachments.length})
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        onChange={(e) =>
                          void handleAdditionalClaimUpload(claim.id, e.target.files?.[0])
                        }
                      />
                    </label>
                  </div>

                  <ClaimStageTimeline stage={claim.stage} />

                  {/* Full Stage History Timeline with Agent Notes */}
                  {claim.stageHistory && claim.stageHistory.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-hairline">
                      <h4 className="font-sans text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                        {t('Kronologija obrade i bilješke zastupnika', 'Claim timeline & advisor notes')}
                      </h4>
                      <ul className="space-y-2">
                        {claim.stageHistory.map((h, i) => (
                          <li
                            key={`${claim.id}-hist-${i}`}
                            className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs p-3 rounded-lg bg-canvas-warm border border-hairline"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                                  {getClaimStageLabel(h.stage, language)}
                                </span>
                                {h.actor ? (
                                  <span className="text-[11px] text-ink-muted">• {h.actor}</span>
                                ) : null}
                              </div>
                              <p className="text-ink font-medium">{h.note}</p>
                            </div>
                            <span className="text-ink-muted tabular-nums shrink-0">
                              {formatDateTimeHr(h.timestamp)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Attached Files Preview / Download List */}
                  {claim.attachments.length > 0 ? (
                    <div className="space-y-2 pt-2 border-t border-hairline">
                      <h4 className="font-sans text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                        {t('Priložena dokumentacija', 'Attached files')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {claim.attachments.map((att) => (
                          <button
                            key={att.id}
                            type="button"
                            onClick={() => void handleOpenAttachment(att)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-hairline bg-canvas-warm hover:border-ink text-xs font-medium text-ink transition-colors"
                          >
                            <FileImage className="w-3.5 h-3.5 text-accent shrink-0" />
                            <span className="max-w-[200px] truncate">{att.name}</span>
                            <ExternalLink className="w-3 h-3 text-ink-muted shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              ))
            )}
          </div>
        ) : null}

        {/* TAB 3: TWO-WAY MESSAGE CENTER (Dynamic Advisor Info) */}
        {!workspaceLoading && activeTab === 'messages' ? (
          <div className="rounded-editorial bg-canvas border border-hairline overflow-hidden">
            <div className="px-6 py-4 border-b border-hairline bg-canvas-warm flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <MessageSquare className="w-4 h-4 text-accent shrink-0" strokeWidth={1.5} />
                <span>{advisorInfo.label}</span>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-ink-secondary text-center py-8">
                  {t(
                    'Pošaljite poruku našem timu ovlaštenih zastupnika — odgovor stiže izravno u ovaj pretinac.',
                    'Start a conversation with our licensed advisory team — replies appear right here.'
                  )}
                </p>
              ) : (
                messages.map((msg) => (
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
                ))
              )}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-hairline flex items-center gap-2.5"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('Napišite poruku svom zastupniku...', 'Write a message to your advisor...')}
                className="flex-1 h-11 rounded-lg border border-hairline-strong px-3.5 text-sm text-ink focus:outline-none focus:border-accent"
              />
              <Button type="submit" disabled={!newMessage.trim()} isLoading={sendingMsg}>
                <Send className="w-4 h-4" strokeWidth={1.75} />
                <span>{t('Pošalji', 'Send')}</span>
              </Button>
            </form>
          </div>
        ) : null}

        {/* TAB 4: PROFILE SETTINGS & PASSWORD MANAGEMENT */}
        {activeTab === 'settings' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-7 rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-hairline">
                <Settings className="w-4 h-4 text-accent" />
                <h2 className="font-sans text-base font-bold text-ink">
                  {t('Osobni podaci ugovaratelja', 'Personal Profile Details')}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('Ime i prezime *', 'Full name *')}
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                />
                <Input
                  label={t('Mobitel / telefon', 'Phone number')}
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  placeholder="+385 91 234 5678"
                  tabular
                />
                <Input
                  label={t('OIB (11 znamenki)', 'Croatian OIB (11 digits)')}
                  value={profOib}
                  onChange={(e) => setProfOib(e.target.value)}
                  placeholder="26182105152"
                  maxLength={11}
                  tabular
                />
                <Input
                  label={t('Adresa (ulica i broj)', 'Street address')}
                  value={profAddress}
                  onChange={(e) => setProfAddress(e.target.value)}
                  placeholder="Ilica 10"
                />
                <Input
                  label={t('Grad', 'City')}
                  value={profCity}
                  onChange={(e) => setProfCity(e.target.value)}
                  placeholder="Zagreb"
                />
                <Input
                  label={t('Poštanski broj', 'Postal code')}
                  value={profPostal}
                  onChange={(e) => setProfPostal(e.target.value)}
                  placeholder="10000"
                  maxLength={5}
                  tabular
                />
              </div>
              {profError ? (
                <p role="alert" className="text-xs font-medium text-status-danger">
                  {profError}
                </p>
              ) : null}
              <Button type="submit" isLoading={profSaving}>
                {t('Spremi promjene profila', 'Save Profile Changes')}
              </Button>
            </form>

            <form
              onSubmit={handleChangePassword}
              className="lg:col-span-5 rounded-editorial bg-canvas border border-hairline p-6 sm:p-8 space-y-4 self-start"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-hairline">
                <KeyRound className="w-4 h-4 text-accent" />
                <h2 className="font-sans text-base font-bold text-ink">
                  {t('Promjena lozinke', 'Change Password')}
                </h2>
              </div>
              <Input
                label={t('Trenutna lozinka *', 'Current password *')}
                type="password"
                value={currPwd}
                onChange={(e) => setCurrPwd(e.target.value)}
              />
              <Input
                label={t('Nova lozinka *', 'New password *')}
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder={t('Najmanje 6 znakova', 'At least 6 characters')}
              />
              <Input
                label={t('Potvrdi novu lozinku *', 'Confirm new password *')}
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
              {pwdError ? (
                <p role="alert" className="text-xs font-medium text-status-danger">
                  {pwdError}
                </p>
              ) : null}
              <Button type="submit" variant="outline" fullWidth isLoading={pwdSaving}>
                {t('Ažuriraj lozinku', 'Update Password')}
              </Button>
            </form>
          </div>
        ) : null}
      </div>

      {/* Policy Modification Modal */}
      <Modal
        isOpen={Boolean(endorsePolicy)}
        onClose={() => setEndorsePolicy(null)}
        title={t('Zahtjev za izmjenu police', 'Policy Endorsement Request')}
        subtitle={endorsePolicy ? `${t('Polica', 'Policy')}: ${endorsePolicy.policyNumber}` : undefined}
      >
        <form onSubmit={handleEndorsementSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink">
              {t('Vrsta izmjene', 'Change type')}
            </label>
            <select
              value={endorseType}
              onChange={(e) => setEndorseType(e.target.value as PolicyEndorsement['type'])}
              className="w-full h-11 rounded-lg border border-hairline-strong bg-canvas px-3 text-sm text-ink"
            >
              <option value="add_driver">{t('Dodavanje dodatnog vozača', 'Add an additional driver')}</option>
              <option value="change_address">{t('Promjena adrese / prebivališta', 'Change address / residence')}</option>
              <option value="add_coverage">{t('Proširenje pokrića (npr. stakla, potres)', 'Add coverage (e.g. glass, earthquake)')}</option>
              <option value="renewal_request">{t('Zahtjev za prijevremenu obnovu', 'Early renewal request')}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-ink">
              {t('Detalji izmjene *', 'Change details *')}
            </label>
            <textarea
              rows={3}
              value={endorseNote}
              onChange={(e) => setEndorseNote(e.target.value)}
              placeholder={t(
                'Upišite novu adresu, podatke o vozaču ili željeno dodatno pokriće...',
                'Enter the new address, driver details, or desired coverage add-on...'
              )}
              className="w-full rounded-lg border border-hairline-strong p-3 text-sm text-ink focus:outline-none focus:border-accent"
            />
          </div>
          <Button type="submit" fullWidth isLoading={endorseSaving}>
            {t('Pošalji zahtjev za izmjenu', 'Submit Change Request')}
          </Button>
        </form>
      </Modal>

      {/* Renewal Confirmation Modal (Prevents accidental 1-click renewal) */}
      <Modal
        isOpen={Boolean(confirmRenewPolicy)}
        onClose={() => setConfirmRenewPolicy(null)}
        title={t('Potvrda zahtjeva za obnovu', 'Confirm Policy Renewal Request')}
        subtitle={
          confirmRenewPolicy
            ? `${confirmRenewPolicy.policyNumber} • ${confirmRenewPolicy.carrierName}`
            : undefined
        }
        footer={
          <div className="flex gap-2.5">
            <Button variant="outline" fullWidth onClick={() => setConfirmRenewPolicy(null)}>
              {t('Odustani', 'Cancel')}
            </Button>
            <Button fullWidth isLoading={renewSaving} onClick={() => void handleConfirmRenewal()}>
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('Potvrdi obnovu', 'Confirm Renewal')}</span>
            </Button>
          </div>
        }
      >
        {confirmRenewPolicy ? (
          <p className="text-sm text-ink-secondary leading-relaxed">
            {t(
              `Želite li pokrenuti obnovu police ${confirmRenewPolicy.policyNumber} (${confirmRenewPolicy.assetSummary})? Naš ovlašteni zastupnik usporedit će trenutne tarife svih 7 osiguratelja i poslati vam najpovoljniju ponudu obnove.`,
              `Start renewal for policy ${confirmRenewPolicy.policyNumber} (${confirmRenewPolicy.assetSummary})? A licensed advisor will compare all 7 carriers and prepare your best renewal offer.`
            )}
          </p>
        ) : null}
      </Modal>
    </div>
  );
};
