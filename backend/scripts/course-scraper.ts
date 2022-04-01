#!/usr/bin/env node

import fetch from 'node-fetch';
import { existsSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import { SingleBar, Presets } from 'cli-progress';
import { parseRawPrerequisites, CourseEntry } from './lib/course-info.js';

const outputFile = 'course-info.json';
const cacheFile = 'raw-course-info-cache.json';
const prettyPrint = true;

const apiURL = 'https://one.ufl.edu/apix/soc/schedule/';

const term = '2211';
const category = 'CWSP';
let lastControlNumber = 0;
let fetchedRows = 0;
let totalRows = 0;

type CourseResponseEntry = {
	code: string,
	prerequisites: string,
	corequisites: string,
};

type ResponseEntry = {
	LASTCONTROLNUMBER: number,
	RETRIEVEDROWS: number,
	TOTALROWS: number,
	COURSES: CourseResponseEntry[],
};

type CourseInfo = {
	code: string,
	term: string,
	prerequisites: CourseEntry,
	corequisites: CourseEntry,
};

let courses: CourseInfo[] = [];
let raw: ResponseEntry[] = [];

const progress = new SingleBar({}, Presets.shades_classic);

if (existsSync(cacheFile)) {
	console.log('Using existing course data cache');
	raw = JSON.parse(await readFile(cacheFile, 'utf8'));
} else {
	console.log('Fetching course data...');

	progress.start(1, 0);

	do {
		let urlToFetch = new URL(apiURL);
		urlToFetch.searchParams.append('term', term);
		urlToFetch.searchParams.append('category', category);
		urlToFetch.searchParams.append('last-control-number', lastControlNumber.toString());

		const response = await fetch(urlToFetch.href);

		const body: ResponseEntry[] = (await response.json()) as ResponseEntry[];

		if (body.length != 1) {
			throw new Error("Expected reply to contain exactly one entry");
		}

		let info = body[0];

		raw.push(info);

		lastControlNumber = info.LASTCONTROLNUMBER;
		fetchedRows += info.RETRIEVEDROWS;
		totalRows = info.TOTALROWS;

		progress.setTotal(totalRows);
		progress.update(fetchedRows);
	} while (fetchedRows < totalRows);

	progress.stop();

	await writeFile(cacheFile, prettyPrint ? JSON.stringify(raw, null, '\t') : JSON.stringify(raw));
}

console.log('Processing course data');

for (const info of raw) {
	for (const course of info.COURSES) {
		let { prerequisites, corequisites } = parseRawPrerequisites(course.prerequisites);

		courses.push({
			code: course.code,
			term,
			prerequisites,
			corequisites,
		});
	}
}

await writeFile(outputFile, prettyPrint ? JSON.stringify(courses, null, '\t') : JSON.stringify(courses));
