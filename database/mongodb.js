import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI) {
    throw new Error("Please define the MO:NGO_URI environment variable inside .env.<development/production>.local");
}

//connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to Database in ${NODE_ENV} mode`);
    } catch(error) {
        console.error("Error connecting to database: ", error);

        process.exit(1);
    }
}

export default connectToDatabase;