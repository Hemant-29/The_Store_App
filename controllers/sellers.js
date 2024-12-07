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
                    boughtProducts: existingUser.boughtProducts,
                }
                const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' })
                const decodedToken = jwt.decode(accessToken);



                return res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use Secure in production
                    sameSite: 'Strict', // Prevent CSRF
                    maxAge: 2 * 60 * 1000, // 2 minutes
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
        const users = await sellersModel.find();

        const products = users.flatMap(user => (user.products || [])
            .map(product => {
                return {
                    ...product.toObject(),
                    seller: user.username,
                    sellerId: user._id
                }
            })
        )


        res.status(200).json({ products: products, nbHits: products.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const getAllUserProducts = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await sellersModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Seller with ID not found" });
        }

        res.status(200).json({ products: user.products })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const addProduct = async (req, res) => {
    try {
        // Upload image buffer to Cloudinary
        const cloudImage = await cloudinaryUpload(req.file.buffer);

        // Get the user ID from the request parameters
        const { userId } = req.params;

        // Find the user by ID
        const user = await sellersModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Seller with ID not found" });
        }

        // Create a new product object with the Cloudinary image link
        const product = new ProductsModel({
            name: req.body.name,
            price: req.body.price,
            company: req.body.company,
            rating: req.body.rating,
            featured: req.body.featured,
            image: cloudImage.secure_url  // Use Cloudinary URL for image
        });

        // Add the new product to the user's products array
        user.products.push(product);


        // Save the updated user document
        await user.save();

        res.status(201).json({ msg: 'Product added Successfully', product: product });
    } catch (error) {
        console.error(error); // Log any errors to the console
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Find the user by ID to get the full document
        const user = await sellersModel.findById(userId);
        console.log("seller id:", userId)
        if (!user) {
            return res.status(404).json({ error: "Seller with ID not found" });
        }

        // Filter out the product with the specified productId
        user.products = user.products.filter(product => product._id.toString() !== productId);

        // Save the updated user document
        await user.save();

        res.status(200).json({ msg: 'Product deleted successfully', seller: user })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getSeller,
    getAllSellers,
    addSeller,
    loginSeller,
    deleteSeller,
    getAllProducts,
    getAllUserProducts,
    addProduct,
    deleteProduct
}