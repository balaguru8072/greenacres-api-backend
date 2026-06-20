const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');

const createListing = async (req, res, next) => {
    try {
        const { type, propertytype, bedroom, bathroom, builtln, parking, lotsize, area, price, hoa, description,
            address, lat, lng, } = req.body;

        const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
        const listing = await Listing.create({
            type,
            propertytype,
            bedroom: bedroom ? Number(bedroom) : undefined,
            bathroom: bathroom ? Number(bathroom) : undefined,
            builtln: builtln ? Number(builtln) : undefined,
            parking: parking ? Number(parking) : undefined,
            lotsize: lotsize ? Number(lotsize) : undefined,
            area: area ? Number(area) : undefined,
            price: price ? Number(price) : undefined,
            hoa: hoa ? Number(hoa) : 0,
            description,
            address,
            location: {
                type: "Point",
                coordinates: [Number(lng) || 0, Number(lat) || 0], // GeoJSON: [lng, lat]
            },
            images,
            createdBy: req.admin?._id,
        });
        res.status(201).json({ success: true, data: listing });
    } catch (error) {
        next(error);
    }
}

const getAllListings = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.type) filter.type = req.query.type;
        if (req.query.propertytype) filter.propertytype = req.query.propertytype;

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};

            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        const listings = await Listing.find(filter)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        next(error);
    }
}

const getListingById = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("createdBy", "name email");

        if (!listing) {
            res.status(404);
            return next(new Error("Listing not found"));
        }
        res.status(200).json({ success: true, data: listing });
    } catch (error) {
        next(error);
    }
}

const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            res.status(404);
            return next(new Error("Listing not found"));
        }

        const {
            type,
            propertytype,
            bedroom,
            bathroom,
            builtln,
            parking,
            lotsize,
            area,
            price,
            hoa,
            description,
            address,
            lat,
            lng,
        } = req.body;

        // ✅ Full replace fields
        listing.type = type;
        listing.propertytype = propertytype;
        listing.description = description;
        listing.address = address;

        listing.bedroom = Number(bedroom);
        listing.bathroom = Number(bathroom);
        listing.builtln = Number(builtln);
        listing.parking = Number(parking);
        listing.lotsize = Number(lotsize);
        listing.area = Number(area);
        listing.price = Number(price);
        listing.hoa = Number(hoa);

        if (lat && lng) {
            listing.location = {
                type: "Point",
                coordinates: [Number(lng), Number(lat)],
            };
        }

        // ✅ If new images uploaded, old images replace ஆகும்
        if (req.files && req.files.length > 0) {
            listing.images = req.files.map((f) => `/uploads/${f.filename}`);
        }

        const updated = await listing.save();

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing: updated,
        });
    } catch (error) {
        next(error);
    }
};

const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            res.status(404);
            return next(new Error("Listing not found"));
        }

        // Remove image files from disk
        listing.images.forEach((imgPath) => {
            const fullPath = path.join(__dirname, "../", imgPath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });

        await listing.deleteOne();
        res.json({ success: true, message: "Listing deleted successfully" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
}