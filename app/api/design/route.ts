import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'design.json');

// Valeurs par défaut
const defaultSettings = {
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
  artists: [],
  pages: []
};

// Lire les données depuis le fichier
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Erreur lecture design.json:', err);
  }
  return { ...defaultSettings };
}

// Écrire les données dans le fichier
function writeData(data: any) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Erreur écriture design.json:', err);
    return false;
  }
}

// Récupérer les paramètres (GET)
export async function GET() {
  const data = readData();
  return NextResponse.json({ success: true, data });
}

// Sauvegarder les paramètres (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readData();
    
    if (body.colors) current.colors = { ...current.colors, ...body.colors };
    if (body.branding) current.branding = { ...current.branding, ...body.branding };
    if (body.artists) current.artists = body.artists;
    if (body.pages) current.pages = body.pages;

    const saved = writeData(current);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Erreur écriture fichier' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Design mis à jour avec succès', data: current });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// Mise à jour partielle (PATCH)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const current = readData();
    
    // Fusionne tous les champs envoyés
    Object.keys(body).forEach(key => {
      if (typeof body[key] === 'object' && !Array.isArray(body[key])) {
        current[key] = { ...current[key], ...body[key] };
      } else {
        current[key] = body[key];
      }
    });

    const saved = writeData(current);
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Erreur écriture fichier' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Mise à jour partielle réussie', data: current });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}