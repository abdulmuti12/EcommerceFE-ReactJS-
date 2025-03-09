import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(false);

  // Pindahkan fetchUser ke luar useEffect
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Response API:", data); // Debugging

      if (data.success) {
        setUser(data.data);
        setSubscription(data.data.subscription == 1); // Gunakan == agar bisa menangani "1" dan 1
      } else {
        setError(data.message || "Gagal mengambil data.");
      }
    } catch (err) {
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubscriptionToggle = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/updateSubscribe/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        console.log("Updated subscription:", data.data.subscription); // Debugging
        setSubscription(data.data.subscription == 1); // Pastikan "1" dan 1 bisa terbaca
        fetchUser(); // Panggil ulang fetchUser untuk update state
      } else {
        alert("Failed to update subscription.");
      }
    } catch (error) {
      alert("Terjadi kesalahan. Coba lagi.");
    }
  };

  if (loading) {
    return <div className="container mt-5 py-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mt-5 py-4 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded mb-4">
        <ol className="breadcrumb p-3">
          <li className="breadcrumb-item">
            <Link className="text-decoration-none link-secondary" to="/profiles">
              Profiles
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {user.name}
          </li>
        </ol>
      </nav>

      <div className="row mb-4">
        <div className="col-lg-6">
          <h2 className="mb-1">{user.name}</h2>
          <h5 className="text-muted">@{user.username}</h5>
        </div>
        <div className="col-lg-5">
          <h4 className="mb-0 mt-4">Details</h4>
          <hr />
          <dl className="row">
            <dt className="col-sm-4">Name</dt>
            <dd className="col-sm-8">{user.name}</dd>
            <dt className="col-sm-4">Username</dt>
            <dd className="col-sm-8">{user.username}</dd>
            <dt className="col-sm-4">Email</dt>
            <dd className="col-sm-8">{user.email}</dd>
            <dt className="col-sm-4">Phone Number</dt>
            <dd className="col-sm-8">{user.phone_number}</dd>
            <dt className="col-sm-4">Status</dt>
            <dd className="col-sm-8">
              <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                {user.status}
              </span>
            </dd>
            <dt className="col-sm-4">Subscription</dt>
            <dd className="col-sm-8">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={subscription} 
                  onChange={handleSubscriptionToggle} 
                />
                <span className="slider round"></span>
              </label>
            </dd>
            <dt className="col-sm-4">Joined At</dt>
            <dd className="col-sm-8">{new Date(user.created_at).toLocaleDateString("id-ID")}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default Profile;
