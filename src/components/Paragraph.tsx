import { getParagraphId } from '../constants';
import type { Paragraph as ParagraphData } from '../types';

interface Props {
	p: ParagraphData;
}

export function Paragraph({ p }: Props) {
	return (
		<p id={getParagraphId(p.index)} className="paragraph">
			{p.text}
		</p>
	);
}
