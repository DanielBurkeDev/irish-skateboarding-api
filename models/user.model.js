import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    // name: {
    //     type: String,
    //     required: [true, 'User Name is required'],
    //     trim: true,
    //     minlength: 5,
    //     maxlength: 50
    // },
    name: String,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;