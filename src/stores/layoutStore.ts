import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

interface LayoutState {
	dirtyVersion: number;
	bumpDirty: () => void;
}

export const useLayoutStore = createWithEqualityFn<LayoutState, [['zustand/immer', never]]>(
	immer(set => ({
		dirtyVersion: 0,
		bumpDirty: () => {
			set(state => {
				state.dirtyVersion += 1;
			});
		},
	})),
	shallow,
);
