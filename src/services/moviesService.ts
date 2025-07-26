import { Request, Response } from "express"
import movieModel from "../models/movieModel";
import { isValidObjectId } from "mongoose";
import { error } from "console";
import { isImdbID } from "../utils/imdb";

export const getMovieByName = async (req: Request, res: Response) => {
    const apiKey = process.env.API_KEY;
    let title;
    if (!req.body.title || typeof req.body.title != 'string') return res.status(400).json({ error: "Invalid request, title is required" });
    title = req.body.title;
    try {
        const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`);
        const data = await response.json();
        if (data.Response == 'False') return res.status(404).json({ error: 'Movie not found' });
        // Strip response from video info
        delete data.Response;
        const movie = await movieModel.findOneAndUpdate({ imdbID: data.imdbID }, { $setOnInsert: data }, { upsert: true, new: true });
        return res.status(200).json(movie);
    } catch (err) {
        console.log("Error in fetch:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getMovieById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        if (isValidObjectId(id)) {
            const movie = await movieModel.findById(id);
            if (!movie) return res.status(404).json({ error: 'Movie not found' });
            return res.status(200).json(movie);
        }
        else if (isImdbID(id)) {
            const movie = await movieModel.findOne({ imdbID: id });
            if (!movie) return res.status(404).json({ error: 'Movie not found' });
            return res.status(200).json(movie);
        }
        else {
            return res.status(400).json({ error: 'Invalid request, id field is required' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}