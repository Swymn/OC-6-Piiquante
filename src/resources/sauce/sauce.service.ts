import type { Sauce } from '../../../types/sauce';
import { isValidObjectId, Types } from "mongoose";
import { sauceModel } from "./sauce.model";
import { APIError } from "../../utils/error";
import mongoose from "mongoose";

export class SauceService {
    async create({sauce, image}: Sauce): Promise<Sauce> {
        if (!sauce) throw new APIError('Missing', 'Sauce is required');
        if (!image) throw new APIError('Missing', 'Image is required');

        const sauceToInsert: Sauce = {
            userId: "",
            sauce,
            manufacturer: "",
            description: "",
            mainPepper: "",
            image,
            heat: 0,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        }

        return sauceModel.create(sauceToInsert);
    }

    async findAll(): Promise<Sauce[]> {
        return sauceModel.find();
    }

    async findOne(id: string): Promise<Sauce | null> {
        if (!id) throw new APIError('Missing', 'Id is required');
        if (!isValidObjectId(id)) throw new APIError('Invalid', 'Id is not valid');
        return sauceModel.findOne({_id: id});
    }

    async delete(id: string): Promise<any> {
        if (!id) throw new APIError('Missing', 'Id is required');
        return sauceModel.deleteOne({_id: id});
    }

    async update(id: string, {sauce, image}: Sauce): Promise<any> {
        if (!id) throw new APIError('Missing', 'Id is required');
        if (!sauce) throw new APIError('Missing', 'Sauce is required');

        return sauceModel.updateOne({_id: id}, {sauce, image});
    }

    async like(id: string, {userId, like}: { userId: string, like: number }): Promise<Sauce> {
        if (!id) throw new APIError('Missing', 'Id is required');
        if (!like) throw new APIError('Missing', 'Like is required');

        const sauce = await sauceModel.findOne({_id: id});

        if (!sauce) throw new APIError('NotFound', 'Sauce not found');

        switch (like) {
            case -1:
                sauce.usersDisliked.push(userId);
                sauce.dislikes++;
                if (sauce.usersLiked.indexOf(userId) !== -1) {
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                    sauce.likes--;
                }
                break;
            case 0:
                if (sauce.usersLiked.indexOf(userId) !== -1) {
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                    sauce.likes--;
                } else if (sauce.usersDisliked.indexOf(userId) !== -1) {
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                    sauce.dislikes--;
                }
                break;
            case 1:
                sauce.usersLiked.push(userId);
                sauce.likes++;
                if (sauce.usersDisliked.indexOf(userId) !== -1) {
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                    sauce.dislikes--;
                }
                break;
            default:
                throw new APIError('Invalid', 'Like must be -1, 0 or 1');

        }

        return sauce.save();
    }
}