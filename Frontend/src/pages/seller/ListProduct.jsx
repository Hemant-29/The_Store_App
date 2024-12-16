import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import SellerTitlebar from "../../components/SellerTitlebar";
import Footer from "../../components/Footer";
import { colorContext, urlContext } from "../../../context/context";

const ListProduct = () => {
  const appColors = useContext(colorContext);
  const baseUrl = useContext(urlContext);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    image: "",
    description: "",
    company: "",
    features: "",
    specifications: "",
    additionalInfo: "",
    stock: "",
    category: "",
    tags: "",
    price: "",
    mrp: "",
    discount: "",
    offers: "",
    replacement: "",
    return: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [offers, setOffers] = useState([]);
  const [offerInput, setOfferInput] = useState({
    offer: "",
    description: "",
    amount: "",
  });

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [specifications, setSpecifications] = useState({});
  const [specsKeyInput, setSpecsKeyInput] = useState("");
  const [specsValueInput, setSpecsValueInput] = useState("");

  const [additionalInfo, setAdditionalInfo] = useState({});
  const [addInfoKeyInput, setAddInfoKeyInput] = useState("");
  const [addInfoValueInput, setAddInfoValueInput] = useState("");

  // Effect Hooks
  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      tags: tags,
      offers: offers,
      features: features,
      specifications: specifications,
      additionalInfo: additionalInfo,
    }));
  }, [tags, offers, features, specifications, additionalInfo]);

  // Upload product image to the Backend
  const uploadProductImage = async (productId) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/seller/product/image/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        }
      );

      if (response) {
        console.log(
          "Product's image upload response:",
          response.data.msg || response
        );
      }
    } catch (error) {
      console.log(
        "An error occured:",
        error.response.data ||
          error ||
          "Error Occured while adding the product image"
      );
    }
  };

  // Upload Product to the Backend
  const uploadProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/seller/product`,
        product,
        { withCredentials: true }
      );

      if (response) {
        console.log("Products upload response:", response.data || response);
        if (response.data.product._id) {
          const productId = response.data.product._id;
          uploadProductImage(productId);
        }
      }
    } catch (error) {
      console.log(
        "An error occured:",
        error.response.data || error || "Error Uploading the product details"
      );
    }
  };

  // Image function
  const addImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create a URL for the selected image file to display in the img tag
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
  };

  // Tag Functions
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      if (tagInput.trim() !== "") {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Offers Functions
  const offersInputChange = (e) => {
    const { name, value } = e.target;
    setOfferInput({ ...offerInput, [name]: value });
  };
  const handleAddOffer = () => {
    if (
      offerInput.offer.trim() &&
      offerInput.description.trim() &&
      offerInput.amount
    ) {
      setOffers([
        ...offers,
        { ...offerInput, amount: parseFloat(offerInput.amount) },
      ]);
      setOfferInput({ offer: "", description: "", amount: "" });
    }
  };
  const handleRemoveOffer = (index) => {
    setOffers(offers.filter((_, i) => i !== index));
  };

  //   Features functions
  const featuresInputChange = (e) => {
    const { value } = e.target;
    setFeatureInput(value);
  };
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };
  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  //   Specifications Functions

  const handleAddSpecification = () => {
    if (specsKeyInput.trim() && specsValueInput.trim()) {
      setSpecifications({
        ...specifications,
        [specsKeyInput]: specsValueInput,
      });
      setSpecsKeyInput("");
      setSpecsValueInput("");
    }
  };

  const handleRemoveSpecification = (key) => {
    const newSpecifications = { ...specifications };
    delete newSpecifications[key];
    setSpecifications(newSpecifications);
  };

  // Additinal Info function
  const handleAddInfo = () => {
    if (addInfoKeyInput.trim() && addInfoValueInput.trim()) {
      setAdditionalInfo({
        ...additionalInfo,
        [addInfoKeyInput]: addInfoValueInput,
      });
      setAddInfoKeyInput("");
      setAddInfoValueInput("");
    }
  };
  const handleRemoveInfo = (key) => {
    const newAdditionalInfo = { ...additionalInfo };
    delete newAdditionalInfo[key];
    setAdditionalInfo(newAdditionalInfo);
  };

  // Submit Form functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   const response = await axios.post("/api/products", product);
      //   console.log(response.data);
      console.log("Data sent to the api:", product);
      alert("Product added successfully");
    } catch (error) {
      console.error("There was an error adding the product!", error);
    }
  };

  return (
    <>
      <SellerTitlebar></SellerTitlebar>
      <div
        className={`p-10 ${appColors.bgColor} text-${appColors.fgColor}`}
        id="seller-list-products"
      >
        <h1 className="text-2xl font-bold mb-5">List a New Product</h1>
        <form onSubmit={uploadProduct} className="space-y-4 w-full">
          <div className="flex flex-col lg:flex-row gap-10">
            <div
              className={`flex flex-col items-center relative w-full lg:w-140 pb-6 mb-8  ${appColors.fgColor}`}
            >
              <div className=" text-center aspect-square w-2/3  lg:w-140 lg:top-32 lg:sticky bg-stone-400 bg-opacity-40 rounded-2xl">
                <div
                  className={`flex flex-col items-center justify-center text-${appColors.fgColor}`}
                >
                  <p>Your Image Here :-</p>
                  {imagePreview && <img src={imagePreview} />}
                  <input type="file" onChange={addImage}></input>
                </div>
              </div>
            </div>

            <div
              id="seller-add-product-Right_Side_Section"
              className="flex flex-col w-full gap-8"
            >
              {/* Product Name */}
              <div>
                <label className="block font-medium h-8">Name</label>
                <textarea
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded min-h-20"
                  rows="2"
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded min-h-28"
                />
              </div>

              {/* Product MRP */}
              <div>
                <label className="block font-medium">MRP</label>
                <input
                  type="number"
                  name="mrp"
                  value={product.mrp}
                  onChange={handleChange}
                  className="w-fit p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Product Price */}
              <div>
                <label className="block font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-fit p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Product Company */}
              <div>
                <label className="block font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  value={product.company}
                  onChange={handleChange}
                  className="w-fit p-2 border border-gray-300 rounded"
                  style={{ width: "350px" }}
                />
              </div>

              {/* Product Stock */}
              <div>
                <label className="block font-medium">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleChange}
                  className="w-fit p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="block font-medium">Category</label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={{ width: "350px" }}
                />
              </div>

              {/* Product Tags */}
              <div>
                <label className="block font-medium">Tags</label>
                <div className="flex flex-wrap">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-gray-300 text-black p-1 m-1 rounded flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-black shadow-none"
                        onClick={() => removeTag(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Press space to add tag"
                  />
                </div>
              </div>

              {/* Product Discount */}
              <div>
                <label className="block font-medium">Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={product.discount}
                  onChange={handleChange}
                  className="w-fit p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Product Replacement */}
              <div>
                <label className="block font-medium">Replacement Policy</label>
                <input
                  type="text"
                  name="replacement"
                  value={product.replacement}
                  onChange={handleChange}
                  placeholder="ex: 15 days replacement"
                  className="w-fit p-2 border border-gray-300 rounded"
                />
              </div>

              {/* product Return */}
              <div>
                <label className="block font-medium">Return Policy</label>
                <input
                  type="text"
                  name="return"
                  value={product.return}
                  onChange={handleChange}
                  placeholder={"ex: 7 days Return:"}
                  className="w-fit p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          <div
            id="seller-list-product-lower_section"
            className="flex flex-col gap-8"
          >
            {/* Product Offers */}
            <div>
              <label className="block font-medium">Offers</label>
              <div className="space-y-2">
                {offers.map((offer, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="bg-gray-200 text-black p-1 rounded flex-grow">
                      {offer.offer} - {offer.description} - ₹{offer.amount}
                    </div>
                    <button
                      type="button"
                      className="text-red-500 shadow-none"
                      onClick={() => handleRemoveOffer(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div className="flex flex-col space-y-1 w-full">
                  <input
                    type="text"
                    name="offer"
                    placeholder="Offer"
                    value={offerInput.offer}
                    onChange={offersInputChange}
                    className="p-2 border border-gray-300 rounded"
                    style={{ maxWidth: "600px" }}
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={offerInput.description}
                    onChange={offersInputChange}
                    className="p-2 border border-gray-300 rounded h-20"
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={offerInput.amount}
                    onChange={offersInputChange}
                    className="p-2 border border-gray-300 rounded w-fit"
                  />
                  <button
                    type="button"
                    onClick={handleAddOffer}
                    className="bg-blue-500 w-fit text-white p-2 rounded"
                  >
                    Add Offer
                  </button>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div>
              <label className="block font-medium">Features</label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="bg-gray-200 text-black p-1 rounded flex-grow flex-wrap h-14 overflow-y-scroll">
                      {feature}
                    </div>
                    <button
                      type="button"
                      className="text-red-500 shadow-none"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div className="flex flex-col gap-3 sm:flex-row space-x-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={featuresInputChange}
                    className="p-2 border border-gray-300 rounded flex-grow"
                    placeholder="Enter feature and press add"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Product Specifications*/}
            <div>
              <label className="block font-medium">Specifications</label>
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div className="bg-gray-200 text-black p-1 rounded flex-grow">
                      {key}: {value}
                    </div>
                    <button
                      type="button"
                      className="text-red-500 shadow-none"
                      onClick={() => handleRemoveSpecification(key)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div className="flex flex-col gap-3 sm:flex-row space-x-2">
                  <input
                    type="text"
                    value={specsKeyInput}
                    onChange={(e) => setSpecsKeyInput(e.target.value)}
                    className="p-2 border border-gray-300 rounded flex-grow"
                    placeholder="Specification Title"
                  />
                  <input
                    type="text"
                    value={specsValueInput}
                    onChange={(e) => setSpecsValueInput(e.target.value)}
                    className="p-2 border border-gray-300 rounded flex-grow"
                    placeholder="Specification"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block font-medium">Additional Info</label>
              <div className="space-y-2">
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center space-x-2 text-black"
                  >
                    <div className="bg-gray-200 p-1 rounded flex-grow">
                      {key}: {value}
                    </div>
                    <button
                      type="button"
                      className="text-red-500 shadow-none"
                      onClick={() => handleRemoveInfo(key)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <div className="flex flex-col gap-3 sm:flex-row space-x-2">
                  <input
                    type="text"
                    value={addInfoKeyInput}
                    onChange={(e) => setAddInfoKeyInput(e.target.value)}
                    className="p-2 border border-gray-300 rounded flex-grow"
                    placeholder="Info Title"
                  />
                  <input
                    type="text"
                    value={addInfoValueInput}
                    onChange={(e) => setAddInfoValueInput(e.target.value)}
                    className="p-2 border border-gray-300 rounded flex-grow"
                    placeholder="Info"
                  />
                  <button
                    type="button"
                    onClick={handleAddInfo}
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Product Button */}

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="my-5 w-44 h-16 p-2 bg-blue-500 text-white font-bold rounded"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
      <Footer></Footer>
    </>
  );
};

export default ListProduct;
