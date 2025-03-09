import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // Import useCart
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";


function Header() {
  const { cartCount, fetchCartCount } = useCart(); // Ambil cartCount dan fetchCartCount dari context
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  // const token = localStorage.getItem("token");
  // const username = localStorage.getItem("username");
  const userId = localStorage.getItem("id");

  // console.log("token", userId);
  // if (token && username && userId) {
  //   setUser({ id: userId, username });
  // }

  

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    // const userId = localStorage.getItem("id");
  

    if (token && username) {
      setUser({ username });

      // Panggil fetchCartCount dari context
      fetchCartCount();
    } else {
      setUser(null);
    }
  }, []);

  function toggleDrawer() {
    setOpenedDrawer(!openedDrawer);
  }

  function changeNav() {
    if (openedDrawer) {
      setOpenedDrawer(false);
    }
  }

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const openRegisterModal = () => setShowRegisterModal(true);
  const closeRegisterModal = () => setShowRegisterModal(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setUser(null);
    fetchCartCount(); // Perbarui jumlah barang setelah logout
    window.location.reload();
  };

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-black border-bottom text-white">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={changeNav}>
            <span className="ms-1 h4 fw-bold text-white">Luxury Living Asia</span>
          </Link>

          <div className={"navbar-collapse offcanvas-collapse " + (openedDrawer ? "open" : "")}>
            <ul className="navbar-nav me-auto mb-lg-0">
              <li className="nav-item">
                {/* <Link to="/products" className="nav-link" replace onClick={changeNav}>
                  Explore
                </Link> */}
              </li>
            </ul>

            {/* Keranjang Belanja */}
            {/* <button
              type="button"
              className="btn btn-outline-light me-3 d-none d-lg-inline"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <FontAwesomeIcon icon={["fas", "shopping-cart"]} className="text-white" />
              <span className="ms-3 badge rounded-pill bg-black text-white">{cartCount}</span>
            </button> */}

            <Link to="/checkoutDetail" style={{ textDecoration: "none" }}>
              <button
                type="button"
                className="btn btn-outline-light me-3 d-none d-lg-inline"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                <FontAwesomeIcon icon={["fas", "shopping-cart"]} className="text-white" />
                <span className="ms-3 badge rounded-pill bg-black text-white">{cartCount}</span>
              </button>
            </Link>

            {/* Tampilkan username jika login */}
            {user ? (
              // <ul className="navbar-nav mb-2 mb-lg-0">
              //   <li className="nav-item">
              //     <span className="nav-link">👤 {user.username}</span>
              //   </li>
              //   <li className="nav-item">
              //     <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              //       Logout
              //     </button>
              //   </li>
              // </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a href="!#" className="nav-link dropdown-toggle" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <FontAwesomeIcon icon={["fas", "user-alt"]} /> {user.username}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    {/* <Link to="/" className="dropdown-item" onClick={(e) => { e.preventDefault(); openLoginModal(); }}>
                      profile
                    </Link> */}
                    <Link to={`/profile/${userId}`} className="dropdown-item">
                            Profile
                    </Link>
                    <Link to={`/OrderList`} className="dropdown-item">
                            Transaction
                    </Link>

                  </li>
                  <li>
                    <Link to="/" className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            ) : (
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a href="!#" className="nav-link dropdown-toggle" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={["fas", "user-alt"]} />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link to="/" className="dropdown-item" onClick={(e) => { e.preventDefault(); openLoginModal(); }}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="dropdown-item" onClick={(e) => { e.preventDefault(); openRegisterModal(); }}>
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            )}
          </div>

          <div className="d-inline-block d-lg-none">
            <button type="button" className="btn btn-outline-dark">
              <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
              <span className="ms-3 badge rounded-pill bg-dark">{cartCount}</span>
            </button>
            <button className="navbar-toggler p-0 border-0 ms-3" type="button" onClick={toggleDrawer}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>

      <LoginModal show={showLoginModal} onClose={closeLoginModal} />
      <RegisterModal show={showRegisterModal} onClose={closeRegisterModal} />
    </header>
  );
}

export default Header;
