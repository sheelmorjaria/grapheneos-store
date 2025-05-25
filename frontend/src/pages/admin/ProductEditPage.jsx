import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { FaArrowLeft } from "react-icons/fa";
import {
  listProductDetails,
  updateProduct,
} from "../../redux/actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../../redux/constants/productConstants";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("Google Pixel");
  const [category, setCategory] = useState("Smartphone");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [modelName, setModelName] = useState("");
  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  // Arrays of available options
  const pixelModels = [
    "Pixel 9a",
    "Pixel 9 Pro Fold",
    "Pixel 9 Pro XL",
    "Pixel 9 Pro",
    "Pixel 9",
    "Pixel 8a",
    "Pixel 8 Pro",
    "Pixel 8",
    "Pixel Fold",
    "Pixel Tablet",
    "Pixel 7a",
    "Pixel 7 Pro",
    "Pixel 7",
    "Pixel 6a",
    "Pixel 6 Pro",
    "Pixel 6",
  ];

  const storageOptions = ["64GB", "128GB", "256GB", "512GB", "1TB"];

  const colorOptions = [
    "Black",
    "White",
    "Obsidian",
    "Hazel",
    "Snow",
    "Porcelain",
    "Sage",
    "Rose",
    "Coral",
    "Bay",
    "Lemongrass",
    "Sorta Seafoam",
    "Stormy Black",
    "Cloudy White",
    "Sorta Sunny",
  ];

  const conditionOptions = [
    { value: "A", label: "A - Excellent" },
    { value: "B", label: "B - Good" },
    { value: "C", label: "C - Fair" },
  ];

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        // Populate form with existing product data
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setModelName(product.modelName);
        setStorage(product.storage);
        setColor(product.color);
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        modelName,
        storage,
        color,
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Edit Product | GrapheneOS Store</title>
      </Helmet>
      <Link to="/admin/productlist" className="btn btn-outline mb-4">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Form fields for product details */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="price" className="mb-2 font-semibold">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="border rounded p-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="image" className="mb-2 font-semibold">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="brand" className="mb-2 font-semibold">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="category" className="mb-2 font-semibold">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="countInStock" className="mb-2 font-semibold">
              Count In Stock
            </label>
            <input
              type="number"
              id="countInStock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
              className="border rounded p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="mb-2 font-semibold">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border rounded p-2"
              rows="4"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="modelName" className="mb-2 font-semibold">
              Model Name
            </label>
            <select
              id="modelName"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
              className="border rounded p-2"
            >
              {pixelModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="storage" className="mb-2 font-semibold">
              Storage
            </label>
            <select
              id="storage"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              required
              className="border rounded p-2"
            >
              {storageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="color" className="mb-2 font-semibold">
              Color
            </label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              className="border rounded p-2"
            >
              {colorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="condition" className="mb-2 font-semibold">
              Condition
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              className="border rounded p-2"
            >
              {conditionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="conditionDescription" className="form-label">
              Condition Description
            </label>
            <textarea
              id="conditionDescription"
              rows="3"
              placeholder="Enter condition description"
              value={conditionDescription}
              onChange={(e) => setConditionDescription(e.target.value)}
              className="form-control"
              required
            ></textarea>
          </div>

          {/* Additional fields can be added here */}
          {/* Add more fields as needed */}

          {/* Submit button */}
          <button type="submit" className="btn btn-primary mt-4">
            Update Product
          </button>
        </form>
      )}
    </div>
  );
};
export default ProductEditPage;
