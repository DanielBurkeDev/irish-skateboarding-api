import User from '../models/user.model.js';

// import { clerkClient } from '@clerk/clerk-sdk-node';

export const getOrCreateUser = async (req, res, next) => {
    try {
        const clerkId = req.auth.userId;
        const email = req.auth.primary_email_address;
        const name = req.auth.username;

        console.log('🔐 Clerk ID:', req.auth.userId);
        console.log('📧 Email from token:', req.auth.primary_email_address);
        console.log('👤 Name from token:', req.auth.username);

        let user = await User.findOne({ clerkId });

        if (!user) {
            console.log('🆕 Creating user in DB...');
            user = await User.create({
                clerkId,
                email,
                name,
            });

        }

        res.json(user);
    } catch (error) {
        console.error('❌ Failed getOrCreateUser:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Create or get user by Clerk ID
// export const getOrCreateUser = async (req, res) => {
//     try {
//         const { userId } = req.auth; // Comes from Clerk middleware
//         const { email, firstName, lastName, imageUrl } = req.body; // Send these from frontend or fetch via Clerk SDK
//
//         let user = await User.findOne({ clerkId: userId });
//
//         if (!user) {
//             user = await User.create({
//                 clerkId: userId,
//                 email,
//                 name: `${firstName} ${lastName}`,
//                 imageUrl,
//             });
//         }
//
//         res.status(200).json({
//             success: true,
//             user,
//         });
//     } catch (error) {
//         console.error('Error creating or fetching user:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({success: true, data: users});

    } catch (error){
        next(error);
    }
}

export const getUserProfile = async (req, res) => {
    const { sub, email } = req.user;

    // If needed: fetch user from DB using `sub` (Clerk user ID)
    const user = await User.findOne({ clerkId: sub });

    if (!user) {
        return res.status(404).json({ message: 'User not found in local DB' });
    }

    res.json({
        success: true,
        data: user,
    });
};


export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: user});

    } catch (error){
        next(error);
    }
}