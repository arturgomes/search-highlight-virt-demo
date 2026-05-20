import { useEffect, useRef } from 'react';
import { SEARCH_DEBOUNCE_MS } from '../constants';
import { findAllMatches } from '../search/searchEngine';
import { useParagraphStore } from '../stores/paragraphStore';
import { useSearchInputStore } from '../stores/searchInputStore';
import { useSearchResultsStore } from '../stores/searchResultsStore';

export function useDebouncedSearch(): void {
	const paragraphs = useParagraphStore(s => s.paragraphs);
	const query = useSearchInputStore(s => s.query);
	const caseSensitive = useSearchInputStore(s => s.caseSensitive);
	const wholeWord = useSearchInputStore(s => s.wholeWord);
	const setCurrentMatches = useSearchResultsStore(s => s.setCurrentMatches);
	const markSearchStarted = useSearchResultsStore(s => s.markSearchStarted);

	const seqRef = useRef(0);

	useEffect(() => {
		if (!query) {
			++seqRef.current;
			setCurrentMatches([]);
			return;
		}
		markSearchStarted();
		const mySeq = ++seqRef.current;
		const handle = window.setTimeout(() => {
			const matches = findAllMatches(paragraphs, query, { caseSensitive, wholeWord });
			if (mySeq !== seqRef.current) return;
			setCurrentMatches(matches);
		}, SEARCH_DEBOUNCE_MS);
		return () => window.clearTimeout(handle);
	}, [paragraphs, query, caseSensitive, wholeWord, setCurrentMatches, markSearchStarted]);
}
