import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // One check covers all four: the three text fields and the image file
    if (!name || !price || !category || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (isNaN(price) || price < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    const product = await Product.create({
      name,
      price,
      category,
      image: `/uploads/${req.file.filename}`,
    });
    res.status(201).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product, Server error", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 8, 1), 50);
    const { search, category, sort } = req.query;

    const filter = {};

    if (search && search.trim()) {
      // Trim first, then escape special regex characters
      const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: safe, $options: "i" };
    }
    if (category && category.trim()) {
      filter.category = category;
    }

    // The keys MUST match the option values in the sidebar dropdown (hyphens).
    // _id is the tie-breaker, so equal values always come back in the same
    // order and never jump between pages.
    const sortOptions = {
      "price-asc": { price: 1, _id: 1 },
      "price-desc": { price: -1, _id: 1 },
      "name-asc": { name: 1, _id: 1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1, _id: -1 };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortBy)
      .collation({ locale: "en" })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products, Server error", error: error.message });
  }
};