import { EDITOR_ID, OUTER_EDITOR_ID, SEARCH_LAYER_ID } from '../constants';
import { setEditorRef } from '../dom/editorRefs';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';
import { useResizeRerender } from '../hooks/useResizeRerender';
import { useSearchEffect } from '../hooks/useSearchEffect';
import { useVisibleParagraphsObserver } from '../hooks/useVisibleParagraphsObserver';
import { useParagraphStore } from '../stores/paragraphStore';
import { Paragraph } from './Paragraph';
import './BlogViewer.css';

export function BlogViewer() {
	const paragraphs = useParagraphStore(s => s.paragraphs);
	const seed = useParagraphStore(s => s.seed);

	useVisibleParagraphsObserver({ paragraphCount: paragraphs.length, revision: seed });
	useDebouncedSearch();
	useSearchEffect();
	useResizeRerender();

	return (
		<div
			id={OUTER_EDITOR_ID}
			className="outer-editor"
			ref={el => setEditorRef('outerEditor', el)}
		>
			<div
				id={EDITOR_ID}
				className="blog-editor"
				ref={el => setEditorRef('editor', el)}
			>
				{paragraphs.map(p => (
					<Paragraph key={p.index} p={p} />
				))}
				<div
					id={SEARCH_LAYER_ID}
					className="search-layer"
					ref={el => setEditorRef('searchLayer', el)}
				/>
			</div>
		</div>
	);
}
