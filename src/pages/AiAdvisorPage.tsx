import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Headphones,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { agencyRepository } from '../services/agencyRepository';
import { askInsuranceAdvisor } from '../services/aiService';
import { AiChatMessage, AiEscalationRecord } from '../types/domain';
import { isValidCroatianPhone } from '../utils/croatianValidators';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';

const QUICK_TOPICS = [
  'Što pokriva osiguranje od potresa za stan u Zagrebu?',
  'Koja je razlika između obveznog AO i punog Kaska?',
  'Isplati li se privatno dopunsko umjesto HZZO police (15 €)?',
  'Kako funkcionira vinkulacija za stambeni kredit?',
  'Što trebam napraviti odmah nakon prometne nezgode?',
];

export const AiAdvisorPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Dobrodošli u Jasno AI Savjetnik. Pitajte me bilo što o hrvatskim policama (AO, Kasko, potres, dopunsko zdravstveno, vinkulacija kredita ili prijava štete) bez sitnih slova. U bilo kojem trenutku razgovor možete prebaciti našem ovlaštenom zastupniku.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [draft, setDraft] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Human agent escalation modal
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [escName, setEscName] = useState(user?.fullName ?? '');
  const [escEmail, setEscEmail] = useState(user?.email ?? '');
  const [escPhone, setEscPhone] = useState(user?.phone ?? '');
  const [escError, setEscError] = useState('');
  const [escSaving, setEscSaving] = useState(false);
  const [savedEscalation, setSavedEscalation] = useState<AiEscalationRecord | null>(null);

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
      const response = await askInsuranceAdvisor(trimmed, nextHistory);
      const assistantMsg: AiChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        card: response.card,
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
      setEscError('Unesite ime i prezime.');
      return;
    }
    if (!escEmail.includes('@')) {
      setEscError('Unesite ispravnu e-mail adresu.');
      return;
    }
    if (!isValidCroatianPhone(escPhone)) {
      setEscError('Unesite važeći hrvatski broj telefona.');
      return;
    }

    const firstUserQuestion =
      messages.find((m) => m.sender === 'user')?.text ?? 'Savjetovanje o odabiru osiguranja';

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
      showToast(`Razgovor je prebačen zastupniku (${record.referenceNumber}).`, 'success');
    } finally {
      setEscSaving(false);
    }
  };

  return (
    <div className="bg-canvas py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Clean Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-hairline">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2">
              <Badge variant="accent">Gemini AI + Ljudski zastupnik</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl text-ink">AI Savjetnik za osiguranje</h1>
            <p className="text-sm text-ink-secondary">
              Jasni odgovori o hrvatskim policama, bez prodajnog pritiska. Cijeli razgovor jednim
              klikom možete prenijeti licenciranom zastupniku.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSavedEscalation(null);
              setEscalateOpen(true);
            }}
            className="shrink-0"
          >
            <Headphones className="w-4 h-4" strokeWidth={1.5} />
            <span>Prebaci na ljudskog agenta</span>
          </Button>
        </div>

        {/* Suggested Prompts */}
        <div className="flex flex-wrap gap-2">
          {QUICK_TOPICS.map((topic) => (
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
          aria-label="Razgovor s AI savjetnikom"
          className="rounded-editorial border border-hairline bg-canvas-warm/60 flex flex-col min-h-[460px] max-h-[620px]"
        >
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2.5 animate-step`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-editorial px-4 py-3 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-ink text-white'
                      : 'bg-canvas border border-hairline text-ink shadow-subtle'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Structured Inline UI Card (Coverage Comparison or Direct Quote Deep-Link) */}
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
                        <span>Pokreni 90s izračun</span>
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
                        Pitaj zastupnika
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}

            {isThinking ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-editorial bg-canvas border border-hairline text-xs text-ink-muted">
                <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Savjetnik priprema odgovor...</span>
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
              placeholder="Postavite pitanje o osiguranju (npr. Pokriva li kasko tuču?)..."
              className="flex-1 h-11 rounded-lg border border-hairline-strong px-3.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
            />
            <Button type="submit" disabled={!draft.trim() || isThinking}>
              <Send className="w-4 h-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Pošalji</span>
            </Button>
          </form>
        </section>
      </div>

      {/* Escalation to Human Agent Modal */}
      <Modal
        isOpen={escalateOpen}
        onClose={() => setEscalateOpen(false)}
        title={savedEscalation ? 'Razgovor je prebačen zastupniku' : 'Prebaci na ljudskog agenta'}
        subtitle={
          savedEscalation
            ? `Broj tiketa: ${savedEscalation.referenceNumber}`
            : `Priložit ćemo cijeli transkript (${messages.length} poruka) kako ne biste morali ponavljati upit.`
        }
      >
        {savedEscalation ? (
          <div className="space-y-4">
            <div className="rounded-editorial bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-status-success shrink-0 mt-0.5" />
              <p className="text-sm text-ink">
                Ovlašteni zastupnik dobio je vaš razgovor pod oznakom{' '}
                <strong className="tabular-nums">{savedEscalation.referenceNumber}</strong> i javit
                će vam se putem telefona ili e-maila.
              </p>
            </div>
            <Button fullWidth onClick={() => setEscalateOpen(false)}>
              Zatvori
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEscalateSubmit} className="space-y-4">
            <Input
              label="Ime i prezime *"
              value={escName}
              onChange={(e) => setEscName(e.target.value)}
              placeholder="Ana Horvat"
            />
            <Input
              label="E-mail adresa *"
              type="email"
              value={escEmail}
              onChange={(e) => setEscEmail(e.target.value)}
              placeholder="ana@email.hr"
            />
            <Input
              label="Mobitel / telefon *"
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
              Pošalji razgovor licenciranom zastupniku
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
