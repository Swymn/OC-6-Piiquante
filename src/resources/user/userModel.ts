import type { User } from '../../../types/user';
import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

export const UserSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.plugin(uniqueValidator);

/*UserSchema.pre('insertMany', function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, (err: any, hash: string) => {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});*/


export const UserModel = model<User>('User', UserSchema);