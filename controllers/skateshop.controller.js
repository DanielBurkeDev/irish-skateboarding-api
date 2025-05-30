
import Skateshop from "../models/skateshop.model.js";

export const getSkateshops = async (req, res, next) => {
    try {
        const { search } = req.query;

        let filter = {};

        if (search) {
            // Search in name or location fields (case-insensitive)
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { county: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const skateshops = await Skateshop.find(filter);

        console.log("Search query:", req.query.search);
        console.log("Mongo filter applied:", filter);

        res.status(200).json({ success: true, data: skateshops });
    } catch (error) {
        next(error);
    }
};




export const getSkateshop = async (req, res, next) => {
    try {
        const skateshop = await Skateshop.findById(req.params.id);

        if(!skateshop){
            const error = new Error('Skateshop not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: skateshop});

    } catch (error){
        next(error);
    }
}

export const createSkateshop = async (req, res, next) => {
    try {
        const skateshop = await Skateshop.create({
            ...req.body, user: req.user._id,
        });

        res.status(201).json({success: true, data: skateshop})
    } catch(error) {
        next(error);
    }
}