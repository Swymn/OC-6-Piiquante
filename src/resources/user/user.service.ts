import type { User } from "../../../types/user";
import { UserModel } from "./userModel";
import { CallbackError } from "mongoose";
import { APIError } from "../../utils/error";
import bcrypt from "bcrypt";

export class UserService {
    /**
     * Create a new user
     *
     * @param {User} userData - The user data
     *
     * @returns {Promise<any>} A promise to the user
     *
     * @throws {APIError} If the parameters are invalid
     */
    async create(userData: User): Promise<any> {

        if (!userData.email) throw new APIError('Missing', 'Email is required');
        if (!userData.password) throw new APIError('Missing', 'Password is required');

        const hash = await bcrypt.hash(userData.password, 10);

        const user = new UserModel({
            email: userData.email,
            password: hash
        });

        try {
            await user.save();
            return {
                message: 'User created !'
            }
        } catch (error) {
            throw new APIError('Unknown', "An error occurred while creating the user");
        }
    }

    async find(user: User): Promise<User> {

        if (!user.email) throw new APIError('Missing', 'Email is required');
        if (!user.password) throw new APIError('Missing', 'Password is required');
        const userDB: User | null = await UserModel.findOne({email: user.email}, (error: CallbackError) => {
            if (error) throw new APIError('Server', error.message);
        }).clone();

        if (!userDB) throw new APIError('NotFound', 'User not found');

        if (!bcrypt.compareSync(user.password, userDB.password)) throw new APIError('Invalid', 'Invalid password');

        return userDB;
    }
}