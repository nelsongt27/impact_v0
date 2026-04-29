// Overview view — Vista 1 of the Axialent Impact dashboard.
const { Sparkle, SparkleTrio, Icons, AxData, AxCharts } = window;
const { AreaChart, HorizontalBar, Donut, fmt } = AxCharts;

// ---------- KPI strip (editorial / hairlines, no shadow cards) ----------
const KpiStrip = () => {
  const items = [
    { value: '7,266', label: 'Responses',          note: 'individual answers, 2010 – 2026' },
    { value: '593',   label: 'Surveys',            note: 'normalized records' },
    { value: '30+',   label: 'Active clients',     note: 'named, excl. unknown' },
    { value: '15',    label: 'Years of history',   note: '2010 – present' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderTop: '1px solid var(--ax-ink-100)',
      borderBottom: '1px solid var(--ax-ink-100)',
    }}>
      {items.map((it, i) => (
        <div key={it.label} style={{
          padding: '28px 32px',
          borderRight: i < items.length - 1 ? '1px solid var(--ax-ink-100)' : 'none',
        }}>
          <div className="ax-eyebrow">{it.label}</div>
          <div style={{
            fontFamily: 'var(--ax-font-display)',
            fontSize: 56,
            color: 'var(--ax-ink-900)',
            lineHeight: 1,
            marginTop: 16,
            letterSpacing: '-0.02em',
          }}>{it.value}</div>
          <div style={{
            marginTop: 12,
            fontSize: 12,
            color: 'var(--ax-text-muted)',
            fontFamily: 'var(--ax-font-mono)',
            letterSpacing: '0.02em',
          }}>{it.note}</div>
        </div>
      ))}
    </div>
  );
};

// ---------- Hero ----------
const Hero = () => (
  <section style={{ padding: '72px 0 56px', position: 'relative' }}>
    <div className="ax-eyebrow">Axialent · Impact Record · 2010 – 2026</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start', marginTop: 24 }}>
      <h1 className="ax-display" style={{ fontSize: 'clamp(40px, 5.6vw, 76px)', lineHeight: 1.05, maxWidth: '18ch' }}>
        <span style={{ color: 'var(--ax-ink-900)' }}>7,266 responses</span>
        <span style={{ color: 'var(--ax-ink-400)' }}> across </span>
        <span style={{ color: 'var(--ax-ink-900)' }}>593 surveys</span>
        <span style={{ color: 'var(--ax-ink-400)' }}>, </span>
        <span style={{ color: 'var(--ax-ink-900)' }}>30+ clients</span>
        <span style={{ color: 'var(--ax-ink-400)' }}>, </span>
        <span style={{ color: 'var(--ax-ink-900)', fontStyle: 'italic' }}>15 years.</span>
      </h1>
      <SparkleTrio size={120} color="var(--ax-amber-400)" />
    </div>
    <p style={{ marginTop: 24, maxWidth: 560, color: 'var(--ax-text-muted)', fontSize: 16, lineHeight: 1.55 }}>
      Every survey we've shipped — diagnostics, feedback, assessments — normalized into a single record.
      Use it to answer the only question that matters: <em>does the work move people?</em>
    </p>
  </section>
);

