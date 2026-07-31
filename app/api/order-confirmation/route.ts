import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { customerName, customerEmail, items, total, paymentMethod } = await request.json();

  if (!customerEmail || !items?.length) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
  }

  const itemsList = items.map((item: any, i: number) => {
    if (item.itemType === 'beat') {
      return `<tr><td style="padding:8px;border-bottom:1px solid #333;">${i + 1}. ${item.beat?.title} (${item.license?.name})</td><td style="padding:8px;border-bottom:1px solid #333;text-align:right;">$${item.price}</td></tr>`;
    }
    return `<tr><td style="padding:8px;border-bottom:1px solid #333;">${i + 1}. ${item.kit?.title}</td><td style="padding:8px;border-bottom:1px solid #333;text-align:right;">$${item.price}</td></tr>`;
  }).join('');

  const paymentLabel = paymentMethod === 'momo' ? 'Mobile Money' : 'PayPal';

  try {
    await resend.emails.send({
      from: 'HeavieXo Beats <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Confirmation de commande - HeavieXo Beats`,
      html: `
        <div style="background:#0F0D0C; color:#F4F0EB; padding:40px; font-family:sans-serif; max-width:600px; margin:0 auto;">
          <h1 style="color:#C66B3D; font-size:24px; text-align:center;">🎵 Commande Confirmée</h1>
          <p style="color:#888; text-align:center;">Merci ${customerName} pour votre commande !</p>
          
          <div style="background:#1A1311; border-radius:12px; padding:20px; margin:20px 0;">
            <table style="width:100%; color:#F4F0EB; font-size:14px; border-collapse:collapse;">
              ${itemsList}
              <tr>
                <td style="padding:12px 8px; font-weight:bold; border-top:2px solid #C66B3D;">Total</td>
                <td style="padding:12px 8px; font-weight:bold; border-top:2px solid #C66B3D; text-align:right; color:#C66B3D; font-size:18px;">$${total}</td>
              </tr>
            </table>
          </div>

          <div style="background:#1A1311; border:1px solid #C66B3D; border-radius:12px; padding:20px; margin:20px 0;">
            <p style="color:#C66B3D; font-weight:bold;">📱 Instructions de paiement (${paymentLabel})</p>
            <p style="color:#888; font-size:13px;">
              ${paymentMethod === 'momo' 
                ? 'Veuillez effectuer le paiement via Mobile Money au +229 01 56 64 64 09 (GBOSSA TOLIDJI ROLAND GAEL) et envoyer la capture d\'écran sur WhatsApp.'
                : 'Vous serez redirigé vers PayPal pour finaliser votre paiement. Vos fichiers seront disponibles immédiatement après confirmation.'}
            </p>
          </div>

          <p style="color:#666; font-size:12px; text-align:center;">Des questions ? Contactez-nous sur WhatsApp au +229 01 56 64 64 09</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, error: 'Email non envoyé' }, { status: 500 });
  }
}
