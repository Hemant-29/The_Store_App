const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('express-async-errors');


// Requires
const connectDB = require("./db/connect")
const productsRouter = require('./routes/products')
const usersRouter = require('./routes/users')
const sellersRouter = require('./routes/sellers');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// Varibales
const port = 5000 || process.env.PORT;


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions)); // Enable CORS for all routes

// Serving Static files
app.use(express.static(path.join(__dirname, "Frontend/dist")));


app.use('/api/v1/products', productsRouter)
app.use('/api/v1/user', usersRouter)
app.use('/api/v1/seller', sellersRouter)

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