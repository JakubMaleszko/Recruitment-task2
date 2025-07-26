import { Request, Response } from "express";
import commentModel from "../models/commentModel";
import { isValidObjectId } from "mongoose";
import movieModel from "../models/movieModel";
import { error } from "console";
import { isImdbID } from "../utils/imdb";

export const addComment = async (req: Request, res: Response) => {
    if (!req.body.movieId) return res.status(400).json({ error: "Invalid request, movieId is required" });
    if (!req.body.content) return res.status(400).json({ error: "Invalid request, content is required" });
    const movieId = req.body.movieId;
    const content = req.body.content;

    try {
        if (isValidObjectId(movieId)) {
            const comment = await commentModel.insertOne({
                movie: movieId,
                content
            });
            if (!comment) return res.status(404).json({ error: "Movie not found" });
            return res.status(200).json(comment);
        }
        //imdb id
        else if (isImdbID(movieId)) {
            const originMovie = await movieModel.findOne({ imdbID: movieId });
            const comment = await commentModel.insertOne({
                movie: originMovie?._id,
                content
            });
            if (!comment) return res.status(404).json({ error: "Movie not found" });
            return res.status(200).json(comment);
        }
        else {
            return res.status(400).json({ error: 'Invalid ID' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAllComments = async (req: Request, res: Response) => {
    const movieId = req.query.movieId as string;

    try {
        if (!movieId) {
            const comments = await commentModel.find();
            return res.status(200).json(comments);
        }
        else if (isValidObjectId(movieId)) {
            const comments = await commentModel.find({ movie: movieId })
            if (!comments) return res.status(404).json({ error: "Comment not found" });
            return res.status(200).json(comments);
        }
        //imdb id
        else if (isImdbID(movieId)) {
            const originMovie = await movieModel.findOne({ imdbID: movieId });
            const comments = await commentModel.find({ movie: originMovie?._id });
            if (!comments) return res.status(404).json({ error: "Comment not found" });
            return res.status(200).json(comments);
        }
        else {
            return res.status(400).json({ error: 'Invalid ID' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};