import { useState, useEffect, useContext } from "react";
import { colorContext, urlContext } from "../../context/context";

const ListForm = (props) => {
  const appColors = useContext(colorContext);
  const baseUrl = useContext(urlContext);

  const initialValues = {
    name: "",
    price: 0,
    company: "",
    rating: 0,
    featured: false,
    image: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [submitSucess, setSubmitSucess] = useState(undefined);

  const handleChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setFormErrors(validateForm(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (isSubmit == true) {
      if (Object.keys(formErrors).length == 0) {
        console.log("Final Form values before posting: ", formValues);
        postFormValues();
      } else {
        console.log("Errors in the form: ", formErrors);
        setIsSubmit(false);
      }
    }
  }, [isSubmit]);

  const validateForm = (values) => {
    let errors = {};

    if (!values.name) {
      errors.name = "Product name is required!";
    } else {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(values.name)) {
        errors.name =
          "Product name must not contain special characters or numbers!";
      }
    }

    if (!values.price) {
      errors.price = "A Product price is required!";
    } else {
      const priceRegex = /^(?:0|[1-9]\d{0,5})(?:\.\d{1,2})?$/;
      if (!priceRegex.test(values.price)) {
        errors.price = "Price must be a number!";
      }
    }

    if (!values.company || values.company == "") {
      errors.company = "Company name is required!";
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!values.image) {
      errors.image = "Product image is required!";
    } else if (!validImageTypes.includes(values.image.type)) {
      errors.image = "Invalid Image type!";
    } else if (values.image.size > 1500000) {
      errors.image = "Image must be of maximum 1.5 MB";
    }

    if (values.rating) {
      const ratingRegex = /^(0|[1-4](\.\d{1,2})?|5(\.0{1,2})?)$/;
      if (!ratingRegex.test(values.rating)) {
        errors.rating = "Rating must be a number between 0 and 5!";
      }
    }

    return errors;
  };

  const postFormValues = async () => {
    setIsSubmit(false);

    const formData = new FormData();

    formData.append("name", formValues.name);
    formData.append("price", formValues.price);
    formData.append("company", formValues.company);
    formData.append("rating", formValues.rating);
    formData.append("featured", formValues.featured);
    formData.append("image", formValues.image);

    try {
      const response = await fetch(`${baseUrl}/api/v1/products`, {
        method: "POST",
        body: formData, // Send as FormData (multipart/form-data)
      });
      const result = await response.json();
      console.log("Product added:", result);
      if (result.product) {
        setSubmitSucess(true);
      } else {
        setSubmitSucess(false);
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      setSubmitSucess(false);
    }
  };

  return (
    <>
      <form
        id="listingForm"
        className="flex flex-col gap-5 p-8 max-w-96 text-black"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
        />
        <p className="text-red-500">{formErrors.name}</p>
        <input
          type="text"
          placeholder="price"
          name="price"
          onChange={handleChange}
        />
        <p className="text-red-500">{formErrors.price}</p>
        <select name="company" id="form_company" onChange={handleChange}>
          <option value="">None</option>
          <option value="ikea">Ikea</option>
          <option value="liddy">Liddy</option>
          <option value="macros">Macros</option>
          <option value="caressa">Caressa</option>
        </select>
        <p className="text-red-500">{formErrors.company}</p>
        <input
          type="text"
          placeholder="rating"
          name="rating"
          onChange={handleChange}
        />
        <p className="text-red-500">{formErrors.rating}</p>

        <div className="flex gap-4 items-center">
          <label htmlFor="featured" className={`text-${appColors.fgColor}`}>
            is Featured:
          </label>
          <input
            type="checkbox"
            placeholder="featured"
            id="form_featured"
            name="featured"
            onChange={(evt) => {
              setFormValues({ ...formValues, featured: evt.target.checked });
            }}
          />
        </div>

        <div>
          <label htmlFor="productImage" className={`text-${appColors.fgColor}`}>
            Product Image:
          </label>
          <input
            type="file"
            name="productImage"
            id="productImage"
            className={`text-${appColors.fgColor}`}
            onChange={(evt) => {
              const file = evt.target.files[0];
              if (file) {
                setFormValues({ ...formValues, image: file });
              } else {
                console.log("No file selected");
              }
            }}
          />
          <p className="text-red-500">{formErrors.image}</p>
        </div>

        <button
          type="submit"
          className="bg-orange-100 rounded-md w-56 my-4 p-2 mx-auto text-black"
        >
          Submit
        </button>
      </form>
      <div className="text-red-500 font-bold mb-5">
        {submitSucess ? <p>Product Added Successfully</p> : <></>}
        {submitSucess == false ? <p>Product Can't be Added</p> : <></>}
      </div>
    </>
  );
};

export default ListForm;
