import type { User } from "../../../types/user";
import { userModel } from "./user.model";

export class UserService {
    async create(userData: Omit<User, 'id'>): Promise<void> {

        /**
         * @TODO: Handle Errors
         */
        const user: User = {
            email: userData.email,
            password: userData.password,
        };

        await userModel.create(user);
    }

    async findAll(): Promise<User[]> {
        return userModel.find();
    }
}