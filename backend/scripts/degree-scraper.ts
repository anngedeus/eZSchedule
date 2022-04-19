#!/usr/bin/env node

import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';
import { basename } from 'path';

const outputFile = 'degree-info.json';
const prettyPrint = true;

const rootURL = 'https://catalog.ufl.edu';
const programListURL = (new URL('/UGRD/programs/', rootURL)).href;

type ProgramInfo = {
	imageURL: string,
	title: string,
	type: 'major' | 'minor' | 'certificate',
	shortDescription: string,
	url: string,
	code: string,
	heroURL?: string,
	description?: string,
	college?: string,
	school?: string,
	degree?: string,
	credits?: number,
	overview?: string
};

let programs: ProgramInfo[] = [];

function extractImageURL(elm: cheerio.Cheerio<cheerio.Element>): string {
	if (!elm) {
		return null;
	}
	const style = elm.attr('style');
	if (!style) {
		return null;
	}
	const match = style.match(/url\(([^)]*)\)/);
	if (!match) {
		return null;
	}
	return match[1];
}

{
	console.log('Fetching and processing main information');

	const response = await fetch(programListURL);
	const body = await response.text();
	const $ = cheerio.load(body);

	$('#textcontainer ul.clearfix li.item').each((i, elm) => {
		const descs = $('div.description > p', elm).toArray();
		let description = null;
		let url = null;

		for (const desc of descs) {
			const link = $('a.learn-more', desc);
			if (link.length == 1) {
				url = (new URL(link.attr('href'), programListURL)).href;
			} else {
				description = $(desc).text();
			}
		}

		const imgURL = extractImageURL($('span.image', elm));

		let code = null;

		if (url != null) {
			code = basename((new URL(url)).pathname);
		}

		const type = $('span.type', elm).text().trim().split(' ')[0];

		if (type !== 'major' && type !== 'minor' && type !== 'certificate') {
			console.log("Unknown program type: " + type);
			return;
		}

		programs.push({
			imageURL: (imgURL !== null) ? (new URL(imgURL, programListURL)).href : null,
			title: $('span.title', elm).text().trim(),
			type,
			shortDescription: description,
			url,
			code,
		});
	});
}

async function processProgram(program: ProgramInfo) {
	console.log(`Fetching additional information for ${program.title} (${program.type})`);

	const response = await fetch(program.url);
	const body = await response.text();
	const $ = cheerio.load(body);

	console.log(`Processing additional information for ${program.title} (${program.type})`);

	const heroURL = extractImageURL($('#page-hero'));
	program.heroURL = (heroURL !== null) ? (new URL(heroURL, programListURL)).href : null;
	program.description = $('#intro-text').text();

	const aboutItems = $('#about-major > ul > li').toArray();

	for (const item of aboutItems) {
		const text = $(item).text();

		let match = text.match(/^College: (.*)/);
		if (match) {
			program.college = match[1];
		}

		match = text.match(/^School: (.*)/);
		if (match) {
			program.school = match[1];
		}

		match = text.match(/^Degree: (.*)/);
		if (match) {
			program.degree = match[1];
		}

		match = text.match(/^Credits(?: for Degree)?: (.*)/);
		if (match) {
			program.credits = parseInt(match[1]);
		}
	}

	if (program.type == 'major') {
		program.overview = $('#textcontainer').text();
	} else {
		program.overview = $($('#textcontainer > p')[0]).text();
	}

	// TODO: find a way to parse the critical tracking info.
	//       the problem is that not all majors report the info in a predictable, machine-parseable format.
}

await Promise.allSettled(programs.map(program => processProgram(program)));

await writeFile(outputFile, prettyPrint ? JSON.stringify(programs, null, '\t') : JSON.stringify(programs));
