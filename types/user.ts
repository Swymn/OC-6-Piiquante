export interface User {
    _id: any;
    email: string,
    password: string,
}

export interface UserRequest extends Omit<User, "_id"> {}