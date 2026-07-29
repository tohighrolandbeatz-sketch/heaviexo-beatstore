'use client';

import { useState } from 'react';

export default function AdminPlaylistPage() {
  const [playlistUrl, setPlaylistUrl] = useState('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M');
  const [collabName, setCollabName] = useState('');
  const [collabUrl, setCollabUrl] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddProject = () => {
    if (collabName && collabUrl) {
      setProjects([...projects, { id: Date.now(), name: collabName, url: collabUrl }]);
      setCollabName('');
      setCollabUrl('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <form onSubmit={handleSave} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎧</span> Gestion des Embeds Spotify & Collaborations
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {saved && <span style={{ color: '#22c55e', fontSize: '12px' }}>Sauvegardé !</span>}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #ff6b35, #e85d26)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '12px',
                letterSpacing: '0.5px'
              }}
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
          Colle ici un lien de partage Spotify classique (ex: https://open.spotify.com/playlist/XXXX). Il sera automatiquement converti en lecteur intégré sur le site.
        </p>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Lien de la playlist / album principal</label>
          <input
            type="text"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
          />
        </div>

        <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
          Ajouter un projet / single majeur (collab artiste)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '15px', marginBottom: '20px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Nom du projet</label>
            <input
              type="text"
              placeholder="ex: Single avec Guen"
              value={collabName}
              onChange={(e) => setCollabName(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Lien Spotify</label>
            <input
              type="text"
              placeholder="Lien de partage Spotify..."
              value={collabUrl}
              onChange={(e) => setCollabUrl(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            style={{ background: 'linear-gradient(135deg, #ff6b35, #e85d26)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', height: '43px' }}
          >
            Ajouter
          </button>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', color: '#888', marginBottom: '10px', textTransform: 'uppercase' }}>Projets enregistrés ({projects.length})</h4>
          {projects.map((p) => (
            <div key={p.id} style={{ background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '10px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#fff' }}>{p.name}</span>
              <span style={{ fontSize: '12px', color: '#888' }}>{p.url}</span>
            </div>
          ))}
          {projects.length === 0 && (
            <p style={{ fontSize: '12px', color: '#666' }}>Aucun projet additionnel pour le moment.</p>
          )}
        </div>

      </form>

    </div>
  );
}