import { APIError } from "./error";
import { Response } from "express";
import { ErrorCode } from "../../types/errors";

export const request = async (res: Response, callback: Function) => {
    try {
        await callback();
    } catch (e) {
        if (e instanceof APIError) {
            return res.status(ErrorCode[e.code]).json({error: e.message});
        }
        return res.status(400).json({error: APIError.UNKNOWN_ERROR});
    }
}