import React, { useState } from 'react';
import { X, Lock, CheckCircle2, RefreshCw, FileText, AlertTriangle, ExternalLink, Copy, Check, Volume2, RotateCcw } from 'lucide-react';
import { LanguageCode } from '../types/alphabet';
import { soundService } from '../services/sound';
import { storageService } from '../services/storage';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onProgressReset: () => void;
  stars?: number;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  onProgressReset,
  stars,
}) => {
  // Math challenge state
  const [num1, setNum1] = useState(8);
  const [num2, setNum2] = useState(7);
  const [userAnswer, setUserAnswer] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedPolicy, setCopiedPolicy] = useState(false);
  const [starsResetSuccess, setStarsResetSuccess] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [dataResetSuccess, setDataResetSuccess] = useState(false);
  const [voiceTestInfo, setVoiceTestInfo] = useState<{
    tested: boolean;
    hasVoices: boolean;
    italianVoices: string[];
    allVoicesCount: number;
  } | null>(null);

  const handleTestVoice = () => {
    const all = soundService.getVoicesList();
    const it = all
      .filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('it'))
      .map((v) => v.name);

    setVoiceTestInfo({
      tested: true,
      hasVoices: all.length > 0,
      italianVoices: it,
      allVoicesCount: all.length,
    });

    soundService.speak('Ciao! Alfabeto Magico funziona!', 'it', 1.0, 1.0);
  };

  // Active tab in parents area
  const [activeTab, setActiveTab] = useState<'settings' | 'privacy'>('settings');

  // Regenerate math challenge when opened
  React.useEffect(() => {
    if (isOpen) {
      const n1 = Math.floor(Math.random() * 8) + 7;
      const n2 = Math.floor(Math.random() * 8) + 5;
      setNum1(n1);
      setNum2(n2);
      setUserAnswer('');
      setIsUnlocked(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(userAnswer.trim(), 10);
    if (val === num1 + num2) {
      soundService.playSuccess();
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      soundService.playGentleEncouragement();
      setErrorMsg('Risposta errata. Questa sezione è riservata solo ai genitori.');
      setUserAnswer('');
    }
  };

  const handleResetStars = () => {
    storageService.resetStars();
    onProgressReset();
    soundService.playPop();
    setStarsResetSuccess(true);
    setTimeout(() => setStarsResetSuccess(false), 3000);
  };

  const handleResetData = () => {
    storageService.resetAllProgress();
    onProgressReset();
    soundService.playPop();
    setConfirmResetAll(false);
    setDataResetSuccess(true);
    setTimeout(() => setDataResetSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border-4 border-purple-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide">
                Area Riservata Genitori
              </h2>
              <p className="text-xs sm:text-sm text-purple-200">
                Conforme a Google Play Families Policy & COPPA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Challenge or Unlocked Content */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
              Cancello di Sicurezza per Bambini
            </h3>
            <p className="text-sm text-slate-600 mb-6 max-w-md">
              Per impedire accessi involontari da parte dei bambini alle impostazioni, risolvi questa semplice addizione:
            </p>

            <form onSubmit={handleVerify} className="w-full max-w-xs flex flex-col items-center">
              <div className="bg-purple-50 border-2 border-purple-200 px-6 py-4 rounded-2xl text-3xl font-extrabold text-purple-900 mb-4">
                {num1} + {num2} = ?
              </div>

              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Risultato"
                autoFocus
                className="w-full text-center text-2xl font-bold p-3 border-2 border-slate-300 rounded-2xl mb-4 focus:outline-none focus:border-purple-600"
              />

              {errorMsg && (
                <p className="text-xs text-red-600 font-bold mb-3">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3.5 rounded-2xl shadow-md transition active:scale-95"
              >
                Verifica ed Entra
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2">
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-2 transition ${
                  activeTab === 'settings'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Impostazioni
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-4 py-2.5 rounded-t-xl text-sm font-bold flex items-center gap-2 transition ${
                  activeTab === 'privacy'
                    ? 'bg-white text-purple-700 border-t-2 border-purple-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" /> Privacy Policy
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-6 flex-1 space-y-6">
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Language selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Lingua Didattica Attiva
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['it', 'en', 'es', 'fr', 'de'] as LanguageCode[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            onLanguageChange(lang);
                            soundService.playPop();
                          }}
                          className={`p-3 rounded-2xl border-2 font-bold flex items-center gap-2 transition ${
                            currentLanguage === lang
                              ? 'bg-purple-100 border-purple-500 text-purple-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xl">
                            {lang === 'it' && '🇮🇹'}
                            {lang === 'en' && '🇬🇧'}
                            {lang === 'es' && '🇪🇸'}
                            {lang === 'fr' && '🇫🇷'}
                            {lang === 'de' && '🇩🇪'}
                          </span>
                          <span className="text-xs uppercase font-extrabold">{lang}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio & Voice Diagnostic for Tablets */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-indigo-700" />
                        <h4 className="font-extrabold text-sm text-indigo-950">
                          Diagnostica & Test Voce (Tablet Android)
                        </h4>
                      </div>
                      <button
                        onClick={handleTestVoice}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition active:scale-95 flex items-center gap-1.5"
                      >
                        <Volume2 className="w-4 h-4" /> Prova Voce Adesso
                      </button>
                    </div>

                    <p className="text-xs text-indigo-900 leading-relaxed">
                      Tocca <strong>"Prova Voce Adesso"</strong> per ascoltare la frase di test. Se senti gli effetti sonori (campanelli) ma la voce è muta, controlla il riquadro diagnostico qui sotto:
                    </p>

                    {voiceTestInfo && (
                      <div className="bg-white/80 backdrop-blur p-3 rounded-xl border border-indigo-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Voci totali sul tablet:</span>
                          <span className="font-bold text-slate-900 font-mono">{voiceTestInfo.allVoicesCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Voci in lingua Italiana:</span>
                          <span className={`font-bold font-mono ${voiceTestInfo.italianVoices.length > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {voiceTestInfo.italianVoices.length > 0 ? `✓ ${voiceTestInfo.italianVoices.length} trovate` : '⚠️ 0 installate'}
                          </span>
                        </div>
                        {voiceTestInfo.italianVoices.length > 0 && (
                          <div className="text-[11px] text-slate-500 pt-1">
                            Voci attive: {voiceTestInfo.italianVoices.slice(0, 3).join(', ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step-by-step Lenovo tablet instruction */}
                    <div className="bg-white/60 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-950 space-y-1">
                      <p className="font-bold text-indigo-900">
                        📱 Se sul Tablet Lenovo la voce non si sente ancora:
                      </p>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                        <li>Apri l'app <strong>Impostazioni (Settings)</strong> del tablet Lenovo.</li>
                        <li>Vai su <strong>Sistema</strong> (o <strong>Accessibilità</strong>) ➔ <strong>Lingue e immissione</strong> ➔ <strong>Output sintesi vocale</strong>.</li>
                        <li>Accanto a <em>Servizi vocali di Google</em> (o <em>Motore di sintesi vocale</em>), tocca l'icona dell'ingranaggio ⚙️.</li>
                        <li>Tocca <strong>Installa dati vocali</strong> ➔ cerca <strong>Italiano</strong> e tocca <strong>Scarica</strong> (circa 20 MB).</li>
                        <li>Tocca il pulsante <strong>Riproduci</strong> per verificare che il tablet pronunci la frase di prova.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Punteggio Stelline */}
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 p-4 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/30 border border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                          ⭐
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-2">
                            Punteggio Stelline
                            <span className="font-mono bg-amber-200/90 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black border border-amber-300">
                              {stars ?? storageService.getState().stars} ⭐
                            </span>
                          </h4>
                          <p className="text-xs text-amber-900/80">
                            Il punteggio parte da zero e aumenta colorando e giocando.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetStars}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" /> Azzera Punteggio (0 ⭐)
                      </button>
                    </div>

                    {starsResetSuccess && (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Punteggio stelle azzerato a 0 con successo!</span>
                      </div>
                    )}
                  </div>

                  {/* Reset Data */}
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-slate-500" /> Gestione Dati del Bambino
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tutti i dati (lettere completate, adesivi sbloccati e disegni salvati) risiedono solo su questo dispositivo. Nessun dato viene mai inviato a server esterni.
                    </p>

                    {!confirmResetAll ? (
                      <button
                        type="button"
                        onClick={() => setConfirmResetAll(true)}
                        className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" /> Azzera Tutti i Progressi dell'App
                      </button>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                        <p className="text-xs font-bold text-red-800">
                          Sei sicuro di voler azzerare tutti i progressi, lettere e adesivi?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleResetData}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow transition cursor-pointer"
                          >
                            Sì, Azzera Tutto
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmResetAll(false)}
                            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            Annulla
                          </button>
                        </div>
                      </div>
                    )}

                    {dataResetSuccess && (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Tutti i progressi sono stati azzerati con successo!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  {/* Google Play Store Recommendation Box */}
                  <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                        Importante per Google Play Console
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                      Dove pubblicare l'URL delle Norme sulla Privacy
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      Google Play richiede che il link sia attivo <strong>pubblicamente 24/7</strong> senza dipendere da sessioni di sviluppo. La soluzione più rapida, gratuita e accettata al 100% da Google è creare una pagina su <strong>Google Sites</strong> (ci vuole 1 minuto con il tuo account Gmail).
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const fullPolicyText = `INFORMATIVA SULLA PRIVACY - ALFABETO MAGICO
Applicazione: Alfabeto Magico (ID Pacchetto: com.alfabetomagico.myapp)
Sviluppatore: Calogero La Mattina
Email di contatto: calogero.lamattina.k@gmail.com
Ultimo aggiornamento: Ottobre 2026

1. INTRODUZIONE ED IMPEGNO PER LA PRIVACY
La presente Informativa sulla Privacy si applica all'applicazione mobile Alfabeto Magico (com.alfabetomagico.myapp), sviluppata da Calogero La Mattina.
Questa applicazione rispetta rigorosamente il Programma per famiglie di Google Play (Google Play Families Policy), la legge COPPA (Children's Online Privacy Protection Act) e il Regolamento europeo GDPR per la protezione dei minori.
Sintesi: L'applicazione non raccoglie, non memorizza, non trasmette e non condivide alcun dato personale o sensibile degli utenti o dei dispositivi.

2. TIPOLOGIA DI DATI TRATTATI
- Dati personali: Nessuna registrazione, nessun account, nessun dato personale richiesto.
- Identificatori dispositivo: Nessun ID pubblicitario (AD_ID non utilizzato), nessun IMEI o Android ID, nessun accesso a contatti, fotocamera o posizione GPS.
- Dati di gioco (Salvataggio Locale): I progressi (lettere completate, stelle, disegni colorati) sono memorizzati unicamente sul dispositivo dell'utente e non vengono mai inviati a server esterni. Possono essere azzerati in ogni momento dai genitori nell'Area Genitori.

3. PUBBLICITÀ E TERZE PARTI
- Zero pubblicità (nessun banner, video commerciale o annuncio).
- Nessun SDK di terze parti per tracciamento o profilazione.
- Nessun acquisto in-app.
- Parental Gate (cancello di sicurezza matematico per i genitori).

4. TITOLARE E CONTATTI
Sviluppatore: Calogero La Mattina
Email: calogero.lamattina.k@gmail.com

--- ENGLISH VERSION ---
PRIVACY POLICY - MAGIC ALPHABET
Package ID: com.alfabetomagico.myapp
Developer: Calogero La Mattina (calogero.lamattina.k@gmail.com)
The app does not collect, store, transmit, or share any personal or sensitive user data. Fully compliant with Google Play Families Policy, COPPA, and GDPR.`;
                          navigator.clipboard.writeText(fullPolicyText);
                          setCopiedPolicy(true);
                          soundService.playSuccess();
                          setTimeout(() => setCopiedPolicy(false), 2500);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                      >
                        {copiedPolicy ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedPolicy ? 'Testo Copiato!' : '1. Copia Testo per Google Sites'}
                      </button>

                      <a
                        href="https://sites.google.com/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        2. Apri Google Sites (Gratuito)
                      </a>

                      <a
                        href="/privacy.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Vedi Pagina HTML Locale
                      </a>
                    </div>
                  </div>

                  {/* Complete In-App Policy Text (Mandatory for Store & In-App) */}
                  <div className="text-xs leading-relaxed text-slate-700 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="border-b border-slate-200 pb-2">
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Informativa sulla Privacy - Alfabeto Magico
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        App: Alfabeto Magico (com.alfabetomagico.myapp) &bull; Sviluppatore: Calogero La Mattina &bull; Aggiornato: Ottobre 2026
                      </p>
                    </div>

                    <p>
                      La presente Informativa si applica all'applicazione <strong>Alfabeto Magico</strong> (<code>com.alfabetomagico.myapp</code>). L'app è concepita appositamente per bambini e famiglie ed è pienamente conforme a <strong>Google Play Families Policy</strong>, <strong>COPPA</strong> e <strong>GDPR per minori</strong>.
                    </p>

                    <div className="space-y-2">
                      <p className="font-bold text-slate-800">Punti chiave dell'informativa:</p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600">
                        <li><strong>Nessuna Raccolta Dati Personali:</strong> L'app non raccoglie, non conserva, non trasmette e non vende alcun dato identificativo (nessun nome, email, numero telefonico, audio o foto).</li>
                        <li><strong>Zero Pubblicità e Tracciamento:</strong> Nessun banner, video commerciale o annuncio pubblicitario. L'applicazione non utilizza l'ID pubblicitario di Google (AD_ID rimosso).</li>
                        <li><strong>Nessun Permesso Sensibile:</strong> Non richiede permessi a fotocamera, microfono, contatti o posizione geografica GPS.</li>
                        <li><strong>Salvataggio 100% Locale:</strong> Le lettere completate, le stelle e i disegni risiedono esclusivamente nella memoria locale del dispositivo e possono essere azzerati in ogni momento dai genitori.</li>
                        <li><strong>Titolare e Contatti:</strong> Calogero La Mattina — Email: <a href="mailto:calogero.lamattina.k@gmail.com" className="text-indigo-600 font-bold underline">calogero.lamattina.k@gmail.com</a>.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
