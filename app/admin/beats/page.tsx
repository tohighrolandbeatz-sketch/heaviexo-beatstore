'use client';

import { useState, useEffect } from 'react';

type Beat = {
  id: string;
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  musical_key: string;
  price: number;
  status: string;
  cover_url?: string;
  preview_url?: string;
};

export default function AdminBeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);

  // Gestion des Genres et Moods interactifs
  const [genres, setGenres] = useState(['Dark Trap', 'Melodic Drill', 'Afro Trap', 'Boom Bap', 'Cinematic', 'Trap']);
  const [newGenre, setNewGenre] = useState('');
  
  const [moods, setMoods] = useState(['Dark', 'Emotional', 'Aggressive', 'Melancholic', 'Cinematic', 'Energetic']);
  const [newMood, setNewMood] = useState('');

  // États du formulaire Beat
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Dark Trap');
  const [mood, setMood] = useState('Dark');
  const [bpm, setBpm] = useState('140');
  const [musicalKey, setMusicalKey] = useState('C Minor');
  const [price, setPrice] = useState('29,99');
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchBeats = async () => {
    try {
      const res = await fetch('/api/beats');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBeats(data);
      }
    } catch (error) {
      console.error('Erreur chargement beats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeats();
  }, []);

  const handleAddGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre]);
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (g: string) => {
    setGenres(genres.filter(item => item !== g));
  };

  const handleAddMood = () => {
    if (newMood && !moods.includes(newMood)) {
      setMoods([...moods, newMood]);
      setNewMood('');
    }
  };

  const handleRemoveMood = (m: string) => {
    setMoods(moods.filter(item => item !== m));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setGenre(genres[0] || 'Dark Trap');
    setMood(moods[0] || 'Dark');
    setBpm('140');
    setMusicalKey('C Minor');
    setPrice('29,99');
    setPreviewUrl('');
  };

  const handleEditClick = (beat: Beat) => {
    setEditingId(beat.id);
    setTitle(beat.title || '');
    setGenre(beat.genre || genres[0]);
    setMood(beat.mood || moods[0]);
    setBpm(beat.bpm ? beat.bpm.toString() : '140');
    setMusicalKey(beat.musical_key || 'C Minor');
    setPrice(beat.price ? beat.price.toString().replace('.', ',') : '29,99');
    setPreviewUrl(beat.preview_url || '');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet instrumental ?')) return;

    try {
      const res = await fetch(`/api/beats/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBeats();
    } catch (error) {
      console.error('Erreur suppression beat:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const id = editingId || 'beat_' + Date.now();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanPrice = parseFloat(price.replace(',', '.'));
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/beats/${editingId}` : '/api/beats';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          slug,
          genre,
          mood,
          bpm: bpm ? parseInt(bpm) : 140,
          musical_key: musicalKey,
          price: isNaN(cleanPrice) ? 29.99 : cleanPrice,
          description: '',
          seo_tags: '',
          preview_url: previewUrl || '',
          master_url: '',
          status: 'published',
          licenses_json: '[]'
        }),
      });

      if (res.ok) {
        resetForm();
        fetchBeats();
      }
    } catch (error) {
      console.error('Erreur enregistrement beat:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* 1. GESTION DES GENRES MUSICAUX */}
      <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
        <h2 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
          Gestion des Genres Musicaux
        </h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Nouveau genre..."
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            style={{ flex: 1, background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px 15px', color: '#fff', outline: 'none', fontSize: '13px' }}
          />
          <button onClick={handleAddGenre} style={{ background: 'linear-gradient(135deg, #ff6b35, #e85d26)', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }}>
            AJOUTER GENRE
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {genres.map((g) => (
            <span key={g} style={{ background: '#26221f', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #332d29', color: '#ccc' }}>
              {g} <span onClick={() => handleRemoveGenre(g)} style={{ color: '#888', cursor: 'pointer', fontWeight: 'bold' }}>×</span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. GESTION DES MOODS */}
      <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '25px' }}>
        <h2 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
          Gestion des Moods
        </h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Nouveau mood..."
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            style={{ flex: 1, background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px 15px', color: '#fff', outline: 'none', fontSize: '13px' }}
          />
          <button onClick={handleAddMood} style={{ background: 'linear-gradient(135deg, #ff6b35, #e85d26)', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px' }}>
            AJOUTER MOOD
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {moods.map((m) => (
            <span key={m} style={{ background: '#26221f', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #332d29', color: '#ccc' }}>
              {m} <span onClick={() => handleRemoveMood(m)} style={{ color: '#888', cursor: 'pointer', fontWeight: 'bold' }}>×</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. AJOUTER UN NOUVEAU BEAT */}
      <form onSubmit={handleSubmit} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: editingId ? '#f59e0b' : '#ff6b35', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> {editingId ? "Modifier l'instrumental" : "Ajouter un nouveau beat"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ background: '#332924', color: '#ff8c66', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px' }}>
              Annuler
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Titre du Beat</label>
            <input
              type="text"
              placeholder="ex: Black Phantom"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Genre / Style</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            >
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Prix de base ($)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '25px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>BPM</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Gamme / Key</label>
            <input
              type="text"
              value={musicalKey}
              onChange={(e) => setMusicalKey(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Mood</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            >
              {moods.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Uploads visuels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Image Cover (Uploader)</label>
            <label style={{ border: '1px dashed #26221f', borderRadius: '8px', padding: '15px', textAlign: 'center', background: '#0f0e0d', color: '#888', cursor: 'pointer', fontSize: '12px', display: 'block' }}>
              📁 Choisir image
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => console.log('Image:', e.target.files?.[0])} />
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Fichier Audio MP3 / WAV (Uploader)</label>
            <label style={{ border: '1px dashed #26221f', borderRadius: '8px', padding: '15px', textAlign: 'center', background: '#0f0e0d', color: '#888', cursor: 'pointer', fontSize: '12px', display: 'block', marginBottom: '10px' }}>
              🎧 Choisir un fichier Audio
              <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => console.log('Audio:', e.target.files?.[0])} />
            </label>
            {/* Champ URL de secours optionnel */}
            <input
              type="text"
              placeholder="Ou colle l'URL du fichier audio..."
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '10px', color: '#fff', outline: 'none', fontSize: '12px' }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: editingId ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #ff6b35, #e85d26)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '13px',
            width: '100%',
            letterSpacing: '0.5px'
          }}
        >
          {editingId ? "METTRE À JOUR L'INSTRUMENTAL" : "PUBLIER SUR LE STORE"}
        </button>
      </form>

      {/* 4. CATALOGUE ACTUEL */}
      <div>
        <h2 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
          Catalogue Actuel ({beats.length} Beats)
        </h2>
        
        {loading ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Chargement du catalogue...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {beats.map((beat) => (
              <div key={beat.id} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '45px', height: '45px', background: '#26221f', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    🎵
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{beat.title}</h3>
                    <p style={{ fontSize: '12px', color: '#888' }}>
                      {beat.genre} • {beat.bpm || 140} BPM • <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>{beat.price} $</span>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button style={{ background: '#26221f', color: '#aaa', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                    👁️ Masqué
                  </button>
                  <button 
                    onClick={() => handleEditClick(beat)}
                    style={{ background: '#26221f', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
                  >
                    ✏️ Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(beat.id)}
                    style={{ background: '#26221f', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
            {beats.length === 0 && (
              <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '40px', textAlign: 'center', color: '#666' }}>
                Aucun beat enregistré pour le moment.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}