import type { MatchEntry } from '../types';
import { clearAllHighlights, renderHighlightsFor } from './renderHighlights';

export interface ReconcileArgs {
	prevVisible: Set<number>;
	nextVisible: Set<number>;
	matchesChanged: boolean;
	matchesByParagraph: Map<number, MatchEntry[]>;
	matchToGlobalIndex: WeakMap<MatchEntry, number>;
	currentIndex: number | undefined;
	searchLayer: HTMLElement;
	editor: HTMLElement;
}

export function reconcile(args: ReconcileArgs): void {
	const {
		prevVisible,
		nextVisible,
		matchesChanged,
		matchesByParagraph,
		matchToGlobalIndex,
		currentIndex,
		searchLayer,
		editor,
	} = args;

	if (matchesChanged) {
		clearAllHighlights(searchLayer);
		renderHighlightsFor(nextVisible, matchesByParagraph, matchToGlobalIndex, currentIndex, searchLayer, editor);
		return;
	}

	const toAdd: number[] = [];
	for (const idx of nextVisible) {
		if (!prevVisible.has(idx)) toAdd.push(idx);
	}
	const toRemove: number[] = [];
	for (const idx of prevVisible) {
		if (!nextVisible.has(idx)) toRemove.push(idx);
	}

	if (toRemove.length > 0) {
		const byPg = new Map<string, Element[]>();
		for (const n of searchLayer.children) {
			const pg = (n as HTMLElement).dataset.pg;
			if (!pg) continue;
			let arr = byPg.get(pg);
			if (!arr) byPg.set(pg, (arr = []));
			arr.push(n);
		}
		for (const idx of toRemove) {
			const arr = byPg.get(String(idx));
			if (!arr) continue;
			for (const n of arr) n.remove();
		}
	}
	if (toAdd.length > 0) {
		renderHighlightsFor(toAdd, matchesByParagraph, matchToGlobalIndex, currentIndex, searchLayer, editor);
	}
}

export function applySelectedClass(currentIndex: number | undefined, searchLayer: HTMLElement): HTMLElement | null {
	for (const el of searchLayer.querySelectorAll<HTMLElement>('.highlight-selected')) {
		el.classList.remove('highlight-selected');
	}
	if (currentIndex == null) return null;
	const nodes = searchLayer.querySelectorAll<HTMLElement>(`[data-match="sm-${currentIndex}"]`);
	for (const el of nodes) el.classList.add('highlight-selected');
	return nodes.length > 0 ? nodes[0] : null;
}
