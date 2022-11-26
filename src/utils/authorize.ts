import { Request } from "express";
import { verify } from "jsonwebtoken";
import { APIError } from "./error";
import { UserModel } from "../resources/user/user.model";
import { User, UserResponse } from "../../types/user";

export const authorize = async ( req: Request ): Promise<UserResponse> => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const payload = verify(token, process.env.SECRET_JWT_SECRET as string) as any;

        if (Date.now() >= payload.exp * 1000) throw new APIError('Unauthorized', 'Unauthorized', 'Token expired');

        const user = await UserModel.findOne({_id: payload.user._id});
        if (!user) throw new APIError('Unauthorized', 'Unauthorized','Unauthorized');

        return user;
    } else {
        throw new APIError('BadRequest', 'Invalid', 'No token provided');
    }
}