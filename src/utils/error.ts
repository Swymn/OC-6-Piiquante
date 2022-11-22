import { ApiError } from "../../types/errors";
import { ErrorType } from "../../types/errors";

class API extends Error implements ApiError {
    constructor(readonly type: keyof typeof ErrorType | ErrorType, readonly message: string) {
        super(message);
    }
}

export class APIError extends API {

    public static UNKNOWN_ERROR = "Something went wrong";
    constructor(type: keyof typeof ErrorType | ErrorType, message: string) {
        super(type, message)
    }
}