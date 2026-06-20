const express = require('express');
const router = express.Router();

const { createListing, getAllListings, getListingById, updateListing, deleteListing } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get("/",    getAllListings);
router.get("/:id", getListingById);
 
// Protected routes (admin must be logged in)
router.post(  "/createlisting",     upload.array("images", 10), createListing);
router.put(   "/:id",  upload.array("images", 10), updateListing);
router.delete("/:id", deleteListing);

module.exports = router;