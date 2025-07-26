import express from "express"
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import moviesRouter from "./routes/movies";
import commentsRouter from "./routes/comments";

dotenv.config({quiet: true});
export const app = express();
const uri = process.env.MONGODB_URI || '';
mongoose.connect(uri).then(() => console.log("MongoDB connected")).catch((err) => console.log("Error connecting to MongoDB:", err));
app.use(express.json());
app.use(cors());

app.use('/movies', moviesRouter);
app.use('/comments', commentsRouter);