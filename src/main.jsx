import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Check, CircleAlert, Gauge, Landmark, RotateCcw, ShieldCheck, Sparkles, WalletCards, X } from 'lucide-react';
import './styles.css';

const initialForm = { loanAmount: '', creditScore: '', monthlyIncome: '' };

function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  async function analyze(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanAmount: Number(form.loanAmount),
          creditScore: Number(form.creditScore),
          monthlyIncome: Number(form.monthlyIncome)
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to analyze this application.');
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setForm(initialForm);
    setResult(null);
    setError('');
  }

  const requestedAmount = Number(form.loanAmount) || 0;
  const income = Number(form.monthlyIncome) || 0;
  const incomeRatio = income ? Math.round((requestedAmount / income) * 100) : 0;

  return (
    <main className="app-shell">
      <nav className="topbar">
        <div className="brand"><span className="brand-mark"><Landmark size={18} /></span><span>LoanLens</span></div>
        <div className="topbar-right"><span className="application-id">NEW APPLICATION</span><span className="status"><span className="status-dot" /> Secure session</span></div>
      </nav>

      <section className="hero hero-entry">
        <div className="eyebrow">PERSONAL LENDING / ELIGIBILITY CHECK</div>
        <h1>Let’s look at your <em>borrowing fit.</em></h1>
        <p className="hero-copy">Enter three details to get an instant, transparent pre-screening. No account or personal identification required.</p>
      </section>

      <section className="workspace">
        <form className="input-panel" onSubmit={analyze}>
          <div className="panel-heading">
            <div><span className="section-kicker">STEP 1 OF 2</span><h2>Your application</h2></div>
            <span className="secure-badge"><ShieldCheck size={15} /> Encrypted</span>
          </div>

          <div className="progress-line"><span className="active" /><span /><span /></div>
          <p className="form-intro">Use your current figures for the most useful estimate.</p>

          <label className="field">
            <span>How much would you like to borrow?</span>
            <span className="input-wrap"><span>$</span><input name="loanAmount" type="number" min="1" step="100" value={form.loanAmount} onChange={updateField} placeholder="e.g. 25,000" required /></span>
            <small>Total amount you are requesting</small>
          </label>
          <label className="field">
            <span>What is your credit score?</span>
            <span className="input-wrap"><Gauge size={17} /><input name="creditScore" type="number" min="1" max="850" value={form.creditScore} onChange={updateField} placeholder="e.g. 720" required /></span>
            <small>Find this in your banking app or credit report</small>
          </label>
          <label className="field">
            <span>What is your monthly income?</span>
            <span className="input-wrap"><span>$</span><input name="monthlyIncome" type="number" min="1" step="100" value={form.monthlyIncome} onChange={updateField} placeholder="e.g. 5,000" required /></span>
            <small>Gross income before taxes and deductions</small>
          </label>

          <div className="live-metric"><span>Loan / income ratio</span><strong>{incomeRatio}%</strong><div className="meter"><i style={{ width: `${Math.min(incomeRatio, 100)}%` }} /></div></div>
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Checking your fit...' : 'Check my eligibility'}<ArrowRight size={18} /></button>
          <button className="reset-button" type="button" onClick={reset}><RotateCcw size={15} /> Reset fields</button>
        </form>

        <section className={`result-panel ${result ? 'has-result' : ''}`} aria-live="polite">
          {!result && !error && <div className="empty-state"><div className="empty-icon"><Sparkles size={27} /></div><span className="section-kicker">STEP 2 OF 2</span><h2>See your eligibility</h2><p>Once you submit, we’ll compare your details against a few simple lending checkpoints.</p><div className="benefit-list"><span><WalletCards size={16} /> Clear, plain-language result</span><span><ShieldCheck size={16} /> No data is stored</span><span><Gauge size={16} /> Takes less than a minute</span></div></div>}
          {error && <div className="error-state"><CircleAlert size={28} /><span className="section-kicker">INPUT CHECK</span><h2>Something needs attention</h2><p>{error}</p></div>}
          {result && <>
            <div className="result-heading"><div><span className="section-kicker">02 / DECISION OUTPUT</span><h2>Application result</h2></div><span className={`decision-pill ${result.decision}`}>
              {result.decision === 'approved' ? <Check size={16} /> : <X size={16} />}{result.decision}
            </span></div>
            <div className={`decision-banner ${result.decision}`}><div className="decision-score"><strong>{result.score}</strong><span>profile<br />score</span></div><div><h3>{result.decision === 'approved' ? 'Ready for approval' : 'Not ready for approval'}</h3><p>{result.summary}</p></div></div>
            <div className="check-list"><div className="list-label">Assessment checkpoints</div>{result.checks.map((check) => <div className="check-row" key={check.key}><span className={`check-icon ${check.passed ? 'pass' : 'fail'}`}>{check.passed ? <Check size={15} /> : <X size={15} />}</span><span>{check.label}</span><strong>{check.detail}</strong></div>)}</div>
            <div className="result-note"><CircleAlert size={16} /><span>This is an educational pre-screening model, not a final lending decision.</span></div>
          </>}
        </section>
      </section>
      <footer><span>LoanLens</span> <span>•</span> Lending analysis module <span>•</span> v1.0<br /><span className="credit-line">© 2026 Designed &amp; Developed by Pushpa C</span></footer>
    </main>
  );
}

export default App;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
