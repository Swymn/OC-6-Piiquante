import { NextFunction, Router } from "express";
import { UserService } from "./user.service";
import { sign } from "jsonwebtoken";

export const UsersController = Router();

const userService = new UserService();

UsersController.post('/login', async (req, res, next: NextFunction) => {
    const user = await userService.find(req.body);

    res.status(200).json({
        user,
        token: sign({user}, process.env.SECRET_JWT_SECRET as string, {expiresIn: '24h'})
    });
});

UsersController.post("/signup", async (req, res, next: NextFunction) => {
    const response = await userService.create(req.body);

    return res.status(200).send(response);
});