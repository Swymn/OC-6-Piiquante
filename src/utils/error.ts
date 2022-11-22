import { ApiError, ErrorCode } from "../../types/errors";
import { ErrorType } from "../../types/errors";

class API extends Error implements ApiError {

    private readonly _type: keyof typeof ErrorType;
    private readonly _code: keyof typeof ErrorCode;
    constructor(readonly code: keyof typeof ErrorCode, readonly type: keyof typeof ErrorType, readonly message: string) {
        super(message);
        this._type = type;
        this._code = code;
    }
}

export class APIError extends API {

    public static UNKNOWN_ERROR = "Something went wrong";
    constructor(code: keyof typeof ErrorCode, type: keyof typeof ErrorType, message: string) {
        super(code, type, message)
    }
}