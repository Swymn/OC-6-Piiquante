import { ObjectId } from "mongoose";

export interface User {
    email: string,
    password: string,
}

export interface UserResponse extends User {
    _id: any,
}