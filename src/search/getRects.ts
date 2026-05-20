import { getParagraphId } from '../constants';

export interface MatchRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function getMatchRects(
	paragraphIndex: number,
	startIndex: number,
	endIndex: number,
	parentRect: DOMRect,
	range: Range,
): MatchRect[] {
	const para = document.getElementById(getParagraphId(paragraphIndex));
	if (!para) return [];
	const textNode = para.firstChild;
	if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return [];
	const nodeLen = textNode.textContent?.length ?? 0;
	if (nodeLen === 0) return [];
	const safeStart = Math.max(0, Math.min(startIndex, nodeLen));
	const safeEnd = Math.max(safeStart, Math.min(endIndex, nodeLen));
	range.setStart(textNode, safeStart);
	range.setEnd(textNode, safeEnd);
	const rects = Array.from(range.getClientRects());
	return rects.map(r => ({
		x: r.left - parentRect.left,
		y: r.top - parentRect.top,
		width: r.width,
		height: r.height,
	}));
}
