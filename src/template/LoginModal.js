import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

function LoginModal({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!show) {
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error sebelum submit

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Simpan token dan data user ke localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("id", data.data.id);
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("email", data.data.email);

        alert("Login Berhasil!");
        onClose(); // Tutup modal setelah login sukses
        window.location.reload(); // Refresh halaman setelah login
      } else {
        setError("Invalid credentials"); // Tampilkan pesan error
      }
    } catch (error) {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Sign In</h5>
          <button type="button" className="close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {error && <p className="text-danger text-center">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <span className="input-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary-login">
              Login
            </button>
            <p className="text-center mt-3">
              Don't have an account? <a href="#">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
