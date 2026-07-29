'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Eye, EyeOff, CheckSquare, Square, Upload, Music, Plus } from 'lucide-react';

interface Beat {
  id: string;
  title: string;
  category?: string;
  price: number;
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

  // États pour l'upload / édition avec barres de progression
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBeatId, setCurrentBeatId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(29);
  const [category, setCategory] = useState('');

  // Fichiers et progression individuelle
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

  // Charger les beats au montage
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

  // Gestion de la sélection multiple (Batch)
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

  // Suppression en masse
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

  // Basculer la visibilité
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

  // Simulation d'upload avec progression et affichage du nom de fichier
  async function handleSaveBeat(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    const beatId = currentBeatId || `beat_${Date.now()}`;

    // Simulation dynamique de la progression pour chaque fichier présent
    const fileKeys = Object.keys(files) as (keyof typeof files)[];
    
    for (const key of fileKeys) {
      if (files[key]) {
        for (let p = 0; p <= 100; p += 20) {
          setUploadProgress((prev) => ({ ...prev, [key]: p }));
          await new Promise((r) => setTimeout(r, 150)); // Simule la vitesse d'envoi
        }
      }
    }

    // Envoi final des données vers l'API
    try {
      const formData = new FormData();
      formData.append('id', beatId);
      formData.append('title', title);
      formData.append('price', String(price));
      formData.append('category', category);

      if (files.cover) formData.append('cover', files.cover);
      if (files.previewMp3) formData.append('previewMp3', files.previewMp3);
      if (files.masterWav) formData.append('masterWav', files.masterWav);
      if (files.stemsZip) formData.append('stemsZip', files.stemsZip);

      const res = await fetch('/api/beats', {
        method: currentBeatId ? 'PUT' : 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur sauvegarde');

      setIsModalOpen(false);
      resetForm();
      fetchBeats();
    } catch (err) {
      alert('Erreur lors de l’enregistrement du beat.');
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setCurrentBeatId('');
    setTitle('');
    setPrice(29);
    setCategory('');
    setFiles({});
    setUploadProgress({ cover: 0, previewMp3: 0, masterWav: 0, stemsZip: 0 });
  }

  return (
    <div className="space-y-6">
      {/* En-tête et Actions Globales */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Catalogue des Beats</h2>
          <p className="text-xs text-gray-400">Gérez vos productions, fichiers audio et visibilité.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-600/50 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-600 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" /> Supprimer la sélection ({selectedIds.length})
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

      {/* Tableau des Beats */}
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
              <th className="p-4">Catégorie</th>
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
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#ff6b35]" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 font-semibold text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                        {beat.cover ? <img src={beat.cover} alt="" className="w-full h-full object-cover" /> : <Music className="w-5 h-5 m-2.5 text-gray-500" />}
                      </div>
                      {beat.title}
                    </td>
                    <td className="p-4 text-gray-400">{beat.category || 'N/A'}</td>
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

      {/* Modal d'ajout / modification avec barres de progression des fichiers */}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Prix ($)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Catégorie / Style</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Trap, Drill, etc."
                    className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#ff6b35]"
                  />
                </div>
              </div>

              {/* SECTION UPLOAD FICHIERS AVEC BARRE DE PROGRESSION & NOM DE FICHIER */}
              <div className="space-y-4 pt-2 border-t border-[#26221f]">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#ff6b35]" /> Fichiers Multimédias & Audio
                </h4>

                {/* Cover Image */}
                <div className="bg-[#201d1a] p-3 rounded-xl border border-[#332e2a]">
                  <label className="block text-xs text-gray-400 mb-1">Image de couverture (Cover)</label>
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
                  <label className="block text-xs text-gray-400 mb-1">Aperçu MP3 (Preview)</label>
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

                {/* Stems ZIP */}
                <div className="bg-[#201d1a] p-3 rounded-xl border border-[#332e2a]">
                  <label className="block text-xs text-gray-400 mb-1">Pistes séparées (Stems ZIP)</label>
                  <input
                    type="file"
                    accept=".zip,.rar"
                    onChange={(e) => setFiles({ ...files, stemsZip: e.target.files?.[0] })}
                    className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#ff6b35] file:text-white hover:file:bg-[#e05a2b]"
                  />
                  {files.stemsZip && <p className="text-xs text-emerald-400 mt-1">Fichier sélectionné : {files.stemsZip.name}</p>}
                  {uploading && uploadProgress.stemsZip > 0 && (
                    <div className="mt-2 w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#ff6b35] h-2 transition-all duration-200" style={{ width: `${uploadProgress.stemsZip}%` }}></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons de validation */}
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
                  {uploading ? 'Envoi des fichiers en cours...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}