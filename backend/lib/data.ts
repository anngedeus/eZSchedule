import { readFileSync } from 'fs';
import { CourseInfo, DegreeCourseInfo } from './json-types.js';

export const courseInfo: CourseInfo[] = JSON.parse(readFileSync(new URL('../course-info.json', import.meta.url), 'utf8'));
export const manualDegreeCourses: DegreeCourseInfo[] = JSON.parse(readFileSync(new URL('../manual-degree-courses.json', import.meta.url), 'utf8'));
