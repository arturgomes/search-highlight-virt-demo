export interface Paragraph {
	index: number;
	text: string;
}

export interface MatchEntry {
	paragraphIndex: number;
	startIndex: number;
	endIndex: number;
}

export interface SearchOptions {
	caseSensitive: boolean;
	wholeWord: boolean;
}
