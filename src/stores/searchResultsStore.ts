import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import type { MatchEntry } from '../types';

interface SearchResultsState {
	currentMatches: MatchEntry[];
	currentIndex: number | undefined;
	searchStartedAt: number | undefined;
	setCurrentMatches: (m: MatchEntry[]) => void;
	setCurrentIndex: (i: number | undefined) => void;
	selectNext: () => void;
	selectPrev: () => void;
	markSearchStarted: () => void;
}

export const useSearchResultsStore = createWithEqualityFn<SearchResultsState, [['zustand/immer', never]]>(
	immer(set => ({
		currentMatches: [],
		currentIndex: undefined,
		searchStartedAt: undefined,
		setCurrentMatches: m => {
			set(state => {
				state.currentMatches = m;
				if (m.length === 0) state.currentIndex = undefined;
				else if (state.currentIndex == null || state.currentIndex >= m.length) state.currentIndex = 0;
			});
		},
		setCurrentIndex: i => {
			set(state => {
				state.currentIndex = i;
			});
		},
		selectNext: () => {
			set(state => {
				if (state.currentMatches.length === 0) return;
				const cur = state.currentIndex ?? -1;
				state.currentIndex = cur + 1 >= state.currentMatches.length ? 0 : cur + 1;
			});
		},
		selectPrev: () => {
			set(state => {
				if (state.currentMatches.length === 0) return;
				const cur = state.currentIndex ?? 0;
				state.currentIndex = cur - 1 < 0 ? state.currentMatches.length - 1 : cur - 1;
			});
		},
		markSearchStarted: () => {
			set(state => {
				state.searchStartedAt = performance.now();
			});
		},
	})),
	shallow,
);
