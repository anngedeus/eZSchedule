import mongoose from 'mongoose';

export interface User {
	email: string,
	password: string,
	graduation?: string,
	completedCourses: string[],
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
});

export default mongoose.model('User', userSchema);
