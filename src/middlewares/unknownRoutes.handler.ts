import { NotFoundException } from "~/utils/exception";

export const UnknownRoutesHandler = () => {
    throw new NotFoundException("The requested route does not exist");
}