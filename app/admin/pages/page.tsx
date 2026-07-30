'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, ChevronUp, ChevronDown, Plus, Trash2, Edit, X, Settings, Globe } from 'lucide-react';

interface PageConfig {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
  metaTitle: string;
  metaDescription: string;
  sections: PageSection[];
}

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'grid' | 'cta' | 'marquee' | 'spotify' | 'faq' | 'pricing' | 'custom';
  title: string;
  content: any;
  enabled: boolean;
  order: number;
}

const defaultPages: PageConfig[] = [
  {
    id: 'beatstore', name: 'Beatstore', slug: '/beatstore', enabled: true,
    metaTitle: 'HEAVIEXO BEATS - Beatstore', metaDescription: 'Achetez des beats professionnels en ligne.',
    sections: [
      { id: 'hero', type: 'hero', title: 'Hero Section', content: { badge: 'Dernière Sortie Exclusive' }, enabled: true, order: 1 },
      { id: 'marquee', type: 'marquee', title: 'Artistes', content: {}, enabled: true, order: 2 },
      { id: 'beatlist', type: 'grid', title: 'Catalogue Beats', content: {}, enabled: true, order: 3 },
    ]
  },
  {
    id: 'kits', name: 'Sound Kits', slug: '/kits', enabled: true,
    metaTitle: 'HEAVIEXO - Sound Kits', metaDescription: 'Sound kits professionnels.',
    sections: [
      { id: 'kits-header', type: 'text', title: 'En-tête Kits', content: { title: 'Bibliothèques Pro', subtitle: 'Sound kits premium pour producteurs' }, enabled: true, order: 1 },
      { id: 'kits-grid', type: 'grid', title: 'Grille Kits', content: {}, enabled: true, order: 2 },
    ]
  },
  {
    id: 'services', name: 'Services', slug: '/services', enabled: true,
    metaTitle: 'HEAVIEXO - Services Studio', metaDescription: 'Mix, mastering, production sur-mesure.',
    sections: [
      { id: 'services-header', type: 'text', title: 'En-tête Services', content: { title: 'Services Professionnels & Tarifs', subtitle: 'Propulsez vos morceaux aux standards de l\'industrie avec des prestations haut de gamme.' }, enabled: true, order: 1 },
      { id: 'pricing', type: 'pricing', title: 'Grille Tarifaire', content: { services: [
        { id: 'mix', title: 'Mix & Mastering Pro', price: '75 $', subtitle: 'Idéal pour valoriser vos prises de voix', desc: 'Traitement haut de gamme : EQ, compression, spatialisation, mastering streaming.', features: ['Fichiers WAV Master & MP3', 'Jusqu\'à 3 révisions', 'Délai : 3-5 jours'] },
        { id: 'custom', title: 'Custom Beat Sur-Mesure', price: '150 $', subtitle: 'Production exclusive de A à Z', desc: 'Beat exclusif taillé pour votre voix et votre univers.', features: ['Droits exclusifs inclus', 'Stems offerts', 'Modifications illimitées'] },
        { id: 'synchro', title: 'Placement Synchro TV/Film', price: 'Sur Devis', subtitle: 'Pour labels, pubs, cinéma', desc: 'Catalogue de musiques pour synchronisation à l\'image.', features: ['Contrats officiels', 'Cession de droits', 'Accompagnement juridique'] }
      ]}, enabled: true, order: 2 },
      { id: 'faq', type: 'faq', title: 'FAQ', content: { items: [
        { q: 'Comment se déroule la livraison des beats après l\'achat ?', a: 'La livraison est instantanée. Dès que votre paiement est validé par carte ou PayPal, un lien de téléchargement sécurisé contenant vos fichiers (MP3, WAV ou Stems selon la licence choisie) s\'affiche et vous est envoyé par e-mail.' },
        { q: 'Puis-je upgrader (mettre à niveau) ma licence plus tard ?', a: 'Oui, tout à fait. Si vous achetez une licence de base (MP3 ou WAV) et que votre morceau commence à tourner ou génère des streams, vous pouvez acquérir une licence supérieure en payant simplement la différence.' },
        { q: 'Qu\'est-ce que les fichiers Stems (pistes séparées) ?', a: 'Les Stems correspondent à l\'export piste par piste de l\'instrumentale (piste de drums, de basse, de mélodies, etc.). Ils sont indispensables pour l\'ingénieur du son afin de réaliser un mixage vocal et instrumental de qualité professionnelle.' },
        { q: 'Quels sont les délais pour les services de Mix & Mastering ?', a: 'Pour le Mix & Mastering, les fichiers finaux vous sont envoyés sous 3 à 5 jours ouvrés après réception de vos pistes vocales et instrumentales propres.' },
        { q: 'Quels modes de paiement acceptez-vous ?', a: 'Nous acceptons les paiements par PayPal, carte bancaire (Visa, Mastercard) et Mobile Money (MTN Mobile Money, Moov Money, Celtiis Cash).' },
        { q: 'Est-ce que je perds mes droits si je n\'achète qu\'une licence MP3 ?', a: 'Non, vous conservez tous les droits d\'exploitation liés à votre licence. La licence MP3 est parfaite pour les artistes indépendants qui démarrent. Vous pouvez upgrader à tout moment.' },
        { q: 'Puis-je utiliser les beats pour des projets commerciaux (clips, pubs) ?', a: 'Oui, l\'usage commercial est autorisé avec toutes nos licences. La licence WAV Premium et supérieures incluent les droits pour les clips vidéo et la diffusion radio.' },
        { q: 'Que se passe-t-il si quelqu\'un achète les droits exclusifs d\'un beat que j\'avais déjà ?', a: 'Une fois les droits exclusifs vendus, le beat est immédiatement retiré du store. Les licences non-exclusives achetées avant restent valables selon leurs conditions initiales. Premier arrivé, premier servi !' },
        { q: 'Proposez-vous des réductions pour les achats groupés ?', a: 'Oui, nous proposons des réductions pour l\'achat de plusieurs beats ou licences. Contactez-nous directement pour un devis personnalisé selon vos besoins.' },
        { q: 'Les fichiers sont-ils marqués (tagged) ?', a: 'Les previews sont watermarkées pour protéger votre travail. Les fichiers achetés sont livrés propres, sans watermark ni tag audio.' },
        { q: 'Puis-je avoir un remboursement après achat ?', a: 'En raison de la nature numérique des produits, les ventes sont généralement finales. Cependant, nous étudions chaque demande au cas par cas en cas de problème technique.' },
        { q: 'Comment fonctionne le service de Custom Beat ?', a: 'Vous décrivez votre projet, vos références et votre direction artistique. Nous échangeons en direct pendant la création. Vous recevez un beat exclusif avec droits complets et fichiers Stems.' },
        { q: 'Proposez-vous des services pour les labels et maisons de disques ?', a: 'Absolument. Nous travaillons avec des labels et des structures professionnelles pour des placements, des synchronisations TV/Film et des productions sur-mesure avec contrats adaptés.' },
        { q: 'Est-ce que HeavieXo conserve des droits sur les beats vendus ?', a: 'Pour les licences non-exclusives, HeavieXo conserve les droits de revente à d\'autres artistes. Pour la licence Exclusive, vous devenez propriétaire exclusif du beat (HeavieXo conserve 100% des parts d\'auteur BMI).' },
        { q: 'Comment puis-je vous contacter pour une collaboration ?', a: 'Vous pouvez nous contacter par email à contact@heaviexobeats.com, par WhatsApp, ou via le formulaire de contact. Nous répondons sous 24h maximum.' }
      ]}, enabled: true, order: 3 },
    ]
  }
];

