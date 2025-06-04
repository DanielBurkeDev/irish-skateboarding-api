// models/Spot.js
import mongoose from 'mongoose';


const commentSchema = new mongoose.Schema({
    text: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const spotSchema = new mongoose.Schema({
    clerkId: { type: String, unique: true },
    imageUrl: String,
    latitude: Number,
    longitude: Number,
    description: {
        type: String,
        minlength: 5,
        maxlength: 2000
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

const Spot = mongoose.model('Spot', spotSchema);
export default Spot;


