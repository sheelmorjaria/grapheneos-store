import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { listProducts } from "../redux/actions/productActions";
import Product from "../components/Product";
import Loader from "../components/ui/Loader";
import Message from "../components/ui/Message";

const HomePage = () => {
   const { keyword = "", pageNumber = 1 } = useParams();
  const [conditionFilter, setConditionFilter] = useState("all");
  
  const dispatch = useDispatch();
  
  const productList = useSelector((state) => state.productList);
  const { loading, error, products = [], page, pages } = productList;
  
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);
  
  // Add this for debugging
  useEffect(() => {
    console.log("Product list state:", { loading, error, products, page, pages });
    console.log("Condition filter:", conditionFilter);
  }, [loading, error, products, page, pages, conditionFilter]);
  
  // Calculate filtered products - moved inside the return to ensure products exists
  const getFilteredProducts = () => {
    if (!products) return [];
    
    return conditionFilter === "all"
      ? products
      : products.filter(product => product.condition === conditionFilter);
  };

  return (
    <>
      <Helmet>
        <title>GrapheneOS Store | Privacy-Focused Pixel Phones</title>
        <meta
          name="description"
          content="Buy Google Pixel phones with GrapheneOS pre-installed. Enhanced privacy and security without Google services."
        />
      </Helmet>

      {/* Hero Section */}
      {!keyword && pageNumber == 1 && (
        <div className="bg-graphene text-white py-12 px-4 mb-8 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              GrapheneOS Flashed Pixel Phones
            </h1>
            <p className="text-lg mb-6">
              Experience true privacy and security with GrapheneOS, the private
              and secure mobile OS with Android app compatibility.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/about" className="btn btn-primary">
                Learn About GrapheneOS
              </Link>
              <a
                href="#products"
                className="btn btn-outline text-white border-white hover:bg-white hover:text-graphene"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div id="products">
        {keyword && (
          <div className="mb-4">
            <Link to="/" className="btn btn-outline flex items-center w-fit">
              <FaArrowLeft className="mr-2" /> Back to All Products
            </Link>
            <h2 className="text-xl font-bold mt-4">
              Search Results for "{keyword}"
            </h2>
          </div>
        )}
        
        {/* Condition Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Filter by Condition</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setConditionFilter("all")}
              className={`px-3 py-1 rounded ${
                conditionFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setConditionFilter("A")}
              className={`px-3 py-1 rounded ${
                conditionFilter === "A"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 hover:bg-green-200 text-green-800"
              }`}
            >
              Excellent (A)
            </button>
            <button
              onClick={() => setConditionFilter("B")}
              className={`px-3 py-1 rounded ${
                conditionFilter === "B"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-800"
              }`}
            >
              Good (B)
            </button>
            <button
              onClick={() => setConditionFilter("C")}
              className={`px-3 py-1 rounded ${
                conditionFilter === "C"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
              }`}
            >
              Fair (C)
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            {products.length === 0 ? (
              <Message>No products found</Message>
            ) : (
              <>
                {/* Use getFilteredProducts() function to ensure we have a valid array */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getFilteredProducts().map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
                
                {/* Only show pagination when not filtering or when showing all */}
                {pages > 1 && conditionFilter === "all" && (
                  <div className="flex justify-center mt-8">
                    <ul className="flex items-center">
                      {[...Array(pages).keys()].map((x) => (
                        <li key={x + 1}>
                          <Link
                            to={
                              keyword
                                ? `/search/${keyword}/page/${x + 1}`
                                : `/page/${x + 1}`
                            }
                            className={`px-4 py-2 mx-1 rounded ${
                              x + 1 === parseInt(pageNumber)
                                ? "bg-primary text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            {x + 1}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;