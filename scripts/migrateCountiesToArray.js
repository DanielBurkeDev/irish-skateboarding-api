

// const migrateCountiesToArray = {
//     actionType: 'resource',
//     icon: 'Redo',
//     label: 'Migrate Counties to Array',
//     handler: async (request, response, context) => {
//         const { resource } = context;
//
//         const records = await resource.findMany(); // fetch all skatepark records
//         let updatedCount = 0;
//
//         for (const record of records) {
//             const counties = record.param('counties');
//
//             // Check if counties is a string and convert to array
//             if (typeof counties === 'string') {
//                 await record.update({ counties: [counties] });
//                 updatedCount++;
//             } else if (counties === null || counties === undefined) {
//                 await record.update({ counties: [] }); // default to empty array
//                 updatedCount++;
//             }
//         }
//
//         return {
//             notice: {
//                 message: `Migration complete. Updated ${updatedCount} skateparks.`,
//                 type: 'success',
//             },
//         };
//     },
//     component: false, // no custom UI
// };
