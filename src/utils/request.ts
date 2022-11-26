import { APIError } from "./error";
import { Response } from "express";
import { ErrorCode } from "../../types/errors";
import * as console from "console";

export const request = async (res: Response, callback: Function) => {
    try {
        await callback();
    } catch (e) {
        if (e instanceof APIError) {
            return res.status(ErrorCode[e.code]).json({error: e.message});
        }
        console.error(e);
        return res.status(500).json({error: APIError.UNKNOWN_ERROR});
    }
}