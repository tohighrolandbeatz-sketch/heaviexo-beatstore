import { NextResponse } from 'next/server';
import { beatRepository } from '@/lib/repositories/beatRepository';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 1. Récupérer le beat depuis la base de données via Drizzle
    const beat = await beatRepository.findById(id);

    if (!beat) {
      return NextResponse.json({ error: 'Beat introuvable' }, { status: 404 });
    }

    // 2. Vérifier si l'URL du master WAV (ou stems) existe
    const fileUrl = beat.master_url; // ou stems_url selon le type de licence acheté
    if (!fileUrl) {
      return NextResponse.json({ error: 'Fichier non disponible pour le téléchargement' }, { status: 404 });
    }

    // 3. Optionnel : Vérification des droits d'achat / licence de l'utilisateur
    // (Ici tu pourras ajouter ta logique de vérification de session ou de commande payée)

    // 4. Redirection sécurisée vers l'URL Vercel Blob 
    // Vercel Blob gère les liens publics ou tu peux utiliser une URL signée si le bucket est privé.
    return NextResponse.redirect(fileUrl);

  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}