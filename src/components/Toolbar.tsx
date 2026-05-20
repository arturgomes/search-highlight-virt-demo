import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_PARAGRAPH_COUNT, MIN_PARAGRAPH_COUNT } from '../constants';
import { getEditorRef } from '../dom/editorRefs';
import { useFrameStats } from '../hooks/useFrameStats';
import { scrollToParagraph } from '../utils/scroll';
import { useParagraphStore } from '../stores/paragraphStore';
import { useSearchInputStore } from '../stores/searchInputStore';
import { useSearchResultsStore } from '../stores/searchResultsStore';
import './Toolbar.css';

export function Toolbar() {
	const query = useSearchInputStore(s => s.query);
	const setQuery = useSearchInputStore(s => s.setQuery);
	const caseSensitive = useSearchInputStore(s => s.caseSensitive);
	const toggleCaseSensitive = useSearchInputStore(s => s.toggleCaseSensitive);
	const wholeWord = useSearchInputStore(s => s.wholeWord);
	const toggleWholeWord = useSearchInputStore(s => s.toggleWholeWord);
	const virtualizeOn = useSearchInputStore(s => s.virtualizeOn);
	const setVirtualizeOn = useSearchInputStore(s => s.setVirtualizeOn);
	const currentMatches = useSearchResultsStore(s => s.currentMatches);
	const currentIndex = useSearchResultsStore(s => s.currentIndex);
	const selectNext = useSearchResultsStore(s => s.selectNext);
	const selectPrev = useSearchResultsStore(s => s.selectPrev);

	const paragraphCount = useParagraphStore(s => s.paragraphCount);
	const setParagraphCount = useParagraphStore(s => s.setParagraphCount);
	const regenerate = useParagraphStore(s => s.regenerate);

	const stats = useFrameStats();
	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const [pendingCount, setPendingCount] = useState(paragraphCount);
	useEffect(() => {
		if (pendingCount === paragraphCount) return;
		const handle = window.setTimeout(() => setParagraphCount(pendingCount), 300);
		return () => window.clearTimeout(handle);
	}, [pendingCount, paragraphCount, setParagraphCount]);

	const navigateToCurrent = useCallback(() => {
		const target = currentIndex != null ? currentMatches[currentIndex] : undefined;
		if (!target) return;
		const outer = getEditorRef('outerEditor');
		if (outer) scrollToParagraph(target.paragraphIndex, outer);
	}, [currentIndex, currentMatches]);

	const handleNext = useCallback(() => {
		selectNext();
	}, [selectNext]);

	const handlePrev = useCallback(() => {
		selectPrev();
	}, [selectPrev]);

	useEffect(() => {
		navigateToCurrent();
	}, [currentIndex, navigateToCurrent]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'F3') {
				e.preventDefault();
				if (e.shiftKey) selectPrev();
				else selectNext();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [selectNext, selectPrev]);

	const totalMatches = currentMatches.length;
	const indicator = totalMatches === 0 ? '0 of 0' : `${(currentIndex ?? 0) + 1} of ${totalMatches}`;

	return (
		<header className="toolbar">
			<div className="toolbar-row">
				<label className="field">
					<span>Paragraphs</span>
					<input
						type="number"
						min={MIN_PARAGRAPH_COUNT}
						max={MAX_PARAGRAPH_COUNT}
						step={100}
						value={pendingCount}
						onChange={e => {
							const n = Number(e.target.value);
							if (!Number.isFinite(n)) return;
							const clamped = Math.max(MIN_PARAGRAPH_COUNT, Math.min(MAX_PARAGRAPH_COUNT, Math.round(n)));
							setPendingCount(clamped);
						}}
					/>
				</label>
				<button type="button" className="btn" onClick={() => regenerate()}>
					Regenerate
				</button>

				<div className="divider" />

				<label className="field flex">
					<span>Find</span>
					<input
						ref={searchInputRef}
						type="text"
						value={query}
						placeholder='Try "the"'
						onChange={e => setQuery(e.target.value)}
					/>
				</label>
				<button type="button" className="btn" onClick={handlePrev} title="Previous (Shift+F3)" disabled={totalMatches === 0}>
					◀ Prev
				</button>
				<button type="button" className="btn" onClick={handleNext} title="Next (F3)" disabled={totalMatches === 0}>
					Next ▶
				</button>
				<span className="indicator">{indicator}</span>
			</div>

			<div className="toolbar-row">
				<label className="checkbox">
					<input type="checkbox" checked={caseSensitive} onChange={toggleCaseSensitive} />
					Case-sensitive
				</label>
				<label className="checkbox">
					<input type="checkbox" checked={wholeWord} onChange={toggleWholeWord} />
					Whole word
				</label>

				<div className="divider" />

				<div className="virtualize">
					<span>Virtualize:</span>
					<button
						type="button"
						className={`segment ${virtualizeOn ? 'active' : ''}`}
						onClick={() => setVirtualizeOn(true)}
					>
						ON
					</button>
					<button
						type="button"
						className={`segment ${!virtualizeOn ? 'active danger' : ''}`}
						onClick={() => setVirtualizeOn(false)}
					>
						OFF
					</button>
				</div>

				<div className="divider" />

				<div className="stats" title="Live counters">
					<span>Visible paragraphs: <strong>{stats.visibleCount}</strong></span>
					<span>Overlay nodes: <strong>{stats.overlayCount}</strong></span>
					<span>Last search: <strong>{stats.lastSearchMs != null ? `${stats.lastSearchMs} ms` : '—'}</strong></span>
				</div>
			</div>
		</header>
	);
}
