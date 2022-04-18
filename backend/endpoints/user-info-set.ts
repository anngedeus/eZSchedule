import express from 'express';
import User from '../models/user.js';
import APIError from '../lib/api-errors.js';
import APIResponse from '../lib/api-response.js';

interface UserInfoSetRequest {
	name?: string,
	major?: string,
};

namespace UserInfoSetRequest {
	export function isValid(obj: any): obj is UserInfoSetRequest {
		if (typeof obj !== 'object') {
			return false;
		}
		if ('name' in obj && typeof obj.name !== 'string') {
			return false;
		}
		if ('major' in obj && typeof obj.major !== 'string') {
			return false;
		}
		return true;
	}
};

export default async (req: express.Request, res: express.Response) => {
	let resbody: APIResponse = {
		error: APIError.BadRequest,
	};

	if (!UserInfoSetRequest.isValid(req.body)) {
		res.status(400).json(resbody);
		return;
	}

	if (!req.body.major && !req.body.name) {
		resbody.error = APIError.None;
		res.status(200).json(resbody);
		return;
	}

	try {
		let setTarget: any = {};
		if (req.body.major) {
			setTarget.major = req.body.major;
		}
		if (req.body.name) {
			setTarget.name = req.body.name;
		}
		await User.updateOne({
			_id: req.user.id,
		}, setTarget).exec();
	} catch (e) {
		res.status(400).json(resbody);
		return;
	}

	resbody.error = APIError.None;
	res.status(200).json(resbody);
};
