'use client';

import { useState, useEffect } from "react";
import { Beat, SoundKit, License } from "@/types";
import { defaultLicenses } from "@/constants/licenses";

async function safeFetchJson(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    if (!text.startsWith("[")) return [];
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export function useBeatData() {
  const [beatsList, setBeatsList] = useState<Beat[]>([]);
  const [kitsList, setKitsList] = useState<SoundKit[]>([]);
  const [licensesList, setLicensesList] = useState<License[]>(defaultLicenses);
  const [branding, setBranding] = useState<any>(null);

  useEffect(() => {
    fetch("/api/design")
      .then(res => res.json())
      .then(data => {
        if (data?.data?.branding) setBranding(data.data.branding);
        else if (data?.branding) setBranding(data.branding);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    const syncFromServer = async () => {
      const [beatsData, kitsData, licensesData] = await Promise.all([
        safeFetchJson("/api/beats"),
        safeFetchJson("/api/kits"),
        safeFetchJson("/api/licenses")
      ]);
      if (!isMounted) return;

      const freshBeats: Beat[] = beatsData.map((b: any) => ({
        id: b.id, title: b.title, type: b.genre || b.type || "",
        bpm: b.bpm, key: b.musical_key || b.key || "", mood: b.mood || "",
        price: b.price, cover: b.cover_url || b.cover || "",
        previewMp3: b.preview_url || b.previewMp3 || "",
        licenses_json: b.licenses_json || "[]",
        featured: b.featured === 1 || b.featured === true,
        description: b.description || "",
        visible: b.visible !== undefined ? b.visible : b.status !== "draft",
        comments: b.comments || []
      }));

      setBeatsList(freshBeats);
      setKitsList(kitsData);
      if (licensesData && licensesData.length > 0) setLicensesList(licensesData);
    };
    syncFromServer();
    // Suppression du polling en production, on charge une seule fois
    return () => { isMounted = false; };
  }, []);

  return { beatsList, kitsList, licensesList, branding };
}