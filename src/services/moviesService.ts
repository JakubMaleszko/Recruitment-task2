import { Request, Response } from "express"
import movieModel from "../models/movieModel";

export const getMovieByName = async (req: Request, res: Response) => {
    const apiKey = process.env.API_KEY;
    let title;
    if (req.body.title && typeof req.body.title == 'string') {
        title = req.body.title;
    }
    else {
        res.status(400).json({ error: "Invalid request, title is required" })
    }

    try {
        const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`);
        const data = await response.json();

        if (data.Response == 'True') {
            // Strip response from video info
            delete data.Response;
            await movieModel.findOneAndUpdate({imdbID: data.imdbID}, {$setOnInsert: data}, {upsert: true});
            return res.status(200).json(data);
        }
        else {
            return res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.log("Error in fetch:", err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getMovieById = (req: Request, res: Response) => {

}