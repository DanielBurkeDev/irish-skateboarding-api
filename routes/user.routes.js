import {Router} from 'express';
import {getOrCreateUser, getUser} from "../controllers/user.controller.js";
import  {requireAuth} from "../middlewares/clerkAuth.middleware.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

// userRouter.get('/', getUsers)

userRouter.get('/:id', authorize, getUser)

userRouter.get('/me', requireAuth, getOrCreateUser);

// userRouter.get('/:id', clerkAuthorize, getUser)

userRouter.get('/id', requireAuth, (req, res) => {
    res.json({ id: req.id });
});

userRouter.post('/me', requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { name } = req.body;

    try {
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            user = await User.create({
                clerkId: userId,
                name,
            });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

userRouter.post('/', (req, res) => res.send({title: 'CREATE new Users'}))

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE User'}))

userRouter.delete('/:id', (req, res) => res.send({title: 'DELETE User'}))

export default userRouter;
