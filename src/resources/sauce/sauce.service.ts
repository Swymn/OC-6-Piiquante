import type { Sauce, SauceRequest } from '../../../types/sauce';
import { isValidObjectId } from "mongoose";
import { sauceModel } from "./sauce.model";
import { APIError } from "../../utils/error";
import { User } from "../../../types/user";

interface ICreate {
    userId: string;
    name: string;
    manufacturer: string;
    description: string;
    mainPepper: string;
    heat: number;
}

export class SauceService {
    /**
     * Create a sauce
     *
     * @param userId {string} User id
     * @param name {string} Sauce name
     * @param manufacturer {string} Sauce manufacturer
     * @param description {string} Sauce description
     * @param mainPepper {string} Sauce main pepper
     * @param heat {number} Sauce heat
     * @param image {Express.Multer.File} Sauce image
     *
     * @returns {Promise<Sauce>} Sauce
     *
     * @throws {APIError} BadRequest - Missing or invalid parameters
     */
    async create({ userId, name, manufacturer, description, mainPepper, heat }: ICreate, image: Express.Multer.File | undefined): Promise<Sauce> {
        if (!name) throw new APIError("BadRequest", 'Missing', 'Sauce is required');

        const sauceToInsert: SauceRequest = {
            userId: userId ?? "",
            name: name,
            manufacturer: manufacturer,
            description: description,
            mainPepper: mainPepper,
            imageUrl: image ? `http://localhost:3000/${image.path.replace(/\\/g, '/')}` : "",
            heat: heat,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        }

        return sauceModel.create(sauceToInsert);
    }

    /**
     * Get all sauces
     *
     * @returns {Promise<Sauce[]>} Sauces
     */
    async findAll(): Promise<Sauce[]> {
        return sauceModel.find();
    }

    /**
     * Get a sauce by id
     *
     * @param id {string} Sauce id
     *
     * @returns {Promise<Sauce>} Sauce
     *
     * @throws {APIError} BadRequest - Missing or invalid parameters
     * @throws {APIError} NotFound - Sauce not found
     */
    async findOne(id: string): Promise<Sauce> {
        if (!id) throw new APIError("BadRequest",'Missing', 'Id is required');
        if (!isValidObjectId(id)) throw new APIError("BadRequest", 'Invalid', 'Id is not valid');

        const sauce = await sauceModel.findOne({_id: id});

        if (!sauce) throw new APIError("NotFound", 'NotFound', 'Sauce not found');

        return sauce;
    }

    /**
     * Delete a sauce by id
     *
     * @param id {string} Sauce id
     *
     * @returns {Promise<any>} Delete result
     *
     * @throws {APIError} BadRequest - Missing or invalid parameters
     */
    async delete(id: string): Promise<any> {
        if (!id) throw new APIError("BadRequest",'Missing', 'Id is required');
        return sauceModel.deleteOne({_id: id});
    }

    /**
     * Update a sauce by id
     *
     * @param id {string} Sauce id
     * @param user {User} User
     * @param sauce {SauceRequest} Sauce
     * @param image {Express.Multer.File} Sauce image
     *
     * @returns {Promise<any>} Sauce
     *
     * @throws {APIError} BadRequest - Missing or invalid parameters
     * @throws {APIError} NotFound - Sauce not found
     * @throws {APIError} Unauthorized - User is not the owner of the sauce
     */
    async update(id: string, user: User, sauce: SauceRequest, image: Express.Multer.File | undefined): Promise<any> {
        if (!id) throw new APIError("BadRequest",'Missing', 'Id is required');
        if (!sauce) throw new APIError("BadRequest",'Missing', 'Sauce is required');

        if (!isValidObjectId(id)) throw new APIError("BadRequest", 'Invalid', 'Id is not valid');

        const sauceDB = await sauceModel.findOne({_id: id}) as Sauce;

        if (!sauce) throw new APIError("NotFound", 'NotFound', 'Sauce not found');
        if (sauceDB.userId !== user._id) throw new APIError("Unauthorized", 'Unauthorized', 'You are not allowed to update this sauce');

        return sauceModel.updateOne({_id: id}, {
            name: sauce.name ?? sauceDB.name,
            manufacturer: sauce.manufacturer ?? sauceDB.manufacturer,
            description: sauce.description ?? sauceDB.description,
            mainPepper: sauce.mainPepper ?? sauceDB.mainPepper,
            heat: sauce.heat ?? sauceDB.heat,
            imageUrl: image ? image.path.replace(/\\/g, '/') : sauceDB.imageUrl,
        });
    }

    /**
     * Like a sauce
     *
     * @param id {string} Sauce id
     * @param userId {string} User id
     * @param like {number} Like
     *
     * @returns {Promise<Sauce>} Sauce
     *
     * @throws {APIError} BadRequest - Missing or invalid parameters
     * @throws {APIError} NotFound - Sauce not found
     * @throws {APIError} BadRequest - Like is not valid
     */
    async like(id: string, userId: string, {like}: { like: number }): Promise<Sauce> {
        if (!id) throw new APIError("BadRequest",'Missing', 'Id is required');
        if (!userId) throw new APIError("BadRequest",'Missing', 'User is required');
        if (isNaN(like)) throw new APIError("BadRequest",'Missing', 'Like is required');

        if (!isValidObjectId(id)) throw new APIError("BadRequest", 'Invalid', 'Id is not valid');

        const sauce = await sauceModel.findOne({_id: id});

        if (!sauce) throw new APIError("NotFound", 'NotFound', 'Sauce not found');

        const removeLike = () => {
            if (sauce.usersLiked.indexOf(userId) !== -1) {
                sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                sauce.likes--;
            }
        }

        const removeDislike = () => {
            if (sauce.usersDisliked.indexOf(userId) !== -1) {
                sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                sauce.dislikes--;
            }
        }

        switch (like) {
            case -1:
                if (sauce.usersDisliked.indexOf(userId) !== -1) throw new APIError("BadRequest", 'Invalid', 'User already disliked');
                sauce.usersDisliked.push(userId);
                sauce.dislikes++;
                removeLike();
                break;
            case 0:
                removeLike();
                removeDislike();
                break;
            case 1:
                if (sauce.usersLiked.indexOf(userId) !== -1) throw new APIError("BadRequest", 'Invalid', 'User already liked');
                sauce.usersLiked.push(userId);
                sauce.likes++;
                removeDislike();
                break;
            default:
                throw new APIError("BadRequest", 'Invalid', 'Like must be -1, 0 or 1');
        }

        return sauce.save();
    }
}