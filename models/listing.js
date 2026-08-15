const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({

    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default:"https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1200&q=80",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1200&q=80 "
                : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User",
    },

});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({ _id: {$in: listing.reviews}});
    }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;