import express from 'express';
import User from '../models/user.js';
import APIError from '../lib/api-errors.js';

interface CourseHistoryAddRequest {
	courseCodes: string[],
};

const isStringArray = (arr: any): arr is string[] => {
	return Array.isArray(arr) && arr.every(i => typeof i === 'string');
};

namespace CourseHistoryAddRequest {
	export function isValid(obj: any): obj is CourseHistoryAddRequest {
		return typeof obj === 'object' && isStringArray(obj.courseCodes);
	}
};

interface CourseHistoryAddResponse {
	error: APIError,
};

export default async (req: express.Request, res: express.Response) => {
	let resbody: CourseHistoryAddResponse = {
		error: APIError.BadRequest,
	};

	if (!CourseHistoryAddRequest.isValid(req.body)) {
		res.status(400).json(resbody);
		return;
	}

	try {
		await User.updateOne({
			_id: req.params.userID,
		}, {
			$addToSet: {
				completedCourses: {
					$each: req.body.courseCodes,
				},
			},
		}).exec();
	} catch (e) {
		res.status(400).json(resbody);
		return;
	}

	resbody.error = APIError.None;
	res.status(200).json(resbody);
};
