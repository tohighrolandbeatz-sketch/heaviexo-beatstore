'use client';

import { useEffect } from 'react';

export function useTracking(beatId?: string) {
  useEffect(() => {
    const track = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: beatId ? 'beat_view' : 'page_view',
            beatId: beatId || null,
            path: window.location.pathname,
            referer: document.referrer || 'direct',
          }),
        });
      } catch (e) {}
    };
    track();
  }, [beatId]);
}
