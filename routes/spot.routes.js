import { Router } from 'express';
// import authorize from '../middlewares/auth.middleware.js';
import {
    createSpot,
    addComment,
    getComments,
    toggleLike,
    getLikes
} from '../controllers/spot.controller.js';
import  {requireAuth} from "../middlewares/clerkAuth.middleware.js";

const spotRouter = Router();

spotRouter.post('/', requireAuth, createSpot);

// Comments
spotRouter.post('/:spotId/comments', requireAuth, addComment);
spotRouter.get('/:spotId/comments', getComments);

// Likes
spotRouter.post('/:spotId/like', requireAuth, toggleLike);
spotRouter.get('/:spotId/likes', getLikes);

export default spotRouter;
