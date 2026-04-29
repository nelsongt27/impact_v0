// Charts — pure SVG, no external libs. Editorial style: hairlines only, no fills,
// minimal axes. Mirrors how the production Recharts components will be configured.

const fmt = (n) => n.toLocaleString('en-US');

// ---------- AREA / LINE CHART ----------
const AreaChart = ({ data, height = 320, accentYears = {} }) => {
  const W = 1000, H = height, M = { t: 32, r: 24, b: 36, l: 40 };
  const iw = W - M.l - M.r, ih = H - M.t - M.b;
  const max = Math.max(...data.map(d => d.surveys));
  const xs = (i) => M.l + (i / (data.length - 1)) * iw;
  const ys = (v) => M.t + ih - (v / max) * ih;

  const pts = data.map((d, i) => `${xs(i)},${ys(d.surveys)}`).join(' ');
  const areaPath = `M ${xs(0)},${M.t + ih} L ${pts.split(' ').join(' L ')} L ${xs(data.length-1)},${M.t + ih} Z`;
  const linePath = `M ${pts.split(' ').join(' L ')}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(max * t));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* gridlines */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={M.l} x2={W - M.r} y1={ys(t)} y2={ys(t)}
                stroke="var(--ax-ink-100)" strokeWidth="1" />
          <text x={M.l - 8} y={ys(t)} dy="0.32em" textAnchor="end"
                fontFamily="var(--ax-font-mono)" fontSize="10" fill="var(--ax-ink-400)">{t}</text>
        </g>
      ))}

      {/* area fill */}
      <path d={areaPath} fill="var(--ax-amber-400)" opacity="0.14" />
      {/* line */}
      <path d={linePath} fill="none" stroke="var(--ax-ink-800)" strokeWidth="1.75" />

      {/* points + annotations on accent years */}
      {data.map((d, i) => {
        const isAccent = !!accentYears[d.year];
        return (
          <g key={d.year}>
            {isAccent && (
              <>
                <line x1={xs(i)} x2={xs(i)} y1={ys(d.surveys)} y2={M.t}
                      stroke="var(--ax-amber-400)" strokeDasharray="2 3" strokeWidth="1" />
                <circle cx={xs(i)} cy={ys(d.surveys)} r="5" fill="var(--ax-amber-400)" stroke="var(--ax-paper)" strokeWidth="2" />
                <text x={xs(i)} y={M.t - 12} textAnchor="middle"
                      fontFamily="var(--ax-font-mono)" fontSize="10" fill="var(--ax-ink-700)"
                      letterSpacing="0.05em">
                  {accentYears[d.year]}
                </text>
              </>
            )}
            {!isAccent && (
              <circle cx={xs(i)} cy={ys(d.surveys)} r="2.5" fill="var(--ax-ink-700)" />
            )}
          </g>
        );
      })}

      {/* x labels */}
      {data.map((d, i) => (
        (i === 0 || i === data.length - 1 || d.year % 2 === 0) && (
          <text key={d.year} x={xs(i)} y={H - M.b + 22} textAnchor="middle"
                fontFamily="var(--ax-font-mono)" fontSize="10" fill="var(--ax-ink-400)">
            {d.year}
          </text>
        )
      ))}
    </svg>
  );
};

// ---------- HORIZONTAL BAR (TOP CLIENTS) ----------
const HorizontalBar = ({ data, max, valueKey = 'surveys', labelKey = 'name', highlightTop = true }) => {
  const _max = max ?? Math.max(...data.map(d => d[valueKey]));
  return (
    <div className="ax-stack" style={{ gap: 6 }}>
      {data.map((d, i) => {
        const pct = (d[valueKey] / _max) * 100;
        const highlight = highlightTop && i === 0;
        return (
          <div key={d[labelKey]} className="ax-row" style={{ gap: 14, alignItems: 'center', height: 28 }}>
            <div style={{
              flex: '0 0 130px',
              fontSize: 'var(--ax-text-sm)',
              color: 'var(--ax-text)',
              fontWeight: highlight ? 600 : 400,
              fontFamily: 'var(--ax-font-sans)',
              letterSpacing: '0.02em',
            }}>
              <span style={{ color: 'var(--ax-text-subtle)', marginRight: 8, fontFamily: 'var(--ax-font-mono)', fontSize: 11 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {d[labelKey]}
            </div>
            <div className="ax-grow" style={{ position: 'relative', height: 8, background: 'var(--ax-ink-50)', borderRadius: 1 }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                background: highlight ? 'var(--ax-amber-400)' : 'var(--ax-ink-700)',
                borderRadius: 1,
                transition: 'width 600ms var(--ax-ease-emphasized)',
              }} />
            </div>
            <div style={{
              flex: '0 0 80px',
              textAlign: 'right',
              fontFamily: 'var(--ax-font-mono)',
              fontSize: 12,
              color: 'var(--ax-text)',
              fontWeight: highlight ? 600 : 400,
            }}>
              {d[valueKey]} <span style={{ color: 'var(--ax-text-subtle)' }}>·</span> <span style={{ color: 'var(--ax-text-muted)' }}>{fmt(d.responses)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- DONUT ----------
const Donut = ({ data, size = 200 }) => {
  const total = data.reduce((s, d) => s + d.count, 0);
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 14, sw = 18;
  const C = 2 * Math.PI * r;
  let offset = 0;
  const palette = [
    'var(--ax-ink-800)',
    'var(--ax-amber-400)',
    'var(--ax-cobalt)',
    'var(--ax-cyan)',
    'var(--ax-ink-400)',
    'var(--ax-amber-200)',
    'var(--ax-ink-200)',
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ax-ink-50)" strokeWidth={sw} />
      {data.map((d, i) => {
        const len = (d.count / total) * C;
        const dasharray = `${len} ${C - len}`;
        const el = (
          <circle key={d.type}
                  cx={cx} cy={cy} r={r}
                  fill="none"
                  stroke={palette[i % palette.length]}
                  strokeWidth={sw}
                  strokeDasharray={dasharray}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${cx} ${cy})`} />
        );
        offset += len;
        return el;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle"
            fontFamily="var(--ax-font-display)" fontSize="28"
            fill="var(--ax-text-strong)">{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle"
            fontFamily="var(--ax-font-mono)" fontSize="10" fill="var(--ax-ink-400)"
            letterSpacing="0.14em">SURVEYS</text>
    </svg>
  );
};

window.AxCharts = { AreaChart, HorizontalBar, Donut, fmt };
