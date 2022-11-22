import { Router } from "express";
import { SauceService } from "./sauce.service";
import { APIError } from "../../utils/error";
import { request } from "../../utils/request";

export const SaucesController = Router();
const sauceService = new SauceService();

SaucesController.get('/', async (req, res, next) => {
    await request(res, async () => {
        const sauces = await sauceService.findAll();
        res.status(200).json(sauces);
    })
});

SaucesController.get('/:id', async (req, res, next) => {
    await request(res, async () => {
        const sauces = await sauceService.findOne(req.params.id);
        res.status(200).json(sauces);
    });
});

SaucesController.post("/", async (req, res, next) => {
    await request(res, async () => {
        const sauce = await sauceService.create(req.body);
        return res.status(200).send(sauce);
    });
});

SaucesController.put("/:id", async (req, res, next) => {
    await request(res, async () => {
        const status = await sauceService.update(req.params.id, req.body);

        if (status.matchedCount === 1) {
            return res.status(200).send(status.modifiedCount === 1 ? {message: 'Sauce updated'} : {error: 'Sauce not updated'});
        }

        return res.status(404).send({error: 'Sauce not found'});
    });
});

SaucesController.delete('/:id', async (req, res, next) => {
    await request(res, async () => {
        const status = await sauceService.delete(req.params.id);

        if (status.deletedCount === 1) {
            return res.status(200).json({message: 'Sauce deleted'});
        }

        return res.status(404).json({error: 'Sauce not found'});
    });
});

SaucesController.post('/:id/like', async (req, res, next) => {
    await request(res, async () => {
        await sauceService.like(req.params.id, req.body);
        return res.status(200).json({message: "Request successfully done."});
    });
});
