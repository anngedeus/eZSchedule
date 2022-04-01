import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import createUserHandler from './endpoints/create-user.js';
import courseHistoryAddHandler from './endpoints/course-history-add.js';
import courseHistoryDeleteHandler from './endpoints/course-history-delete.js';
import courseHistoryGetHandler from './endpoints/course-history-get.js';

config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
await mongoose.connect(uri);
console.log("MongoDB database connection established successfully");

// TODO: authentication

app.post('/api/create-user', createUserHandler);
app.get('/api/course-history/:userID', courseHistoryGetHandler);
app.post('/api/course-history/:userID', courseHistoryAddHandler);
app.delete('/api/course-history/:userID', courseHistoryDeleteHandler);

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
