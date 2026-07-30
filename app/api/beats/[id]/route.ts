import { NextResponse } from 'next/server';
import { beatRepository } from '@/lib/repositories/beatRepository';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const beat = beatRepository.findById(id);

    if (!beat) {
      return NextResponse.json({ error: 'Beat introuvable' }, { status: 404 });
    }

    return NextResponse.json(beat, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du beat:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedBeat = await beatRepository.update(id, body);

    if (!updatedBeat) {
      return NextResponse.json({ error: 'Beat introuvable pour mise à jour' }, { status: 404 });
    }

    return NextResponse.json(updatedBeat, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du beat:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedBeat = await beatRepository.update(id, body);

    if (!updatedBeat) {
      return NextResponse.json({ error: 'Beat introuvable pour mise à jour' }, { status: 404 });
    }

    return NextResponse.json(updatedBeat, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du beat:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const success = await beatRepository.delete(id);

    if (!success) {
      return NextResponse.json({ error: 'Beat introuvable pour suppression' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Beat supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression du beat:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}