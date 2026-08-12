import { useCallback, useEffect, useRef } from 'react';
import { getToolById } from '@/constants/tools';
import { showInterstitialAfterAction } from '@/features/ads/interstitialAd';
import { useToolStore } from '@/store/useToolStore';

/**
 * Track a completed tool action (history + interstitial).
 * Call only after a deliberate success — never on every keystroke.
 */
export function useToolTracking(toolId: string) {
  const addHistoryEntry = useToolStore((s) => s.addHistoryEntry);

  return useCallback(
    (summary?: string) => {
      const tool = getToolById(toolId);
      if (!tool) {
        return;
      }
      addHistoryEntry({ toolId, summary });
      showInterstitialAfterAction();
    },
    [addHistoryEntry, toolId],
  );
}

/**
 * Debounced track for live calculators: fires once after the user stops editing.
 * Skips the initial mount so opening a tool does not count as an action.
 */
export function useDebouncedToolTracking(toolId: string, delayMs = 1600) {
  const trackAction = useToolTracking(toolId);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasUserEditedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const markEdited = useCallback(() => {
    hasUserEditedRef.current = true;
  }, []);

  const scheduleTrack = useCallback(
    (summary?: string) => {
      if (!hasUserEditedRef.current) {
        return;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        trackAction(summary);
      }, delayMs);
    },
    [delayMs, trackAction],
  );

  return { markEdited, scheduleTrack, trackAction };
}
