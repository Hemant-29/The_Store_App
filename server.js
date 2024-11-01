const express = require('express');
const app = express();

const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('express-async-errors');


// Requires
const connectDB = require("./db/connect")
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// Varibales
const port = 5000 || process.env.PORT;


// Middlewares
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Serving Static files
app.use(express.static(path.join(__dirname, "Frontend/dist")));


app.use('/api/v1/products', productsRouter)

// Error Middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start Function
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
            console.log(`Link: http://localhost:${port}`);
        })
    } catch (error) {
        console.log(error)
    }
}



start();