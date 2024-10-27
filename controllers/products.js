const ProductsModel = require('../models/product')
const cloudinaryUpload = require('../utils/cloudinary.js');


const getAllProductsStatic = async (req, res) => {
    try {
        const products = await ProductsModel.find();

        // Map over products to convert buffer data to base64
        const productsWithImages = products.map((product) => {
            if (product.image && product.image.data) {
                return {
                    ...product._doc,
                    image: `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`
                };
            }
            return product;
        });

        res.status(200).json({ products: productsWithImages, nbHits: productsWithImages.length });
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


    let limit = 3;
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

const addProduct = async (req, res) => {
    try {
        let { name, price, featured, company } = req.body;

        // Upload image to Cloudinary
        const cloudImage = await cloudinaryUpload(req.file.path);
        console.log("Cloudinary file path: ", cloudImage.secure_url);

        // Create a new product with the Cloudinary image link
        const product = ProductsModel.create({
            name: req.body.name,
            price: req.body.price,
            company: req.body.company,
            rating: req.body.rating,
            featured: req.body.featured,
            image: cloudImage.secure_url  // Cloudinary URL
        });

        res.status(201).json({ product });
    } catch (error) {
        console.error(error); // Log any errors to the console
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const result = await ProductsModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ result: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
    addProduct,
    deleteProduct
}