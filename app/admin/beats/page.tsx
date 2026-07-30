'use client';
import { upload } from '@vercel/blob/client';
import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff, CheckSquare, Square, Upload, Music, Plus, X } from 'lucide-react';

interface Beat {
  id: string;
  title: string;
  category?: string;
  price: number;
  bpm?: number;
  musicalKey?: string;
  moods?: string[];
  visible: boolean;
  cover?: string;
  previewMp3?: string;
  masterWav?: string;
  stemsZip?: string;
}

export default function AdminBeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBeatId, setCurrentBeatId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(29);
  const [category, setCategory] = useState('');
  const [bpm, setBpm] = useState<number>(140);
  const [musicalKey, setMusicalKey] = useState('');

  // Gestion des moods / styles (liste dynamique)
  const [moodInput, setMoodInput] = useState('');
  const [moods, setMoods] = useState<string[]>([]);

  // Fichiers et progression
  const [files, setFiles] = useState<{
    cover?: File;
    previewMp3?: File;
    masterWav?: File;
    stemsZip?: File;
  }>({});

  const [uploadProgress, setUploadProgress] = useState<{
    cover: number;
    previewMp3: number;
    masterWav: number;
    stemsZip: number;
  }>({ cover: 0, previewMp3: 0, masterWav: 0, stemsZip: 0 });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBeats();
  }, []);

  async function fetchBeats() {
    try {
      const res = await fetch('/api/beats');
      const data = await res.json();
      setBeats(data);
    } catch (err) {
      console.error('Erreur chargement beats', err);
    } finally {
      setLoading(false);
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === beats.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(beats.map((b) => b.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  async function handleBatchDelete() {
    if (!confirm(`Voulez-vous vraiment supprimer les ${selectedIds.length} beats sélectionnés ?`)) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/beats/${id}`, { method: 'DELETE' })
        )
      );
      setSelectedIds([]);
      fetchBeats();
    } catch (err) {
      alert('Erreur lors de la suppression groupée.');
    }
  }

  async function toggleVisibility(id: string, currentStatus: boolean) {
    try {
      await fetch(`/api/beats/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentStatus }),
      });
      fetchBeats();
    } catch (err) {
      alert('Erreur lors du changement de visibilité.');
    }
  }

  function addMood() {
    if (moodInput.trim() && !moods.includes(moodInput.trim())) {
      setMoods([...moods, moodInput.trim()]);
      setMoodInput('');
    }
  }

  function removeMood(moodToRemove: string) {
    setMoods(moods.filter(m => m !== moodToRemove));
  }

  async function handleSaveBeat(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    try {
      // Génère un slug propre à partir du titre
      const slug = title
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();

      let beatId = currentBeatId;

      // Étape 1 : créer ou mettre à jour le beat (JSON léger, sans fichiers)
      if (!currentBeatId) {
        const res = await fetch('/api/beats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            genre: category,
            mood: moods.join(', '),
            bpm,
            musical_key: musicalKey,
            price,
            status: 'published',
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Erreur création du beat');
        }
        const created = await res.json();
        beatId = created.id;
      } else {
        const res = await fetch(`/api/beats/${currentBeatId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            genre: category,
            mood: moods.join(', '),
            bpm,
            musical_key: musicalKey,
            price,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Erreur mise à jour du beat');
        }
      }

      // Étape 2 : uploader les fichiers directement vers Vercel Blob (contourne le serveur)
      const uploadedUrls: Record<string, string> = {};

      const uploadOne = async (file: File, key: keyof typeof uploadProgress, fileName: string) => {
        const blob = await upload(`beats/${slug}/${fileName}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          onUploadProgress: (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [key]: Math.round(progress.percentage),
            }));
          },
        });
        uploadedUrls[key] = blob.url;
      };

      const uploadTasks: Promise<void>[] = [];
      if (files.cover) uploadTasks.push(uploadOne(files.cover, 'cover', 'cover.webp'));
      if (files.previewMp3) uploadTasks.push(uploadOne(files.previewMp3, 'previewMp3', 'preview.mp3'));
      if (files.masterWav) uploadTasks.push(uploadOne(files.masterWav, 'masterWav', 'master.wav'));
      // Stems désactivé temporairement — voir bloc UI plus bas
      // if (files.stemsZip) {
      //   const ext = files.stemsZip.name.split('.').pop() || 'zip';
      //   uploadTasks.push(uploadOne(files.stemsZip, 'stemsZip', `stems.${ext}`));
      // }

      if (uploadTasks.length > 0) {
        await Promise.all(uploadTasks);

        // Enregistrer les URLs obtenues dans la base
        const res = await fetch(`/api/beats/${beatId}/files`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadedUrls),
        });

        if (!res.ok) throw new Error('Erreur enregistrement des URLs de fichiers');
      }

      setIsModalOpen(false);
      resetForm();
      fetchBeats();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement du beat : ' + (err instanceof Error ? err.message : ''));
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setCurrentBeatId('');
    setTitle('');
    setPrice(29);
    setCategory('');
    setBpm(140);
    setMusicalKey('');
    setMoods([]);
    setMoodInput('');
    setFiles({});
    setUploadProgress({ cover: 0, previewMp3: 0, masterWav: 0, stemsZip: 0 });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Catalogue des Beats</h2>
          <p className="text-xs text-gray-400">Gérez vos productions, BPM, gammes et fichiers.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-600/50 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-600 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" /> Supprimer ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-[#ff6b35] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#e05a2b] transition-all"
          >
            <Plus className="w-4 h-4" /> Ajouter un Beat
          </button>
        </div>
      </div>

      <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
              <th className="p-4 w-10">
                <button onClick={toggleSelectAll}>
                  {selectedIds.length > 0 && selectedIds.length === beats.length ? (
                    <CheckSquare className="w-4 h-4 text-[#ff6b35]" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </th>
              <th className="p-4">Titre</th>
              <th className="p-4">BPM / Gamme</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26221f] text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Chargement...</td></tr>
            ) : beats.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Aucun beat trouvé.</td></tr>
            ) : (
              beats.map((beat) => {
                const isSelected = selectedIds.includes(beat.id);
                return (
                  <tr key={beat.id} className="hover:bg-[#201d1a] transition-colors">
                    <td className="p-4">
                      <button onClick={() => toggleSelectOne(beat.id)}>
                        {isSelected ? <CheckSquare className="w-4 h-4 text-[#ff6b35]" /> : <Square className="w-4 h-4 text-gray-600" />}
                      </button>
                    </td>
                    <td className="p-4 font-semibold text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                        {beat.cover ? <img src={beat.cover} alt="" className="w-full h-full object-cover" /> : <Music className="w-5 h-5 m-2.5 text-gray-500" />}
                      </div>
                      <div>
                        <p>{beat.title}</p>
                        <span className="text-xs text-gray-400 font-normal">{beat.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-xs">
                      {beat.bpm ? `${beat.bpm} BPM` : 'N/A'} {beat.musicalKey ? `/ ${beat.musicalKey}` : ''}
                    </td>
                    <td className="p-4 text-white font-medium">{beat.price} $</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleVisibility(beat.id, beat.visible)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          beat.visible ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}
                      >
                        {beat.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {beat.visible ? 'Visible' : 'Masqué'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setCurrentBeatId(beat.id);
                          setTitle(beat.title);
                          setPrice(beat.price);
                          setCategory(beat.category || '');
                          setBpm(beat.bpm || 140);
                          setMusicalKey(beat.musicalKey || '');
                          setMoods(beat.moods || []);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Supprimer ce beat ?')) {
                            await fetch(`/api/beats/${beat.id}`, { method: 'DELETE' });
                            fetchBeats();
                          }
                        }}
                        className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout / Edition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#171513] border border-[#26221f] rounded-2xl w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">{currentBeatId ? 'Modifier le Beat' : 'Ajouter un nouveau Beat'}</h3>

            <form onSubmit={handleSaveBeat} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Titre du Beat</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Prix ($)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">BPM</label>
                  <input
                    type="number"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Gamme (Key)</label>
                  <input
                    type="text"
                    placeholder="ex: Am, C#m"
                    value={musicalKey}
                    onChange={(e) => setMusicalKey(e.target.value)}
                    className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Catégorie</label>
                  <input
                    type="text"
                    placeholder="Trap, Drill..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              </div>

              {/* MOODS & STYLES EN LISTE / TAGS */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Moods & Styles (Tags)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ajouter un mood (ex: Dark, Energetic...)"
                    value={moodInput}
                    onChange={(e) => setMoodInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMood(); } }}
                    className="flex-1 bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                  />
                  <button
                    type="button"
                    onClick={addMood}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {moods.map((m, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/30 rounded-lg text-xs font-medium">
                      {m}
                      <button type="button" onClick={() => removeMood(m)}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* FICHIERS AVEC BARRE DE PROGRESSION & NOM */}
              <div className="space-y-3 pt-2 border-t border-[#26221f]">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#ff6b35]" /> Fichiers Multimédias & Audio
                </h4>

                {/* Cover */}
                <div className="bg-[#201d1a] p-3 rounded-xl border border-[#332e2a]">
                  <label className="block text-xs text-gray-400 mb-1">Image de couverture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFiles({ ...files, cover: e.target.files?.[0] })}
                    className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ff6b35] file:text-white hover:file:bg-[#e05a2b]"
                  />
                  {files.cover && <p className="text-xs text-emerald-400 mt-1">Fichier sélectionné : {files.cover.name}</p>}
                  {uploading && uploadProgress.cover > 0 && (
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#ff6b35] h-2 transition-all duration-200" style={{ width: `${uploadProgress.cover}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Preview MP3 */}
                <div className="bg-[#201d1a] p-3 rounded-xl border border-[#332e2a]">
                  <label className="block text-xs text-gray-400 mb-1">Aperçu MP3</label>
                  <input
                    type="file"
                    accept="audio/mp3,audio/mpeg"
                    onChange={(e) => setFiles({ ...files, previewMp3: e.target.files?.[0] })}
                    className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ff6b35] file:text-white hover:file:bg-[#e05a2b]"
                  />
                  {files.previewMp3 && <p className="text-xs text-emerald-400 mt-1">Fichier sélectionné : {files.previewMp3.name}</p>}
                  {uploading && uploadProgress.previewMp3 > 0 && (
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#ff6b35] h-2 transition-all duration-200" style={{ width: `${uploadProgress.previewMp3}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Master WAV */}
                <div className="bg-[#201d1a] p-3 rounded-xl border border-[#332e2a]">
                  <label className="block text-xs text-gray-400 mb-1">Fichier Master WAV</label>
                  <input
                    type="file"
                    accept="audio/wav"
                    onChange={(e) => setFiles({ ...files, masterWav: e.target.files?.[0] })}
                    className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ff6b35] file:text-white hover:file:bg-[#e05a2b]"
                  />
                  {files.masterWav && <p className="text-xs text-emerald-400 mt-1">Fichier sélectionné : {files.masterWav.name}</p>}
                  {uploading && uploadProgress.masterWav > 0 && (
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#ff6b35] h-2 transition-all duration-200" style={{ width: `${uploadProgress.masterWav}%` }}></div>
                    </div>
                  )}
                </div>

                {/* Stems ZIP - désactivé temporairement (upgrade stockage à venir) */}
                <div className="bg-[#201d1a] p-3 rounded-xl border border-[#332e2a] opacity-50">
                  <label className="block text-xs text-gray-400 mb-1">
                    Pistes séparées (Stems ZIP) — <span className="text-[#ff6b35]">Bientôt disponible</span>
                  </label>
                  <input
                    type="file"
                    accept=".zip,.rar"
                    disabled
                    className="text-xs text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cette option sera réactivée après mise à niveau du stockage.</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#26221f]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={uploading}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-[#ff6b35] text-white rounded-xl text-xs font-semibold hover:bg-[#e05a2b] transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Envoi en cours...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}