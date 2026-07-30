import { NextResponse } from 'next/server';
import { uploadRepository } from '@/lib/repositories/uploadRepository';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await uploadRepository.updateBeatFiles(id, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour fichiers beat:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des fichiers' },
      { status: 500 }
    );
  }
}