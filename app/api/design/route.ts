import { NextResponse } from 'next/server';

// Simulation de stockage en mémoire (ou base de données)
let designSettings = {
  colors: {
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
  },
  branding: {
    site_name: "HEAVIX'O BEATS",
    tagline: 'Future Sound Architecture',
    whatsapp: '2290156646409',
    email: 'contact@heaviexobeats.com',
    footer_text: 'Studio de production musicale haute définition.',
    copyright: '© 2026 Alter Ego Group. Tous droits réservés.',
    instagram: '',
    youtube: '',
    tiktok: '',
    discord: '',
    telegram: ''
  },
  artists: []
};

// Récupérer les paramètres (GET)
export async function GET() {
  return NextResponse.json({ success: true, data: designSettings });
}

// Sauvegarder les paramètres (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mettre à jour les données
    if (body.colors) designSettings.colors = body.colors;
    if (body.branding) designSettings.branding = body.branding;
    if (body.artists) designSettings.artists = body.artists;

    return NextResponse.json({ success: true, message: 'Design mis à jour avec succès', data: designSettings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}