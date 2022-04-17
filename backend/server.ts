import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt, Strategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import User, { JWTPayload } from './models/user.js';
import APIResponse from './lib/api-response.js';
import APIError from './lib/api-errors.js';

import createUserHandler from './endpoints/create-user.js';
import courseHistoryAddHandler from './endpoints/course-history-add.js';
import courseHistoryDeleteHandler from './endpoints/course-history-delete.js';
import courseHistoryGetHandler from './endpoints/course-history-get.js';
import userLoginHandler from './endpoints/user-login.js';

config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
await mongoose.connect(uri);
console.log("MongoDB database connection established successfully");

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
	if (!JWTPayload.isValid(jwtPayload)) {
		done(null, null);
		return;
	}
	try {
		const userExists = await User.exists({
			_id: jwtPayload.id,
		}).exec();
		if (userExists) {
			done(null, { id: jwtPayload.id });
		} else {
			done(null, null);
		}
	} catch (e) {
		done(e, null);
	}
}));

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	session: false,
}, async (username, password, done) => {
	try {
		const user = await User.findOne({
			email: username,
		}, 'password').exec();
		if (!user) {
			done(null, null);
			return;
		}
		if (await bcrypt.compare(password, user.password)) {
			done(null, { id: user.id });
		} else {
			done(null, null);
		}
	} catch (e) {
		done(e, null);
	}
}));

function handleAuthentication(type: string, req: express.Request, res: express.Response, next: express.NextFunction) {
	passport.authenticate(type, { session: false }, (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			const body: APIResponse = {
				error: APIError.Unauthenticated,
			};
			res.status(401).json(body);
			return;
		}

		req.user = user;
		next();
	})(req, res, next);
}

function loginUser(req: express.Request, res: express.Response, next: express.NextFunction) {
	handleAuthentication('local', req, res, next);
}

function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
	handleAuthentication('jwt', req, res, next);
}

app.post('/api/create-user', createUserHandler);
app.post('/api/user-login', loginUser, userLoginHandler);
app.get('/api/course-history', authenticateUser, courseHistoryGetHandler);
app.post('/api/course-history', authenticateUser, courseHistoryAddHandler);
app.delete('/api/course-history', authenticateUser, courseHistoryDeleteHandler);

app.use(express.static('../frontend/build'));

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
