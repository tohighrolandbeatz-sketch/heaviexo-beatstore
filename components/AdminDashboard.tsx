"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music, 
  Sliders, 
  Link as LinkIcon, 
  Tag, 
  TrendingUp, 
  PlusCircle, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2,
  Lock,
  X,
  Package,
  ListMusic,
  Upload,
  Palette,
  RotateCcw,
  Download,
  UploadCloud,
  FileAudio,
  FolderArchive,
  Edit3
} from "lucide-react";

interface AdminDashboardProps {
  beatsList?: any[];
  setBeatsList?: (beats: any[]) => void;
  kitsList?: any[];
  setKitsList?: (kits: any[]) => void;
  licenses?: any[];
  setLicenses?: (licenses: any[]) => void;
  t?: any;
}

const defaultAdminLicenses = [
  {
    id: "mp3",
    name: "MP3 Lease",
    price: 29.99,
    features: ["Fichier MP3 320kbps", "Jusqu'à 100 000 streams", "2 500 ventes max", "1 Clip Vidéo (YouTube)", "Usage commercial autorisé"]
  },
  {
    id: "wav",
    name: "WAV Premium",
    price: 49.99,
    features: ["Fichier WAV + MP3 haute qualité", "Jusqu'à 500 000 streams", "5 000 ventes max", "2 Clips Vidéos & Radio", "Usage commercial autorisé"]
  },
  {
    id: "stems",
    name: "Trackout / Stems",
    price: 149.00,
    features: ["Toutes les pistes séparées (WAV)", "Streams illimités", "Ventes illimitées", "Clips & Radio illimités", "Liberté totale de remix"]
  },
  {
    id: "exclusive",
    name: "Exclusive Rights",
    price: 997.00,
    features: ["Propriété exclusive (Retiré du store)", "Droits et ventes illimités", "Cession totale d'exploitation", "HeavieXo conserve 100% parts auteur (BMI)"]
  }
];

