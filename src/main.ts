import express from "express"
import dotenv from 'dotenv'
import mongoose, { mongo } from 'mongoose'
import moviesRouter from "./routes/movies";

dotenv.config({quiet: true});
const app = express();
const uri = process.env.MONGODB_URI || '';
mongoose.connect(uri).then(() => console.log("MongoDB connected")).catch((err) => console.log("Error connecting to MongoDB:", err));
const port = process.env.PORT;
app.use(express.json());

app.use('/movies', moviesRouter);

app.listen(port, () => {
    console.log("App listening on port:", port);
});