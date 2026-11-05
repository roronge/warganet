import { useEffect, useRef } from 'react';

export default function ChatPanel({ messages, userId, value, onChange, onSend, status, sending }) {
  const listRef = useRef(null);
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [messages]);
  return <section className="panel chat-panel">
    <div className="panel-heading"><div><span className="eyebrow">RUANG BERSAMA</span><h2>Obrolan kampung</h2></div><span className="live-dot">● LIVE</span></div>
    <div className="chat-list" ref={listRef}>
      {!messages.length && <div className="empty-state"><span>💬</span><b>Belum ada obrolan</b><p>Jadilah warga pertama yang menyapa.</p></div>}
      {messages.map(message => <article key={message.id} className={`chat-message ${message.uid === userId ? 'mine' : ''}`}>
        <div className="message-meta"><b>{message.name}</b><time>{new Date(message.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</time></div>
        <p>{message.text}</p>
      </article>)}
    </div>
    <form className="chat-composer" onSubmit={onSend}>
      <input value={value} onChange={e => onChange(e.target.value)} maxLength={120} placeholder="Tulis pesan untuk warga…" aria-label="Pesan" />
      <button className="primary-button" disabled={sending || !value.trim()}>{sending ? 'Mengirim…' : 'Kirim'}</button>
    </form>
    {status && <p className="form-feedback" role="status">{status}</p>}
  </section>;
}
