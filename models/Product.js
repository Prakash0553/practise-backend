import mongoose from "mongoose";

export const categories = ["Romance", "Comedy", "Horror", "Science Fiction", "Adventure", "Fantacy","Mystery"];
export const authors = ["Emily Bronte", "Nikita Gill", "Paul Jarvis", "Lauren Asher", "Will Gompertz"];

const productSchema= new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type:Number,
        default: 0
    },
    quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
    },
    category: {
        type: String,
        enum: categories,
        required: true
    },
    author: {
        type: String,
        enum: authors,
        required: true
    },

    reviews: [
    {
      username: {
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
    }
  ]

},{timestamps:true});


const Product = mongoose.model('Product', productSchema);

export default Product;