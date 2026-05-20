import { useEffect } from 'react';
import { getEditorRef } from '../dom/editorRefs';
import { useLayoutStore } from '../stores/layoutStore';

export function useResizeRerender(): void {
	const bumpDirty = useLayoutStore(s => s.bumpDirty);

	useEffect(() => {
		const editor = getEditorRef('editor');
		if (!editor) return;
		let rafId: number | undefined;
		const ro = new ResizeObserver(() => {
			if (rafId != null) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				bumpDirty();
				rafId = undefined;
			});
		});
		ro.observe(editor);
		return () => {
			ro.disconnect();
			if (rafId != null) cancelAnimationFrame(rafId);
		};
	}, [bumpDirty]);
}
