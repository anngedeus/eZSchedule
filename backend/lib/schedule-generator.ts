import { readFileSync } from 'fs';
import { CourseCode, CourseFilter, CourseInfo, DegreeCourseInfo, MajorCode, Union } from './json-types.js';

const courseInfo: CourseInfo[] = JSON.parse(readFileSync(new URL('../course-info.json', import.meta.url), 'utf8'));
const manualDegreeCourses: DegreeCourseInfo[] = JSON.parse(readFileSync(new URL('../manual-degree-courses.json', import.meta.url), 'utf8'));

// "weak" because we're actually cheating and not verifying the entries in the union
function isUnionWeak<Entry>(obj: any): obj is Union<Entry> {
	return typeof obj === 'object' && Array.isArray(obj.union);
}

export interface CourseCodeInfo {
	prefix: string,
	level: number,
	code: number,
	suffix?: string,
	raw: string,
};

const courseCodeInfoRegex = /([A-Z]{3})\s*([0-9#]+)([A-Z])?/;

const courseCodeInfos: CourseCodeInfo[] = courseInfo.map(i => parseCourseCode(i.code));

export function parseCourseCode(code: CourseCode): CourseCodeInfo {
	let info: CourseCodeInfo = {
		prefix: '',
		level: 0,
		code: 0,
		raw: code,
	};

	let match = code.match(courseCodeInfoRegex);
	if (!match) {
		return null;
	}

	info.prefix = match[1];
	info.code = Number(match[2]);
	info.level = Math.trunc(info.code / 1000) * 1000;
	if (match[3]) {
		info.suffix = match[3];
	}

	return info;
};

export function findCoursesMatchingFilter(filter: CourseFilter): Set<CourseCode> {
	let courses: Set<CourseCode> = new Set();

	if (typeof filter === 'string') {
		courses.add(filter);
	} else if (isUnionWeak(filter)) {
		for (const subfilter of filter.union) {
			for (const course of findCoursesMatchingFilter(subfilter)) {
				courses.add(course);
			}
		}
	} else {
		for (const info of courseCodeInfos) {
			if (filter.prefix && info.prefix !== filter.prefix) {
				continue;
			}
			if (filter.level && info.level !== filter.level) {
				continue;
			}
			if (filter.levelMin && info.level < filter.levelMin) {
				continue;
			}
			courses.add(info.raw);
		}
	}

	return courses;
};

export default async function(major: MajorCode, courseHistory: Set<CourseCode>) {

};
