import type { Paragraph } from '../types';

const JS_WORDS = [
	'function','const','let','variable','array','object','promise','async','await','callback',
	'closure','scope','hoisting','prototype','class','module','export','import','default','return',
	'iterator','generator','map','filter','reduce','forEach','spread','rest','destructuring','template',
	'literal','string','number','boolean','symbol','undefined','null','event','listener','handler',
	'state','props','component','render','effect','hook','memo','ref','context','provider',
	'reducer','dispatch','action','store','selector','middleware','thunk','saga','observable','stream',
];

const TUTORIAL_PHRASES = [
	'In this section we will look at',
	'Notice how the',
	'Under the hood the',
	'One common pattern is to',
	'A good rule of thumb is that',
	'It is important to remember that',
	'For example, consider the',
	'Let us take a closer look at',
	'In modern JavaScript the',
	'The next thing to understand is',
	'A frequent source of bugs is',
	'When you call this function the',
	'Behind the scenes the engine',
	'As you can see, the',
	'In practice, most developers',
	'A subtle but important detail is',
	'To illustrate this point, the',
	'You may have noticed that the',
	'In the example above the',
	'A more idiomatic approach is to',
	'Keep in mind that the',
	'Before we move on, note that',
	'The key insight here is that',
	'Pay close attention to how the',
	'In the following snippet the',
	'It is worth pointing out that',
	'Just like in the previous chapter the',
	'Returning to our earlier example the',
	'A common beginner mistake is to',
	'To wrap up this section the',
];

function mulberry32(seed: number): () => number {
	let s = seed >>> 0;
	return function () {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
	return arr[Math.floor(rand() * arr.length)];
}

function buildSentence(rand: () => number): string {
	const startsWithPhrase = rand() < 0.5;
	const wordCount = 6 + Math.floor(rand() * 12);
	const words: string[] = [];
	if (startsWithPhrase) {
		words.push(pick(rand, TUTORIAL_PHRASES));
	}
	for (let i = 0; i < wordCount; i++) {
		words.push(pick(rand, JS_WORDS));
	}
	const r = rand();
	const punctuation = r < 0.9 ? '.' : r < 0.98 ? '?' : '!';
	const sentence = words.join(' ');
	return sentence.charAt(0).toUpperCase() + sentence.slice(1) + punctuation;
}

export function generateParagraphs(count: number, seed: number): Paragraph[] {
	const rand = mulberry32(seed);
	const out: Paragraph[] = new Array(count);
	for (let i = 0; i < count; i++) {
		const sentenceCount = 1 + Math.floor(rand() * 4);
		const sentences: string[] = [];
		for (let s = 0; s < sentenceCount; s++) sentences.push(buildSentence(rand));
		out[i] = { index: i, text: sentences.join(' ') };
	}
	return out;
}
