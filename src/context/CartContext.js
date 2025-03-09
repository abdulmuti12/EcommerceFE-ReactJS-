import { createContext, useContext, useState, useEffect } from "react";
import { getToken } from "../utils/auth";

// Membuat context
const CartContext = createContext();

// Hook custom untuk menggunakan context lebih mudah
export const useCart = () => useContext(CartContext);

// Provider untuk membungkus seluruh aplikasi
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Fungsi untuk mendapatkan jumlah produk di keranjang dari API
  const fetchCartCount = async () => {
    const token = getToken();
    if (!token) return setCartCount(0);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/countBracket", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log(data.data);
        setCartCount(data.data);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      setCartCount(0);
    }
  };

  // Panggil saat pertama kali aplikasi dijalankan
  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
