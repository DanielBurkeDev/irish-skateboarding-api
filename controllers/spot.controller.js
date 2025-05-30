import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import Spot from '../models/spot.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Max image size ~5MB (base64 is about 1.37x original size)
const MAX_IMAGE_SIZE = 7 * 1024 * 1024; // 7MB base64 string

export const createSpot = async (req, res) => {
    const { image, latitude, longitude } = req.body;
    const userId = req.user?.id;

    if (!image) return res.status(400).json({ error: 'Image is required' });

    try {
        // Validate size
        if (image.length > MAX_IMAGE_SIZE) {
            return res.status(400).json({ error: 'Image is too large (max ~5MB)' });
        }

        // Validate file type by checking base64 header
        const mimeMatch = image.match(/^data:(image\/jpeg|image\/png);base64,/);
        if (!mimeMatch) {
            return res.status(400).json({ error: 'Only JPEG and PNG images are allowed' });
        }

        const fileType = mimeMatch[1].split('/')[1]; // 'jpeg' or 'png'
        const base64Data = image.replace(/^data:image\/(jpeg|png);base64,/, '');

        const filename = `${uuidv4()}.${fileType}`;
        const filepath = path.join(__dirname, '../uploads', filename);

        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filepath, buffer);

        const spot = new Spot({
            imageUrl: `/uploads/${filename}`,
            latitude,
            longitude,
            createdBy: userId,
        });

        await spot.save();
        res.status(201).json(spot);
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload spot' });
    }
};

// Add a comment
export const addComment = async (req, res) => {
    const { spotId } = req.params.id;
    const { text } = req.body;
    const userId = req.user?.id;

    try {
        const spot = await Spot.findById(spotId);
        if (!spot) return res.status(404).json({ error: 'Spot not found' });

        const comment = { text, createdBy: userId };
        spot.comments.push(comment);
        await spot.save();

        res.status(201).json(spot.comments[spot.comments.length - 1]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

// Get comments
export const getComments = async (req, res) => {
    const { spotId } = req.params.id;

    try {
        const spot = await Spot.findById(spotId).populate('comments.createdBy', 'username');
        if (!spot) return res.status(404).json({ error: 'Spot not found' });

        res.json(spot.comments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get comments' });
    }
};

// Like/unlike
export const toggleLike = async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user?.id;

    try {
        const spot = await Spot.findById(spotId);
        if (!spot) return res.status(404).json({ error: 'Spot not found' });

        const hasLiked = spot.likes.includes(userId);
        if (hasLiked) {
            spot.likes = spot.likes.filter(id => id.toString() !== userId);
        } else {
            spot.likes.push(userId);
        }

        await spot.save();
        res.json({ liked: !hasLiked, likesCount: spot.likes.length });
    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

// Get likes
export const getLikes = async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findById(spotId).populate('likes', 'username');
        if (!spot) return res.status(404).json({ error: 'Spot not found' });

        res.json({ likesCount: spot.likes.length, likedBy: spot.likes });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get likes' });
    }
};