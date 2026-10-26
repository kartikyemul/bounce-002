export default function CourtSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 200 100" className={className} role="img" aria-label="Pickleball court from above">
      <rect width="200" height="100" rx="3" fill="#2B5D9B" />
      <rect x="70" y="8" width="60" height="84" fill="#3C70B3" />
      <g stroke="#F3F6FA" strokeWidth="1.4" fill="none">
        <rect x="8" y="8" width="184" height="84" />
        <line x1="70" y1="8" x2="70" y2="92" />
        <line x1="130" y1="8" x2="130" y2="92" />
        <line x1="8" y1="50" x2="70" y2="50" />
        <line x1="130" y1="50" x2="192" y2="50" />
        <line x1="100" y1="4" x2="100" y2="96" strokeWidth="2.2" strokeDasharray="2 2" />
      </g>
      <circle cx="54" cy="30" r="4" fill="#E4F03C" />
    </svg>
  )
}
