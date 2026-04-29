// Minimal stroke icons — 1.5px, rounded, 24x24 grid.
// Kept neutral and editorial to match the brand's restraint.
const I = ({ d, size = 18, stroke = 1.5, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
       className={className} aria-hidden="true">
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  Home:       (p) => <I {...p} d={<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>} />,
  Compass:    (p) => <I {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></>} />,
  Layers:     (p) => <I {...p} d={<><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></>} />,
  Users:      (p) => <I {...p} d={<><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 14c3 0 6 2 6 5"/></>} />,
  Chart:      (p) => <I {...p} d={<><path d="M3 20h18"/><path d="M6 16v-5"/><path d="M11 16V8"/><path d="M16 16v-3"/><path d="M21 16V5"/></>} />,
  Pulse:      (p) => <I {...p} d="M3 12h4l2-6 4 12 2-6h6"/>,
  Compare:    (p) => <I {...p} d={<><path d="M4 6h7"/><path d="M9 4l2 2-2 2"/><path d="M20 18h-7"/><path d="M15 16l-2 2 2 2"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/></>} />,
  Doc:        (p) => <I {...p} d={<><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7"/><path d="M9 17h7"/></>} />,
  Settings:   (p) => <I {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1 1 0 00.2 1.1l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1 1 0 00-1.1-.2 1 1 0 00-.6.9V20a2 2 0 11-4 0v-.1a1 1 0 00-.6-.9 1 1 0 00-1.1.2l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1 1 0 00.2-1.1 1 1 0 00-.9-.6H4a2 2 0 110-4h.1a1 1 0 00.9-.6 1 1 0 00-.2-1.1l-.1-.1a2 2 0 112.8-2.8l.1.1a1 1 0 001.1.2H9a1 1 0 00.6-.9V4a2 2 0 114 0v.1a1 1 0 00.6.9 1 1 0 001.1-.2l.1-.1a2 2 0 112.8 2.8l-.1.1a1 1 0 00-.2 1.1 1 1 0 00.9.6H20a2 2 0 110 4h-.1a1 1 0 00-.9.6z"/></>} />,
  Search:     (p) => <I {...p} d={<><circle cx="11" cy="11" r="6.5"/><path d="M21 21l-4.5-4.5"/></>} />,
  Bell:       (p) => <I {...p} d={<><path d="M6 8a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/></>} />,
  Filter:     (p) => <I {...p} d="M4 5h16l-6 8v6l-4-2v-4z"/>,
  Download:   (p) => <I {...p} d={<><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></>} />,
  Plus:       (p) => <I {...p} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>} />,
  Check:      (p) => <I {...p} d="M5 12l4 4 10-10"/>,
  ArrowUp:    (p) => <I {...p} d={<><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></>} />,
  ArrowDown:  (p) => <I {...p} d={<><path d="M12 5v14"/><path d="M6 13l6 6 6-6"/></>} />,
  Chevron:    (p) => <I {...p} d="M9 6l6 6-6 6"/>,
  ChevronDown:(p) => <I {...p} d="M6 9l6 6 6-6"/>,
  External:   (p) => <I {...p} d={<><path d="M14 5h5v5"/><path d="M19 5l-9 9"/><path d="M19 14v5H5V5h5"/></>} />,
  Sparkles:   (p) => <I {...p} d={<><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><path d="M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/></>} />,
  Star:       (p) => <I {...p} d="M12 3l2.7 6 6.3.6-4.7 4.3 1.3 6.1L12 17l-5.6 3 1.3-6.1L3 9.6l6.3-.6z"/>,
  Eye:        (p) => <I {...p} d={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>} />,
  More:       (p) => <I {...p} d={<><circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/></>} />,
  Calendar:   (p) => <I {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></>} />,
};

window.Icons = Icons;
