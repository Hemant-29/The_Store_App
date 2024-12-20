const UsersModel = require('../models/users.js')
const ProductsModel = require('../models/products.js')
const SellersModel = require('../models/sellers')
const reviewsModel = require('../models/reviews.js')
const cloudinaryUpload = require('../utils/cloudinary.js');
const { response } = require('express');
const axios = require('axios');
const reviews = require('../models/reviews.js');

const getProduct = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'please provide the product ID' })
        }

        // Filter products based on the id provided in req.params.id 
        const product = await ProductsModel.findById(req.params.id)
        if (!product) {
            res.status(404).json({ msg: 'product was not found!' })
        }

        res.status(200).json({ product: product });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}



const getAllProductsStatic = async (req, res) => {
    try {
        const users = await SellersModel.find();
        if (!users) {
            return res.status(404).json({ error: 'No users found' })
        }

        const productIDs = users.flatMap(user => user.products || []);

        const allProducts = await ProductsModel.find();

        const products = productIDs.map(productID => {
            return allProducts.find(product => product._id.toString() === productID.toString());
        });

        if (productIDs) {
            return res.status(200).json({ products: products, nbHits: products.length });
        }
        res.status(404).json({ msg: "Products not found!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    let { name, featured, price, rating, company, sortby, select } = req.query;
    let searchQuery = {};


    if (featured) {
        console.log(featured);
        console.log(typeof (featured));
        (featured == true || "true") ? featured = true : featured = false;
        searchQuery.featured = featured;
    }

    if (name) {
        // Using regex query search operator
        searchQuery.name = { $regex: name, $options: 'i' };
        //option 'i' stands for case insensitive
    }

    if (price) {
        searchQuery.price = price;
    }

    if (rating) {
        rating = (rating > 5) ? 5 : rating;
        searchQuery.rating = rating;
    }
    if (company) {
        searchQuery.company = company;
    }

    if (sortby) {
        sortby = sortby.split(',').join(' ');
    }

    if (select) {
        select = select.split(',').join(' ');
        console.log("select:", select);
    }


    let limit = 10;
    if (req.query.limit) {
        if (isFinite(req.query.limit)) {
            limit = Number(req.query.limit);
        }
    }

    let page = 1;
    if (req.query.page) {
        if (isFinite(req.query.page)) {
            page = Number(req.query.page);
        }
    }

    let numericFilters = (req.query.numericfilters);
    if (numericFilters) {
        numericFilters = numericFilters.split(',');
        console.log("numeric filters list: ", numericFilters);

        numericFilters.forEach(filter => {

            let filtername, value;
            let operator;

            if (filter.includes('>')) {
                [filtername, value] = filter.split('>');
                operator = '$gt';
            }
            if (filter.includes('<')) {
                [filtername, value] = filter.split('<');
                operator = '$lt';
            }
            if (filter.includes('=')) {
                [filtername, value] = filter.split('=');
                operator = '$eq';
            }
            if (filter.includes('<=')) {
                [filtername, value] = filter.split('<=');
                operator = '$lte';
            }
            if (filter.includes('>=')) {
                [filtername, value] = filter.split('>=');
                operator = '$gte';
            }

            console.log("numeric filters: ", filtername, value);

            if (filtername == 'price') {
                searchQuery.price = { [operator]: value };
            }
            if (filtername == 'rating') {
                searchQuery.rating = { [operator]: value };
            }
        });
    }


    console.log("search Query:", searchQuery);

    try {
        let products = await ProductsModel.find(searchQuery).sort(sortby).limit(limit).skip((page - 1) * limit).select(select);

        const totalHits = await ProductsModel.countDocuments(searchQuery);

        res.status(200).json({ products: products, pageLimit: limit, nbHits: products.length, totalHits: totalHits });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const buyProduct = async (req, res) => {
    const productID = req.params.productID;

    const products = await allProducts();

    // Filter products based on the id provided in req.params.id 
    const product = products.find(p => p._id.toString() === productID)

    if (product) {
        const sellerID = product.sellerId;
        const seller = await SellersModel.findById(sellerID);
        if (seller) {
            seller.orderedProducts.push(product);

            await seller.save();

            return res.status(200).json({ msg: "Product Bought", product: product.name, sellerSold: seller.orderedProducts })
        }
        return res.status(404).json({ msg: "seller not found!" });

    }
    res.status(404).json({ msg: "Product Not found!" })
}

// Reviews Route
const getAllReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await ProductsModel.findById(productId);
        // Get product form the product ID
        if (!product) {
            return res.status(400).json({ error: 'product Not found' });
        }

        // Get reviews from the product
        const reviewIds = product.reviews;
        if (!reviewIds) {
            return res.status(404).json({ error: 'No Reviews found' });
        }

        // const reviews = reviewIds.forEach()
        const reviews = await Promise.all(
            reviewIds.map(
                (reviewId) => reviewsModel.findById(reviewId)
            )
        );

        res.status(200).json({ reviews: reviews });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getProduct,
    getAllProducts,
    getAllProductsStatic,
    getAllReviews,
    buyProduct
}