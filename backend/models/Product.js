import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    name:{type: String, required: true,trim: true},
    price:{type: Number, required: true,min: 0},
    category:{type: String, required: true,trim: true},
    image:{type: String, required: true,trim: true},
},
{timestamps: true}
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;