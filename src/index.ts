import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as process from "process";
import {UnknownRoutesHandler} from "~/middlewares/unknownRoutes.handler";
import {ExceptionsHandler} from "~/middlewares/exceptions.handler";

dotenv.config({
    path: '.env',
});

const app = express();
const port = process.env.PORT || 3000;

// We use cors to allow cross-origin requests
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => res.send('🏠'));

// Handle unknown routes
app.all('*', UnknownRoutesHandler);

// /!\ This middleware must be the last one /!\ //
app.use(ExceptionsHandler);

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));