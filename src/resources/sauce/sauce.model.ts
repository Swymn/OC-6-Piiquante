import type { Sauce } from '../../../types/sauce';
import { Schema, model } from 'mongoose'

export const sauceSchema = new Schema<Sauce>({
    userId: {
        type: Schema.Types.ObjectId,
    },
    sauce: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    description: {
        type: String,
    },
    mainPepper: {
        type: String,
    },
    image: {
        type: String,
    },
    heat: {
        type: Number,
    },
    likes: {
        type: Number,
    },
    dislikes: {
        type: Number,
    },
    usersLiked: {
        type: [String],
    },
    usersDisliked: {
        type: [String],
    },
});

export const sauceModel = model<Sauce>('Sauce', sauceSchema);