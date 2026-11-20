const BASE_URL = import.meta.env.VITE_API_URL;

function ProductCard({ product }) {

  const imageSrc = product.image?.startsWith("http")
    ? product.image
    : `${BASE_URL}${product.image}`;

  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      {product.image ? (
        <img
          src={imageSrc}
          alt={product.name}
          className="h-48 w-full rounded object-contain"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center rounded bg-gray-200 text-gray-500">
          No Image
        </div>
      )}
      <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-1 font-bold">₹{product.price}</p>
    </div>
  );
}

export default ProductCard;