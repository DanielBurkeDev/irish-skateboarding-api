
import Skatepark from '../models/skatepark.model.js';

const migrateImageUrlsToArray = {
    name: 'migrateImageUrls',
    actionType: 'resource',
    label: 'Migrate Image URLs',
    icon: 'Redo',
    guard: 'This will update string image URLs to arrays. Are you sure?',
    isAccessible: ({ currentAdmin }) => currentAdmin?.email === process.env.ADMIN_EMAIL,
    component: false, // 👈 disables frontend form, still allows backend execution
    properties: {
        dryRun: {
            type: 'boolean',
            label: 'Dry Run (simulate only)',
            default: true,
        },
    },

    handler: async (request) => {
        const { dryRun } = request.payload || {};
        const parks = await Skatepark.find({});
        let updatedCount = 0;
        let skippedCount = 0;
        const changes = [];

        for (const park of parks) {
            if (typeof park.imageUrls === 'string') {
                const imageArray = park.imageUrls
                    .split(',')
                    .map(url => url.trim())
                    .filter(Boolean);

                if (!dryRun) {
                    park.imageUrls = imageArray;
                    await park.save();
                }

                changes.push({
                    id: park._id.toString(),
                    name: park.name || 'Unnamed',
                    original: park.imageUrls,
                    new: imageArray,
                });

                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        const changeLog = changes.map(change => {
            return `
        <strong>${change.name} (${change.id})</strong><br />
        <em>Original:</em> ${Array.isArray(change.original) ? change.original.join(', ') : change.original}<br />
        <em>New:</em> ${change.new.join(', ')}<br /><br />
      `;
        }).join('');

        return {
            notice: {
                message: `${dryRun ? 'Dry run:' : 'Migration complete:'} ${updatedCount} entries updated, ${skippedCount} skipped.`,
                type: 'success',
            },
            html: `<div style="max-height: 400px; overflow-y: auto;">${changeLog || 'No changes found.'}</div>`,
        };
    },
};

const SkateparkResource = {
    resource: Skatepark,
    options: {
        parent: { name: 'Management', icon: 'Map' },
        navigation: { name: 'Management', icon: 'Map' },
        actions: {
            migrateImageUrls: migrateImageUrlsToArray,
        },
        sort: {
            sortBy: 'name', // <- change this to your field
            direction: 'asc', // or 'desc'
        },
    },
};

export default SkateparkResource;


