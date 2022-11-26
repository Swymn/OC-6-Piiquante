import type { Sauce } from '../../../types/sauce';
import { isValidObjectId } from "mongoose";
import { sauceModel } from "./sauce.model";
import { APIError } from "../../utils/error";
import { UserResponse } from "../../../types/user";

interface ICreate {
    userId: string;
    name: string;
    manufacturer: string;
    description: string;
    mainPepper: string;
    heat: number;
}

export class SauceService {
    async create({ userId, name, manufacturer, description, mainPepper, heat }: ICreate, image: Express.Multer.File | undefined): Promise<Sauce> {
        if (!name) throw new APIError("BadRequest", 'Missing', 'Sauce is required');

        const sauceToInsert: Sauce = {
            userId: userId ?? "",
            name: name,
            manufacturer: manufacturer,
            description: description,
            mainPepper: mainPepper,
            imageUrl: image ? `${process.env.HOST}:${process.env.PORT}/${image.path.replace(/\\/g, '/')}` : "",
            heat: heat,
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

    async findOne(id: string): Promise<Sauce> {
        if (!id) throw new APIError("BadRequest",'Missing', 'Id is required');
        if (!isValidObjectId(id)) throw new APIError("BadRequest", 'Invalid', 'Id is not valid');

        const sauce = await sauceModel.findOne({_id: id});

        if (!sauce) throw new APIError("NotFound", 'NotFound', 'Sauce not found');

        return sauce;
    }

    async delete(id: string): Promise<any> {
        if (!id) throw new APIError("BadRequest",'Missing', 'Id is required');
        return sauceModel.deleteOne({_id: id});
    }

    async update(id: string, user: UserResponse, sauce: any, image: Express.Multer.File | undefined): Promise<any> {
        if (!id) throw new APIError("BadRequest",'Missing', 'Id is required');
        if (!sauce) throw new APIError("BadRequest",'Missing', 'Sauce is required');

        if (!isValidObjectId(id)) throw new APIError("BadRequest", 'Invalid', 'Id is not valid');

        const sauceDB = await sauceModel.findOne({_id: id}) as Sauce;

        if (!sauce) throw new APIError("NotFound", 'NotFound', 'Sauce not found');
        if (sauceDB.userId !== user._id) throw new APIError("Forbidden", 'Forbidden', 'You are not allowed to update this sauce');

        return sauceModel.updateOne({_id: id}, {
            name: sauce.name ?? sauceDB.name,
            manufacturer: sauce.manufacturer ?? sauceDB.manufacturer,
            description: sauce.description ?? sauceDB.description,
            mainPepper: sauce.mainPepper ?? sauceDB.mainPepper,
            heat: sauce.heat ?? sauceDB.heat,
            imageUrl: image ? image.path.replace(/\\/g, '/') : sauceDB.imageUrl,
        });
    }

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