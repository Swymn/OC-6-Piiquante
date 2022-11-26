import { NextFunction, Router } from "express";
import { UserService } from "./user.service";
import { sign } from "jsonwebtoken";
import { request } from "../../utils/request";

export const UsersController = Router();

const userService = new UserService();

UsersController.post('/login', async (req, res, next: NextFunction) => {
    await request(res, async () => {
        const user = await userService.findOne(req.body);

        res.status(200).json({
            userId: user._id,
            token: sign({user}, process.env.SECRET_JWT_SECRET as string, {expiresIn: '24h'})
        });
    });
});

UsersController.post("/signup", async (req, res, next: NextFunction) => {
    await request(res, async () => {
        const response = await userService.create(req.body);

        return res.status(200).send(response);
    });
});