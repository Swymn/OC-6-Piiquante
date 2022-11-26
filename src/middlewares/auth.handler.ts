import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserModel } from "../resources/user/user.model";

export const authorize = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({error: 'Unauthorized - No token provided'});

    const payload = verify(token, process.env.SECRET_JWT_SECRET as string) as any;

    if (Date.now() >= payload.exp * 1000) return res.status(401).json({error: 'Unauthorized - Token expired'});

    const user = await UserModel.findOne({_id: payload.user._id});
    if (!user) return res.status(401).json({error: 'Unauthorized - User not found'});

    (req as any).user = {
        _id: user._id.toString(),
        email: user.email,
        password: user.password,
    };

    return next();

}