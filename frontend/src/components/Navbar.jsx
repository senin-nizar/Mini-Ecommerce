import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">
      <h1 className="text-xl font-bold">Mini Store</h1>
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