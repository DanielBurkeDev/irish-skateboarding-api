import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const skateshopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    county: {
        type: String,
        maxlength: 30
    },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    openinghours: {
        type: String
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 2000
    },
    services: {
        type: [String],
    },
    payments: {
        type: [String],
    },
    image: {
        type: String,
    },
    latitude: Number,
    longitude: Number,
    rating: {
        type: Number,
        min: 0,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Skateshop = mongoose.model('Skateshop', skateshopSchema);

export default Skateshop;
