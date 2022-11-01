export enum ErrorType {
    NotFound = 'NotFound',
    Invalid = 'Invalid',
    Unauthorized = 'Unauthorized',
    Forbidden = 'Forbidden',
    Conflict = 'Conflict',
    Server = 'Server',
    Unknown = 'Unknown',
    Missing = 'Missing',
}

export interface ApiError {
    type: keyof typeof ErrorType | ErrorType;
    message: string;
}