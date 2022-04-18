import express from 'express';
import { manualDegreeCourses } from '../lib/data.js';
import APIError from '../lib/api-errors.js';
import APIResponse from '../lib/api-response.js';
import { MajorCode } from '../lib/json-types.js';

const majors = manualDegreeCourses.map(i => ({ code: i.code, name: i.name }));

interface MajorsResponse extends APIResponse {
	majors?: {
		code: MajorCode,
		name: string,
	}[],
};

const resbody: MajorsResponse = {
	error: APIError.None,
	majors: majors.filter((v, i, a) => a.findIndex(t => t.code === v.code) === i),
};

export default async (req: express.Request, res: express.Response) => {
	res.status(200).json(resbody);
};
