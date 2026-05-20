import { useLayoutEffect, useMemo, useRef } from 'react';
import { getEditorRef } from '../dom/editorRefs';
import { applySelectedClass, reconcile } from '../search/reconcileHighlights';
import { clearAllHighlights } from '../search/renderHighlights';
import { bucketByParagraph } from '../search/searchEngine';
import { useLayoutStore } from '../stores/layoutStore';
import { useParagraphStore } from '../stores/paragraphStore';
import { useSearchInputStore } from '../stores/searchInputStore';
import { useSearchResultsStore } from '../stores/searchResultsStore';
import { useVisibleStore } from '../stores/visibleStore';
import type { MatchEntry } from '../types';

function buildNextVisible(virtualizeOn: boolean, visible: Set<number>, paragraphCount: number): Set<number> {
	if (virtualizeOn) return visible;
	const all = new Set<number>();
	for (let i = 0; i < paragraphCount; i++) all.add(i);
	return all;
}

interface PrevState {
	visible: Set<number>;
	matches: MatchEntry[] | null;
	virt: boolean;
	force: number;
}

export function useSearchEffect(): void {
	const currentMatches = useSearchResultsStore(s => s.currentMatches);
	const currentIndex = useSearchResultsStore(s => s.currentIndex);
	const virtualizeOn = useSearchInputStore(s => s.virtualizeOn);
	const forceRerender = useLayoutStore(s => s.dirtyVersion);
	const visible = useVisibleStore(s => s.visible);
	const paragraphCount = useParagraphStore(s => s.paragraphs.length);

	const matchesByParagraph = useMemo(() => bucketByParagraph(currentMatches), [currentMatches]);
	const matchToGlobalIndex = useMemo(() => {
		const map = new WeakMap<MatchEntry, number>();
		for (let i = 0; i < currentMatches.length; i++) map.set(currentMatches[i], i);
		return map;
	}, [currentMatches]);

	const prev = useRef<PrevState>({
		visible: new Set(),
		matches: null,
		virt: virtualizeOn,
		force: forceRerender,
	});

	useLayoutEffect(() => {
		const editor = getEditorRef('editor');
		const searchLayer = getEditorRef('searchLayer');
		if (!editor || !searchLayer) return;

		if (currentMatches.length === 0) {
			clearAllHighlights(searchLayer);
			prev.current = { visible: new Set(), matches: currentMatches, virt: virtualizeOn, force: forceRerender };
			return;
		}

		const nextVisible = buildNextVisible(virtualizeOn, visible, paragraphCount);
		const matchesChanged =
			prev.current.matches !== currentMatches ||
			prev.current.virt !== virtualizeOn ||
			prev.current.force !== forceRerender;

		reconcile({
			prevVisible: matchesChanged ? new Set() : prev.current.visible,
			nextVisible,
			matchesChanged,
			matchesByParagraph,
			matchToGlobalIndex,
			currentIndex,
			searchLayer,
			editor,
		});

		prev.current = { visible: nextVisible, matches: currentMatches, virt: virtualizeOn, force: forceRerender };
	}, [
		currentMatches,
		currentIndex,
		virtualizeOn,
		visible,
		matchesByParagraph,
		matchToGlobalIndex,
		paragraphCount,
		forceRerender,
	]);

	useLayoutEffect(() => {
		if (currentIndex == null) return;
		const searchLayer = getEditorRef('searchLayer');
		if (!searchLayer) return;
		const target = currentMatches[currentIndex];
		if (!target) return;
		if (virtualizeOn && !visible.has(target.paragraphIndex)) return;
		applySelectedClass(currentIndex, searchLayer);
	}, [currentIndex, visible, currentMatches, virtualizeOn]);
}
