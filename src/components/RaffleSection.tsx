import React, { useState } from 'react';

const parseParticipants = (text: string) => {
  // Allow one participant per line. Trim and filter empties.
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
};

const RaffleSection: React.FC = () => {
  const [postUrl, setPostUrl] = useState('');
  const [manualList, setManualList] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDraw = () => {
    setError(null);
    setWinner(null);
    const participants = parseParticipants(manualList);
    if (participants.length === 0) {
      setError('No hay participantes en la lista manual. Pega una línea por participante.');
      return;
    }
    const idx = Math.floor(Math.random() * participants.length);
    setWinner(participants[idx]);
  };

  return (
    <section id="raffle" style={{ padding: '48px 24px', background: 'var(--brand-color-canvas-subtle)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2>Sorteo de merchandising</h2>
        <p>Introduce la URL del post de LinkedIn (opcional) y pega la lista de participantes abajo (una línea por participante). Usa el modo manual por ahora.</p>

        <label style={{ display: 'block', marginTop: 12 }} htmlFor="postUrl">URL del post (opcional)</label>
        <input
          id="postUrl"
          type="text"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="https://www.linkedin.com/posts/..."
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />

        <label style={{ display: 'block', marginTop: 12 }} htmlFor="manualList">Lista manual de participantes</label>
        <textarea
          id="manualList"
          value={manualList}
          onChange={(e) => setManualList(e.target.value)}
          placeholder={`Pon un participante por línea\nEjemplo:\nJuan Pérez - https://www.linkedin.com/in/juanperez`}
          style={{ width: '100%', minHeight: 180, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
        />

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={handleDraw} style={{ padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>Sortear (manual)</button>
          <button
            onClick={() => setManualList('')}
            style={{ padding: '10px 16px', borderRadius: 6, cursor: 'pointer', background: 'transparent', border: '1px solid #ccc' }}
          >Limpiar</button>
        </div>

        {error && <div style={{ marginTop: 12, color: 'var(--brand-color-danger-fg)' }}>{error}</div>}

        {winner && (
          <div style={{ marginTop: 20, padding: 16, borderRadius: 8, background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <strong>Ganador:</strong>
            <div style={{ marginTop: 8 }}>
              <a href={winner.startsWith('http') ? winner : '#'} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-color-text-link)' }}>
                {winner}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RaffleSection;
