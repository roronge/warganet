import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MapView from './components/MapView';
import ChatPanel from './features/chat/ChatPanel';
import AccountPanel from './features/account/AccountPanel';
import VillagePanels from './features/village/VillagePanels';
import { supabase } from './services/supabase';
import { isSupabaseConfigured } from './config';
import { createMessage, createResident, getRecentMessages, getResidents, removeCommunitySubscription, subscribeToCommunity } from './services/community';

function normalizeResidents(rows = []) {
  return rows.map(row => ({ id: row.id, name: row.name, joined: new Date(row.joined).getTime() }));
}
function normalizeMessages(rows = []) {
  return rows.map(row => ({ id: String(row.id), uid: row.user_id, name: row.warga?.name || 'Warga', text: String(row.text || '').slice(0, 120), ts: new Date(row.ts).getTime() }));
}

export default function App() {
  const [residents, setResidents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [engine, setEngine] = useState(null);
  const [simulatedHour, setSimulatedHour] = useState(null);
  const [clockNow, setClockNow] = useState(new Date());
  const [chatText, setChatText] = useState('');
  const [chatStatus, setChatStatus] = useState('');
  const [sending, setSending] = useState(false);

  const userId = session?.user?.id || null;
  const myResident = residents.find(person => person.id === userId) || null;
  const residentNumber = myResident ? residents.findIndex(person => person.id === userId) + 1 : 0;
  const dateLabel = clockNow.toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' ·');
  const hour = simulatedHour ?? (clockNow.getHours() + clockNow.getMinutes() / 60);
  const period = hour < 5 || hour >= 19 ? 'MALAM' : hour < 11 ? 'PAGI' : hour < 15 ? 'SIANG' : 'SORE';

  const refreshResidents = useCallback(async () => {
    const { data, error } = await getResidents();
    if (error) throw error;
    setResidents(normalizeResidents(data));
  }, []);
  const refreshMessages = useCallback(async () => {
    const { data, error } = await getRecentMessages();
    if (error) throw error;
    setMessages(normalizeMessages(data));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;
    let alive = true;
    let channel = null;
    const initialize = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (alive) setSession(sessionData.session);
        await Promise.all([
          refreshResidents().catch(error => console.error('Gagal memuat warga:', error)),
          refreshMessages().catch(error => console.error('Gagal memuat chat:', error)),
        ]);
      } catch (error) { console.error('Inisialisasi Kampung Mini:', error); }
    };
    initialize();
    channel = subscribeToCommunity(
      () => { refreshResidents().catch(error => console.error(error)); },
      () => { refreshMessages().catch(error => console.error(error)); },
    );
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (alive) setSession(nextSession);
      refreshResidents().catch(error => console.error(error));
    });
    return () => {
      alive = false;
      authListener.subscription.unsubscribe();
      removeCommunitySubscription(channel);
    };
  }, [refreshResidents, refreshMessages]);

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    if (error) throw error;
    if (data.session) setSession(data.session);
    return data.session ? 'Pendaftaran berhasil. Silakan buat KTP warga.' : 'Pendaftaran berhasil. Periksa email untuk verifikasi, lalu kembali dan masuk.';
  }
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    await refreshResidents();
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
  }
  async function addResident(name) {
    if (!userId) throw new Error('Silakan masuk terlebih dahulu.');
    if (name.length < 3 || name.length > 16) throw new Error('Nama harus terdiri dari 3–16 karakter.');
    const { error } = await createResident(userId, name);
    if (error) throw error;
    await refreshResidents();
  }
  async function sendMessage(event) {
    event.preventDefault();
    const value = chatText.trim().slice(0, 120);
    if (!value) return;
    if (!userId || !myResident) { setChatStatus('Login dan buat KTP warga dulu untuk ikut mengobrol.'); return; }
    if (sending) return;
    setSending(true); setChatStatus('');
    try {
      const { error } = await createMessage(userId, value);
      if (error) throw error;
      setChatText('');
    } catch (error) { setChatStatus(`Gagal mengirim: ${error.message || error.code}`); }
    finally { setSending(false); }
  }
  const focusHome = () => {
    if (!myResident || !engine) return;
    engine.focusResident(residentNumber - 1);
    setActiveTab('map');
  };

  const rtRows = useMemo(() => {
    const rows = [];
    for (let index = 0; index < residents.length; index += 10) {
      rows.push({ number: Math.floor(index / 10) + 1, rw: Math.floor(index / 40) + 1, leader: residents[index], count: Math.min(10, residents.length - index) });
    }
    return rows;
  }, [residents]);

  return <div className="app-shell">
    <Header dateLabel={dateLabel} period={period} residentCount={residents.length} />
    <main className="main-stage">
      <MapView residents={residents} userId={userId} messages={messages} simulatedHour={simulatedHour} onEngineReady={setEngine} />
      <div className="map-stat"><span>WARGA</span><strong>{residents.length.toLocaleString('id-ID')}</strong><small>1 warga · 1 rumah</small></div>
      <div className="map-controls" aria-label="Kontrol peta">
        <button onClick={() => engine?.zoomIn()} aria-label="Perbesar">＋</button>
        <button onClick={() => engine?.zoomOut()} aria-label="Perkecil">−</button>
        <button onClick={() => engine?.center()} aria-label="Pusatkan peta">⌖</button>
      </div>
      <div className="time-control"><span>🕒</span><input type="range" min="0" max="24" step="0.25" value={simulatedHour ?? hour} onChange={event => setSimulatedHour(Number(event.target.value))} aria-label="Atur waktu kampung" /><button onClick={() => setSimulatedHour(null)}>Live</button></div>

      {activeTab !== 'map' && <div className="panel-layer">
        {activeTab === 'chat' && <ChatPanel messages={messages} userId={userId} value={chatText} onChange={setChatText} onSend={sendMessage} status={chatStatus} sending={sending} />}
        {(activeTab === 'info' || activeTab === 'residents' || activeTab === 'rt') && <VillagePanels activeTab={activeTab} residents={residents} userId={userId} rtRows={rtRows} />}
        {activeTab === 'account' && <AccountPanel configured={isSupabaseConfigured} user={session?.user} resident={myResident} residentNumber={residentNumber} onSignUp={signUp} onSignIn={signIn} onSignOut={signOut} onCreateResident={addResident} onFindHome={focusHome} />}
      </div>}
    </main>
    <BottomNav active={activeTab} onChange={setActiveTab} />
  </div>;
}
