import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { DEFAULT_PARAGRAPH_COUNT } from '../constants';
import { generateParagraphs } from '../data/generateParagraphs';
import type { Paragraph } from '../types';

interface ParagraphState {
	paragraphs: Paragraph[];
	paragraphCount: number;
	seed: number;
	setParagraphCount: (n: number) => void;
	regenerate: (seed?: number) => void;
}

const initialSeed = Date.now() & 0x7fffffff;

export const useParagraphStore = createWithEqualityFn<ParagraphState, [['zustand/immer', never]]>(
	immer(set => ({
		paragraphs: generateParagraphs(DEFAULT_PARAGRAPH_COUNT, initialSeed),
		paragraphCount: DEFAULT_PARAGRAPH_COUNT,
		seed: initialSeed,
		setParagraphCount: n => {
			set(state => {
				state.paragraphCount = n;
				state.paragraphs = generateParagraphs(n, state.seed);
			});
		},
		regenerate: nextSeed => {
			set(state => {
				const s = nextSeed ?? (Date.now() & 0x7fffffff);
				state.seed = s;
				state.paragraphs = generateParagraphs(state.paragraphCount, s);
			});
		},
	})),
	shallow,
);
