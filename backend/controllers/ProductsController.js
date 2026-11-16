import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try{
        const { name, price, category, image } = req.body;
        if(!name || !price || !category || !image){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(isNaN(price) || price < 0){
            return res.status(400).json({ message: "Price must be a positive number" });
        }
        const product = await Product.create({ name, price, category, image });
        res.status(201).json(product);
    
    } catch (error) {
        res.status(500).json({ message: "Error creating product,Server error", error });
    }
}


export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching products,Server error", error });
    }
}