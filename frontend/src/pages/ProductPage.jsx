import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  FaArrowLeft,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShieldAlt,
  FaLock,
  FaUserSecret,
} from "react-icons/fa";
import {
  listProductDetails,
  createProductReview,
} from "../redux/actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../redux/constants/productConstants";
import Loader from "../components/ui/Loader";
import Message from "../components/ui/Message";

const ProductPage = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, error: errorProductReview } =
    productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    dispatch(listProductDetails(id));
  }, [dispatch, id, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(id, {
        rating,
        comment,
      })
    );
  };

  // Rating component
  const Rating = ({ value, text }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((rate) => (
          <span key={rate}>
            {value >= rate ? (
              <FaStar className="text-yellow-500" />
            ) : value >= rate - 0.5 ? (
              <FaStarHalfAlt className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-yellow-500" />
            )}
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">{text && text}</span>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {loading
            ? "Loading Product... | GrapheneOS Store"
            : `${product.name} | GrapheneOS Store`}
        </title>
      </Helmet>

      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline flex items-center w-fit"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-contain"
                style={{ maxHeight: "400px" }}
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

              <div className="mb-4">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} ${
                    product.numReviews === 1 ? "review" : "reviews"
                  }`}
                />
              </div>

              <div className="text-2xl font-bold mb-4">
                £{product.price.toFixed(2)}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Phone Specifications
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{product.modelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium">{product.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{product.color}</span>
                  </div>
                  {/* Add condition information */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span
                      className={`font-medium ${
                        product.condition === "A"
                          ? "text-green-600"
                          : product.condition === "B"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {product.condition === "A"
                        ? "Excellent (A)"
                        : product.condition === "B"
                        ? "Good (B)"
                        : "Fair (C)"}
                    </span>
                  </div>

                  {/* Add detailed condition description */}
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <p>{product.conditionDescription}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${
                        product.countInStock > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* GrapheneOS Features */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  GrapheneOS Features
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <FaUserSecret className="mt-1 mr-2 text-primary" />
                    <span>Enhanced privacy protection</span>
                  </li>
                  <li className="flex items-start">
                    <FaShieldAlt className="mt-1 mr-2 text-primary" />
                    <span>Security hardening</span>
                  </li>
                  <li className="flex items-start">
                    <FaLock className="mt-1 mr-2 text-primary" />
                    <span>No Google services pre-installed</span>
                  </li>
                </ul>
              </div>

              {/* Add to Cart */}
              {product.countInStock > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <div className="flex justify-between mb-4">
                    <span>Quantity:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="form-control w-1/2"
                    >
                      {[...Array(Math.min(product.countInStock, 5)).keys()].map(
                        (x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <button
                    onClick={addToCartHandler}
                    className="btn btn-primary w-full"
                    disabled={product.countInStock === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          {/* Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Reviews</h2>
              {product.reviews.length === 0 ? (
                <Message>No reviews yet</Message>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between mb-2">
                        <strong>{review.name}</strong>
                        <Rating value={review.rating} />
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review */}
            <div>
              <h2 className="text-xl font-bold mb-4">Write a Review</h2>
              {errorProductReview && (
                <Message variant="danger">{errorProductReview}</Message>
              )}
              {userInfo ? (
                <form
                  onSubmit={submitHandler}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="mb-4">
                    <label className="form-label">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="form-control"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Comment</label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="form-control"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit Review
                  </button>
                </form>
              ) : (
                <Message>
                  Please{" "}
                  <a href="/login" className="text-primary font-medium">
                    sign in
                  </a>{" "}
                  to write a review
                </Message>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductPage;
