import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";

function RegisterModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState(""); // Untuk menampilkan pesan notifikasi
  const [isSuccess, setIsSuccess] = useState(false); // Untuk menentukan jenis notifikasi (sukses/gagal)

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Kirim data form sebagai JSON
      });

      const result = await response.json();

      if (result.success) {
        // Jika registrasi berhasil
        setIsSuccess(true);
        setMessage(result.message);
        // Reset form
        setFormData({
          name: "",
          username: "",
          email: "",
          phone_number: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        // Jika registrasi gagal
        setIsSuccess(false);
        setMessage(result.message || "Registration failed");
      }
    } catch (error) {
      // Tangani error jaringan atau server
      setIsSuccess(false);
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Register</h5>
          <button type="button" className="close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {/* Notifikasi */}
          {message && (
            <div className={`alert ${isSuccess ? "alert-success" : "alert-danger"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="input-group mb-3">
              <span className="input-icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Username Field */}
            <div className="input-group mb-3">
              <span className="input-icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email Field */}
            <div className="input-group mb-3">
              <span className="input-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Phone Number Field */}
            <div className="input-group mb-3">
              <span className="input-icon">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <input
                type="tel"
                name="phone_number"
                className="form-control"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="input-group mb-3">
              <span className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Confirmation Field */}
            <div className="input-group mb-3">
              <span className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                name="password_confirmation"
                className="form-control"
                placeholder="Confirm your password"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            <p className="text-center mt-3">
              Already have an account? <a href="#">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;