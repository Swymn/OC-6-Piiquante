import type { Sauce } from '../../../types/sauce';
import { sauceModel } from "./sauce.model";

export class SauceService {
    async create(sauceData: Omit<Sauce, 'id'>): Promise<Sauce> {

        /**
         * @TODO: Handle Errors, check if there is an better way to convert string into array.
         */
        const sauce: Sauce = {
            userId: sauceData.userId,
            name: sauceData.name,
            manufacturer: sauceData.manufacturer,
            description: sauceData.description,
            mainPepper: sauceData.mainPepper,
            imageUrl: sauceData.imageUrl,
            heat: Number.parseInt(String(sauceData.heat)),
            likes: Number.parseInt(String(sauceData.likes)),
            dislikes: Number.parseInt(String(sauceData.dislikes)),
            usersLiked: String(sauceData.usersLiked).split(','),
            usersDisliked: String(sauceData.usersDisliked).split(','),
        };

        return sauceModel.create(sauce);
    }

    async findAll(): Promise<Sauce[]> {
        return sauceModel.find();
    }
}