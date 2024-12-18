const mongoose = require('mongoose');
const sellersModel = require('../models/sellers')
const ProductsModel = require('../models/products.js')
const jwt = require('jsonwebtoken');
const cloudinaryUpload = require('../utils/cloudinary.js');


const getAllSellers = async (req, res) => {
    try {
        const users = await sellersModel.find();

        res.status(200).json({ sellers: users, nbHits: users.length })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getSeller = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({ seller: user })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const addSeller = async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ msg: 'Username and password must be provided' });
        }

        const existingUser = await sellersModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        const user = await sellersModel.create({
            username: username,
            password: password
        })

        res.status(201).json({ msg: "Seller created sucessfully!", user: user });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const loginSeller = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password must be provided' });
        }

        const existingUser = await sellersModel.findOne({ username });
        if (existingUser) {
            if (existingUser.password == password) {

                const userPayload = {
                    id: existingUser._id,
                    username: existingUser.username,
                    products: existingUser.products,
                }
                const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' })
                const decodedToken = jwt.decode(accessToken);



                return res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use Secure in production
                    sameSite: 'none', // Prevent CSRF
                    maxAge: 5 * 60 * 1000, // 5 minutes
                }).status(200).json({
                    msg: "Logged In sucessfully!",
                    user: userPayload,
                    accessToken: accessToken,
                    iat: decodedToken.iat,
                    exp: decodedToken.exp
                })
            }
            return res.status(401).json({ msg: "Incorrect Password!" });
        }
        res.status(404).json({ msg: "No user found!" });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const logoutSeller = (req, res) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use Secure in production
            sameSite: 'none', // Prevent CSRF
        }).status(200).json({ msg: "Logged out successfully!" });
    } catch (error) {
        res.state(500).json({ error: error })
    }
};

const deleteSeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const result = await sellersModel.deleteOne({ _id: sellerId })
        res.status(200).json({ msg: 'deleted Successfully!', result: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// _____________________________Product Controllers________________________________________

const getAllProducts = async (req, res) => {
    try {

        // Authenticate User
        const seller = await sellersModel.findById(req.user.id);
        if (!seller) {
            res.status(401).json({ error: 'Not authorized' })
        }

        const users = await sellersModel.find();

        // Collect all product IDs 
        const productIds = [];
        users.forEach(user => {
            productIds.push(...user.products);
        });

        // Find all products by their IDs using Promise.all 
        const allProducts = await Promise.all(productIds.map(id => ProductsModel.findById(id)));

        res.status(200).json({ products: allProducts, nbHits: allProducts.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllUserProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await sellersModel.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: "Seller not found" });
        }

        res.status(200).json({ msg: "Products Fetched successfully", products: user.products, sellerID: userId })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const addProduct = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the seller by ID
        const seller = await sellersModel.findById(userId);
        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }

        // Create a new product object with the Cloudinary image link
        const product = new ProductsModel({
            name: req.body.name,
            description: req.body.description,
            company: req.body.company,
            features: req.body.features,
            createdAt: Date.now(),
            specifications: req.body.specifications,
            additionalInfo: req.body.additionalInfo,
            stock: req.body.stock,
            category: req.body.category, // Ensure category is included
            tags: req.body.tags,
            price: req.body.price,
            mrp: req.body.mrp,
            discount: req.body.discount,
            offers: req.body.offers,
            replacement: req.body.replacement,
            return: req.body.return,
            rating: req.body.rating,
            ratingCount: req.body.ratingCount,
            reviews: req.body.reviews,
            featured: req.body.featured
        });

        const newProduct = await ProductsModel.create(product);


        // Pre initailize the products array in the sellers model
        if (!seller.products) {
            seller.products = [];
        }

        // Add the new product to the seller's products array
        seller.products.push(newProduct._id);

        // Save the updated seller document
        await seller.save();

        res.status(201).json({ msg: 'Product added successfully', product: product });
    } catch (error) {
        console.error(error); // Log any errors to the console
        res.status(500).json({ error: error.message });
    }
};

const addProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Upload image buffer to Cloudinary
        const cloudImage = await cloudinaryUpload(req.file.buffer);


        const userId = req.user.id;
        const seller = await sellersModel.findById(userId);
        if (!seller) {
            return res.status(404).json({ msg: "seller not found" });
        }

        // Get product ID from the request body
        const { productId } = req.body;

        // Find the product by ID within products model
        const product = await ProductsModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product with ID not found" });
        }

        // Verify that product belongs to this seller
        if (!seller.products.find(id => id == productId)) {
            return res.status(400).json({ error: "This product doesn't belong to this seller" })
        }

        // Ensure the image field is an array
        if (!Array.isArray(product.image)) {
            product.image = [];
        }

        // Add the Cloudinary image URL to the product's image array
        product.image.push(cloudImage.secure_url);

        // Save the updated seller document
        await product.save();


        res.status(201).json({ msg: 'Image added successfully', product: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {

        const { productId } = req.params;
        const product = await ProductsModel.findById(productId);
        if (!product) {
            return res.status(400).json({ error: 'Product Not found' })
        }

        // console.log("type of product id:", typeof productId);

        const userId = req.user.id;
        // Find the user by ID to get the full document
        const user = await sellersModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Seller not found" });
        }

        // Check if the product exists within the seller's products 
        const productIndex = user.products.indexOf(productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: "Product with ID doesn't belong to the seller" });
        }

        // Remove the product from the seller's products array 
        user.products.splice(productIndex, 1);
        await user.save();

        // Delete the product from the ProductsModel 
        await ProductsModel.findByIdAndDelete(productId);

        res.status(200).json({ msg: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getSeller,
    getAllSellers,
    addSeller,
    loginSeller,
    logoutSeller,
    deleteSeller,
    getAllProducts,
    getAllUserProducts,
    addProduct,
    addProductImage,
    deleteProduct
}