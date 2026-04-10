<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Program Pulse</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0f0f10; --surface: #17171a; --surface2: #1e1e22;
  --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.15);
  --text: #f0ede8; --muted: rgba(240,237,232,0.42);
  --accent: #4f8ef7; --accent-dim: rgba(79,142,247,0.13); --accent-glow: rgba(79,142,247,0.28);
  --success: #3ecf8e; --success-dim: rgba(62,207,142,0.13);
  --error: #f7694f;
  --font: 'DM Sans', sans-serif; --mono: 'DM Mono', monospace;
}
body { background: var(--bg); color: var(--text); font-family: var(--font); font-weight: 300; min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 2rem 1.25rem 3rem; }
.container { width: 100%; max-width: 560px; }

/* ── Setup screen ── */
#setup {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 0; text-align: center;
}
.setup-icon { font-size: 32px; margin-bottom: 1.5rem; }
.setup-title { font-size: 18px; font-weight: 500; margin-bottom: 8px; }
.setup-sub { font-size: 13px; color: var(--muted); margin-bottom: 2rem; line-height: 1.6; max-width: 340px; }
.setup-input {
  width: 100%; max-width: 420px; height: 44px;
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 10px; color: var(--text);
  font-family: var(--mono); font-size: 12px;
  padding: 0 14px; outline: none; margin-bottom: 10px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.setup-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.setup-input::placeholder { color: var(--muted); }
.setup-btn {
  width: 100%; max-width: 420px; padding: 13px;
  background: var(--accent-dim); border: 1px solid var(--accent-glow);
  border-radius: 10px; color: var(--accent);
  font-family: var(--font); font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
}
.setup-btn:hover { background: rgba(79,142,247,0.22); }
.setup-err { font-family: var(--mono); font-size: 11px; color: var(--error); margin-top: 8px; min-height: 16px; }
.setup-hint { font-size: 11px; color: var(--muted); margin-top: 12px; line-height: 1.6; max-width: 380px; }
.setup-hint code { font-family: var(--mono); background: var(--surface); padding: 1px 6px; border-radius: 4px; font-size: 10px; }

/* ── Loading ── */
#overlay { position: fixed; inset: 0; background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; z-index: 99; transition: opacity 0.35s; }
#overlay.gone { opacity: 0; pointer-events: none; }
.ring { width: 30px; height: 30px; border: 2px solid var(--border2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ring-txt { font-family: var(--mono); font-size: 11px; color: var(--muted); }

/* ── Main app ── */
#app { display: none; width: 100%; }
#app.visible { display: block; }

.header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.75rem; }
.header h1 { font-size: 20px; font-weight: 400; letter-spacing: -0.02em; }
.pill { font-family: var(--mono); font-size: 11px; padding: 3px 10px; border-radius: 99px; background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent-glow); }
.last-save { margin-left: auto; font-family: var(--mono); font-size: 10px; color: var(--muted); }
.reset-btn { background: none; border: none; color: var(--muted); font-size: 11px; font-family: var(--mono); cursor: pointer; text-decoration: underline; padding: 0; }
.reset-btn:hover { color: var(--text); }

.section-label { font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin: 1.25rem 0 0.5rem; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
.field { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-bottom: 1px solid var(--border); transition: background 0.1s; }
.field:last-child { border-bottom: none; }
.field:hover { background: var(--surface2); }
.fl { flex: 1; min-width: 0; }
.fl strong { display: block; font-size: 13px; font-weight: 500; margin-bottom: 2px; }
.fl span { font-size: 11px; color: var(--muted); font-family: var(--mono); }
.fr { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.prog { display: flex; align-items: center; gap: 6px; }
.track { width: 52px; height: 3px; border-radius: 99px; background: var(--border2); overflow: hidden; }
.fill { height: 100%; border-radius: 99px; background: var(--accent); width: 0%; transition: width 0.4s cubic-bezier(.34,1.56,.64,1); }
.pct { font-family: var(--mono); font-size: 11px; color: var(--accent); min-width: 30px; text-align: right; }

input[type="number"] { width: 52px; height: 34px; background: var(--surface2); border: 1px solid var(--border2); border-radius: 7px; color: var(--text); font-family: var(--mono); font-size: 14px; text-align: center; outline: none; transition: border-color 0.15s, box-shadow 0.15s; -moz-appearance: textfield; }
input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
input[type="number"]:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.sep { font-size: 12px; color: var(--muted); font-family: var(--mono); }

.niu-scale { display: flex; gap: 4px; align-items: center; }
.niu-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border2); cursor: pointer; transition: background 0.2s; }
.niu-dot.active { background: var(--accent); }

.cycle-row { display: flex; align-items: center; gap: 14px; padding: 12px 18px; }
.cycle-row-lbl { font-size: 13px; font-weight: 500; }
.cycles { display: flex; gap: 6px; }
.cyc { font-family: var(--mono); font-size: 11px; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--border2); background: transparent; color: var(--muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.12s; }
.cyc:hover { color: var(--text); border-color: rgba(255,255,255,0.3); }
.cyc.on { background: var(--accent-dim); border-color: var(--accent-glow); color: var(--accent); font-weight: 500; }

.summary { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; margin: 10px 0; }
.metric { background: var(--surface); border: 1px solid var(--border); border-radius: 11px; padding: 12px 8px; text-align: center; }
.metric-val { font-family: var(--mono); font-size: 18px; font-weight: 500; }
.metric-lbl { font-size: 10px; color: var(--muted); margin-top: 3px; line-height: 1.3; }

.save-btn { width: 100%; margin-top: 10px; padding: 14px; background: var(--accent-dim); border: 1px solid var(--accent-glow); border-radius: 11px; color: var(--accent); font-family: var(--font); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.save-btn:hover:not(:disabled) { background: rgba(79,142,247,0.22); box-shadow: 0 0 22px var(--accent-glow); }
.save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.save-btn.ok { background: var(--success-dim); border-color: rgba(62,207,142,0.35); color: var(--success); }

.status { font-family: var(--mono); font-size: 11px; text-align: center; color: var(--muted); margin-top: 8px; min-height: 16px; }
.status.ok  { color: var(--success); }
.status.err { color: var(--error); }

.dot { display: inline-block; }
.dot:nth-child(1) { animation: blink 1s 0.0s infinite; }
.dot:nth-child(2) { animation: blink 1s 0.2s infinite; }
.dot:nth-child(3) { animation: blink 1s 0.4s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.1} }
</style>
</head>
<body>

<!-- Loading -->
<div id="overlay">
  <div class="ring"></div>
  <span class="ring-txt">Chargement…</span>
</div>

<!-- Setup screen (first visit only) -->
<div id="setup" style="display:none; width:100%; max-width:560px;">
  <div class="setup-icon">📋</div>
  <p class="setup-title">Connecte ta page Notion</p>
  <p class="setup-sub">Colle l'URL de ta page <strong>Program Dashboard</strong>. Tu n'auras à faire ça qu'une seule fois.</p>
  <input class="setup-input" id="setup-url" type="text" placeholder="https://notion.so/ton-workspace/Program-Dashboard-abc123..." />
  <button class="setup-btn" onclick="setupSave()">Connecter →</button>
  <p class="setup-err" id="setup-err"></p>
  <p class="setup-hint">
    Pour trouver l'URL : ouvre ta page Notion → clique sur <code>···</code> en haut à droite → <code>Copier le lien</code>
  </p>
</div>

<!-- Main app -->
<div id="app">
  <div class="container">
    <div class="header">
      <h1>Program Pulse</h1>
      <span class="pill" id="pill">Cycle —</span>
      <span class="last-save" id="last-save"></span>
      <button class="reset-btn" onclick="resetSetup()" title="Changer de page Notion">⚙</button>
    </div>

    <p class="section-label">Problèmes résolus par l'IA</p>
    <div class="card">
      <div class="field">
        <div class="fl"><strong>Frictions résolues par l'IA</strong><span>résolues / identifiées au total</span></div>
        <div class="fr">
          <div class="prog"><div class="track"><div class="fill" id="f-bar"></div></div><span class="pct" id="f-pct">—</span></div>
          <input type="number" id="f-done"  min="0" placeholder="0"/>
          <span class="sep">/</span>
          <input type="number" id="f-total" min="0" placeholder="0"/>
        </div>
      </div>
    </div>

    <p class="section-label">Nouvelles façons de travailler</p>
    <div class="card">
      <div class="field">
        <div class="fl"><strong>Habitudes ancrées</strong><span>PDCA — Décision : Conserver</span></div>
        <div class="fr"><input type="number" id="h-val" min="0" placeholder="0"/></div>
      </div>
      <div class="field">
        <div class="fl"><strong>Tâches IA récurrentes</strong><span>quotidiennes · hebdomadaires</span></div>
        <div class="fr">
          <input type="number" id="t-daily"  min="0" placeholder="0" style="width:46px"/>
          <span class="sep">quotid.</span>
          <input type="number" id="t-weekly" min="0" placeholder="0" style="width:46px; margin-left:4px"/>
          <span class="sep">hebdo.</span>
        </div>
      </div>
    </div>

    <p class="section-label">Valeur confirmée par le commanditaire</p>
    <div class="card">
      <div class="field">
        <div class="fl"><strong>Nombre d'entrées validées</strong><span>combien de bénéfices confirmés cette semaine ?</span></div>
        <div class="fr"><input type="number" id="v-entries" min="0" placeholder="0" style="width:52px"/><span class="sep">entrées</span></div>
      </div>
      <div class="field">
        <div class="fl"><strong>Score NIU moyen</strong><span>valeur perçue par le commanditaire (1 = faible · 8 = fort)</span></div>
        <div class="fr">
          <div class="niu-scale" id="niu-scale">
            <div class="niu-dot" data-v="1"></div><div class="niu-dot" data-v="2"></div>
            <div class="niu-dot" data-v="3"></div><div class="niu-dot" data-v="4"></div>
            <div class="niu-dot" data-v="5"></div><div class="niu-dot" data-v="6"></div>
            <div class="niu-dot" data-v="7"></div><div class="niu-dot" data-v="8"></div>
          </div>
          <input type="number" id="v-niu" min="1" max="8" step="0.5" placeholder="—" style="width:52px"/>
        </div>
      </div>
    </div>

    <p class="section-label">Cycle en cours</p>
    <div class="card">
      <div class="cycle-row">
        <span class="cycle-row-lbl">Cycle</span>
        <div class="cycles">
          <button class="cyc" onclick="setCycle(1)">1</button><button class="cyc" onclick="setCycle(2)">2</button>
          <button class="cyc" onclick="setCycle(3)">3</button><button class="cyc" onclick="setCycle(4)">4</button>
          <button class="cyc" onclick="setCycle(5)">5</button><button class="cyc" onclick="setCycle(6)">6</button>
        </div>
      </div>
    </div>

    <div class="summary" style="margin-top:14px">
      <div class="metric"><div class="metric-val" id="s-fric">—</div><div class="metric-lbl">Frictions<br>résolues</div></div>
      <div class="metric"><div class="metric-val" id="s-daily">—</div><div class="metric-lbl">Tâches<br>quotid.</div></div>
      <div class="metric"><div class="metric-val" id="s-weekly">—</div><div class="metric-lbl">Tâches<br>hebdo.</div></div>
      <div class="metric"><div class="metric-val" id="s-niu">—</div><div class="metric-lbl">Score<br>NIU</div></div>
    </div>

    <button class="save-btn" id="save-btn" onclick="sauvegarder()">Sauvegarder</button>
    <p class="status" id="status"></p>
  </div>
</div>

<script>
  let cycle = null;
  let PAGE_ID = null;

  /* ── Extraire l'ID Notion depuis une URL ── */
  function extractNotionId(input) {
    input = input.trim();
    // Format: 32 hex chars (with or without dashes)
    const plain = input.replace(/-/g, '');
    const match = plain.match(/([a-f0-9]{32})/i);
    if (match) {
      const id = match[1];
      return id.slice(0,8)+'-'+id.slice(8,12)+'-'+id.slice(12,16)+'-'+id.slice(16,20)+'-'+id.slice(20);
    }
    return null;
  }

  /* ── Setup : première visite ── */
  function setupSave() {
    const raw = document.getElementById('setup-url').value;
    const id  = extractNotionId(raw);
    if (!id) {
      document.getElementById('setup-err').textContent = 'URL non reconnue — copie le lien depuis Notion (··· → Copier le lien)';
      return;
    }
    localStorage.setItem('pulse_page_id', id);
    PAGE_ID = id;
    showApp();
  }

  function resetSetup() {
    if (!confirm('Changer de page Notion ?')) return;
    localStorage.removeItem('pulse_page_id');
    document.getElementById('app').classList.remove('visible');
    document.getElementById('setup').style.display = 'flex';
  }

  /* ── Init : vérifie si déjà configuré ── */
  function init() {
    const saved = localStorage.getItem('pulse_page_id');
    if (saved) {
      PAGE_ID = saved;
      showApp();
    } else {
      document.getElementById('overlay').classList.add('gone');
      document.getElementById('setup').style.display = 'flex';
    }
  }

  async function showApp() {
    document.getElementById('setup').style.display = 'none';
    document.getElementById('app').classList.add('visible');
    await charger();
  }

  /* ── Cycle ── */
  function setCycle(n) {
    cycle = n;
    document.getElementById('pill').textContent = 'Cycle ' + n;
    document.querySelectorAll('.cyc').forEach((b,i) => b.classList.toggle('on', i+1===n));
  }

  /* ── Bar ── */
  function updateBar() {
    const done  = +document.getElementById('f-done').value  || 0;
    const total = +document.getElementById('f-total').value || 0;
    const pct   = total > 0 ? Math.round(done/total*100) : 0;
    document.getElementById('f-bar').style.width = pct+'%';
    document.getElementById('f-pct').textContent  = total > 0 ? pct+'%' : '—';
    document.getElementById('s-fric').textContent = total > 0 ? done+'/'+total : '—';
  }

  /* ── NIU ── */
  function updateNiu() {
    const val = parseFloat(document.getElementById('v-niu').value) || 0;
    document.querySelectorAll('.niu-dot').forEach(d =>
      d.classList.toggle('active', +d.dataset.v <= Math.round(val)));
    document.getElementById('s-niu').textContent = val ? val.toFixed(1) : '—';
  }
  document.querySelectorAll('.niu-dot').forEach(d => {
    d.addEventListener('click', () => { document.getElementById('v-niu').value = d.dataset.v; updateNiu(); });
  });

  /* ── Summary ── */
  function updateSummary() {
    const daily  = document.getElementById('t-daily').value;
    const weekly = document.getElementById('t-weekly').value;
    document.getElementById('s-daily').textContent  = daily  !== '' ? daily  : '—';
    document.getElementById('s-weekly').textContent = weekly !== '' ? weekly : '—';
  }

  ['f-done','f-total'].forEach(id => document.getElementById(id).addEventListener('input', updateBar));
  ['t-daily','t-weekly','h-val','v-entries'].forEach(id => document.getElementById(id).addEventListener('input', updateSummary));
  document.getElementById('v-niu').addEventListener('input', updateNiu);
  document.getElementById('setup-url').addEventListener('keydown', e => { if (e.key === 'Enter') setupSave(); });

  function setStatus(msg, cls) {
    const el = document.getElementById('status');
    el.textContent = msg; el.className = 'status' + (cls ? ' '+cls : '');
  }
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== null && val !== undefined && String(val) !== '—' && String(val) !== '') el.value = val;
  }

  /* ── Charger depuis Notion ── */
  async function charger() {
    try {
      const res = await fetch('/api/pulse?action=load&page=' + PAGE_ID);
      if (!res.ok) throw new Error('HTTP '+res.status);
      const d = await res.json();
      setVal('f-done',    d.frictions_done);
      setVal('f-total',   d.frictions_total);
      setVal('h-val',     d.habits);
      setVal('t-daily',   d.tasks_daily);
      setVal('t-weekly',  d.tasks_weekly);
      setVal('v-entries', d.entries);
      setVal('v-niu',     d.niu);
      if (d.cycle) setCycle(d.cycle);
      if (d.last_updated) document.getElementById('last-save').textContent = 'Sauvegardé : '+d.last_updated;
      updateBar(); updateSummary(); updateNiu();
    } catch(e) { console.warn('Chargement :', e.message); }
    document.getElementById('overlay').classList.add('gone');
  }

  /* ── Sauvegarder ── */
  async function sauvegarder() {
    if (!cycle) { setStatus('Sélectionne un cycle avant de sauvegarder.', 'err'); return; }
    const payload = {
      page:            PAGE_ID,
      frictions_done:  document.getElementById('f-done').value   || null,
      frictions_total: document.getElementById('f-total').value  || null,
      habits:          document.getElementById('h-val').value    || null,
      tasks_daily:     document.getElementById('t-daily').value  || null,
      tasks_weekly:    document.getElementById('t-weekly').value || null,
      entries:         document.getElementById('v-entries').value|| null,
      niu:             document.getElementById('v-niu').value    || null,
      cycle,
    };
    const btn = document.getElementById('save-btn');
    btn.disabled = true;
    btn.innerHTML = 'Sauvegarde <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
    setStatus('');
    try {
      const res = await fetch('/api/pulse', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error || 'HTTP '+res.status); }
      const today = new Date().toLocaleDateString('fr-CA');
      btn.classList.add('ok'); btn.textContent = '✓ Sauvegardé';
      document.getElementById('last-save').textContent = 'Sauvegardé : '+today;
      setStatus('Cycle '+cycle+' · '+today, 'ok');
      setTimeout(() => { btn.classList.remove('ok'); btn.textContent = 'Sauvegarder'; btn.disabled = false; }, 4000);
    } catch(e) {
      btn.textContent = 'Sauvegarder'; btn.disabled = false;
      setStatus('Erreur : '+e.message, 'err');
    }
  }

  init();
</script>
</body>
</html>
