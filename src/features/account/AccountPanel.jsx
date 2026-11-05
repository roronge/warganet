import { useState } from 'react';

export default function AccountPanel({ configured, user, resident, residentNumber, onSignIn, onSignUp, onSignOut, onCreateResident, onFindHome }) {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [kind, setKind] = useState('');
  const [busy, setBusy] = useState(false);

  async function submitAuth(event) {
    event.preventDefault(); setBusy(true); setFeedback('');
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) throw new Error('Konfirmasi password tidak sama.');
        const result = await onSignUp(email.trim(), password);
        setFeedback(result || 'Pendaftaran berhasil.'); setKind('success');
      } else {
        await onSignIn(email.trim(), password);
        setFeedback('Berhasil masuk.'); setKind('success');
      }
    } catch (error) { setFeedback(error.message || 'Autentikasi gagal.'); setKind('error'); }
    finally { setBusy(false); }
  }

  async function createProfile() {
    setBusy(true); setFeedback('');
    try { await onCreateResident(name.trim()); setFeedback('KTP warga berhasil dibuat.'); setKind('success'); }
    catch (error) { setFeedback(error.code === '23505' ? 'Nama warga sudah dipakai. Pilih nama lain.' : error.message || 'Gagal membuat KTP.'); setKind('error'); }
    finally { setBusy(false); }
  }

  return <section className="panel account-panel">
    <span className="eyebrow">IDENTITAS WARGA</span><h2>Akun Kampung</h2>
    {!configured ? <div className="notice-card"><b>Supabase belum dikonfigurasi</b><p>Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada file .env.local, lalu jalankan SQL setup.</p></div> : !user ? <>
      <p className="panel-intro">Satu akun, satu warga, satu rumah. Daftar atau masuk untuk bergabung dengan kampung.</p>
      <div className="auth-card">
        <div className="mode-switch"><button className={mode === 'signup' ? 'selected' : ''} onClick={() => { setMode('signup'); setFeedback(''); }}>Daftar</button><button className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setFeedback(''); }}>Masuk</button></div>
        <form onSubmit={submitAuth} className="stack-form">
          <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" /></label>
          <label>Password<input type="password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="Minimal 8 karakter" /></label>
          {mode === 'signup' && <label>Ulangi password<input type="password" minLength={8} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" placeholder="Ketik ulang password" /></label>}
          <button className="primary-button full" disabled={busy}>{busy ? 'Memproses…' : mode === 'signup' ? 'Buat akun warga' : 'Masuk ke kampung'}</button>
        </form>
        <p className="helper-text">Pendaftaran menggunakan email. Jika verifikasi email aktif, buka tautan konfirmasi dari Supabase sebelum masuk.</p>
      </div>
    </> : resident ? <>
      <div className="resident-welcome"><div className="avatar">{resident.name.slice(0, 1).toUpperCase()}</div><div><span>Selamat datang,</span><h3>{resident.name}</h3><p>Warga nomor {residentNumber}</p></div></div>
      <p className="panel-intro">Karakter berbaju emas adalah kamu. Ia berjalan-jalan menelusuri jalan kampung. Rumahmu ditandai bintang emas.</p>
      <button className="primary-button" onClick={onFindHome}>Lihat rumahku</button>
      <button className="secondary-button" onClick={onSignOut}>Keluar</button>
    </> : <>
      <div className="notice-card"><b>Akun sudah aktif</b><p>Lengkapi nama warga untuk mendapatkan rumah di kampung.</p></div>
      <div className="stack-form profile-form"><label>Nama warga<input value={name} onChange={e => setName(e.target.value)} maxLength={16} minLength={3} placeholder="Nama 3–16 karakter" /></label>
        <button className="primary-button full" disabled={busy || name.trim().length < 3} onClick={createProfile}>{busy ? 'Membuat…' : 'Buat KTP & Rumah'}</button>
        <button className="secondary-button" onClick={onSignOut}>Keluar</button>
      </div>
    </>}
    {feedback && <p className={`form-feedback ${kind}`} role="status">{feedback}</p>}
  </section>;
}
