import type { User } from '../../../types/user';
import { Schema, model } from 'mongoose';

export const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

export const userModel = model<User>('User', userSchema);