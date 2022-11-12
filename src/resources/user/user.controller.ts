import { NextFunction, Router } from "express";
import { UserService } from "./user.service";

import bcrypt from "bcrypt";
import { UserModel } from "./userModel";

export const UsersController = Router();

const userService = new UserService();

UsersController.post('/login', async (req, res, next: NextFunction) => {
    const users = await userService.find(req.body);

    res.status(200).json(users);
});

UsersController.post("/signup", async (req, res, next: NextFunction) => {
    const response = await userService.create(req.body);

    console.log('response', response);

    return res.status(200).send(response);
});