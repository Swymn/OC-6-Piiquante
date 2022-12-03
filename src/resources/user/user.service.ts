import type { User } from "../../../types/user";
import { UserModel } from "./user.model";
import { CallbackError, MongooseError } from "mongoose";
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
        if (!userData.email) throw new APIError("NotAcceptable", 'Missing', 'Email is required');
        if (!userData.password) throw new APIError("NotAcceptable", 'Missing', 'Password is required');

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
            throw new APIError(
                "Conflict",
                "Conflict",
                (error as any).message ?? "An error occurred while creating the user"
            );
        }
    }

    /**
     * Find a user by its email.
     *
     * @param user {User} - The user data
     *
     * @returns {Promise<User>} A promise to the user
     *
     * @throws {APIError} If the parameters are invalid
     * @throws {APIError} If the user is not found
     * @throws {APIError} If the password is not valid
     */
    async findOne(user: User): Promise<User> {

        if (!user.email) throw new APIError("NotAcceptable", 'Missing', 'Email is required');
        if (!user.password) throw new APIError("NotAcceptable", 'Missing', 'Password is required');

        const userDB = await UserModel.findOne({email: user.email});

        if (!userDB) throw new APIError("NotFound", 'NotFound', 'User not found');

        if (!bcrypt.compareSync(user.password, userDB.password)) throw new APIError("NotAcceptable", 'Invalid', 'Invalid password');

        return userDB;
    }
}