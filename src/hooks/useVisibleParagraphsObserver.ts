import { useEffect } from 'react';
import { PARAGRAPH_BUFFER_PX, getParagraphId } from '../constants';
import { getEditorRef } from '../dom/editorRefs';
import { useVisibleStore } from '../stores/visibleStore';

interface Args {
	paragraphCount: number;
	revision: number;
}

export function useVisibleParagraphsObserver({ paragraphCount, revision }: Args): void {
	const setVisible = useVisibleStore(s => s.setVisible);

	useEffect(() => {
		const root = getEditorRef('outerEditor');
		if (!root) return;

		const localSet = new Set<number>();
		let rafId: number | undefined;

		const flush = () => {
			setVisible(new Set(localSet));
			rafId = undefined;
		};

		const io = new IntersectionObserver(
			entries => {
				for (const e of entries) {
					const id = e.target.id;
					if (!id.startsWith('pg-')) continue;
					const idx = Number(id.slice(3));
					if (e.isIntersecting) localSet.add(idx);
					else localSet.delete(idx);
				}
				if (rafId == null) rafId = requestAnimationFrame(flush);
			},
			{
				root,
				rootMargin: `${PARAGRAPH_BUFFER_PX}px 0px ${PARAGRAPH_BUFFER_PX}px 0px`,
				threshold: 0,
			},
		);

		for (let i = 0; i < paragraphCount; i++) {
			const el = document.getElementById(getParagraphId(i));
			if (el) io.observe(el);
		}

		return () => {
			io.disconnect();
			if (rafId != null) cancelAnimationFrame(rafId);
			setVisible(new Set());
		};
	}, [paragraphCount, revision, setVisible]);
}
