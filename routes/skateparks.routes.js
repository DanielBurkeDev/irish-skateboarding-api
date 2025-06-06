import {Router} from 'express';
import {
    createSkatepark,
    getAllCounties,
    getAllFeatures,
    getSkatepark,
    getSkateparks
} from "../controllers/skatepark.controller.js";
// import authorize from "../middlewares/auth.middleware.js";
import  {requireAuth} from "../middlewares/clerkAuth.middleware.js";


const skateparksRouter = new Router();

skateparksRouter.get("/features", getAllFeatures);
skateparksRouter.get("/counties", getAllCounties);

skateparksRouter.get('/',  getSkateparks);

skateparksRouter.get('/:id', getSkatepark);



// skateparksRouter.post('/', authorize, createSkatepark);
skateparksRouter.post('/', requireAuth, createSkatepark);

skateparksRouter.put('/:id', (req, res) => res.send({title: 'UPDATE skatepark'}));

skateparksRouter.delete('/:id', (req, res) => res.send({title: 'DELETE skatepark'}));

skateparksRouter.get('/user/:id', (req, res) => res.send({title: 'GET all user skateparks'}));


export default skateparksRouter;
