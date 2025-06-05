import mongoose from 'mongoose';
import Skatepark from '../models/skatepark.model.js';
import { DB_URI } from '../config/env.js';

const FEATURE_MAP = {
    'Banks': 'Bank',
    'Benches': 'Bench',
    'Flat Bar': 'Flat Bar',
    'Flatground': 'Flatground',
    'Funbox': 'Funbox',
    'Hubba': 'Hubba',
    'Ledge': 'Ledge',
    'Ledges': 'Ledge',
    'Lights': 'Lights',
    'Manual Pad': 'Manual Pad',
    'Manny Pad': 'Manual Pad',
    'Mini Ramp': 'Mini Ramp',
    'Quarters': 'Quarter',
    'Rails': 'Rail',
    'Rail': 'Rail',
    'Spine': 'Spine',
    'Stairs': 'Stairs',
    'Transition': 'Transition',
    'Vert Wall': 'Vert Wall',
    'Bowl': 'Bowl',
    'Euro Gap': 'Euro Gap',
    'Pump Track': 'Pump Track',
    'Parking': 'Parking',
    'Toilets': 'Toilets',
};

const ALLOWED_FEATURES = new Set(Object.values(FEATURE_MAP));

async function normalizeFeatures() {
    await mongoose.connect(DB_URI);
    console.log('Connected to DB');

    const skateparks = await Skatepark.find();
    let updatedCount = 0;

    for (const park of skateparks) {
        const original = park.features || [];
        const cleaned = [
            ...new Set(
                original
                    .map(f => f.trim())
                    .map(f => FEATURE_MAP[f] || null)
                    .filter(Boolean)
                    .filter(f => ALLOWED_FEATURES.has(f))
            )
        ];

        const hasChanges = JSON.stringify(original.sort()) !== JSON.stringify(cleaned.sort());

        if (hasChanges) {
            park.features = cleaned;
            await park.save();
            updatedCount++;
            console.log(`Updated: ${park.name} -> ${cleaned.join(', ')}`);
        }
    }

    console.log(`✅ Normalized features for ${updatedCount} skateparks`);
    await mongoose.disconnect();
}

normalizeFeatures().catch(err => {
    console.error('❌ Error normalizing features:', err);
    process.exit(1);
});
