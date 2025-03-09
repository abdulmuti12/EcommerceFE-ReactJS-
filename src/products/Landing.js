import React, { useEffect, useState } from "react";
import Banner from "../landing/Banner";
import FeatureProduct from "./FeatureProduct";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import "./Landing.css"; // Tambahkan file CSS untuk animasi

function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  
  // State untuk pencarian
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    let url = `http://127.0.0.1:8000/api/products?page=${currentPage}`;
    if (category) url += `&category=${category}`;
    if (name) url += `&name=${name}`;
    if (priceRange) url += `&price=${priceRange}`;

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
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, category, name, priceRange]);

  return (
    <>
      <ScrollToTopOnMount />
      <Banner />

      {/* Form Pencarian */}
      <div className="container filter-container shadow-sm p-4 rounded">
        <h5 className="text-center mb-3"><FontAwesomeIcon icon={faFilter} /> Filter Pencarian</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="input-group">
              {/* <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
              <input 
                type="text" 
                className="search-btn" 
                placeholder="Cari Nama Produk" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              /> */}
                <input
    type="text"
    className="form-control"
    placeholder="Cari Nama Produk"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
  <button className="search-btn" onClick={fetchProducts}>
    <FontAwesomeIcon icon={["fas", "search"]} />
  </button>

            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Pilih Kategori</option>
              <option value="Furniture">Furniture (Perabotan)</option>
              <option value="Dekorasi">Dekorasi</option>
              <option value="Lighting">Penerangan (Lighting)</option>
              <option value="KamarMandi">Peralatan Kamar Mandi</option>
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
              <option value="">Urutkan Harga</option>
              <option value="low">Terendah</option>
              <option value="high">Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      <h2 className="text-muted text-center mt-4 mb-3">New Collections</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
          {loading ? (
            <div className="text-center mt-4">Loading...</div>
          ) : error ? (
            <div className="text-center text-danger">Error: {error}</div>
          ) : products.length > 0 ? (
            products.map((product) => <FeatureProduct key={product.id} product={product} />)
          ) : (
            <div className="text-center">No products available</div>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-4">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={!prevPageUrl} className="btn btn-outline-primary me-2">
            Previous
          </button>
          <span className="mx-3">Page {currentPage} of {lastPage}</span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={!nextPageUrl} className="btn btn-outline-primary ms-2">
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Landing;
