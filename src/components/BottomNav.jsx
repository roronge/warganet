const ITEMS = [
  ['map', 'Peta', '🗺️'], ['chat', 'Chat', '💬'], ['info', 'Fasilitas', '🏫'],
  ['residents', 'Warga', '🪪'], ['rt', 'RT', '🏠'], ['account', 'Akun', '👤'],
];

export default function BottomNav({ active, onChange }) {
  return <nav className="bottom-nav" aria-label="Navigasi utama">
    {ITEMS.map(([id, label, icon]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => onChange(id)}>
      <span>{icon}</span>{label}
    </button>)}
  </nav>;
}
