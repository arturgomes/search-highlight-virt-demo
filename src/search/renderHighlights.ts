import type { MatchEntry } from '../types';
import { getMatchRects } from './getRects';

export function renderHighlightsFor(
	paragraphIndices: Iterable<number>,
	matchesByParagraph: Map<number, MatchEntry[]>,
	matchToGlobalIndex: WeakMap<MatchEntry, number>,
	currentIndex: number | undefined,
	searchLayer: HTMLElement,
	editor: HTMLElement,
): void {
	const fragment = document.createDocumentFragment();
	const parentRect = editor.getBoundingClientRect();
	const range = document.createRange();
	let appended = false;
	for (const idx of paragraphIndices) {
		const matches = matchesByParagraph.get(idx);
		if (!matches) continue;
		for (const m of matches) {
			const rects = getMatchRects(m.paragraphIndex, m.startIndex, m.endIndex, parentRect, range);
			if (rects.length === 0) continue;
			const globalIdx = matchToGlobalIndex.get(m) ?? 0;
			const isSelected = globalIdx === currentIndex;
			for (const r of rects) {
				const el = document.createElement('div');
				el.className = isSelected ? 'highlight highlight-selected' : 'highlight';
				el.style.position = 'absolute';
				el.style.left = `${r.x}px`;
				el.style.top = `${r.y}px`;
				el.style.width = `${r.width}px`;
				el.style.height = `${r.height}px`;
				el.dataset.pg = String(idx);
				el.dataset.match = `sm-${globalIdx}`;
				fragment.appendChild(el);
				appended = true;
			}
		}
	}
	if (appended) searchLayer.appendChild(fragment);
}

export function clearAllHighlights(searchLayer: HTMLElement): void {
	searchLayer.replaceChildren();
}
