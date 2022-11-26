import type { User } from '../../../types/user';
import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

export const UserSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.plugin(uniqueValidator);

export const UserModel = model<User>('User', UserSchema);