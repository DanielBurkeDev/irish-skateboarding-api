import Skatepark from "../models/skatepark.model.js";
import {SKATEPARK_FEATURES} from "../constants/features.js";
import {SKATEPARK_COUNTIES} from "../constants/counties.js";

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
        sort: {
            sortBy: 'name', // <- change this to your field
            direction: 'asc', // or 'desc'
        },
    },
};
export default SkateparkResource;