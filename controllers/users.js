require('dotenv').config();
const usersModel = require('../models/users')
// const productsModel = require('../models/products');
const ProductsModel = require('../models/products');
const ReviewsModel = require('../models/reviews');
const SellersModel = require('../models/sellers')

const jwt = require('jsonwebtoken');
const axios = require('axios');

const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.find();

        res.status(200).json({ users: users, nbHits: users.length })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const completeUser = await usersModel.findById(userId).lean();

        const { password, ...userWithoutPassword } = completeUser;

        res.status(200).json({ user: userWithoutPassword })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const addUser = async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ msg: 'Username and password must be provided' });
        }

        const existingUser = await usersModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        const user = await usersModel.create({
            username: username,
            password: password
        })

        res.status(201).json({ msg: "user created sucessfully!", user: user });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password must be provided' });
        }

        const existingUser = await usersModel.findOne({ username });
        if (existingUser) {
            if (existingUser.password == password) {

                const userPayload = {
                    id: existingUser._id,
                    username: existingUser.username,
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
                    exp: decodedToken.exp,
                })
            }
            return res.status(401).json({ msg: "Incorrect Password!" });
        }
        res.status(404).json({ msg: "No user found!" });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const logoutUser = (req, res) => {
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


// ================================ Upadate User Routes =============================

const updateLoginInfo = async (req, res) => {
    try {
        // Get user from the User ID
        const userID = req.user.id;
        const user = await usersModel.findById(userID);


        const { username, password } = req.body

        // Check if the new username already exists (if username is being updated) 
        if (username) {
            const existingUser = await usersModel.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userID) {
                return res.status(409).json({ msg: 'Username already exists' });
            }
        }

        // Make an object that tells which fields are being updated
        const updateFields = {};
        if (username) {
            updateFields.username = username;
        }
        if (password) {
            updateFields.password = password;
        }

        // Update the entries in the updateFields object
        const updatedUser = await usersModel.findByIdAndUpdate(
            userID,
            updateFields,
            { new: true, useFindAndModify: false } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' })
        }

        res.status(200).json(
            {
                id: updatedUser._id,
                name: updatedUser.username,
                password: updatedUser.password,
                msg: "User-Credentials updated successfuly!"
            }
        );

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updatePersonalInfo = async (req, res) => {
    try {
        // Get user from the User ID
        const userID = req.user.id;
        const user = await usersModel.findById(userID);


        const { name, email, phone, age, gender } = req.body

        // Check if the new E-mail already exists
        if (email) {
            const existingUser = await usersModel.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userID) {
                return res.status(409).json({ msg: 'E-Mail already exists' });
            }
        }

        // Check if the new Phone number already exists
        if (phone) {
            const existingUser = await usersModel.findOne({ phone });
            if (existingUser && existingUser._id.toString() !== userID) {
                return res.status(409).json({ msg: 'Phone number already exists' });
            }
        }

        // Make an object that tells which fields are being updated
        const updateFields = {};

        if (name) {
            updateFields.name = name;
        }
        if (email) {
            updateFields.email = email;
        }
        if (phone) {
            updateFields.phone = phone;
        }
        if (age) {
            updateFields.age = age;
        }
        if (gender) {
            updateFields.gender = gender;
        }

        // Update the entries in the updateFields object
        const updatedUser = await usersModel.findByIdAndUpdate(
            userID,
            updateFields,
            { new: true, useFindAndModify: false } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' })
        }

        res.status(200).json(
            {
                msg: "User Personal Details updated successfuly!",
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
            }
        );

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



// ===========================Address Routes==================================
const getAllAddress = async (req, res) => {
    try {
        // Get user from the User ID
        const userID = req.user.id;
        const user = await usersModel.findById(userID);

        const addressArray = user.address;

        res.status(200).json({ msg: "Addresses found", address: addressArray })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const addNewAddress = async (req, res) => {
    try {
        // Get user from the User ID
        const userID = req.user.id;
        const user = await usersModel.findById(userID);


        const { person, phone, address, landmark, city, state, pin, type, isDefault } = req.body;

        // Validate that all required fields for address are provided
        if (!person || !phone || !address || !city || !state || !pin || !type) {
            return res.status(400).json({ msg: "All required fields must be provided" });
        }

        // Create a new address object
        const newAddress = { person, phone, address, city, state, pin, type };

        if (landmark) {
            newAddress.landmark = landmark;
        }

        if (isDefault) {
            newAddress.isDefault = isDefault;
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }


        // Add the new address to the user's address array
        user.address.push(newAddress);
        await user.save();


        res.status(200).json(
            {
                msg: "Address Added successfuly!",
                id: user._id,
                address: user.address,
            }
        );

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateAddressInfo = async (req, res) => {
    try {
        const userID = req.user.id; // Get user ID from the request
        const { addressID } = req.params; // Get address ID from the route parameters
        const { person, phone, address, landmark, city, state, pin, type, isDefault } = req.body;

        // Find the user by ID
        const user = await usersModel.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        // Find the specific address in the user's address array
        const addressToUpdate = user.address.id(addressID);
        if (!addressToUpdate) {
            return res.status(404).json({ msg: "Address to update not found!" });
        }

        // Update only the fields provided in req.body
        if (person !== undefined) addressToUpdate.person = person;
        if (phone !== undefined) addressToUpdate.phone = phone;
        if (address !== undefined) addressToUpdate.address = address;
        if (landmark !== undefined) addressToUpdate.landmark = landmark;
        if (city !== undefined) addressToUpdate.city = city;
        if (state !== undefined) addressToUpdate.state = state;
        if (pin !== undefined) addressToUpdate.pin = pin;
        if (type !== undefined) addressToUpdate.type = type;
        if (isDefault !== undefined) addressToUpdate.isDefault = isDefault;

        // Save the updated user document
        await user.save();

        res.status(200).json({
            msg: "Address updated successfully!",
            address: addressToUpdate,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const makeDefaultAddress = async (req, res) => {
    try {
        // Get user from the User ID
        const userID = req.user.id;
        const user = await usersModel.findById(userID);

        // address ID
        const { addressID } = req.params;

        const addresses = user.address;
        const addressToChange = addresses.find(address => address._id.toString() === addressID);

        if (addresses) {
            // Set all the other addresses to false
            addresses.forEach(address => {
                address.isDefault = false;
            })

            if (addressToChange)
                addressToChange.isDefault = true;

            await user.save();
        }

        res.status(200).json({ msg: "address made Default", address: user.address })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const userID = req.user.id; // Get user ID from the request
        const { addressID } = req.params; // Get address ID from the route parameters

        // Find the user by ID
        const user = await usersModel.findById(userID);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Find the index of the address in the user's address array
        const addressIndex = user.address.findIndex((addr) => addr._id.toString() === addressID);

        if (addressIndex === -1) {
            return res.status(404).json({ msg: "Address not found" });
        }

        // Remove the address from the array
        user.address.splice(addressIndex, 1);

        // Save the updated user document
        await user.save();

        res.status(200).json({
            msg: "Address deleted successfully!",
            addressID: addressID,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================================== WishList Routes ========================================


const getWishList = async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await usersModel.findById(userID);

        if (!user) {
            return res.status(400).json({ msg: "No user found!" });
        }

        const wishlist = user.wishlist;

        // Fetch all products once to minimize database calls
        const products = await ProductsModel.find();

        // Helper function to get detailed product
        const getDetailedProduct = (productID) => {
            return products.find(obj => obj._id.toString() === productID.toString());
        };

        // Transform the wishlist with detailed product info
        const detailedWishlist = wishlist.map(list => ({
            listName: list.listName,
            products: list.product.map(productId => getDetailedProduct(productId))
        }));

        // Send response with detailed wishlist
        res.status(200).json({ msg: "Wishlist fetched successfully", wishlist: detailedWishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const addToWishlist = async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await usersModel.findById(userID);

        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        let { listName, product } = req.body;

        // Check the Authenticity of product
        const productExist = await ProductsModel.findById(product);
        if (!productExist) {
            return res.status(400).json({
                error: "This Product doesn't exist"
            })
        }

        // Ensure wishlist is initialized
        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Set the wishlistItem based on whether the list Name is provided or not
        let wishlistItem;
        if (!listName) {
            // Add to the Default wishlist
            wishlistItem = user.wishlist.find(obj => obj.listName === "liked");
        } else {
            // Add to the wishlist with listName
            wishlistItem = user.wishlist.find(obj => obj.listName === listName);
        }

        if (wishlistItem) {
            // Check if product already exists in the wishlist
            const productExists = wishlistItem.product.some(p => p.equals(product));

            if (productExists) {
                return res.status(400).json({ msg: "Product already exists in the wishlist" });
            } else {
                wishlistItem.product.push(product);
            }
        } else {
            // If wishlist with listName is not found, create a new one
            user.wishlist.push({
                listName: listName || "liked",
                product: [product],
            });
        }

        await user.save();

        res.status(200).json({ msg: "Wishlist updated successfully", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteWishlist = async (req, res) => {
    try {
        const userID = req.user.id;
        const user = await usersModel.findById(userID);

        if (!user) {
            return res.status(404).json({ msg: "User not found!" });
        }

        const { listName, product } = req.body;


        // Ensure wishlist is initialized
        if (!user.wishlist) {
            user.wishlist = [];
        }

        if (!listName && !product) {
            res.status(400).json({ msg: "List name and Product name not defined!" })
        }

        let wishlistItem = user.wishlist.find(obj => obj.listName === listName);

        if (!wishlistItem) {
            return res.status(404).json({ msg: "Wishlist item not found!" });
        }

        // If product is defined, remove it from the wishlist item 
        if (product) { wishlistItem.product = wishlistItem.product.filter(p => !p.equals(product)); }
        else {
            // If product is not defined, remove the entire wishlist item 
            user.wishlist = user.wishlist.filter(obj => obj.listName !== listName);
        }


        await user.save();

        res.status(200).json({ msg: "Wishlist item deleted successfully", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// =============================== Products Cart Route =================================
const addToCart = async (req, res) => {
    try {
        const productId = req.params.id;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ error: "Invalid product ID!" });
        }

        // Find the user by ID
        const userId = req.user.id;
        const user = await usersModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Pre-initialise the Cart array
        if (!user.cart) {
            user.cart = [];
        }

        // Check if the product already exists in the cart
        const cartItem = user.cart.find(item => item.productId == productId);

        if (cartItem) {
            // If product exists, increase the amount
            cartItem.amount += 1;
        } else {

            // Add the new product to the cart
            user.cart.push({
                productId: productId,
                amount: 1
            });
        }

        // Save the updated user document
        await user.save();

        res.status(201).json({ msg: "Added to Cart!", cart: user.cart });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getCart = async (req, res) => {
    try {
        // Find the user by ID
        const userId = req.user.id;

        // Find the user by ID
        const user = await usersModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const productId = req.params.id;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ error: "Invalid product ID!" });
        }

        // Find the user by ID
        const userId = req.user.id;
        const user = await usersModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Find the product in the user's cart
        const cartItemIndex = user.cart.findIndex(item => item.productId == productId);

        if (cartItemIndex == -1) {
            return res.status(404).json({ error: "Product not found in the cart!" });
        }

        const cartItem = user.cart[cartItemIndex];

        if (cartItem.amount > 1) {
            // Reduce amount by 1
            cartItem.amount -= 1;
        } else {
            // Remove the product from the cart
            user.cart.splice(cartItemIndex, 1);
        }

        // Save the updated user document
        await user.save();

        res.status(200).json({ msg: "Product removed from cart!", cart: user.cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// ========================== User Product Review Route ==========================

const addReview = async (req, res) => {

    const { rating, comment, title } = req.body;
    const userId = req.user.id; // Assuming user is authenticated
    const user = await usersModel.findById(userId);
    try {

        // Find the product 
        const product = await ProductsModel.findById(req.params.id);
        if (!product) { return res.status(404).json({ msg: 'Product not found' }); }
        if (!user) { return res.status(404).json({ msg: 'User not found' }); }

        // If reviews doesnt exists in the user and product DBs
        if (!product.reviews) {
            product.reviews = [];
            product.rating = 0;
        }
        if (!user.reviews) {
            user.reviews = [];
        }

        // Check if the user has already reviewed the product
        const existingReview = await ReviewsModel.findOne({ user: userId, product: req.params.id });
        if (existingReview) {
            return res.status(400).json({ error: 'You cannot review the product again' });
        }



        // Recalculate the average rating
        const totalReviews = product.reviews.length;
        const newRating = ((product.rating * totalReviews + rating) / (totalReviews + 1)).toFixed(1);
        product.rating = parseFloat(newRating);


        // Create a new review
        const review = new ReviewsModel({
            user: userId,
            product: req.params.id,
            rating: rating,
            title: title,
            comment: comment,
        });
        await review.save();

        // Update the product with the new review
        product.reviews.push(review._id);
        await product.save();

        // Update the user with the new review 
        user.reviews.push(review._id);
        await user.save();


        res.status(201).json({ msg: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await usersModel.findById(userId);
        if (!user) return res.status(400).json({ error: 'User not found' });

        // Get review Ids
        const reviewIds = user.reviews;
        if (!reviewIds) {
            return res.status(404).json({ error: 'No reviews found' });
        }

        // Fetch reviews from review IDs
        const reviews = await Promise.all(reviewIds.map(async reviewId => {
            return await ReviewsModel.findById(reviewId);
        }));

        // Get All the user reviews
        res.status(200).json({ msg: 'Reviews found', reviews: reviews });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await usersModel.findById(userId);
        if (!user) return res.status(400).json({ error: 'User not found' });

        const { reviewId } = req.params;

        // Find the review in the reviewModel
        const review = await ReviewsModel.findById(reviewId);
        if (!review) {
            return res.status(400).json({ error: "Review doesn't exist" });
        }

        await ReviewsModel.deleteOne({ _id: reviewId });

        // Update user's reviews array
        const reviewIndex = user.reviews.indexOf(reviewId);
        if (reviewIndex !== -1) {
            user.reviews.splice(reviewIndex, 1);
            await user.save();
        }

        res.status(200).json({ msg: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const upvoteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reviewId } = req.params;

        // Find the review by ID
        const review = await ReviewsModel.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' }); // [CHANGE] Corrected error message capitalization
        }

        // Check if the user has already upvoted the review
        const hasUpvoted = review.upvotes.includes(userId);
        if (hasUpvoted) {
            // Remove the user's ID from the upvotes array (downvote)
            review.upvotes = review.upvotes.filter(id => id.toString() !== userId);
            await review.save();
            return res.status(200).json({ msg: 'Review downvoted successfully', upvotes: review.upvotes.length });
        }


        // Add the user's ID to the upvotes array
        review.upvotes.push(userId); // [CHANGE] Added user ID to upvotes
        await review.save(); // [CHANGE] Save the updated review document

        res.status(200).json({ msg: 'Review upvoted successfully', upvotes: review.upvotes.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserPublic = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await usersModel.findById(userId);

        const defaultAddress = user.address.find(address => address.isDefault);

        if (!defaultAddress) defaultAddress = "";

        res.status(200).json({ user: { name: user.name, city: defaultAddress.city } })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    getAllUsers,
    getUser,
    addUser,
    loginUser,
    logoutUser,
    addToCart,
    getCart,
    deleteFromCart,
    updateLoginInfo,
    updatePersonalInfo,
    updateAddressInfo,
    addNewAddress,
    deleteAddress,
    getAllAddress,
    makeDefaultAddress,
    getWishList,
    addToWishlist,
    deleteWishlist,
    addReview,
    getReviews,
    deleteReview,
    upvoteReview,
    getUserPublic
}