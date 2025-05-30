import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
    // implement signup logic
    const session = await mongoose.startSession()
    session.startTransaction();

    try {
        // logic to create new user
        const {name, email, password} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{name, email, password: hashPassword}], {session});

        const token = jwt.sign({userId: newUsers[0].id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    // implement signin logic
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email})

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User successfully logged in',
            data: {
                token,
                user,
            }
        })
    } catch (error) {
        next(error)
    }
}


export const signOut = async (req, res) => {
    // implement signOut logic
}