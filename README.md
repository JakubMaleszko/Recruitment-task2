# Recruitment-task2
This application uses the following technologies:
-  `Node.js`
-  `npm`
-  `Jest` – for testing
-  `MongoDB` – db
---
## Required Environment Variables
Before running the application, make sure to set the following environment variables:

-  `PORT` – the port your application will run on

-  `MONGODB_URI` – the URI for your MongoDB instance

-  `API_KEY` – the [OMDb](https://www.omdbapi.com/) api key
---
## Installing Dependencies
To install dependencies:
```bash
npm  install
```
## Running the application
To build use:
```bash
npm  run  build
```
To build and run:
```bash
npm  run  start
```

To run in watch mode :

```bash
npm  run  dev
```

## Testing application

To run tests use:

```bash
npm  run  test
```

## API Endpoints

###  POST `/movies`

Fetches movie details by title from the [OMDb API](https://www.omdbapi.com/) and stores them in the database.

**Request Body:**
```json
{
  "title": "Movie Title"
}
```
**Returns:**

- Movie details from OMDb (e.g., imdbID, Title, Year, etc.)
- Inserts into DB if not already stored
---
### GET `/movies/:id`
Retrieves a movie by **either MongoDB ObjectId or IMDb ID.**

**Path Parameters:**
- `id` – MongoDB _id or IMDb imdbID

**Returns:**
 - Movie details
---
### POST `/comments`
Adds a comment to a movie.

**Request Body:**
```json
{
  "movieId": "ObjectId or imdbID",
  "content": "Your comment here"
}
```
**Returns:**

 - Created comment object
---
### GET `/comments?movieId=...`
Fetches comments for a specific movie (optional), or all comments if no movieId is provided.

**Query Parameters:**

- `movieId` – MongoDB ObjectId or IMDb ID **(optional)**

**Returns:**
- List of comments