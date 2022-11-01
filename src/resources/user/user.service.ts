import type { User } from "../../../types/user";
import { UserModel } from "./userModel";
import { CallbackError } from "mongoose";
import bcrypt from "bcrypt";
import { APIError } from "../../utils/error";

export class UserService {
    async create(userData: User): Promise<any> {

        if (!userData.email) throw new APIError('Missing', 'Email is required');
        if (!userData.password) throw new APIError('Missing', 'Password is required');

        const user = new UserModel({
            email: userData.email,
            password: userData.password,
        });
        user.save((err: CallbackError) => {
            if (err) throw new Error(err.message);

        });

        return {
            message: 'User created',
        }
    }

    async find(user: User): Promise<any> {

        if (!user.email) throw new APIError('Missing', 'Email is required');
        if (!user.password) throw new APIError('Missing', 'Password is required');
        const userDB: User | null = await UserModel.findOne({email: user.email}, (error: CallbackError) => {
            if (error) throw new APIError('Server', error.message);
        }).clone();

        if (!userDB) throw new APIError('NotFound', 'User not found');

        if (!bcrypt.compareSync(user.password, userDB.password)) throw new APIError('Invalid', 'Invalid password');

        return {
            userId: (userDB as any)._id,
            token: 'token',
        }
    }
}