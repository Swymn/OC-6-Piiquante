import { Router } from "express";
import { UserService } from "~/resources/user/user.service";

export const UsersController = Router();

const userService = new UserService();

UsersController.get('/', async (req, res, next) => {
    const users = await userService.findAll();

    res.status(200).json(users);
});

UsersController.post("/create", async (req, res, next) => {
    const user = await userService.create(req.body);

    return res.status(200).send(user);
});