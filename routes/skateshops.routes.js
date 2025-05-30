import {Router} from 'express';
import { createSkateshop, getSkateshop, getSkateshops } from "../controllers/skateshop.controller.js";
// import authorize from "../middlewares/auth.middleware.js";
import {requireAuth} from "@clerk/clerk-sdk-node";

const skateshopsRouter = new Router();

skateshopsRouter.get('/', getSkateshops);

skateshopsRouter.get('/:id', getSkateshop);

skateshopsRouter.post('/', requireAuth, createSkateshop);

skateshopsRouter.put('/:id', (req, res) => res.send({title: 'UPDATE skateshop'}));

skateshopsRouter.delete('/:id', (req, res) => res.send({title: 'DELETE skateshop'}));

skateshopsRouter.get('/user/:id', (req, res) => res.send({title: 'GET all user skateshops'}));


export default skateshopsRouter;
