import { memo } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';

interface EmptyToolsStateProps {
  query?: string;
}

function EmptyToolsStateComponent({ query }: EmptyToolsStateProps) {
  const description = query?.trim()
    ? `No results for "${query.trim()}". Try another search.`
    : 'No tools found. Try another search.';

  return (
    <EmptyState
      icon="search-outline"
      title="No tools found"
      description={description}
    />
  );
}

export const EmptyToolsState = memo(EmptyToolsStateComponent);