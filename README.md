# E-Commerce Project

## Important Note!

When you open the website using this link: the-store-app.vercel.app (specially on the Edge browser), please follow these steps to ensure login functionality works smoothly:

1. Go to the address bar of your browser.

2. Click the icon on the left side (usually a padlock or info symbol).

3. Select "Cookies and site data" or a similar option.

4. If the "Block third-party cookies" setting is enabled, make sure to disable it.

## Overview

This is a comprehensive E-commerce web application built using modern web technologies. The project features both a robust backend and an intuitive frontend, providing functionality for buyers, sellers, and administrators. It facilitates product listing, user authentication, and smooth order management.

---

## Project Directory Structure

### Backend

The backend is built with Node.js, Express.js, and MongoDB, leveraging the Mongoose ODM for data modeling. It includes the following key components:

- **`server.js`**: The entry point of the backend server.
- **`api`**: Contains API-related configurations.
- **`controllers`**: Defines controllers for `products`, `sellers`, and `users`, handling business logic.
- **`models`**: Includes Mongoose models for database entities like `Product`, `User`, and `Seller`.
- **`routes`**: Contains the application routing logic for handling API endpoints.
- **`db`**: Manages database connections.
- **`middleware`**: Custom middleware for request validation, authentication, etc.
- **`utils`**: Utility functions to enhance reusability.
- **`Postman`**: Includes sample API collections for testing.
- **`products.json`**: A sample JSON file for seeding products into the database.
- **`Database`**: Contains sample product images.

### Frontend

The frontend is developed using ReactJS with Vite for build optimization. It provides a responsive and user-friendly interface for interacting with the platform.

- **`src`**: Core folder containing:
  - `pages`: Manages the app's page components, like Home, Product Details, Login, etc.
  - `components`: Reusable UI components like Navbar, Footer, and Product Cards.
  - `assets`: Includes images and icons used throughout the project.
  - `functions`: Contains helper functions for API calls and other utilities.
  - `context`: Implements Context API for state management.
- **`dist`**: Distribution folder for the production build.
- **`public`**: Public assets, such as the `vite.svg` logo.
- **`index.html`**: The entry point for rendering the React application.
- **Configuration files**:
  - `tailwind.config.js`: For customizing Tailwind CSS.
  - `eslint.config.js`: For linting rules.
  - `vite.config.js`: For configuring Vite.

---

## Features

### User Features

- **Authentication**:
  - User registration and login.
  - Secure password hashing using bcrypt.
  - Role-based access (buyers, sellers, admins).
- **Product Browsing**:
  - Search for products.
  - Filter products by categories, price, and ratings.
  - View detailed product descriptions.
- **Cart Management**:
  - Add, update, or remove products from the cart.
  - View cart summary and estimated total.
- **Order Placement**:
  - Checkout process with form validation.
  - Integration with payment gateway (to be added).
- **Profile Management**:
  - Update user details like name, email, and address.

### Seller Features

- **Product Management**:
  - Add, edit, or remove products.
  - Upload product images directly.
  - View performance metrics (sales, views).

### Admin Features

- **User Management**:
  - View all registered users.
  - Ban/unban users.
- **Analytics**:
  - Dashboard for monitoring sales, products, and user activity.

---

## Setup

### Prerequisites

- Node.js (>=16.x)
- MongoDB (local or cloud-based like MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd C:\Users\heman\OneDrive\Documents\WebDev\BackEnd\Project_Store
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in the `.env` file (sample provided).
4. Start the server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd C:\Users\heman\OneDrive\Documents\WebDev\BackEnd\Project_Store\Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000`.

---

## Deployment

### Backend

The backend includes a `vercel.json` file for deployment configuration. It can be deployed to services like Vercel or Heroku.

### Frontend

The frontend is optimized for deployment using Vite and can be hosted on platforms like Vercel or Netlify.

---

## API Documentation

API endpoints are documented in the Postman collection located in the `Postman` folder. Import it into Postman to view and test API functionalities.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
