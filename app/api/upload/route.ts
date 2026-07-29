import { NextResponse } from 'next/server';
import { uploadService, BeatFiles } from '@/services/uploadService';
import { uploadRepository } from '@/lib/repositories/uploadRepository';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const beatId = formData.get('beatId') as string;
    const slug = formData.get('slug') as string || beatId;

    if (!beatId) {
      return NextResponse.json({ error: 'ID du beat manquant' }, { status: 400 });
    }

    const files: BeatFiles = {};
    
    const coverFile = formData.get('cover') as File;
    if (coverFile) files.cover = coverFile;

    const previewFile = formData.get('preview') as File;
    if (previewFile) files.preview = previewFile;

    const wavFile = formData.get('wav') as File;
    if (wavFile) files.wav = wavFile;

    const stemsFile = formData.get('stems') as File;
    if (stemsFile) files.stems = stemsFile;

    // 1. Upload vers Vercel Blob via le service
    const uploadedUrls = await uploadService.processBeatUpload(slug, files);

    // 2. Enregistrement des URLs dans SQLite via le repository
    uploadRepository.updateBeatFiles(beatId, uploadedUrls);

    return NextResponse.json({ 
      success: true, 
      message: 'Fichiers uploadés et enregistrés avec succès',
      urls: uploadedUrls 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Erreur API Upload Globale:', error);
    return NextResponse.json({ error: error.message || 'Erreur interne lors de l’upload' }, { status: 500 });
  }
}