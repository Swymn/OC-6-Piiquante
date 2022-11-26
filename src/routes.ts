import { Router } from "express";
import { UsersController } from "./resources/user/user.controller";
import { SaucesController } from "./resources/sauce/sauce.controller";
import { authorize } from "./middlewares/auth.handler";

const Routes = Router();

Routes.use('/auth', UsersController);
Routes.use('/sauces', authorize, SaucesController);

export { Routes };