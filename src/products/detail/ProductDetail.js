import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Ratings from "react-ratings-declarative";
import { Link } from "react-router-dom";
import ScrollToTopOnMount from "../../template/ScrollToTopOnMount";
import LoginModal from "../../template/LoginModal";
import { checkAuth, getToken } from "../../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom"; // Gunakan useHistory
import { useCart } from "../../context/CartContext"; // Import useCart

function ProductDetail() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCartCount } = useCart(); // Gunakan fetchCartCount dari context
  const history = useHistory(); // Gunakan useHistory untuk navigasi

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="container mt-5 py-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5 py-4 text-danger">{error}</div>;
  }

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError("Token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/ordersProceess", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ product_id: product.id, qty: 1 }]),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("🛒 Added to cart successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        fetchCartCount(); // Update jumlah item di keranjang
      } else {
        setError(data.message || "Failed to add product.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const handleAddToCartBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError("Token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/ordersProceess", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ product_id: product.id, qty: 1 }]),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("🛒 Added to cart successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        fetchCartCount(); // Update jumlah item di keranjang
        history.push("/checkoutDetail");

      } else {
        setError(data.message || "Failed to add product.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="container mt-5 py-4 px-xl-5">
        <ScrollToTopOnMount />
        <nav aria-label="breadcrumb" className="bg-custom-light rounded mb-4">
          <ol className="breadcrumb p-3">
            <li className="breadcrumb-item">
              <Link className="text-decoration-none link-secondary" to="/">
                All Products
              </Link>
            </li>
            <li className="breadcrumb-item">{product.category}</li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
        <div className="row mb-4">
          <div className="col-lg-6">
            <img
              className="border rounded ratio ratio-1x1"
              alt={product.name}
              src={`http://127.0.0.1:8000/storage/${product.image}`}
            />
          </div>
          <div className="col-lg-5">
            <h2 className="mb-1">{product.name}</h2>
            <h4 className="text-muted mb-4">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price)}
            </h4>

            {checkAuth() ? (
              <button className="btn btn-outline-dark py-2 w-100" onClick={handleAddToCart} disabled={loading}>
                {loading ? "Adding..." : (
                  <>
                    <FontAwesomeIcon icon={["fas", "cart-plus"]} /> Add to cart
                  </>
                )}
              </button>
            ) : (
              <button
                className="btn btn-outline-dark py-2 w-100"
                onClick={(e) => {
                  e.preventDefault();
                  openLoginModal();
                }}
              >
                <FontAwesomeIcon icon={["fas", "cart-plus"]} /> Add to cart
              </button>
            )}

            {checkAuth() ? (
              <button className="btn btn-dark py-2 w-100 mt-2" onClick={handleAddToCartBuy}>Buy now</button>

            ) : (
              <button className="btn btn-dark py-2 w-100 mt-2" onClick={(e) => {
                e.preventDefault();
                openLoginModal();
              }}>Buy now</button>

            )}

            <h4 className="mb-0 mt-4">Details</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-4">Category</dt>
              <dd className="col-sm-8">{product.category}</dd>
            </dl>

            <h4 className="mb-0">Description</h4>
            <hr />
            <p className="lead flex-shrink-0">
              <small>{product.description}</small>
            </p>
          </div>
        </div>
      </div>

      <LoginModal show={showLoginModal} onClose={closeLoginModal} />
      <ToastContainer />
    </>
  );
}

export default ProductDetail;

