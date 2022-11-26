export interface Sauce {
    _id: string;
    userId: string;
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

export interface SauceRequest extends Omit<Sauce, "_id"> {}