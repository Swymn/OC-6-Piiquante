import multer from 'multer';
import { Request } from "express";

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, './uploads');
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if ((file.mimetype).indexOf('jpeg') !== -1 || (file.mimetype).indexOf('png') !== -1 || (file.mimetype).indexOf('jpg') !== -1) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');