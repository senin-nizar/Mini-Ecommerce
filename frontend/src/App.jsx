import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import AddProductPage from "./pages/AddProductPage";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <>
      <Navbar />
        <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/add-product" element={<AddProductPage />} />

      </Routes>
    </>
  );
}

export default App;