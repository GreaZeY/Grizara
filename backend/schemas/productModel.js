const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description."],

    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price."],
        maxLength: [7, "Price cannot exceed upto 7 figures."]

    },
    rating: {
        type: Number,
        default: 0

    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }

    }],
    category: {
        type: String,
        required: [true, "Please Enter product category."]

    },
    stock: {
        type: Number,
        required: [true, "Please Enter product stock."],
        maxLength: [4, "Price cannot exceed upto 4 figures."],
        default: 1

    },
    numOfReviews: {
        type: String,
        default: 0
    },
    reviews: [{
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }

    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema)