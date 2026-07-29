'use client';

import { useState, useEffect } from 'react';

type Kit = {
  id: string;
  title: string;
  category: string;
  price: number;
  item_count: string;
  file_size: string;
  description?: string;
};

export default function AdminKitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulaire Sound Kit
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Drum Kit');
  const [price, setPrice] = useState('24,99');
  const [itemCount, setItemCount] = useState('100+ Samples WAV');
  const [fileSize, setFileSize] = useState('300 MB');
  const [description, setDescription] = useState('');

  const fetchKits = async () => {
    try {
      const res = await fetch('/api/kits');
      const data = await res.json();
      if (Array.isArray(data)) {
        setKits(data);
      }
    } catch (error) {
      console.error('Erreur chargement kits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const id = 'kit_' + Date.now();
    const cleanPrice = parseFloat(price.replace(',', '.'));

    try {
      const res = await fetch('/api/kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          category,
          price: isNaN(cleanPrice) ? 24.99 : cleanPrice,
          item_count: itemCount,
          file_size: fileSize,
          description
        }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchKits();
      }
    } catch (error) {
      console.error('Erreur création kit:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce sound kit ?')) return;
    try {
      const res = await fetch(`/api/kits/${id}`, { method: 'DELETE' });
      if (res.ok) fetchKits();
    } catch (error) {
      console.error('Erreur suppression kit:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* FORMULAIRE AJOUT SOUND KIT */}
      <form onSubmit={handleSubmit} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px' }}>
        <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📦</span> Ajouter un Sound Kit / Loop Pack
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Titre du Kit</label>
            <input
              type="text"
              placeholder="ex: OBSIDIAN Drumkit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            >
              <option value="Drum Kit">Drum Kit</option>
              <option value="Loop Kit">Loop Kit</option>
              <option value="Preset Bank">Preset Bank</option>
              <option value="MIDI Pack">MIDI Pack</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Prix ($)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Nombre d'éléments</label>
            <input
              type="text"
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Taille du fichier</label>
            <input
              type="text"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Image Cover</label>
            <div style={{ border: '1px dashed #26221f', borderRadius: '8px', padding: '11px', textAlign: 'center', background: '#0f0e0d', color: '#888', cursor: 'pointer', fontSize: '12px' }}>
              📁 Choisir image
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Fichier Archive du Kit (ZIP / RAR - Uploader)</label>
          <div style={{ border: '1px dashed #26221f', borderRadius: '8px', padding: '15px', textAlign: 'center', background: '#0f0e0d', color: '#888', cursor: 'pointer', fontSize: '12px' }}>
            📦 Choisir le fichier ZIP / RAR
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Description</label>
          <textarea
            placeholder="Description détaillée du sound kit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px', minHeight: '80px', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #ff6b35, #e85d26)',
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
          AJOUTER LE SOUND KIT
        </button>
      </form>

      {/* LISTE SOUND KITS ACTUELS */}
      <div>
        <h2 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
          Sound Kits Actuels ({kits.length})
        </h2>

        {loading ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Chargement...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {kits.map((kit) => (
              <div key={kit.id} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '45px', height: '45px', background: '#26221f', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    🎛️
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{kit.title}</h3>
                    <p style={{ fontSize: '12px', color: '#888' }}>
                      {kit.category} • {kit.item_count} • <span style={{ color: '#ff6b35', fontWeight: 'bold' }}>{kit.price} $</span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(kit.id)}
                  style={{ background: '#26221f', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            ))}
            {kits.length === 0 && (
              <div style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '14px', padding: '40px', textAlign: 'center', color: '#666' }}>
                Aucun sound kit enregistré pour le moment.
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}