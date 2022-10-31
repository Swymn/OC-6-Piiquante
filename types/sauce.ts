import { Types } from "mongoose";

export interface Sauce {
    userId: Types.ObjectId;
    name: string,
    manufacturer: string,
    description: string,
    mainPepper: string,
    imageUrl: string,
    heat: number,
    likes: number,
    dislikes: number,
    usersLiked: string[],
    usersDisliked: string[]
}