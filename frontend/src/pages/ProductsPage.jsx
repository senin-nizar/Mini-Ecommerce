import { useEffect, useState } from "react";
import { useProducts } from "../context/ProductsContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants/categories.js";

const PRODUCTS_PER_PAGE = 8;

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1); // reset page to 1 when search, category, or sort changes

  const { products, fetchProducts, loading, error } = useProducts();
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
    return (
      <p className="text-center text-gray-500 p-6">No products available.</p>
    );
  }

  let visibleProducts = products;

  if (search.trim()) {
    visibleProducts = visibleProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (category) {
    visibleProducts = visibleProducts.filter(
      (product) => product.category === category,
    );
  }
  if (sort) {
    visibleProducts = [...visibleProducts].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });
  }

  const totalPages = Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE);
  const start = (page - 1) * PRODUCTS_PER_PAGE; // starting index for the current page: 0, then 8, then 16...
  const pageProducts = visibleProducts.slice(start, start + PRODUCTS_PER_PAGE); // products for the current page

  // Put every control back to its starting value
  const handleReset = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setPage(1);
  };

  return (
    <div className="p-6">
      <p>{products.length} products available.</p>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          to="/add-product"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Product
        </Link>
      </div>

      
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full shrink-0 self-start rounded-lg border bg-white p-4 md:w-64">
          <h2 className="mb-4 text-lg font-semibold">Filters & Sorting</h2>

          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="mb-4 w-full rounded border border-gray-300 p-2"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label className="mb-1 block text-sm font-medium">Sort</label>
          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="mb-4 w-full rounded border border-gray-300 p-2"
          >
            <option value="">Relevant</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>

          <button
            onClick={handleReset}
            className="w-full rounded bg-yellow-500 py-2 font-semibold hover:bg-yellow-600"
          >
            Reset
          </button>
        </aside>

        {/* RIGHT: search, then the grid and the page buttons */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="mb-6 w-full rounded border border-gray-300 p-2"
          />

          {visibleProducts.length === 0 ? (
            <p className="text-gray-600">No products match your search</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {pageProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="rounded border px-4 py-2 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="rounded border px-4 py-2 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;