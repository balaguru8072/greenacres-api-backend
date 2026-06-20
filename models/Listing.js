const { request } = require('express');
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Rent", "Sale"],
        required: [true, "Listing type is required"],
    },
    propertytype: {
        type: String,
        enum: ["Apartment", "House", "Condo", "Townhouse", "Land"],
        required: [true, "Property type is required"],
    },
    bedroom: {
        type: Number,
        min: 0

    },
    bathroom: {
        type: Number,
        min: 0

    },
    builtln: { type: Number, min: 0 },
    parking: { type: Number, min: 0 },
    lotsize: { type: Number, min: 0 },
    area: {
        type: Number,
        min: 0
    },
    price: {
        type: Number,
        min: 0
    },
    hoa: {
        type: Number,
        min: 0,
        default: 0,
    },
    description: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        }
    },
    images: [{ type: String }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
},
    { timestamps: true, }
);

listingSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Listing", listingSchema);