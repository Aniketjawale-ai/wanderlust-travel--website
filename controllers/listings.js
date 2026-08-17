const Listing = require("../models/listing");

module.exports.index = async (req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}


module.exports.renderNewForm = (req , res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exitsts");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});

};

module.exports.createListing = async (req, res, next) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;

        newListing.image = {
            url: url,
            filename: filename
        };

        // Get coordinates from location + country
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
                `${newListing.location}, ${newListing.country}`
            )}`,
            {
                headers: {
                    "User-Agent": "Wanderlust-College-Project/1.0"
                }
            }
        );

        const data = await response.json();

        if (data.length === 0) {
            req.flash("error", "Location could not be found");
            return res.redirect("/listings/new");
        }

        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        // Save GeoJSON coordinates
        newListing.geometry = {
            type: "Point",
            coordinates: [longitude, latitude]
        };

        await newListing.save();

        req.flash("success", "New listing Created");
        res.redirect("/listings");

    } catch (err) {
        next(err);
    }
};

module.exports.renderEditForm = async (req, res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested for does not exitsts");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300");
    
    res.render("listings/edit.ejs", { listing , originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { new: true }
    );

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = {
            url: url,
            filename: filename
        };

        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing =async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
     req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};