import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

interface SearchInputState {
	query: string;
	caseSensitive: boolean;
	wholeWord: boolean;
	virtualizeOn: boolean;
	setQuery: (q: string) => void;
	toggleCaseSensitive: () => void;
	toggleWholeWord: () => void;
	setVirtualizeOn: (on: boolean) => void;
}

export const useSearchInputStore = createWithEqualityFn<SearchInputState, [['zustand/immer', never]]>(
	immer(set => ({
		query: '',
		caseSensitive: false,
		wholeWord: false,
		virtualizeOn: true,
		setQuery: q => {
			set(state => {
				state.query = q;
			});
		},
		toggleCaseSensitive: () => {
			set(state => {
				state.caseSensitive = !state.caseSensitive;
			});
		},
		toggleWholeWord: () => {
			set(state => {
				state.wholeWord = !state.wholeWord;
			});
		},
		setVirtualizeOn: on => {
			set(state => {
				state.virtualizeOn = on;
			});
		},
	})),
	shallow,
);
