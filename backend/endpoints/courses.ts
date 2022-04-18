import express from 'express';
import { courseInfo } from '../lib/data.js';
import APIError from '../lib/api-errors.js';
import APIResponse from '../lib/api-response.js';

const courses = courseInfo.map(i => i.code);

interface CoursesResponse extends APIResponse {
	courses?: string[],
};

const resbody: CoursesResponse = {
	error: APIError.None,
	courses: [...new Set(courses)],
};

export default async (req: express.Request, res: express.Response) => {
	res.status(200).json(resbody);
};
