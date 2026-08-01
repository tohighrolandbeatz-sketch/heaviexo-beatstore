import { NextResponse } from 'next/server';
import { licenseRepository } from '@/lib/repositories/licenseRepository';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const licenses = await licenseRepository.findAll();
    return NextResponse.json(licenses, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des licences:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, description, features } = body;

    if (!id || !name || price === undefined) {
      return NextResponse.json({ error: 'Champs obligatoires manquants (id, name, price)' }, { status: 400 });
    }

    const newLicense = licenseRepository.create({
      id,
      name,
      price,
      description,
      features,
    });

    return NextResponse.json(newLicense, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la licence:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}