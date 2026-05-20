import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

interface VisibleState {
	visible: Set<number>;
	setVisible: (next: Set<number>) => void;
	clear: () => void;
}

export const useVisibleStore = createWithEqualityFn<VisibleState, [['zustand/immer', never]]>(
	immer(set => ({
		visible: new Set<number>(),
		setVisible: next => {
			set(state => {
				state.visible = next;
			});
		},
		clear: () => {
			set(state => {
				state.visible = new Set<number>();
			});
		},
	})),
	shallow,
);
