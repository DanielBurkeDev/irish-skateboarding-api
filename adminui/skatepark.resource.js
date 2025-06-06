import Skatepark from "../models/skatepark.model.js";
import {SKATEPARK_FEATURES} from "../constants/features.js";
import {SKATEPARK_COUNTIES} from "../constants/counties.js";

const migrateCountiesToArray = {
    name: 'migrateCounties',
    actionType: 'resource',
    icon: 'Redo',
    label: 'Migrate Counties to Array',
    handler: async (request, response, context) => {
        const { resource } = context;

        const records = await resource.findMany(); // fetch all skatepark records
        let updatedCount = 0;

        for (const record of records) {
            const county = record.param('county');

            // Check if counties is a string and convert to array
            if (typeof county === 'string') {
                await record.update({ county: [county] });
                updatedCount++;
            } else if (county === null || county === undefined) {
                await record.update({ county: [] }); // default to empty array
                updatedCount++;
            }
        }

        return {
            notice: {
                message: `Migration complete. Updated ${updatedCount} skateparks.`,
                type: 'success',
            },
        };
    },
    component: false, // no custom UI
};





const SkateparkResource = {
    resource: Skatepark,
    options: {
        properties: {
            features: {
                isArray: true,
                availableValues: SKATEPARK_FEATURES.map(f => ({value: f, label: f}))
            },
            counties: {
                isArray: true,
                availableValues: SKATEPARK_COUNTIES.map(f => ({value: f, label: f}))
            }
        },
        parent: {name: 'Management', icon: 'Map'},
        navigation: {name: 'Management', icon: 'Map'},
        // actions: {
        //     migrateImageUrls: migrateImageUrlsToArray,
        // },
        actions: {
            migrateCounties: migrateCountiesToArray,
        },
        sort: {
            sortBy: 'name', // <- change this to your field
            direction: 'asc', // or 'desc'
        },
    },
};
export default SkateparkResource;