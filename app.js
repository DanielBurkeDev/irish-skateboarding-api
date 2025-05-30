import express from 'express';
// import { ClerkExpressWithAuth } from '@clerk/express';
import { DB_URI, PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import skateparksRouter from './routes/skateparks.routes.js';
import spotRouter from './routes/spot.routes.js';
import skateshopsRouter from './routes/skateshops.routes.js';

import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

import Skatepark from './models/skatepark.model.js';
import Subscription from './models/subscription.model.js';
import User from './models/user.model.js';
import Skateshop from './models/skateshop.model.js';

import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';

import cookieParser from 'cookie-parser';
import path from 'path';
import mongoose from 'mongoose';

AdminJS.registerAdapter({
    Resource: AdminJSMongoose.Resource,
    Database: AdminJSMongoose.Database,
});

const app = express();

// Clerk middleware – added EARLY
// app.use(ClerkExpressWithAuth());

// Built-in middleware
app.use(express.json({ limit: '10mb' })); // for base64 payloads
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(express.static('public'));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/skateparks', skateparksRouter);
app.use('/api/v1/skateshops', skateshopsRouter);
app.use('/api/spots', spotRouter);

// Health check
app.get('/', (req, res) => {
    res.send('Welcome to the Irish Skateboarding API');
});

// AdminJS setup
const adminOptions = {
    resources: [
        {
            resource: Skatepark,
            options: {
                parent: { name: 'Management', icon: 'Map' },
                navigation: { name: 'Management', icon: 'Map' },
            },
        },
        {
            resource: Skateshop,
            options: {
                parent: { name: 'Management', icon: 'Map' },
                navigation: { name: 'Management', icon: 'Map' },
            },
        },
        {
            resource: User,
            options: {
                parent: { name: 'Management', icon: 'User' },
                navigation: { name: 'Management', icon: 'User' },
            },
        },
        {
            resource: Subscription,
            options: {
                parent: { name: 'Management', icon: 'User' },
                navigation: { name: 'Management', icon: 'User' },
            },
        },
    ],
    branding: {
        logo: '/logo-badge.png',
        softwareBrothers: false,
        companyName: 'Irish Skateboarding',
    },
};

const admin = new AdminJS(adminOptions);
const adminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, adminRouter);

// Error handler (after routes)
app.use(errorMiddleware);

// DB + Start server
await mongoose.connect(DB_URI);
app.listen(PORT, async () => {
    console.log(`Irish Skateboard API is running on http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;



// import express from 'express';
// import {DB_URI, PORT} from './config/env.js'
// import userRouter from './routes/user.routes.js'
// // import authRouter from './routes/auth.routes.js'
// import subscriptionRouter from './routes/subscription.routes.js'
// import skateparksRouter from "./routes/skateparks.routes.js";
// import connectToDatabase from "./database/mongodb.js";
// import errorMiddleware from "./middlewares/error.middleware.js";
// import cookieParser from "cookie-parser";
// import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
// import Skatepark from "./models/skatepark.model.js";
// import Subscription from "./models/subscription.model.js";
// import User from "./models/user.model.js";
// import AdminJSExpress from '@adminjs/express'
// import mongoose from 'mongoose'
//
// import * as AdminJSMongoose from '@adminjs/mongoose'
// import AdminJS from 'adminjs'
// import spotRouter from "./routes/spot.routes.js";
// import path from "path";
// import skateshopsRouter from "./routes/skateshops.routes.js";
// import Skateshop from "./models/skateshop.model.js";
//
//
//
// AdminJS.registerAdapter({
//     Resource: AdminJSMongoose.Resource,
//     Database: AdminJSMongoose.Database,
// })
//
// const app = express();
//
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(arcjetMiddleware);
// app.use(express.json({ limit: '10mb' })); // for base64 payloads
// app.use('/uploads', express.static(path.resolve('uploads')));
//
// //prepending /api/v1/auth
// // app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/subscriptions', subscriptionRouter);
// app.use('/api/v1/skateparks', skateparksRouter);
// app.use('/api/v1/skateshops', skateshopsRouter);
// app.use('/api/spots', spotRouter);
// app.use(express.static('public'))
//
// app.use(errorMiddleware);
//
// app.get('/', (req,res) =>{
//     res.send('Welcome to the Irish Skateboarding API');
// })
//
// await mongoose.connect(DB_URI)
//
// const adminOptions = {
//
//     resources: [
//         {
//             resource: Skatepark,
//             options: {
//                 parent: {
//                     name: 'Management',
//                     icon: 'Map',
//                 },
//                 navigation: {
//                     name: 'Management',
//                     icon: 'Map',
//                 },
//             },
//         },
//         {
//             resource: Skateshop,
//             options: {
//                 parent: {
//                     name: 'Management',
//                     icon: 'Map',
//                 },
//                 navigation: {
//                     name: 'Management',
//                     icon: 'Map',
//                 },
//             },
//         },
//         {
//             resource: User,
//             options: {
//                 parent: {
//                     name: 'Management',  // Sidebar group name
//                     icon: 'User',
//                 },
//                 navigation: {
//                     name: 'Management',
//                     icon: 'User',
//                 },
//             },
//         },
//         {
//             resource: Subscription,
//             options: {
//                 parent: {
//                     name: 'Management',  // Sidebar group name
//                     icon: 'User',
//                 },
//                 navigation: {
//                     name: 'Management',
//                     icon: 'User',
//                 },
//             },
//         },
//
//     ],
//     branding: {
//         logo: '/logo-badge.png', // ← your logo URL here
//         softwareBrothers: false, // Optional: removes AdminJS watermark
//         companyName: 'Irish Skateboarding',
//     }
//
// }
//
// const admin = new AdminJS(adminOptions)
// const adminRouter = AdminJSExpress.buildRouter(admin)
//
// app.use(admin.options.rootPath, adminRouter)
//
// app.listen(PORT, async () => {
//     console.log(`Irish Skateboard API is running on http://localhost:${PORT}`);
//     await connectToDatabase()
// })
//
// export default app;