export default function AdminDashboard({ 
  beatsList = [], 
  setBeatsList = () => {}, 
  kitsList = [],
  setKitsList = () => {},
  licenses: initialLicenses = defaultAdminLicenses, 
  setLicenses: parentSetLicenses = () => {}
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"catalog" | "kits" | "licenses" | "design" | "fulfillment" | "marketing" | "playlists" | "stats">("catalog");
  const [saveNotification, setSaveNotification] = useState("");
  const [licenses, setLicenses] = useState(initialLicenses.length > 0 ? initialLicenses : defaultAdminLicenses);

  const triggerSaveAlert = (message: string) => {
    setSaveNotification(message);
    setTimeout(() => setSaveNotification(""), 3000);
  };

  // États Catalogue & Beats (Genres et Moods dynamiques)
  const [genresList, setGenresList] = useState(["Dark Trap", "Melodic Drill", "Afro Trap", "Boom Bap", "Cinematic", "Trap"]);
  const [newGenreInput, setNewGenreInput] = useState("");

  const [moodsList, setMoodsList] = useState(["Dark", "Emotional", "Aggressive", "Melancholic", "Cinematic", "Energetic"]);
  const [newMoodInput, setNewMoodInput] = useState("");

  const [editingBeatId, setEditingBeatId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newBpm, setNewBpm] = useState(140);
  const [newKey, setNewKey] = useState("C Minor");
  const [newMood, setNewMood] = useState("Dark");
  const [newGenre, setNewGenre] = useState("Dark Trap");
  const [newPrice, setNewPrice] = useState(29.99);
  const [newCover, setNewCover] = useState("");
  const [newAudio, setNewAudio] = useState("");

  // États Sound Kits
  const [kitTitle, setKitTitle] = useState("");
  const [kitCategory, setKitCategory] = useState<"Drum Kit" | "Loop Kit" | "MIDI Pack" | "Preset Bank">("Drum Kit");
  const [kitPrice, setKitPrice] = useState(24.99);
  const [kitCover, setKitCover] = useState("");
  const [kitFileUrl, setKitFileUrl] = useState("");
  const [kitCount, setKitCount] = useState("100+ Samples WAV");
  const [kitFileSize, setKitFileSize] = useState("300 MB");
  const [kitDesc, setKitDesc] = useState("");

  // ==========================================
  // SYSTÈME DE PROGRESSION AVANCÉ PAR UPLOAD
  // ==========================================
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { progress: number; fileName: string; status: "uploading" | "success" | "error" } }>({});

  const uploadFileWithProgress = (file: File, key: string, onSuccess: (url: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploadProgress(prev => ({
      ...prev,
      [key]: { progress: 0, fileName: file.name, status: "uploading" }
    }));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(prev => ({
          ...prev,
          [key]: { ...prev[key], progress: percentComplete }
        }));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            setUploadProgress(prev => ({
              ...prev,
              [key]: { progress: 100, fileName: file.name, status: "success" }
            }));
            onSuccess(data.url);
            triggerSaveAlert(`Fichier "${file.name}" uploadé avec succès !`);
          } else {
            throw new Error(data.error || "Erreur serveur");
          }
        } catch (e) {
          setUploadProgress(prev => ({ ...prev, [key]: { ...prev[key], status: "error" } }));
          alert("Erreur lors de l'analyse de la réponse d'upload.");
        }
      } else {
        setUploadProgress(prev => ({ ...prev, [key]: { ...prev[key], status: "error" } }));
        alert("Erreur réseau lors de l'upload.");
      }
    };

    xhr.onerror = () => {
      setUploadProgress(prev => ({ ...prev, [key]: { ...prev[key], status: "error" } }));
      alert("Erreur de connexion lors de l'upload.");
    };

    xhr.send(formData);
  };

  // État Design System complet (contient aussi Spotify + réseaux sociaux + footer)
  const [design, setDesign] = useState<any>(null);

  // Champs temporaires pour le formulaire "Ajouter un projet Spotify"
  const [newSpotifyTitle, setNewSpotifyTitle] = useState("");
  const [newSpotifyUrl, setNewSpotifyUrl] = useState("");

  useEffect(() => {
    fetch("/api/design", { cache: "no-store" })
      .then(res => res.json())
      .then(data => setDesign(data))
      .catch(err => console.error("Erreur chargement design :", err));
  }, []);

  const handleSaveDesign = async () => {
    try {
      await fetch("/api/design", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design)
      });
      triggerSaveAlert("Sauvegardé avec succès !");
    } catch (err) {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const handleResetDesign = async () => {
    if (!confirm("Voulez-vous vraiment restaurer les valeurs par défaut ?")) return;
    try {
      const res = await fetch("/api/design", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" })
      });
      const data = await res.json();
      setDesign(data.design);
      triggerSaveAlert("Valeurs par défaut restaurées !");
    } catch (err) {
      alert("Erreur lors de la réinitialisation.");
    }
  };

  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(design, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "heaviexo-design-config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setDesign(imported);
        await fetch("/api/design", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imported)
        });
        triggerSaveAlert("Configuration importée avec succès !");
      } catch (err) {
        alert("Fichier JSON invalide.");
      }
    };
    reader.readAsText(file);
  };

  const [fulfillmentLinks, setFulfillmentLinks] = useState({
    mp3: "https://www.paypal.com/ncp/payment/ZSS69K9VHU59C",
    wav: "https://www.paypal.com/ncp/payment/8ATGLJLD9WVBC",
    stems: "https://www.paypal.com/ncp/payment/WG64S2QL5RUNL",
    exclusive: "https://www.paypal.com/ncp/payment/XU9GSXMKN2HKL"
  });

  const [promoCodes, setPromoCodes] = useState([
    { code: "HEAVIE20", discount: "20%" },
    { code: "VIPBEATS", discount: "10 $" }
  ]);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("");

  const handleAddGenre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenreInput || genresList.includes(newGenreInput)) return;
    setGenresList([...genresList, newGenreInput]);
    setNewGenre(newGenreInput);
    setNewGenreInput("");
    triggerSaveAlert("Nouveau genre ajouté !");
  };

  const handleDeleteGenre = (genreToDelete: string) => {
    if (genresList.length <= 1) {
      alert("Vous devez garder au moins un genre.");
      return;
    }
    setGenresList(genresList.filter(g => g !== genreToDelete));
    if (newGenre === genreToDelete) {
      setNewGenre(genresList.find(g => g !== genreToDelete) || "");
    }
    triggerSaveAlert("Genre supprimé !");
  };

  const handleAddMood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMoodInput || moodsList.includes(newMoodInput)) return;
    setMoodsList([...moodsList, newMoodInput]);
    setNewMood(newMoodInput);
    setNewMoodInput("");
    triggerSaveAlert("Nouveau mood ajouté !");
  };

  const handleDeleteMood = (moodToDelete: string) => {
    if (moodsList.length <= 1) {
      alert("Vous devez garder au moins un mood.");
      return;
    }
    setMoodsList(moodsList.filter(m => m !== moodToDelete));
    if (newMood === moodToDelete) {
      setNewMood(moodsList.find(m => m !== moodToDelete) || "");
    }
    triggerSaveAlert("Mood supprimé !");
  };

  const handleStartEditBeat = (beat: any) => {
    setEditingBeatId(beat.id);
    setNewTitle(beat.title || "");
    setNewGenre(beat.genre || beat.type || genresList[0]);
    setNewPrice(beat.price || 29.99);
    setNewBpm(beat.bpm || 140);
    setNewKey(beat.key || beat.musicalKey || "C Minor");
    setNewMood(beat.mood || moodsList[0]);
    setNewCover(beat.cover || "");
    setNewAudio(beat.previewMp3 || beat.audioUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBeatId(null);
    setNewTitle("");
    setNewCover("");
    setNewAudio("");
  };

  const handleAddBeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      if (editingBeatId) {
        const res = await fetch(`/api/beats/${editingBeatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle, 
            type: newGenre, 
            genre: newGenre,
            bpm: newBpm, 
            key: newKey, 
            musicalKey: newKey,
            mood: newMood,
            price: newPrice,
            basicPrice: newPrice,
            cover: newCover,
            audioUrl: newAudio,
            previewMp3: newAudio
          })
        });
        if (!res.ok) throw new Error("Erreur modification");
        const updatedBeat = await res.json();
        setBeatsList(beatsList.map(b => b.id === editingBeatId ? updatedBeat : b));
        setEditingBeatId(null);
        triggerSaveAlert("Beat modifié avec succès !");
      } else {
        const res = await fetch("/api/beats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle, 
            type: newGenre, 
            genre: newGenre,
            bpm: newBpm, 
            key: newKey, 
            musicalKey: newKey,
            mood: newMood,
            price: newPrice,
            basicPrice: newPrice,
            cover: newCover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80",
            audioUrl: newAudio,
            previewMp3: newAudio
          })
        });
        if (!res.ok) throw new Error("Erreur serveur");
        const savedBeat = await res.json();
        setBeatsList([savedBeat, ...beatsList]);
        triggerSaveAlert("Beat publié avec succès !");
      }

      setNewTitle(""); 
      setNewCover(""); 
      setNewAudio("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du beat.");
    }
  };

  const handleAddKit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitTitle) return;
    try {
      const res = await fetch("/api/kits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: kitTitle, 
          category: kitCategory, 
          price: kitPrice,
          cover: kitCover || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80",
          fileUrl: kitFileUrl,
          itemCount: kitCount, 
          fileSize: kitFileSize, 
          description: kitDesc
        })
      });
      const savedKit = await res.json();
      setKitsList([savedKit, ...kitsList]);
      setKitTitle(""); setKitCover(""); setKitFileUrl(""); setKitDesc("");
      triggerSaveAlert("Sound Kit ajouté avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du Sound Kit.");
    }
  };

  const toggleBeatVisibility = async (id: string) => {
    const beat = beatsList.find((b) => b.id === id);
    if (!beat) return;
    const newVisible = beat.visible === false ? true : false;
    setBeatsList(beatsList.map(b => b.id === id ? { ...b, visible: newVisible } : b));
    await fetch(`/api/beats/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: newVisible })
    });
  };

  const handleDeleteBeat = async (id: string) => {
    setBeatsList(beatsList.filter(b => b.id !== id));
    await fetch(`/api/beats/${id}`, { method: "DELETE" });
  };

  const handleDeleteKit = async (id: string) => {
    setKitsList(kitsList.filter(k => k.id !== id));
    await fetch(`/api/kits/${id}`, { method: "DELETE" });
  };

  const totalBeatsCount = beatsList?.length || 0;
  const totalKitsCount = kitsList?.length || 0;
  const estimatedCatalogValue = beatsList?.reduce((acc, b) => acc + (b.price || 0), 0).toFixed(2) || "0.00";

  // Composant réutilisable pour afficher la barre de progression d'un upload
  const renderUploadProgressIndicator = (uploadKey: string) => {
    const info = uploadProgress[uploadKey];
    if (!info) return null;

    return (
      <div className="mt-2 space-y-1 bg-[#161311] border border-white/10 p-3 rounded-xl">
        <div className="flex justify-between text-xs">
          <span className="font-mono text-[#F4F0EB] truncate max-w-[220px]" title={info.fileName}>
            📄 {info.fileName}
          </span>
          <span className="font-bold">
            {info.status === "uploading" && `${info.progress}%`}
            {info.status === "success" && <strong className="text-green-400">Terminé ✓</strong>}
            {info.status === "error" && <strong className="text-red-400">Échec ❌</strong>}
          </span>
        </div>
        <div className="w-full bg-[#29201C] h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${info.status === "success" ? "bg-green-500" : info.status === "error" ? "bg-red-500" : "bg-[#C66B3D]"}`}
            style={{ width: `${info.progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#161311] text-[#F4F0EB] px-4 md:px-8 py-24 space-y-8 font-sans relative selection:bg-[#C66B3D] selection:text-white">
      <AnimatePresence>
        {saveNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-[#C66B3D] text-white font-extrabold px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs uppercase tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] font-extrabold text-[#C66B3D] uppercase tracking-widest flex items-center space-x-1.5">
            <Lock className="w-3 h-3" />
            <span>ESPACE PRIVÉ - HEAVIEX'O</span>
          </span>
          <h1 className="text-3xl font-black text-[#F4F0EB] uppercase tracking-tight">Control Center</h1>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#29201C] p-1.5 rounded-2xl border border-white/10 text-xs font-bold shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <button onClick={() => setActiveTab("catalog")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "catalog" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <Music className="w-3.5 h-3.5" /><span>Catalogue</span>
          </button>
          <button onClick={() => setActiveTab("kits")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "kits" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <Package className="w-3.5 h-3.5" /><span>Sound Kits</span>
          </button>
          <button onClick={() => setActiveTab("licenses")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "licenses" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <Sliders className="w-3.5 h-3.5" /><span>Licences & Prix</span>
          </button>
          <button onClick={() => setActiveTab("design")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "design" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <Palette className="w-3.5 h-3.5" /><span>Design System</span>
          </button>
          <button onClick={() => setActiveTab("fulfillment")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "fulfillment" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <LinkIcon className="w-3.5 h-3.5" /><span>Liens & Paiements</span>
          </button>
          <button onClick={() => setActiveTab("marketing")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "marketing" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <Tag className="w-3.5 h-3.5" /><span>Promo & SEO</span>
          </button>
          <button onClick={() => setActiveTab("playlists")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "playlists" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <ListMusic className="w-3.5 h-3.5" /><span>Playlist Spotify</span>
          </button>
          <button onClick={() => setActiveTab("stats")} className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${activeTab === "stats" ? "bg-[#C66B3D] text-white shadow-lg shadow-[#C66B3D]/30" : "text-[#C2B9B0] hover:text-[#F4F0EB]"}`}>
            <TrendingUp className="w-3.5 h-3.5" /><span>Statistiques</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {activeTab === "catalog" && (
          <div className="space-y-8 animate-fadeIn">
            {/* GESTION DES GENRES MUSICAUX */}
            <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
              <h3 className="text-sm font-bold text-[#C66B3D] uppercase tracking-wider">Gestion des Genres musicaux</h3>
              <form onSubmit={handleAddGenre} className="flex gap-3">
                <input type="text" placeholder="Nouveau genre..." value={newGenreInput} onChange={(e) => setNewGenreInput(e.target.value)} className="flex-1 bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                <button type="submit" className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase shadow-md shadow-[#C66B3D]/30">Ajouter Genre</button>
              </form>
              <div className="flex flex-wrap gap-2 pt-1">
                {genresList.map((g, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-[#1C1714] border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                    <span className="font-bold text-[#F4F0EB]">{g}</span>
                    <button type="button" onClick={() => handleDeleteGenre(g)} className="text-[#9E938B] hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* GESTION DES MOODS */}
            <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
              <h3 className="text-sm font-bold text-[#C66B3D] uppercase tracking-wider">Gestion des Moods</h3>
              <form onSubmit={handleAddMood} className="flex gap-3">
                <input type="text" placeholder="Nouveau mood..." value={newMoodInput} onChange={(e) => setNewMoodInput(e.target.value)} className="flex-1 bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                <button type="submit" className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase shadow-md shadow-[#C66B3D]/30">Ajouter Mood</button>
              </form>
              <div className="flex flex-wrap gap-2 pt-1">
                {moodsList.map((m, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-[#1C1714] border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                    <span className="font-bold text-[#F4F0EB]">{m}</span>
                    <button type="button" onClick={() => handleDeleteMood(m)} className="text-[#9E938B] hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AJOUTER / MODIFIER UN BEAT */}
            <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <PlusCircle className="w-5 h-5 text-[#C66B3D]" />
                  <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">
                    {editingBeatId ? "Modifier le Beat" : "Ajouter un nouveau beat"}
                  </h3>
                </div>
                {editingBeatId && (
                  <button onClick={handleCancelEdit} className="text-xs text-[#C2B9B0] hover:text-[#F4F0EB] underline">
                    Annuler l'édition
                  </button>
                )}
              </div>
              <form onSubmit={handleAddBeat} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Titre du Beat</label>
                    <input type="text" placeholder="ex: Black Phantom" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Genre / Style</label>
                    <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]">
                      {genresList.map((g) => (<option key={g} value={g}>{g}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Prix de base ($)</label>
                    <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">BPM</label>
                    <input type="number" value={newBpm} onChange={(e) => setNewBpm(Number(e.target.value))} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Gamme / Key</label>
                    <input type="text" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Mood</label>
                    <select value={newMood} onChange={(e) => setNewMood(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]">
                      {moodsList.map((m) => (<option key={m} value={m}>{m}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Image Cover (Uploader)</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 bg-[#1C1714] hover:bg-[#221B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#C2B9B0] flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-[#C66B3D]" />
                        <span>{newCover ? "Changer image ✓" : "Choisir image"}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadFileWithProgress(file, "beatCover", (url) => setNewCover(url));
                          }} 
                          className="hidden" 
                        />
                      </label>
                      {newCover && <img src={newCover} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-[#C66B3D]/50" />}
                    </div>
                    {renderUploadProgressIndicator("beatCover")}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Fichier Audio MP3 / WAV (Uploader)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 bg-[#1C1714] hover:bg-[#221B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#C2B9B0] flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                      <FileAudio className="w-4 h-4 text-[#C66B3D]" />
                      <span>{newAudio ? "Changer l'audio ✓" : "Choisir un fichier Audio"}</span>
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadFileWithProgress(file, "beatAudio", (url) => setNewAudio(url));
                        }} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {renderUploadProgressIndicator("beatAudio")}
                </div>

                <button type="submit" className="w-full bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C66B3D]/30">
                  {editingBeatId ? "Mettre à jour le Beat" : "Publier sur le Store"}
                </button>
              </form>
            </div>

            {/* CATALOGUE ACTUEL */}
            <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
              <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Catalogue Actuel ({totalBeatsCount} Beats)</h3>
              <div className="space-y-3">
                {beatsList?.map((beat) => (
                  <div key={beat.id} className="flex items-center justify-between p-4 bg-[#1C1714] border border-white/10 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <img src={beat.cover} alt={beat.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-sm text-[#F4F0EB]">{beat.title}</h4>
                        <p className="text-xs text-[#C2B9B0]">{beat.type} • {beat.bpm} BPM • <strong className="text-[#C66B3D]">${beat.price}</strong></p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => toggleBeatVisibility(beat.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 ${beat.visible !== false ? "bg-[#C66B3D]/20 text-[#C66B3D] border border-[#C66B3D]/30" : "bg-[#221B17] text-[#9E938B]"}`}>
                        {beat.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{beat.visible !== false ? "Visible" : "Masqué"}</span>
                      </button>
                      <button onClick={() => handleStartEditBeat(beat)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl" title="Modifier">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBeat(beat.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "kits" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
              <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
                <Package className="w-5 h-5 text-[#C66B3D]" />
                <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Ajouter un Sound Kit / Loop Pack</h3>
              </div>
              <form onSubmit={handleAddKit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Titre du Kit</label>
                    <input type="text" placeholder="ex: OBSIDIAN Drumkit" value={kitTitle} onChange={(e) => setKitTitle(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Catégorie</label>
                    <select value={kitCategory} onChange={(e) => setKitCategory(e.target.value as any)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]">
                      <option value="Drum Kit">Drum Kit</option>
                      <option value="Loop Kit">Loop Kit</option>
                      <option value="MIDI Pack">MIDI Pack</option>
                      <option value="Preset Bank">Preset Bank</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Prix ($)</label>
                    <input type="number" step="0.01" value={kitPrice} onChange={(e) => setKitPrice(Number(e.target.value))} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Nombre d'éléments</label>
                    <input type="text" value={kitCount} onChange={(e) => setKitCount(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Taille du fichier</label>
                    <input type="text" value={kitFileSize} onChange={(e) => setKitFileSize(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Image Cover</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 bg-[#1C1714] hover:bg-[#221B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#C2B9B0] flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-[#C66B3D]" />
                        <span>{kitCover ? "Image OK ✓" : "Choisir image"}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadFileWithProgress(file, "kitCover", (url) => setKitCover(url));
                          }} 
                          className="hidden" 
                        />
                      </label>
                      {kitCover && <img src={kitCover} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-[#C66B3D]/50" />}
                    </div>
                    {renderUploadProgressIndicator("kitCover")}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Fichier Archive du Kit (ZIP / RAR - Uploader)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 bg-[#1C1714] hover:bg-[#221B17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#C2B9B0] flex items-center justify-center space-x-2 cursor-pointer transition-colors">
                      <FolderArchive className="w-4 h-4 text-[#C66B3D]" />
                      <span>{kitFileUrl ? "Archive ZIP OK ✓" : "Choisir le fichier ZIP / RAR"}</span>
                      <input 
                        type="file" 
                        accept=".zip,.rar,.7z" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadFileWithProgress(file, "kitFile", (url) => setKitFileUrl(url));
                        }} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {renderUploadProgressIndicator("kitFile")}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#C2B9B0] block mb-1.5">Description</label>
                  <textarea rows={2} value={kitDesc} onChange={(e) => setKitDesc(e.target.value)} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] focus:outline-none focus:border-[#C66B3D]" />
                </div>
                <button type="submit" className="w-full bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#C66B3D]/30">Ajouter le Sound Kit</button>
              </form>
            </div>

            <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-4">
              <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Sound Kits Actuels ({totalKitsCount})</h3>
              <div className="space-y-3">
                {kitsList?.map((kit) => (
                  <div key={kit.id} className="flex items-center justify-between p-4 bg-[#1C1714] border border-white/10 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <img src={kit.cover} alt={kit.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-sm text-[#F4F0EB]">{kit.title}</h4>
                        <p className="text-xs text-[#C2B9B0]">{kit.category} • <strong className="text-[#C66B3D]">${kit.price}</strong></p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteKit(kit.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "licenses" && (
          <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <Sliders className="w-5 h-5 text-[#C66B3D]" />
                <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Gestion des Licences & Prix</h3>
              </div>
              <button onClick={async () => {
                try {
                  const res = await fetch("/api/licenses", { 
                    method: "PUT", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify(licenses) 
                  });
                  if (res.ok) {
                    parentSetLicenses(licenses);
                    triggerSaveAlert("Licences sauvegardées avec succès !");
                  } else {
                    alert("Erreur lors de la sauvegarde.");
                  }
                } catch (err) {
                  alert("Erreur réseau lors de la sauvegarde.");
                }
              }} className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase flex items-center space-x-2 shadow-md shadow-[#C66B3D]/30">
                <Save className="w-4 h-4" /><span>Sauvegarder</span>
              </button>
            </div>
            <div className="space-y-6">
              {licenses?.map((lic, index) => (
                <div key={lic.id} className="p-6 bg-[#1C1714] border border-white/10 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#9E938B] block mb-1">Nom de la Licence</label>
                      <input 
                        type="text" 
                        value={lic.name} 
                        onChange={(e) => {
                          const updated = [...licenses]; 
                          updated[index].name = e.target.value; 
                          setLicenses(updated);
                        }} 
                        className="w-full bg-[#161311] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB] font-bold focus:outline-none focus:border-[#C66B3D]" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#9E938B] block mb-1">Prix ($)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={lic.price} 
                        onChange={(e) => {
                          const updated = [...licenses]; 
                          updated[index].price = parseFloat(e.target.value) || 0; 
                          setLicenses(updated);
                        }} 
                        className="w-full bg-[#161311] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#C66B3D] font-mono font-bold focus:outline-none focus:border-[#C66B3D]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-[#9E938B] block mb-1">Fonctionnalités / Termes (séparés par des virgules)</label>
                    <textarea 
                      rows={2}
                      value={Array.isArray(lic.features) ? lic.features.join(", ") : lic.features} 
                      onChange={(e) => {
                        const updated = [...licenses];
                        updated[index].features = e.target.value.split(",").map((f: string) => f.trim());
                        setLicenses(updated);
                      }} 
                      className="w-full bg-[#161311] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#C2B9B0] focus:outline-none focus:border-[#C66B3D] font-mono" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "design" && (
          <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-[#C66B3D]" />
                <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Design System Complet</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleExportConfig} className="bg-[#1C1714] hover:bg-[#221B17] text-[#C2B9B0] font-bold px-4 py-2.5 rounded-xl text-xs uppercase flex items-center space-x-1.5 border border-white/10">
                  <Download className="w-3.5 h-3.5" /><span>Exporter</span>
                </button>
                <label className="bg-[#1C1714] hover:bg-[#221B17] text-[#C2B9B0] font-bold px-4 py-2.5 rounded-xl text-xs uppercase flex items-center space-x-1.5 border border-white/10 cursor-pointer">
                  <UploadCloud className="w-3.5 h-3.5" /><span>Importer</span>
                  <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" />
                </label>
                <button onClick={handleResetDesign} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2.5 rounded-xl text-xs uppercase flex items-center space-x-1.5 border border-red-500/20">
                  <RotateCcw className="w-3.5 h-3.5" /><span>Réinitialiser</span>
                </button>
                <button onClick={handleSaveDesign} className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 shadow-md shadow-[#C66B3D]/30">
                  <Save className="w-4 h-4" /><span>Sauvegarder</span>
                </button>
              </div>
            </div>

            {!design ? (
              <div className="text-center py-12 text-[#9E938B]">Chargement du Design System...</div>
            ) : (
              <div className="space-y-8">
                {/* 🎤 GESTION DES ARTISTES DE LA BANDE DÉFILANTE */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-black text-[#C66B3D] uppercase tracking-widest border-l-2 border-[#C66B3D] pl-3">🎤 Artistes (Bande Défilante)</h4>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Nom de l'artiste..." 
                      id="newArtistInput"
                      className="flex-1 bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB]" 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        const input = document.getElementById("newArtistInput") as HTMLInputElement;
                        if (!input || !input.value.trim()) return;
                        const currentArtists = design.artists || [];
                        const updatedArtists = [...currentArtists, input.value.trim()];
                        setDesign({ ...design, artists: updatedArtists });
                        input.value = "";
                        triggerSaveAlert("Artiste ajouté ! Pensez à sauvegarder.");
                      }}
                      className="bg-[#C66B3D] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase shadow-md shadow-[#C66B3D]/30"
                    >
                      Ajouter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {design.artists?.map((artist: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 bg-[#1C1714] border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                        <span className="font-bold text-[#F4F0EB]">{artist}</span>
                        <button 
                          type="button"
                          onClick={() => {
                            const updatedArtists = design.artists.filter((_: any, i: number) => i !== idx);
                            setDesign({ ...design, artists: updatedArtists });
                          }}
                          className="text-[#9E938B] hover:text-red-400 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ⚡ PRESETS DE THÈMES */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-black text-[#C66B3D] uppercase tracking-widest border-l-2 border-[#C66B3D] pl-3">⚡ Presets de Thèmes Globaux</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {["Modern", "Luxury", "Noir", "Spotify", "BeatStars"].map((presetName) => (
                      <button
                        key={presetName}
                        type="button"
                        onClick={async () => {
                          const res = await fetch("/api/design", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "preset", presetName })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setDesign(data.design);
                            triggerSaveAlert(`Preset ${presetName} appliqué !`);
                          }
                        }}
                        className="bg-[#1C1714] hover:bg-[#C66B3D]/20 border border-white/10 hover:border-[#C66B3D] p-3 rounded-xl text-xs font-bold text-center transition-all uppercase tracking-wider text-[#F4F0EB]"
                      >
                        {presetName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1. BRANDING */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-black text-[#C66B3D] uppercase tracking-widest border-l-2 border-[#C66B3D] pl-3">🎨 Branding</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">Nom du site</label>
                      <input type="text" value={design.branding?.siteName || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, siteName: e.target.value } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">Sous-titre / Slogan</label>
                      <input type="text" value={design.branding?.subtitle || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, subtitle: e.target.value } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">WhatsApp (numéro sans le +)</label>
                      <input type="text" value={design.branding?.whatsapp || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, whatsapp: e.target.value } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">Email</label>
                      <input type="email" value={design.branding?.email || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, email: e.target.value } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">Footer Text</label>
                    <textarea rows={2} value={design.branding?.footerText || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, footerText: e.target.value } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">Mention Copyright</label>
                    <input type="text" value={design.branding?.copyright || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, copyright: e.target.value } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                  </div>
                </div>

                {/* 📱 RÉSEAUX SOCIAUX */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-black text-[#C66B3D] uppercase tracking-widest border-l-2 border-[#C66B3D] pl-3">📱 Réseaux Sociaux</h4>
                  <p className="text-xs text-[#9E938B]">Colle ici les liens complets vers tes profils (ex: https://instagram.com/tonpseudo). Laisse vide pour masquer l'icône.</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">Instagram</label>
                      <input type="text" placeholder="https://instagram.com/..." value={design.branding?.socials?.instagram || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, socials: { ...design.branding?.socials, instagram: e.target.value } } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">YouTube</label>
                      <input type="text" placeholder="https://youtube.com/@..." value={design.branding?.socials?.youtube || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, socials: { ...design.branding?.socials, youtube: e.target.value } } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#C2B9B0] block mb-1">Telegram</label>
                      <input type="text" placeholder="https://t.me/..." value={design.branding?.socials?.telegram || ""} onChange={(e) => setDesign({ ...design, branding: { ...design.branding, socials: { ...design.branding?.socials, telegram: e.target.value } } })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F0EB]" />
                    </div>
                  </div>
                </div>

                {/* 2. COULEURS */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-black text-[#C66B3D] uppercase tracking-widest border-l-2 border-[#C66B3D] pl-3">🌈 Couleurs (Color Picker)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {design.colors && Object.keys(design.colors).map((colorKey) => (
                      <div key={colorKey} className="bg-[#1C1714] border border-white/10 p-3 rounded-2xl space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#C2B9B0] block">{colorKey}</label>
                        <div className="flex items-center space-x-2">
                          <input type="color" value={design.colors[colorKey] || "#000000"} onChange={(e) => setDesign({ ...design, colors: { ...design.colors, [colorKey]: e.target.value } })} className="w-10 h-10 bg-transparent border-0 rounded-lg cursor-pointer" />
                          <input type="text" value={design.colors[colorKey] || ""} onChange={(e) => setDesign({ ...design, colors: { ...design.colors, [colorKey]: e.target.value } })} className="flex-1 bg-[#161311] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F4F0EB] font-mono" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "fulfillment" && (
          <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Liens de Paiement & Livraison Automatique</h3>
            <div className="space-y-4">
              {Object.keys(fulfillmentLinks).map((key) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#C2B9B0] block">Lien PayPal ({key.toUpperCase()})</label>
                  <input type="text" value={(fulfillmentLinks as any)[key]} onChange={(e) => setFulfillmentLinks({ ...fulfillmentLinks, [key]: e.target.value })} className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB] font-mono" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "marketing" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
              <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Codes Promo</h3>
              <div className="flex gap-3">
                <input type="text" placeholder="Code" value={newPromoCode} onChange={(e) => setNewPromoCode(e.target.value)} className="flex-1 bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB] uppercase" />
                <input type="text" placeholder="Remise" value={newPromoDiscount} onChange={(e) => setNewPromoDiscount(e.target.value)} className="w-40 bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB]" />
                <button onClick={() => { if (!newPromoCode) return; setPromoCodes([...promoCodes, { code: newPromoCode.toUpperCase(), discount: newPromoDiscount }]); setNewPromoCode(""); setNewPromoDiscount(""); }} className="bg-[#C66B3D] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase shadow-md shadow-[#C66B3D]/30">Ajouter</button>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {promoCodes.map((p, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-[#1C1714] border border-white/10 px-4 py-2 rounded-xl text-xs">
                    <span className="font-black text-[#C66B3D]">{p.code}</span>
                    <span className="text-[#C2B9B0]">(-{p.discount})</span>
                    <button onClick={() => setPromoCodes(promoCodes.filter((_, i) => i !== idx))} className="text-[#9E938B] hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Gestion des Embeds Spotify & Collaborations</h3>
              <button onClick={handleSaveDesign} className="bg-[#C66B3D] hover:bg-[#D97746] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase flex items-center space-x-2 shadow-md shadow-[#C66B3D]/30">
                <Save className="w-4 h-4" /><span>Sauvegarder</span>
              </button>
            </div>

            {!design ? (
              <div className="text-center py-12 text-[#9E938B]">Chargement...</div>
            ) : (
              <>
                <p className="text-xs text-[#C2B9B0]">
                  Colle ici un lien de partage Spotify classique (ex: https://open.spotify.com/playlist/XXXX). Il sera automatiquement converti en lecteur intégré sur le site.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#C2B9B0] block mb-1">Lien de la Playlist / Album Principal</label>
                    <input 
                      type="text" 
                      value={design.spotify?.mainEmbedUrl || ""} 
                      onChange={(e) => setDesign({ ...design, spotify: { ...design.spotify, mainEmbedUrl: e.target.value } })} 
                      className="w-full bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB] font-mono" 
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="text-sm font-bold text-[#C66B3D] uppercase tracking-wider">Ajouter un projet / single majeur (collab artiste)</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        placeholder="Nom du projet (ex: Single avec Guen)" 
                        value={newSpotifyTitle}
                        onChange={(e) => setNewSpotifyTitle(e.target.value)}
                        className="flex-1 bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB]" 
                      />
                      <input 
                        type="text" 
                        placeholder="Lien de partage Spotify (piste, single ou album)" 
                        value={newSpotifyUrl}
                        onChange={(e) => setNewSpotifyUrl(e.target.value)}
                        className="flex-1 bg-[#1C1714] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F4F0EB] font-mono" 
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (!newSpotifyTitle || !newSpotifyUrl) return;
                          const currentProjects = design.spotify?.projects || [];
                          setDesign({
                            ...design,
                            spotify: {
                              ...design.spotify,
                              projects: [...currentProjects, { title: newSpotifyTitle, url: newSpotifyUrl }]
                            }
                          });
                          setNewSpotifyTitle("");
                          setNewSpotifyUrl("");
                          triggerSaveAlert("Projet ajouté ! Pensez à sauvegarder.");
                        }}
                        className="bg-[#C66B3D] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase shadow-md shadow-[#C66B3D]/30"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2B9B0]">Projets enregistrés ({(design.spotify?.projects || []).length})</h4>
                    {(design.spotify?.projects || []).map((proj: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#1C1714] border border-white/10 rounded-xl text-xs">
                        <span className="font-bold text-[#F4F0EB]">{proj.title}</span>
                        <button 
                          onClick={() => {
                            const updatedProjects = design.spotify.projects.filter((_: any, i: number) => i !== idx);
                            setDesign({ ...design, spotify: { ...design.spotify, projects: updatedProjects } });
                          }}
                          className="text-[#9E938B] hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="bg-[#29201C]/70 border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#F4F0EB] uppercase tracking-wider">Statistiques Globales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-[#1C1714] border border-white/10 rounded-2xl space-y-2">
                <span className="text-xs text-[#C2B9B0] font-bold uppercase">Beats Actifs</span>
                <span className="text-4xl font-black text-[#F4F0EB]">{totalBeatsCount}</span>
              </div>
              <div className="p-6 bg-[#1C1714] border border-white/10 rounded-2xl space-y-2">
                <span className="text-xs text-[#C2B9B0] font-bold uppercase">Sound Kits</span>
                <span className="text-4xl font-black text-[#F4F0EB]">{totalKitsCount}</span>
              </div>
              <div className="p-6 bg-[#1C1714] border border-white/10 rounded-2xl space-y-2">
                <span className="text-xs text-[#C2B9B0] font-bold uppercase">Valeur Catalogue</span>
                <span className="text-4xl font-black text-[#C66B3D]">${estimatedCatalogValue}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}