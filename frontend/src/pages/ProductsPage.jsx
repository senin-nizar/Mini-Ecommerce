import { useEffect } from "react";
import {useProducts} from "../context/ProductsContext.jsx";

function ProductsPage() {    
    const { products,  fetchProducts , loading, error } = useProducts();
    useEffect(() => {
        fetchProducts();
    }, []);
  
    if (loading) {
        return <p className="text-center text-gray-500 p-6">Loading products...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600 p-6">Error: {error}</p>;
    }

    if (products.length === 0) {
        return <p className="text-center text-gray-500 p-6">No products available.</p>;
    }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Products Page</h1>
      <p>{products.length} products available.</p>
    </div>
  );
}

export default ProductsPage;