// ---------- Activity over time ----------
const ActivityChart = () => (
  <section style={{ padding: '40px 0', borderTop: '1px solid var(--ax-ink-100)' }}>
    <div className="ax-row" style={{ justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <div className="ax-eyebrow">Section 01</div>
        <h2 className="ax-display" style={{ fontSize: 28, marginTop: 6 }}>Activity over time</h2>
      </div>
      <div className="ax-row" style={{ gap: 24, fontSize: 12, color: 'var(--ax-text-muted)' }}>
        <span className="ax-row" style={{ gap: 8 }}>
          <span style={{ width: 10, height: 2, background: 'var(--ax-ink-800)' }} /> Surveys
        </span>
        <span className="ax-row" style={{ gap: 8 }}>
          <span style={{ width: 10, height: 10, background: 'var(--ax-amber-400)', borderRadius: '50%' }} /> Inflection year
        </span>
      </div>
    </div>
    <AreaChart data={AxData.yearlyData} accentYears={AxData.annotations} height={340} />
    <div style={{ marginTop: 16, fontSize: 12, color: 'var(--ax-text-muted)', fontFamily: 'var(--ax-font-mono)', letterSpacing: '0.02em' }}>
      2020 marked a pause as engagements moved virtual. 2022 and 2025 are the two largest years on record.
    </div>
  </section>
);

// ---------- Top clients + types ----------
const ClientsAndTypes = () => (
  <section style={{
    display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 56,
    padding: '56px 0', borderTop: '1px solid var(--ax-ink-100)',
  }}>
    {/* Left — top clients */}
    <div>
      <div className="ax-eyebrow">Section 02</div>
      <h2 className="ax-display" style={{ fontSize: 28, marginTop: 6, marginBottom: 8 }}>Top clients by surveys shipped</h2>
      <p className="ax-text-muted" style={{ fontSize: 13, maxWidth: '52ch', marginBottom: 28 }}>
        Top 15 named accounts. P&G represents the longest and densest engagement, with a decade of recurring work.
      </p>
      <HorizontalBar data={AxData.topClients} valueKey="surveys" labelKey="name" />
      <div style={{ marginTop: 24, fontSize: 11, color: 'var(--ax-text-subtle)', fontFamily: 'var(--ax-font-mono)' }}>
        <span style={{ color: 'var(--ax-text-muted)' }}>219 surveys</span> with client name pending — backfill in progress.
      </div>
    </div>
    {/* Right — donut + list */}
    <div>
      <div className="ax-eyebrow">Section 03</div>
      <h2 className="ax-display" style={{ fontSize: 28, marginTop: 6, marginBottom: 28 }}>Survey types</h2>
      <div className="ax-row" style={{ gap: 32, alignItems: 'flex-start' }}>
        <Donut data={AxData.surveyTypes.map(t => ({ type: t.type, count: t.count }))} size={200} />
        <div className="ax-stack" style={{ gap: 10, flex: 1, paddingTop: 6 }}>
          {AxData.surveyTypes.map((t, i) => {
            const palette = ['var(--ax-ink-800)','var(--ax-amber-400)','var(--ax-cobalt)','var(--ax-cyan)','var(--ax-ink-400)','var(--ax-amber-200)','var(--ax-ink-200)'];
            return (
              <div key={t.type} className="ax-row" style={{ gap: 10, fontSize: 13, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, background: palette[i % palette.length], borderRadius: 1 }} />
                <span style={{ flex: 1, color: 'var(--ax-text)', textTransform: 'capitalize' }}>{t.type.replace('_', ' ')}</span>
                <span style={{ fontFamily: 'var(--ax-font-mono)', fontSize: 12, color: 'var(--ax-text-muted)' }}>{t.count}</span>
                <span style={{ fontFamily: 'var(--ax-font-mono)', fontSize: 11, color: 'var(--ax-text-subtle)', width: 38, textAlign: 'right' }}>{t.pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: 11, color: 'var(--ax-text-subtle)', fontFamily: 'var(--ax-font-mono)' }}>
        <span style={{ color: 'var(--ax-text-muted)' }}>"other"</span> reflects surveys pending taxonomy review.
      </div>
    </div>
  </section>
);

// ---------- Quality & coverage ----------
const QualityCoverage = () => (
  <section style={{ padding: '56px 0', borderTop: '1px solid var(--ax-ink-100)' }}>
    <div className="ax-eyebrow">Section 04</div>
    <h2 className="ax-display" style={{ fontSize: 28, marginTop: 6, marginBottom: 32 }}>Coverage & quality</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
      {/* Languages — stacked bar */}
      <div>
        <div className="ax-eyebrow" style={{ marginBottom: 14 }}>Languages</div>
        <div style={{ display: 'flex', height: 10, borderRadius: 1, overflow: 'hidden', marginBottom: 16 }}>
          {AxData.languages.map((l, i) => (
            <div key={l.lang} style={{
              flex: l.count,
              background: ['var(--ax-ink-800)','var(--ax-amber-400)','var(--ax-cobalt)'][i],
            }} />
          ))}
        </div>
        <div className="ax-stack" style={{ gap: 8 }}>
          {AxData.languages.map((l, i) => (
            <div key={l.lang} className="ax-row" style={{ gap: 10, fontSize: 13 }}>
              <span style={{ width: 8, height: 8, background: ['var(--ax-ink-800)','var(--ax-amber-400)','var(--ax-cobalt)'][i] }} />
              <span style={{ flex: 1 }}>{l.lang}</span>
              <span style={{ fontFamily: 'var(--ax-font-mono)', fontSize: 12, color: 'var(--ax-text-muted)' }}>{l.count}</span>
              <span style={{ fontFamily: 'var(--ax-font-mono)', fontSize: 11, color: 'var(--ax-text-subtle)', width: 44, textAlign: 'right' }}>{l.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase coverage */}
      <div>
        <div className="ax-eyebrow" style={{ marginBottom: 14 }}>Phase coverage</div>
        <div className="ax-stack" style={{ gap: 16 }}>
          {AxData.phases.map(p => (
            <div key={p.phase} className="ax-row" style={{ gap: 16, alignItems: 'baseline' }}>
              <div style={{
                fontFamily: 'var(--ax-font-display)',
                fontSize: 28,
                color: p.phase === 'post' ? 'var(--ax-ink-900)' : 'var(--ax-ink-700)',
                minWidth: 56,
              }}>{p.count}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--ax-text)', textTransform: 'capitalize' }}>{p.phase}</div>
                <div style={{ fontSize: 11, color: 'var(--ax-text-subtle)', fontFamily: 'var(--ax-font-mono)' }}>
                  {p.phase === 'post' ? 'after-program feedback' :
                   p.phase === 'mid'  ? 'mid-program checkpoint' :
                   p.phase === 'pre'  ? 'baseline diagnostic' :
                                        'unphased / one-shot'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parse confidence */}
      <div>
        <div className="ax-eyebrow" style={{ marginBottom: 14 }}>Parse confidence</div>
        <div style={{ display: 'flex', height: 10, borderRadius: 1, overflow: 'hidden', marginBottom: 16 }}>
          {AxData.confidence.map((c, i) => (
            <div key={c.level} style={{
              flex: c.pct,
              background: ['var(--ax-ink-800)','var(--ax-ink-400)','var(--ax-ink-200)'][i],
            }} />
          ))}
        </div>
        <div className="ax-stack" style={{ gap: 8 }}>
          {AxData.confidence.map((c, i) => (
            <div key={c.level} className="ax-row" style={{ gap: 10, fontSize: 13 }}>
              <span style={{ width: 8, height: 8, background: ['var(--ax-ink-800)','var(--ax-ink-400)','var(--ax-ink-200)'][i] }} />
              <span style={{ flex: 1, textTransform: 'capitalize' }}>{c.level}</span>
              <span style={{ fontFamily: 'var(--ax-font-mono)', fontSize: 11, color: 'var(--ax-text-subtle)', width: 44, textAlign: 'right' }}>{c.pct}%</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, fontSize: 11, color: 'var(--ax-text-subtle)', fontFamily: 'var(--ax-font-mono)', lineHeight: 1.5 }}>
          Confidence reflects how reliably we mapped raw titles to client/program/phase. Low-confidence rows are flagged for manual review.
        </div>
      </div>
    </div>
  </section>
);

window.OverviewSections = { Hero, KpiStrip, ActivityChart, ClientsAndTypes, QualityCoverage };
