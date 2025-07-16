import Product, { brands, categories } from "../models/Product.js";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Top 5 products based on rating
export const getTop5 = (req, res, next) => {
  req.query.rating = { $gte: 4 };
  req.query.limit = 4;
  next();
}

// Get products with filtering, sorting, searching
export const getProducts = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludeFields = ['sort', 'page', 'limit', 'fields', 'skip', 'search'];
    excludeFields.forEach((field) => delete queryObject[field]);

    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      if (categories.includes(search)) queryObject.category = { $regex: search, $options: 'i' };
      else if (brands.includes(search)) queryObject.brand = { $regex: search, $options: 'i' };
      else queryObject.title = { $regex: search, $options: 'i' };
    }

    let query = Product.find(queryObject);

    if (req.query.sort) {
      const sort = req.query.sort.split(/[\s,]+/).filter(Boolean).join(' ');
      query.sort(sort);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(/[\s,]+/).filter(Boolean).join(' ');
      query.select(fields);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const products = await query.skip(skip).limit(limit).select('title price rating image');
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get single product placeholder
export const getProduct = (req, res) => {
  try {
    return res.status(200).json(req.product);
  } catch (err) {
    return res.status(500).json({message: `${err}`});
  }
};

// Add new product with image upload

  
export const addProduct = async (req, res) => {
  const { title, description, price, category, brand } = req.body;
  const image = req.image; // set by fileCheck middleware
  try {
    await Product.create({
      title,
      description,
      price,
      image: req.image,
      category,
      brand
    });
    return res.status(200).json({ message: 'product added successfully' });
  } catch (err) {
    fs.unlink(`./uploads${req.image}`, (imageErr) => {
      return res.status(400).json({ message: `${err}` });
    });


  }
}


// Update product, with optional image change
export const updateProducts = async (req, res) => {
  const product = req.product;
  const { title, description, price, category, brand } = req.body;
  try {

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    if (req.image) {
      fs.unlink(`./uploads${product.image}`, async (err) => {
        product.image = req.image;
        await product.save();
      })
    } else {
      await product.save();
    }

    return res.status(200).json({ message: 'product updated successfully' });
  } catch (err) {
    fs.unlink(`./uploads${req.image}`, (imageErr) => {
      return res.status(400).json({ message: `${err}` });
    });
  }
}

// Delete product and remove its image
export const removeProducts = async (req, res) => {
  const product = req.product;
  try {
    fs.unlink(`./uploads${product.image}`, async (imageErr) => {
      if (imageErr) return res.status(400).json({ message: `${imageErr}` });
      await Product.findByIdAndDelete(product._id);
      return res.status(200).json({ message: 'product removed successfully' });
    })

  } catch (err) {
    return res.status(400).json({ message: `${err}` });

  }
}

export const reviewProduct = async (req, res) => {
  const { id } = req.params
  const { username, rating, comment } = req.body;
  console.log(req.body);
  try {

    const isExist = await Product.findById(id);
    if (!isExist) return res.status(404).json({ message: 'product not found' });

    isExist.reviews.push({ username, rating, comment });
    const avgRating = isExist.reviews.reduce((acc, curr) => acc + curr.rating, 0) / isExist.reviews.length;
    isExist.rating = avgRating;
    await isExist.save();
    return res.status(200).json({ message: 'review added successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });

  }
}
