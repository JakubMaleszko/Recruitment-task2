import request from 'supertest';
import { app } from '../app';
import movieModel from '../models/movieModel';
import mongoose from 'mongoose';

jest.mock('../models/movieModel');

// Mock movie object used across tests
const mockMovie = {
    _id: '123',
    imdbID: 'tt1234567',
    title: 'Test Movie',
};

// Mock OMDb API response
global.fetch = jest.fn(() =>
    Promise.resolve(
        new Response(
            JSON.stringify({
                title: 'Test Title',
                Response: 'True',
                imdbID: 'tt1234567',
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    )
);

describe('Movie Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /movies', () => {
        it('Should respond with 200 on valid title', async () => {
            (movieModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockMovie);

            const res = await request(app)
                .post('/movies')
                .send({ title: 'Test Title' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMovie);
        });

        it('Should respond with 400 if title is missing', async () => {
            const res = await request(app)
                .post('/movies')
                .send();

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: 'Invalid request, title is required',
            });
        });

        it('Should respond with 400 on db error', async () => {
            (movieModel.findOneAndUpdate as jest.Mock).mockImplementation(() => {
                throw new Error('DB error');
            })

            const res = await request(app)
                .post('/movies')
                .send({ title: 'Test Title' });

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Internal server error' });
        });
    });

    describe('GET /movies/:id', () => {
        it('Should return 200 for valid MongoDB ObjectId', async () => {
            (movieModel.findById as jest.Mock).mockResolvedValue(mockMovie);

            const res = await request(app).get(
                '/movies/507f191e810c19729de860ea'
            );

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMovie);
            expect(movieModel.findById).toHaveBeenCalledWith(
                '507f191e810c19729de860ea'
            );
        });

        it('Should return 200 for valid IMDb ID', async () => {
            (movieModel.findOne as jest.Mock).mockResolvedValue(mockMovie);

            const res = await request(app).get('/movies/tt1234567');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMovie);
            expect(movieModel.findOne).toHaveBeenCalledWith({
                imdbID: 'tt1234567',
            });
        });

        it('Should return 404 if movie not found by ObjectId', async () => {
            (movieModel.findById as jest.Mock).mockResolvedValue(null);

            const res = await request(app).get(
                '/movies/507f191e810c19729de860ea'
            );

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Movie not found' });
        });

        it('Should return 404 if movie not found by IMDb ID', async () => {
            (movieModel.findOne as jest.Mock).mockResolvedValue(null);

            const res = await request(app).get('/movies/tt9999999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Movie not found' });
        });

        it('Should return 400 for invalid ID format', async () => {
            const res = await request(app).get('/movies/invalid!id123');

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: 'Invalid request, id field is required',
            });
        });

        it('Should return 500 if DB error occurs in findById', async () => {
            (movieModel.findById as jest.Mock).mockImplementation(() => {
                throw new Error('DB error');
            });

            const res = await request(app).get(
                '/movies/507f191e810c19729de860ea'
            );

            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Internal server error' });
        });
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