const sectionTypeIcons: Record<string, string> = {
  hero: '🎬', text: '📝', image: '🖼️', grid: '📊', cta: '🔘',
  marquee: '📜', spotify: '🎵', faq: '❓', pricing: '💎', custom: '⚙️'
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageConfig[]>(defaultPages);
  const [selectedPage, setSelectedPage] = useState<string>('beatstore');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/design')
      .then(res => res.json())
      .then(data => {
        if (data?.data?.pages && Array.isArray(data.data.pages) && data.data.pages.length > 0) {
          setPages(data.data.pages);
        }
      })
      .catch(() => {});
  }, []);

  const currentPage = pages.find(p => p.id === selectedPage) || pages[0];

  const updatePage = (pageId: string, updates: Partial<PageConfig>) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates } : p));
  };

  const updateSection = (pageId: string, sectionId: string, updates: Partial<PageSection>) => {
    setPages(prev => prev.map(p => p.id !== pageId ? p : {
      ...p, sections: p.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s)
    }));
  };

  const moveSection = (pageId: string, sectionId: string, direction: 'up' | 'down') => {
    setPages(prev => prev.map(p => {
      if (p.id !== pageId) return p;
      const sections = [...p.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      if (direction === 'up' && index > 0) [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
      else if (direction === 'down' && index < sections.length - 1) [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
      return { ...p, sections: sections.map((s, i) => ({ ...s, order: i + 1 })) };
    }));
  };

  const addSection = (pageId: string) => {
    const newSection: PageSection = { id: `section-${Date.now()}`, type: 'text', title: 'Nouvelle Section', content: { title: '', subtitle: '' }, enabled: true, order: currentPage.sections.length + 1 };
    updatePage(pageId, { sections: [...currentPage.sections, newSection] });
  };

  const removeSection = (pageId: string, sectionId: string) => {
    if (!confirm('Supprimer cette section ?')) return;
    updatePage(pageId, { sections: currentPage.sections.filter(s => s.id !== sectionId) });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/design', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pages }) });
      if (res.ok) { setMessage('Pages sauvegardées !'); setTimeout(() => setMessage(''), 3000); }
    } catch (err) { setMessage('Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Gestionnaire de Pages</h2>
          <p className="text-xs text-gray-400">Activez, désactivez, modifiez le contenu et organisez les sections.</p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs text-emerald-400">{message}</span>}
          <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 bg-[#ff6b35] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#e05a2b] disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Sauvegarde...' : 'Sauvegarder Tout'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-[#171513] border border-[#26221f] rounded-2xl p-1.5">
        {pages.map(page => (
          <button key={page.id} onClick={() => setSelectedPage(page.id)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              selectedPage === page.id ? 'bg-[#ff6b35] text-white' : 'text-gray-400 hover:text-white'
            }`}>
            <Globe className="w-3.5 h-3.5" /> {page.name}
            <span className={`w-2 h-2 rounded-full ${page.enabled ? 'bg-green-400' : 'bg-red-400'}`} />
          </button>
        ))}
      </div>

      {currentPage && (
        <div className="space-y-6">
          <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-[#ff6b35]" /> Paramètres : {currentPage.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut</label>
                <button onClick={() => updatePage(currentPage.id, { enabled: !currentPage.enabled })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold w-full ${currentPage.enabled ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {currentPage.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {currentPage.enabled ? 'Page Active' : 'Page Désactivée'}
                </button>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Titre Meta (SEO)</label>
                <input type="text" value={currentPage.metaTitle} onChange={(e) => updatePage(currentPage.id, { metaTitle: e.target.value })}
                  className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description Meta (SEO)</label>
                <input type="text" value={currentPage.metaDescription} onChange={(e) => updatePage(currentPage.id, { metaDescription: e.target.value })}
                  className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
              </div>
            </div>
          </div>

          <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Sections ({currentPage.sections.length})</h3>
              <button onClick={() => addSection(currentPage.id)} className="flex items-center gap-2 bg-[#201d1a] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#332e2a]">
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {currentPage.sections.sort((a, b) => a.order - b.order).map((section) => (
                <div key={section.id} className={`bg-[#201d1a] border rounded-xl transition-all ${section.enabled ? 'border-[#332e2a]' : 'border-red-500/20 opacity-60'}`}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveSection(currentPage.id, section.id, 'up')} className="text-gray-500 hover:text-white"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => moveSection(currentPage.id, section.id, 'down')} className="text-gray-500 hover:text-white"><ChevronDown className="w-4 h-4" /></button>
                      </div>
                      <span className="text-lg">{sectionTypeIcons[section.type] || '📄'}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{section.title}</span>
                          <span className="text-[10px] text-gray-500 uppercase bg-[#332e2a] px-2 py-0.5 rounded-full">{section.type}</span>
                          <span className="text-[10px] text-gray-500">#{section.order}</span>
                        </div>
                        {section.type === 'text' && section.content?.title && (
                          <p className="text-[10px] text-gray-400 mt-1 truncate">{section.content.title}</p>
                        )}
                        {section.type === 'pricing' && (
                          <p className="text-[10px] text-gray-400 mt-1">{section.content?.services?.length || 0} service(s)</p>
                        )}
                        {section.type === 'faq' && (
                          <p className="text-[10px] text-gray-400 mt-1">{section.content?.items?.length || 0} question(s)</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateSection(currentPage.id, section.id, { enabled: !section.enabled })}
                        className={`p-1.5 rounded-lg ${section.enabled ? 'text-green-400 hover:bg-green-500/20' : 'text-red-400 hover:bg-red-500/20'}`}>
                        {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                        className={`p-1.5 rounded-lg ${editingSection === section.id ? 'text-[#ff6b35] bg-[#ff6b35]/20' : 'text-gray-400 hover:text-white hover:bg-[#332e2a]'}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeSection(currentPage.id, section.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {editingSection === section.id && (
                    <div className="px-4 pb-4 pt-0 border-t border-[#332e2a] space-y-3">
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Titre section</label>
                          <input type="text" value={section.title}
                            onChange={(e) => updateSection(currentPage.id, section.id, { title: e.target.value })}
                            className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Type</label>
                          <select value={section.type}
                            onChange={(e) => updateSection(currentPage.id, section.id, { type: e.target.value as any })}
                            className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]">
                            {Object.entries(sectionTypeIcons).map(([key, icon]) => (
                              <option key={key} value={key}>{icon} {key.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {section.type === 'hero' && (
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Badge</label>
                          <input type="text" value={section.content?.badge || ''}
                            onChange={(e) => updateSection(currentPage.id, section.id, { content: { ...section.content, badge: e.target.value } })}
                            className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
                        </div>
                      )}

                      {(section.type === 'text' || section.type === 'cta') && (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">Titre</label>
                            <input type="text" value={section.content?.title || ''}
                              onChange={(e) => updateSection(currentPage.id, section.id, { content: { ...section.content, title: e.target.value } })}
                              className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-gray-400 mb-1">Sous-titre / Description</label>
                            <textarea rows={3} value={section.content?.subtitle || section.content?.text || ''}
                              onChange={(e) => updateSection(currentPage.id, section.id, { content: { ...section.content, subtitle: e.target.value, text: e.target.value } })}
                              className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#ff6b35]" />
                          </div>
                        </div>
                      )}

                      {section.type === 'faq' && (
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Questions/Réponses (JSON)</label>
                          <textarea rows={8} value={JSON.stringify(section.content?.items || [], null, 2)}
                            onChange={(e) => {
                              try { const items = JSON.parse(e.target.value); updateSection(currentPage.id, section.id, { content: { ...section.content, items } }); } catch {}
                            }}
                            className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-[#ff6b35]" />
                          <p className="text-[10px] text-gray-500 mt-1">Format : [question, reponse]</p>
                        </div>
                      )}

                      {section.type === 'pricing' && (
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Services (JSON)</label>
                          <textarea rows={12} value={JSON.stringify(section.content?.services || [], null, 2)}
                            onChange={(e) => {
                              try { const services = JSON.parse(e.target.value); updateSection(currentPage.id, section.id, { content: { ...section.content, services } }); } catch {}
                            }}
                            className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-[#ff6b35]" />
                          <p className="text-[10px] text-gray-500 mt-1">Format : [id, title, price, subtitle, desc, features]</p>
                        </div>
                      )}

                      {section.type === 'custom' && (
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Contenu libre (JSON)</label>
                          <textarea rows={5} value={JSON.stringify(section.content || {}, null, 2)}
                            onChange={(e) => {
                              try { const content = JSON.parse(e.target.value); updateSection(currentPage.id, section.id, { content }); } catch {}
                            }}
                            className="w-full bg-black/50 border border-[#332e2a] rounded-lg px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-[#ff6b35]" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
