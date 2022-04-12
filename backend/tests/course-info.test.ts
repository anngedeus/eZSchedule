import { parseRawPrerequisites } from '../scripts/lib/course-info.js';
import { readFileSync } from 'fs';
import { CourseRequirementsInfo } from '../lib/json-types.js';

const data = JSON.parse(readFileSync(new URL('./course-info-test-data.json', import.meta.url), 'utf8'));

describe('parseRawPrerequisites', () => {
	it.each(data.valid)('should parse valid strings correctly', (input, expectedOutput) => {
		expect(parseRawPrerequisites(input)).toEqual(expectedOutput);
	});

	it.each(data.invalid)('should not parse invalid strings', (input) => {
		expect(parseRawPrerequisites(input)).toEqual<CourseRequirementsInfo>({
			prerequisites: null,
			corequisites: null,
		});
	});
});
