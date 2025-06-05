
import Skatepark from "../models/skatepark.model.js";

export const getSkateparks = async (req, res, next) => {
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            // Search in name or location fields (case-insensitive)
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { county: { $regex: search, $options: 'i' } },
                    { features: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const skateparks = await Skatepark.find(filter).lean();

        console.log("Search query:", req.query.search);
        console.log("Mongo filter applied:", filter);

        res.status(200).json({ success: true, data: skateparks });
    } catch (error) {
        next(error);
    }
};


// export const getSkateparks = async (req, res, next) => {
//     try {
//         const skateparks = await Skatepark.find();
//
//         res.status(200).json({success: true, data: skateparks});
//
//     } catch (error){
//         next(error);
//     }
// }

export const getSkatepark = async (req, res, next) => {
    try {
        const skatepark = await Skatepark.findById(req.params.id).lean();

        if(!skatepark){
            const error = new Error('Skatepark not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: skatepark});

    } catch (error){
        next(error);
    }
}

export const createSkatepark = async (req, res, next) => {
    try {
        const skatepark = await Skatepark.create({
            ...req.body, user: req.user._id,
        });

        res.status(201).json({success: true, data: skatepark})
    } catch(error) {
        next(error);
    }
}

export const getAllFeatures = async (req, res, next) => {
    try {
        const features = await Skatepark.distinct("features", { features: { $ne: null } });
        res.status(200).json({ success: true, data: features });
    } catch (error) {
        next(error);
    }
};