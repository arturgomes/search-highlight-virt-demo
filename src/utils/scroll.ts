import { getParagraphId } from '../constants';

export function scrollToParagraph(paragraphIndex: number, outerEditor: HTMLElement): void {
	const para = document.getElementById(getParagraphId(paragraphIndex));
	if (!para) return;
	const paraRect = para.getBoundingClientRect();
	const outerRect = outerEditor.getBoundingClientRect();
	const target = outerEditor.scrollTop + (paraRect.top - outerRect.top) - outerRect.height / 3;
	outerEditor.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
}
