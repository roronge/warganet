const FACILITIES = [
  { threshold: 5, icon: '🏛️', name: 'Balai Warga', description: 'Tempat berkumpul dan bermusyawarah.' },
  { threshold: 15, icon: '🕌', name: 'Masjid', description: 'Ruang ibadah dan kegiatan warga.' },
  { threshold: 30, icon: '🎾', name: 'Lapangan', description: 'Tempat olahraga dan bermain.' },
  { threshold: 50, icon: '🏫', name: 'Sekolah', description: 'Tempat belajar generasi kampung.' },
  { threshold: 75, icon: '🌳', name: 'Taman', description: 'Ruang hijau untuk bersantai.' },
  { threshold: 100, icon: '🏥', name: 'Puskesmas', description: 'Layanan kesehatan warga.' },
  { threshold: 200, icon: '🛒', name: 'Pasar', description: 'Pusat kegiatan ekonomi kampung.' },
  { threshold: 300, icon: '🌾', name: 'Sawah', description: 'Area pertanian kampung.' },
  { threshold: 500, icon: '🚉', name: 'Stasiun', description: 'Akses transportasi menuju luar kampung.' },
];

function EmptyState({ icon, title, children }) {
  return <div className="empty-state"><span>{icon}</span><b>{title}</b><p>{children}</p></div>;
}

function FacilitiesPanel({ residentCount }) {
  return <section className="panel"><span className="eyebrow">KAMPUNG TERUS BERTUMBUH</span><h2>Fasilitas kampung</h2>
    <p className="panel-intro">Setiap warga baru membawa kehidupan baru. Fasilitas akan terbuka seiring bertambahnya jumlah warga.</p>
    <div className="facility-grid">{FACILITIES.map(facility => {
      const unlocked = residentCount >= facility.threshold;
      return <article className={`facility-card ${unlocked ? 'unlocked' : 'locked'}`} key={facility.name}>
        <div className="facility-icon">{facility.icon}</div><div className="facility-copy"><b>{facility.name}</b><p>{facility.description}</p><small>{unlocked ? '✓ Terbuka' : `Terbuka pada ${facility.threshold} warga`}</small></div>
      </article>;
    })}</div>
    <p className="landscape-note">Di sekitar kampung ada gunung, air terjun, sungai berisi ikan dan bebek, serta jembatan menuju seberang.</p>
  </section>;
}

function ResidentsPanel({ residents, userId }) {
  return <section className="panel"><span className="eyebrow">KELUARGA KAMPUNG</span><h2>Daftar warga <span className="count-pill">{residents.length}</span></h2>
    {!residents.length ? <EmptyState icon="🏡" title="Kampung masih sepi">Jadilah warga pertama melalui menu Akun.</EmptyState> :
      <div className="resident-list">{residents.slice(-200).reverse().map((resident, reverseIndex) => {
        const number = residents.length - reverseIndex;
        return <div className="resident-row" key={resident.id}><span className="resident-avatar">{resident.name.slice(0, 1).toUpperCase()}</span>
          <b>{resident.name}{resident.id === userId && <em> Kamu</em>}</b><small>Warga #{number}</small>
        </div>;
      })}</div>}
  </section>;
}

function RtPanel({ rows }) {
  return <section className="panel"><span className="eyebrow">STRUKTUR WARGA</span><h2>Ketua RT</h2>
    <p className="panel-intro">Setiap 10 warga membentuk satu RT. Warga pertama di tiap kelompok menjadi ketua RT.</p>
    {!rows.length ? <EmptyState icon="🏠" title="Belum ada RT">RT pertama terbentuk setelah warga pertama bergabung.</EmptyState> :
      <div className="rt-list">{rows.map(row => <article className="rt-card" key={row.number}>
        <div className="rt-number">{String(row.number).padStart(2, '0')}</div><div><small>RT {row.number} · RW {row.rw}</small><b>{row.leader.name}</b><p>Ketua RT · {row.count} warga</p></div><span>🏡</span>
      </article>)}</div>}
  </section>;
}

export default function VillagePanels({ activeTab, residents, userId, rtRows }) {
  if (activeTab === 'info') return <FacilitiesPanel residentCount={residents.length} />;
  if (activeTab === 'residents') return <ResidentsPanel residents={residents} userId={userId} />;
  if (activeTab === 'rt') return <RtPanel rows={rtRows} />;
  return null;
}
