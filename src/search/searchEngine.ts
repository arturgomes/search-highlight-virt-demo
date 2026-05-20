import type { MatchEntry, Paragraph, SearchOptions } from '../types';

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

function escape(s: string): string {
	return s.replace(REGEX_SPECIAL, '\\$&');
}

export function findAllMatches(
	paragraphs: Paragraph[],
	query: string,
	{ caseSensitive, wholeWord }: SearchOptions,
): MatchEntry[] {
	if (!query) return [];
	const flags = caseSensitive ? 'g' : 'gi';
	const escaped = escape(query);
	const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
	let re: RegExp;
	try {
		re = new RegExp(pattern, flags);
	} catch {
		return [];
	}
	const out: MatchEntry[] = [];
	for (const p of paragraphs) {
		const haystack = p.text;
		re.lastIndex = 0;
		let m: RegExpExecArray | null;
		while ((m = re.exec(haystack)) !== null) {
			out.push({ paragraphIndex: p.index, startIndex: m.index, endIndex: m.index + m[0].length });
			if (m.index === re.lastIndex) re.lastIndex++;
		}
	}
	return out;
}

export function bucketByParagraph(matches: MatchEntry[]): Map<number, MatchEntry[]> {
	const map = new Map<number, MatchEntry[]>();
	for (const m of matches) {
		const arr = map.get(m.paragraphIndex);
		if (arr) arr.push(m);
		else map.set(m.paragraphIndex, [m]);
	}
	return map;
}
