import { NextFunction, Router } from "express";
import { UserService } from "./user.service";

export const UsersController = Router();

const userService = new UserService();

UsersController.get('/login', async (req, res, next: NextFunction) => {
    const users = await userService.find(req.body);

    res.status(200).json(users);
});

UsersController.post("/signup", async (req, res, next: NextFunction) => {
    const user = await userService.create(req.body);

    return res.status(200).send(user);
});