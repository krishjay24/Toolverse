import { getToolById } from '@/constants/tools';
import { showInterstitialAfterAction } from '@/features/ads/interstitialAd';
import { useToolStore } from '@/store/useToolStore';

export function useToolTracking(toolId: string) {
  const addHistoryEntry = useToolStore((s) => s.addHistoryEntry);

  return (summary?: string) => {
    const tool = getToolById(toolId);
    if (!tool) {
      return;
    }
    addHistoryEntry({ toolId, summary });
    showInterstitialAfterAction();
  };
}
