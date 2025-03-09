import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Gunakan useHistory
import { Spinner, Alert } from "react-bootstrap"; // Import Spinner dan Alert

function CheckoutDetail() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionMessage, setTransactionMessage] = useState(null);
  const history = useHistory(); // Gunakan useHistory untuk navigasi

  useEffect(() => {
    handleCheckout();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token) {
        history.push("/"); // Redirect ke landing jika token tidak ada
        return;
    }
    const requestData = {
      status: "pending",
      user_id: userId,
      trx_order_code: "ORD",
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/checkoutDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const rawResponse = await response.text();
      console.log("Raw Response:", rawResponse);

      if (rawResponse.startsWith("<!DOCTYPE html>")) {
        throw new Error("Server mengembalikan halaman HTML. Mungkin token tidak valid atau endpoint salah.");
      }

      const data = JSON.parse(rawResponse);

      if (data.success) {
        setCheckoutData(data.data);
      } else {
        setError(data.message || "Gagal memproses checkout.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!checkoutData) return;

    setLoading(true);
    setTransactionMessage(null);
    setError(null);

    const token = localStorage.getItem("token");

    // Ambil product_id dari checkoutData
    const transactionData = checkoutData[0].detail.map((item) => ({
      product_id: item.product_id,
    }));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/transactionProcess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const data = await response.json();
      console.log("Transaction Response:", data);

      if (data.success) {
          setTransactionMessage(`✅ ${data.message}`);
          setTimeout(() => {
              history.push("/checkout-success"); // Redirect jika transaksi sukses
            }, 50000);
            window.location.reload(); // Refresh halaman setelah login
      } else {
        setError(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Terjadi kesalahan saat memproses transaksi.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Processing checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Checkout Details</h2>

        {transactionMessage && (
          <Alert variant="success" className="text-center">
            {transactionMessage}
          </Alert>
        )}

        {checkoutData ? (
          <div>
            <h4 className="text-primary">Total Payment: Rp {checkoutData[0].total_payment.toLocaleString("id-ID")}</h4>

            <div className="table-responsive mt-3">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {checkoutData[0].detail.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>Rp {parseFloat(item.price).toLocaleString("id-ID")}</td>
                      <td>Rp {item.total.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="btn btn-success mt-3 w-100"
              onClick={handleProceedToPayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        ) : (
          <p className="text-center text-muted">No checkout data available.</p>
        )}
      </div>
    </div>
  );
}

export default CheckoutDetail;
