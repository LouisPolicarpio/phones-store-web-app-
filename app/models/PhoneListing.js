let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let phoneListingSchema = new Schema({
    title: String,
    brand: String,
    image: String,
    stock: Number,
    seller: String,
    price: Number,
    avg_rating: Number,
    reviews: [{
        _id: false,
        reviewer: String,
        rating: Number,
        comment: String
    }],
    disabled: String
},{
    versionKey: false // You should be aware of the outcome after set to false
});

let PhoneListing = mongoose.model('PhoneListing', phoneListingSchema);
module.exports = PhoneListing;