import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { UnknownRoutesHandler } from "./middlewares/unknownRoutes.handler";
import { ExceptionsHandler } from "./middlewares/exceptions.handler";

import { UsersController } from "./resources/user/user.controller";
import { SaucesController } from "./resources/sauce/sauce.controller";

dotenv.config({
    path: '.env',
});

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || '';

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// We use cors to allow cross-origin requests
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Home route
app.get('/', (req, res) => res.send('🏠'));

app.use('/api/auth', UsersController);
app.use('/api/sauces', SaucesController);

// Handle unknown routes
app.all('*', UnknownRoutesHandler);

// /!\ This middleware must be the last one /!\ //
app.use(ExceptionsHandler);

mongoose.connect(mongoURI, {

}, () => {
    console.log('Connected to MongoDB');
})

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));