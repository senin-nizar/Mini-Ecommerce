import { Link } from "react-router-dom";
import "./Navbar.css"

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">
        <Link to="/" className="logo-link">
        <h1 className="text-xl font-bold">Min!KADA.</h1>
      </Link>
        
      
      <div className="flex gap-6">
        <Link to="/products" className="hover:text-blue-400">
          Products
        </Link>
        <Link to="/add-product" className="hover:text-blue-400">
          Add Product
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;