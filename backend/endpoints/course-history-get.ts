import express from 'express';
import User from '../models/user.js';
import APIError from '../lib/api-errors.js';

interface CourseHistoryGetResponse {
	error: APIError,
	courses?: string[],
};

export default async (req: express.Request, res: express.Response) => {
	let resbody: CourseHistoryGetResponse = {
		error: APIError.BadRequest,
	};

	try {
		const result = await User.findById(req.params.userID, 'completedCourses').exec();
		resbody.courses = result.completedCourses;
	} catch (e) {
		res.status(400).json(resbody);
		return;
	}

	resbody.error = APIError.None;
	res.status(200).json(resbody);
};
