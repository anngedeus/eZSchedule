export interface Intersection<Entry> {
	intersection: Entry[],
};

export interface Union<Entry> {
	union: Entry[],
};

export type CourseCode = string;
export type CourseEntry = CourseCode | Intersection<CourseEntry> | Union<CourseEntry>;

export interface CourseRequirementsInfo {
	prerequisites: CourseEntry,
	corequisites: CourseEntry,
};

export interface CourseInfo {
	code: CourseCode,
	term: string,
	prerequisites: CourseEntry,
	corequisites: CourseEntry,
};

export type MajorCode = string;

export interface Wildcard {
	prefix?: string,
	level?: number,
	levelMin?: number,
};

export type CourseFilter = CourseCode | Union<CourseFilter> | Wildcard;

export interface CriticalTrackingInfo {
	semesters: number,
	courses: CourseEntry,
};

export interface CreditRequirement {
	credits: number,
	courses?: CourseFilter,
	excluded?: CourseFilter,
};

export type DegreeRequirement = CreditRequirement;

export interface DegreeCourseInfo {
	code: MajorCode,
	name: string,
	criticalTracking: CriticalTrackingInfo,
	otherRequiredCourses: CourseEntry,
	otherRequirements: DegreeRequirement[],
};
