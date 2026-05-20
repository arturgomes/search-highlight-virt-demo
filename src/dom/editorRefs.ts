export type EditorRefKind = 'editor' | 'outerEditor' | 'searchLayer';

const refs = new Map<EditorRefKind, HTMLElement | null>();

export function setEditorRef(kind: EditorRefKind, el: HTMLElement | null): void {
	if (el == null) refs.delete(kind);
	else refs.set(kind, el);
}

export function getEditorRef(kind: EditorRefKind): HTMLElement | null {
	return refs.get(kind) ?? null;
}
