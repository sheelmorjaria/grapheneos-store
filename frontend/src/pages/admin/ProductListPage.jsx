import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaTrash, FaPlus, FaBox } from "react-icons/fa";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../../redux/actions/productActions";
import { PRODUCT_CREATE_RESET } from "../../redux/constants/productConstants";
import Loader from "../../components/ui/Loader";
import Message from "../../components/ui/Message";

const ProductListPage = () => {
  const { pageNumber = 1 } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    // Component JSX for product management table
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Product List | GrapheneOS Store</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-primary mb-4"
            onClick={createProductHandler}
          >
            <FaPlus className="mr-2" /> Create Product
          </button>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">NAME</th>
                <th className="px-4 py-2 border-b">PRICE</th>
                <th className="px-4 py-2 border-b">CATEGORY</th>
                <th className="px-4 py-2 border-b">BRAND</th>
                <th className="px-4 py-2 border-b">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-2 border-b">{product._id}</td>
                  <td className="px-4 py-2 border-b">{product.name}</td>
                  <td className="px-4 py-2 border-b">${product.price}</td>
                  <td className="px-4 py-2 border-b">{product.category}</td>
                  <td className="px-4 py-2 border-b">{product.brand}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      type="button"
                      className="btn btn-secondary mr-2"
                      onClick={() =>
                        navigate(`/admin/product/${product._id}/edit`)
                      }
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <div>
              Page {page} of {pages}
            </div>
            <div>
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => navigate(`/admin/productlist/page/${x + 1}`)}
                  className={`px-4 py-2 mx-1 rounded ${
                    x + 1 === page
                      ? "bg-primary text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default ProductListPage;
