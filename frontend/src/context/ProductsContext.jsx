import { createContext,useContext,useState } from "react";
const ProductsContext = createContext();

export function ProductsProvider ({ children }){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
``
    const fetchProducts = async () => {
        console.log('fetcHProducts called');   
    };

    const addProduct = async (product) => {
        console.log('addProduct called', product);
    }

  return (
   <ProductsContext.Provider value={{ products, loading, error, fetchProducts, addProduct }}>
        {children}
        </ProductsContext.Provider>
  );
}

export function useProducts() {
    return useContext(ProductsContext);
}