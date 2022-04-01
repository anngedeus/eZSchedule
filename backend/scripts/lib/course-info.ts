import balanced from 'balanced-match';

const prereqRegex = /Prereq:\s*((.(?![A-Za-z]+:))*)/;
const coreqRegex = /Coreq:\s*((.(?![A-Za-z]+:))*)/;
const courseRegex = /([A-Z]{3})\s*[0-9#]+([A-Z])?(\s*,\s*[0-9#]+([A-Z])?)*/;
const courseEndingRegex = /[0-9#]+([A-Z])?/g;
const keepRegex = /\{[0-9]+\}|and|AND|or|OR/g;
const indexRegex = /\{([0-9]+)\}/;

// UF, why the hell can't you provide simple, parseable course dependency information?!

export type CourseCode = string;
export type CourseIntersection = {
	intersection: CourseEntry[],
};
export type CourseUnion = {
	union: CourseEntry[],
};
export type CourseEntry = CourseCode | CourseIntersection | CourseUnion;
export type CourseRequirementsInfo = {
	prerequisites: CourseEntry,
	corequisites: CourseEntry,
};

export function parseRawPrerequisites(raw: string): CourseRequirementsInfo {
	if (!raw) {
		return {
			prerequisites: null,
			corequisites: null,
		};
	}

	const prereqMatch = raw.match(prereqRegex);
	const coreqMatch = raw.match(coreqRegex);

	if ((!prereqMatch || prereqMatch.length < 2) && (!coreqMatch || coreqMatch.length < 2)) {
		return {
			prerequisites: null,
			corequisites: null,
		};
	}

	function parseFragment(fragment: string): CourseEntry {
		let saved: CourseEntry[] = [];

		// find and parse sub-fragments (in parentheses)
		let match = balanced('(', ')', fragment);
		while (match) {
			const frag = parseFragment(match.body);
			let replaceWith = '';
			if (frag) {
				saved.push(frag);
				replaceWith = '{' + (saved.length - 1) + '}';
			}
			fragment = match.pre + replaceWith + match.post;
			match = balanced('(', ')', fragment);
		}

		// now parse course codes
		let match2 = fragment.match(courseRegex);
		while (match2) {
			const prefix = match2[1];
			const numbers = [...match2[0].matchAll(courseEndingRegex)].map(i => i[0].trim());
			let result = '';
			for (const number of numbers) {
				saved.push(prefix + number);
				result += '{' + (saved.length - 1) + '}';
			}
			fragment = fragment.substring(0, match2.index) + result + fragment.substring(match2.index + match2[0].length);
			match2 = fragment.match(courseRegex);
		}

		// now extract only the valuable information (i.e. indexes and operators)
		const transformed = [...fragment.matchAll(keepRegex)].map(i => i[0].trim()).filter(i => i.length > 0);

		type RecursiveStringArray = (string | RecursiveStringArray)[];
		const separateChunks = (arr: string[], delimiter: string): RecursiveStringArray => {
			let result: RecursiveStringArray = [];
			let reversed = arr.slice().reverse();
			let idx = reversed.indexOf(delimiter);
			while (idx >= 0) {
				result.push(reversed.slice(0, idx).reverse());
				result.push(delimiter);
				reversed = reversed.slice(idx + 1);
				idx = reversed.indexOf(delimiter);
			}
			result.push(reversed.reverse());
			result.reverse();
			return result;
		};

		// used to convince typescript the the given value is in-fact a string array
		const isStringArray = (arr: any): arr is string[] => {
			return Array.isArray(arr) && arr.every(i => typeof i === 'string');
		};

		const forEachRecurseOnlyFlat = (arr: RecursiveStringArray, exec: (arr: string[]) => RecursiveStringArray): RecursiveStringArray => {
			let copy = arr.slice();
			let hasArrays = false;
			for (let i = 0; i < copy.length; ++i) {
				const entry = copy[i];
				if (Array.isArray(entry)) {
					hasArrays = true;
					copy[i] = forEachRecurseOnlyFlat(entry, exec);
				}
			}
			if (!hasArrays) {
				if (!isStringArray(copy)) {
					throw new TypeError("Unexpected non-string array");
				}
				return exec(copy);
			}
			return copy;
		};

		let tmp2 = forEachRecurseOnlyFlat(transformed, arr => separateChunks(arr, 'OR'));
		tmp2 = forEachRecurseOnlyFlat(tmp2, arr => separateChunks(arr, 'AND'));
		tmp2 = forEachRecurseOnlyFlat(tmp2, arr => separateChunks(arr, 'or'));
		tmp2 = forEachRecurseOnlyFlat(tmp2, arr => separateChunks(arr, 'and'));

		const indexStringToEntry = (indexString: string): CourseEntry => {
			const match = indexString.match(indexRegex);
			if (!match) {
				throw new Error("Invalid chunk string entry");
			}
			const index = Number(match[1]);
			if (!(index in saved)) {
				throw new Error("Index not in saved entry array");
			}
			return saved[index];
		};

		const processChunk = (arr: RecursiveStringArray, parent?: 'OR' | 'AND' | 'or' | 'and'): CourseEntry => {
			if (arr.indexOf('OR') >= 0) {
				parent = 'OR';
			} else if (arr.indexOf('AND') >= 0) {
				parent = 'AND';
			} else if (arr.indexOf('or') >= 0) {
				parent = 'or';
			} else if (arr.indexOf('and') >= 0) {
				parent = 'and';
			}

			if (arr.length === 1) {
				if (typeof arr[0] === 'string') {
					return indexStringToEntry(arr[0]);
				} else {
					return processChunk(arr[0], parent);
				}
			} else if (arr.length > 0) {
				let list: CourseEntry[] = [];
				for (const entry of arr) {
					if (Array.isArray(entry)) {
						const processed = processChunk(entry, parent);
						if (processed) {
							list.push(processed);
						}
					} else if (indexRegex.test(entry)) {
						list.push(indexStringToEntry(entry));
					}
				}
				if (list.length === 0) {
					return null;
				}
				if (parent === 'OR' || parent === 'or') {
					return {
						union: list,
					};
				} else if (parent === 'AND' || parent === 'and') {
					return {
						intersection: list,
					};
				} else {
					throw new Error("parent is `null`, but multiple entries in array");
				}
			} else {
				// this happens when the operator was actually for some unimportant/unparseable information (e.g. "or equivalent courses")
				return null;
			}
		};

		const flatten = (entry: CourseEntry): CourseEntry => {
			if (!entry) {
				return null;
			}
			if (typeof entry === 'string') {
				return entry;
			} else if ('union' in entry) {
				let list: CourseEntry[] = [];
				for (const subentry of entry.union) {
					const flattened = flatten(subentry);
					if (typeof flattened !== 'string' && 'union' in flattened) {
						list.push(...flattened.union);
					} else {
						list.push(flattened);
					}
				}
				if (list.length === 1) {
					return list[0];
				}
				return {
					union: list,
				};
			} else if ('intersection' in entry) {
				let list: CourseEntry[] = [];
				for (const subentry of entry.intersection) {
					const flattened = flatten(subentry);
					if (typeof flattened !== 'string' && 'intersection' in flattened) {
						list.push(...flattened.intersection);
					} else {
						list.push(flattened);
					}
				}
				if (list.length === 1) {
					return list[0];
				}
				return {
					intersection: list,
				};
			} else {
				throw new Error("Impossible course entry type");
			}
		};

		// some prereq strings omit operators (e.g. "Prereq: AEB 3103, 4511; STA 3023.")
		// in these cases, the entries are supposed to be interpreted as all required,
		// so we default to "and"
		return flatten(processChunk(tmp2, 'and'));
	}

	return {
		prerequisites: prereqMatch ? parseFragment(prereqMatch[1]) : null,
		corequisites: coreqMatch ? parseFragment(coreqMatch[1]) : null,
	};
}
