import { useEffect, useState } from 'react';
import { STATS_FRAME_INTERVAL_MS } from '../constants';
import { getEditorRef } from '../dom/editorRefs';
import { useSearchInputStore } from '../stores/searchInputStore';
import { useSearchResultsStore } from '../stores/searchResultsStore';
import { useVisibleStore } from '../stores/visibleStore';

export interface Stats {
	visibleCount: number;
	overlayCount: number;
	lastSearchMs: number | undefined;
}

const IDLE_STATS: Stats = { visibleCount: 0, overlayCount: 0, lastSearchMs: undefined };

export function useFrameStats(): Stats {
	const [stats, setStats] = useState<Stats>(IDLE_STATS);
	const queryActive = useSearchInputStore(s => s.query !== '');
	const hasMatches = useSearchResultsStore(s => s.currentMatches.length > 0);
	const active = queryActive || hasMatches;

	useEffect(() => {
		if (!active) return;
		let rafId: number;
		let lastTick = 0;
		const tick = (now: number) => {
			rafId = requestAnimationFrame(tick);
			if (now - lastTick < STATS_FRAME_INTERVAL_MS) return;
			lastTick = now;
			const layer = getEditorRef('searchLayer');
			const overlayCount = layer ? layer.children.length : 0;
			const visibleCount = useVisibleStore.getState().visible.size;
			const startedAt = useSearchResultsStore.getState().searchStartedAt;
			const lastSearchMs = startedAt != null ? Math.round(performance.now() - startedAt) : undefined;
			setStats(prev =>
				prev.visibleCount === visibleCount && prev.overlayCount === overlayCount && prev.lastSearchMs === lastSearchMs
					? prev
					: { visibleCount, overlayCount, lastSearchMs },
			);
		};
		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
	}, [active]);

	return active ? stats : IDLE_STATS;
}
