

import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import FeatureProduct from "./FeatureProduct";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Landing() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [lastPage, setLastPage] = useState(1);

  // Fungsi untuk mengambil data produk dari API
  const fetchProducts = (url) => {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.data);
          setNextPageUrl(data.data.next_page_url);
          setPrevPageUrl(data.data.prev_page_url);
          setCurrentPage(data.data.current_page);
          setLastPage(data.data.last_page);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  // Ambil data saat komponen di-mount atau halaman berubah
  useEffect(() => {
    fetchProducts(`http://127.0.0.1:8000/api/products?page=${currentPage}`);
  }, [currentPage]);

  // Fungsi untuk navigasi ke halaman berikutnya
    const goToNextPage = () => {
      if (nextPageUrl) {
        setCurrentPage(currentPage + 1);
      }
    };

    // Fungsi untuk navigasi ke halaman sebelumnya
    const goToPrevPage = () => {
      if (prevPageUrl) {
        setCurrentPage(currentPage - 1);
      }
    };

    if (loading) {
      return <div className="text-center mt-4">Loading...</div>;
    }

    if (error) {
      return <div className="text-center mt-4 text-danger">Error: {error}</div>;
    }

  return (
    <>
      <ScrollToTopOnMount />
      <Banner />
      {/* <div className="d-flex flex-column bg-white py-4">
        <p className="text-center px-5">
          "Experience timeless elegance and unparalleled luxury. Elevate your
          lifestyle with sophistication, crafted for those who appreciate the
          finest in life"
        </p>
        <div className="d-flex justify-content-center">
          <Link to="/products" className="btn btn-primary" replace>
            Browse products
          </Link>
        </div>
      </div> */}
      <h2 className="text-muted text-center mt-4 mb-3">New Collections</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
          {products.length > 0 ? (
            products.map((product) => (
              <FeatureProduct key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center">No products available</div>
          )}
        </div>
        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <button
            onClick={goToPrevPage}
            disabled={!prevPageUrl}
            className="btn btn-outline-primary me-2"
          >
            Previous
          </button>
          <span className="mx-3">
            Page {currentPage} of {lastPage}
          </span>
          <button
            onClick={goToNextPage}
            disabled={!nextPageUrl}
            className="btn btn-outline-primary ms-2"
          >
            Next
          </button>
        </div>
      </div>
      <div className="d-flex flex-column bg-white py-4">
        <h5 className="text-center mb-3">Follow us on</h5>
        <div className="d-flex justify-content-center">
          <a href="!#" className="me-3">
            <FontAwesomeIcon icon={["fab", "facebook"]} size="2x" />
          </a>
          <a href="!#">
            <FontAwesomeIcon icon={["fab", "instagram"]} size="2x" />
          </a>
          <a href="!#" className="ms-3">
            <FontAwesomeIcon icon={["fab", "twitter"]} size="2x" />
          </a>
        </div>
      </div>
    </>
  );
}

export default Landing;