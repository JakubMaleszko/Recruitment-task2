import request from 'supertest';
import { app } from '../app';
import commentModel from '../models/commentModel';
import movieModel from '../models/movieModel';
import mongoose from 'mongoose';

jest.mock('../models/commentModel');
jest.mock('../models/movieModel');

const mockComment = {
  _id: 'comment123',
  movie: '507f191e810c19729de860ea',
  content: 'This is a test comment',
};

const mockMovie = {
  _id: '507f191e810c19729de860ea',
  imdbID: 'tt1234567',
  title: 'Test Movie',
};

describe('Comment service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /comments', () => {
    it('Should return 400 if movieId is missing', async () => {
      const res = await request(app).post('/comments').send({ content: 'hello' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid request, movieId is required' });
    });

    it('Should return 400 if content is missing', async () => {
      const res = await request(app).post('/comments').send({ movieId: '507f191e810c19729de860ea' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid request, content is required' });
    });

    it('Should add comment with valid ObjectId', async () => {
      (commentModel.insertOne as jest.Mock).mockResolvedValue(mockComment);

      const res = await request(app)
        .post('/comments')
        .send({ movieId: '507f191e810c19729de860ea', content: 'hello' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockComment);
    });

    it('Should add comment with valid IMDb ID', async () => {
      (movieModel.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (commentModel.insertOne as jest.Mock).mockResolvedValue(mockComment);

      const res = await request(app)
        .post('/comments')
        .send({ movieId: 'tt1234567', content: 'hello' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockComment);
    });

    it('Should return 400 for invalid ID format', async () => {
      const res = await request(app)
        .post('/comments')
        .send({ movieId: 'invalid-id', content: 'hello' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid ID' });
    });

    it('Should return 500 if an exception occurs', async () => {
      (commentModel.insertOne as jest.Mock).mockImplementation(() => {
        throw new Error('Database failure');
      });

      const res = await request(app)
        .post('/comments')
        .send({ movieId: '507f191e810c19729de860ea', content: 'hello' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /comments', () => {
    it('Should return all comments when movieId is not provided', async () => {
      (commentModel.find as jest.Mock).mockResolvedValue([mockComment]);

      const res = await request(app).get('/comments');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockComment]);
    });

    it('Should return comments by Mongo ObjectId', async () => {
      (commentModel.find as jest.Mock).mockResolvedValue([mockComment]);

      const res = await request(app).get('/comments').query({ movieId: '507f191e810c19729de860ea' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockComment]);
    });

    it('Should return comments by IMDb ID', async () => {
      (movieModel.findOne as jest.Mock).mockResolvedValue(mockMovie);
      (commentModel.find as jest.Mock).mockResolvedValue([mockComment]);

      const res = await request(app).get('/comments').query({ movieId: 'tt1234567' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockComment]);
    });

    it('Should return 400 for invalid movieId format', async () => {
      const res = await request(app).get('/comments').query({ movieId: 'invalid-id' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid ID' });
    });

    it('Should return 500 if an exception occurs', async () => {
      (commentModel.find as jest.Mock).mockImplementation(() => {
        throw new Error('DB error');
      });

      const res = await request(app).get('/comments');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error' });
    });
  });
  afterAll(async () => {
  await mongoose.connection.close();
});
});
