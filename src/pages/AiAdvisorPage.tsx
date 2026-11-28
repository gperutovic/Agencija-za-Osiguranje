import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Headphones,
  MessageSquare,
  Send,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { agencyRepository } from '../services/agencyRepository';
import { askInsuranceAdvisor } from '../services/aiService';
import { AiChatMessage, AiEscalationRecord } from '../types/domain';
import { isValidCroatianPhone } from '../utils/croatianValidators';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

const QUICK_TOPICS_HR = [
  'Što pokriva osiguranje od potresa za stan u Zagrebu?',
  'Koja je razlika između obveznog AO i punog Kaska?',
  'Isplati li se privatno dopunsko umjesto HZZO police (15 €)?',
  'Kako funkcionira vinkulacija za stambeni kredit?',
  'Dron susjeda oštetio mi je krov kuće na Braču — pokriva li to polica?',
];

const QUICK_TOPICS_EN = [
  'What does earthquake insurance cover for a Zagreb apartment?',
  'What is the difference between mandatory AO and Full Kasko?',
  'Is private supplemental health better than HZZO (€15/mo)?',
  'How does mortgage policy assignment (vinkulacija) work in Croatia?',
  'A neighbor’s drone damaged my roof on Brač — is that covered?',
];

export const AiAdvisorPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const buildWelcomeMessage = (lang: 'hr' | 'en'): AiChatMessage => ({
    id: 'welcome-1',
    sender: 'assistant',
    text:
      lang === 'en'
        ? `Welcome to the ${BRAND_CONFIG.brandName} AI Insurance Advisor. Ask me anything about Croatian policies (Motor AO/Kasko, earthquake, supplemental health, mortgage assignment, or claims) in plain language. You can transfer the entire conversation to a HANFA-licensed human advisor anytime.`
        : `Dobrodošli u ${BRAND_CONFIG.brandName} AI Savjetnik. Pitajte me bilo što o hrvatskim policama (AO, Kasko, potres, dopunsko zdravstveno, vinkulacija kredita ili prijava štete) bez sitnih slova. U bilo kojem trenutku razgovor možete prebaciti našem ovlaštenom zastupniku.`,
    timestamp: new Date().toISOString(),
  });

  const [messages, setMessages] = useState<AiChatMessage[]>(() => [buildWelcomeMessage(language)]);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastSource, setLastSource] = useState<'idle' | 'gemini' | 'fallback'>('idle');

  // Human agent escalation modal
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escName, setEscName] = useState(user?.fullName ?? '');
  const [escEmail, setEscEmail] = useState(user?.email ?? '');
  const [escPhone, setEscPhone] = useState(user?.phone ?? '');
  const [escError, setEscError] = useState('');
  const [escSaving, setEscSaving] = useState(false);
  const [savedEscalation, setSavedEscalation] = useState<AiEscalationRecord | null>(null);

  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0]?.id === 'welcome-1' ? [buildWelcomeMessage(language)] : prev
    );
  }, [language]);

  useEffect(() => {
    if (!user) return;
    setEscName((prev) => prev || user.fullName);
    setEscEmail((prev) => prev || user.email);
    setEscPhone((prev) => prev || user.phone);
  }, [user]);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isThinking) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setDraft('');
    setIsThinking(true);

    try {
      const response = await askInsuranceAdvisor(trimmed, nextHistory, language);
      setLastSource(response.source);
      const assistantMsg: AiChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        card: response.card,
        source: response.source,
        degradedNotice: response.degradedNotice,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendQuestion(draft);
  };

  const handleEscalateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEscError('');
    if (escName.trim().length < 3) {
      setEscError(t('Unesite ime i prezime.', 'Enter your full name.'));
      return;
    }
    if (!escEmail.includes('@')) {
      setEscError(t('Unesite ispravnu e-mail adresu.', 'Enter a valid e-mail address.'));
      return;
    }
    if (!isValidCroatianPhone(escPhone)) {
      setEscError(t('Unesite važeći hrvatski broj telefona.', 'Enter a valid Croatian phone number.'));
      return;
    }

    const firstUserQuestion =
      messages.find((m) => m.sender === 'user')?.text ??
      t('Savjetovanje o odabiru osiguranja', 'Insurance coverage consultation');

    setEscSaving(true);
    try {
      const record = await agencyRepository.createEscalation({
        userId: user?.uid,
        customerName: escName.trim(),
        customerEmail: escEmail.trim(),
        customerPhone: escPhone.trim(),
        topic: firstUserQuestion.slice(0, 120),
        transcript: messages,
      });
      setSavedEscalation(record);
      showToast(
        t(
          `Razgovor je prebačen zastupniku (${record.referenceNumber}).`,
          `Conversation transferred to advisor (${record.referenceNumber}).`
        ),
        'success'
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : t('Prebacivanje razgovora nije uspjelo.', 'Failed to transfer conversation.');
      setEscError(msg);
      showToast(msg, 'error');
    } finally {
      setEscSaving(false);
    }
  };

  const quickTopics = language === 'en' ? QUICK_TOPICS_EN : QUICK_TOPICS_HR;

  return (
    <div className="bg-canvas py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Clean Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-hairline">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2">
              {lastSource === 'fallback' ? (
                <Badge variant="warning">
                  {t('Informativni način + Ljudski zastupnik', 'Fallback Guidance + Human Advisor')}
                </Badge>
              ) : (
                <Badge variant="accent">
                  {lastSource === 'gemini'
                    ? t('Gemini AI aktivan + Ljudski zastupnik', 'Live Gemini AI + Human Advisor')
                    : t('Digitalni AI Savjetnik + Ljudski zastupnik', 'Digital AI Advisor + Human Handoff')}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-ink">
              {t('AI Savjetnik za osiguranje', 'AI Insurance Advisor')}
            </h1>
            <p className="text-sm text-ink-secondary">
              {t(
                'Jasni odgovori o hrvatskim policama, bez prodajnog pritiska. Cijeli razgovor jednim klikom možete prenijeti licenciranom zastupniku.',
                'Clear answers on Croatian policies without sales pressure. Transfer the full transcript to a HANFA-licensed advisor in one click.'
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSavedEscalation(null);
              setEscError('');
              setEscalateOpen(true);
            }}
            className="shrink-0 self-start sm:self-auto"
          >
            <Headphones className="w-4 h-4" strokeWidth={1.5} />
            <span>{t('Prebaci na ljudskog agenta', 'Transfer to human agent')}</span>
          </Button>
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap gap-2">
          {quickTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => void sendQuestion(topic)}
              className="px-3 py-1.5 rounded-pill bg-canvas-warm border border-hairline text-xs font-medium text-ink-secondary hover:border-ink hover:text-ink transition-colors text-left"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Conversational Thread Container */}
        <section
          aria-label={t('Razgovor s AI savjetnikom', 'AI advisor conversation')}
          className="rounded-editorial border border-hairline bg-canvas-warm/60 flex flex-col min-h-[460px] max-h-[620px]"
        >
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2.5 animate-step`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-editorial px-4 py-3 text-sm leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-ink text-white'
                      : 'bg-canvas border border-hairline text-ink shadow-subtle'
                  }`}
                >
                  <div>{msg.text}</div>
                  {msg.degradedNotice ? (
                    <div className="pt-2 border-t border-hairline flex items-start gap-1.5 text-[11px] text-status-warning">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{msg.degradedNotice}</span>
                    </div>
                  ) : null}
                </div>

                {/* Structured Inline UI Card */}
                {msg.card ? (
                  <div className="w-full max-w-md rounded-editorial bg-canvas border border-hairline p-4 shadow-subtle space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-ink">{msg.card.title}</div>
                        <div className="text-xs text-ink-secondary mt-0.5">{msg.card.subtitle}</div>
                      </div>
                      {msg.card.priceHint ? (
                        <Badge variant="neutral">{msg.card.priceHint}</Badge>
                      ) : null}
                    </div>
                    {msg.card.bullets ? (
                      <ul className="space-y-1.5 text-xs text-ink-secondary">
                        {msg.card.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-status-success shrink-0 mt-0.5" strokeWidth={2.25} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="pt-2 border-t border-hairline flex items-center justify-between gap-2">
                      <Link
                        to={msg.card.productLine ? `/izracun/${msg.card.productLine}` : '/izracun'}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                      >
                        <span>{t('Pokreni 90s izračun', 'Start 90s quote')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setSavedEscalation(null);
                          setEscalateOpen(true);
                        }}
                        className="text-xs font-medium text-ink-muted hover:text-ink"
                      >
                        {t('Pitaj zastupnika', 'Ask an advisor')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            {isThinking ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-editorial bg-canvas border border-hairline text-xs text-ink-muted">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{t('Savjetnik priprema odgovor...', 'Advisor is preparing an answer...')}</span>
              </div>
            ) : null}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-hairline bg-canvas rounded-b-editorial flex items-center gap-2.5"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t(
                'Postavite pitanje o osiguranju (npr. Pokriva li kasko tuču?)...',
                'Ask an insurance question (e.g. Does Kasko cover hail damage?)...'
              )}
              className="flex-1 h-11 rounded-lg border border-hairline-strong px-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
            />
            <Button type="submit" disabled={!draft.trim() || isThinking}>
              <Send className="w-4 h-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">{t('Pošalji', 'Send')}</span>
            </Button>
          </form>
        </section>
      </div>

      {/* Escalation to Human Agent Modal */}
      <Modal
        isOpen={escalateOpen}
        onClose={() => setEscalateOpen(false)}
        title={
          savedEscalation
            ? t('Razgovor je prebačen zastupniku', 'Transferred to a licensed advisor')
            : t('Prebaci na ljudskog agenta', 'Transfer to human agent')
        }
        subtitle={
          savedEscalation
            ? `${t('Broj tiketa', 'Ticket ID')}: ${savedEscalation.referenceNumber}`
            : t(
                `Priložit ćemo cijeli transkript (${messages.length} poruka) kako ne biste morali ponavljati upit.`,
                `We will attach your full transcript (${messages.length} messages) so you never have to repeat yourself.`
              )
        }
      >
        {savedEscalation ? (
          <div className="space-y-4">
            <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
              <p className="text-sm text-ink">
                {t('Ovlašteni zastupnik dobio je vaš razgovor pod oznakom', 'A licensed advisor has received your chat under reference')}{' '}
                <strong className="tabular-nums">{savedEscalation.referenceNumber}</strong>{' '}
                {t('i javit će vam se putem telefona ili e-maila.', 'and will contact you by phone or e-mail.')}
              </p>
            </div>
            <Button fullWidth onClick={() => setEscalateOpen(false)}>
              {t('Zatvori', 'Close')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEscalateSubmit} className="space-y-4">
            <Input
              label={t('Ime i prezime *', 'Full name *')}
              value={escName}
              onChange={(e) => setEscName(e.target.value)}
              placeholder="Ana Horvat"
            />
            <Input
              label={t('E-mail adresa *', 'E-mail address *')}
              type="email"
              value={escEmail}
              onChange={(e) => setEscEmail(e.target.value)}
              placeholder="ana@email.hr"
            />
            <Input
              label={t('Mobitel / telefon *', 'Phone number *')}
              value={escPhone}
              onChange={(e) => setEscPhone(e.target.value)}
              placeholder="+385 91 234 5678"
              tabular
            />
            {escError ? (
              <p role="alert" className="text-xs font-medium text-status-danger">
                {escError}
              </p>
            ) : null}
            <Button type="submit" fullWidth isLoading={escSaving}>
              {t('Pošalji razgovor licenciranom zastupniku', 'Send Transcript to Licensed Advisor')}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
