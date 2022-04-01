import express from 'express';
import User from '../models/user.js';
import APIError from '../lib/api-errors.js';

interface CourseHistoryDeleteRequest {
	courseCodes: string[],
};

const isStringArray = (arr: any): arr is string[] => {
	return Array.isArray(arr) && arr.every(i => typeof i === 'string');
};

namespace CourseHistoryDeleteRequest {
	export function isValid(obj: any): obj is CourseHistoryDeleteRequest {
		return typeof obj === 'object' && isStringArray(obj.courseCodes);
	}
};

interface CourseHistoryDeleteResponse {
	error: APIError,
};

export default async (req: express.Request, res: express.Response) => {
	let resbody: CourseHistoryDeleteResponse = {
		error: APIError.BadRequest,
	};

	if (!CourseHistoryDeleteRequest.isValid(req.body)) {
		res.status(400).json(resbody);
		return;
	}

	try {
		await User.updateOne({
			_id: req.params.userID,
		}, {
			$pull: {
				completedCourses: {
					$in: req.body.courseCodes,
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
