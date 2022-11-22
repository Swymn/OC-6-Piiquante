import { Types } from "mongoose";

export interface Sauce {
    userId: Types.ObjectId;
    sauce: string,
    manufacturer: string,
    description: string,
    mainPepper: string,
    image: string,
    heat: number,
    likes: number,
    dislikes: number,
    usersLiked: string[],
    usersDisliked: string[]
}