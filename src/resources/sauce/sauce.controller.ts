import { Router } from "express";
import { SauceService } from "./sauce.service";

export const SaucesController = Router();
const sauceService = new SauceService();

SaucesController.get('/', async (req, res, next) => {
    const sauces = await sauceService.findAll();

    res.status(200).json(sauces);
});

SaucesController.post("/create", async (req, res, next) => {
    const sauce = await sauceService.create(req.body);

    return res.status(200).send(sauce);
});