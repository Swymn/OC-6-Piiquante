import type { User } from "~~/types/user";
import { userModel } from "~/resources/user/user.model";

export class UserService {
    async create(userData: Omit<User, 'id'>): Promise<User> {

        /**
         * @TODO: Handle Errors
         */
        const user: User = {
            email: userData.email,
            password: userData.password,
        };

        return userModel.create(user);
    }

    async findAll(): Promise<User[]> {
        return userModel.find();
    }
}