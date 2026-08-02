import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saleRepository } from '@/lib/repositories/saleRepository';
import { userRepository } from '@/lib/repositories/userRepository';
import { beatRepository } from '@/lib/repositories/beatRepository';
import { createDownloadToken } from '@/lib/downloadToken';

const resend = new Resend(process.env.RESEND_API_KEY);
const EXPIRATION_MS = 1000 * 60 * 60 * 48; // liens valables 48h
const SITE_URL = 'https://heaviexo-beatstore.vercel.app';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      return NextResponse.json({ error: 'Vente introuvable' }, { status: 404 });
    }

    await saleRepository.updateStatus(id, 'CONFIRMED');

    const [user, beat] = await Promise.all([
      sale.user_id ? userRepository.findById(sale.user_id) : null,
      beatRepository.findById(sale.beat_id),
    ]);

    if (!user || !beat) {
      return NextResponse.json({ success: true, warning: 'Confirmé, mais email non envoyé (client ou beat introuvable).' });
    }

    const exp = Date.now() + EXPIRATION_MS;
    const links: { label: string; url: string }[] = [];

    if (beat.master_url) {
      const token = createDownloadToken({ saleId: sale.id, beatId: beat.id, fileType: 'master', exp });
      links.push({ label: `${beat.title} — Fichier Master (WAV)`, url: `${SITE_URL}/api/download?token=${token}` });
    }

    if ((sale.license_id === 'stems' || sale.license_id === 'exclusive') && beat.stems_url) {
      const token = createDownloadToken({ saleId: sale.id, beatId: beat.id, fileType: 'stems', exp });
      links.push({ label: `${beat.title} — Stems (ZIP)`, url: `${SITE_URL}/api/download?token=${token}` });
    }

    const linksHtml = links.length
      ? links.map((l) => `<p style="margin:10px 0;"><a href="${l.url}" style="color:#C66B3D; font-weight:bold; text-decoration:none;">⬇ ${l.label}</a></p>`).join('')
      : '<p style="color:#888;">Aucun fichier disponible pour le moment — contactez-nous.</p>';

    await resend.emails.send({
      from: 'HeavieXo Beats <onboarding@resend.dev>',
      to: user.email,
      subject: `Vos fichiers sont prêts - ${beat.title}`,
      html: `
        <div style="background:#0F0D0C; color:#F4F0EB; padding:40px; font-family:sans-serif; max-width:600px; margin:0 auto;">
          <h1 style="color:#C66B3D; font-size:24px; text-align:center;">🎵 Paiement confirmé !</h1>
          <p style="color:#888; text-align:center;">Merci ${user.name || ''}, voici vos liens de téléchargement.</p>
          <div style="background:#1A1311; border-radius:12px; padding:20px; margin:20px 0;">
            ${linksHtml}
          </div>
          <p style="color:#666; font-size:12px; text-align:center;">Ces liens expirent dans 48h. Besoin d'un nouveau lien ? Contactez-nous sur WhatsApp.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur confirmation vente:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}