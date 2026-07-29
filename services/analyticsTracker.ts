export type AnalyticsEventType = 
  | 'page_view'
  | 'beat_play'
  | 'pause'
  | 'finish'
  | 'add_to_cart'
  | 'favorite'
  | 'purchase'
  | 'download';

export const trackEvent = async (eventType: AnalyticsEventType, additionalData?: { beat_id?: string; url?: string }) => {
  try {
    // Exécution asymétrique pour ne jamais bloquer l'expérience utilisateur UI
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: eventType,
        url: additionalData?.url || window.location.href,
        referrer: document.referrer || '',
        beat_id: additionalData?.beat_id || null,
      }),
    }).catch((err) => {
      console.error('Erreur réseau analytics:', err);
    });
  } catch (error) {
    console.error('Erreur tracking analytics:', error);
  }
};