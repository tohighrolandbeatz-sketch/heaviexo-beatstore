'use client';
import { upload } from '@vercel/blob/client';
import { useState, useEffect, useRef } from 'react';
import { Trash2, Edit, Eye, EyeOff, CheckSquare, Square, Upload, Music, Plus, X, AlertCircle, CheckCircle2, Star } from 'lucide-react';

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
  licenses?: string[];
  featured?: boolean;
}

interface UploadedFile {
  key: string;
  name: string;
  url: string;
  size: string;
}

interface UploadProgress {
  key: string;
  name: string;
  progress: number;
}

const MUSICAL_KEYS = [
  'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m',
  'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm',
  'G#', 'G#m', 'A', 'Am', 'A#', 'A#m', 'B', 'Bm'
];

const CATEGORIES = [
  'Trap', 'Drill', 'Afrobeat', 'Amapiano', 'R&B', 'Pop',
  'Boom Bap', 'Lo-Fi', 'Reggaeton', 'Dancehall', 'Jersey Club', 'Other'
];

const MOOD_TAGS = [
  'Dark', 'Melodic', 'Energetic', 'Chill', 'Aggressive',
  'Emotional', 'Happy', 'Sad', 'Epic', 'Cinematic',
  'Bouncy', 'Hard', 'Smooth', 'Trippy', 'Vintage',
  'Futuristic', 'Romantic', 'Hype', 'Dreamy', 'Gritty'
];

