import { createContext, useContext, useState } from "react";
const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5000/products";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData, // a FormData object: no headers, no JSON.stringify
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add product");
    }
    await fetchProducts(); // auto refresh after adding a new product
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, fetchProducts, addProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
