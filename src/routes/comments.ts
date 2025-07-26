import express from 'express'
import { addComment, getAllComments } from '../services/commentsService';

const commentsRouter = express();

commentsRouter.post('/', addComment);
commentsRouter.get('/', getAllComments);

export default commentsRouter;