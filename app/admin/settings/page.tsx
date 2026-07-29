'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  // Artistes de la bande défilante
  const [artists, setArtists] = useState([
    'Guen', 'Amron', 'Wedy', 'Kiko', 'Ghetto Mike', 'Mic Flammez', 'Speezy', 'Kollins', 'Prince Mo',
    'Cyanogène', 'CCC', 'Blaaz', 'Stanley Enow', 'Maalox', 'Dove\'N D', 'Biz Ice', 'kings', 'Sonya Blade', 'Jon Dho'
  ]);
  const [newArtist, setNewArtist] = useState('');

  // Presets de thèmes
  const [activeTheme, setActiveTheme] = useState('MODERN');
  const themes = ['MODERN', 'LUXURY', 'NOIR', 'SPOTIFY', 'BEATSTARS'];

  // Couleurs du Thème (Color Pickers)
  const [colors, setColors] = useState({
    primary: '#10b981',
    secondary: '#047857',
    accent: '#34d399',
    background: '#000000',
    cardBackground: '#09090b',
    buttonBackground: '#10b981',
    buttonHover: '#059669',
    priceColor: '#34d399',
    textColor: '#ffffff',
    iconColor: '#10b981',
    waveformColor: '#10b981',
  });

  // Branding, Réseaux & Contacts
  const [branding, setBranding] = useState({
    site_name: "HEAVIX'O BEATS",
    tagline: 'Future Sound Architecture',
    whatsapp: '2290156646409',
    email: 'contact@heaviexobeats.com',
    footer_text: 'Studio de production musicale haute définition. Beats originaux, Sound Kits professionnels & ingénierie sonore sur-mesure.',
    copyright: '© 2026 Alter Ego Group. Tous droits réservés.',
    instagram: 'https://www.instagram.com/heaviexobeats',
    youtube: 'https://youtube.com/@heaviexo',
    tiktok: 'https://tiktok.com/@heaviexo',
    discord: 'https://discord.gg/heaviexo',
    telegram: 'https://t.me/kakouanassi'
  });

  const [saved, setSaved] = useState(false);

  const handleAddArtist = () => {
    if (newArtist && !artists.includes(newArtist)) {
      setArtists([...artists, newArtist]);
      setNewArtist('');
    }
  };

  const handleRemoveArtist = (artistName: string) => {
    setArtists(artists.filter(a => a !== artistName));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colors, branding, artists })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du design', error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <form onSubmit={handleSave} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '16px', padding: '30px' }}>
        
        {/* En-tête / Actions globales */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#ff6b35', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎨</span> Design System & Paramètres Globaux
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {saved && <span style={{ color: '#22c55e', fontSize: '12px' }}>Modifications enregistrées !</span>}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #ff6b35, #e85d26)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '11px',
                letterSpacing: '0.5px'
              }}
            >
              💾 Sauvegarder
            </button>
          </div>
        </div>

        {/* 1. ARTISTES (BANDE DÉFILANTE) */}
        <div style={{ marginBottom: '35px', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
            🎤 Artistes (Bande Défilante)
          </h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Nom de l'artiste..."
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              style={{ flex: 1, background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '10px 15px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
            <button type="button" onClick={handleAddArtist} style={{ background: 'linear-gradient(135deg, #ff6b35, #e85d26)', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
              Ajouter
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {artists.map((artist) => (
              <span key={artist} style={{ background: '#171513', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #26221f', color: '#ccc' }}>
                {artist} <span onClick={() => handleRemoveArtist(artist)} style={{ color: '#888', cursor: 'pointer', fontWeight: 'bold' }}>×</span>
              </span>
            ))}
          </div>
        </div>

        {/* 2. PRESETS DE THÈMES GLOBAUX */}
        <div style={{ marginBottom: '35px', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
            ⚡ Presets de Thèmes Globaux
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {themes.map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => setActiveTheme(th)}
                style={{
                  background: activeTheme === th ? '#ff6b35' : '#171513',
                  color: activeTheme === th ? '#fff' : '#888',
                  border: '1px solid #26221f',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}
              >
                {th}
              </button>
            ))}
          </div>
        </div>

        {/* 3. COULEURS (COLOR PICKER) */}
        <div style={{ marginBottom: '35px', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
            🌈 Couleurs (Color Picker)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
            {Object.keys(colors).map((key) => (
              <div key={key} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '10px', padding: '12px' }}>
                <label style={{ display: 'block', fontSize: '9px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' }}>{key}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="color"
                    value={(colors as any)[key]}
                    onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                    style={{ width: '28px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={(colors as any)[key]}
                    onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                    style={{ width: '100%', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '6px', padding: '6px', color: '#fff', fontSize: '11px', outline: 'none' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. BRANDING */}
        <div style={{ marginBottom: '35px', background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px', textTransform: 'uppercase' }}>
            🎨 Branding & Contacts
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Nom du site</label>
              <input
                type="text"
                value={branding.site_name}
                onChange={(e) => setBranding({ ...branding, site_name: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Sous-titre / Slogan</label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>WhatsApp (numéro sans le +)</label>
              <input
                type="text"
                value={branding.whatsapp}
                onChange={(e) => setBranding({ ...branding, whatsapp: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Email</label>
              <input
                type="email"
                value={branding.email}
                onChange={(e) => setBranding({ ...branding, email: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Footer Text</label>
            <textarea
              value={branding.footer_text}
              onChange={(e) => setBranding({ ...branding, footer_text: e.target.value })}
              style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px', minHeight: '70px', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Mention Copyright</label>
            <input
              type="text"
              value={branding.copyright}
              onChange={(e) => setBranding({ ...branding, copyright: e.target.value })}
              style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '13px' }}
            />
          </div>
        </div>

        {/* 5. RÉSEAUX SOCIAUX */}
        <div style={{ background: '#0f0e0d', border: '1px solid #26221f', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '11px', color: '#ff6b35', fontWeight: 'bold', letterSpacing: '1.5px', marginBottom: '5px', textTransform: 'uppercase' }}>
            🌐 Réseaux Sociaux
          </h3>
          <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px' }}>
            Colle ici les liens complets vers tes profils. Laisse vide pour masquer l'icône.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Instagram</label>
              <input
                type="text"
                value={branding.instagram}
                onChange={(e) => setBranding({ ...branding, instagram: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>YouTube</label>
              <input
                type="text"
                value={branding.youtube}
                onChange={(e) => setBranding({ ...branding, youtube: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '12px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>TikTok</label>
              <input
                type="text"
                value={branding.tiktok}
                onChange={(e) => setBranding({ ...branding, tiktok: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Discord</label>
              <input
                type="text"
                value={branding.discord}
                onChange={(e) => setBranding({ ...branding, discord: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>Telegram</label>
              <input
                type="text"
                value={branding.telegram}
                onChange={(e) => setBranding({ ...branding, telegram: e.target.value })}
                style={{ width: '100%', background: '#171513', border: '1px solid #26221f', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none', fontSize: '12px' }}
              />
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}