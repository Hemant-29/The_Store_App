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
const publicRouter = require('./routes/public')

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// Varibales
const port = 5000 || process.env.PORT;


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

const corsOptions = {
    origin: ['https://the-store-app.vercel.app', 'http://localhost:5173'], // Frontend's URL
    // origin: 'http://localhost:5173', 
    credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions)); // Enable CORS for all routes

// Serving Static files
app.use(express.static(path.join(__dirname, "Frontend/dist")));

// // React Fallback Route (Client-Side Routing)
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(staticPath, 'index.html')); // Serve React app for all other routes
// });

app.use('/api/v1/products', productsRouter)
app.use('/api/v1/user', usersRouter)
app.use('/api/v1/seller', sellersRouter)
app.use('/api/v1/public', publicRouter)

// Error Middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start Function
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        })
    } catch (error) {
        console.log(error)
    }
}



start();