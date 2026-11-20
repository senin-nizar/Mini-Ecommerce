import { createContext, useContext, useState } from "react";

const ProductsContext = createContext();


const API_URL = `${import.meta.env.VITE_API_URL}/products`;

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value != null) {
          query.append(key, value);
        }
      });

      const response = await fetch(`${API_URL}?${query}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (formData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add product");
    }

   
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        totalPages,
        total,
        loading,
        error,
        fetchProducts,
        addProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}