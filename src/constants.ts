export const SEARCH_LAYER_ID = 'search-layer';
export const EDITOR_ID = 'blog-editor';
export const OUTER_EDITOR_ID = 'outer-editor';
export const PARAGRAPH_BUFFER_PX = 300;
export const SEARCH_DEBOUNCE_MS = 200;
export const DEFAULT_PARAGRAPH_COUNT = 2000;
export const MIN_PARAGRAPH_COUNT = 1;
export const MAX_PARAGRAPH_COUNT = 20000;
export const STATS_FRAME_INTERVAL_MS = 50;

export const getParagraphId = (i: number): string => `pg-${i}`;
