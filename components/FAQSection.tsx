'use client';

import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(16); // Accepte number ou null

  const faqs = [
    { q: "Do I need a professional studio to record?", a: "No — but your recording needs to be clean. No background noise, no room echo, and no headphone bleed into the mic..." },
    { q: "What if I'm not happy with the result?", a: "If after 2 revision rounds you're not happy with a track, I'll redo it free until you are. If you're still not satisfied — you keep the work and I refund 50%." },
    { q: "Can I release the project on Spotify, Apple Music, and YouTube?", a: "Yes, on every platform worldwide — Spotify, Apple Music, YouTube, Tidal, Amazon Music, anywhere you want to distribute." },
    { q: "Is there a formal contract?", a: "Yes. Before anything starts I send over a license agreement that spells out exactly what's included, the rights you're getting, payment terms, and delivery timeline." },
    { q: "How does payment work?", a: "50% deposit to lock the project and start the pack. Remaining 50% on delivery. I accept PayPal, Apple Pay, credit/debit card, and crypto." },
    { q: "How long does a full project take?", a: "First demos arrive within 48 hours. A full EP usually takes 1–3 weeks; a full album 2–4 weeks." },
    { q: "What does 'unlimited license' actually mean?", a: "Every beat comes with unlimited audio streams, unlimited video streams, unlimited music video releases, live performances, and radio broadcasting rights." },
    { q: "What if I have a small budget or just want to work on 1–2 tracks?", a: "Yes, absolutely. The Mix & Master service starts at $145 per track — no package required, just send your stems." },
    { q: "How does the beat selection work?", a: "First, we hop on a quick dm/call where I learn your sound, build the custom beat, and put together a curated pack tailored to your style." },
    { q: "Can I get exclusive rights to the beats?", a: "By default every beat comes with an unlimited license. EP includes 1 custom exclusive beat, Album includes 2." },
    { q: "What if I want changes after delivery?", a: "Each track gets up to 2 revision rounds during production. Paid revisions are available if needed after delivery." },
    { q: "Is this fully remote? Do I need to be in your city?", a: "Fully remote. I work with artists from the US, Europe, Latin America over Telegram, Instagram or iMessage." },
    { q: "Can I get the stems and trackouts?", a: "Yes — final mixes, masters, trackouts, and stems are delivered with the project." },
    { q: "What genres do you produce?", a: "Trap, hip hop, R&B, old school, jazz rap, melodic — essentially anything in the hip-hop culture umbrella." },
    { q: "What if I want a custom beat that wasn't in the pack?", a: "Custom beats can be added on top for EP and Album tiers — we'll scope it during the call." },
    { q: "How many artists do you work with at once?", a: "One active project at a time. I don't stack clients so you get my full attention." }
  ];

  return (
    <section id="faq" style={{ padding: '100px 0', background: '#0f0e0d', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#ff6b35', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>08 — Questions</div>
            <h2 style={{ marginTop: '18px', fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>FAQ.</h2>
          </div>
          <div>
            <p style={{ color: '#888', fontSize: '14px' }}>Anything not covered here? DM me on Instagram or Telegram — usually reply same day.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} style={{ background: '#171513', border: '1px solid #26221f', borderRadius: '12px', padding: '20px 25px' }}>
                <div 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}
                >
                  <span>{faq.q}</span>
                  <span style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"></path></svg>
                  </span>
                </div>
                {isOpen && (
                  <div style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6', marginTop: '12px', borderTop: '1px solid #26221f', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}