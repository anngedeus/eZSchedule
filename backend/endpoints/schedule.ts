import express from 'express';
import User from '../models/user.js';
import APIError from '../lib/api-errors.js';
import APIResponse from '../lib/api-response.js';
import { tsort, generateCS, generateCE, filterCourses, csPrereqs, cePrereqs } from '../lib/tsort.js';

interface ScheduleResponse extends APIResponse {
	schedule?: string[][],
};

export default async (req: express.Request, res: express.Response) => {
	let resbody: ScheduleResponse = {
		error: APIError.BadRequest,
	};

	try {
		const result = await User.findById(req.user.id, 'completedCourses major').exec();

		if (!result.major) {
			res.status(400).json(resbody);
			return;
		}

		let preReqs: any = null;
		if (result.major === 'CPS_BSCS') {
			preReqs = generateCS(csPrereqs);
		} else if (result.major === 'CPE_BSCE') {
			preReqs = generateCE(cePrereqs);
		}
		let left = filterCourses(result.completedCourses, preReqs, result.major);

		resbody.schedule = left;
	} catch (e) {
		console.log(e);
		res.status(400).json(resbody);
		return;
	}

	resbody.error = APIError.None;
	res.status(200).json(resbody);
};
