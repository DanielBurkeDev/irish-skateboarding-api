import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const skateparkSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    county: {
        type: [String],

    },
    address: {
        type: String,
        minlength: 5,
        maxlength: 200
    },
    latitude: {
        type: String,
        trim: true,
    },
    longitude: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    website: {
        type: String,
        lowercase: true,
    },
    openinghours: {
        type: String
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 2000
    },
    image: {
        type: [String],
        default: [],
    },
    fee: {
        type: String,
        default: "Free",
    },
    rating: {
        type: Number,
        min: 0,
    },
    features: {
        type: [String],
    },
    surface: {
        type: String,
        enum: ['concrete', 'wood']
    },
    indooroutdoor: {
        type: String,
        enum: ['Indoor', 'Outdoor']
    },
    comments: [commentSchema],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pros: {
        type: String,
    },
    cons: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true,
    }

},{ timestamps: true })

const Skatepark = mongoose.model('Skatepark', skateparkSchema);

export default Skatepark;

