import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Product = ({ product }) => {
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

   const getConditionLabel = (condition) => {
    switch(condition) {
      case 'A': return 'Excellent';
      case 'B': return 'Good';
      case 'C': return 'Fair';
      default: return condition;
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain p-4"
        />
      </Link>

      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product._id}`} className="block flex-grow">
          <h2 className="text-lg font-medium mb-2">{product.name}</h2>
        </Link>

         {/* Add condition badge */}
        <div className="mb-2">
          <span className={`text-xs font-semibold inline-block py-1 px-2 rounded ${
            product.condition === 'A' ? 'bg-green-200 text-green-800' :
            product.condition === 'B' ? 'bg-blue-200 text-blue-800' :
            'bg-yellow-200 text-yellow-800'
          }`}>
            {getConditionLabel(product.condition)}
          </span>
        </div>

        <div className="mb-2">
          <Rating
            value={product.rating}
            text={`${product.numReviews} ${
              product.numReviews === 1 ? 'review' : 'reviews'
            }`}
          />
        </div>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold">£{product.price.toFixed(2)}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;