import {config} from 'dotenv'

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});
// config({path: `.env.${process.env.NODE_ENV}.local`});

export const {
    PORT,
    NODE_ENV,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_ENV, ARCJET_KEY,CLERK_SECRET_KEY
} = process.env;