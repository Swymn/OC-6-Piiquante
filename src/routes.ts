import { Router } from "express";
import { UsersController } from "./resources/user/user.controller";
import { SaucesController } from "./resources/sauce/sauce.controller";

const Routes = Router();

Routes.use('/auth', UsersController);
Routes.use('/sauces', SaucesController);

export { Routes };