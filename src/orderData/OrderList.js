import { useState, useEffect } from "react";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async (page = 1, status = "") => {
    setLoading(true);
    const token = localStorage.getItem("token");
    let url = `http://127.0.0.1:8000/api/orders?page=${page}`;
    if (status) url += `&status=${status}`;
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.data);
        setCurrentPage(data.data.current_page);
        setTotalPages(data.data.last_page);
      } else {
        setError(data.message || "Gagal mengambil data.");
      }
    } catch (err) {
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  return (
    <div className="container mt-5 p-4 bg-white shadow rounded-3">
      <h2 className="text-center mb-4 text-primary">Order List</h2>

      <div className="mb-3 d-flex justify-content-center">
        <label className="me-2 fw-bold">Status Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select w-auto"
        >
          <option value="">All</option>
          <option value="done">Done</option>
          <option value="proses">Proses</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading && <p className="text-center text-info">Loading...</p>}
      {error && <p className="text-danger text-center fw-bold">{error}</p>}
      
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Order Code</th>
                <th>Total</th>
                <th>Total Item</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.trx_order_code} className="fw-bold">
                  <td>{order.trx_order_code}</td>
                  <td>{order.total}</td>
                  <td>{order.total_item}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 fs-6 ${
                        order.status === "done"
                          ? "bg-success"
                          : order.status === "proses"
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-primary px-4"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="fw-bold fs-5">Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-outline-primary px-4"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OrderList;