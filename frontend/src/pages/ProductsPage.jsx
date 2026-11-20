import { useEffect, useState } from "react";
import { useProducts } from "../context/ProductsContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants/categories.js";
import "./ProductPage.css";

const PRODUCTS_PER_PAGE = 8;

function ProductsPage() {

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { products, fetchProducts, loading, error, totalPages, total } =
    useProducts();


  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);


  useEffect(() => {
    fetchProducts({ search, category, sort, page, limit: PRODUCTS_PER_PAGE });
  }, [search, category, sort, page]);

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setSort("");
    setPage(1);
  };

  return (
    <div className="p-6 products-page">
      <p>
        <span className="green-dot">.</span>
        {total} products available.
      </p>

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
            <option value="">Relevance</option>
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

        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="mb-6 w-full rounded border border-gray-300 p-2"
          />

          {loading ? (
            <p className="text-center text-gray-500 p-6 loadinn">
              Loading products...
            </p>
          ) : error ? (
            <p className="text-center text-red-600 p-6">Error: {error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products found</p>
          ) : (
            <>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
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