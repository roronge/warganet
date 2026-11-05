export default function Header({ dateLabel, period, residentCount }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark">🏡</div>
        <div><h1>Kampung Mini</h1><p>{residentCount.toLocaleString('id-ID')} warga membangun kampung bersama</p></div>
      </div>
      <div className="clock-block"><span>{dateLabel}</span><strong>{period}</strong></div>
    </header>
  );
}
