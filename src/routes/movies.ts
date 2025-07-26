import express from 'express'
import { getMovieById, getMovieByName } from '../services/moviesService';

const moviesRouter = express();

moviesRouter.post('/', getMovieByName);
moviesRouter.get('/:id', getMovieById);


export default moviesRouter;