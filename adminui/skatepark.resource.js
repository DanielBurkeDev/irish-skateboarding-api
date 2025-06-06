import Skatepark from "../models/skatepark.model.js";
import {SKATEPARK_FEATURES} from "../constants/features.js";
import {SKATEPARK_COUNTIES} from "../constants/counties.js";

const migrateCountyToArray = {
    name: 'migrateCounty',
    actionType: 'resource',
    icon: 'Redo',
    label: 'Migrate County Field Properly',
    handler: async (request, response, context) => {
        const { resource } = context;
        const records = await resource.findMany();
        let updatedCount = 0;

        for (const record of records) {
            const params = record.params;
            const oldCounties = params.counties;
            const currentCounty = params.county;

            let updatedData = {};

            // If 'counties' is a string, move it to 'county' as array
            if (typeof oldCounties === 'string') {
                updatedData.county = [oldCounties];
            }

            // If 'counties' is an array and 'county' is missing, move the array
            if (Array.isArray(oldCounties) && (!currentCounty || currentCounty.length === 0)) {
                updatedData.county = oldCounties;
            }

            // If 'county' exists as string, convert to array
            if (typeof currentCounty === 'string') {
                updatedData.county = [currentCounty];
            }

            // Remove 'counties' field
            updatedData.counties = null;

            if (Object.keys(updatedData).length > 0) {
                await record.update(updatedData);
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
    component: false,
};




const SkateparkResource = {
    resource: Skatepark,
    options: {
        properties: {
            features: {
                isArray: true,
                availableValues: SKATEPARK_FEATURES.map(f => ({value: f, label: f}))
            },
            county: {
                isArray: true,
                availableValues: SKATEPARK_COUNTIES.map(f => ({ value: f, label: f })),
            },
            counties: {
                isVisible: false, // Hides it from list/edit/show views
            },
        },
        parent: {name: 'Management', icon: 'Map'},
        navigation: {name: 'Management', icon: 'Map'},
        // actions: {
        //     migrateImageUrls: migrateImageUrlsToArray,
        // },
        actions: {
            migrateCounties: migrateCountyToArray,
        },
        sort: {
            sortBy: 'name', // <- change this to your field
            direction: 'asc', // or 'desc'
        },
    },
};
export default SkateparkResource;