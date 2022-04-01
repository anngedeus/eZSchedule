import User from '../models/user.js';
import express from 'express';
import APIError from '../lib/api-errors.js';

interface CreateUserRequest {
	email: string,
	password: string, // FIXME: this is insecure
};

namespace CreateUserRequest {
	export function isValid(obj: any): obj is CreateUserRequest {
		return typeof obj === 'object' && typeof obj.email === 'string' && typeof obj.password === 'string';
	}
};

interface CreateUserResponse {
	error: APIError,
	userID?: string,
};

export default async (req: express.Request, res: express.Response) => {
	let resbody: CreateUserResponse = {
		error: APIError.BadRequest,
	};

	if (!CreateUserRequest.isValid(req.body)) {
		res.status(400).json(resbody);
		return;
	}

	try {
		const user = await User.create({
			email: req.body.email,
			password: req.body.password,
			completedCourses: [],
		});
		resbody.userID = user.id;
	} catch (e) {
		res.status(400).json(resbody);
		return;
	}

	resbody.error = APIError.None;
	res.status(200).json(resbody);
};