export default function AdminBeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBeatId, setCurrentBeatId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(29);
  const [category, setCategory] = useState('');
  const [bpm, setBpm] = useState<number | ''>('');
  const [musicalKey, setMusicalKey] = useState('');
  const [moods, setMoods] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>(['mp3', 'wav', 'stems', 'exclusive']);
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgresses, setUploadProgresses] = useState<UploadProgress[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const moodDropdownRef = useRef<HTMLDivElement>(null);

  // Featured system
  const [featuredMode, setFeaturedMode] = useState<'auto' | 'manual' | 'off'>('auto');
  const [featuredBeatId, setFeaturedBeatId] = useState<string>('');

  useEffect(() => { fetchBeats(); }, []);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moodDropdownRef.current && !moodDropdownRef.current.contains(e.target as Node)) {
        setShowMoodDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchBeats() {
    try {
      const res = await fetch('/api/beats');
      const data = await res.json();
      const mapped: Beat[] = (Array.isArray(data) ? data : []).map((b: any) => ({
        id: b.id, title: b.title, category: b.genre || '', price: b.price,
        bpm: b.bpm, musicalKey: b.musical_key || '',
        moods: b.mood ? b.mood.split(',').map((m: string) => m.trim()).filter(Boolean) : [],
        visible: b.status !== 'draft', cover: b.cover_url || undefined,
        previewMp3: b.preview_url || undefined, masterWav: b.master_url || undefined,
        stemsZip: b.stems_url || undefined,
        licenses: b.licenses_json ? JSON.parse(b.licenses_json) : ['mp3', 'wav', 'stems', 'exclusive'],
        featured: b.featured === 1 || b.featured === true,
      }));
      setBeats(mapped);
    } catch (err) { console.error('Erreur chargement beats', err); }
    finally { setLoading(false); }
  }

  const toggleSelectAll = () => setSelectedIds(selectedIds.length === beats.length ? [] : beats.map(b => b.id));
  const toggleSelectOne = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  async function handleBatchDelete() {
    if (!confirm(`Supprimer les ${selectedIds.length} beats sélectionnés ?`)) return;
    await Promise.all(selectedIds.map(id => fetch(`/api/beats/${id}`, { method: 'DELETE' })));
    setSelectedIds([]); fetchBeats();
  }

  async function toggleVisibility(id: string, currentStatus: boolean) {
    await fetch(`/api/beats/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: currentStatus ? 'draft' : 'published' }) });
    fetchBeats();
  }

  async function saveFeaturedConfig() {
    await fetch('/api/featured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: featuredMode, beatId: featuredBeatId }),
    });
    fetchBeats();
  }

  function toggleMood(mood: string) {
    setMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  }

  function toggleLicense(licenseId: string) {
    setSelectedLicenses(prev => prev.includes(licenseId) ? prev.filter(l => l !== licenseId) : [...prev, licenseId]);
    setErrors(prev => { const e = {...prev}; delete e.licenses; return e; });
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!price || price <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (!bpm || bpm <= 0) newErrors.bpm = 'Le BPM est obligatoire';
    if (!category) newErrors.category = 'La catégorie est obligatoire';
    if (!musicalKey) newErrors.musicalKey = 'La gamme est obligatoire';
    if (selectedLicenses.length === 0) newErrors.licenses = 'Au moins une licence doit être sélectionnée';
    const hasCover = uploadedFiles.some(f => f.key === 'cover');
    const hasPreview = uploadedFiles.some(f => f.key === 'previewMp3');
    const hasMaster = uploadedFiles.some(f => f.key === 'masterWav');
    if (!hasCover && !currentBeatId) newErrors.cover = 'La cover est obligatoire';
    if (!hasPreview && !hasMaster && !currentBeatId) newErrors.audio = 'Au moins un fichier audio est obligatoire';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
        if (h > maxHeight) { w = (w * maxHeight) / h; h = maxHeight; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          resolve(new File([blob!], file.name, { type: "image/webp" }));
        }, "image/webp", 0.8);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function uploadSingleFile(file: File, key: string) {
    setUploading(key);
    setUploadProgresses(prev => [...prev.filter(p => p.key !== key), { key, name: file.name, progress: 0 }]);
    try {
      const slug = title ? title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now() : `beat-${Date.now()}`;
      const blob = await upload(`beats/${slug}/${file.name}`, file, {
        access: 'public', handleUploadUrl: '/api/upload',
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(progressEvent.percentage);
          setUploadProgresses(prev => prev.map(p => p.key === key ? { ...p, progress } : p));
        },
      });
      setUploadedFiles(prev => [...prev.filter(f => f.key !== key), { key, name: file.name, url: blob.url, size: formatSize(file.size) }]);
      setUploadProgresses(prev => prev.filter(p => p.key !== key));
      if (key === 'cover') setErrors(prev => { const e = {...prev}; delete e.cover; return e; });
      if (key === 'previewMp3' || key === 'masterWav') setErrors(prev => { const e = {...prev}; delete e.audio; return e; });
    } catch (err) {
      setUploadProgresses(prev => prev.filter(p => p.key !== key));
      alert(`Erreur upload ${key}: ${err instanceof Error ? err.message : 'Inconnue'}`);
    } finally { setUploading(null); }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function removeFile(key: string) { setUploadedFiles(prev => prev.filter(f => f.key !== key)); }

  async function handleSaveBeat(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setUploading('saving');
    try {
      const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      let beatId = currentBeatId;
      if (!currentBeatId) {
        const res = await fetch('/api/beats', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug, genre: category, mood: moods.join(', '), bpm, musical_key: musicalKey, price, status: 'published', licenses_json: JSON.stringify(selectedLicenses) }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Erreur création');
        const created = await res.json();
        beatId = created.id;
      } else {
        const res = await fetch(`/api/beats/${currentBeatId}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, genre: category, mood: moods.join(', '), bpm, musical_key: musicalKey, price, licenses_json: JSON.stringify(selectedLicenses) }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Erreur mise à jour');
      }
      if (uploadedFiles.length > 0) {
        const urls: Record<string, string> = {};
        const keyMap: Record<string, string> = { 'cover': 'cover_url', 'previewMp3': 'preview_url', 'masterWav': 'master_url', 'stemsZip': 'stems_url' };
        uploadedFiles.forEach(f => { urls[keyMap[f.key] || f.key] = f.url; });
        await fetch(`/api/beats/${beatId}/files`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(urls) });
      }
      setIsModalOpen(false); resetForm(); fetchBeats();
    } catch (err) { alert('Erreur: ' + (err instanceof Error ? err.message : 'Inconnue')); }
    finally { setUploading(null); }
  }

  function resetForm() {
    setCurrentBeatId(''); setTitle(''); setPrice(29); setCategory('');
    setBpm(''); setMusicalKey(''); setMoods([]);
    setSelectedLicenses(['mp3', 'wav', 'stems', 'exclusive']);
    setUploadedFiles([]); setUploadProgresses([]); setErrors({});
  }

  const isNew = !currentBeatId;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Catalogue des Beats</h2>
          <p className="text-xs text-gray-400">Gérez vos productions, BPM, gammes et fichiers.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button onClick={handleBatchDelete} className="flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-600/50 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-600 hover:text-white transition-all">
              <Trash2 className="w-4 h-4" /> Supprimer ({selectedIds.length})
            </button>
          )}
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[#ff6b35] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#e05a2b] transition-all">
            <Plus className="w-4 h-4" /> Ajouter un Beat
          </button>
        </div>
      </div>

      {/* SECTION FEATURED */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl p-5">
        <h2 className="text-xs font-bold text-[#ff6b35] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" /> Mise en avant (Hero Bannière)
        </h2>
        <div className="flex items-center gap-6 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={featuredMode === 'auto'} onChange={() => setFeaturedMode('auto')} className="accent-[#ff6b35]" />
            <span className="text-xs text-gray-300">Auto (dernier beat uploadé)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={featuredMode === 'manual'} onChange={() => setFeaturedMode('manual')} className="accent-[#ff6b35]" />
            <span className="text-xs text-gray-300">Manuel (choisir le beat)</span>
          </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={featuredMode === 'off'} onChange={() => setFeaturedMode('off')} className="accent-[#ff6b35]" />
              <span className="text-xs text-gray-300">Off (pas de bannière)</span>
            </label>
          {featuredMode === 'manual' && (
            <select value={featuredBeatId} onChange={(e) => setFeaturedBeatId(e.target.value)}
              className="bg-[#201d1a] border border-[#332e2a] rounded-lg px-3 py-1.5 text-xs text-white">
              <option value="">-- Choisir --</option>
              {beats.map((b: any) => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          )}
          <button onClick={saveFeaturedConfig} className="bg-[#ff6b35] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#e05a2b] transition-all">
            Appliquer
          </button>
        </div>
        {beats.filter(b => b.featured).length > 0 && (
          <div className="mt-3 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3" />
            Beat star actuel : <span className="text-white font-bold">{beats.find(b => b.featured)?.title}</span>
          </div>
        )}
      </div>

      {/* Table des beats */}
      <div className="bg-[#171513] border border-[#26221f] rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#26221f] text-gray-400 text-xs uppercase">
              <th className="p-4 w-10"><button onClick={toggleSelectAll}>{selectedIds.length === beats.length ? <CheckSquare className="w-4 h-4 text-[#ff6b35]" /> : <Square className="w-4 h-4 text-gray-600" />}</button></th>
              <th className="p-4">Titre</th>
              <th className="p-4">BPM / Gamme</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Licences</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26221f] text-sm">
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">Chargement...</td></tr>
            ) : beats.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">Aucun beat trouvé.</td></tr>
            ) : (
              beats.map((beat) => {
                const isSelected = selectedIds.includes(beat.id);
                const licenseCount = beat.licenses?.length || 0;
                return (
                  <tr key={beat.id} className="hover:bg-[#201d1a] transition-colors">
                    <td className="p-4"><button onClick={() => toggleSelectOne(beat.id)}>{isSelected ? <CheckSquare className="w-4 h-4 text-[#ff6b35]" /> : <Square className="w-4 h-4 text-gray-600" />}</button></td>
                    <td className="p-4 font-semibold text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                        {beat.cover ? <img src={beat.cover} alt="" className="w-full h-full object-cover" /> : <Music className="w-5 h-5 m-2.5 text-gray-500" />}
                      </div>
                      <div>
                        <p className="flex items-center gap-2">{beat.title}{beat.featured && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}</p>
                        <span className="text-xs text-gray-400 font-normal">{beat.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-xs">{beat.bpm ? `${beat.bpm} BPM` : 'N/A'} {beat.musicalKey ? `/ ${beat.musicalKey}` : ''}</td>
                    <td className="p-4 text-white font-medium">{beat.price} $</td>
                    <td className="p-4"><span className="text-xs text-gray-400">{licenseCount} licence{licenseCount > 1 ? 's' : ''}</span></td>
                    <td className="p-4">
                      <button onClick={() => toggleVisibility(beat.id, beat.visible)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${beat.visible ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        {beat.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}{beat.visible ? 'Visible' : 'Masqué'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
<button onClick={() => { 
  setCurrentBeatId(beat.id); setTitle(beat.title); setPrice(beat.price); 
  setCategory(beat.category || ''); setBpm(beat.bpm || ''); 
  setMusicalKey(beat.musicalKey || ''); setMoods(beat.moods || []);
  setSelectedLicenses(beat.licenses || ['mp3', 'wav', 'stems', 'exclusive']);
  // Pré-remplir les fichiers existants
  const existingFiles: any[] = [];
  if (beat.cover) existingFiles.push({ key: 'cover', name: decodeURIComponent(beat.cover.split('/').pop() || 'cover'), url: beat.cover, size: '' });
  if (beat.previewMp3) existingFiles.push({ key: 'previewMp3', name: decodeURIComponent(beat.previewMp3.split('/').pop() || 'preview.mp3'), url: beat.previewMp3, size: '' });
  if (beat.masterWav) existingFiles.push({ key: 'masterWav', name: decodeURIComponent(beat.masterWav.split('/').pop() || 'master.wav'), url: beat.masterWav, size: '' });
  if (beat.stemsZip) existingFiles.push({ key: 'stemsZip', name: decodeURIComponent(beat.stemsZip.split('/').pop() || 'stems.zip'), url: beat.stemsZip, size: '' });
  setUploadedFiles(existingFiles);
  setIsModalOpen(true); 
}} className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>                      <button onClick={async () => { if (confirm('Supprimer ce beat ?')) { await fetch(`/api/beats/${beat.id}`, { method: 'DELETE' }); fetchBeats(); } }} className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#171513] border border-[#26221f] rounded-2xl w-full max-w-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{isNew ? 'Ajouter un nouveau Beat' : 'Modifier le Beat'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white hover:bg-[#201d1a] rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-400">
                  <p className="font-bold mb-1">Champs obligatoires manquants :</p>
                  <ul className="list-disc list-inside space-y-0.5">{Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}</ul>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveBeat} className="space-y-5">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Titre du Beat <span className="text-red-400">*</span></label>
                <input type="text" required value={title} onChange={(e) => { setTitle(e.target.value); setErrors(prev => { const e = {...prev}; delete e.title; return e; }); }} className={`w-full bg-[#201d1a] border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none ${errors.title ? 'border-red-500' : 'border-[#332e2a] focus:border-[#ff6b35]'}`} />
                {errors.title && <p className="text-[10px] text-red-400 mt-1">{errors.title}</p>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><label className="block text-xs text-gray-400 mb-1">Prix ($) <span className="text-red-400">*</span></label><input type="number" required value={price} onChange={(e) => { setPrice(Number(e.target.value)); setErrors(prev => { const e = {...prev}; delete e.price; return e; }); }} className={`w-full bg-[#201d1a] border rounded-xl px-3 py-2 text-white text-sm focus:outline-none ${errors.price ? 'border-red-500' : 'border-[#332e2a] focus:border-[#ff6b35]'}`} />{errors.price && <p className="text-[10px] text-red-400 mt-1">{errors.price}</p>}</div>
                <div><label className="block text-xs text-gray-400 mb-1">BPM <span className="text-red-400">*</span></label><input type="number" value={bpm} onChange={(e) => { setBpm(e.target.value === '' ? '' : Number(e.target.value)); setErrors(prev => { const e = {...prev}; delete e.bpm; return e; }); }} className={`w-full bg-[#201d1a] border rounded-xl px-3 py-2 text-white text-sm focus:outline-none ${errors.bpm ? 'border-red-500' : 'border-[#332e2a] focus:border-[#ff6b35]'}`} />{errors.bpm && <p className="text-[10px] text-red-400 mt-1">{errors.bpm}</p>}</div>
                <div><label className="block text-xs text-gray-400 mb-1">Gamme <span className="text-red-400">*</span></label><select value={musicalKey} onChange={(e) => { setMusicalKey(e.target.value); setErrors(prev => { const e = {...prev}; delete e.musicalKey; return e; }); }} className={`w-full bg-[#201d1a] border rounded-xl px-3 py-2 text-white text-sm focus:outline-none ${errors.musicalKey ? 'border-red-500' : 'border-[#332e2a] focus:border-[#ff6b35]'}`}><option value="">Sélectionner...</option>{MUSICAL_KEYS.map(key => <option key={key} value={key}>{key}</option>)}</select>{errors.musicalKey && <p className="text-[10px] text-red-400 mt-1">{errors.musicalKey}</p>}</div>
                <div><label className="block text-xs text-gray-400 mb-1">Catégorie <span className="text-red-400">*</span></label><select value={category} onChange={(e) => { setCategory(e.target.value); setErrors(prev => { const e = {...prev}; delete e.category; return e; }); }} className={`w-full bg-[#201d1a] border rounded-xl px-3 py-2 text-white text-sm focus:outline-none ${errors.category ? 'border-red-500' : 'border-[#332e2a] focus:border-[#ff6b35]'}`}><option value="">Sélectionner...</option>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>{errors.category && <p className="text-[10px] text-red-400 mt-1">{errors.category}</p>}</div>
              </div>
              <div ref={moodDropdownRef}>
                <label className="block text-xs text-gray-400 mb-1">Moods & Styles</label>
                <div className="relative">
                  <button type="button" onClick={() => setShowMoodDropdown(!showMoodDropdown)} className="w-full bg-[#201d1a] border border-[#332e2a] rounded-xl px-4 py-2.5 text-white text-sm text-left focus:outline-none focus:border-[#ff6b35] flex items-center justify-between"><span className={moods.length === 0 ? 'text-gray-500' : ''}>{moods.length === 0 ? 'Sélectionner des moods...' : `${moods.length} mood(s) sélectionné(s)`}</span><span className="text-gray-400 text-xs">{moods.length > 0 && moods.slice(0, 3).join(', ')}{moods.length > 3 ? '...' : ''}</span></button>
                  {showMoodDropdown && (<div className="absolute z-10 mt-1 w-full bg-[#201d1a] border border-[#332e2a] rounded-xl shadow-2xl max-h-48 overflow-y-auto p-2 grid grid-cols-2 gap-1">{MOOD_TAGS.map(mood => (<button key={mood} type="button" onClick={() => toggleMood(mood)} className={`text-left px-3 py-1.5 rounded-lg text-xs transition-all ${moods.includes(mood) ? 'bg-[#ff6b35] text-white' : 'text-gray-400 hover:bg-[#332e2a] hover:text-white'}`}>{moods.includes(mood) ? '✓ ' : ''}{mood}</button>))}</div>)}
                </div>
                {moods.length > 0 && (<div className="flex flex-wrap gap-1.5 mt-2">{moods.map(m => (<span key={m} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]/30 rounded-lg text-[10px] font-medium">{m} <button type="button" onClick={() => toggleMood(m)}><X className="w-3 h-3 hover:text-white" /></button></span>))}</div>)}
              </div>
              <div className="space-y-3 pt-2 border-t border-[#26221f]">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2"><Upload className="w-4 h-4 text-[#ff6b35]" /> Fichiers {isNew && <span className="text-[10px] text-red-400 font-normal">(Au moins un fichier audio requis)</span>}</h4>
                {['cover', 'previewMp3', 'masterWav'].map(key => (
                  <div key={key} className={`bg-[#201d1a] p-4 rounded-xl border ${errors[key] ? 'border-red-500' : 'border-[#332e2a]'}`}>
                    <div className="flex items-center justify-between mb-2"><label className="text-xs text-gray-400">{key === 'cover' ? 'Cover (Image)' : key === 'previewMp3' ? 'Aperçu MP3' : 'Master WAV'} {isNew && key === 'cover' && <span className="text-red-400">*</span>}</label>{uploadedFiles.some(f => f.key === key) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}</div>
                    <div className="flex items-center gap-3">
                      <input ref={el => { fileInputRefs.current[key] = el; }} type="file" accept={key === 'cover' ? 'image/*' : key === 'previewMp3' ? 'audio/mp3,audio/mpeg' : 'audio/wav'} onChange={(e) => { if (e.target.files?.[0]) uploadSingleFile(e.target.files[0], key); }} className="hidden" />
                      <button type="button" onClick={() => fileInputRefs.current[key]?.click()} disabled={uploading === key} className="px-4 py-2 bg-[#332e2a] text-white text-xs font-semibold rounded-xl hover:bg-[#4a3f38] disabled:opacity-50 transition-all">{uploading === key ? 'Upload...' : key === 'cover' ? 'Choisir une image' : key === 'previewMp3' ? 'Choisir MP3' : 'Choisir WAV'}</button>
                      {uploadProgresses.find(p => p.key === key) && (<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full border-2 border-[#ff6b35] border-t-transparent animate-spin" /><span className="text-xs text-[#ff6b35]">{uploadProgresses.find(p => p.key === key)!.progress}%</span></div>)}
                      {uploadedFiles.find(f => f.key === key)?.name && (<span className="text-xs text-emerald-400 flex items-center gap-2">{uploadedFiles.find(f => f.key === key)!.name}<button type="button" onClick={() => removeFile(key)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3" /></button></span>)}
                    </div>
                    {errors[key] && <p className="text-[10px] text-red-400 mt-1">{errors[key]}</p>}
                  </div>
                ))}
                <div className="bg-[#201d1a] p-4 rounded-xl border border-[#332e2a] opacity-50"><div className="flex items-center justify-between mb-2"><label className="text-xs text-gray-400">Pistes séparées (Stems ZIP)</label><span className="text-[10px] text-[#ff6b35] bg-[#ff6b35]/10 px-2 py-0.5 rounded-full">Bientôt disponible</span></div><button type="button" disabled className="px-4 py-2 bg-[#332e2a] text-gray-500 text-xs font-semibold rounded-xl cursor-not-allowed">Choisir un fichier</button></div>
                {errors.audio && <p className="text-[10px] text-red-400">{errors.audio}</p>}
                {uploadedFiles.length > 0 && (<div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3"><p className="text-[10px] text-emerald-400 font-bold uppercase mb-2">Fichiers prêts ({uploadedFiles.length}) :</p><div className="space-y-1">{uploadedFiles.map(f => (<div key={f.key} className="flex items-center justify-between text-xs text-emerald-300"><span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{f.key === 'cover' ? 'Cover' : f.key === 'previewMp3' ? 'Preview MP3' : f.key === 'masterWav' ? 'Master WAV' : f.key} : {f.name}</span><button type="button" onClick={() => removeFile(f.key)} className="text-red-400 hover:text-red-300"><X className="w-3 h-3" /></button></div>))}</div></div>)}
              </div>
              <div className="space-y-3 pt-2 border-t border-[#26221f]">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2"><CheckSquare className="w-4 h-4 text-[#ff6b35]" /> Licences disponibles <span className="text-[10px] text-red-400 font-normal">*</span></h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[{ id: 'mp3', name: 'MP3 Lease', price: '29.99 $' },{ id: 'wav', name: 'WAV Premium', price: '49.99 $' },{ id: 'stems', name: 'Trackout / Stems', price: '149.00 $' },{ id: 'exclusive', name: 'Exclusive Rights', price: '997.00 $' }].map(lic => (
                    <label key={lic.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedLicenses.includes(lic.id) ? 'bg-[#ff6b35]/10 border-[#ff6b35]/50' : 'bg-[#201d1a] border-[#332e2a] hover:border-gray-500'}`}>
                      <input type="checkbox" checked={selectedLicenses.includes(lic.id)} onChange={() => toggleLicense(lic.id)} className="w-4 h-4 rounded accent-[#ff6b35]" />
                      <div><span className="text-sm font-bold text-white">{lic.name}</span><p className="text-[10px] text-gray-400">{lic.price}</p></div>
                    </label>
                  ))}
                </div>
                {errors.licenses && <p className="text-[10px] text-red-400">{errors.licenses}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#26221f]">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={uploading !== null} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50">Annuler</button>
                <button type="submit" disabled={uploading !== null} className="px-6 py-2 bg-[#ff6b35] text-white rounded-xl text-xs font-semibold hover:bg-[#e05a2b] transition-colors disabled:opacity-50 flex items-center gap-2">{uploading === 'saving' ? 'Publication...' : 'Publier le Beat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}