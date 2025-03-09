import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { checkAuth, getToken } from "../utils/auth";
import LoginModal from "../template/LoginModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../context/CartContext"; // Import useCart

function FeatureProduct({ product }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchCartCount } = useCart(); // Gunakan fetchCartCount dari context

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  if (!product) {
    return null;
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
          "Authorization": `Bearer ${token}`,
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

        fetchCartCount(); // Panggil ulang fetchCartCount agar jumlah di keranjang terupdate
      } else {
        setError(data.message || "Failed to add product.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="col">
      <div className="card shadow-sm">
        <img
          className="card-img-top bg-dark cover"
          height="240"
          alt={product.name}
          src={`http://127.0.0.1:8000/storage/${product.image}`}
        />
        <div className="card-body">
          <h5 className="card-title text-center">{product.name}</h5>
          <p className="card-text text-center text-muted">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.price)}
          </p>
          <p className="card-text text-center ">Stock: {product.stock}</p>
          <div className="d-grid gap-1">
            <Link to={`/products/${product.id}`} className="btn btn-outline-dark" replace>
              Detail
            </Link>

            {checkAuth() ? (
              <button className="btn btn-outline-dark mt-3" onClick={handleAddToCart} disabled={loading}>
                {loading ? "Adding..." : (
                  <>
                    <FontAwesomeIcon icon={["fas", "cart-plus"]} /> Add to cart
                  </>
                )}
              </button>
            ) : (
              <button
                className="btn btn-outline-dark mt-3"
                onClick={(e) => {
                  e.preventDefault();
                  openLoginModal();
                }}
              >
                <FontAwesomeIcon icon={["fas", "cart-plus"]} /> Add to cart
              </button>
            )}

            {error && <p className="text-danger mt-2 text-center">{error}</p>}
          </div>
        </div>
      </div>

      <LoginModal show={showLoginModal} onClose={closeLoginModal} />

      <ToastContainer />
    </div>
  );
}

export default FeatureProduct;
