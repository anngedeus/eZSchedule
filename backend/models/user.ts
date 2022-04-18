import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const jwtSign = <(payload: string | Buffer | object, secretOrPrivateKey: jwt.Secret, options?: jwt.SignOptions) => Promise<string>>promisify(jwt.sign);

export interface JWTPayload {
	id: string,
};

export namespace JWTPayload {
	export function isValid(obj: any): obj is JWTPayload {
		return typeof obj === 'object' && typeof obj.id === 'string';
	}
};

export async function generateTokenForID(id: string) {
	const payload: JWTPayload = {
		id,
	};
	return await jwtSign(payload, process.env.JWT_SECRET, {
		expiresIn: 86400, // 86400 seconds in 1 day
	});
};

export interface User {
	email: string,
	password: string,
	graduation?: string,
	completedCourses: string[],
	major?: string,
	name: string,
	generateToken: () => Promise<string>,
};

const userSchema = new mongoose.Schema<User>({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3,
	},
	password: {
		type: String,
		required: true,
	},
	graduation: {
		type: String,
		required: false,
		trim: true,
		maxlength: 6, //MMYYYY
	},
	completedCourses: {
		type: Array (String),
		required: true,
	},
	major: {
		type: String,
		required: false,
	},
	name: {
		type: String,
		required: true,
	},
});

userSchema.methods.generateToken = async function(this: mongoose.Document<User>) {
	return generateTokenForID(this.id);
};

export default mongoose.model('User', userSchema);
